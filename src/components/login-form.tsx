"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Activity, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      })

      if (res?.error) {
        toast.error("Invalid email or password")
      } else {
        toast.success("Successfully logged in!")
        router.push("/dashboard")
        router.refresh()
      }
    } catch (err) {
      toast.error("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-[400px] overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl p-8 relative">
      <div className="relative z-10 flex flex-col items-center mb-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-md border border-primary/20 mb-4 p-2 relative overflow-hidden group">
          <div className="absolute inset-0 bg-white/20 group-hover:bg-white/30 transition-colors"></div>
          <Activity className="h-8 w-8 text-white relative z-10 drop-shadow-sm transition-transform duration-300 group-hover:scale-110" />
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 drop-shadow-sm">
          AasaMedChem
        </h2>
        <p className="text-center text-sm text-zinc-500 mt-2 max-w-[280px]">
          Enter your professional credentials below to access your workspace.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="relative z-10">
        <div className="grid gap-5">
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-sm font-semibold text-zinc-700 tracking-wide">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-11 rounded-xl border-zinc-200 bg-zinc-50 text-zinc-900 shadow-sm placeholder:text-zinc-400 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-all"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="password" className="text-sm font-semibold text-zinc-700 tracking-wide">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 rounded-xl border-zinc-200 bg-zinc-50 text-zinc-900 shadow-sm focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-all pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
          
          <Button 
            className="w-full h-11 mt-2 bg-zinc-900 text-white hover:bg-zinc-800 text-sm font-bold shadow-md rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70" 
            type="submit" 
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-500"></div>
                Signing in...
              </span>
            ) : "Sign in"}
          </Button>

          <div className="mt-4 rounded-lg bg-zinc-50 border border-zinc-200 p-4 text-xs text-zinc-600">
            <p className="font-semibold text-zinc-900 mb-2">Hackathon Test Credentials:</p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="block font-medium text-primary">Admin Access</span>
                <code className="text-[10px] bg-zinc-100 px-1 py-0.5 rounded">admin@test.com</code><br/>
                <code className="text-[10px] bg-zinc-100 px-1 py-0.5 rounded">admin123</code>
              </div>
              <div>
                <span className="block font-medium text-primary">Seller Access</span>
                <code className="text-[10px] bg-zinc-100 px-1 py-0.5 rounded">seller@test.com</code><br/>
                <code className="text-[10px] bg-zinc-100 px-1 py-0.5 rounded">seller123</code>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}