"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { deleteProduct } from "@/app/actions/products"
import { toast } from "sonner"

export function DeleteProductButton({ productId }: { productId: string }) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product?")) return
    
    setLoading(true)
    try {
      const res = await deleteProduct(productId)
      if (res.success) {
        toast.success("Product deleted successfully")
      } else {
        toast.error(res.error || "Failed to delete product")
      }
    } catch (err) {
      toast.error("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={handleDelete} 
      disabled={loading}
      className="text-red-500 hover:text-red-600 hover:bg-red-50"
    >
      <Trash2 className="h-4 w-4" />
      <span className="sr-only">Delete product</span>
    </Button>
  )
}
