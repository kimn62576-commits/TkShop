with open("src/app/(public)/product/[slug]/ProductDetailClient.tsx", "r", encoding="utf-8") as f:
    text = f.read()

# Add ShieldAlert to lucide-react imports
if "ShieldAlert" not in text:
    text = text.replace("ShieldCheck,", "ShieldCheck, ShieldAlert,")

# Add notice above Buy button container
target = '{/* Nút Hành Động Mua Hàng Hoặc Tải Về */}\n          <div className="space-y-3 pt-2">'
replacement = """{/* Cam Kết Bản Quyền & Chống Leak */}
          <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#0F172A] border border-amber-500/25 text-[11px] text-[#94A3B8]">
            <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>
              <strong className="text-amber-400">Chính sách chống leak:</strong> Mã nguồn gắn watermark định danh tài khoản. Nghiêm cấm phát tán hoặc bán lại.
            </span>
          </div>

          {/* Nút Hành Động Mua Hàng Hoặc Tải Về */}
          <div className="space-y-3 pt-2">"""

text = text.replace(target, replacement)

with open("src/app/(public)/product/[slug]/ProductDetailClient.tsx", "w", encoding="utf-8") as f:
    f.write(text)

print("ProductDetailClient.tsx updated successfully!")
