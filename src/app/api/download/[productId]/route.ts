import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";
import { checkUserOwnership, getOrCreateProtectedAssetFile, verifyDownloadToken } from "@/lib/storage/delivery";

export async function GET(req: NextRequest, { params }: { params: { productId: string } }) {
  try {
    const { productId } = params;
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    let userId: string | null = null;

    if (token) {
      const decoded = verifyDownloadToken(token);
      if (!decoded || decoded.productId !== productId) {
        return NextResponse.json({ error: "Download token không hợp lệ hoặc đã hết hạn (10 phút)." }, { status: 403 });
      }
      userId = decoded.userId;
    } else {
      const session = await getSessionFromRequest(req);
      if (!session) {
        return NextResponse.json({ error: "Vui lòng đăng nhập để tải tài nguyên." }, { status: 401 });
      }
      userId = session.id;
    }

    // Ownership verification
    const isOwner = await checkUserOwnership(userId, productId);
    if (!isOwner) {
      return NextResponse.json(
        { error: "Bạn chưa mua sản phẩm này hoặc chưa có quyền tải về." },
        { status: 403 }
      );
    }

    // Fetch product & file info
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        files: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!product || product.files.length === 0) {
      return NextResponse.json({ error: "Không tìm thấy file tải về của sản phẩm này." }, { status: 404 });
    }

    const file = product.files[0];

    // Deliver asset file
    const { buffer } = getOrCreateProtectedAssetFile(
      file.storagePath,
      file.fileName,
      product.title,
      file.fileFormat
    );

    // Record Download Log
    const ipAddress = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const userAgent = req.headers.get("user-agent") || "Unknown";

    await prisma.downloadLog.create({
      data: {
        userId,
        productId,
        fileName: file.fileName,
        ipAddress,
        userAgent,
      },
    });

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Disposition": `attachment; filename="${encodeURIComponent(file.fileName)}"`,
        "Content-Type": "application/octet-stream",
        "Content-Length": buffer.length.toString(),
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Secure download delivery error:", error);
    return NextResponse.json({ error: "Lỗi tải file. Vui lòng liên hệ bộ phận hỗ trợ." }, { status: 500 });
  }
}
