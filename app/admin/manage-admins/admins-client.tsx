"use client"

import { Input } from "@/components/ui/input"
import { AdminActions } from "./admin-actions"
import { CreateAdminDialog } from "./create-admin-dialog"
import { useState } from "react"

interface Permissions {
  manage_registrations?: boolean
  manage_submissions?: boolean
  manage_admins?: boolean
}

interface CurrentUser {
  email: string
  permissions: Permissions
}

interface Admin {
  _id: string
  name: string
  email: string
  permissions: Permissions
  created_at: string
  updated_at: string | null
}

interface AdminsClientProps {
  admins: Admin[]
  currentUser: CurrentUser
}

export function AdminsClient({ admins, currentUser }: AdminsClientProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredAdmins = searchTerm
    ? admins.filter(
        (admin) =>
          admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          admin.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : admins

  // Only show Create Admin button if user has manage_admins permission
  const canManageAdmins = currentUser.permissions?.manage_admins

  return (
    <>
      <div className="mb-6 flex justify-between">
        <div className="relative w-full max-w-sm">
          <Input
            placeholder="Search admins..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        {canManageAdmins && <CreateAdminDialog />}
      </div>

      <div className="border rounded-lg overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-muted text-left">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Permissions</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAdmins.length > 0 ? (
              filteredAdmins.map((admin) => (
                <tr key={admin._id} className="border-t hover:bg-muted/50">
                  <td className="px-4 py-3">{admin.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{admin.email}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {admin.permissions &&
                        Object.entries(admin.permissions)
                          .filter(([_, value]) => value === true)
                          .map(([permission]) => (
                            <span
                              key={permission}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                            >
                              {permission.replace("_", " ")}
                            </span>
                          ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <AdminActions 
                      admin={admin} 
                      currentUser={currentUser}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-8 text-center text-muted-foreground">
                  No admins found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}