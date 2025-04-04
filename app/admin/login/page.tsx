"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { loginAction, createAdminAction } from "@/app/actions/auth-actions"

export default function LoginPage() {
  const [email, setEmail] = useState("admin@example.com")
  const [password, setPassword] = useState("password123")
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
    <Card className="bg-gray-900 border-gray-800">
      <CardContent className="pt-6">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-white">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
              placeholder="admin@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-white">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
              placeholder="••••••••"
              required
            />
          </div>

          {/* <div className="text-sm text-gray-400">Default credentials: admin@example.com / password123</div> */}

          <div className="flex flex-col gap-2">
            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>

            {/* <Button
              type="button"
              variant="outline"
              className="w-full border-gray-700 text-gray-300"
              onClick={handleCreateAdmin}
              disabled={isLoading}
            >
              Create Admin User
            </Button> */}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

