// Script para crear un admin inicial. Corré:
//   node prisma/create-admin.js <email> <password> <nombre>
//
// Ejemplo:
//   node prisma/create-admin.js admin@bicimotos.com MiPass123 "Mincho"

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const [, , email, password, nombre] = process.argv;

  if (!email || !password || !nombre) {
    console.error("Uso: node prisma/create-admin.js <email> <password> <nombre>");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.admin.upsert({
    where: { email },
    update: { password: passwordHash, nombre },
    create: { email, password: passwordHash, nombre },
  });

  console.log(`Admin listo: ${admin.email} (id ${admin.id})`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
