import { auth } from "@/auth"
import { NextResponse } from "next/server"
import { PrismaClient, DisplayUnit } from "@prisma/client"
import { toBaseQty } from "@/lib/units"
import { Decimal } from "decimal.js"

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { productId, requestedQty, requestedUnit } = body

    if (!productId || !requestedQty || !requestedUnit) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    const baseQty = toBaseQty(requestedQty, requestedUnit as DisplayUnit)
    const calculatedPrice = baseQty.mul(new Decimal(product.pricePerBaseUnit.toString()))

    // Create the order and order item in a transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId: session.user.id!,
          totalAmount: calculatedPrice,
          items: {
            create: {
              productId: product.id,
              requestedQty: new Decimal(requestedQty),
              requestedUnit: requestedUnit as DisplayUnit,
              baseQty: baseQty,
              pricePerBaseUnitAtTime: product.pricePerBaseUnit,
              calculatedPrice: calculatedPrice
            }
          }
        }
      })
      
      // Optionally update inventory here or wait for Admin to approve
      // For this hackathon, we can decrement inventory immediately
      await tx.product.update({
        where: { id: product.id },
        data: {
          inventoryBaseQty: {
            decrement: baseQty
          }
        }
      })

      return newOrder
    })

    return NextResponse.json({ success: true, orderId: order.id }, { status: 201 })
  } catch (err) {
    console.error("Order error", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
