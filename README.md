# 🚀 ROBLOX STUDIO ASSET MARKETPLACE

Hệ thống Sàn Thương Mại Điện Tử chuyên nghiệp chuyên phân phối các sản phẩm kỹ thuật số dành cho Roblox Studio: **Combat Systems (ACS), Luau Scripts, Full RPG Engines, UI Kits, Cyberpunk Maps, A-Chassis Vehicles, và Productivity Plugins**.

Nền tảng được xây dựng theo kiến trúc **Full-stack Enterprise**, giao diện tối (Dark Theme Developer Marketplace), kết nối cơ sở dữ liệu quan hệ thực tế qua **Prisma ORM**, hệ thống ví nội bộ **Wallet Ledger ACID**, nạp tiền tự động **VietQR Banking** và phân phối tệp tin an toàn **Secure Digital Delivery (Signed Expiring Download Tokens)**.

---

## 📸 TỔNG QUAN HỆ THỐNG

| Module | Công nghệ & Tính năng chính |
|---|---|
| **Frontend Storefront** | Next.js 14 App Router, TypeScript, Tailwind CSS, Lucide Icons, Responsive Mobile/Desktop |
| **Backend & APIs** | Next.js Route Handlers, Database Interactive Transactions (`prisma.$transaction`), Rate Limiting, Zod Schema Validation |
| **Database** | PostgreSQL & SQLite tương thích hoàn hảo qua Prisma ORM (27 bảng quan hệ chặt chẽ) |
| **Xác thực & RBAC** | Session Cookie HTTP-Only, JWT Tokens, Mật khẩu băm Bcrypt 10 vòng, Phân quyền 4 cấp: `GUEST`, `USER`, `ADMIN`, `SUPER_ADMIN` |
| **Ví & Thanh Toán** | Nạp tiền tự động VietQR (MBBank BIN 970422), Webhook HMAC-SHA256, Chống xử lý trùng lặp (Idempotency), Môi trường Sandbox Testnet |
| **Giao Nhận File Số** | Phân phối tệp tin qua Token ký số có hạn sử dụng (10 phút), lưu trữ bảo vệ ngoài thư mục Public, ghi vết lượt tải (Download Logs) |
| **Quản trị Admin** | Control Panel độc lập: Quản lý sản phẩm, Duyệt nạp tiền, Hoàn tiền đơn hàng, Phân quyền User, Tạo Coupon, Nhật ký kiểm toán (Audit Logs) |

---

## 🎨 THIẾT KẾ GIAO DIỆN & DESIGN TOKENS

Bảng màu theo chuẩn công nghệ tối (Developer Dark Theme):
- **Background chính**: `#0B0D12`
- **Secondary Background**: `#11151D`
- **Card bề mặt**: `#161B25`
- **Card Hover**: `#1C2330`
- **Màu thương hiệu (Primary)**: `#5865F2` (Roblox / Discord Dev Blue)
- **Primary Hover**: `#4752C4`
- **Văn bản chính**: `#F5F6FA`
- **Văn bản phụ (Muted)**: `#9299A8`
- **Đường viền (Border)**: `#252B38`
- **Trạng thái thành công**: `#10B981` (Green Accent)
- **Cảnh báo**: `#F59E0B` (Warning Amber)
- **Lỗi / Xóa**: `#ED4245` (Danger Red)

---

## 🔑 TÀI KHOẢN MẪU KHỞI TẠO (SEEDED ACCOUNTS)

Hệ thống đã được nạp sẵn dữ liệu mẫu thực tế và 3 tài khoản thử nghiệm:

| Email | Mật khẩu | Quyền hạn (Role) | Số dư ví |
|---|---|---|---|
| `superadmin@robloxmarket.dev` | `SuperAdmin@2026!` | `SUPER_ADMIN` | 10.000.000đ |
| `admin@robloxmarket.dev` | `Admin@2026!` | `ADMIN` | 2.000.000đ |
| `developer@robloxmarket.dev` | `DevPass@2026!` | `USER` | 750.000đ |

*(Tại màn hình Đăng Nhập `/login`, hệ thống có sẵn các nút bấm **1-Click Quick Fill** giúp bạn đăng nhập thử nghiệm ngay lập tức mà không cần gõ phím).*

---

## 📂 CẤU TRÚC THƯ MỤC DỰ ÁN

```
roblox-asset-marketplace/
├── prisma/
│   ├── schema.prisma           # Cấu trúc 27 bảng dữ liệu (SQLite dev / PostgreSQL prod)
│   ├── schema.postgresql.prisma# Schema PostgreSQL chuẩn production
│   ├── seed.ts                 # Script nạp dữ liệu mẫu phong phú
│   └── docker-compose.yml      # Khởi chạy PostgreSQL + Adminer trong 1 lệnh
├── storage/
│   └── protected/assets/       # Thư mục lưu trữ an toàn các file .rbxm, .rbxl, .luau
├── src/
│   ├── app/
│   │   ├── (auth)/             # Đăng nhập & Đăng ký
│   │   ├── (public)/           # Trang chủ, Marketplace, Chi tiết sản phẩm, Hỗ trợ
│   │   ├── dashboard/          # Khu vực người dùng (Overview, Library, Wallet, Orders, Settings)
│   │   ├── admin/              # Khu vực quản trị viên Control Panel
│   │   └── api/                # 24 Route Handlers xử lý nghiệp vụ Backend
│   ├── components/             # UI Components (Navbar, Footer, Modals, Cards)
│   ├── lib/
│   │   ├── prisma.ts           # Global Prisma Client
│   │   ├── auth.ts             # JWT, Cookie, Bcrypt & RBAC
│   │   ├── admin-logger.ts     # Ghi nhật ký kiểm toán Admin
│   │   ├── payment/            # VietQR & HMAC Webhook Adapter
│   │   └── storage/            # Digital Delivery & Signed Tokens
│   └── types/                  # TypeScript Data Types
```

---

## ⚡ HƯỚNG DẪN CÀI ĐẶT & CHẠY DỰ ÁN (QUICK START)

### 1. Yêu cầu môi trường
- **Node.js**: v18+ hoặc v20+ (Khuyên dùng LTS)
- **NPM** hoặc **Yarn**

### 2. Cài đặt các gói phụ thuộc
```bash
npm install
```

### 3. Khởi tạo Cơ Sở Dữ Liệu & Nạp Dữ Liệu Mẫu
Dự án được cấu hình sẵn chế độ SQLite cục bộ (`prisma/dev.db`) giúp bạn chạy ngay lập tức mà không cần cài đặt phần mềm Database ngoài:
```bash
# 1. Đẩy schema vào cơ sở dữ liệu
npm run db:push

# 2. Sinh Prisma Client
npm run db:generate

# 3. Nạp dữ liệu sản phẩm, danh mục, tài khoản mẫu
npm run db:seed
```

### 4. Khởi chạy máy chủ phát triển
```bash
npm run dev
```
Truy cập trình duyệt tại: **http://localhost:3000**

---

## 💳 QUY TRÌNH NẠP TIỀN VIETQR & THANH TOÁN

### A. Nạp tiền qua VietQR:
1. Người dùng bấm **"+ Nạp Tiền"** trên thanh điều hướng hoặc trong mục **Ví Tiền**.
2. Nhập số tiền (ví dụ: 100.000đ).
3. Backend sinh đơn nạp `Deposit` với mã định danh duy nhất (ví dụ: `RBXDEP610283`).
4. Hiển thị mã QR chuẩn Napas VietQR với đúng STK, Ngân hàng MBBank và nội dung chuyển tiền.
5. **Thử nghiệm nhanh trong môi trường phát triển (Sandbox)**: Bấm nút **"Thử nghiệm: Xác nhận nạp ngay (Sandbox)"**, hệ thống sẽ kích hoạt Backend Adapter xác thực chữ ký và cộng tiền tức thì vào ví!

### B. Mua sản phẩm & Giao nhận số (Digital Delivery):
1. Người dùng chọn sản phẩm và bấm **"Mua Ngay"**.
2. Cửa sổ `PurchaseModal` xuất hiện, cho phép nhập mã giảm giá (`WELCOME10` - giảm 10%, hoặc `ROBLOXDEV` - giảm 50.000đ).
3. Hệ thống kiểm tra số dư ví. Khi bấm **"Xác Nhận Thanh Toán"**:
   - Backend thực thi Database Transaction: Khấu trừ số dư ví, tạo mã đơn hàng `ORD-...`, ghi nhận giao dịch ví và cấp quyền sở hữu.
4. Người dùng nhận file thông qua **Signed Download URL** (`/api/download/[productId]`). File tải về là tài nguyên sạch được ký số xác thực.

---

## 🛡️ HƯỚNG DẪN CHUYỂN ĐỔI SANG POSTGRESQL (PRODUCTION)

Nếu bạn muốn triển khai trên hệ thống PostgreSQL (Supabase, Neon, AWS RDS hoặc Docker):

1. Khởi động PostgreSQL qua Docker:
   ```bash
   docker-compose up -d
   ```
2. Cập nhật biến môi trường `.env`:
   ```env
   DATABASE_URL="postgresql://postgres:postgrespassword2026@localhost:5432/roblox_marketplace?schema=public"
   ```
3. Đổi provider trong `prisma/schema.prisma` từ `sqlite` sang `postgresql`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
4. Đẩy schema và seed dữ liệu:
   ```bash
   npx prisma db push
   npm run db:seed
   ```

---

## 🔒 BẢO MẬT HỆ THỐNG
- **Kiểm tra quyền hạn phía Máy chủ**: Mọi API quản trị (`/api/admin/...`) đều kiểm tra nghiêm ngặt `user.role === 'ADMIN' || user.role === 'SUPER_ADMIN'`.
- **Phân cấp Super Admin**: Admin thông thường không thể tự phong cấp hoặc khóa tài khoản Super Admin.
- **Bảo mật Tệp Tin Trả Phí**: Các file `.rbxm` được lưu trữ độc lập ngoài thư mục tĩnh (`public/`). Người chưa mua hoặc chưa đăng nhập không thể tải được file.
- **Webhook HMAC-SHA256**: Kiểm tra toàn vẹn dữ liệu từ cổng thanh toán, ngăn chặn tấn công giả mạo yêu cầu nạp tiền.
