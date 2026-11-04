import re

# 1. Update EditorialHero.tsx
hero_path = r'C:\Users\H2PC\.gemini\antigravity\scratch\roblox-asset-marketplace\src\components\home\EditorialHero.tsx'
with open(hero_path, 'r', encoding='utf-8') as f:
    hero = f.read()

hero = hero.replace(
    'Hỗ trợ Ultraview 24/7 trực tiếp',
    'Chủ shop: Nguyễn Trọng Khang • Discord: TKhang098'
)

with open(hero_path, 'w', encoding='utf-8', newline='\r\n') as f:
    f.write(hero)
print("EditorialHero.tsx refined!")

# 2. Update Navbar.tsx
nav_path = r'C:\Users\H2PC\.gemini\antigravity\scratch\roblox-asset-marketplace\src\components\layout\Navbar.tsx'
with open(nav_path, 'r', encoding='utf-8') as f:
    nav = f.read()

# Add Discord link to top bar
old_top_contacts = '''          <div className="flex items-center gap-4">
            <a 
              href="https://zalo.me/0394063917" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 font-bold font-mono transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
              <span>Hotline / Zalo: 0394.063.917</span>
            </a>
          </div>'''

new_top_contacts = '''          <div className="flex items-center gap-4">
            <a 
              href="https://zalo.me/0394063917" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 font-bold transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
              <span>Hotline / Zalo: 0394.063.917</span>
            </a>
            <a
              href="https://discord.gg/94j4kJF3Ht"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:text-[#5865F2] font-bold transition-colors"
            >
              <span>Discord: TKhang098</span>
            </a>
          </div>'''

if old_top_contacts in nav:
    nav = nav.replace(old_top_contacts, new_top_contacts)

# Add Discord and Zalo in the Support Dropdown
support_dropdown_old = '''                  <Link href="/support#uy-tin" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#162036] hover:text-emerald-500 transition-colors">
                    <Award className="w-4 h-4 text-emerald-500" />
                    <span className="font-semibold">Uy Tín Của Shop</span>
                  </Link>
                </div>'''

support_dropdown_new = '''                  <Link href="/support#uy-tin" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#162036] hover:text-emerald-500 transition-colors">
                    <Award className="w-4 h-4 text-emerald-500" />
                    <span className="font-semibold">Uy Tín Của Shop</span>
                  </Link>
                  <a href="https://discord.gg/94j4kJF3Ht" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#162036] hover:text-[#5865F2] transition-colors">
                    <Sparkles className="w-4 h-4 text-[#5865F2]" />
                    <span className="font-semibold">Discord: TKhang098</span>
                  </a>
                  <a href="https://zalo.me/0394063917" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#162036] hover:text-sky-500 transition-colors">
                    <PhoneCall className="w-4 h-4 text-emerald-500" />
                    <span className="font-semibold">Zalo / Tele: 0394.063.917</span>
                  </a>
                </div>'''

if support_dropdown_old in nav:
    nav = nav.replace(support_dropdown_old, support_dropdown_new)

with open(nav_path, 'w', encoding='utf-8', newline='\r\n') as f:
    f.write(nav)
print("Navbar.tsx refined!")
