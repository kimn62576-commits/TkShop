path = r'C:\Users\H2PC\.gemini\antigravity\scratch\roblox-asset-marketplace\src\components\layout\Navbar.tsx'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Fix overflow-hidden to overflow-visible
text = text.replace(
    'h-16 flex items-center justify-between gap-2 sm:gap-3 overflow-hidden',
    'h-16 flex items-center justify-between gap-2 sm:gap-3 overflow-visible'
)

# 2. Fix Cửa Hàng dropdown with seamless hover bridge
old_shop_dropdown = '''              {/* Dropdown danh mục */}
              <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-[#0E172A] border border-slate-200 dark:border-[#1E2E4E] rounded-2xl shadow-xl p-1.5 hidden group-hover/shop:block z-50 animate-in fade-in duration-150">
                <Link href="/marketplace" className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#162036] hover:text-sky-500 transition-colors">
                  <ShoppingBag className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Tất Cả Asset</span>
                </Link>
                <Link href="/marketplace?category=systems" className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#162036] hover:text-amber-500 transition-colors">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>Hệ Thống (ACS)</span>
                </Link>
                <Link href="/marketplace?category=maps-terrain" className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#162036] hover:text-indigo-500 transition-colors">
                  <Layers className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Bản Đồ & Terrain</span>
                </Link>
              </div>'''

new_shop_dropdown = '''              {/* Dropdown danh mục với đệm hover không bị giật */}
              <div className="absolute top-full left-0 pt-1 w-52 hidden group-hover/shop:block z-50 animate-in fade-in duration-150">
                <div className="bg-white dark:bg-[#0E172A] border border-slate-200 dark:border-[#1E2E4E] rounded-2xl shadow-2xl p-1.5 space-y-0.5">
                  <Link href="/marketplace" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#162036] hover:text-sky-500 transition-colors">
                    <ShoppingBag className="w-4 h-4 text-emerald-500" />
                    <span className="font-semibold">Tất Cả Asset</span>
                  </Link>
                  <Link href="/marketplace?category=systems" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#162036] hover:text-amber-500 transition-colors">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span className="font-semibold">Hệ Thống (ACS)</span>
                  </Link>
                  <Link href="/marketplace?category=maps-terrain" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#162036] hover:text-indigo-500 transition-colors">
                    <Layers className="w-4 h-4 text-indigo-500" />
                    <span className="font-semibold">Bản Đồ & Terrain</span>
                  </Link>
                </div>
              </div>'''

# 3. Fix Hỗ Trợ dropdown with seamless hover bridge
old_support_dropdown = '''              {/* Dropdown Hỗ Trợ */}
              <div className="absolute top-full left-0 mt-1 w-44 bg-white dark:bg-[#0E172A] border border-slate-200 dark:border-[#1E2E4E] rounded-2xl shadow-xl p-1.5 hidden group-hover/support:block z-50 animate-in fade-in duration-150">
                <Link href="/support" className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#162036] hover:text-sky-500 transition-colors">
                  <HelpCircle className="w-3.5 h-3.5 text-sky-500" />
                  <span>Hướng Dẫn Cài Đặt</span>
                </Link>
                <Link href="/support#uy-tin" className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#162036] hover:text-amber-500 transition-colors">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  <span>Uy Tín Của Shop</span>
                </Link>
              </div>'''

new_support_dropdown = '''              {/* Dropdown Hỗ Trợ với đệm hover không bị giật */}
              <div className="absolute top-full left-0 pt-1 w-48 hidden group-hover/support:block z-50 animate-in fade-in duration-150">
                <div className="bg-white dark:bg-[#0E172A] border border-slate-200 dark:border-[#1E2E4E] rounded-2xl shadow-2xl p-1.5 space-y-0.5">
                  <Link href="/support" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#162036] hover:text-sky-500 transition-colors">
                    <HelpCircle className="w-4 h-4 text-sky-500" />
                    <span className="font-semibold">Hướng Dẫn Cài Đặt</span>
                  </Link>
                  <Link href="/support#uy-tin" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#162036] hover:text-amber-500 transition-colors">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span className="font-semibold">Uy Tín Của Shop</span>
                  </Link>
                </div>
              </div>'''

# Normalize and replace
text_norm = text.replace('\r\n', '\n')
old_shop_norm = old_shop_dropdown.replace('\r\n', '\n')
new_shop_norm = new_shop_dropdown.replace('\r\n', '\n')
old_sup_norm = old_support_dropdown.replace('\r\n', '\n')
new_sup_norm = new_support_dropdown.replace('\r\n', '\n')

if old_shop_norm in text_norm:
    text_norm = text_norm.replace(old_shop_norm, new_shop_norm)
if old_sup_norm in text_norm:
    text_norm = text_norm.replace(old_sup_norm, new_sup_norm)

with open(path, 'w', encoding='utf-8', newline='\r\n') as f:
    f.write(text_norm)
print("SUCCESS: Navbar dropdowns updated and overflow-hidden removed!")
