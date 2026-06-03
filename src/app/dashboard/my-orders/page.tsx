import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { PrismaClient } from "@prisma/client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

const prisma = new PrismaClient()

export default async function MyOrdersPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" }
  })

  // Helper mapping function to render dynamic, minimal status pills
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-50 text-amber-700 border-amber-200/60 hover:bg-amber-50"
      case "COMPLETED":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/60 hover:bg-emerald-50"
      case "CANCELLED":
        return "bg-zinc-100 text-zinc-600 border-zinc-200 hover:bg-zinc-100"
      default:
        return "bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-50"
    }
  }

  return (
    <div className="space-y-8">
      {/* Header Panel */}
      <div className="border-b border-zinc-100 pb-5">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">My Orders</h1>
        <p className="mt-1 text-sm text-zinc-500">View and track your complete purchase history.</p>
      </div>

      {/* Modern Minimalist Table Container */}
      <div className="overflow-hidden rounded-xl border border-zinc-200/70 bg-white">
        <Table>
          <TableHeader className="bg-zinc-50/70">
            <TableRow className="hover:bg-transparent border-zinc-200/70">
              <TableHead className="h-11 text-xs font-medium uppercase tracking-wider text-zinc-500">Order ID</TableHead>
              <TableHead className="h-11 text-xs font-medium uppercase tracking-wider text-zinc-500">Date</TableHead>
              <TableHead className="h-11 text-xs font-medium uppercase tracking-wider text-zinc-500">Product</TableHead>
              <TableHead className="h-11 text-xs font-medium uppercase tracking-wider text-zinc-500">Quantity</TableHead>
              <TableHead className="h-11 text-xs font-medium uppercase tracking-wider text-zinc-500">Status</TableHead>
              <TableHead className="h-11 text-right text-xs font-medium uppercase tracking-wider text-zinc-500">Total Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-sm text-zinc-400 font-medium">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
            
            {orders.map((order) => {
              const item = order.items[0] // Assuming 1 item per order for simplicity
              return (
                <TableRow key={order.id} className="border-zinc-100 hover:bg-zinc-50/40 transition-colors">
                  <TableCell className="py-4">
                    <span className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 font-mono tracking-tight">
                      #{order.id.split("-")[0]}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 text-sm text-zinc-600">
                    {format(new Date(order.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="py-4 text-sm font-medium text-zinc-900">
                    {item?.product.name}
                  </TableCell>
                  <TableCell className="py-4 text-sm text-zinc-600">
                    {item?.requestedQty.toString()} <span className="text-zinc-400 text-xs">{item?.requestedUnit}</span>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge 
                      variant="outline" 
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium border tracking-wide transition-none shadow-none ${getStatusStyles(order.status)}`}
                    >
                      {order.status.toLowerCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 text-right text-sm font-semibold text-zinc-900">
                    ₹{Number(order.totalAmount).toFixed(2)}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}