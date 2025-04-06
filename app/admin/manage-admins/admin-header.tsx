"use client"

import { UserCog, ShieldAlert } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export function AdminHeader() {
  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-md">
              <UserCog className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h1 className="text-3xl font-bold">Manage Administrators</h1>
          </div>
          <p className="text-muted-foreground">
            Add, modify, or remove administrator accounts for the seminar portal
          </p>
        </div>
      </div>

      <Card className="mb-6 border-amber-200 dark:border-amber-800/50 bg-amber-50/50 dark:bg-amber-900/10">
        <CardHeader className="py-4">
          <div className="flex items-start gap-2">
            <ShieldAlert className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
            <div>
              <CardTitle className="text-base text-amber-800 dark:text-amber-400">Admin Privileges</CardTitle>
              <CardDescription className="text-amber-600/80 dark:text-amber-300/80">
                Administrators have full access to manage registrations, submissions, and system settings. Grant admin access only to trusted individuals.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
    </>
  )
} 