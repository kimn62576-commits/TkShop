path = r'C:\Users\H2PC\.gemini\antigravity\scratch\roblox-asset-marketplace\src\components\layout\Navbar.tsx'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

target = '''            <Link 
              href="/marketplace?category=maps-terrain" 
              onClick={() => setMobileMenuOpen(false)} 
              className="flex items-center gap-2.5 py-2 px-3 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#162036] hover:text-blue-600 dark:hover:text-sky-400 transition-colors"
            >
              <Layers className="w-4 h-4 text-indigo-500" />
              <span>Bản Đồ</span>
            </Link>'''

replacement = '''            <Link 
              href="/marketplace?category=maps-terrain" 
              onClick={() => setMobileMenuOpen(false)} 
              className="flex items-center gap-2.5 py-2 px-3 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#162036] hover:text-blue-600 dark:hover:text-sky-400 transition-colors"
            >
              <Layers className="w-4 h-4 text-indigo-500" />
              <span>Bản Đồ</span>
            </Link>
            <Link 
              href="/news" 
              onClick={() => setMobileMenuOpen(false)} 
              className="flex items-center gap-2.5 py-2 px-3 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#162036] hover:text-blue-600 dark:hover:text-sky-400 transition-colors"
            >
              <Newspaper className="w-4 h-4 text-sky-500" />
              <span>Tin Tức & Cẩm Nang</span>
            </Link>'''

text_norm = text.replace('\r\n', '\n')
target_norm = target.replace('\r\n', '\n')
replacement_norm = replacement.replace('\r\n', '\n')

if target_norm in text_norm:
    text_norm = text_norm.replace(target_norm, replacement_norm)
    with open(path, 'w', encoding='utf-8', newline='\r\n') as f:
        f.write(text_norm)
    print('Updated mobile menu with Tin Tức!')
else:
    print('Target not found in Navbar.tsx!')
