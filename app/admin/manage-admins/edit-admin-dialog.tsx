"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"

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

interface EditAdminDialogProps {
  admin: Admin
  currentUser: CurrentUser
  isOpen: boolean
  onClose: () => void
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  permissions: z.object({
    manage_registrations: z.boolean(),
    manage_submissions: z.boolean(),
    manage_admins: z.boolean(),
  }),
})

type FormValues = z.infer<typeof formSchema>

export function EditAdminDialog({ admin, currentUser, isOpen, onClose }: EditAdminDialogProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isSelf = admin.email === currentUser.email
  const canManageAdmins = currentUser.permissions?.manage_admins
  const targetHasManageAdmins = admin.permissions?.manage_admins

  // Check if current user can modify permissions
  const canModifyPermissions = 
    // Can always edit self (but not grant manage_admins to self)
    (isSelf && !targetHasManageAdmins) ||
    // Must have manage_admins permission to modify others
    (canManageAdmins && 
      // Can't modify other admins with manage_admins permission
      (!targetHasManageAdmins || isSelf))

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: admin.name,
      email: admin.email,
      permissions: {
        manage_registrations: admin.permissions?.manage_registrations || false,
        manage_submissions: admin.permissions?.manage_submissions || false,
        manage_admins: admin.permissions?.manage_admins || false,
      },
    },
  })

  async function onSubmit(values: FormValues) {
    // Prevent granting manage_admins permission if not allowed
    if (!canManageAdmins && values.permissions.manage_admins) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to grant admin management privileges.",
        variant: "destructive",
      })
      return
    }

    // Prevent removing manage_admins from other admins with that permission
    if (targetHasManageAdmins && !isSelf && !values.permissions.manage_admins) {
      toast({
        title: "Permission Denied",
        description: "You cannot remove admin management privileges from other admins.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/admins/${admin._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error("Failed to update admin")
      }

      toast({
        title: "Admin updated",
        description: "The admin user has been updated successfully.",
      })

      router.refresh()
      onClose()
    } catch (error) {
      console.error("Error updating admin:", error)
      toast({
        title: "Error",
        description: "Failed to update admin. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Admin User</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Permissions</FormLabel>

              <FormField
                control={form.control}
                name="permissions.manage_registrations"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox 
                        checked={field.value} 
                        onCheckedChange={field.onChange}
                        disabled={!canModifyPermissions}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Manage Registrations</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="permissions.manage_submissions"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox 
                        checked={field.value} 
                        onCheckedChange={field.onChange}
                        disabled={!canModifyPermissions}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Manage Submissions</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="permissions.manage_admins"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox 
                        checked={field.value} 
                        onCheckedChange={field.onChange}
                        disabled={!canManageAdmins || (targetHasManageAdmins && !isSelf)}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Manage Admins</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

