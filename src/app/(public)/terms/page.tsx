import React from "react";

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-dark-text">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Điều Khoản Dịch Vụ (Terms of Service)</h1>
        <p className="text-xs text-dark-muted mt-1">Cập nhật lần cuối: Tháng 10, 2026</p>
      </div>

      <div className="bg-dark-card border border-dark-border rounded-2xl p-6 sm:p-8 space-y-6 text-xs sm:text-sm leading-relaxed text-dark-text">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">1. Giấy Phép Sử Dụng Tài Nguyên Kỹ Thuật Số (License)</h2>
          <p>
            Mọi sản phẩm (Model .rbxm, Place .rbxl, Luau Script, UI Kit) được mua trên Roblox Studio Asset Marketplace cấp cho người mua quyền sử dụng phi độc quyền (Non-exclusive Commercial License) trong các trò chơi hoặc trải nghiệm được xuất bản trên nền tảng Roblox.
          </p>
          <p className="text-dark-muted">
            Nghiêm cấm hành vi tải về để bán lại nguyên bản, chia sẻ công khai mã nguồn hoặc leak tài nguyên ra các diễn đàn bên ngoài khi chưa được sự đồng ý của tác giả.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">2. Quy Định Về Ví & Nạp Tiền (VietQR)</h2>
          <p>
            Tiền nạp vào ví được chuyển khoản qua hình thức quét mã VietQR tự động. Người dùng có trách nhiệm kiểm tra đúng số tiền và nội dung chuyển khoản theo hướng dẫn trên hóa đơn. Số dư ví không có hạn sử dụng và dùng để mua trực tiếp mọi tài nguyên trên hệ thống.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">3. Chính Sách Hoàn Tiền (Refund Policy)</h2>
          <p>
            Do đặc thù của sản phẩm số (Digital Delivery), các giao dịch mua file sau khi đã tải về thành công sẽ không được hoàn tiền, trừ các trường hợp file bị hỏng không thể mở, thiếu code nghiêm trọng mà đội ngũ kỹ thuật không thể khắc phục trong vòng 48 giờ kể từ khi nhận Support Ticket.
          </p>
        </section>
      </div>
    </div>
  );
}
