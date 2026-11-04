# ====================================================
# DOCKERFILE CHUẨN DEBIAN CHO TKSHOP NEXT.JS + PRISMA
# ====================================================

FROM node:20-slim

WORKDIR /app

# Cài đặt OpenSSL & CA-certificates (Chuẩn cho Prisma trên Debian/Linux)
RUN apt-get update -y && \
    apt-get install -y --no-install-recommends openssl ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Cài đặt dependencies
COPY package.json package-lock.json* ./
COPY prisma ./prisma/

RUN npm install --legacy-peer-deps

# Sao chép toàn bộ mã nguồn
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Sinh Prisma Client với binaryTargets phù hợp cho mọi hệ điều hành
RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
