"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BaseUnit } from "@prisma/client"
import { toast } from "sonner"
import { createProduct } from "@/app/actions/products"
import { Plus } from "lucide-react"

export function AddProductDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    const formData = new FormData(e.currentTarget)
    
    try {
      const res = await createProduct(formData)
      if (res.success) {
        toast.success("Product created successfully")
        setOpen(false)
      } else {
        toast.error(res.error || "Failed to create product")
      }
    } catch (err) {
      toast.error("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-9 bg-zinc-900 text-zinc-50 hover:bg-zinc-800 transition-all shadow-sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-xl border border-zinc-200 bg-white p-0 shadow-lg overflow-hidden">
        <div className="p-6 pb-4 border-b border-zinc-100">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-zinc-900">Add New Product</DialogTitle>
          </DialogHeader>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs font-medium text-zinc-500">Name</Label>
            <Input id="name" name="name" required placeholder="e.g. Sodium Chloride" className="h-9 border-zinc-200 bg-zinc-50/30 text-sm shadow-none focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-zinc-950/20" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="sku" className="text-xs font-medium text-zinc-500">SKU</Label>
            <Input id="sku" name="sku" required placeholder="e.g. NACL-100" className="h-9 border-zinc-200 bg-zinc-50/30 text-sm shadow-none focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-zinc-950/20" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="baseUnit" className="text-xs font-medium text-zinc-500">Base Unit</Label>
            <Select name="baseUnit" defaultValue="GRAM" required>
              <SelectTrigger className="h-9 border-zinc-200 bg-zinc-50/30 shadow-none focus:ring-1 focus:ring-zinc-950/20">
                <SelectValue placeholder="Select base unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GRAM">Gram (g)</SelectItem>
                <SelectItem value="MILLILITER">Milliliter (mL)</SelectItem>
                <SelectItem value="ITEM">Item (Count)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pricePerBaseUnit" className="text-xs font-medium text-zinc-500">Price (per Base Unit) ₹</Label>
              <Input id="pricePerBaseUnit" name="pricePerBaseUnit" type="number" step="any" min="0" required placeholder="0.00" className="h-9 border-zinc-200 bg-zinc-50/30 text-sm shadow-none focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-zinc-950/20" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inventoryBaseQty" className="text-xs font-medium text-zinc-500">Initial Quantity</Label>
              <Input id="inventoryBaseQty" name="inventoryBaseQty" type="number" step="any" min="0" required placeholder="0" className="h-9 border-zinc-200 bg-zinc-50/30 text-sm shadow-none focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-zinc-950/20" />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-zinc-100 mt-6">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading} className="h-9 border-zinc-200 bg-white text-zinc-700 shadow-none hover:bg-zinc-50">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="h-9 bg-zinc-900 text-zinc-50 hover:bg-zinc-800 shadow-none">
              {loading ? "Adding..." : "Add Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
