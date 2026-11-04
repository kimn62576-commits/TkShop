path = r'C:\Users\H2PC\.gemini\antigravity\scratch\roblox-asset-marketplace\src\components\layout\Navbar.tsx'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

# Replace exact block
old_block = '''              {/* ẢNH TIỀN VIỆT NAM VNĐ PNG 3D SẮC NÉT */}
              <div className="relative w-7 h-7 flex-shrink-0 flex items-center justify-center group-hover:scale-115 group-hover:-rotate-6 transition-transform duration-300">
                <div className="absolute inset-0 rounded-full bg-yellow-300/60 blur-xs animate-pulse pointer-events-none" />
                <img
                  src="/money-vnd-sm.png"
                  alt="Tiền Việt Nam VNĐ"
                  className="w-7 h-auto max-h-7 object-contain relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]"
                />
              </div>'''

new_block = '''              {/* ẢNH TIỀN 500K VIỆT NAM SẮC NÉT */}
              <div className="relative w-8 h-6 flex-shrink-0 flex items-center justify-center group-hover:scale-115 group-hover:-rotate-3 transition-transform duration-300">
                <img
                  src="/money-vnd-sm.png"
                  alt="Tiền 500k VNĐ"
                  className="w-8 h-auto object-contain relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]"
                />
              </div>'''

# Normalize line breaks for matching
text_norm = text.replace('\r\n', '\n')
old_norm = old_block.replace('\r\n', '\n')
new_norm = new_block.replace('\r\n', '\n')

if old_norm in text_norm:
    text_norm = text_norm.replace(old_norm, new_norm)
    # Also update mobile icon
    text_norm = text_norm.replace(
        'className="w-7 h-auto max-h-7 object-contain drop-shadow-sm"',
        'className="w-8 h-auto object-contain drop-shadow-sm"'
    )
    with open(path, 'w', encoding='utf-8', newline='\r\n') as f:
        f.write(text_norm)
    print("SUCCESS: Navbar.tsx deposit icon updated!")
else:
    print("ERROR: old_block not found in Navbar.tsx!")
