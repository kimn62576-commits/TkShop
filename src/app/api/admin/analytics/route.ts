import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    // 1. KPI Counts
    const [totalUsers, totalProducts, totalOrders, pendingDeposits] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.order.count(),
      prisma.deposit.count({ where: { status: "PENDING" } }),
    ]);

    // 2. Revenue aggregation
    const orders = await prisma.order.findMany({
      where: { status: "COMPLETED" },
      select: { totalAmount: true, createdAt: true },
    });

    const totalRevenue = orders.reduce((acc, curr) => acc + curr.totalAmount, 0);

    // 3. Best Selling Products
    const bestSellers = await prisma.product.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { salesCount: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        slug: true,
        price: true,
        salesCount: true,
        ratingAverage: true,
        images: { where: { isThumbnail: true }, take: 1 },
      },
    });

    // 4. Recent Orders
    const recentOrders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: {
        user: {
          include: { profile: true },
        },
        items: {
          include: { product: { select: { title: true, slug: true } } },
        },
      },
    });

    // 5. Monthly Revenue Chart (last 6 months)
    const monthNames = ["Th1", "Th2", "Th3", "Th4", "Th5", "Th6", "Th7", "Th8", "Th9", "Th10", "Th11", "Th12"];
    const now = new Date();
    const monthlyStats: Record<string, { revenue: number; orders: number }> = {};

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${monthNames[d.getMonth()]}`;
      monthlyStats[key] = { revenue: 0, orders: 0 };
    }

    orders.forEach((o) => {
      const d = new Date(o.createdAt);
      const key = `${monthNames[d.getMonth()]}`;
      if (monthlyStats[key]) {
        monthlyStats[key].revenue += o.totalAmount;
        monthlyStats[key].orders += 1;
      }
    });

    const chartData = Object.keys(monthlyStats).map((k) => ({
      month: k,
      revenue: monthlyStats[k].revenue,
      orders: monthlyStats[k].orders,
    }));

    return NextResponse.json({
      stats: {
        totalRevenue,
        totalUsers,
        totalProducts,
        totalOrders,
        pendingDeposits,
      },
      bestSellers: bestSellers.map((b) => ({
        id: b.id,
        title: b.title,
        slug: b.slug,
        price: b.price,
        salesCount: b.salesCount,
        ratingAverage: b.ratingAverage,
        thumbnail: b.images[0]?.imageUrl || "",
      })),
      recentOrders: recentOrders.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        totalAmount: o.totalAmount,
        status: o.status,
        createdAt: o.createdAt,
        user: {
          email: o.user.email,
          displayName: o.user.profile?.displayName || "User",
        },
        productTitle: o.items[0]?.product?.title || "Sản phẩm",
      })),
      chartData,
    });
  } catch (error) {
    console.error("Admin analytics error:", error);
    return NextResponse.json({ error: "Failed to load analytics" }, { status: 500 });
  }
}
