file_path = r"C:\Users\H2PC\.gemini\antigravity\scratch\roblox-asset-marketplace\src\components\home\EditorialHero.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    code = f.read()

code = code.replace(
    'onClick={onOpenDeposit}',
    '''onClick={() => {
              if (onOpenDeposit) onOpenDeposit();
              else if (typeof window !== "undefined") {
                window.dispatchEvent(new Event("openDepositModal"));
              }
            }}'''
)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(code)

print("Updated EditorialHero with robust deposit click handler!")
