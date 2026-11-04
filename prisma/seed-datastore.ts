import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const cat = await prisma.productCategory.findFirst({ where: { slug: "systems" } });

  if (!cat) {
    console.error("Missing category");
    return;
  }

  const existing = await prisma.product.findUnique({
    where: { slug: "omnisave-pro-datastore-profileservice-system" },
  });

  if (existing) {
    console.log("Product already exists!");
    return;
  }

  const p = await prisma.product.create({
    data: {
      title: "OmniSave Pro — Hệ Thống DataStore & ProfileService Auto-Save (Chống Dupe 100%)",
      slug: "omnisave-pro-datastore-profileservice-system",
      subtitle: "Framework tự động lưu trữ dữ liệu người chơi cao cấp: Tiền, Level, Kho đồ, Trang bị. Cơ chế Session-Locking chống rollback tuyệt đối khi crash server.",
      description: "OmniSave Pro là framework DataStore chuẩn Enterprise dành cho mọi dự án game Roblox Studio từ RPG, Tycoon đến Simulator và FPS. Xây dựng trên nền tảng ProfileService v5 kết hợp DataStoreService nguyên bản, giải quyết triệt để vấn đề mất dữ liệu người chơi và lỗi dupe item nguy hiểm.\n\n### Đặc Điểm Nổi Bật\n* **Auto-Save Thông Minh:** Tự động lưu sau mỗi 30 giây không gây drop FPS server.\n* **Session-Locking:** Chống duplicate đồ khi người chơi spam rejoin server khác.\n* **BindToClose Safe:** Lưu khẩn cấp 100% dữ liệu trước khi Roblox đóng server bảo trì.\n* **Roblox Studio Data Editor:** Có sẵn GUI trực quan để admin chỉnh tiền, item trực tiếp.",
      features: JSON.stringify([
        "Tự động lưu dữ liệu định kỳ mỗi 30s không gây lag game",
        "Cơ chế Session-Locking chống duplicate đồ và glitch nhiều server",
        "Cứu dữ liệu khẩn cấp bằng game:BindToClose() khi máy chủ đóng đột ngột",
        "Tự động thử lại thông minh (Exponential Backoff pcall) khi Roblox DataStore bị quá tải",
        "Kèm sẵn giao diện Data Editor GUI quản trị viên ngay trong Roblox Studio",
        "Hỗ trợ đầy đủ Luau strict type checking và migration phiên bản dữ liệu"
      ]),
      robloxVersion: "Roblox Studio 2026 Compatible",
      price: 180000,
      originalPrice: 320000,
      discountPercent: 44,
      isFree: false,
      isFeatured: true,
      isTrending: true,
      isBestSeller: true,
      categoryId: cat.id,
      fileFormat: ".rbxm",
      creatorName: "TKSHOP.VN Studio Engine",
      salesCount: 184,
      ratingAverage: 5.0,
      ratingCount: 42,
      installationGuide: "1. Mở Roblox Studio > Game Settings > Security > Bật Allow Third Party Teleports & Enable Studio Access to API Services.\n2. Import file OmniSavePro.rbxm vào ServerScriptService.\n3. Cấu hình bảng dữ liệu mặc định (Coins, Gems, Level, Inventory) trong Config Module.",
      images: {
        create: [
          { imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&q=80", isThumbnail: true, sortOrder: 0 },
          { imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80", isThumbnail: false, sortOrder: 1 },
        ]
      },
      files: {
        create: [
          {
            fileName: "OmniSavePro_v5.rbxm",
            storagePath: "assets/OmniSavePro_v5.rbxm",
            fileFormat: ".rbxm",
            fileSize: "2.4 MB",
          },
          {
            fileName: "OmniSave_Luau_Framework.zip",
            storagePath: "assets/OmniSave_Luau_Framework.zip",
            fileFormat: ".zip",
            fileSize: "2.4 MB",
          },
        ]
      },
      versions: {
        create: [
          { versionNumber: "v5.2.0", changelog: "Tối ưu hóa bộ nhớ RAM, chống dupe 100% qua ProfileService v5 Session-Locking, bổ sung tính năng Auto-Save mỗi 30 giây." }
        ]
      }
    }
  });

  console.log("Created DataSave product successfully:", p.slug);
}

main().catch(console.error).finally(() => prisma.$disconnect());
