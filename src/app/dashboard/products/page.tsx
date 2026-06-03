import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { PrismaClient } from "@prisma/client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const prisma = new PrismaClient()

export default async function AdminProductsPage() {
  const session = await auth()
  
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/dashboard")
  }

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="space-y-8">
      {/* Header Panel */}
      <div className="flex justify-between items-center border-b border-zinc-100 pb-5">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Products</h1>
          <p className="mt-1 text-sm text-zinc-500">Manage global system inventory values and base pricing.</p>
        </div>
      </div>

      {/* Modern Minimalist Table Container */}
      <div className="overflow-hidden rounded-xl border border-zinc-200/70 bg-white">
        <Table>
          <TableHeader className="bg-zinc-50/70">
            <TableRow className="hover:bg-transparent border-zinc-200/70">
              <TableHead className="h-11 text-xs font-medium uppercase tracking-wider text-zinc-500">SKU</TableHead>
              <TableHead className="h-11 text-xs font-medium uppercase tracking-wider text-zinc-500">Name</TableHead>
              <TableHead className="h-11 text-xs font-medium uppercase tracking-wider text-zinc-500">Base Unit</TableHead>
              <TableHead className="h-11 text-right text-xs font-medium uppercase tracking-wider text-zinc-500">Price per Base Unit</TableHead>
              <TableHead className="h-11 text-right text-xs font-medium uppercase tracking-wider text-zinc-500">Inventory (Base Qty)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-sm text-zinc-400 font-medium">
                  No products found in the database.
                </TableCell>
              </TableRow>
            )}
            
            {products.map((product) => (
              <TableRow key={product.id} className="border-zinc-100 hover:bg-zinc-50/40 transition-colors">
                {/* SKU Code Token */}
                <TableCell className="py-4">
                  <span className="inline-flex items-center rounded-md bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 font-mono tracking-tight border border-zinc-200/20">
                    {product.sku}
                  </span>
                </TableCell>
                
                {/* Product Name */}
                <TableCell className="py-4 text-sm font-medium text-zinc-900">
                  {product.name}
                </TableCell>
                
                {/* Base Unit Spec */}
                <TableCell className="py-4 text-sm text-zinc-600">
                  {product.baseUnit}
                </TableCell>
                
                {/* Unit Pricing */}
                <TableCell className="py-4 text-right text-sm font-semibold text-zinc-900">
                  ₹{Number(product.pricePerBaseUnit).toFixed(2)}
                </TableCell>
                
                {/* Inventory Balances */}
                <TableCell className="py-4 text-right text-sm font-medium text-zinc-600 font-mono">
                  {Number(product.inventoryBaseQty).toFixed(0)}{" "}
                  <span className="text-zinc-400 font-sans text-xs font-normal">{product.baseUnit}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}