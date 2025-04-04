"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Reply } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface ViewMessageDialogProps {
  message: any
  isOpen: boolean
  onClose: () => void
}

export function ViewMessageDialog({ message, isOpen, onClose }: ViewMessageDialogProps) {
  const router = useRouter()

  useEffect(() => {
    // Mark message as read when opened
    if (isOpen && !message.is_read) {
      markAsRead()
    }
  }, [isOpen])

  const markAsRead = async () => {
    try {
      const response = await fetch(`/api/messages/${message._id}/read`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_read: true }),
      })

      if (!response.ok) {
        throw new Error("Failed to mark message as read")
      }

      router.refresh()
    } catch (error) {
      console.error("Error marking message as read:", error)
    }
  }

  const handleReply = () => {
    // Open email client with pre-filled details
    const subject = `Re: ${message.subject}`
    const body = `\n\n-------- Original Message --------\nFrom: ${message.sender_name} <${message.sender_email}>\nSubject: ${message.subject}\n\n${message.message}`

    window.location.href = `mailto:${message.sender_email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

    toast({
      title: "Email client opened",
      description: "Your default email client has been opened to reply to this message.",
    })
  }

  if (!message) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{message.subject}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium">From</h3>
              <p>
                {message.sender_name} &lt;{message.sender_email}&gt;
              </p>
              {message.phone && <p className="text-sm text-muted-foreground">Phone: {message.phone}</p>}
            </div>
            <div className="text-sm text-muted-foreground">{new Date(message.created_at).toLocaleString()}</div>
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-medium">Message</h3>
            <div className="p-4 bg-muted rounded-md whitespace-pre-wrap">{message.message}</div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={handleReply}>
              <Reply className="h-4 w-4 mr-2" />
              Reply
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

