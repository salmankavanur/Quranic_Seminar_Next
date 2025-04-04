"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Eye, Trash2, Mail } from "lucide-react"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { ViewMessageDialog } from "./view-message-dialog"

interface MessageActionsProps {
  message: any
}

export function MessageActions({ message }: MessageActionsProps) {
  const router = useRouter()
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isMarkingRead, setIsMarkingRead] = useState(false)

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/messages/${message._id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete message")
      }

      toast({
        title: "Message deleted",
        description: "The message has been deleted successfully.",
      })

      router.refresh()
    } catch (error) {
      console.error("Error deleting message:", error)
      toast({
        title: "Error",
        description: "Failed to delete message. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleMarkAsRead = async () => {
    setIsMarkingRead(true)

    try {
      const response = await fetch(`/api/messages/${message._id}/read`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_read: !message.is_read }),
      })

      if (!response.ok) {
        throw new Error("Failed to update message status")
      }

      toast({
        title: message.is_read ? "Marked as unread" : "Marked as read",
        description: `The message has been marked as ${message.is_read ? "unread" : "read"}.`,
      })

      router.refresh()
    } catch (error) {
      console.error("Error updating message status:", error)
      toast({
        title: "Error",
        description: "Failed to update message status. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsMarkingRead(false)
    }
  }

  return (
    <div className="flex justify-end space-x-2">
      <Button variant="ghost" size="icon" onClick={() => setIsViewOpen(true)}>
        <Eye className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleMarkAsRead}
        disabled={isMarkingRead}
        className={message.is_read ? "text-muted-foreground" : "text-blue-500"}
      >
        <Mail className="h-4 w-4" />
      </Button>

      <Button variant="ghost" size="icon" onClick={() => setIsDeleteOpen(true)}>
        <Trash2 className="h-4 w-4" />
      </Button>

      <ViewMessageDialog message={message} isOpen={isViewOpen} onClose={() => setIsViewOpen(false)} />

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Message"
        description="Are you sure you want to delete this message? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
      />
    </div>
  )
}

