file_path = r"C:\Users\H2PC\.gemini\antigravity\scratch\roblox-asset-marketplace\src\app\api\wallet\deposit\route.ts"

with open(file_path, "r", encoding="utf-8") as f:
    code = f.read()

code = code.replace(
    'import { generateVietQRUrl } from "@/lib/payment/vietqr";',
    'import { generateVietQRUrl, getBankBin } from "@/lib/payment/vietqr";'
)

old_block = '''    const bankBin = process.env.BANK_BIN || "970422";
    const bankName = provider?.bankName || process.env.BANK_NAME || "MBBank";
    const bankAccount = provider?.bankAccount || process.env.BANK_ACCOUNT || "999988886666";
    const bankAccountName = provider?.bankAccountName || process.env.BANK_ACCOUNT_NAME || "ROBLOX ASSET MARKETPLACE";'''

new_block = '''    const bankName = process.env.BANK_NAME || provider?.bankName || "MBBank";
    const bankBin = process.env.BANK_BIN || getBankBin(bankName);
    const bankAccount = process.env.BANK_ACCOUNT || provider?.bankAccount || "0777776025";
    const bankAccountName = process.env.BANK_ACCOUNT_NAME || provider?.bankAccountName || "NGUYEN HUYNH TRUNG HIEU";'''

code = code.replace(old_block, new_block)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(code)

print("Updated deposit route with getBankBin and real env priorities!")
