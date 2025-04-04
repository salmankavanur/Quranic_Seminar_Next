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
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const abstractSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  sub_theme: z.string().min(1, {
    message: "Please select a sub-theme.",
  }),
  keywords: z.string().min(1, {
    message: "Please enter at least one keyword.",
  }),
  content: z.string().min(10, {
    message: "Content must be at least 10 characters.",
  }),
  status: z.enum(["pending", "accepted", "rejected"], {
    required_error: "Please select a status.",
  }),
})

const paperSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  content: z.string().min(10, {
    message: "Content must be at least 10 characters.",
  }),
  status: z.enum(["pending", "accepted", "rejected", "qualified"], {
    required_error: "Please select a status.",
  }),
})

interface EditSubmissionDialogProps {
  submission: any
  type: "abstract" | "paper"
  isOpen: boolean
  onClose: () => void
}

export function EditSubmissionDialog({ submission, type, isOpen, onClose }: EditSubmissionDialogProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const subThemes = [
    "Historical Perspectives on Numerical Analysis of the Quran",
    "The Role of Mathematics in Classical and Modern Quranic Interpretation",
    "Patterns and Frequencies of Words and Numbers in the Quran",
    "Criticism and Debates on Numerical Miracles in the Quran",
    "Comparative Study: Numerical Miracles in Other Religious Texts",
    "Scientific and Mathematical Symmetry in the Quran",
    "The Role of Digital Tools in Analyzing Quranic Numbers",
    "Numerical Structure of Quranic Chapters and Verses",
    "Connection Between Numerical Miracles and Linguistic Miracles",
    "Impact of Mathematical Interpretation on Quranic Exegesis (Tafsir)",
    "The Quran and the Golden Ratio: Myth or Reality?",
    "Numerical Miracles and the Concept of Divine Precision in Islam",
  ]

  const abstractForm = useForm<z.infer<typeof abstractSchema>>({
    resolver: zodResolver(abstractSchema),
    defaultValues: {
      title: submission.title,
      sub_theme: submission.sub_theme,
      keywords: submission.keywords,
      content: submission.content,
      status: submission.status,
    },
  })

  const paperForm = useForm<z.infer<typeof paperSchema>>({
    resolver: zodResolver(paperSchema),
    defaultValues: {
      title: submission.title,
      content: submission.content,
      status: submission.status,
    },
  })

  async function onSubmitAbstract(values: z.infer<typeof abstractSchema>) {
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/submissions/abstract/${submission._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error("Failed to update abstract")
      }

      toast({
        title: "Abstract updated",
        description: "The abstract has been updated successfully.",
      })

      router.refresh()
      onClose()
    } catch (error) {
      console.error("Error updating abstract:", error)
      toast({
        title: "Error",
        description: "Failed to update abstract. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  async function onSubmitPaper(values: z.infer<typeof paperSchema>) {
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/submissions/paper/${submission._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error("Failed to update paper")
      }

      toast({
        title: "Paper updated",
        description: "The paper has been updated successfully.",
      })

      router.refresh()
      onClose()
    } catch (error) {
      console.error("Error updating paper:", error)
      toast({
        title: "Error",
        description: "Failed to update paper. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit {type === "abstract" ? "Abstract" : "Paper"}</DialogTitle>
        </DialogHeader>

        {type === "abstract" ? (
          <Form {...abstractForm}>
            <form onSubmit={abstractForm.handleSubmit(onSubmitAbstract)} className="space-y-4">
              <FormField
                control={abstractForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={abstractForm.control}
                name="sub_theme"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sub-theme</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a sub-theme" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subThemes.map((theme) => (
                          <SelectItem key={theme} value={theme}>
                            {theme}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={abstractForm.control}
                name="keywords"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Keywords</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={abstractForm.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea rows={8} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={abstractForm.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="accepted">Accepted</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
        ) : (
          <Form {...paperForm}>
            <form onSubmit={paperForm.handleSubmit(onSubmitPaper)} className="space-y-4">
              <FormField
                control={paperForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={paperForm.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea rows={8} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={paperForm.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="accepted">Accepted</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="qualified">Qualified for Presentation</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
        )}
      </DialogContent>
    </Dialog>
  )
}

