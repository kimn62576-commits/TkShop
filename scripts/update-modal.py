with open("src/components/marketplace/PurchaseModal.tsx", "r", encoding="utf-8") as f:
    text = f.read()

# Add ShieldAlert to imports
text = text.replace("ShieldCheck, Tag", "ShieldCheck, ShieldAlert, Tag")

# Add state
text = text.replace(
    "const [successOrder, setSuccessOrder] = useState<string | null>(null);",
    "const [successOrder, setSuccessOrder] = useState<string | null>(null);\n  const [agreedToAntiLeak, setAgreedToAntiLeak] = useState(false);"
)

# Add check in handleConfirmPurchase
old_func = "const handleConfirmPurchase = async () => {\n    setError(null);"
new_func = """const handleConfirmPurchase = async () => {
    if (!agreedToAntiLeak) {
      setError("Vui lòng tích xác nhận cam kết Không Leak/Bán Lại tài nguyên trước khi thanh toán.");
      return;
    }
    setError(null);"""
text = text.replace(old_func, new_func)

# Add anti-leak box before confirm button
terms_block = """              {/* Điều Khoản Bảo Mật & Cam Kết Chống Leak Asset */}
              <div className="rounded-lg bg-[#0F172A] border border-amber-500/30 p-3.5 space-y-2.5">
                <div className="flex items-center gap-2 text-amber-400">
                  <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                  <span className="text-xs font-semibold tracking-wide uppercase">
                    Điều Khoản Bản Quyền & Cam Kết Chống Leak
                  </span>
                </div>
                
                <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                  Toàn bộ mã nguồn, Model và Framework tại <strong className="text-[#38BDF8]">TKSHOP.VN</strong> đều được mã hóa <strong className="text-[#F8FAFC]">Watermark số định danh</strong> theo User ID. Mọi hành vi <strong>leak, share file trái phép qua Discord/Telegram hoặc bán lại</strong> sẽ bị:
                </p>

                <ul className="text-[10px] text-[#94A3B8] space-y-1 list-disc list-inside font-mono">
                  <li>Khóa vĩnh viễn tài khoản & tước quyền tải toàn bộ thư viện asset.</li>
                  <li>Tịch thu toàn bộ số dư ví hiện có không hoàn lại.</li>
                  <li>Đưa Roblox User ID / Discord ID vào danh sách đen (Blacklist).</li>
                  <li>Xử lý theo quy định bảo vệ quyền tác giả & sở hữu trí tuệ.</li>
                </ul>

                {/* Checkbox Bắt Buộc */}
                <label className="flex items-start gap-2.5 pt-2 border-t border-[#263554] cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={agreedToAntiLeak}
                    onChange={(e) => setAgreedToAntiLeak(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-[#263554] bg-[#0B111E] text-[#38BDF8] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                  <span className="text-xs text-[#F8FAFC] group-hover:text-[#38BDF8] transition-colors font-medium">
                    Tôi cam kết KHÔNG LEAK, KHÔNG BÁN LẠI. Nếu vi phạm tôi đồng ý bị khóa vĩnh viễn tài khoản và chịu mọi hình thức xử lý.
                  </span>
                </label>
              </div>

              {/* Nút Xác Nhận Thanh Toán */}"""

text = text.replace("{/* Nút Xác Nhận Thanh Toán */}", terms_block)

# Update confirm button disabled state
text = text.replace(
    "disabled={loading || !isBalanceEnough}",
    "disabled={loading || !isBalanceEnough || !agreedToAntiLeak}"
)

with open("src/components/marketplace/PurchaseModal.tsx", "w", encoding="utf-8") as f:
    f.write(text)

print("PurchaseModal.tsx successfully updated!")
