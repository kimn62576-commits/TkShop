file_path = r"C:\Users\H2PC\.gemini\antigravity\scratch\roblox-asset-marketplace\src\lib\payment\adapter.ts"

with open(file_path, "r", encoding="utf-8") as f:
    code = f.read()

code = code.replace(
    "const bonusRate = 0.10;",
    "const bonusRate = 0.20;"
).replace(
    "+10% Khuyến mại",
    "+20% Khuyến mại"
).replace(
    "+10% khuyến mại",
    "+20% khuyến mại"
).replace(
    "+10% Bonus",
    "+20% Bonus"
)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(code)

print("Updated adapter.ts with 20% bonus rate!")
