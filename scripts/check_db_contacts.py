import sqlite3

conn = sqlite3.connect(r'C:\Users\H2PC\.gemini\antigravity\scratch\roblox-asset-marketplace\prisma\dev.db')
cur = conn.cursor()
cur.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = [r[0] for r in cur.fetchall()]
print('Tables:', tables)

for t in ['PaymentProvider', 'Setting', 'User']:
    if t in tables:
        cur.execute(f"SELECT * FROM {t} LIMIT 5;")
        rows = cur.fetchall()
        print(f'{t} rows:', len(rows))
        for r in rows:
            print('  ', repr(r))
