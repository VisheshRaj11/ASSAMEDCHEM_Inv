import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { PrismaClient } from "@prisma/client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

const prisma = new PrismaClient()

export default async function AdminOrdersPage() {
  const session = await auth()
  
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/dashboard")
  }

  const orders = await prisma.order.findMany({
    include: { 
      items: { include: { product: true } },
      user: true
    },
    orderBy: { createdAt: "desc" }
  })

  // Consistent status layout matching the customer dashboard view
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
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">All Orders</h1>
        <p className="mt-1 text-sm text-zinc-500">View, monitor, and manage fulfillment for all system orders.</p>
      </div>

      {/* Modern Minimalist Table Container */}
      <div className="overflow-hidden rounded-xl border border-zinc-200/70 bg-white">
        <Table>
          <TableHeader className="bg-zinc-50/70">
            <TableRow className="hover:bg-transparent border-zinc-200/70">
              <TableHead className="h-11 text-xs font-medium uppercase tracking-wider text-zinc-500">Order ID</TableHead>
              <TableHead className="h-11 text-xs font-medium uppercase tracking-wider text-zinc-500">Date</TableHead>
              <TableHead className="h-11 text-xs font-medium uppercase tracking-wider text-zinc-500">Customer</TableHead>
              <TableHead className="h-11 text-xs font-medium uppercase tracking-wider text-zinc-500">Product</TableHead>
              <TableHead className="h-11 text-xs font-medium uppercase tracking-wider text-zinc-500">Requested</TableHead>
              <TableHead className="h-11 text-xs font-medium uppercase tracking-wider text-zinc-500">Base Unit Conv.</TableHead>
              <TableHead className="h-11 text-xs font-medium uppercase tracking-wider text-zinc-500">Status</TableHead>
              <TableHead className="h-11 text-right text-xs font-medium uppercase tracking-wider text-zinc-500">Total Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-sm text-zinc-400 font-medium">
                  No orders found in the system.
                </TableCell>
              </TableRow>
            )}
            
            {orders.map((order) => {
              const item = order.items[0]
              return (
                <TableRow key={order.id} className="border-zinc-100 hover:bg-zinc-50/40 transition-colors">
                  {/* Order ID Token */}
                  <TableCell className="py-4">
                    <span className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 font-mono tracking-tight">
                      #{order.id.split("-")[0]}
                    </span>
                  </TableCell>
                  
                  {/* Date */}
                  <TableCell className="py-4 text-sm text-zinc-600 whitespace-nowrap">
                    {format(new Date(order.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  
                  {/* Customer Info */}
                  <TableCell className="py-4 text-sm font-medium text-zinc-800">
                    {order.user.name}
                  </TableCell>
                  
                  {/* Product Name */}
                  <TableCell className="py-4 text-sm font-medium text-zinc-900">
                    {item?.product.name}
                  </TableCell>
                  
                  {/* Requested Qty */}
                  <TableCell className="py-4 text-sm text-zinc-600 whitespace-nowrap">
                    {item?.requestedQty.toString()} <span className="text-zinc-400 text-xs font-normal">{item?.requestedUnit}</span>
                  </TableCell>
                  
                  {/* Technical Conversion Column */}
                  <TableCell className="py-4 text-xs font-mono text-zinc-500 whitespace-nowrap">
                    {item?.baseQty.toString()} <span className="text-zinc-400 font-sans">{item?.product.baseUnit}</span>
                  </TableCell>
                  
                  {/* Status Badges */}
                  <TableCell className="py-4">
                    <Badge 
                      variant="outline" 
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium border tracking-wide transition-none shadow-none ${getStatusStyles(order.status)}`}
                    >
                      {order.status.toLowerCase()}
                    </Badge>
                  </TableCell>
                  
                  {/* Amount Column */}
                  <TableCell className="py-4 text-right text-sm font-semibold text-zinc-900 whitespace-nowrap">
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