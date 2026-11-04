file_path = r"C:\Users\H2PC\.gemini\antigravity\scratch\roblox-asset-marketplace\src\components\wallet\DepositModal.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    code = f.read()

code = code.replace(
    'import React, { useState } from "react";',
    'import React, { useState, useEffect } from "react";'
)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(code)

print("Added useEffect import to DepositModal.tsx!")
