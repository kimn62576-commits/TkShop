import React from "react";

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-dark-text">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Chính Sách Bảo Mật (Privacy Policy)</h1>
        <p className="text-xs text-dark-muted mt-1">Cập nhật lần cuối: Tháng 10, 2026</p>
      </div>

      <div className="bg-dark-card border border-dark-border rounded-2xl p-6 sm:p-8 space-y-6 text-xs sm:text-sm leading-relaxed text-dark-text">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">1. Thu Thập Thông Tin Cá Nhân</h2>
          <p>
            Chúng tôi chỉ thu thập các thông tin tối thiểu cần thiết để vận hành tài khoản và cấp quyền tải tài nguyên: Địa chỉ Email, Tên hiển thị, Tên tài khoản Roblox (tùy chọn) và Địa chỉ IP trong quá trình xác thực giao dịch tải file.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">2. Bảo Mật Mật Khẩu & Dữ Liệu</h2>
          <p>
            Mật khẩu của bạn được mã hóa bằng thuật toán băm Bcrypt 10 vòng kết hợp muối ngẫu nhiên trước khi lưu trữ vào cơ sở dữ liệu. Không ai, kể cả quản trị viên hệ thống, có thể xem được mật khẩu dạng văn bản thuần (plaintext) của bạn.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">3. Bảo Mật Thanh Toán & Chữ Ký Số</h2>
          <p>
            Mọi webhook ngân hàng đều được bảo vệ bằng chữ ký HMAC-SHA256 bí mật và kiểm tra cơ chế chống lặp (Idempotency) để đảm bảo tuyệt đối không có sự sai lệch số dư ví.
          </p>
        </section>
      </div>
    </div>
  );
}
