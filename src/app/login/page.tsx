import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-transparent">
      <div className="relative z-10">
        <LoginForm />
      </div>
    </div>
  )
}
