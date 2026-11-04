# 📡 TÀI LIỆU API CHI TIẾT (API SPECIFICATION)

Hệ thống cung cấp đầy đủ các RESTful API endpoints hỗ trợ ứng dụng Web và khả năng tích hợp bên thứ ba.

---

## 1. XÁC THỰC (AUTHENTICATION)

### `POST /api/auth/register`
Đăng ký tài khoản mới.
- **Request Body**:
```json
{
  "email": "developer@example.com",
  "password": "SecurePassword@123",
  "displayName": "CyberScripter",
  "robloxUsername": "Cyber_RBX"
}
```
- **Response**: `200 OK` (kèm HTTP-Only cookie `rbx_session_token`)

### `POST /api/auth/login`
Đăng nhập tài khoản.
- **Request Body**:
```json
{
  "email": "developer@example.com",
  "password": "SecurePassword@123"
}
```
- **Response**: `200 OK` (Thiết lập session cookie)

### `POST /api/auth/logout`
Hủy phiên đăng nhập và xóa cookie xác thực.

### `GET /api/auth/me`
Lấy thông tin người dùng hiện tại, bao gồm số dư ví và quyền hạn.

---

## 2. SẢN PHẨM & TÌM KIẾM (MARKETPLACE)

### `GET /api/products`
Truy vấn danh sách sản phẩm với bộ lọc nâng cao.
- **Query Parameters**:
  - `q`: Từ khóa tìm kiếm
  - `category`: Slug danh mục (e.g. `systems`, `scripts`, `ui-kits`)
  - `isFree`: `true` | `false`
  - `minPrice`: Giá tối thiểu
  - `maxPrice`: Giá tối đa
  - `sort`: `newest` | `popular` | `rating` | `price-low` | `price-high`
  - `page`: Số trang (mặc định: 1)
  - `limit`: Số lượng sản phẩm mỗi trang (mặc định: 12)

### `GET /api/search/suggestions?q=combat`
Lấy gợi ý kết quả tìm kiếm tự động khi người dùng gõ phím (Autosuggest).

---

## 3. VÍ & CỔNG NẠP VIETQR (WALLET & PAYMENT)

### `POST /api/wallet/deposit`
Tạo yêu cầu nạp tiền và sinh mã QR chuyển khoản VietQR.
- **Headers**: Yêu cầu cookie phiên đăng nhập.
- **Request Body**:
```json
{
  "amount": 100000
}
```
- **Response**:
```json
{
  "success": true,
  "deposit": {
    "transactionCode": "RBXDEP610283",
    "amount": 100000,
    "qrUrl": "https://img.vietqr.io/image/970422-999988886666-compact2.png?amount=100000&addInfo=RBXDEP610283...",
    "bankName": "MBBank",
    "bankAccountNumber": "999988886666",
    "bankAccountName": "ROBLOX ASSET MARKETPLACE",
    "transferContent": "RBXDEP610283",
    "expiresAt": "2026-10-30T19:20:00.000Z"
  }
}
```

### `POST /api/payments/webhook`
Webhook nhận thông báo biến động số dư từ ngân hàng (VietQR / SePay / Casso).
- **Headers**:
  - `x-signature`: Chữ ký HMAC-SHA256 tính từ body và `PAYMENT_WEBHOOK_SECRET`
- **Request Body**:
```json
{
  "transactionCode": "RBXDEP610283",
  "amount": 100000,
  "transferContent": "RBXDEP610283 thanh toan nap vi"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Wallet balance credited successfully",
  "transactionCode": "RBXDEP610283",
  "newBalance": 850000
}
```

### `POST /api/payments/sandbox-confirm`
Xác nhận nạp tiền thử nghiệm nhanh trong môi trường phát triển (Sandbox).

---

## 4. MUA HÀNG & PHÂN PHỐI TỆP TIN (PURCHASE & DELIVERY)

### `POST /api/orders/purchase`
Thực thi quy trình mua sản phẩm nguyên tử (Atomic Purchase Transaction).
- **Request Body**:
```json
{
  "productId": "clw9x08...",
  "couponCode": "WELCOME10"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Giao dịch thành công! Sản phẩm đã được thêm vào Thư viện của bạn.",
  "orderNumber": "ORD-109283-4912",
  "newBalance": 650000
}
```

### `GET /api/download/[productId]`
Tải tệp tin kỹ thuật số đã được bảo vệ.
- **Xác thực**:
  - Kiểm tra quyền sở hữu trong cơ sở dữ liệu hoặc thông qua signed token.
  - Tự động ghi nhận thông tin IP, User Agent vào `download_logs`.
- **Response**: File stream nhị phân đính kèm với `Content-Disposition: attachment; filename="ApexCombatSystem_v2.5_Enterprise.rbxm"`.

---

## 5. QUẢN TRỊ ADMIN (CONTROL PANEL APIS)

| Method | Endpoint | Quyền hạn | Mô tả |
|---|---|---|---|
| `GET` | `/api/admin/analytics` | `ADMIN`, `SUPER_ADMIN` | Thống kê KPI, doanh thu 6 tháng, sản phẩm bán chạy |
| `GET/POST/PUT/DELETE` | `/api/admin/products` | `ADMIN`, `SUPER_ADMIN` | Toàn quyền CRUD sản phẩm và metadata |
| `GET/POST` | `/api/admin/deposits` | `ADMIN`, `SUPER_ADMIN` | Quản lý và duyệt thủ công các đơn nạp tiền VietQR |
| `GET/POST` | `/api/admin/orders` | `ADMIN`, `SUPER_ADMIN` | Xem danh sách đơn và xử lý hoàn tiền ví điện tử |
| `GET/PUT` | `/api/admin/users` | `ADMIN`, `SUPER_ADMIN` | Quản lý phân quyền RBAC và khóa tài khoản |
| `POST` | `/api/admin/wallet` | `ADMIN`, `SUPER_ADMIN` | Cộng / trừ số dư ví người dùng thủ công kèm lý do |
| `GET/POST/DELETE` | `/api/admin/coupons` | `ADMIN`, `SUPER_ADMIN` | Quản lý mã coupon giảm giá |
| `GET/POST` | `/api/admin/settings` | `ADMIN`, `SUPER_ADMIN` | Cấu hình website, thông tin ngân hàng VietQR |
| `GET` | `/api/admin/logs` | `ADMIN`, `SUPER_ADMIN` | Truy vấn nhật ký kiểm toán Admin Audit Logs |
