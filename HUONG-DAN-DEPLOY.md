# HƯỚNG DẪN DEPLOY TOÀN DIỆN CHO WEBSITE TKSHOP.VN

Dưới đây là 3 cách dễ nhất để đưa trang web **TKSHOP.VN** lên môi trường Internet thực tế:

---

## 🌟 CÁCH 1: DEPLOY LÊN VERCEL (Khuyên Dùng: Nhanh Nhất, Miễn Phí 100%)

Vercel là nền tảng máy chủ chính thức của Next.js, tốc độ CDN cực nhanh tại Việt Nam.

1. **Bước 1**: Giải nén file zip hoặc tải mã nguồn lên **GitHub** (hoặc GitLab):
   ```bash
   git init
   git add .
   git commit -m "Initial commit TKSHOP"
   git branch -M main
   git remote add origin https://github.com/Tên_Của_Bạn/tkshop.git
   git push -u origin main
   ```
2. **Bước 2**: Truy cập [https://vercel.com](https://vercel.com) và đăng nhập bằng tài khoản GitHub.
3. **Bước 3**: Chọn **Add New Project** -> Chọn repository `tkshop`.
4. **Bước 4**: Tại mục **Environment Variables**, sao chép nội dung từ file `.env.example` vào:
   - `JWT_SECRET`: `tkshop_jwt_secret_key_super_robust_2026_xyz_a729e1f8`
   - `DOWNLOAD_TOKEN_SECRET`: `tkshop_download_token_secret_key_2026_abc_92ef`
   - `NEXT_PUBLIC_SITE_URL`: `https://ten-mien-cua-ban.vercel.app` (hoặc domain thật của bạn)
5. **Bước 5**: Bấm **Deploy**. Vercel sẽ tự động build và cấp domain hoạt động ngay sau 2 phút!

---

## 🖥️ CÁCH 2: DEPLOY LÊN VPS LINUX (Ubuntu / Debian / CentOS)

Dành cho bạn nào thuê máy chủ VPS (như TinoHost, VietNix, AZDIGI, DigitalOcean, Hetzner, AWS...):

1. **Bước 1: Upload file zip lên VPS**:
   - Dùng FileZilla hoặc WinSCP upload file zip `TKSHOP-Deploy-Package.zip` vào thư mục `/var/www/tkshop`.
   - Hoặc dùng lệnh:
     ```bash
     mkdir -p /var/www/tkshop && cd /var/www/tkshop
     unzip TKSHOP-Deploy-Package.zip
     ```

2. **Bước 2: Cài đặt Node.js 20 & PM2**:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   sudo npm install -g pm2
   ```

3. **Bước 3: Chạy script deploy tự động**:
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

4. **Bước 4: Cấu hình Nginx trỏ Domain (Optional)**:
   ```nginx
   server {
       server_name tkshop.vn www.tkshop.vn;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
   Cài chứng chỉ SSL miễn phí: `sudo certbot --nginx -d tkshop.vn -d www.tkshop.vn`

---

## 🐳 CÁCH 3: DEPLOY BẰNG DOCKER (1 Dòng Lệnh)

Nếu VPS của bạn đã cài Docker & Docker Compose:

```bash
docker compose up -d --build
```

Ứng dụng sẽ tự động đóng gói, khởi tạo database và chạy ngầm tại cổng `3000`.

---

## 🔐 TÀI KHOẢN QUẢN TRỊ ADMIN MẶC ĐỊNH

- **Tài khoản Super Admin**:
  - Email: `superadmin@robloxmarket.dev`
  - Mật khẩu: `Admin@2026!`
- **Tài khoản Khách Hàng Test**:
  - Email: `developer@robloxmarket.dev`
  - Mật khẩu: `DevPass@2026!`
- **Trang Admin**: Truy cập đường dẫn `/admin` sau khi đăng nhập.
