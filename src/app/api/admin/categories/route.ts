import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";
import { recordAdminLog } from "@/lib/admin-logger";
import { slugify } from "@/lib/utils";

export async function GET() {
  const categories = await prisma.productCategory.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      _count: { select: { products: true } },
    },
  });

  return NextResponse.json({ categories });
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { name, icon, description, sortOrder } = await req.json();
    if (!name) return NextResponse.json({ error: "Category name required" }, { status: 400 });

    const slug = slugify(name);
    const category = await prisma.productCategory.create({
      data: {
        name,
        slug,
        icon: icon || "Box",
        description: description || null,
        sortOrder: Number(sortOrder || 0),
        isActive: true,
      },
    });

    await recordAdminLog({
      adminId: session.id,
      action: "CREATE_CATEGORY",
      targetType: "CATEGORY",
      targetId: category.id,
      details: { name: category.name, slug: category.slug },
      ipAddress: req.headers.get("x-forwarded-for"),
    });

    return NextResponse.json({ success: true, category });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create category" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id, name, icon, description, sortOrder, isActive } = await req.json();
    if (!id) return NextResponse.json({ error: "Category ID required" }, { status: 400 });

    const updated = await prisma.productCategory.update({
      where: { id },
      data: {
        ...(name && { name, slug: slugify(name) }),
        ...(icon && { icon }),
        ...(description !== undefined && { description }),
        ...(sortOrder !== undefined && { sortOrder: Number(sortOrder) }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    await recordAdminLog({
      adminId: session.id,
      action: "UPDATE_CATEGORY",
      targetType: "CATEGORY",
      targetId: id,
      details: { name: updated.name },
      ipAddress: req.headers.get("x-forwarded-for"),
    });

    return NextResponse.json({ success: true, category: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update category" }, { status: 500 });
  }
}
