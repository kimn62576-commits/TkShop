import re

overlay_path = r'C:\Users\H2PC\.gemini\antigravity\scratch\roblox-asset-marketplace\src\components\wallet\DepositAnimationOverlay.tsx'
with open(overlay_path, 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace(
    'text-[11px] font-mono font-black uppercase tracking-wider',
    'text-[11px] font-black uppercase tracking-wider'
)
c = c.replace(
    'p-4 rounded-2xl bg-[#080D1A]/95 border border-[#1E2D4A] shadow-inner space-y-2.5 text-xs font-mono',
    'p-4 rounded-2xl bg-[#080D1A]/95 border border-[#1E2D4A] shadow-inner space-y-2.5 text-xs'
)
c = c.replace(
    'className="w-5 h-auto object-contain drop-shadow"',
    'className="w-7 h-auto object-contain drop-shadow"'
)

with open(overlay_path, 'w', encoding='utf-8', newline='\r\n') as f:
    f.write(c)
print('DepositAnimationOverlay.tsx updated!')
