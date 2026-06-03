import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SignOutButton } from "@/components/sign-out-button"
import { User, Package, ShoppingCart, LayoutDashboard } from "lucide-react"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }
  
  const role = session.user.role

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-6 md:gap-10">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <span className="inline-block font-bold">AasaMedChem</span>
            </Link>
            <nav className="hidden md:flex gap-6">
              {role === "ADMIN" ? (
                <>
                  <Link href="/dashboard" className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Overview
                  </Link>
                  <Link href="/dashboard/products" className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                    <Package className="mr-2 h-4 w-4" />
                    Products
                  </Link>
                  <Link href="/dashboard/orders" className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Orders
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/dashboard" className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                    <Package className="mr-2 h-4 w-4" />
                    Catalog
                  </Link>
                  <Link href="/dashboard/my-orders" className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    My Orders
                  </Link>
                </>
              )}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{session.user.name} ({role})</span>
            </div>
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="flex-1 bg-slate-50/50 p-6 md:p-10">
        {children}
      </main>
    </div>
  )
}
