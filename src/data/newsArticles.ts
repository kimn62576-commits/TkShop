export interface NewsArticle {
  slug: string;
  title: string;
  summary: string;
  category: "CHO NGƯỜI MỚI" | "LẬP TRÌNH LUAU" | "KIẾN THỨC NỀN TẢNG" | "HƯỚNG DẪN DỊCH VỤ";
  categoryColor: string;
  readTime: string;
  publishedAt: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  imageUrl: string;
  tags: string[];
  featured?: boolean;
  content: {
    intro: string;
    sections: {
      heading: string;
      body: string[];
      codeSnippet?: {
        language: string;
        code: string;
        caption?: string;
      };
      callout?: {
        type: "tip" | "warning" | "important";
        text: string;
      };
      bulletPoints?: string[];
    }[];
    conclusion: string;
  };
}

export const NEWS_ARTICLES: NewsArticle[] = [
  {
    slug: "moi-gia-nhap-roblox-studio-nen-lam-gi",
    title: "Mới gia nhập Roblox Studio nên làm gì? Lộ trình nhập môn cho Newbie từ con số 0",
    summary: "Hướng dẫn từng bước giúp người mới không bị choáng ngợp: từ tải Studio chính thức, làm quen giao diện Workspace, đến chọn hướng đi Builder hay Scripter và hoàn thành game đầu tiên.",
    category: "CHO NGƯỜI MỚI",
    categoryColor: "sky",
    readTime: "4 phút đọc",
    publishedAt: "03/11/2026",
    author: {
      name: "Nguyễn Trọng Khang",
      role: "Lead Developer @ TKSHOP.VN",
      avatar: "/tkshop-logo-animated-sm.webp"
    },
    imageUrl: "/news/studio-beginner.jpg",
    tags: ["Roblox Studio", "Newbie", "Hướng dẫn", "Lộ trình", "Game Dev"],
    featured: true,
    content: {
      intro: "Roblox Studio là công cụ phát triển game 3D miễn phí mạnh mẽ nhất hiện nay, nơi bạn có thể biến bất kỳ ý tưởng nào thành tựa game tiếp cận hàng triệu người chơi toàn cầu. Tuy nhiên, khi mới mở phần mềm lên, hàng chục cửa sổ công cụ có thể khiến bạn bối rối. Dưới đây là lộ trình chuẩn nhất để bắt đầu.",
      sections: [
        {
          heading: "1. Tải và cài đặt phần mềm chính thức",
          body: [
            "Truy cập trang web chính thức của Roblox tại create.roblox.com và nhấn nút 'Start Creating'. Hệ thống sẽ tự động tải file cài đặt Roblox Studio mới nhất về máy tính của bạn (hỗ trợ cả Windows và macOS).",
            "Sau khi cài đặt xong, đăng nhập bằng tài khoản Roblox của bạn. Luôn chọn template cơ bản nhất là 'Baseplate' để bắt đầu thực hành mà không bị xao nhãng bởi các đồ vật phức tạp."
          ],
          callout: {
            type: "important",
            text: "Không bao giờ tải Roblox Studio từ các nguồn trôi nổi trên mạng để tránh bị dính mã độc đánh cắp tài khoản hoặc token bảo mật."
          }
        },
        {
          heading: "2. Nắm vững 3 cửa sổ quyền lực nhất giao diện",
          body: [
            "Giao diện Roblox Studio được tổ chức rất khoa học. Để không bị lạc, bạn chỉ cần nhớ 3 khu vực chính:",
            "Nếu vô tình làm mất Explorer hoặc Properties, bạn chỉ cần vào menu 'View' trên thanh công cụ và bấm chọn lại Explorer và Properties là chúng sẽ hiện ra ngay lập tức."
          ],
          bulletPoints: [
            "3D Viewport (Chính giữa): Nơi bạn trực tiếp nhìn thấy thế giới game, điều khiển camera, di chuyển và đặt các khối vật thể (Part).",
            "Explorer (Cột bên phải): Cây thư mục quản lý toàn bộ đối tượng trong game như Workspace, Players, Lighting, ReplicatedStorage.",
            "Properties (Dưới Explorer): Bảng thông số chi tiết của vật thể bạn đang chọn (màu sắc Color, chất liệu Material, độ trong suốt Transparency, kích thước Size)."
          ]
        },
        {
          heading: "3. Thao tác căn bản: Tạo khối và cố định vật thể",
          body: [
            "Trên thanh công cụ Home, nhấn vào nút 'Part' để thả một khối hộp vào thế giới game. Sử dụng các công cụ cơ bản:",
            "• Move (Phím tắt Ctrl + 2): Di chuyển vật thể theo trục 3D.",
            "• Scale (Phím tắt Ctrl + 3): Kéo dãn hoặc thu nhỏ kích thước.",
            "• Rotate (Phím tắt Ctrl + 4): Xoay góc vật thể theo các trục."
          ],
          callout: {
            type: "tip",
            text: "Luôn nhớ bật 'Anchor' (Phím tắt Alt + A) cho mọi khối gạch tường, sàn nhà, cây cối. Nếu quên Anchor, khi bấm Play vật thể sẽ bị trọng lực kéo rơi vỡ tan tành!"
          }
        },
        {
          heading: "4. Định hình vai trò của bạn trong Studio",
          body: [
            "Làm game là một quá trình kết hợp nhiều kỹ năng. Bạn có thể chọn chuyên sâu vào một lĩnh vực phù hợp với sở trường:",
            "• Builder / 3D Modeler: Chuyên dựng bản đồ, địa hình (Terrain), công trình kiến trúc, bối cảnh bắt mắt.",
            "• Scripter: Lập trình viên viết code Luau để tạo cơ chế chiến đấu, túi đồ (Inventory), mua sắm, tính điểm.",
            "• UI / UX Designer: Thiết kế giao diện menu, thanh máu, bảng xếp hạng trực quan.",
            "• Animator: Làm chuyển động đi lại, chém kiếm, bắn súng cho nhân vật."
          ]
        },
        {
          heading: "5. Đừng tạo lại cái bánh xe — Hãy tận dụng Asset chuẩn",
          body: [
            "Một sai lầm của nhiều bạn mới là cố gắng tự viết lại toàn bộ hệ thống từ đầu (như hệ thống súng, túi đồ, datastore lưu điểm). Việc này mất hàng trăm giờ và dễ nản lòng.",
            "Các studio lớn đều sử dụng các Framework chuẩn hóa đã được kiểm thử như ACS Combat v2.5, OmniSave DataStore tại TKSHOP.VN. Bạn chỉ cần tập trung vào ý tưởng gameplay độc đáo của mình!"
          ]
        }
      ],
      conclusion: "Hành trình sáng tạo game Roblox bắt đầu từ những bước đi nhỏ nhất. Hãy dành 30 phút mỗi ngày để mở Baseplate lên và thực hành, bạn sẽ thấy sự tiến bộ rõ rệt chỉ sau 2 tuần!"
    }
  },
  {
    slug: "hoc-roblox-studio-co-kho-khong",
    title: "Học Roblox Studio có khó không? Giải mã những hiểu lầm phổ biến của người mới bắt đầu",
    summary: "Phân tích thẳng thắn về độ khó khi học làm game Roblox. Vì sao ngôn ngữ Luau dễ tiếp cận hơn nhiều so với C# hay C++, và bí quyết để không bị nản khi học lập trình game.",
    category: "LẬP TRÌNH LUAU",
    categoryColor: "emerald",
    readTime: "5 phút đọc",
    publishedAt: "03/11/2026",
    author: {
      name: "Nguyễn Trọng Khang",
      role: "Lead Developer @ TKSHOP.VN",
      avatar: "/tkshop-logo-animated-sm.webp"
    },
    imageUrl: "/news/studio-scripting.jpg",
    tags: ["Luau Scripting", "Học Code", "Kinh Nghiệm", "Roblox Studio", "Gamedev"],
    featured: false,
    content: {
      intro: "Rất nhiều bạn đam mê làm game nhưng lại lo sợ: 'Mình không giỏi toán, không rành tiếng Anh, liệu có học được Roblox Studio không?'. Câu trả lời dứt khoát là: HOÀN TOÀN HỌC ĐƯỢC! Hãy cùng giải mã thực tế về độ khó của Studio.",
      sections: [
        {
          heading: "1. Hiểu lầm phổ biến: Phải là 'thiên tài toán học' mới code được?",
          body: [
            "Hoàn toàn sai! 90% logic làm game thông thường chỉ yêu cầu tư duy logic căn bản: 'NẾU nhân vật chạm vào bẫy THÌ trừ 50 máu; NẾU máu bằng 0 THÌ hồi sinh'.",
            "Bạn không cần phải giải phương trình vi phân hay tích phân phức tạp. Các phép toán vật lý (như trọng lực, va chạm, ma sát) đều đã được engine của Roblox tính toán tự động hoàn toàn."
          ]
        },
        {
          heading: "2. Luau — Ngôn ngữ lập trình thân thiện bậc nhất",
          body: [
            "Roblox sử dụng ngôn ngữ Luau (được nâng cấp từ ngôn ngữ Lua chuẩn). Điểm mạnh vượt trội của Luau so với C++, Java hay C# là cú pháp cực kỳ ngắn gọn, dễ đọc như câu văn tiếng Anh.",
            "Hãy xem ví dụ kinh điển bên dưới: Chỉ với 3 dòng code, bạn đã có thể làm một khối Part biến mất và không cản đường khi nhân vật bước qua:"
          ],
          codeSnippet: {
            language: "luau",
            code: "-- Script đặt bên trong một khối Part\nlocal part = script.Parent\n\nlocal function onTouch(hit)\n    part.Transparency = 0.8 -- Làm mờ khối gạch\n    part.CanCollide = false  -- Cho phép người chơi đi xuyên qua\n    task.wait(3)             -- Chờ 3 giây\n    part.Transparency = 0   -- Khôi phục trạng thái ban đầu\n    part.CanCollide = true\nend\n\npart.Touched:Connect(onTouch)",
            caption: "Đoạn code làm bẫy sàn vô hình cực kỳ đơn giản trong Roblox Studio"
          }
        },
        {
          heading: "3. Ba giai đoạn chinh phục Studio từ dễ đến nâng cao",
          body: [
            "Để không bị nản, bạn nên chia quá trình học thành 3 mốc rõ ràng:",
            "• Giai đoạn 1 (Tuần 1 - 2): Thao tác dựng hình (Building). Tập làm map vượt chướng ngại vật (Obby), đặt điểm hồi sinh (SpawnLocation), trang trí ánh sáng (Lighting).",
            "• Giai đoạn 2 (Tuần 3 - 4): Làm quen Scripting căn bản. Học về biến (variables), hàm (functions), vòng lặp (while/for), và các sự kiện như Touched, ClickDetector.",
            "• Giai đoạn 3 (Tháng thứ 2 trở đi): Học về mô hình Client - Server (RemoteEvent), DataStore (lưu tiền vàng khi thoát game), và tích hợp các gói tài nguyên cao cấp."
          ],
          callout: {
            type: "tip",
            text: "Đừng bắt đầu bằng việc muốn làm một game MMORPG nghìn người chơi ngay ngày đầu tiên. Hãy làm 3 tựa game mini nhỏ trước để hiểu trọn vẹn quy trình xuất bản game!"
          }
        },
        {
          heading: "4. Bí quyết học nhanh gấp 5 lần: 'Đứng trên vai người khổng lồ'",
          body: [
            "Cách học lập trình nhanh nhất không phải là cắm đầu đọc sách giáo khoa, mà là xem và chỉnh sửa code thực tế đang hoạt động tốt.",
            "Tại TKSHOP.VN, các model như hệ thống súng ACS, hệ thống RPG Inventory đều được chú thích (comment) tiếng Việt rõ ràng từng dòng lệnh. Bạn có thể mở script ra, chỉnh sửa thông số sát thương, tốc độ bắn và quan sát sự thay đổi ngay tức thì trong game."
          ]
        }
      ],
      conclusion: "Học Roblox Studio không khó, cái khó là sự kiên trì trong những ngày đầu. Khi bạn tự tay tạo ra được chiếc xe chạy được hay khẩu súng bắn ra đạn đầu tiên, cảm giác thỏa mãn sẽ khiến bạn yêu thích việc làm game suốt đời!"
    }
  },
  {
    slug: "nhung-dieu-co-ban-khi-hoc-roblox-studio",
    title: "Những điều cơ bản sống còn khi học làm game trong Roblox Studio mà ai cũng phải biết",
    summary: "Tổng hợp các kiến thức nền tảng quan trọng nhất: Phân biệt Script vs LocalScript, quy tắc Client - Server, quản lý tài nguyên tránh lag 60 FPS và cách chèn file .rbxm vào game an toàn.",
    category: "KIẾN THỨC NỀN TẢNG",
    categoryColor: "amber",
    readTime: "6 phút đọc",
    publishedAt: "03/11/2026",
    author: {
      name: "Nguyễn Trọng Khang",
      role: "Lead Developer @ TKSHOP.VN",
      avatar: "/tkshop-logo-animated-sm.webp"
    },
    imageUrl: "/news/studio-basics.jpg",
    tags: ["Kiến Thức Cốt Lõi", "Client Server", "Anchor", "Tối Ưu 60 FPS", "Roblox Luau"],
    featured: false,
    content: {
      intro: "Trong quá trình hỗ trợ hàng nghìn khách hàng cài đặt asset tại TKSHOP, chúng tôi nhận thấy 80% các lỗi game phổ biến (như vật thể bị rơi, súng bắn không gây sát thương, hoặc giao diện UI không cập nhật) đều xuất phát từ việc thiếu các kiến thức nền tảng dưới đây.",
      sections: [
        {
          heading: "1. Anchor và CanCollide — Hai thuộc tính quan trọng nhất của Part",
          body: [
            "Mỗi khối vật thể trong Roblox đều chịu tác động của động cơ vật lý. Bạn cần phân biệt rõ:",
            "• Anchored (Được neo lại): Khi tích chọn, Part sẽ đứng yên bất động trên không trung, không bị rơi do trọng lực và không bị người chơi đẩy xê dịch. Tường nhà, cây cối, mặt đất bắt buộc phải BẬT Anchored.",
            "• CanCollide (Có thể va chạm): Khi tắt thuộc tính này, người chơi và các vật thể khác có thể đi xuyên qua nó. Rất hữu ích khi làm các hiệu ứng khói, cổng dịch chuyển, hoặc tán lá cây."
          ]
        },
        {
          heading: "2. Mô hình Client - Server: Quy tắc vàng của Roblox",
          body: [
            "Roblox là game online nhiều người chơi (Multiplayer), vì vậy kiến trúc được chia làm 2 bên độc lập:",
            "• Server (Máy chủ Roblox): Nơi chứa logic công lý. Chỉ có Server mới được phép trừ tiền của người chơi, cấp vũ khí, lưu dữ liệu DataStore để chống hack (Exploits). Script chạy trên Server có icon màu trắng.",
            "• Client (Máy tính/Điện thoại của từng người chơi): Nơi xử lý giao diện người dùng (ScreenGui), âm thanh tai nghe, hiệu ứng camera. Script chạy trên Client là LocalScript có icon màu xanh lá.",
            "• Cầu nối giữa Client và Server: Được thực hiện thông qua RemoteEvent hoặc RemoteFunction đặt trong thư mục ReplicatedStorage."
          ],
          callout: {
            type: "warning",
            text: "Tuyệt đối không trừ máu quái vật hoặc cộng tiền trực tiếp trong LocalScript. Người chơi có thể dùng phần mềm can thiệp (hack) vào LocalScript để gian lận nếu bạn không kiểm tra lại ở phía Server!"
          }
        },
        {
          heading: "3. Tối ưu hóa hiệu năng để game luôn chạy mượt 60 FPS",
          body: [
            "Một bản đồ đẹp nhưng bị tụt khung hình xuống 15-20 FPS sẽ khiến người chơi nhanh chóng thoát game. Hãy áp dụng ngay các mẹo tối ưu sau:",
            "• Hạn chế lạm dụng PointLight và SurfaceLight có bật Shadows (đổ bóng). Quá nhiều bóng đổ động là nguyên nhân số 1 gây lag card đồ họa.",
            "• Bật tính năng StreamingEnabled trong Workspace. Tính năng này sẽ chỉ tải những vật thể ở gần người chơi, giúp game chạy mượt mà ngay cả trên điện thoại cấu hình yếu.",
            "• Sử dụng Union hoặc MeshPart thay vì ghép nối hàng chục nghìn Part đơn lẻ."
          ]
        },
        {
          heading: "4. Hướng dẫn chèn file tài nguyên (.rbxm) tải từ TKSHOP vào Studio",
          body: [
            "Mọi sản phẩm bạn mua trên TKSHOP.VN đều có định dạng chuẩn .rbxm (Roblox Model Binary). Cách cài đặt vô cùng đơn giản trong 30 giây:",
            "• Bước 1: Mở Roblox Studio và mở dự án game của bạn.",
            "• Bước 2: Kéo trực tiếp file .rbxm đã tải từ máy tính thả vào cửa sổ 3D Viewport của Studio.",
            "• Bước 3 (Cách khác): Nhấp chuột phải vào thư mục 'Workspace' trong cửa sổ Explorer, chọn 'Insert from File...', rồi trỏ tới file .rbxm của bạn.",
            "• Bước 4: Mở rộng Model vừa chèn vào, đọc file README hoặc di chuyển các thư mục con vào đúng vị trí (ví dụ: kéo thư mục ReplicatedStorage vào ReplicatedStorage của game)."
          ],
          callout: {
            type: "tip",
            text: "Nếu gặp bất kỳ khó khăn nào trong quá trình chèn file, đừng ngần ngại bấm nút Zalo 0394.063.917 — Kỹ thuật viên TKSHOP sẽ hỗ trợ Ultraview trực tiếp vào máy bạn hoàn toàn miễn phí!"
          }
        }
      ],
      conclusion: "Nắm vững những kiến thức nền tảng này sẽ giúp bạn tiết kiệm hàng chục giờ gỡ lỗi và tự tin xây dựng những tựa game chất lượng cao, an toàn và tối ưu cho cộng đồng."
    }
  },
  {
    slug: "huong-dan-nap-tien-tkshop-nhan-20-phan-tram",
    title: "Hướng dẫn chi tiết cách nạp tiền vào TKSHOP — Nhận ngay +20% khuyến mãi tự động 24/7",
    summary: "Hướng dẫn cụ thể các bước nạp tiền vào ví TKSHOP qua VietQR ngân hàng, MoMo và Thẻ cào điện thoại. Cơ chế tự động cộng tiền sau 3 giây và nhận thêm 20% khuyến mãi số dư.",
    category: "HƯỚNG DẪN DỊCH VỤ",
    categoryColor: "rose",
    readTime: "3 phút đọc",
    publishedAt: "03/11/2026",
    author: {
      name: "Nguyễn Trọng Khang",
      role: "Lead Developer @ TKSHOP.VN",
      avatar: "/tkshop-logo-animated-sm.webp"
    },
    imageUrl: "/news/payment-guide.jpg",
    tags: ["Nạp Tiền", "VietQR", "Khuyến Mãi +20%", "Thẻ Cào", "TKSHOP"],
    featured: false,
    content: {
      intro: "Để sở hữu các framework súng ACS, hệ thống RPG, map Cyberpunk và các asset độc quyền trên TKSHOP.VN, bạn cần nạp tiền vào tài khoản ví cá nhân. Hệ thống thanh toán của chúng tôi được tự động hóa 100% qua cổng VietQR ngân hàng, MoMo và gạch thẻ cào tự động 24/7.",
      sections: [
        {
          heading: "1. Ưu đãi độc quyền: Tặng thêm +20% số dư nạp qua Ngân hàng",
          body: [
            "Nhằm hỗ trợ tối đa cho các Developer và Creator cộng đồng Roblox, TKSHOP triển khai chương trình khuyến mại vĩnh viễn:",
            "• Nạp 50.000đ → Nhận ngay 60.000đ vào ví (+10.000đ khuyến mãi)",
            "• Nạp 100.000đ → Nhận ngay 120.000đ vào ví (+20.000đ khuyến mãi)",
            "• Nạp 200.000đ → Nhận ngay 240.000đ vào ví (+40.000đ khuyến mãi)",
            "• Nạp 500.000đ → Nhận ngay 600.000đ vào ví (+100.000đ khuyến mãi)",
            "Số dư khuyến mãi được tự động cộng ngay trong giao dịch và sử dụng được cho toàn bộ sản phẩm trên sàn."
          ]
        },
        {
          heading: "2. Quy trình nạp tiền qua VietQR / Chuyển khoản trong 3 bước",
          body: [
            "Hệ thống tích hợp cổng thanh toán SePay liên kết trực tiếp với tài khoản MBBank chính chủ (Nguyễn Trọng Khang - STK: 0394.063.917):",
            "• Bước 1: Nhấn vào nút 'Nạp Tiền' có biểu tượng xấp tiền 500k ở thanh Menu trên cùng hoặc trong trang cá nhân.",
            "• Bước 2: Chọn tab 'VietQR / MoMo (+20%)', chọn số tiền muốn nạp (hoặc tự nhập số tiền tùy ý từ 20.000đ) rồi nhấn 'Tạo Mã VietQR Thanh Toán'.",
            "• Bước 3: Mở ứng dụng ngân hàng bất kỳ (Vietcombank, MB, Techcombank, VPBank, ACB, BIDV...) hoặc MoMo, quét mã QR hiển thị trên màn hình. Số tiền và nội dung chuyển khoản đã được điền sẵn chính xác 100%."
          ],
          callout: {
            type: "important",
            text: "Hệ thống tự động kiểm tra biên lai ngân hàng liên tục mỗi 2.5 giây. Ngay khi chuyển khoản thành công, màn hình sẽ hiển thị pháo hoa chúc mừng và số dư ví tăng lên ngay lập tức mà không cần chờ Admin duyệt tay!"
          }
        },
        {
          heading: "3. Hướng dẫn nạp bằng Thẻ cào điện thoại (Viettel, Vina, Mobi, Zing)",
          body: [
            "Nếu bạn chưa có tài khoản ngân hàng, bạn hoàn toàn có thể sử dụng thẻ cào điện thoại hoặc thẻ game:",
            "• Bước 1: Mở popup Nạp Tiền, chọn tab 'Nạp Thẻ Cào Tự Động'.",
            "• Bước 2: Chọn đúng nhà mạng (Viettel, Mobifone, Vinaphone, Zing, Vietnamobile).",
            "• Bước 3: Chọn đúng mệnh giá thẻ cào từ 10.000đ đến 500.000đ.",
            "• Bước 4: Nhập chính xác Mã thẻ (PIN) và Số Seri in trên thẻ, sau đó nhấn 'Xác Nhận Nạp Thẻ'. Hệ thống sẽ tự động gạch thẻ qua API trong khoảng 10 - 30 giây."
          ],
          callout: {
            type: "warning",
            text: "Hãy chọn đúng mệnh giá thẻ cào. Việc chọn sai mệnh giá có thể khiến hệ thống nhà mạng từ chối xử lý hoặc trừ phí phạt sai mệnh giá theo quy định của nhà mạng viễn thông."
          }
        },
        {
          heading: "4. Cam kết bảo mật và hỗ trợ giao dịch 24/7",
          body: [
            "Mọi giao dịch trên TKSHOP.VN đều được mã hóa SSL 256-bit an toàn tuyệt đối. Tiền sau khi nạp vào ví được bảo lưu vĩnh viễn và không bị hết hạn.",
            "Trong trường hợp bạn quên nhập mã giao dịch hoặc chuyển khoản nhầm, đừng lo lắng! Chỉ cần nhắn tin trực tiếp cho Admin qua Zalo: 0394.063.917 (kèm ảnh chụp màn hình chuyển khoản), Admin sẽ hỗ trợ tra soát và cộng tiền thủ công ngay trong 2 phút."
          ]
        }
      ],
      conclusion: "Nạp tiền tự động siêu tốc, nhận thêm +20% số dư và sở hữu ngay những asset Roblox Studio đẳng cấp nhất để nâng tầm dự án game của bạn ngay hôm nay!"
    }
  }
];
