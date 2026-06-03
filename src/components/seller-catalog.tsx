"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { BaseUnit } from "@prisma/client"
import { OrderDialog } from "@/components/order-dialog"

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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Product Catalog</h1>
        <p className="text-muted-foreground">Browse and order inventory items.</p>
      </div>

      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input 
          type="text" 
          placeholder="Search products by name or SKU..." 
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map(product => (
          <Card key={product.id} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{product.name}</CardTitle>
                <Badge variant="outline">{product.sku}</Badge>
              </div>
              <CardDescription>{product.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="text-sm">
                <span className="font-semibold text-primary">₹{Number(product.pricePerBaseUnit).toFixed(2)}</span> per {product.baseUnit.toLowerCase()}
              </div>
            </CardContent>
            <CardFooter>
              <OrderDialog product={product} />
            </CardFooter>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-10 text-muted-foreground">
            No products found matching your search.
          </div>
        )}
      </div>
    </div>
  )
}
