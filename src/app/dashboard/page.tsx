import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { PrismaClient } from "@prisma/client"
import { AdminOverview } from "@/components/admin-overview"
import { SellerCatalog } from "@/components/seller-catalog"

const prisma = new PrismaClient()

export default async function DashboardPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }
  
  const role = (session.user as { role: string }).role
  
  if (role === "ADMIN") {
    const productsCount = await prisma.product.count()
    const ordersCount = await prisma.order.count()
    
    return <AdminOverview productsCount={productsCount} ordersCount={ordersCount} />
  } else {
    // Fetch products for seller
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" }
    })
    
    // Convert Decimal to string for passing to Client Component
    const safeProducts = products.map(p => ({
      ...p,
      pricePerBaseUnit: p.pricePerBaseUnit.toString(),
      inventoryBaseQty: p.inventoryBaseQty.toString(),
    }))
    
    return <SellerCatalog products={safeProducts} />
  }
}
