"use server"

import { PrismaClient, BaseUnit } from "@prisma/client"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { Decimal } from "decimal.js"

const prisma = new PrismaClient()

export async function createProduct(formData: FormData) {
  try {
    const session = await auth()
    
    if (!session?.user || (session.user as { role: string }).role !== "ADMIN") {
      return { success: false, error: "Unauthorized" }
    }

    const name = formData.get("name") as string
    const sku = formData.get("sku") as string
    const description = formData.get("description") as string
    const baseUnit = formData.get("baseUnit") as BaseUnit
    
    const priceStr = formData.get("pricePerBaseUnit") as string
    const qtyStr = formData.get("inventoryBaseQty") as string
    
    if (!name || !sku || !baseUnit || !priceStr || !qtyStr) {
      return { success: false, error: "Missing required fields" }
    }
    
    // Ensure accurate decimals
    const price = new Decimal(priceStr)
    const qty = new Decimal(qtyStr)
    
    if (price.isNaN() || price.isNegative() || qty.isNaN() || qty.isNegative()) {
       return { success: false, error: "Invalid numbers provided" }
    }

    const product = await prisma.product.create({
      data: {
        name,
        sku,
        description,
        baseUnit,
        pricePerBaseUnit: price.toString(),
        inventoryBaseQty: qty.toString(),
      }
    })

    revalidatePath("/dashboard")
    return { success: true, product }
  } catch (error: any) {
    console.error("Failed to create product:", error)
    if (error.code === 'P2002') {
        return { success: false, error: "A product with this SKU already exists." }
    }
    return { success: false, error: "Failed to create product" }
  }
}

export async function deleteProduct(productId: string) {
  try {
    const session = await auth()
    
    if (!session?.user || (session.user as { role: string }).role !== "ADMIN") {
      return { success: false, error: "Unauthorized" }
    }

    // Check if product is in any orders
    const existingOrders = await prisma.orderItem.findFirst({
        where: { productId }
    })
    
    if (existingOrders) {
        return { success: false, error: "Cannot delete product because it has been ordered by a seller. You must soft-delete it or remove the orders first." }
    }

    await prisma.product.delete({
      where: { id: productId }
    })

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Failed to delete product:", error)
    return { success: false, error: "Failed to delete product" }
  }
}
