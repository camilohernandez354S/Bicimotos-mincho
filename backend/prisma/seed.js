// Datos de ejemplo para poblar la base de datos durante el desarrollo.
// Corré: npm run db:seed

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Categorías base
  const categorias = await Promise.all([
    prisma.categoria.upsert({
      where: { slug: "bicicletas" },
      update: {},
      create: { nombre: "Bicicletas", slug: "bicicletas" },
    }),
    prisma.categoria.upsert({
      where: { slug: "marcos" },
      update: {},
      create: { nombre: "Marcos", slug: "marcos" },
    }),
    prisma.categoria.upsert({
      where: { slug: "accesorios" },
      update: {},
      create: { nombre: "Accesorios", slug: "accesorios" },
    }),
    prisma.categoria.upsert({
      where: { slug: "componentes" },
      update: {},
      create: { nombre: "Componentes", slug: "componentes" },
    }),
  ]);

  console.log(`Categorías creadas: ${categorias.map((c) => c.nombre).join(", ")}`);

  // Productos de ejemplo (los borrás cuando cargues los reales desde el admin)
  const [bicicletas, , accesorios, componentes] = categorias;

  await prisma.producto.createMany({
    data: [
      {
        nombre: "Mountain Bike Vairo XR 3.5",
        descripcion: "Bicicleta MTB rodado 29, cuadro aluminio, 21 velocidades.",
        precio: 450000,
        stock: 4,
        marca: "Vairo",
        modelo: "XR 3.5",
        imagenes: [],
        destacado: true,
        categoriaId: bicicletas.id,
      },
      {
        nombre: "Casco Bell Adrenaline",
        descripcion: "Casco con visera removible y ajuste por dial.",
        precio: 35000,
        stock: 12,
        marca: "Bell",
        modelo: "Adrenaline",
        imagenes: [],
        categoriaId: accesorios.id,
      },
      {
        nombre: "Cadena Shimano HG40",
        descripcion: "Cadena para grupos de 7/8 velocidades.",
        precio: 12500,
        stock: 25,
        marca: "Shimano",
        modelo: "HG40",
        imagenes: [],
        categoriaId: componentes.id,
      },
    ],
    skipDuplicates: true,
  });

  console.log("Productos de ejemplo creados.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
