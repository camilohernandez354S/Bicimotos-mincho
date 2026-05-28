import { PrismaClient } from "@prisma/client";

// Una sola instancia de PrismaClient para toda la app
// (crear varias rompe el pool de conexiones)
export const prisma = new PrismaClient();
