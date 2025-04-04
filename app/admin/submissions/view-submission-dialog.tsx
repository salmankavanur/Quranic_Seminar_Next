"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { useState } from "react"

interface ViewSubmissionDialogProps {
  submission: any
  type: "abstract" | "paper"
  isOpen: boolean
  onClose: () => void
}

export function ViewSubmissionDialog({ submission, type, isOpen, onClose }: ViewSubmissionDialogProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  if (!submission) return null

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{type === "abstract" ? "Abstract" : "Paper"} Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-1">
            <h3 className="text-lg font-medium">{submission.title}</h3>
            <div className="flex items-center gap-2">
              <Badge
                variant={
                  submission.status === "accepted"
                    ? "success"
                    : submission.status === "rejected"
                      ? "destructive"
                      : "outline"
                }
              >
                {submission.status}
              </Badge>

              {type === "abstract" && submission.sub_theme && <Badge variant="outline">{submission.sub_theme}</Badge>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-medium">Author</h3>
              <p>
                {submission.first_name} {submission.last_name}
              </p>
              <p className="text-sm text-muted-foreground">{submission.email}</p>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-medium">Submission Date</h3>
              <p>{new Date(submission.created_at).toLocaleString()}</p>
            </div>
          </div>

          {type === "abstract" && submission.keywords && (
            <div className="space-y-1">
              <h3 className="text-sm font-medium">Keywords</h3>
              <p>{submission.keywords}</p>
            </div>
          )}

          <div className="space-y-1">
            <h3 className="text-sm font-medium">Content</h3>
            <div className="p-4 bg-muted rounded-md whitespace-pre-wrap text-sm">{submission.content}</div>
          </div>

          {submission.file_path && (
            <div className="space-y-1">
              <h3 className="text-sm font-medium">Attached File</h3>
              <Button variant="outline" size="sm" onClick={handleDownload} disabled={isDownloading}>
                <Download className="h-4 w-4 mr-2" />
                {isDownloading ? "Downloading..." : `Download ${type === "abstract" ? "Abstract" : "Paper"} File`}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

