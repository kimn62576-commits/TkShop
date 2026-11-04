import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export interface CardChargePayload {
  userId: string;
  telco: string;
  declaredAmount: number;
  pin: string;
  serial: string;
}

export const SUPPORTED_TELCOS = [
  { code: "VIETTEL", name: "Viettel", color: "from-red-500 to-rose-600", badge: "Viettel" },
  { code: "VINAPHONE", name: "VinaPhone", color: "from-blue-500 to-cyan-600", badge: "Vina" },
  { code: "MOBIFONE", name: "MobiFone", color: "from-blue-600 to-indigo-600", badge: "Mobi" },
  { code: "VIETNAMOBILE", name: "Vietnamobile", color: "from-orange-500 to-amber-600", badge: "VNM" },
  { code: "ZING", name: "Thẻ Zing (VNG)", color: "from-emerald-500 to-teal-600", badge: "Zing" },
  { code: "GATE", name: "Thẻ Gate (FPT)", color: "from-amber-500 to-yellow-600", badge: "Gate" },
  { code: "GARENA", name: "Thẻ Garena", color: "from-red-600 to-rose-700", badge: "Garena" },
];

export const STANDARD_AMOUNTS = [10000, 20000, 30000, 50000, 100000, 200000, 300000, 500000, 1000000];

export function md5(text: string): string {
  return crypto.createHash("md5").update(text).digest("hex");
}

export function generateCardRequestId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `TKCARD_${timestamp}_${random}`;
}

export function maskSerial(serial: string): string {
  if (serial.length <= 6) return serial;
  return serial.substring(0, 3) + "******" + serial.substring(serial.length - 3);
}

/**
 * Gửi yêu cầu gạch thẻ tới cổng đối tác (TheSieuRe / TrumThe / GachThe1s v2)
 */
export async function sendToTheSieuReGateway(params: {
  telco: string;
  pin: string;
  serial: string;
  amount: number;
  requestId: string;
  partnerId: string;
  partnerKey: string;
  endpoint?: string;
}) {
  const endpoint = params.endpoint || process.env.CARD_GATEWAY_URL || "https://thesieure.com/chargingws/v2";
  const sign = md5(params.partnerKey + params.pin + params.serial);
  
  const queryParams = new URLSearchParams({
    sign,
    telco: params.telco,
    code: params.pin,
    serial: params.serial,
    amount: params.amount.toString(),
    request_id: params.requestId,
    partner_id: params.partnerId,
    command: "charging",
  });

  const url = `${endpoint}?${queryParams.toString()}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { "User-Agent": "TKShop-CardGateway/1.0" },
    });
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("Lỗi kết nối cổng gạch thẻ:", error);
    return { status: 100, message: "Không thể kết nối tới cổng gạch thẻ đối tác" };
  }
}

/**
 * Xử lý kết quả callback từ cổng gạch thẻ
 */
export async function handleCardCallbackResult(params: {
  requestId: string;
  status: number; // 1: Thành công, 2: Sai mệnh giá, 3: Thẻ sai/đã dùng, 99: Chờ xử lý
  realAmount?: number;
  declaredAmount?: number;
  receivedAmount?: number;
  message?: string;
}) {
  const { requestId, status, realAmount, message } = params;

  return await prisma.$transaction(async (tx) => {
    const card = await tx.cardDeposit.findUnique({
      where: { requestId },
      include: {
        user: {
          include: { wallet: true },
        },
      },
    });

    if (!card) {
      throw new Error(`Giao dịch gạch thẻ ${requestId} không tồn tại`);
    }

    if (card.status !== "PENDING") {
      return { success: true, message: "Thẻ này đã được xử lý trước đó", card };
    }

    // 01. THÀNH CÔNG ĐÚNG MỆNH GIÁ (status === 1 hoặc 200)
    if (status === 1 || status === 200) {
      const actualAmount = realAmount || card.declaredAmount;
      const actualReceived = actualAmount - (actualAmount * card.discountFee) / 100;

      // Cập nhật bản ghi thẻ
      const updatedCard = await tx.cardDeposit.update({
        where: { id: card.id },
        data: {
          status: "SUCCESS",
          realAmount: actualAmount,
          receivedAmount: actualReceived,
          note: message || "Nạp thẻ thành công",
        },
      });

      // Cộng tiền ví user
      if (card.user.wallet) {
        const balanceBefore = card.user.wallet.balance;
        const balanceAfter = balanceBefore + actualReceived;

        await tx.wallet.update({
          where: { id: card.user.wallet.id },
          data: {
            balance: balanceAfter,
            totalDeposited: card.user.wallet.totalDeposited + actualReceived,
          },
        });

        // Tạo biến động số dư
        await tx.walletTransaction.create({
          data: {
            walletId: card.user.wallet.id,
            type: "DEPOSIT",
            amount: actualReceived,
            balanceBefore,
            balanceAfter,
            referenceId: card.requestId,
            description: `Nạp thẻ cào ${card.telco} mệnh giá ${actualAmount.toLocaleString("vi-VN")}đ`,
            status: "COMPLETED",
          },
        });
      }

      // Thông báo chuông cho user
      await tx.notification.create({
        data: {
          userId: card.userId,
          title: "Nạp thẻ cào thành công",
          message: `Thẻ ${card.telco} mệnh giá ${actualAmount.toLocaleString("vi-VN")}đ đã được nạp thành công! +${actualReceived.toLocaleString("vi-VN")}đ vào ví.`,
          type: "ORDER",
        },
      });

      return { success: true, updatedCard };
    }

    // 02. SAI MỆNH GIÁ (status === 2 hoặc 201) - Phạt 50% theo quy định nhà mạng
    if (status === 2 || status === 201) {
      const actualAmount = realAmount || Math.round(card.declaredAmount / 2);
      // Áp dụng chiết khấu thông thường rồi trừ tiếp 50% tiền phạt sai mệnh giá
      const normalReceived = actualAmount - (actualAmount * card.discountFee) / 100;
      const penalReceived = Math.round(normalReceived * 0.5);

      const updatedCard = await tx.cardDeposit.update({
        where: { id: card.id },
        data: {
          status: "SUCCESS",
          realAmount: actualAmount,
          receivedAmount: penalReceived,
          note: `Sai mệnh giá (-50% phạt). Khai báo: ${card.declaredAmount.toLocaleString("vi-VN")}đ, Thực tế: ${actualAmount.toLocaleString("vi-VN")}đ`,
        },
      });

      if (card.user.wallet && penalReceived > 0) {
        const balanceBefore = card.user.wallet.balance;
        const balanceAfter = balanceBefore + penalReceived;

        await tx.wallet.update({
          where: { id: card.user.wallet.id },
          data: {
            balance: balanceAfter,
            totalDeposited: card.user.wallet.totalDeposited + penalReceived,
          },
        });

        await tx.walletTransaction.create({
          data: {
            walletId: card.user.wallet.id,
            type: "DEPOSIT",
            amount: penalReceived,
            balanceBefore,
            balanceAfter,
            referenceId: card.requestId,
            description: `Nạp thẻ ${card.telco} sai mệnh giá thực ${actualAmount.toLocaleString("vi-VN")}đ (Phạt 50%)`,
            status: "COMPLETED",
          },
        });
      }

      await tx.notification.create({
        data: {
          userId: card.userId,
          title: "Thẻ cào sai mệnh giá",
          message: `Thẻ ${card.telco} bị sai mệnh giá! Mệnh giá thực: ${actualAmount.toLocaleString("vi-VN")}đ. Áp dụng phạt 50% nhận ${penalReceived.toLocaleString("vi-VN")}đ vào ví.`,
          type: "SYSTEM",
        },
      });

      return { success: true, updatedCard };
    }

    // 03. THẺ THẤT BẠI / THẺ SAI / ĐÃ QUA SỬ DỤNG (status === 3 hoặc 100)
    if (status === 3 || status === 100) {
      const updatedCard = await tx.cardDeposit.update({
        where: { id: card.id },
        data: {
          status: "FAILED",
          note: message || "Thẻ cào không hợp lệ, sai số Seri/Mã Pin hoặc thẻ đã qua sử dụng",
        },
      });

      await tx.notification.create({
        data: {
          userId: card.userId,
          title: "Nạp thẻ thất bại",
          message: `Thẻ ${card.telco} (Seri: ${maskSerial(card.serial)}) không hợp lệ hoặc đã qua sử dụng.`,
          type: "SYSTEM",
        },
      });

      return { success: true, updatedCard };
    }

    return { success: false, message: "Trạng thái thẻ chưa xác định" };
  });
}
