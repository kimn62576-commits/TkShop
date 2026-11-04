import re

navbar_path = r'C:\Users\H2PC\.gemini\antigravity\scratch\roblox-asset-marketplace\src\components\layout\Navbar.tsx'
with open(navbar_path, 'r', encoding='utf-8') as f:
    nav = f.read()

# Replace Cửa Hàng dropdown with ultra smooth and robust dropdown
old_shop_pattern = r'\{\/\* 2\. Cửa Hàng Asset.*?\{\/\* 3\. Tin Tức'
new_shop = '''{/* 2. Cửa Hàng Asset (Kèm Dropdown Danh Mục Nhanh) */}
            <div className="relative group py-2">
              <Link 
                href="/marketplace" 
                className={`nav-pill whitespace-nowrap px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all ${
                  pathname === "/marketplace" 
                    ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold shadow-xs ring-1 ring-sky-400/40"
                    : "text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-300 hover:bg-slate-100 dark:hover:bg-[#162036]"
                }`}
              >
                <ShoppingBag className={`w-3.5 h-3.5 ${pathname === "/marketplace" ? "text-white" : "text-emerald-500"}`} />
                <span>Cửa Hàng</span>
                <ChevronDown className="w-3 h-3 text-slate-400 group-hover:rotate-180 transition-transform duration-200" />
              </Link>

              {/* Dropdown danh mục: hiển thị mượt mà khi hover với cầu nối hover chống mất chuột */}
              <div className="absolute top-[85%] left-0 pt-2 w-56 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto translate-y-1 group-hover:translate-y-0 transition-all duration-200 z-50">
                <div className="bg-white dark:bg-[#0E172A] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-1.5 space-y-0.5">
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
                  <Link href="/marketplace?q=RPG" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#162036] hover:text-emerald-500 transition-colors">
                    <Sparkles className="w-4 h-4 text-emerald-500" />
                    <span className="font-semibold">Hệ Thống RPG</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* 3. Tin Tức'''

nav = re.sub(old_shop_pattern, new_shop, nav, flags=re.DOTALL)

# Replace Hỗ Trợ dropdown
old_support_pattern = r'\{\/\* 4\. Hỗ Trợ & Hướng Dẫn.*?<\/nav>'
new_support = '''{/* 4. Hỗ Trợ & Hướng Dẫn */}
            <div className="relative group py-2">
              <Link 
                href="/support" 
                className={`nav-pill whitespace-nowrap px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all ${
                  pathname.startsWith("/support") 
                    ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold shadow-xs ring-1 ring-sky-400/40"
                    : "text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-300 hover:bg-slate-100 dark:hover:bg-[#162036]"
                }`}
              >
                <HelpCircle className={`w-3.5 h-3.5 ${pathname.startsWith("/support") ? "text-white" : "text-sky-500"}`} />
                <span>Hỗ Trợ</span>
                <ChevronDown className="w-3 h-3 text-slate-400 group-hover:rotate-180 transition-transform duration-200" />
              </Link>

              {/* Dropdown Hỗ Trợ với hiệu ứng mượt và cầu nối hover */}
              <div className="absolute top-[85%] left-0 pt-2 w-52 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto translate-y-1 group-hover:translate-y-0 transition-all duration-200 z-50">
                <div className="bg-white dark:bg-[#0E172A] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-1.5 space-y-0.5">
                  <Link href="/support" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#162036] hover:text-sky-500 transition-colors">
                    <HelpCircle className="w-4 h-4 text-sky-500" />
                    <span className="font-semibold">Hướng Dẫn Cài Đặt</span>
                  </Link>
                  <Link href="/news" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#162036] hover:text-amber-500 transition-colors">
                    <Newspaper className="w-4 h-4 text-amber-500" />
                    <span className="font-semibold">Cẩm Nang Studio</span>
                  </Link>
                  <Link href="/support#uy-tin" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#162036] hover:text-emerald-500 transition-colors">
                    <Award className="w-4 h-4 text-emerald-500" />
                    <span className="font-semibold">Uy Tín Của Shop</span>
                  </Link>
                </div>
              </div>
            </div>
          </nav>'''

nav = re.sub(old_support_pattern, new_support, nav, flags=re.DOTALL)

with open(navbar_path, 'w', encoding='utf-8', newline='\r\n') as f:
    f.write(nav)

print("SUCCESS: Navbar.tsx dropdowns updated!")
