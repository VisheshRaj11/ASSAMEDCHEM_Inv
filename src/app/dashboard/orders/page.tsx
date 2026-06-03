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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">All Orders</h1>
        <p className="text-muted-foreground">View and manage all system orders.</p>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Requested</TableHead>
              <TableHead>Base Unit Conv.</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
            {orders.map((order) => {
              const item = order.items[0]
              return (
                <TableRow key={order.id}>
                  <TableCell className="font-medium text-xs">{order.id.split("-")[0]}</TableCell>
                  <TableCell>{format(new Date(order.createdAt), "MMM d, yyyy")}</TableCell>
                  <TableCell>{order.user.name}</TableCell>
                  <TableCell>{item?.product.name}</TableCell>
                  <TableCell>{item?.requestedQty.toString()} {item?.requestedUnit}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {item?.baseQty.toString()} {item?.product.baseUnit}
                  </TableCell>
                  <TableCell>
                    <Badge variant={order.status === "PENDING" ? "secondary" : "default"}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-bold">₹{Number(order.totalAmount).toFixed(2)}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
