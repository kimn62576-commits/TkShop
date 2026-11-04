import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

let dbUrl = process.env.DATABASE_URL;

// Trên Vercel Serverless, hệ thống file gốc là Read-Only nên SQLite bắt buộc phải nằm trong thư mục /tmp
if (process.env.VERCEL) {
  const currentUrl = process.env.DATABASE_URL || "";
  if (!currentUrl.startsWith("postgres://") && !currentUrl.startsWith("postgresql://")) {
    const tmpDb = "/tmp/dev.db";
    const possiblePaths = [
      path.join(process.cwd(), "prisma", "dev.db"),
      path.join(process.cwd(), ".next", "server", "prisma", "dev.db"),
      path.resolve("./prisma/dev.db"),
    ];

    let foundSource = "";
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        foundSource = p;
        break;
      }
    }

    try {
      if (!fs.existsSync(tmpDb)) {
        if (foundSource) {
          fs.copyFileSync(foundSource, tmpDb);
          console.log(`[Vercel SQLite] Copied ${foundSource} to ${tmpDb} successfully!`);
        } else {
          console.warn("[Vercel SQLite] Source dev.db not found in bundle paths.");
        }
      }
    } catch (err) {
      console.error("[Vercel SQLite] Failed to copy bundled db to /tmp:", err);
    }

    dbUrl = `file:${tmpDb}`;
    process.env.DATABASE_URL = dbUrl;
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: dbUrl ? { db: { url: dbUrl } } : undefined,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
