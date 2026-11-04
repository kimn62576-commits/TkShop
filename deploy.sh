#!/usr/bin/env bash
# ====================================================
# TKSHOP.VN - SCRIPT DEPLOY TỰ ĐỘNG CHO LINUX VPS
# ====================================================

set -e

echo "🚀 [1/5] Kiểm tra môi trường Node.js..."
node -v
npm -v

echo "📦 [2/5] Cài đặt dependencies..."
npm install --legacy-peer-deps

echo "⚡ [3/5] Tạo Prisma Client & Đồng bộ CSDL..."
npx prisma generate
npx prisma db push

echo "🔨 [4/5] Build Next.js Production..."
npm run build

echo "🌟 [5/5] Khởi động ứng dụng với PM2..."
if command -v pm2 &> /dev/null; then
    pm2 reload ecosystem.config.js || pm2 start ecosystem.config.js
    pm2 save
    echo "✅ Ứng dụng đã chạy thành công qua PM2 tại port 3000!"
else
    echo "⚠️ Chưa cài đặt PM2. Chạy 'npm install -g pm2' để quản lý tiến trình nền."
    echo "Khởi động tạm thời bằng lệnh 'npm run start'..."
    npm run start
fi
