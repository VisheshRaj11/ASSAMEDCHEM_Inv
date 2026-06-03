import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart } from "lucide-react"
import { AddProductDialog } from "./add-product-dialog"
import { DeleteProductButton } from "./delete-product-button"
import { BaseUnit } from "@prisma/client"

type SafeProduct = {
  id: string
  name: string
  sku: string
  baseUnit: BaseUnit
  pricePerBaseUnit: string
  inventoryBaseQty: string
}

export function AdminOverview({ productsCount, ordersCount, products }: { productsCount: number, ordersCount: number, products?: SafeProduct[] }) {
  return (
    <div className="space-y-8">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-100 pb-5">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Admin Overview</h1>
          <p className="mt-1 text-sm text-zinc-500">Track structural inventory status balances and operational orders.</p>
        </div>
        <AddProductDialog />
      </div>
      
      {/* Stat Metric Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 max-w-4xl">
        {/* Total Products Metric Card */}
        <Card className="overflow-hidden rounded-xl border border-zinc-200/60 bg-white shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] transition-all hover:shadow-[0_4px_12px_-3px_rgba(0,0,0,0.08)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 pt-6 px-6">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Total Products
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-50 border border-zinc-100">
              <Package className="h-4 w-4 text-zinc-500 stroke-[1.5]" />
            </div>
          </CardHeader>
          <CardContent className="pb-6 px-6">
            <div className="text-3xl font-semibold tracking-tight text-zinc-900">
              {productsCount}
            </div>
            <p className="mt-1 text-xs text-zinc-400">Active catalog items registered</p>
          </CardContent>
        </Card>
        
        {/* Total Orders Metric Card */}
        <Card className="overflow-hidden rounded-xl border border-zinc-200/60 bg-white shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] transition-all hover:shadow-[0_4px_12px_-3px_rgba(0,0,0,0.08)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 pt-6 px-6">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Total Orders
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-50 border border-zinc-100">
              <ShoppingCart className="h-4 w-4 text-zinc-500 stroke-[1.5]" />
            </div>
          </CardHeader>
          <CardContent className="pb-6 px-6">
            <div className="text-3xl font-semibold tracking-tight text-zinc-900">
              {ordersCount}
            </div>
            <p className="mt-1 text-xs text-zinc-400">Total processed system requests</p>
          </CardContent>
        </Card>
      </div>

      {/* Products List */}
      {products && products.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-zinc-900">Product Catalog</h2>
          <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
            <div className="grid grid-cols-5 bg-zinc-50 p-4 text-xs font-medium text-zinc-500 border-b border-zinc-200">
              <div className="col-span-2">Name & SKU</div>
              <div>Base Unit</div>
              <div>Price</div>
              <div className="text-right">Actions</div>
            </div>
            <div className="divide-y divide-zinc-100">
              {products.map(product => (
                <div key={product.id} className="grid grid-cols-5 items-center p-4 text-sm hover:bg-zinc-50/50 transition-colors">
                  <div className="col-span-2">
                    <div className="font-medium text-zinc-900">{product.name}</div>
                    <div className="text-xs text-zinc-500 font-mono mt-0.5">{product.sku}</div>
                  </div>
                  <div className="text-zinc-600">{product.baseUnit}</div>
                  <div className="text-zinc-600">₹{parseFloat(product.pricePerBaseUnit).toFixed(2)}</div>
                  <div className="text-right">
                    <DeleteProductButton productId={product.id} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}