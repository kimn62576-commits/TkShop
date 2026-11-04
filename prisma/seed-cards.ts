import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const TELCOS = [
  { code: "VIETTEL", name: "Viettel", discount: 12 },
  { code: "VINAPHONE", name: "VinaPhone", discount: 12 },
  { code: "MOBIFONE", name: "MobiFone", discount: 14 },
  { code: "VIETNAMOBILE", name: "Vietnamobile", discount: 16 },
  { code: "ZING", name: "Zing (VNG)", discount: 15 },
  { code: "GATE", name: "Gate (FPT)", discount: 15 },
  { code: "GARENA", name: "Garena", discount: 10 },
];

const AMOUNTS = [10000, 20000, 30000, 50000, 100000, 200000, 300000, 500000, 1000000];

async function main() {
  console.log("Seeding card discount rates...");

  for (const telco of TELCOS) {
    for (const amount of AMOUNTS) {
      if (telco.code === "GARENA" && amount < 20000) continue;
      if (telco.code === "VIETNAMOBILE" && (amount === 30000 || amount === 300000 || amount === 1000000)) continue;

      await prisma.cardDiscount.upsert({
        where: {
          telco_amount: {
            telco: telco.code,
            amount: amount,
          },
        },
        update: {
          discount: telco.discount,
          isActive: true,
        },
        create: {
          telco: telco.code,
          amount: amount,
          discount: telco.discount,
          isActive: true,
        },
      });
    }
  }

  console.log("Seeded card discounts successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
