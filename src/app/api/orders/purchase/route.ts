import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";

const purchaseSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  couponCode: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Vui lòng đăng nhập để mua sản phẩm" }, { status: 401 });
    }

    const body = await req.json();
    const validated = purchaseSchema.safeParse(body);
    if (!validated.success) {
      const msg = validated.error.issues?.[0]?.message || "Thông tin mua hàng không hợp lệ";
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    const { productId, couponCode } = validated.data;

    // Fetch product
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { files: true },
    });

    if (!product || product.status !== "PUBLISHED") {
      return NextResponse.json({ error: "Sản phẩm không tồn tại hoặc đã ngừng bán." }, { status: 404 });
    }

    // Check if user already owns the product
    const existingOrder = await prisma.orderItem.findFirst({
      where: {
        productId,
        order: {
          userId: session.id,
          status: "COMPLETED",
        },
      },
    });

    if (existingOrder) {
      return NextResponse.json({
        error: "Bạn đã sở hữu sản phẩm này. Hãy vào mục Thư viện (My Library) để tải về.",
        alreadyOwned: true,
      }, { status: 400 });
    }

    // Free products can be claimed directly without wallet deduction
    if (product.isFree || product.price === 0) {
      const freeOrder = await prisma.$transaction(async (tx) => {
        const orderNum = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;
        const order = await tx.order.create({
          data: {
            orderNumber: orderNum,
            userId: session.id,
            subtotal: 0,
            discountAmount: 0,
            totalAmount: 0,
            status: "COMPLETED",
            paymentMethod: "FREE_CLAIM",
            items: {
              create: {
                productId: product.id,
                price: 0,
                licenseType: "STANDARD",
              },
            },
          },
        });

        await tx.product.update({
          where: { id: product.id },
          data: { salesCount: { increment: 1 } },
        });

        await tx.notification.create({
          data: {
            userId: session.id,
            title: "Nhận sản phẩm miễn phí thành công!",
            message: `Sản phẩm '${product.title}' đã được thêm vào Thư viện của bạn.`,
            type: "SUCCESS",
            link: "/dashboard/library",
          },
        });

        return order;
      });

      return NextResponse.json({
        success: true,
        message: "Nhận sản phẩm miễn phí thành công!",
        orderNumber: freeOrder.orderNumber,
      });
    }

    // Calculate price & discounts
    let subtotal = product.price;
    let discountAmount = 0;
    let coupon: any = null;

    if (couponCode) {
      coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.toUpperCase() },
      });

      if (!coupon || !coupon.isActive || coupon.expiresAt < new Date()) {
        return NextResponse.json({ error: "Mã giảm giá không hợp lệ hoặc đã hết hạn." }, { status: 400 });
      }

      if (subtotal < coupon.minOrderValue) {
        return NextResponse.json({
          error: `Đơn hàng tối thiểu phải từ ${coupon.minOrderValue.toLocaleString("vi-VN")}đ để dùng mã này.`,
        }, { status: 400 });
      }

      if (coupon.discountType === "PERCENTAGE") {
        discountAmount = Math.round((subtotal * coupon.discountValue) / 100);
      } else {
        discountAmount = Math.min(subtotal, coupon.discountValue);
      }
    }

    const finalPrice = Math.max(0, subtotal - discountAmount);

    // Atomic Purchase DB Transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Fetch user wallet with fresh balance
      const wallet = await tx.wallet.findUnique({
        where: { userId: session.id },
      });

      if (!wallet || wallet.balance < finalPrice) {
        throw new Error(
          `Số dư ví không đủ (Hiện tại: ${(wallet?.balance || 0).toLocaleString("vi-VN")}đ, Cần: ${finalPrice.toLocaleString("vi-VN")}đ). Vui lòng nạp thêm tiền vào ví!`
        );
      }

      const balanceBefore = wallet.balance;
      const balanceAfter = balanceBefore - finalPrice;

      // 2. Deduct wallet
      await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: balanceAfter,
          totalSpent: wallet.totalSpent + finalPrice,
        },
      });

      // 3. Create Order
      const orderNumber = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId: session.id,
          subtotal,
          discountAmount,
          totalAmount: finalPrice,
          status: "COMPLETED",
          paymentMethod: "WALLET",
          couponCode: coupon?.code || null,
          items: {
            create: {
              productId: product.id,
              price: finalPrice,
              licenseType: "STANDARD",
            },
          },
        },
      });

      // 4. Coupon Usage
      if (coupon) {
        await tx.couponUsage.create({
          data: {
            couponId: coupon.id,
            orderId: order.id,
            userId: session.id,
            discountApplied: discountAmount,
          },
        });
        await tx.coupon.update({
          where: { id: coupon.id },
          data: { usedCount: { increment: 1 } },
        });
      }

      // 5. Record Wallet Transaction
      await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: "PURCHASE",
          amount: -finalPrice,
          balanceBefore,
          balanceAfter,
          referenceId: orderNumber,
          description: `Mua sản phẩm: ${product.title}`,
          status: "COMPLETED",
        },
      });

      // 6. Increment product sales
      await tx.product.update({
        where: { id: product.id },
        data: { salesCount: { increment: 1 } },
      });

      // 7. Notification
      await tx.notification.create({
        data: {
          userId: session.id,
          title: "Mua hàng thành công! 🛒",
          message: `Bạn đã mua thành công '${product.title}'. Tải sản phẩm ngay trong Thư viện của bạn.`,
          type: "ORDER",
          link: "/dashboard/library",
        },
      });

      return {
        order,
        balanceAfter,
      };
    });

    return NextResponse.json({
      success: true,
      message: "Giao dịch thành công! Sản phẩm đã được thêm vào Thư viện của bạn.",
      orderNumber: result.order.orderNumber,
      newBalance: result.balanceAfter,
    });
  } catch (error: any) {
    console.error("Purchase error:", error);
    return NextResponse.json({ error: error.message || "Lỗi xử lý đơn hàng" }, { status: 400 });
  }
}
