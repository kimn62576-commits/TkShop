import sqlite3

conn = sqlite3.connect(r'C:\Users\H2PC\.gemini\antigravity\scratch\roblox-asset-marketplace\prisma\dev.db')
cur = conn.cursor()

for t in ['payment_providers', 'website_settings', 'users']:
    cur.execute(f"SELECT * FROM {t};")
    rows = cur.fetchall()
    print(f'=== Table {t} ({len(rows)} rows) ===')
    for r in rows:
        print('  ', ascii(r))
