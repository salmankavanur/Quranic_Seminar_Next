"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface ViewRegistrationDialogProps {
  registration: any
  isOpen: boolean
  onClose: () => void
}

export function ViewRegistrationDialog({ registration, isOpen, onClose }: ViewRegistrationDialogProps) {
  if (!registration) return null

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "confirmed":
        return "default"
      case "rejected":
        return "destructive"
      default:
        return "secondary"
    }
  }

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
            <div>
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
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-medium">Status</h3>
            <div>
              <Badge variant={getStatusVariant(registration.status)}>
                {registration.status}
              </Badge>
            </div>
          </div>

          {registration.special_requirements && (
            <div className="col-span-2 space-y-1">
              <h3 className="text-sm font-medium">Special Requirements</h3>
              <p className="text-muted-foreground">{registration.special_requirements}</p>
            </div>
          )}

          {registration.badge_id && registration.qr_code && (
            <div className="col-span-2 space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-medium">Digital Badge</h3>
                <p className="text-muted-foreground">
                  Badge ID: {registration.badge_id}
                </p>
                <p className="text-muted-foreground">
                  Issued: {new Date(registration.badge_issued_at).toLocaleString()}
                </p>
              </div>
              <div className="flex justify-center">
                <div className="bg-white p-4 rounded-lg">
                  <Image
                    src={registration.qr_code}
                    alt="Badge QR Code"
                    width={200}
                    height={200}
                    className="mx-auto"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

