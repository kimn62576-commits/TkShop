file_path = r"C:\Users\H2PC\.gemini\antigravity\scratch\roblox-asset-marketplace\src\components\wallet\DepositModal.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    code = f.read()

# 1. Remove early `if (!isOpen) return null;` at the top
code = code.replace("  if (!isOpen) return null;\n\n", "")
code = code.replace("  if (!isOpen) return null;\r\n\r\n", "")
code = code.replace("  if (!isOpen) return null;\n", "")
code = code.replace("  if (!isOpen) return null;\r\n", "")

# 2. Update useEffect to check !isOpen
code = code.replace(
    'if (step !== "QR" || !depositData?.transactionCode || animStatus !== "idle") return;',
    'if (!isOpen || step !== "QR" || !depositData?.transactionCode || animStatus !== "idle") return;'
)

# 3. Add `if (!isOpen) return null;` right before `return (`
code = code.replace(
    "  return (\n    <>",
    "  if (!isOpen) return null;\n\n  return (\n    <>"
).replace(
    "  return (\r\n    <>",
    "  if (!isOpen) return null;\r\n\r\n  return (\r\n    <>"
)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(code)

print("Fixed React Hook order in DepositModal.tsx successfully!")
