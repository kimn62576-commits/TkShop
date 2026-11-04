import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";
import { recordAdminLog } from "@/lib/admin-logger";

export async function GET() {
  const settings = await prisma.websiteSetting.findMany();
  const provider = await prisma.paymentProvider.findFirst({
    where: { code: "VIETQR" },
  });

  return NextResponse.json({
    settings: Object.fromEntries(settings.map((s) => [s.key, s.value])),
    bankConfig: {
      bankName: provider?.bankName || "MBBank",
      bankAccount: provider?.bankAccount || "999988886666",
      bankAccountName: provider?.bankAccountName || "ROBLOX ASSET MARKETPLACE",
      webhookSecret: provider?.webhookSecret || "whsec_rbxmarket_super_secure_secret_2026",
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { settings, bankConfig } = await req.json();

    if (settings) {
      for (const [key, value] of Object.entries(settings)) {
        await prisma.websiteSetting.upsert({
          where: { key },
          update: { value: String(value) },
          create: { key, value: String(value) },
        });
      }
    }

    if (bankConfig) {
      await prisma.paymentProvider.updateMany({
        where: { code: "VIETQR" },
        data: {
          bankName: bankConfig.bankName,
          bankAccount: bankConfig.bankAccount,
          bankAccountName: bankConfig.bankAccountName,
          webhookSecret: bankConfig.webhookSecret,
        },
      });
    }

    await recordAdminLog({
      adminId: session.id,
      action: "UPDATE_WEBSITE_SETTINGS",
      targetType: "SETTING",
      details: { settings, bankConfig },
      ipAddress: req.headers.get("x-forwarded-for"),
    });

    return NextResponse.json({ success: true, message: "Cập nhật cấu hình thành công!" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update settings" }, { status: 500 });
  }
}
