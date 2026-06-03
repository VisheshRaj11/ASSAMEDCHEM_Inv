import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart } from "lucide-react"

export function AdminOverview({ productsCount, ordersCount }: { productsCount: number, ordersCount: number }) {
  return (
    <div className="space-y-8">
      {/* Header Panel */}
      <div className="border-b border-zinc-100 pb-5">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Admin Overview</h1>
        <p className="mt-1 text-sm text-zinc-500">Track structural inventory status balances and operational orders.</p>
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
    </div>
  )
}