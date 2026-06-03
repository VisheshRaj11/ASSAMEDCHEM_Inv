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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Manage inventory and base prices.</p>
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Base Unit</TableHead>
              <TableHead className="text-right">Price per Base Unit</TableHead>
              <TableHead className="text-right">Inventory (Base Qty)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  No products found.
                </TableCell>
              </TableRow>
            )}
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium"><Badge variant="outline">{product.sku}</Badge></TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.baseUnit}</TableCell>
                <TableCell className="text-right font-bold">₹{Number(product.pricePerBaseUnit).toFixed(2)}</TableCell>
                <TableCell className="text-right">{Number(product.inventoryBaseQty).toFixed(0)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
