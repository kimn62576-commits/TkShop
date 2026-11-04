import sqlite3

conn = sqlite3.connect(r"C:\Users\H2PC\.gemini\antigravity\scratch\roblox-asset-marketplace\prisma\dev.db")
cursor = conn.cursor()

# Cập nhật thông tin ngân hàng thật vào payment_providers
cursor.execute("""
UPDATE payment_providers 
SET bankName = 'MBBank',
    bankAccount = '0777776025',
    bankAccountName = 'NGUYEN HUYNH TRUNG HIEU'
WHERE code = 'VIETQR'
""")

conn.commit()
print("Updated payment_providers:", cursor.rowcount, "rows")

cursor.execute("SELECT code, bankName, bankAccount, bankAccountName FROM payment_providers WHERE code = 'VIETQR'")
print("Result:", cursor.fetchall())
