import { PrismaClient, BaseUnit } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10)
  const sellerPassword = await bcrypt.hash('seller123', 10)

  // Create users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      email: 'admin@test.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  })

  const seller = await prisma.user.upsert({
    where: { email: 'seller@test.com' },
    update: {},
    create: {
      email: 'seller@test.com',
      name: 'Seller User',
      password: sellerPassword,
      role: 'SELLER',
    },
  })

  // Create products
  await prisma.product.upsert({
    where: { sku: 'CHEM-001' },
    update: {},
    create: {
      name: 'Sodium Chloride (NaCl)',
      sku: 'CHEM-001',
      description: 'High purity sodium chloride',
      baseUnit: BaseUnit.GRAM,
      pricePerBaseUnit: 0.05, // 0.05 INR per gram
      inventoryBaseQty: 50000, // 50,000 grams
    },
  })

  await prisma.product.upsert({
    where: { sku: 'CHEM-002' },
    update: {},
    create: {
      name: 'Hydrochloric Acid 37%',
      sku: 'CHEM-002',
      description: 'Concentrated HCl',
      baseUnit: BaseUnit.MILLILITER,
      pricePerBaseUnit: 0.15, // 0.15 INR per mL
      inventoryBaseQty: 100000, // 100,000 mL
    },
  })

  await prisma.product.upsert({
    where: { sku: 'EQUIP-001' },
    update: {},
    create: {
      name: 'Glass Beaker 500mL',
      sku: 'EQUIP-001',
      description: 'Borosilicate glass beaker',
      baseUnit: BaseUnit.ITEM,
      pricePerBaseUnit: 150.00, // 150 INR per item
      inventoryBaseQty: 200, // 200 items
    },
  })

  await prisma.product.upsert({
    where: { sku: 'CHEM-003' },
    update: {},
    create: {
      name: 'Sulfuric Acid 98%',
      sku: 'CHEM-003',
      description: 'Concentrated H2SO4',
      baseUnit: BaseUnit.MILLILITER,
      pricePerBaseUnit: 0.25,
      inventoryBaseQty: 50000,
    },
  })

  await prisma.product.upsert({
    where: { sku: 'CHEM-004' },
    update: {},
    create: {
      name: 'Potassium Permanganate',
      sku: 'CHEM-004',
      description: 'KMnO4 dark purple crystals',
      baseUnit: BaseUnit.GRAM,
      pricePerBaseUnit: 1.20,
      inventoryBaseQty: 10000,
    },
  })

  await prisma.product.upsert({
    where: { sku: 'EQUIP-002' },
    update: {},
    create: {
      name: 'Erlenmeyer Flask 250mL',
      sku: 'EQUIP-002',
      description: 'Conical flask for titrations',
      baseUnit: BaseUnit.ITEM,
      pricePerBaseUnit: 120.00,
      inventoryBaseQty: 350,
    },
  })

  console.log('Seed completed successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
