import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";
import { recordAdminLog } from "@/lib/admin-logger";
import { slugify } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "15");

  const where: any = {};
  if (q) {
    where.OR = [
      { title: { contains: q } },
      { slug: { contains: q } },
    ];
  }

  const [total, products] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        images: true,
        files: true,
        versions: true,
      },
    }),
  ]);

  return NextResponse.json({
    products,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const {
      title,
      subtitle,
      description,
      features,
      installationGuide,
      price,
      originalPrice,
      isFree,
      isFeatured,
      isTrending,
      isBestSeller,
      categoryId,
      robloxVersion,
      fileFormat,
      creatorName,
      thumbnailUrl,
      fileName,
      fileSize,
      initialVersion,
      changelog,
    } = body;

    if (!title || !description || !categoryId) {
      return NextResponse.json({ error: "Vui lòng điền đầy đủ tiêu đề, mô tả và danh mục." }, { status: 400 });
    }

    let slug = slugify(title);
    const existingSlug = await prisma.product.findUnique({ where: { slug } });
    if (existingSlug) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const product = await prisma.$transaction(async (tx) => {
      const p = await tx.product.create({
        data: {
          title,
          slug,
          subtitle: subtitle || null,
          description,
          features: Array.isArray(features) ? JSON.stringify(features) : features || "[]",
          installationGuide: installationGuide || null,
          price: isFree ? 0 : Number(price || 0),
          originalPrice: originalPrice ? Number(originalPrice) : null,
          discountPercent: originalPrice && price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0,
          isFree: !!isFree,
          isFeatured: !!isFeatured,
          isTrending: !!isTrending,
          isBestSeller: !!isBestSeller,
          status: "PUBLISHED",
          categoryId,
          robloxVersion: robloxVersion || "Studio v0.640+",
          fileFormat: fileFormat || ".rbxm",
          creatorName: creatorName || session.displayName || "Roblox Assets Studio",
        },
      });

      // Add Thumbnail
      if (thumbnailUrl) {
        await tx.productImage.create({
          data: {
            productId: p.id,
            imageUrl: thumbnailUrl,
            isThumbnail: true,
            sortOrder: 0,
          },
        });
      }

      // Add File
      const safeFileName = fileName || `${slug}.rbxm`;
      await tx.productFile.create({
        data: {
          productId: p.id,
          fileName: safeFileName,
          fileSize: fileSize || "5.0 MB",
          fileFormat: fileFormat || ".rbxm",
          storagePath: `/storage/protected/products/${p.slug}/${safeFileName}`,
          version: initialVersion || "1.0.0",
          isLatest: true,
        },
      });

      // Add Version
      await tx.productVersion.create({
        data: {
          productId: p.id,
          versionNumber: initialVersion || "v1.0.0",
          changelog: changelog || "Initial production release",
        },
      });

      return p;
    });

    // Record Admin Log
    await recordAdminLog({
      adminId: session.id,
      action: "CREATE_PRODUCT",
      targetType: "PRODUCT",
      targetId: product.id,
      details: { title: product.title, price: product.price, slug: product.slug },
      ipAddress: req.headers.get("x-forwarded-for"),
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error("Create product error:", error);
    return NextResponse.json({ error: error.message || "Failed to create product" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { id, title, subtitle, description, price, originalPrice, isFree, isFeatured, isTrending, isBestSeller, status, categoryId } = body;

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(subtitle !== undefined && { subtitle }),
        ...(description && { description }),
        ...(price !== undefined && { price: isFree ? 0 : Number(price) }),
        ...(originalPrice !== undefined && { originalPrice: Number(originalPrice) }),
        ...(isFree !== undefined && { isFree }),
        ...(isFeatured !== undefined && { isFeatured }),
        ...(isTrending !== undefined && { isTrending }),
        ...(isBestSeller !== undefined && { isBestSeller }),
        ...(status && { status }),
        ...(categoryId && { categoryId }),
      },
    });

    await recordAdminLog({
      adminId: session.id,
      action: "UPDATE_PRODUCT",
      targetType: "PRODUCT",
      targetId: id,
      details: { title: updated.title, price: updated.price, status: updated.status },
      ipAddress: req.headers.get("x-forwarded-for"),
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (error: any) {
    console.error("Update product error:", error);
    return NextResponse.json({ error: error.message || "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    // Soft delete / archive product so purchased users don't lose access
    const product = await prisma.product.update({
      where: { id },
      data: { status: "ARCHIVED" },
    });

    await recordAdminLog({
      adminId: session.id,
      action: "ARCHIVE_PRODUCT",
      targetType: "PRODUCT",
      targetId: id,
      details: { title: product.title },
      ipAddress: req.headers.get("x-forwarded-for"),
    });

    return NextResponse.json({ success: true, message: "Sản phẩm đã được chuyển vào lưu trữ (Archived)." });
  } catch (error: any) {
    console.error("Delete product error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete product" }, { status: 500 });
  }
}
