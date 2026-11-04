file_path = r"C:\Users\H2PC\.gemini\antigravity\scratch\roblox-asset-marketplace\src\components\wallet\DepositModal.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    code = f.read()

target = "  const copyToClipboard = (text: string, field: string) => {"
replacement = '''  // Tự động kiểm tra trạng thái thanh toán real-time theo chu kỳ 2.5 giây khi đang hiển thị mã QR
  useEffect(() => {
    if (step !== "QR" || !depositData?.transactionCode || animStatus !== "idle") return;

    let isCancelled = false;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/wallet/deposit?code=${encodeURIComponent(depositData.transactionCode)}`);
        const data = await res.json();
        if (data.isCompleted && !isCancelled) {
          clearInterval(interval);
          const targetAmount = depositData.amount || amount;
          const bonus = Math.round(targetAmount * 0.2);
          setAnimAmount(targetAmount);
          setAnimBonus(bonus);
          setAnimMsg(`Hệ thống TKSHOP đã ghi nhận giao dịch chuyển khoản ${formatVND(targetAmount)}. Số dư ví và +20% khuyến mãi đã được nạp tự động!`);
          setAnimStatus("success");
          window.dispatchEvent(new Event("refreshUser"));
          if (onSuccess) onSuccess();
        }
      } catch (e) {
        // Tự động tiếp tục kiểm tra
      }
    }, 2500);

    return () => {
      isCancelled = true;
      clearInterval(interval);
    };
  }, [step, depositData, animStatus]);

  const copyToClipboard = (text: string, field: string) => {'''

if "isCompleted && !isCancelled" not in code:
    code = code.replace(target, replacement)
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(code)
    print("Updated DepositModal.tsx with real-time auto-polling!")
else:
    print("DepositModal.tsx already has polling.")
