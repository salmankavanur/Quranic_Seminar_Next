"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

interface ViewRegistrationDialogProps {
  registration: any
  isOpen: boolean
  onClose: () => void
}

export function ViewRegistrationDialog({ registration, isOpen, onClose }: ViewRegistrationDialogProps) {
  if (!registration) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Registration Details</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-1">
            <h3 className="text-sm font-medium">Name</h3>
            <p>
              {registration.first_name} {registration.last_name}
            </p>
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-medium">Email</h3>
            <p>{registration.email}</p>
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-medium">Phone</h3>
            <p>{registration.phone}</p>
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-medium">Institution</h3>
            <p>{registration.institution}</p>
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-medium">Participant Type</h3>
            <p>
              <Badge
                variant={
                  registration.participant_type === "Presenter"
                    ? "default"
                    : registration.participant_type === "Student"
                      ? "secondary"
                      : "outline"
                }
              >
                {registration.participant_type}
              </Badge>
            </p>
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-medium">Status</h3>
            <p>
              <Badge
                variant={
                  registration.status === "confirmed"
                    ? "success"
                    : registration.status === "rejected"
                      ? "destructive"
                      : "outline"
                }
              >
                {registration.status}
              </Badge>
            </p>
          </div>

          <div className="space-y-1 col-span-2">
            <h3 className="text-sm font-medium">Special Requirements</h3>
            <p className="text-sm text-muted-foreground">{registration.special_requirements || "None"}</p>
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-medium">Registration Date</h3>
            <p>{new Date(registration.created_at).toLocaleString()}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

