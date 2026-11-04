import sqlite3, sys
sys.stdout.reconfigure(encoding='utf-8')
conn = sqlite3.connect(r"C:\Users\H2PC\.gemini\antigravity\scratch\roblox-asset-marketplace\prisma\dev.db")
cursor = conn.cursor()
cursor.execute("SELECT code, name, bankName, bankAccount, bankAccountName, isActive FROM payment_providers")
print("payment_providers:", cursor.fetchall())
cursor.execute("SELECT key, value FROM website_settings WHERE key LIKE '%BANK%' OR key LIKE '%VIETQR%'")
print("website_settings:", cursor.fetchall())
