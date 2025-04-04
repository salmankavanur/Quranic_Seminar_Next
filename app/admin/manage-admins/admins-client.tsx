"use client"

import { Input } from "@/components/ui/input"
import { AdminActions } from "./admin-actions"
import { CreateAdminDialog } from "./create-admin-dialog"
import { useState } from "react"

interface AdminsClientProps {
  admins: any[]
  currentUserEmail: string
}

export function AdminsClient({ admins, currentUserEmail }: AdminsClientProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredAdmins = searchTerm
    ? admins.filter(
        (admin) =>
          admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          admin.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : admins

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
        <CreateAdminDialog />
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="grid grid-cols-4 bg-muted p-4 font-medium">
          <div>Name</div>
          <div>Email</div>
          <div>Permissions</div>
          <div className="text-right">Actions</div>
        </div>

        {filteredAdmins.length > 0 ? (
          filteredAdmins.map((admin: any) => (
            <div key={admin._id} className="grid grid-cols-4 p-4 border-t items-center">
              <div>{admin.name}</div>
              <div className="text-muted-foreground">{admin.email}</div>
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
              <AdminActions admin={admin} currentUserEmail={currentUserEmail} />
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-muted-foreground">No admins found</div>
        )}
      </div>
    </>
  )
}

