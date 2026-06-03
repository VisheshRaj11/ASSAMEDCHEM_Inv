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
    <div className="flex min-h-screen flex-col bg-zinc-50/60 antialiased selection:bg-zinc-200">
      {/* Top Header */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          
          {/* Logo & Desktop Nav */}
          <div className="flex items-center gap-8">
            {/* <img src={'./logo.png'}/> */}
            <Link href="/dashboard" className="flex items-center space-x-2 tracking-tight group">
              <span className="font-black text-xl text-primary transition-colors group-hover:text-primary/80 drop-shadow-sm">
                AasaMedChem
              </span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-1">
              {role === "ADMIN" ? (
                <>
                  <Link href="/dashboard" className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-zinc-600 rounded-md transition-all hover:text-zinc-900 hover:bg-zinc-100">
                    <LayoutDashboard className="h-4 w-4 stroke-[1.5]" />
                    Overview
                  </Link>
                  <Link href="/dashboard/products" className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-zinc-600 rounded-md transition-all hover:text-zinc-900 hover:bg-zinc-100">
                    <Package className="h-4 w-4 stroke-[1.5]" />
                    Products
                  </Link>
                  <Link href="/dashboard/orders" className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-zinc-600 rounded-md transition-all hover:text-zinc-900 hover:bg-zinc-100">
                    <ShoppingCart className="h-4 w-4 stroke-[1.5]" />
                    Orders
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/dashboard" className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-zinc-600 rounded-md transition-all hover:text-zinc-900 hover:bg-zinc-100">
                    <Package className="h-4 w-4 stroke-[1.5]" />
                    Catalog
                  </Link>
                  <Link href="/dashboard/my-orders" className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-zinc-600 rounded-md transition-all hover:text-zinc-900 hover:bg-zinc-100">
                    <ShoppingCart className="h-4 w-4 stroke-[1.5]" />
                    My Orders
                  </Link>
                </>
              )}
            </nav>
          </div>

          {/* User Profile & Action */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2.5 bg-zinc-100/80 px-3 py-1.5 rounded-full border border-zinc-200/50">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-200">
                <User className="h-3 w-3 text-zinc-600" />
              </div>
              <span className="text-xs font-medium text-zinc-700 tracking-wide">
                {session.user.name} <span className="text-zinc-400 font-normal">| {role}</span>
              </span>
            </div>
            
            <div className="scale-95 transition-transform hover:scale-100">
              <SignOutButton />
            </div>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="h-full rounded-xl border border-zinc-200/60 bg-white p-6 shadow-sm sm:p-8 md:p-10">
          {children}
        </div>
      </main>

      {/* Premium Minimalistic Mobile Nav Bar (Fixed on small screens) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-200 bg-white/95 backdrop-blur-md px-4 py-2 shadow-lg">
        <nav className="flex justify-around items-center">
          {role === "ADMIN" ? (
            <>
              <Link href="/dashboard" className="flex flex-col items-center gap-0.5 text-[10px] font-medium text-zinc-500 hover:text-zinc-900">
                <LayoutDashboard className="h-5 w-5 stroke-[1.5]" />
                Overview
              </Link>
              <Link href="/dashboard/products" className="flex flex-col items-center gap-0.5 text-[10px] font-medium text-zinc-500 hover:text-zinc-900">
                <Package className="h-5 w-5 stroke-[1.5]" />
                Products
              </Link>
              <Link href="/dashboard/orders" className="flex flex-col items-center gap-0.5 text-[10px] font-medium text-zinc-500 hover:text-zinc-900">
                <ShoppingCart className="h-5 w-5 stroke-[1.5]" />
                Orders
              </Link>
            </>
          ) : (
            <>
              <Link href="/dashboard" className="flex flex-col items-center gap-0.5 text-[10px] font-medium text-zinc-500 hover:text-zinc-900">
                <Package className="h-5 w-5 stroke-[1.5]" />
                Catalog
              </Link>
              <Link href="/dashboard/my-orders" className="flex flex-col items-center gap-0.5 text-[10px] font-medium text-zinc-500 hover:text-zinc-900">
                <ShoppingCart className="h-5 w-5 stroke-[1.5]" />
                My Orders
              </Link>
            </>
          )}
        </nav>
      </div>
      {/* Extra spacing on mobile layout to avoid footer overlapping content */}
      <div className="h-16 md:hidden" />
    </div>
  )
}