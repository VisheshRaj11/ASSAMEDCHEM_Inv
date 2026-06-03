"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BaseUnit, DisplayUnit } from "@prisma/client"
import { getDisplayUnitsForBase, getPricePerDisplayUnit, unitLabels, toBaseQty } from "@/lib/units"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Decimal } from "decimal.js"

type SafeProduct = {
  id: string
  name: string
  sku: string
  baseUnit: BaseUnit
  pricePerBaseUnit: string
}

export function OrderDialog({ product }: { product: SafeProduct }) {
  const [open, setOpen] = useState(false)
  const [qty, setQty] = useState("1")
  const [unit, setUnit] = useState<DisplayUnit>(getDisplayUnitsForBase(product.baseUnit)[0])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const displayUnits = getDisplayUnitsForBase(product.baseUnit)

  const pricePerDisplay = useMemo(() => {
    return getPricePerDisplayUnit(product.pricePerBaseUnit, unit)
  }, [product.pricePerBaseUnit, unit])

  const totalPrice = useMemo(() => {
    if (!qty || isNaN(Number(qty))) return new Decimal(0)
    return pricePerDisplay.mul(qty)
  }, [pricePerDisplay, qty])

  const handlePlaceOrder = async () => {
    if (!qty || Number(qty) <= 0) {
      toast.error("Please enter a valid quantity")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          requestedQty: qty,
          requestedUnit: unit
        })
      })

      if (!res.ok) {
        throw new Error("Failed to place order")
      }

      toast.success("Order placed successfully")
      setOpen(false)
      setQty("1")
      router.refresh()
    } catch (err) {
      toast.error("An error occurred while placing order")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">Order Now</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Place Order</DialogTitle>
          <DialogDescription>
            {product.name} ({product.sku})
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="qty" className="text-right">
              Quantity
            </Label>
            <Input
              id="qty"
              type="number"
              min="0.1"
              step="any"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              className="col-span-2"
            />
            <Select value={unit} onValueChange={(v) => setUnit(v as DisplayUnit)}>
              <SelectTrigger>
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent>
                {displayUnits.map(u => (
                  <SelectItem key={u} value={u}>{unitLabels[u]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Rate:</span>
              <span>₹{pricePerDisplay.toFixed(2)} / {unitLabels[unit]}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total Price:</span>
              <span className="text-primary">₹{totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>Cancel</Button>
          <Button onClick={handlePlaceOrder} disabled={loading}>
            {loading ? "Placing..." : "Confirm Order"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
