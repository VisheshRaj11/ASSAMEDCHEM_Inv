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

    <>
      <Button 
        onClick={() => setOpen(true)}
        className="w-full h-9 bg-zinc-900 text-zinc-50 text-sm font-medium hover:bg-zinc-800 active:scale-[0.99] transition-all shadow-sm rounded-md"
      >
        Order Now
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[400px] gap-0 rounded-xl border border-zinc-200 bg-white p-0 shadow-lg overflow-hidden">
        {/* Modal Header Area */}
        <div className="p-6 pb-4 border-b border-zinc-100">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-lg font-semibold tracking-tight text-zinc-900">
              Place Order
            </DialogTitle>
            <DialogDescription className="flex items-center gap-2 text-sm text-zinc-500">
              <span className="font-medium text-zinc-800">{product.name}</span>
              <span className="inline-flex items-center rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-500 font-mono tracking-tight">
                {product.sku}
              </span>
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Content Body Layout */}
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="qty" className="text-xs font-medium text-zinc-500 tracking-wide">
              Requested Quantity
            </Label>
            <div className="flex gap-2">
              <Input
                id="qty"
                type="number"
                min="0.1"
                step="any"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                className="h-9 flex-1 border-zinc-200 bg-zinc-50/30 text-sm shadow-none focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-zinc-950/20 focus-visible:border-zinc-300 transition-colors"
              />
              <div className="w-[110px]">
                <Select value={unit} onValueChange={(v) => setUnit(v as DisplayUnit)}>
                  <SelectTrigger className="h-9 border-zinc-200 bg-zinc-50/30 shadow-none focus:ring-1 focus:ring-zinc-950/20 focus:border-zinc-300 transition-colors">
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent className="border-zinc-200 shadow-md">
                    {displayUnits.map(u => (
                      <SelectItem key={u} value={u} className="text-sm focus:bg-zinc-50 focus:text-zinc-900">
                        {unitLabels[u]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Clean Dynamic Ledger Summary Box */}
          <div className="rounded-xl border border-zinc-200/60 bg-zinc-50/40 p-4 space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-400">Unit Exchange Rate</span>
              <span className="font-medium text-zinc-600">
                ₹{pricePerDisplay.toFixed(2)} <span className="text-zinc-400 font-normal">/ {unitLabels[unit]}</span>
              </span>
            </div>
            <div className="border-t border-zinc-200/60 my-1" />
            <div className="flex justify-between items-baseline">
              <span className="text-xs font-medium text-zinc-500">Total Price</span>
              <span className="text-xl font-semibold tracking-tight text-zinc-900">
                ₹{totalPrice.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Actions Footer Area */}
        <div className="bg-zinc-50 px-6 py-4 border-t border-zinc-100 flex justify-end gap-2.5">
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)} 
            disabled={loading}
            className="h-9 border-zinc-200 bg-white text-zinc-700 shadow-none hover:bg-zinc-50 hover:text-zinc-900"
          >
            Cancel
          </Button>
          <Button 
            onClick={handlePlaceOrder} 
            disabled={loading}
            className="h-9 bg-zinc-900 text-zinc-50 hover:bg-zinc-800 active:scale-[0.99] transition-all shadow-none px-4"
          >
            {loading ? "Placing..." : "Confirm Order"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
    </>
  )
}