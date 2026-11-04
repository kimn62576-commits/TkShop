file_path = r"C:\Users\H2PC\.gemini\antigravity\scratch\roblox-asset-marketplace\src\components\home\EditorialWorkflow.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    code = f.read()

code = code.replace(
    'import React, { useState } from "react";',
    'import React, { useState } from "react";\nimport Link from "next/link";'
)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(code)

print("Added Link import to EditorialWorkflow.tsx!")
