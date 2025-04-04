"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle } from "lucide-react"

export default function SeedAdminPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    credentials?: { email: string; password: string }
  } | null>(null)

  async function seedAdmin() {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/seed-admin")
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to seed admin user")
      }

      setResult({
        success: true,
        message: data.message,
        credentials: data.credentials,
      })
    } catch (error) {
      console.error("Seed admin error:", error)
      setResult({
        success: false,
        message: error instanceof Error ? error.message : "Failed to seed admin user",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-10 max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Seed Admin User</CardTitle>
          <CardDescription>Create or update the admin user in the database</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            This will create an admin user with default credentials if one doesn't exist, or update the existing admin
            user's password.
          </p>

          {result && (
            <Alert variant={result.success ? "default" : "destructive"}>
              <AlertTitle className="flex items-center gap-2">
                {result.success ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Success
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4" />
                    Error
                  </>
                )}
              </AlertTitle>
              <AlertDescription>
                <p>{result.message}</p>
                {result.success && result.credentials && (
                  <div className="mt-2 p-2 bg-muted rounded text-sm">
                    <p>
                      <strong>Email:</strong> {result.credentials.email}
                    </p>
                    <p>
                      <strong>Password:</strong> {result.credentials.password}
                    </p>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}

          <Button onClick={seedAdmin} disabled={isLoading} className="w-full">
            {isLoading ? "Creating Admin User..." : "Create Admin User"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

