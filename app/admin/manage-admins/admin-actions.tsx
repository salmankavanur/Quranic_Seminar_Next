"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { EditAdminDialog } from "./edit-admin-dialog"

interface Permissions {
  manage_registrations?: boolean
  manage_submissions?: boolean
  manage_admins?: boolean
}

interface Admin {
  _id: string
  name: string
  email: string
  permissions: Permissions
}

interface CurrentUser {
  email: string
  permissions: Permissions
}

interface AdminActionsProps {
  admin: Admin
  currentUser: CurrentUser
}

export function AdminActions({ admin, currentUser }: AdminActionsProps) {
  const router = useRouter()
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const isSelf = admin.email === currentUser.email
  const canManageAdmins = currentUser.permissions?.manage_admins
  const targetHasManageAdmins = admin.permissions?.manage_admins

  // Check if current user can modify the target admin
  const canModifyAdmin = 
    // Can always edit self
    isSelf ||
    // Must have manage_admins permission to modify others
    (canManageAdmins && 
      // Can't modify other admins with manage_admins permission (to prevent privilege escalation)
      (!targetHasManageAdmins || isSelf))

  const handleDelete = async () => {
    if (!canManageAdmins) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to delete admin users.",
        variant: "destructive",
      })
      return
    }

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

  if (!canModifyAdmin) {
    return null
  }

  return (
    <div className="flex justify-end space-x-2">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => setIsEditOpen(true)}
        disabled={!canModifyAdmin}
      >
        <Pencil className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsDeleteOpen(true)}
        disabled={isSelf || !canManageAdmins || targetHasManageAdmins}
        className={isSelf ? "opacity-50 cursor-not-allowed" : ""}
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <EditAdminDialog 
        admin={admin} 
        isOpen={isEditOpen} 
        onClose={() => setIsEditOpen(false)}
        currentUser={currentUser}
      />

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Admin"
        description={
          isSelf
            ? "You cannot delete your own account."
            : targetHasManageAdmins
            ? "You cannot delete an admin with manage admins permission."
            : "Are you sure you want to delete this admin user? This action cannot be undone."
        }
        confirmText="Delete"
        variant="destructive"
      />
    </div>
  )
}

