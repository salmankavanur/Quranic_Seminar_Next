"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Eye, Pencil, Trash2, CheckCircle, XCircle } from "lucide-react"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { ViewRegistrationDialog } from "./view-registration-dialog"
import { EditRegistrationDialog } from "./edit-registration-dialog"

interface RegistrationActionsProps {
  registration: any
}

export function RegistrationActions({ registration }: RegistrationActionsProps) {
  const router = useRouter()
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isStatusOpen, setIsStatusOpen] = useState(false)
  const [newStatus, setNewStatus] = useState("")

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/registrations/${registration._id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete registration")
      }

      toast({
        title: "Registration deleted",
        description: "The registration has been deleted successfully.",
      })

      router.refresh()
    } catch (error) {
      console.error("Error deleting registration:", error)
      toast({
        title: "Error",
        description: "Failed to delete registration. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleStatusChange = async () => {
    try {
      const response = await fetch(`/api/registrations/${registration._id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error("Failed to update status")
      }

      toast({
        title: "Status updated",
        description: `Registration status has been updated to ${newStatus}.`,
      })

      router.refresh()
    } catch (error) {
      console.error("Error updating status:", error)
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const openStatusDialog = (status: string) => {
    setNewStatus(status)
    setIsStatusOpen(true)
  }

  return (
    <div className="flex justify-end space-x-2">
      <Button variant="ghost" size="icon" onClick={() => setIsViewOpen(true)}>
        <Eye className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => setIsEditOpen(true)}>
        <Pencil className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => setIsDeleteOpen(true)}>
        <Trash2 className="h-4 w-4" />
      </Button>

      {registration.status !== "confirmed" && (
        <Button variant="ghost" size="icon" className="text-green-500" onClick={() => openStatusDialog("confirmed")}>
          <CheckCircle className="h-4 w-4" />
        </Button>
      )}

      {registration.status !== "rejected" && (
        <Button variant="ghost" size="icon" className="text-red-500" onClick={() => openStatusDialog("rejected")}>
          <XCircle className="h-4 w-4" />
        </Button>
      )}

      <ViewRegistrationDialog registration={registration} isOpen={isViewOpen} onClose={() => setIsViewOpen(false)} />

      <EditRegistrationDialog registration={registration} isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} />

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Registration"
        description="Are you sure you want to delete this registration? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
      />

      <ConfirmDialog
        isOpen={isStatusOpen}
        onClose={() => setIsStatusOpen(false)}
        onConfirm={handleStatusChange}
        title={`${newStatus === "confirmed" ? "Confirm" : "Reject"} Registration`}
        description={`Are you sure you want to ${newStatus === "confirmed" ? "confirm" : "reject"} this registration?`}
        confirmText={newStatus === "confirmed" ? "Confirm" : "Reject"}
        variant={newStatus === "confirmed" ? "default" : "destructive"}
      />
    </div>
  )
}

