"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { EditAdminDialog } from "./edit-admin-dialog"

interface AdminActionsProps {
  admin: any
  currentUserEmail: string
}

export function AdminActions({ admin, currentUserEmail }: AdminActionsProps) {
  const router = useRouter()
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const isSelf = admin.email === currentUserEmail

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/admins/${admin._id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete admin")
      }

      toast({
        title: "Admin deleted",
        description: "The admin user has been deleted successfully.",
      })

      router.refresh()
    } catch (error) {
      console.error("Error deleting admin:", error)
      toast({
        title: "Error",
        description: "Failed to delete admin. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex justify-end space-x-2">
      <Button variant="ghost" size="icon" onClick={() => setIsEditOpen(true)}>
        <Pencil className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsDeleteOpen(true)}
        disabled={isSelf} // Prevent deleting yourself
        className={isSelf ? "opacity-50 cursor-not-allowed" : ""}
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <EditAdminDialog admin={admin} isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} />

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Admin"
        description={
          isSelf
            ? "You cannot delete your own account."
            : "Are you sure you want to delete this admin user? This action cannot be undone."
        }
        confirmText="Delete"
        variant="destructive"
      />
    </div>
  )
}

