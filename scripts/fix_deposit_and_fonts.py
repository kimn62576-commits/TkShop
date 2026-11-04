import re

# 1. FIX NAVBAR.TSX
navbar_path = r'C:\Users\H2PC\.gemini\antigravity\scratch\roblox-asset-marketplace\src\components\layout\Navbar.tsx'
with open(navbar_path, 'r', encoding='utf-8') as f:
    nav_content = f.read()

# Replace desktop deposit icon
nav_content = re.sub(
    r'<div className="relative w-7 h-7 flex-shrink-0 flex items-center justify-center group-hover:scale-115 group-hover:-rotate-6 transition-transform duration-300">.*?</div>\s*</div>',
    '''<div className="relative w-8 h-6 flex-shrink-0 flex items-center justify-center group-hover:scale-115 group-hover:-rotate-3 transition-transform duration-300">
                <img
                  src="/money-vnd-sm.png"
                  alt="Tiền 500k VNĐ"
                  className="w-8 h-auto object-contain relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]"
                />
              </div>''',
    nav_content,
    flags=re.DOTALL
)

# Replace mobile deposit icon
nav_content = re.sub(
    r'<img\s+src="/money-vnd-sm\.png"\s+alt="Tiền Việt Nam"\s+className="w-7 h-auto max-h-7 object-contain drop-shadow-sm"\s*/>',
    r'<img src="/money-vnd-sm.png" alt="Tiền 500k VNĐ" className="w-8 h-auto object-contain drop-shadow-sm" />',
    nav_content
)

with open(navbar_path, 'w', encoding='utf-8', newline='\r\n') as f:
    f.write(nav_content)
print("Navbar.tsx updated!")

# 2. FIX EDITORIALHERO.TSX
hero_path = r'C:\Users\H2PC\.gemini\antigravity\scratch\roblox-asset-marketplace\src\components\home\EditorialHero.tsx'
with open(hero_path, 'r', encoding='utf-8') as f:
    hero_content = f.read()

# Fix top status pill: remove font-mono from Vietnamese text
hero_content = hero_content.replace(
    'text-[11px] font-mono font-bold tracking-wider uppercase text-slate-700 dark:text-slate-300',
    'text-[11px] font-bold tracking-wide uppercase text-slate-700 dark:text-slate-300'
)
hero_content = hero_content.replace(
    'hidden md:flex items-center gap-3 text-xs font-mono text-slate-500 dark:text-slate-400',
    'hidden md:flex items-center gap-3 text-xs font-medium text-slate-500 dark:text-slate-400'
)

# Fix Holographic chips on banner: remove font-mono from Vietnamese text
hero_content = hero_content.replace(
    'text-[10px] sm:text-[11px] font-mono font-bold flex items-center gap-2 shadow-xl shadow-black/60 pointer-events-none',
    'text-[10px] sm:text-[11px] font-bold flex items-center gap-2 shadow-xl shadow-black/60 pointer-events-none'
)
hero_content = hero_content.replace(
    'text-[11px] font-mono font-bold items-center gap-2 shadow-xl shadow-black/60 pointer-events-none',
    'text-[11px] font-bold items-center gap-2 shadow-xl shadow-black/60 pointer-events-none'
)
hero_content = hero_content.replace(
    'text-[10px] sm:text-[11px] font-mono font-bold flex items-center gap-2 shadow-xl shadow-black/60 pointer-events-none',
    'text-[10px] sm:text-[11px] font-bold flex items-center gap-2 shadow-xl shadow-black/60 pointer-events-none'
)

# Fix Deposit button in hero: size and alignment
hero_content = re.sub(
    r'<div className="relative w-6 h-6 flex-shrink-0 flex items-center justify-center[^"]*">\s*<img\s+src="/money-vnd-sm\.png"[^>]*/>\s*</div>',
    '''<div className="relative w-8 h-6 flex-shrink-0 flex items-center justify-center group-hover:scale-120 group-hover:-rotate-3 transition-transform duration-300">
                  <img
                    src="/money-vnd-sm.png"
                    alt="Tiền 500k VNĐ"
                    className="w-8 h-auto object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
                  />
                </div>''',
    hero_content
)

# Fix Thẻ 3: Khuyến Mại Nạp Ví VietQR (remove font-mono from Vietnamese words and use 500k icon)
hero_content = hero_content.replace(
    '''<div className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Ưu Đãi Nạp Ví
                </div>
                <div className="text-sm font-black text-amber-600 dark:text-amber-400 font-mono truncate">
                  VietQR +20% Khuyến Mãi
                </div>''',
    '''<div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Ưu Đãi Nạp Ví
                </div>
                <div className="text-sm font-black text-amber-600 dark:text-amber-400 truncate">
                  VietQR <span className="font-mono text-emerald-500">+20%</span> Khuyến Mãi
                </div>'''
)

# Also replace the generic Gift icon in Card 3 with the 500k banknote icon
hero_content = hero_content.replace(
    '''<div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <Gift className="w-5 h-5" />
              </div>''',
    '''<div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:-rotate-3 transition-transform">
                <img src="/money-vnd-sm.png" alt="500k" className="w-8 h-auto object-contain drop-shadow-sm" />
              </div>'''
)

with open(hero_path, 'w', encoding='utf-8', newline='\r\n') as f:
    f.write(hero_content)
print("EditorialHero.tsx updated!")
