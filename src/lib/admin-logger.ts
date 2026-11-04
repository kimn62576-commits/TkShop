import { prisma } from "./prisma";

interface LogAdminParams {
  adminId: string;
  action: string;
  targetType: "USER" | "PRODUCT" | "ORDER" | "WALLET" | "SETTING" | "CATEGORY" | "COUPON";
  targetId?: string | null;
  details: Record<string, unknown> | string;
  ipAddress?: string | null;
}

export async function recordAdminLog(params: LogAdminParams) {
  try {
    await prisma.adminLog.create({
      data: {
        adminId: params.adminId,
        action: params.action,
        targetType: params.targetType,
        targetId: params.targetId || null,
        details: typeof params.details === "string" ? params.details : JSON.stringify(params.details),
        ipAddress: params.ipAddress || null,
      },
    });
  } catch (error) {
    console.error("Failed to record admin audit log:", error);
  }
}
