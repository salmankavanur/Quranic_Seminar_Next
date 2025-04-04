"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RegistrationActions } from "./registration-actions"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

interface RegistrationsClientProps {
  registrations: any[]
  counts: {
    all: number
    pending: number
    confirmed: number
    rejected: number
  }
}

export function RegistrationsClient({ registrations, counts }: RegistrationsClientProps) {
  const [filter, setFilter] = useState("all")

  const filteredRegistrations = filter === "all" 
    ? registrations 
    : registrations.filter((reg) => reg.status === filter)

  return (
    <>
      <div className="mb-6">
        <div className="relative">
          <Input placeholder="Search registrations..." className="pl-10" />
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
          <Button variant="outline" className="absolute right-0 top-0">
            Filter
          </Button>
        </div>
      </div>

      <div className="mb-4 flex space-x-2">
        <Button variant={filter === "all" ? "secondary" : "outline"} size="sm" onClick={() => setFilter("all")}>
          All ({counts.all})
        </Button>
        <Button variant={filter === "pending" ? "secondary" : "outline"} size="sm" onClick={() => setFilter("pending")}>
          Pending ({counts.pending})
        </Button>
        <Button
          variant={filter === "confirmed" ? "secondary" : "outline"}
          size="sm"
          onClick={() => setFilter("confirmed")}
        >
          Confirmed ({counts.confirmed})
        </Button>
        <Button
          variant={filter === "rejected" ? "secondary" : "outline"}
          size="sm"
          onClick={() => setFilter("rejected")}
        >
          Rejected ({counts.rejected})
        </Button>
      </div>

      <div className="border rounded-lg overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-muted text-left">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Institution</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRegistrations.length > 0 ? (
              filteredRegistrations.map((reg: any) => (
                <tr key={reg._id} className="border-t hover:bg-muted/50">
                  <td className="px-4 py-3">
                    {reg.first_name} {reg.last_name}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{reg.email}</td>
                  <td className="px-4 py-3">{reg.institution}</td>
                  <td className="px-4 py-3">
                    <Badge
                      className={
                        reg.participant_type === "Presenter"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                          : reg.participant_type === "Student"
                            ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                            : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                      }
                    >
                      {reg.participant_type}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        reg.status === "confirmed" 
                          ? "success" 
                          : reg.status === "rejected" 
                            ? "destructive" 
                            : "outline"
                      }
                    >
                      {reg.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <RegistrationActions registration={reg} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-8 text-center text-muted-foreground">
                  No registrations found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}