import { PrismaClient } from "../app/generated/prisma/client";
import { Role } from "../app/generated/prisma/enums";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const products = [
  {
    name: "Nike Air Force 1",
    description: "The iconic Nike Air Force 1 features a timeless design with premium leather construction, Nike Air cushioning, and a durable rubber sole for all-day comfort.",
    brand: "Nike",
    price: 5495,
    imageUrls: [
      "/images/products/nike/airforce1-1.jpg",
      "/images/products/nike/airforce1-2.png",
      "/images/products/nike/airforce1-3.png",
    ],
  },
  {
    name: "Nike Air Max 90",
    description: "The Nike Air Max 90 delivers a bold look with its distinctive design lines and visible Air cushioning in the heel for responsive comfort.",
    brand: "Nike",
    price: 6795,
    imageUrls: [
      "/images/products/nike/am90-1.jpg",
      "/images/products/nike/am90-2.jpg",
      "/images/products/nike/am90-3.jpg",
      "/images/products/nike/am90-4.jpg",
    ],
  },
  {
    name: "Nike Dunk Low",
    description: "The Nike Dunk Low is a classic basketball shoe turned lifestyle icon, featuring a low-cut silhouette and premium materials.",
    brand: "Nike",
    price: 4895,
    imageUrls: [
      "/images/products/nike/dunk-1.jpg",
      "/images/products/nike/dunk-2.jpg",
      "/images/products/nike/dunk-3.jpg",
    ],
  },
  {
    name: "Adidas Ultraboost",
    description: "The Adidas Ultraboost provides maximum energy return with its responsive Boost midsole and Primeknit upper for a sock-like fit.",
    brand: "Adidas",
    price: 8995,
    imageUrls: [
      "/images/products/adidas/ultraboost-1.jpg",
      "/images/products/adidas/ultraboost-2.jpg",
      "/images/products/adidas/ultraboost-3.jpg",
    ],
  },
  {
    name: "Adidas Stan Smith",
    description: "The Adidas Stan Smith is a timeless tennis shoe with a clean, minimalist design that pairs perfectly with any outfit.",
    brand: "Adidas",
    price: 4595,
    imageUrls: [
      "/images/products/adidas/stansmith-1.jpg",
      "/images/products/adidas/stansmith-2.jpg",
      "/images/products/adidas/stansmith-3.jpg",
      "/images/products/adidas/stansmith-4.jpg",
    ],
  },
  {
    name: "Adidas Campus 00s",
    description: "The Adidas Campus 00s brings back the early 2000s vibe with a chunky silhouette, suede upper, and classic branding.",
    brand: "Adidas",
    price: 5495,
    imageUrls: [
      "/images/products/adidas/campus-1.jpg",
      "/images/products/adidas/campus-2.jpg",
      "/images/products/adidas/campus-3.jpg",
    ],
  },
  {
    name: "New Balance 550",
    description: "The New Balance 550 is a retro basketball sneaker that combines vintage aesthetics with modern comfort and durability.",
    brand: "New Balance",
    price: 6295,
    imageUrls: [
      "/images/products/new-balance/nb550-1.jpg",
      "/images/products/new-balance/nb550-2.jpg",
      "/images/products/new-balance/nb550-3.jpg",
    ],
  },
  {
    name: "New Balance 990v5",
    description: "The New Balance 990v5 offers premium comfort with its ENCAP midsole technology and pigskin suede upper, crafted in the USA.",
    brand: "New Balance",
    price: 11995,
    imageUrls: [
      "/images/products/new-balance/990v5-1.jpg",
      "/images/products/new-balance/990v5-2.jpg",
      "/images/products/new-balance/990v5-3.jpg",
      "/images/products/new-balance/990v5-4.jpg",
    ],
  },
  {
    name: "Vans Old Skool",
    description: "The Vans Old Skool is a classic skate shoe featuring the iconic side stripe, canvas and suede upper, and padded collar for support.",
    brand: "Vans",
    price: 3795,
    imageUrls: [
      "/images/products/vans/oldskool-1.jpg",
      "/images/products/vans/oldskool-2.jpg",
      "/images/products/vans/oldskool-3.jpg",
    ],
  },
  {
    name: "Vans Sk8-Hi",
    description: "The Vans Sk8-Hi is a high-top skate shoe with the signature side stripe, sturdy canvas and suede upper, and enhanced ankle support.",
    brand: "Vans",
    price: 4195,
    imageUrls: [
      "/images/products/vans/sk8hi-1.jpg",
      "/images/products/vans/sk8hi-2.jpg",
      "/images/products/vans/sk8hi-3.jpg",
      "/images/products/vans/sk8hi-4.jpg",
    ],
  },
  {
    name: "Converse Chuck Taylor All Star",
    description: "The Converse Chuck Taylor All Star is the original basketball shoe turned cultural icon with its timeless canvas design and rubber toe cap.",
    brand: "Converse",
    price: 3495,
    imageUrls: [
      "/images/products/converse/chuck-1.jpg",
      "/images/products/converse/chuck-2.jpg",
      "/images/products/converse/chuck-3.jpg",
    ],
  },
  {
    name: "Converse Chuck 70",
    description: "The Converse Chuck 70 elevates the classic with premium canvas, a cushioned footbed, and vintage-inspired details for superior comfort.",
    brand: "Converse",
    price: 4995,
    imageUrls: [
      "/images/products/converse/chuck70-1.jpg",
      "/images/products/converse/chuck70-2.jpg",
      "/images/products/converse/chuck70-3.jpg",
      "/images/products/converse/chuck70-4.jpg",
    ],
  },
];

const sizes = ["39", "40", "41", "42", "43", "44", "45"];

function getRandomStock(): number {
  return Math.floor(Math.random() * 13) + 3;
}

async function main() {
  console.log("Seeding database...");

  const hashedPassword = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  console.log(`Created admin user: ${admin.email}`);

  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  console.log("Cleared existing products and variants");

  for (const product of products) {
    const { imageUrls, ...productData } = product;

    const created = await prisma.product.create({
      data: {
        ...productData,
        imageUrls,
        variants: {
          create: sizes.map((size) => ({
            size,
            stock: getRandomStock(),
          })),
        },
      },
    });

    console.log(`Created product: ${created.name} (${created.brand}) - ₱${created.price.toLocaleString()}`);
  }

  const totalProducts = await prisma.product.count();
  const totalVariants = await prisma.productVariant.count();
  console.log(`\nSeed complete: ${totalProducts} products, ${totalVariants} variants created`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
