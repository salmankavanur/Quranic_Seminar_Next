"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Eye, Pencil, Trash2, CheckCircle, XCircle, Download, Award } from "lucide-react"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { ViewSubmissionDialog } from "./view-submission-dialog"
import { EditSubmissionDialog } from "./edit-submission-dialog"

interface SubmissionActionsProps {
  submission: any
  type: "abstract" | "paper"
}

export function SubmissionActions({ submission, type }: SubmissionActionsProps) {
  const router = useRouter()
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isStatusOpen, setIsStatusOpen] = useState(false)
  const [newStatus, setNewStatus] = useState("")
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/submissions/${type}/${submission._id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`Failed to delete ${type}`)
      }

      toast({
        title: `${type.charAt(0).toUpperCase() + type.slice(1)} deleted`,
        description: `The ${type} has been deleted successfully.`,
      })

      router.refresh()
    } catch (error) {
      console.error(`Error deleting ${type}:`, error)
      toast({
        title: "Error",
        description: `Failed to delete ${type}. Please try again.`,
        variant: "destructive",
      })
    }
  }

  const handleStatusChange = async () => {
    try {
      const response = await fetch(`/api/submissions/${type}/${submission._id}/status`, {
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
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} status has been updated to ${newStatus}.`,
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

  const handleDownload = async () => {
    if (!submission.file_path) {
      toast({
        title: "No file available",
        description: "This submission does not have an attached file to download.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsDownloading(true)

      // Extract the file path from the full URL
      const url = new URL(submission.file_path)
      const filePath = url.pathname.split("/public/")[1]

      if (!filePath) {
        throw new Error("Invalid file path")
      }

      // Get the bucket from the URL (submissions or documents)
      const bucket = url.pathname.includes("/submissions/") ? "submissions" : "documents"

      // Get the filename from the path
      const fileName = filePath.split("/").pop()

      // Create the download URL
      const downloadUrl = `/api/download?path=${encodeURIComponent(filePath)}&bucket=${bucket}&filename=${encodeURIComponent(fileName)}`

      // Create a temporary link element and trigger the download
      const link = document.createElement("a")
      link.href = downloadUrl
      link.setAttribute("download", fileName)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Download started",
        description: "Your file download has started.",
      })
    } catch (error) {
      console.error("Download error:", error)
      toast({
        title: "Download failed",
        description: "Failed to download the file. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDownloading(false)
    }
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

      {submission.file_path && (
        <Button variant="ghost" size="icon" onClick={handleDownload} disabled={isDownloading}>
          <Download className="h-4 w-4" />
        </Button>
      )}

      {/* Only show qualified option for papers */}
      {type === "paper" && submission.status !== "qualified" && (
        <Button variant="ghost" size="icon" className="text-amber-500" onClick={() => openStatusDialog("qualified")}>
          <Award className="h-4 w-4" />
        </Button>
      )}

      {submission.status !== "accepted" && (
        <Button variant="ghost" size="icon" className="text-green-500" onClick={() => openStatusDialog("accepted")}>
          <CheckCircle className="h-4 w-4" />
        </Button>
      )}

      {submission.status !== "rejected" && (
        <Button variant="ghost" size="icon" className="text-red-500" onClick={() => openStatusDialog("rejected")}>
          <XCircle className="h-4 w-4" />
        </Button>
      )}

      <ViewSubmissionDialog
        submission={submission}
        type={type}
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
      />

      <EditSubmissionDialog
        submission={submission}
        type={type}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      />

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title={`Delete ${type.charAt(0).toUpperCase() + type.slice(1)}`}
        description={`Are you sure you want to delete this ${type}? This action cannot be undone.`}
        confirmText="Delete"
        variant="destructive"
      />

      <ConfirmDialog
        isOpen={isStatusOpen}
        onClose={() => setIsStatusOpen(false)}
        onConfirm={handleStatusChange}
        title={getStatusDialogTitle(newStatus, type)}
        description={getStatusDialogDescription(newStatus, type)}
        confirmText={getStatusConfirmText(newStatus)}
        variant={newStatus === "rejected" ? "destructive" : "default"}
      />
    </div>
  )
}

function getStatusDialogTitle(status: string, type: string): string {
  const typeName = type.charAt(0).toUpperCase() + type.slice(1)

  switch (status) {
    case "accepted":
      return `Accept ${typeName}`
    case "rejected":
      return `Reject ${typeName}`
    case "qualified":
      return `Mark ${typeName} as Qualified for Presentation`
    default:
      return `Update ${typeName} Status`
  }
}

function getStatusDialogDescription(status: string, type: string): string {
  switch (status) {
    case "accepted":
      return `Are you sure you want to accept this ${type}?`
    case "rejected":
      return `Are you sure you want to reject this ${type}?`
    case "qualified":
      return `Are you sure you want to mark this ${type} as qualified for presentation? This will make it eligible for certificate generation.`
    default:
      return `Are you sure you want to update the status of this ${type}?`
  }
}

function getStatusConfirmText(status: string): string {
  switch (status) {
    case "accepted":
      return "Accept"
    case "rejected":
      return "Reject"
    case "qualified":
      return "Mark as Qualified"
    default:
      return "Update"
  }
}

