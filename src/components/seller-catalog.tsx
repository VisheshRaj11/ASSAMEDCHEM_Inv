"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { BaseUnit } from "@prisma/client"
import { OrderDialog } from "@/components/order-dialog"
import { Search } from "lucide-react"

type SafeProduct = {
  id: string
  name: string
  sku: string
  description: string | null
  baseUnit: BaseUnit
  pricePerBaseUnit: string
  inventoryBaseQty: string
}

export function SellerCatalog({ products }: { products: SafeProduct[] }) {
  const [searchTerm, setSearchTerm] = useState("")

  const filtered = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-8">
      {/* Header Panel */}
      <div className="border-b border-zinc-100 pb-5">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Product Catalog</h1>
        <p className="mt-1 text-sm text-zinc-500">Browse live available pharmaceutical batches and place system supply orders.</p>
      </div>

      {/* Modern Search Input Control */}
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 stroke-[1.5]" />
        <Input 
          type="text" 
          placeholder="Search products by name or SKU..." 
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="h-9 pl-9 border-zinc-200 bg-zinc-50/30 text-sm shadow-none placeholder:text-zinc-400 focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-zinc-950/20 focus-visible:border-zinc-300 transition-colors"
        />
      </div>

      {/* Catalog Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(product => (
          <Card key={product.id} className="flex flex-col overflow-hidden rounded-xl border border-zinc-200/60 bg-white shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] transition-all hover:shadow-[0_4px_12px_-3px_rgba(0,0,0,0.08)]">
            <CardHeader className="p-6 pb-3">
              <div className="flex justify-between items-start gap-4">
                <CardTitle className="text-base font-semibold text-zinc-900 tracking-tight leading-snug group-hover:text-primary transition-colors duration-200">
                  {product.name}
                </CardTitle>
                <Badge variant="outline" className="bg-white shrink-0">
                  {product.sku}
                </Badge>
              </div>
              {product.description && (
                <CardDescription className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
                  {product.description}
                </CardDescription>
              )}
            </CardHeader>
            
            {/* Metric Content Divider Space */}
            <CardContent className="flex-1 pt-6">
              <div className="text-sm bg-primary/5 p-4 rounded-xl border border-primary/10 inline-block">
                <span className="font-bold text-lg text-primary">₹{Number(product.pricePerBaseUnit).toFixed(2)}</span>
                <span className="text-muted-foreground"> per {product.baseUnit.toLowerCase()}</span>
              </div>
            </CardContent>
            
            {/* Interactive Actions Footer */}
            <CardFooter className="pt-2">
              <OrderDialog product={product} />
            </CardFooter>
          </Card>
        ))}
        
        {/* Empty Search Query Fallback View */}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-16 border border-dashed border-zinc-200 rounded-xl bg-zinc-50/50">
            <p className="text-sm font-medium text-zinc-400">No matching items located in the catalog.</p>
            <p className="text-xs text-zinc-400/80 mt-1">Double check your search text spelling parameters.</p>
          </div>
        )}
      </div>
    </div>
  )
}