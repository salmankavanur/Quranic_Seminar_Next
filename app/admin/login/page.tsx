"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { loginAction, createAdminAction } from "@/app/actions/auth-actions"
import { LockIcon, LogInIcon, UserIcon } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("email", email)
      formData.append("password", password)

      const result = await loginAction(formData)

      if (!result.success) {
        throw new Error(result.error || "Login failed")
      }

      // Force a hard navigation to refresh the page
      window.location.href = "/admin"
    } catch (error) {
      console.error("Login error:", error)
      setError(error instanceof Error ? error.message : "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleCreateAdmin() {
    setIsLoading(true)
    setError(null)

    try {
      const result = await createAdminAction()

      if (!result.success) {
        throw new Error(result.error || "Failed to create admin user")
      }

      alert(
        `Admin user created successfully!
Email: ${result.credentials.email}
Password: ${result.credentials.password}`,
      )

      // Auto-fill the form with the credentials
      setEmail(result.credentials.email)
      setPassword(result.credentials.password)
    } catch (error) {
      console.error("Create admin error:", error)
      setError(error instanceof Error ? error.message : "Failed to create admin user")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Back to Website Link */}
      <a 
        href="/" 
        className="absolute top-4 left-4 text-gray-400 hover:text-white flex items-center gap-1.5 text-sm transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m12 19-7-7 7-7"/>
          <path d="M19 12H5"/>
        </svg>
        Back to Website
      </a>
      
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-600/20 mb-3">
            <LockIcon className="h-7 w-7 text-emerald-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Admin Portal</h1>
          <p className="text-gray-400 text-sm">Sign in to access the dashboard</p>
        </div>
        
        <Card className="bg-gray-800 border-gray-700 shadow-xl">
          <CardHeader className="pb-1 pt-4">
            <CardTitle className="text-lg text-white">Admin Login</CardTitle>
            <CardDescription className="text-gray-400 text-xs">
              Enter your credentials to continue
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-3 pb-4">
            {error && (
              <Alert variant="destructive" className="mb-4 bg-red-900/40 border-red-800 text-red-200 py-2 text-sm">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-300">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-4 w-4 text-gray-500" />
                  </div>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white pl-9 h-9 text-sm focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="admin@example.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-300">Password</label>
                  <a href="#" className="text-xs text-emerald-400 hover:text-emerald-300">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockIcon className="h-4 w-4 text-gray-500" />
                  </div>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white pl-9 h-9 text-sm focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div>
                <Button 
                  type="submit" 
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium h-9 text-sm flex items-center justify-center gap-2 transition-all" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="h-4 w-4 border-2 border-white border-opacity-20 border-t-white rounded-full animate-spin"></span>
                      <span>Logging in...</span>
                    </>
                  ) : (
                    <>
                      <LogInIcon className="h-4 w-4" />
                      <span>Login</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-4 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Akode Islamic Centre
        </div>
      </div>
    </div>
  )
}