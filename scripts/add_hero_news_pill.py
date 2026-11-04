path = r'C:\Users\H2PC\.gemini\antigravity\scratch\roblox-asset-marketplace\src\components\home\EditorialHero.tsx'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

target = '''            <Link
              href="/marketplace?q=UI"
              className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-[#162238] hover:bg-sky-500 hover:text-white dark:hover:bg-sky-500 dark:hover:text-white text-slate-700 dark:text-slate-300 transition-colors whitespace-nowrap"
            >
              UI Kits
            </Link>'''

replacement = '''            <Link
              href="/marketplace?q=UI"
              className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-[#162238] hover:bg-sky-500 hover:text-white dark:hover:bg-sky-500 dark:hover:text-white text-slate-700 dark:text-slate-300 transition-colors whitespace-nowrap"
            >
              UI Kits
            </Link>
            <Link
              href="/news"
              className="px-3 py-1 rounded-xl bg-amber-500/15 hover:bg-amber-500 hover:text-slate-950 text-amber-600 dark:text-amber-400 border border-amber-500/30 transition-colors whitespace-nowrap flex items-center gap-1 font-bold"
            >
              <BookOpen className="w-3 h-3 text-amber-500" />
              <span>Cẩm Nang Studio</span>
            </Link>'''

text_norm = text.replace('\r\n', '\n')
target_norm = target.replace('\r\n', '\n')
replacement_norm = replacement.replace('\r\n', '\n')

if target_norm in text_norm:
    text_norm = text_norm.replace(target_norm, replacement_norm)
    with open(path, 'w', encoding='utf-8', newline='\r\n') as f:
        f.write(text_norm)
    print("SUCCESS")
else:
    print("TARGET NOT FOUND")
