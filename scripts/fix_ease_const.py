import re

files = [
    r"C:\Users\H2PC\.gemini\antigravity\scratch\roblox-asset-marketplace\src\components\home\EditorialHero.tsx",
    r"C:\Users\H2PC\.gemini\antigravity\scratch\roblox-asset-marketplace\src\components\home\EditorialWorkflow.tsx",
]

for fp in files:
    with open(fp, "r", encoding="utf-8") as f:
        content = f.read()
    
    content = content.replace("ease: [0.16, 1, 0.3, 1]", "ease: [0.16, 1, 0.3, 1] as const")
    
    with open(fp, "w", encoding="utf-8") as f:
        f.write(content)
    print("Updated", fp)
