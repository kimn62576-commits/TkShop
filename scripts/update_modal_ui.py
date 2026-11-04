file_path = r"C:\Users\H2PC\.gemini\antigravity\scratch\roblox-asset-marketplace\src\components\wallet\DepositModal.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    code = f.read()

target = '''                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Số tài khoản:</span>'''

replacement = '''                      {depositData?.bankAccountName && (
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500">Chủ tài khoản:</span>
                          <span className="font-bold text-slate-800 uppercase">{depositData?.bankAccountName}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Số tài khoản:</span>'''

if "{depositData?.bankAccountName && (" not in code:
    code = code.replace(target, replacement)

status_badge = '''                      </div>
                    </div>

                    {/* Huy hiệu chờ thanh toán live */}
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center gap-2 text-amber-700 dark:text-amber-400 text-[11px] font-medium">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                      </span>
                      <span>Hệ thống đang tự động lắng nghe giao dịch chuyển khoản...</span>
                    </div>

                    {/* Nút Sandbox Xác Nhận Nạp kèm Animation */}'''

target_bottom = '''                      </div>
                    </div>

                    {/* Nút Sandbox Xác Nhận Nạp kèm Animation */}'''

if "Hệ thống đang tự động lắng nghe" not in code:
    code = code.replace(target_bottom, status_badge)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(code)

print("Updated DepositModal.tsx with Account Name and Live Listener badge!")
