import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Roblox Studio Asset Marketplace database...");

  // 1. Roles
  const roles = [
    { name: "GUEST", description: "Unauthenticated visitor", permissions: JSON.stringify(["read:products"]) },
    { name: "USER", description: "Registered developer", permissions: JSON.stringify(["read:products", "buy:products", "create:tickets", "review:products"]) },
    { name: "ADMIN", description: "Platform administrator", permissions: JSON.stringify(["manage:products", "manage:orders", "manage:users", "manage:tickets", "view:reports"]) },
    { name: "SUPER_ADMIN", description: "Super administrator with all permissions", permissions: JSON.stringify(["*"]) },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role,
    });
  }

  // 2. Users & Wallets
  const passwordHash = await bcrypt.hash("Admin@2026!", 10);
  const devPasswordHash = await bcrypt.hash("DevPass@2026!", 10);

  // Super Admin
  const superAdmin = await prisma.user.upsert({
    where: { email: "superadmin@robloxmarket.dev" },
    update: {},
    create: {
      email: "superadmin@robloxmarket.dev",
      passwordHash,
      role: "SUPER_ADMIN",
      profile: {
        create: {
          displayName: "Nexro SuperAdmin",
          robloxUsername: "NexroExecutive",
          avatarUrl: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80",
          bio: "Lead Systems Architect & Platform Administrator for Roblox Asset Marketplace.",
        },
      },
      wallet: {
        create: {
          balance: 10000000,
          totalDeposited: 10000000,
          totalSpent: 0,
        },
      },
    },
  });

  // Admin
  const admin = await prisma.user.upsert({
    where: { email: "admin@robloxmarket.dev" },
    update: {},
    create: {
      email: "admin@robloxmarket.dev",
      passwordHash,
      role: "ADMIN",
      profile: {
        create: {
          displayName: "Khai Admin",
          robloxUsername: "KhaiRobloxDev",
          avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
          bio: "Quality Assurance and Product Management lead.",
        },
      },
      wallet: {
        create: {
          balance: 2000000,
          totalDeposited: 2000000,
          totalSpent: 0,
        },
      },
    },
  });

  // Developer User
  const devUser = await prisma.user.upsert({
    where: { email: "developer@robloxmarket.dev" },
    update: {},
    create: {
      email: "developer@robloxmarket.dev",
      passwordHash: devPasswordHash,
      role: "USER",
      profile: {
        create: {
          displayName: "Viper Lua Developer",
          robloxUsername: "ViperScripter_RBX",
          avatarUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
          bio: "Game developer building FPS and Roleplay frameworks on Roblox.",
        },
      },
      wallet: {
        create: {
          balance: 750000,
          totalDeposited: 1000000,
          totalSpent: 250000,
        },
      },
    },
  });

  // 3. Product Categories
  const categoriesData = [
    { name: "Roblox Models", slug: "models", icon: "Box", sortOrder: 1, description: "High-poly and low-poly 3D models, props, and modular assets optimized for Roblox Studio." },
    { name: "Scripts", slug: "scripts", icon: "Code", sortOrder: 2, description: "Clean, performant, and well-documented Luau scripts and open-source modules." },
    { name: "Systems", slug: "systems", icon: "Layers", sortOrder: 3, description: "Complete gameplay systems: Combat, Inventory, Economy, Crafting, and Leveling." },
    { name: "Maps & Terrain", slug: "maps-terrain", icon: "Map", sortOrder: 4, description: "Expansive open-world maps, detailed terrain heights, and custom environment lighting." },
    { name: "UI Kits", slug: "ui-kits", icon: "Layout", sortOrder: 5, description: "Polished modern HUDs, shop interfaces, inventory grids, and animated UI kits." },
    { name: "Vehicles", slug: "vehicles", icon: "Car", sortOrder: 6, description: "Driveable vehicles with custom suspension, A-Chassis tuning, and realistic engine audio." },
    { name: "Buildings", slug: "buildings", icon: "Building2", sortOrder: 7, description: "Architectural structures, realistic interiors, modern houses, and military bases." },
    { name: "Tools", slug: "tools", icon: "Wrench", sortOrder: 8, description: "Melee weapons, firearms, interactive gadgets, and equipment tools." },
    { name: "Plugins", slug: "plugins", icon: "Cpu", sortOrder: 9, description: "Roblox Studio productivity plugins for faster building and automated level design." },
    { name: "Other Assets", slug: "other", icon: "Sparkles", sortOrder: 10, description: "Visual effects (VFX), particle packs, sound effects (SFX), and animations." },
  ];

  const categoryMap = new Map();
  for (const cat of categoriesData) {
    const createdCat = await prisma.productCategory.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categoryMap.set(cat.slug, createdCat.id);
  }

  // 4. Tags
  const tagsList = ["FPS", "Combat", "ACS", "Inventory", "UI", "OpenWorld", "Cyberpunk", "Medieval", "Physics", "Optimized", "Luau", "FE", "LowPoly"];
  const tagMap = new Map();
  for (const t of tagsList) {
    const slug = t.toLowerCase();
    const tag = await prisma.tag.upsert({
      where: { slug },
      update: {},
      create: { name: t, slug },
    });
    tagMap.set(t, tag.id);
  }

  // 5. Products
  const products = [
    {
      title: "Apex Combat System (ACS) v2.5 Enterprise Edition",
      slug: "apex-combat-system-enterprise",
      subtitle: "The most realistic, modular, and optimized FPS gun & ballistics framework for Roblox.",
      price: 250000,
      originalPrice: 350000,
      discountPercent: 28,
      isFeatured: true,
      isTrending: true,
      isBestSeller: true,
      fileFormat: ".rbxm, .luau",
      robloxVersion: "Studio v0.640+",
      creatorName: "TacticalRoblox Studios",
      categorySlug: "systems",
      tags: ["FPS", "Combat", "ACS", "FE", "Optimized"],
      features: JSON.stringify([
        "Physics-based projectile trajectory and realistic bullet penetration",
        "Over 30+ pre-configured modern weapons (Assault Rifles, SMGs, Snipers, Shotguns)",
        "Fully customizable attachments system (Suppressors, Scopes, Grips, Lasers)",
        "Zero-latency client-authoritative raycast verification with anti-cheat protection",
        "Fluid first-person and third-person camera recoil spring physics",
        "Spatial 3D audio occlusion and realistic weapon sound design",
      ]),
      installationGuide: `### Installation Guide
1. Download the \`.rbxm\` file from your library.
2. In Roblox Studio, right-click **ServerScriptService** and select **Insert from File...**.
3. Move the enclosed folder \`ACS_Replicated\` into **ReplicatedStorage**.
4. Move \`ACS_Server\` into **ServerScriptService** and \`ACS_Client\` into **StarterPlayerScripts**.
5. Customize weapon stats inside \`ReplicatedStorage.ACS_Framework.Configuration\`!`,
      description: `### Apex Combat System (ACS) Enterprise Edition

**Apex Combat System** is the gold standard for tactical military, roleplay, and competitive FPS experiences on Roblox. Rebuilt from the ground up with pure Luau type safety, this framework eliminates network lag while delivering AAA firearm handling.

#### Why Choose ACS Enterprise?
- **Extreme Performance**: Benchmark tested with 50 simultaneous active players firing automatic weapons with zero frame-rate drops.
- **True Bullet Drop & Drag**: Ballistics engine calculates humidity, distance falloff, and surface material resistance (wood, metal, concrete).
- **Comprehensive Documentation**: Complete step-by-step video tutorial and interactive playground uncopylocked place included.`,
      images: [
        "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1200&auto=format&fit=crop&q=80",
      ],
      files: [
        { fileName: "ApexCombatSystem_v2.5_Enterprise.rbxm", fileSize: "24.5 MB", fileFormat: ".rbxm", storagePath: "/storage/protected/products/apex-combat-system-enterprise/ApexCombatSystem_v2.5_Enterprise.rbxm", version: "2.5.0" }
      ],
      versions: [
        { versionNumber: "v2.5.0", changelog: "Added dynamic recoil camera shake, dual optic toggle, and reduced client network packet size by 40%." },
        { versionNumber: "v2.4.1", changelog: "Patched stance clipping on sloped terrain and improved shotgun pellet spread." },
      ]
    },
    {
      title: "Neo-Tokyo Cyberpunk Megacity & Expressway",
      slug: "neo-tokyo-cyberpunk-megacity",
      subtitle: "High-fidelity futuristic city with neon skyscrapers, elevated highways, and interior transit.",
      price: 190000,
      originalPrice: 280000,
      discountPercent: 32,
      isFeatured: true,
      isTrending: true,
      isBestSeller: false,
      fileFormat: ".rbxl, .rbxm",
      robloxVersion: "Studio v0.635+",
      creatorName: "Horizon Worldbuilders",
      categorySlug: "maps-terrain",
      tags: ["Cyberpunk", "OpenWorld", "Optimized"],
      features: JSON.stringify([
        "Sprawling 2048x2048 stud urban layout with modular city blocks",
        "Over 120+ unique cybernetic props, neon signs, vending machines, and holographic billboards",
        "Level of Detail (LOD) and StreamingEnabled optimized for mobile and console compatibility",
        "Realistic Future Lighting setup with volumetric atmospheric haze and rain puddles",
        "Fully drivable 4-lane elevated skyway with ramps and toll gates",
      ]),
      installationGuide: `### Installation Guide
1. Open the provided \`.rbxl\` place file directly in Roblox Studio.
2. If importing into an existing game, insert the \`NeoTokyo_CityMap.rbxm\` into **Workspace**.
3. Ensure **Workspace.StreamingEnabled** is turned **ON** for optimal rendering.
4. Enjoy your dystopian neon paradise!`,
      description: `### Neo-Tokyo Cyberpunk Megacity

Step into the year 2099 with the ultimate Cyberpunk environment built specifically for Roblox Studio. Every building features handcrafted vertex normals, optimized mesh topologies, and emissive neon textures that glow intensely under Roblox's Future Lighting technology.`,
      images: [
        "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80",
      ],
      files: [
        { fileName: "NeoTokyo_Cyberpunk_Place_v1.4.rbxl", fileSize: "82.4 MB", fileFormat: ".rbxl", storagePath: "/storage/protected/products/neo-tokyo-cyberpunk-megacity/NeoTokyo_Cyberpunk_Place_v1.4.rbxl", version: "1.4.0" }
      ],
      versions: [
        { versionNumber: "v1.4.0", changelog: "Added animated holographic fish billboards and optimized collision meshes on elevated highways." }
      ]
    },
    {
      title: "OmniUI: Modern Glass & Dark Developer UI Suite",
      slug: "omni-ui-modern-dark-suite",
      subtitle: "Complete vector-sharp UI system with 80+ animated screens, dialogs, and inventory grids.",
      price: 120000,
      originalPrice: 180000,
      discountPercent: 33,
      isFeatured: true,
      isTrending: false,
      isBestSeller: true,
      fileFormat: ".rbxm, .luau",
      robloxVersion: "Studio v0.640+",
      creatorName: "InterfaceForge",
      categorySlug: "ui-kits",
      tags: ["UI", "Luau", "Optimized"],
      features: JSON.stringify([
        "Responsive autolayout supporting Mobile, Tablet, PC, and Ultrawide displays",
        "Smooth spring physics animations powered by TweenService & Fusion",
        "Includes Shop, Inventory, Player Stats, Settings, Chat HUD, and Daily Rewards",
        "Easily customisable color palette and typography tokens",
        "Sound effects bundled with UI interactions (clicks, hovers, purchase bells)",
      ]),
      installationGuide: `### Installation Guide
1. Drag \`OmniUI_Framework.rbxm\` into **StarterGui**.
2. Configure your themes inside \`OmniUI.ThemeConfig\` module script.
3. Call UI opening functions using \`OmniUI:OpenWindow('Shop')\`.`,
      description: `### OmniUI Dark & Glass Developer Suite

Tired of clunky, outdated Roblox user interfaces? **OmniUI** delivers modern, crisp, professional design inspired by top-tier Steam and Epic titles. Every component is programmed with Luau type checking and responsive UI constraints.`,
      images: [
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80",
      ],
      files: [
        { fileName: "OmniUI_Modern_Suite_v3.0.rbxm", fileSize: "12.8 MB", fileFormat: ".rbxm", storagePath: "/storage/protected/products/omni-ui-modern-dark-suite/OmniUI_Modern_Suite_v3.0.rbxm", version: "3.0.0" }
      ],
      versions: [
        { versionNumber: "v3.0.0", changelog: "Complete redesign with 9-slice responsive scaling and sound effects integration." }
      ]
    },
    {
      title: "HyperDrive Pro: A-Chassis 6.8 Tuned Supercars Pack",
      slug: "hyperdrive-pro-tuned-supercars",
      subtitle: "5 ultra-realistic driveable supercars with realistic drifting physics and interior cockpits.",
      price: 160000,
      originalPrice: 220000,
      discountPercent: 27,
      isFeatured: false,
      isTrending: true,
      isBestSeller: true,
      fileFormat: ".rbxm",
      robloxVersion: "Studio v0.638+",
      creatorName: "Octane Motorsports",
      categorySlug: "vehicles",
      tags: ["Physics", "Optimized"],
      features: JSON.stringify([
        "Custom A-Chassis 6.8 tuned for realistic grip, wheelspin, and smooth drift countersteering",
        "Functional headlights, brake lights, sequential turn signals, and underglow neon",
        "First-person cockpit view with working speedometer, RPM tachometer, and rearview mirrors",
        "Authentic V8/V10/V12 twin-turbo exhaust engine rev and backfire audio loops",
        "Opening doors, hood, and trunk with smooth hinge constraints",
      ]),
      installationGuide: `### Installation Guide
1. Import \`HyperDrive_Supercars.rbxm\` into **Workspace**.
2. Hop into the driver seat and press **E** to start ignition, **W/A/S/D** to drive, **Space** for handbrake!`,
      description: `### HyperDrive Pro Supercars Collection

Experience motorsport realism in Roblox. This pack features 5 meticulously optimized exotic hypercars designed for roleplay, racing, and city driving games.`,
      images: [
        "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1200&auto=format&fit=crop&q=80",
      ],
      files: [
        { fileName: "HyperDrive_Pro_Supercars_v2.1.rbxm", fileSize: "38.2 MB", fileFormat: ".rbxm", storagePath: "/storage/protected/products/hyperdrive-pro-tuned-supercars/HyperDrive_Pro_Supercars_v2.1.rbxm", version: "2.1.0" }
      ],
      versions: [
        { versionNumber: "v2.1.0", changelog: "Improved mobile thumbstick steering sensitivity and enhanced tire smoke particle emitter." }
      ]
    },
    {
      title: "Valhalla RPG: Complete Inventory, Crafting & Skill Tree System",
      slug: "valhalla-rpg-inventory-crafting-system",
      subtitle: "Full-featured RPG engine with drag-and-drop inventory, equipment slots, recipe crafting, and persistent DataStore2.",
      price: 290000,
      originalPrice: 420000,
      discountPercent: 31,
      isFeatured: true,
      isTrending: true,
      isBestSeller: true,
      fileFormat: ".rbxm, .luau",
      robloxVersion: "Studio v0.640+",
      creatorName: "MythicStudio Developers",
      categorySlug: "systems",
      tags: ["Inventory", "Combat", "Luau", "FE"],
      features: JSON.stringify([
        "Grid-based drag & drop inventory with stackable items and rarity tiers",
        "Equipment paperdoll system (Armor, Helmets, Boots, Rings, Primary & Secondary Weapons)",
        "Tiered crafting station with success probability and timed blacksmithing",
        "Branching Skill Tree with active abilities and passive character bonuses",
        "Automated ProfileStore / DataStore2 autosave with session-locking anti-duplication protection",
      ]),
      installationGuide: `### Installation Guide
1. Place the module in **ServerScriptService** and **ReplicatedStorage**.
2. Run database migration by enabling Studio API Services in Game Settings.
3. Test locally with 2 players in Start Local Server mode.`,
      description: `### Valhalla RPG Engine

The most comprehensive RPG system available on Roblox Studio. Features zero-dupe architecture with transactional item moving and session locks.`,
      images: [
        "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&auto=format&fit=crop&q=80",
      ],
      files: [
        { fileName: "Valhalla_RPG_System_v4.0.rbxm", fileSize: "19.8 MB", fileFormat: ".rbxm", storagePath: "/storage/protected/products/valhalla-rpg-inventory-crafting-system/Valhalla_RPG_System_v4.0.rbxm", version: "4.0.0" }
      ],
      versions: [
        { versionNumber: "v4.0.0", changelog: "Migrated to ProfileStore session locking for 100% dupe prevention." }
      ]
    },
    {
      title: "StudioAssist: Automated Building & Terrain Brush Plugin",
      slug: "studio-assist-building-terrain-plugin",
      subtitle: "Supercharge your Roblox Studio workflow: instant road generator, vegetation scattering, and prop alignment.",
      price: 80000,
      originalPrice: 120000,
      discountPercent: 33,
      isFeatured: false,
      isTrending: false,
      isBestSeller: false,
      fileFormat: ".rbxm, .lua",
      robloxVersion: "Studio v0.640+",
      creatorName: "DevTools Labs",
      categorySlug: "plugins",
      tags: ["Luau", "Optimized"],
      features: JSON.stringify([
        "Procedural spline-based curved road and highway generator",
        "Physics-driven prop scatter tool (rocks, trees, grass, debris)",
        "One-click multi-part surface snapping and surface normal alignment",
        "Color palette picker and bulk material swapper",
      ]),
      installationGuide: `### Installation Guide
1. Download the \`.rbxm\` plugin file.
2. Put into your Roblox Studio Plugins folder or right click and select "Save as Local Plugin".
3. Open the plugin from the **Plugins** ribbon bar tab in Studio.`,
      description: `### StudioAssist Productivity Plugin

Designed by veteran Roblox developers to save hours of tedious manual placement. Generates procedural roads, paths, and foliage with mathematical precision.`,
      images: [
        "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80",
      ],
      files: [
        { fileName: "StudioAssist_Plugin_v1.8.rbxm", fileSize: "4.1 MB", fileFormat: ".rbxm", storagePath: "/storage/protected/products/studio-assist-building-terrain-plugin/StudioAssist_Plugin_v1.8.rbxm", version: "1.8.0" }
      ],
      versions: [
        { versionNumber: "v1.8.0", changelog: "Added spline curvature controls and automatic tunnel digging." }
      ]
    },
    {
      title: "Free Starter Pack: Low Poly Medieval Town Assets",
      slug: "free-starter-pack-medieval-town",
      subtitle: "A delightful pack of 45 modular low-poly medieval buildings, carts, windmills, and trees.",
      price: 0,
      originalPrice: 50000,
      discountPercent: 100,
      isFree: true,
      isFeatured: true,
      isTrending: true,
      isBestSeller: false,
      fileFormat: ".rbxm",
      robloxVersion: "Studio v0.630+",
      creatorName: "Community Freebies",
      categorySlug: "models",
      tags: ["Medieval", "LowPoly", "Optimized"],
      features: JSON.stringify([
        "45+ Hand-crafted low poly assets with shared texture atlas",
        "Modular walls, watchtowers, market stalls, and houses",
        "Optimized triangle counts suitable for massive multiplayer performance",
        "Free to use for commercial and non-commercial games",
      ]),
      installationGuide: `### Installation Guide
1. Simply click Free Download!
2. Drag into Workspace and start arranging your kingdom!`,
      description: `### Free Low Poly Medieval Pack

A high quality gift for the Roblox developer community. Clean meshes, single palette texture map, and zero lag.`,
      images: [
        "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80",
      ],
      files: [
        { fileName: "Free_Medieval_Town_Pack.rbxm", fileSize: "8.6 MB", fileFormat: ".rbxm", storagePath: "/storage/protected/products/free-starter-pack-medieval-town/Free_Medieval_Town_Pack.rbxm", version: "1.0.0" }
      ],
      versions: [
        { versionNumber: "v1.0.0", changelog: "Initial community release." }
      ]
    }
  ];

  for (const p of products) {
    const categoryId = categoryMap.get(p.categorySlug);
    if (!categoryId) continue;

    const createdProduct = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        title: p.title,
        slug: p.slug,
        subtitle: p.subtitle,
        description: p.description,
        features: p.features,
        installationGuide: p.installationGuide,
        price: p.price,
        originalPrice: p.originalPrice,
        discountPercent: p.discountPercent,
        isFree: p.isFree || false,
        isFeatured: p.isFeatured,
        isTrending: p.isTrending,
        isBestSeller: p.isBestSeller,
        status: "PUBLISHED",
        salesCount: Math.floor(Math.random() * 80) + 12,
        viewCount: Math.floor(Math.random() * 900) + 150,
        ratingAverage: 4.9,
        ratingCount: Math.floor(Math.random() * 25) + 5,
        robloxVersion: p.robloxVersion,
        fileFormat: p.fileFormat,
        creatorName: p.creatorName,
        categoryId,
      },
    });

    // Images
    for (let i = 0; i < p.images.length; i++) {
      await prisma.productImage.create({
        data: {
          productId: createdProduct.id,
          imageUrl: p.images[i],
          isThumbnail: i === 0,
          sortOrder: i,
        },
      });
    }

    // Files
    for (const f of p.files) {
      await prisma.productFile.create({
        data: {
          productId: createdProduct.id,
          fileName: f.fileName,
          fileSize: f.fileSize,
          fileFormat: f.fileFormat,
          storagePath: f.storagePath,
          version: f.version,
          isLatest: true,
        },
      });
    }

    // Versions
    for (const v of p.versions) {
      await prisma.productVersion.create({
        data: {
          productId: createdProduct.id,
          versionNumber: v.versionNumber,
          changelog: v.changelog,
        },
      });
    }

    // Tags
    for (const tagName of p.tags) {
      const tagId = tagMap.get(tagName);
      if (tagId) {
        await prisma.productTag.create({
          data: {
            productId: createdProduct.id,
            tagId,
          },
        });
      }
    }

    // Initial Reviews
    await prisma.review.create({
      data: {
        productId: createdProduct.id,
        userId: devUser.id,
        rating: 5,
        comment: "Exceptional code quality and performance! Integrated seamlessly into our production Roblox experience without any desync issues.",
        isApproved: true,
      },
    });
  }

  // 6. Payment Providers
  await prisma.paymentProvider.upsert({
    where: { code: "VIETQR" },
    update: {},
    create: {
      code: "VIETQR",
      name: "VietQR Banking Transfer (Tự Động)",
      isActive: true,
      isSandbox: false,
      bankName: "MBBank",
      bankAccount: "999988886666",
      bankAccountName: "ROBLOX ASSET MARKETPLACE",
      webhookSecret: "whsec_rbxmarket_super_secure_secret_2026",
    },
  });

  await prisma.paymentProvider.upsert({
    where: { code: "SANDBOX" },
    update: {},
    create: {
      code: "SANDBOX",
      name: "Sandbox Payment Simulator (Thử Nghiệm Nhanh)",
      isActive: true,
      isSandbox: true,
      webhookSecret: "whsec_rbxmarket_sandbox_secret",
    },
  });

  // 7. Coupons
  await prisma.coupon.upsert({
    where: { code: "WELCOME10" },
    update: {},
    create: {
      code: "WELCOME10",
      discountType: "PERCENTAGE",
      discountValue: 10,
      minOrderValue: 50000,
      maxUses: 500,
      usedCount: 14,
      isActive: true,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
    },
  });

  await prisma.coupon.upsert({
    where: { code: "ROBLOXDEV" },
    update: {},
    create: {
      code: "ROBLOXDEV",
      discountType: "FIXED",
      discountValue: 50000,
      minOrderValue: 150000,
      maxUses: 100,
      usedCount: 22,
      isActive: true,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 180),
    },
  });

  // 8. Banners
  await prisma.banner.create({
    data: {
      title: "Next-Gen Roblox Combat Framework 2026",
      subtitle: "Zero latency client raycast, procedural recoil, and over 30+ tuned weapons ready for your battle royale or tactical shooter.",
      link: "/product/apex-combat-system-enterprise",
      badgeText: "HOT RELEASE",
      imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1600&auto=format&fit=crop&q=80",
      isActive: true,
      sortOrder: 1,
    },
  });

  // 9. Website Settings
  const defaultSettings = [
    { key: "SITE_NAME", value: "Roblox Asset Marketplace", description: "Marketplace brand title" },
    { key: "CURRENCY_SYMBOL", value: "đ", description: "Currency symbol (VND)" },
    { key: "SUPPORT_EMAIL", value: "support@robloxmarket.dev", description: "Customer support email" },
    { key: "MAINTENANCE_MODE", value: "false", description: "Toggle maintenance mode on/off" },
    { key: "VIETQR_BANK_ID", value: "970422", description: "MBBank BIN code for VietQR" },
    { key: "MIN_DEPOSIT_AMOUNT", value: "20000", description: "Minimum deposit in VND" },
  ];

  for (const s of defaultSettings) {
    await prisma.websiteSetting.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    });
  }

  // 10. Sample Completed Order for Developer User
  const apexProduct = await prisma.product.findUnique({ where: { slug: "omni-ui-modern-dark-suite" } });
  if (apexProduct) {
    const order = await prisma.order.create({
      data: {
        orderNumber: "ORD-202610-1092",
        userId: devUser.id,
        subtotal: 120000,
        discountAmount: 0,
        totalAmount: 120000,
        status: "COMPLETED",
        paymentMethod: "WALLET",
        items: {
          create: {
            productId: apexProduct.id,
            price: 120000,
            licenseType: "STANDARD",
          },
        },
      },
    });

    await prisma.walletTransaction.create({
      data: {
        walletId: (await prisma.wallet.findUnique({ where: { userId: devUser.id } }))!.id,
        type: "PURCHASE",
        amount: -120000,
        balanceBefore: 870000,
        balanceAfter: 750000,
        referenceId: order.orderNumber,
        description: `Mua sản phẩm: ${apexProduct.title}`,
        status: "COMPLETED",
      },
    });
  }

  console.log("✅ Seed completed successfully with realistic Roblox marketplace data!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
