export interface VietQRParams {
  bankBin: string; // e.g. "970422" for MBBank, "970407" for Techcombank, "970415" for Vietinbank
  accountNumber: string;
  accountName: string;
  amount: number;
  transferContent: string;
  template?: "compact2" | "compact" | "qr_only" | "print";
}

export function generateVietQRUrl(params: VietQRParams): string {
  const encodedContent = encodeURIComponent(params.transferContent);
  const encodedAccountName = encodeURIComponent(params.accountName.toUpperCase());
  const template = params.template || "compact2";
  return `https://img.vietqr.io/image/${params.bankBin}-${params.accountNumber}-${template}.png?amount=${params.amount}&addInfo=${encodedContent}&accountName=${encodedAccountName}`;
}

export const SUPPORTED_BANKS = [
  { bin: "970422", shortName: "MBBank", fullName: "Ngân hàng Quân Đội (MB)" },
  { bin: "970415", shortName: "VietinBank", fullName: "Ngân hàng Công Thương Việt Nam" },
  { bin: "970436", shortName: "Vietcombank", fullName: "Ngân hàng Ngoại Thương Việt Nam (VCB)" },
  { bin: "970407", shortName: "Techcombank", fullName: "Ngân hàng Kỹ Thương Việt Nam (TCB)" },
  { bin: "970418", shortName: "BIDV", fullName: "Ngân hàng Đầu tư và Phát triển Việt Nam" },
  { bin: "970416", shortName: "ACB", fullName: "Ngân hàng Á Châu" },
  { bin: "970423", shortName: "TPBank", fullName: "Ngân hàng Tiên Phong" },
  { bin: "970432", shortName: "VPBank", fullName: "Ngân hàng Việt Nam Thịnh Vượng" },
  { bin: "970441", shortName: "VIB", fullName: "Ngân hàng Quốc Tế" },
  { bin: "970405", shortName: "Agribank", fullName: "Ngân hàng Nông nghiệp và Phát triển Nông thôn" },
  { bin: "970403", shortName: "Sacombank", fullName: "Ngân hàng Sài Gòn Thương Tín" },
  { bin: "970448", shortName: "OCB", fullName: "Ngân hàng Phương Đông" },
  { bin: "970428", shortName: "NamABank", fullName: "Ngân hàng Nam Á" },
  { bin: "970426", shortName: "MSB", fullName: "Ngân hàng Hàng Hải" },
  { bin: "970437", shortName: "HDBank", fullName: "Ngân hàng Phát triển TP.HCM" },
  { bin: "970443", shortName: "SHB", fullName: "Ngân hàng Sài Gòn - Hà Nội" },
  { bin: "970440", shortName: "SeABank", fullName: "Ngân hàng Đông Nam Á" },
];

export function getBankBin(identifier: string): string {
  if (!identifier) return "970422";
  const clean = identifier.trim().toLowerCase();

  // If already a 6-digit BIN
  if (/^\d{6}$/.test(clean)) return clean;

  const found = SUPPORTED_BANKS.find(
    (b) =>
      b.bin === clean ||
      b.shortName.toLowerCase() === clean ||
      b.fullName.toLowerCase().includes(clean)
  );

  return found ? found.bin : "970422";
}
