import os
import re
import sqlite3

workspace = r'C:\Users\H2PC\.gemini\antigravity\scratch\roblox-asset-marketplace'

# 1. UPDATE dev.db
db_path = os.path.join(workspace, 'prisma', 'dev.db')
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    # Update payment_providers
    cur.execute("""
        UPDATE payment_providers 
        SET bankAccount = '0394063917', bankAccountName = 'NGUYEN TRONG KHANG'
        WHERE code = 'VIETQR';
    """)
    # Update website_settings
    cur.execute("""
        UPDATE website_settings 
        SET value = 'lilkhang211@gmail.com'
        WHERE key = 'SUPPORT_EMAIL';
    """)
    # Promote lilkhang211@gmail.com to SUPER_ADMIN
    cur.execute("""
        UPDATE users 
        SET role = 'SUPER_ADMIN'
        WHERE email = 'lilkhang211@gmail.com';
    """)
    conn.commit()
    conn.close()
    print("dev.db updated successfully!")

# 2. UPDATE .env and .env.example
for env_file in ['.env', '.env.example']:
    p = os.path.join(workspace, env_file)
    if os.path.exists(p):
        with open(p, 'r', encoding='utf-8') as f:
            c = f.read()
        c = re.sub(r'BANK_ACCOUNT=".*?"', 'BANK_ACCOUNT="0394063917"', c)
        c = re.sub(r'BANK_ACCOUNT_NAME=".*?"', 'BANK_ACCOUNT_NAME="NGUYEN TRONG KHANG"', c)
        with open(p, 'w', encoding='utf-8', newline='\r\n') as f:
            f.write(c)
        print(f"{env_file} updated!")

# 3. UPDATE deposit route fallback
deposit_route = os.path.join(workspace, 'src', 'app', 'api', 'wallet', 'deposit', 'route.ts')
if os.path.exists(deposit_route):
    with open(deposit_route, 'r', encoding='utf-8') as f:
        c = f.read()
    c = c.replace('0777776025', '0394063917')
    c = c.replace('NGUYEN HUYNH TRUNG HIEU', 'NGUYEN TRONG KHANG')
    with open(deposit_route, 'w', encoding='utf-8', newline='\r\n') as f:
        f.write(c)
    print("deposit/route.ts updated!")

# 4. UPDATE Navbar.tsx
nav_path = os.path.join(workspace, 'src', 'components', 'layout', 'Navbar.tsx')
if os.path.exists(nav_path):
    with open(nav_path, 'r', encoding='utf-8') as f:
        c = f.read()
    c = c.replace('https://zalo.me/0777776025', 'https://zalo.me/0394063917')
    c = c.replace('0777.776.025', '0394.063.917')
    c = c.replace('0777776025', '0394063917')
    with open(nav_path, 'w', encoding='utf-8', newline='\r\n') as f:
        f.write(c)
    print("Navbar.tsx updated!")

# 5. UPDATE EditorialHero.tsx
hero_path = os.path.join(workspace, 'src', 'components', 'home', 'EditorialHero.tsx')
if os.path.exists(hero_path):
    with open(hero_path, 'r', encoding='utf-8') as f:
        c = f.read()
    c = c.replace('https://zalo.me/0777776025', 'https://zalo.me/0394063917')
    c = c.replace('0777.776.025', '0394.063.917')
    c = c.replace('0777776025', '0394063917')
    c = c.replace('Zalo: 0777.776.025', 'Zalo / Tele: 0394.063.917')
    c = c.replace('Zalo: 0394.063.917', 'Zalo / Tele: 0394.063.917')
    with open(hero_path, 'w', encoding='utf-8', newline='\r\n') as f:
        f.write(c)
    print("EditorialHero.tsx updated!")

# 6. UPDATE HomeHeroBoard.tsx
board_path = os.path.join(workspace, 'src', 'components', 'home', 'HomeHeroBoard.tsx')
if os.path.exists(board_path):
    with open(board_path, 'r', encoding='utf-8') as f:
        c = f.read()
    c = c.replace('https://zalo.me/0777776025', 'https://zalo.me/0394063917')
    c = c.replace('0777.776.025', '0394.063.917')
    c = c.replace('0777776025', '0394063917')
    c = c.replace('Nguyễn Huỳnh Trung Hiếu', 'Nguyễn Trọng Khang')
    with open(board_path, 'w', encoding='utf-8', newline='\r\n') as f:
        f.write(c)
    print("HomeHeroBoard.tsx updated!")

# 7. UPDATE HomeFAQ.tsx
faq_path = os.path.join(workspace, 'src', 'components', 'home', 'HomeFAQ.tsx')
if os.path.exists(faq_path):
    with open(faq_path, 'r', encoding='utf-8') as f:
        c = f.read()
    c = c.replace('0777.776.025', '0394.063.917')
    c = c.replace('0777776025', '0394063917')
    with open(faq_path, 'w', encoding='utf-8', newline='\r\n') as f:
        f.write(c)
    print("HomeFAQ.tsx updated!")

# 8. UPDATE WelcomeAnnouncementModal.tsx
modal_path = os.path.join(workspace, 'src', 'components', 'common', 'WelcomeAnnouncementModal.tsx')
if os.path.exists(modal_path):
    with open(modal_path, 'r', encoding='utf-8') as f:
        c = f.read()
    c = c.replace('https://zalo.me/0777776025', 'https://zalo.me/0394063917')
    with open(modal_path, 'w', encoding='utf-8', newline='\r\n') as f:
        f.write(c)
    print("WelcomeAnnouncementModal.tsx updated!")

# 9. UPDATE login page
login_path = os.path.join(workspace, 'src', 'app', '(auth)', 'login', 'page.tsx')
if os.path.exists(login_path):
    with open(login_path, 'r', encoding='utf-8') as f:
        c = f.read()
    c = c.replace('0777.776.025', '0394.063.917')
    with open(login_path, 'w', encoding='utf-8', newline='\r\n') as f:
        f.write(c)
    print("login/page.tsx updated!")

# 10. UPDATE news articles and pages
news_data = os.path.join(workspace, 'src', 'data', 'newsArticles.ts')
if os.path.exists(news_data):
    with open(news_data, 'r', encoding='utf-8') as f:
        c = f.read()
    c = c.replace('Nguyễn Huỳnh Trung Hiếu', 'Nguyễn Trọng Khang')
    c = c.replace('0777.776.025', '0394.063.917')
    c = c.replace('0777776025', '0394063917')
    with open(news_data, 'w', encoding='utf-8', newline='\r\n') as f:
        f.write(c)
    print("newsArticles.ts updated!")

for np in [os.path.join(workspace, 'src', 'app', '(public)', 'news', 'page.tsx'),
           os.path.join(workspace, 'src', 'app', '(public)', 'news', '[slug]', 'page.tsx')]:
    if os.path.exists(np):
        with open(np, 'r', encoding='utf-8') as f:
            c = f.read()
        c = c.replace('https://zalo.me/0777776025', 'https://zalo.me/0394063917')
        c = c.replace('0777.776.025', '0394.063.917')
        c = c.replace('0777776025', '0394063917')
        with open(np, 'w', encoding='utf-8', newline='\r\n') as f:
            f.write(c)
        print(f"{os.path.basename(np)} updated!")

print("SUCCESS: All contact info updated!")
