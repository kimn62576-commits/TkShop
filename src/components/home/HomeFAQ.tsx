"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HelpCircle, ChevronDown, Clock, ShieldCheck, RefreshCw, Eye, Sparkles } from "lucide-react";

export default function HomeFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Mua asset trên TKSHOP.VN có tự động nhận file ngay không?",
      a: "Có! Hệ thống xử lý hoàn toàn tự động 24/7. Ngay sau khi bạn bấm xác nhận mua hàng từ số dư ví, giấy phép bản quyền được kích hoạt và file (.rbxm, .luau, .zip) sẽ xuất hiện lập tức trong mục 'Kho Asset Của Tôi' (My Library) để bạn tải về máy tính.",
    },
    {
      q: "Nạp tiền vào tài khoản ví qua những kênh nào và có khuyến mại không?",
      a: "TKSHOP.VN hỗ trợ nạp tiền tự động qua quét mã VietQR (tất cả các ngân hàng tại Việt Nam) và MoMo. Tiền sẽ được cộng vào ví tự động sau 5-10 giây với ưu đãi nạp tặng thêm +10% giá trị nạp vĩnh viễn.",
    },
    {
      q: "Sau khi mua tôi xem lại file và tải ở đâu?",
      a: "Bạn chỉ cần đăng nhập và truy cập vào mục 'Kho Asset Đã Mua' (Library) từ thanh menu. Toàn bộ các file bạn đã mua sẽ được lưu vĩnh viễn, bạn có thể tải lại bất kỳ lúc nào hoặc tải các bản cập nhật mới hoàn toàn miễn phí.",
    },
    {
      q: "Nếu gặp lỗi khi đưa asset vào Roblox Studio thì có được hỗ trợ không?",
      a: "Tất cả sản phẩm trên shop đều có hướng dẫn cài đặt chi tiết từng bước. Nếu bạn gặp khó khăn, đội ngũ hỗ trợ kỹ thuật qua Zalo (0394.063.917) sẽ hỗ trợ trực tiếp hoặc Ultraview hướng dẫn bạn cài đặt vào Roblox Studio hoàn toàn miễn phí.",
    },
  ];

  return (
    <div className="space-y-8">
      
      {/* 01. 4 HUY HIỆU CAM KẾT (KHỚP ẢNH MẪU 100%) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white/95 rounded-2xl p-4 border border-slate-200/90 shadow-sm flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800">Tự động 24/7</h4>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
              Giao dịch chạy liên tục mọi ngày trong tuần, kể cả ngày lễ.
            </p>
          </div>
        </div>

        <div className="bg-white/95 rounded-2xl p-4 border border-slate-200/90 shadow-sm flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800">Minh bạch 100%</h4>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
              Thông tin asset và video demo công khai trước khi mua, không mập mờ.
            </p>
          </div>
        </div>

        <div className="bg-white/95 rounded-2xl p-4 border border-slate-200/90 shadow-sm flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800">Bảo mật không backdoor</h4>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
              Có hướng dẫn cài đặt chi tiết giúp anh em đưa vào game an toàn tuyệt đối.
            </p>
          </div>
        </div>

        <div className="bg-white/95 rounded-2xl p-4 border border-slate-200/90 shadow-sm flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800">Hỗ trợ & Cập nhật</h4>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
              Hỗ trợ kỹ thuật Zalo 24/7 và tải lại các bản update mới miễn phí.
            </p>
          </div>
        </div>

      </div>

      {/* 02. BÀI VIẾT GIỚI THIỆU SHOP & TAGS (KHỚP ẢNH MẪU 100%) */}
      <div className="bg-white/95 rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
        
        <div className="text-center sm:text-left space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Shop Model Roblox Uy Tín, Giá Rẻ Tự Động 24/7 — TKSHOP.VN
          </h2>
          <p className="text-xs text-slate-500">
            Shop model Roblox chất lượng cao lâu đời tại Việt Nam. Mua bán asset Roblox Studio uy tín, giá rẻ sinh viên, giao dịch tự động 24/7.{" "}
            <span className="text-rose-600 font-bold">Được nhiều Roblox Developer & Studio tin tưởng đồng hành.</span>
          </p>
        </div>

        {/* Tag Buttons Danh Mục */}
        <div className="pt-2">
          <div className="text-xs font-bold text-slate-800 mb-2 border-l-2 border-blue-600 pl-2">
            Đa dạng danh mục, nhiều sự lựa chọn cho nhà phát triển:
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "HỆ THỐNG ACS GUN", href: "/marketplace?category=systems" },
              { label: "BẢN ĐỒ NEO-TOKYO", href: "/marketplace?category=maps-terrain" },
              { label: "DATASTORE CHỐNG DUPE", href: "/marketplace?category=systems" },
              { label: "GÓI SIÊU XE A-CHASSIS", href: "/marketplace?category=vehicles" },
              { label: "UI KITS ROBLOX", href: "/marketplace?category=ui-kits" },
              { label: "ASSET MIỄN PHÍ", href: "/marketplace?category=free-starter" },
            ].map((tag, i) => (
              <Link
                key={i}
                href={tag.href}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 text-xs font-bold border border-slate-200 transition-colors"
              >
                {tag.label}
              </Link>
            ))}
          </div>
        </div>

      </div>

      {/* 03. CÂU HỎI THƯỜNG GẶP ACCORDION (KHỚP ẢNH MẪU 100%) */}
      <div className="bg-white/95 rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
        
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Câu Hỏi Thường Gặp</h3>
            <p className="text-[11px] text-slate-500">Giải đáp các thắc mắc phổ biến khi mua và sử dụng tài nguyên trên shop</p>
          </div>
        </div>

        <div className="space-y-2.5 pt-2">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-xl border border-slate-200 bg-slate-50/60 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full p-4 flex items-center justify-between text-left text-xs font-bold text-slate-800 hover:text-blue-600"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-blue-600" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-200/60 bg-white">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
