"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function AdminCheck() {
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading")
  const [userData, setUserData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function checkSession() {
      try {
        const response = await fetch("/api/auth/session")
        const data = await response.json()

        if (data.authenticated) {
          setStatus("authenticated")
          setUserData(data.user)
        } else {
          setStatus("unauthenticated")
          setError(data.message || "Not authenticated")
        }
      } catch (err) {
        setStatus("unauthenticated")
        setError("Failed to check authentication status")
        console.error(err)
      }
    }

    checkSession()
  }, [])

  async function setupAdmin() {
    try {
      const response = await fetch("/api/create-admin-user")
      const data = await response.json()

      if (data.success) {
        alert(
          `Admin setup successful! Use these credentials to log in:
Email: ${data.credentials.email}
Password: ${data.credentials.password}`,
        )
        // Reload the page to apply changes
        window.location.reload()
      } else {
        alert("Failed to set up admin user")
      }
    } catch (err) {
      alert("Error setting up admin user")
      console.error(err)
    }
  }

  if (status === "loading") {
    return <div>Checking authentication status...</div>
  }

  if (status === "unauthenticated") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Authentication Error</CardTitle>
          <CardDescription>You are not authenticated as an admin</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Authentication Failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>

          <div className="space-y-4">
            <p>Please try the following steps:</p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Click the button below to set up an admin user</li>
              <li>Go to the login page and use the credentials provided</li>
              <li>If issues persist, check the browser console for errors</li>
            </ol>

            <Button onClick={setupAdmin}>Set Up Admin User</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Authentication Successful</CardTitle>
        <CardDescription>You are authenticated as an admin</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p>
            <strong>Name:</strong> {userData?.name}
          </p>
          <p>
            <strong>Email:</strong> {userData?.email}
          </p>
          <p>
            <strong>Role:</strong> {userData?.role}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

