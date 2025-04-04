"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle } from "lucide-react"

const formSchema = z.object({
  phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  abstractId: z.string().min(1, {
    message: "Please enter your abstract ID.",
  }),
  paperTitle: z.string().min(5, {
    message: "Paper title must be at least 5 characters.",
  }),
  language: z.enum(["english", "malayalam"], {
    required_error: "Please select a language.",
  }),
})

export function SubmitPaperForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationMessage, setVerificationMessage] = useState<{ type: "success" | "error"; message: string } | null>(
    null,
  )
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Check if there's an abstract ID in the URL (for direct navigation from success page)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const abstractId = params.get("abstractId")
    if (abstractId) {
      form.setValue("abstractId", abstractId)
    }
  }, [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: "",
      abstractId: "",
      paperTitle: "",
      language: "english",
    },
  })

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      setSelectedFile(files[0])
    }
  }

  async function verifyAbstract() {
    const phone = form.getValues("phone")
    const abstractId = form.getValues("abstractId")

    if (!phone || !abstractId) {
      toast({
        title: "Missing Information",
        description: "Please enter both phone number and abstract ID.",
        variant: "destructive",
      })
      return
    }

    setIsVerifying(true)
    setVerificationMessage(null)

    try {
      const response = await fetch("/api/verify-abstract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone,
          abstractId,
        }),
      })

      const data = await response.json()

      if (data.verified) {
        setIsVerified(true)
        setVerificationMessage({
          type: "success",
          message: data.message || "Abstract ID verified successfully.",
        })

        // If the abstract title is returned, auto-fill it
        if (data.abstractTitle) {
          form.setValue("paperTitle", data.abstractTitle)
        }

        toast({
          title: "Verification Successful",
          description: data.message || "Your abstract ID has been verified. You can now submit your paper.",
        })
      } else {
        setVerificationMessage({
          type: "error",
          message: data.message || "Verification failed. Please check your information and try again.",
        })

        toast({
          title: "Verification Failed",
          description: data.message || "Verification failed. Please check your information and try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Verification error:", error)
      setVerificationMessage({
        type: "error",
        message: "An error occurred during verification. Please try again.",
      })

      toast({
        title: "Verification Error",
        description: "There was an error verifying your information. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsVerifying(false)
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!isVerified) {
      toast({
        title: "Verification Required",
        description: "Please verify your phone number and abstract ID before submitting.",
        variant: "destructive",
      })
      return
    }

    if (!selectedFile) {
      toast({
        title: "File Required",
        description: "Please upload your paper file before submitting.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Create FormData to handle file upload
      const formData = new FormData()
      formData.append("phone", values.phone)
      formData.append("abstractId", values.abstractId)
      formData.append("paperTitle", values.paperTitle)
      formData.append("language", values.language)
      formData.append("file", selectedFile)

      const response = await fetch("/api/submit-paper", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Paper submission failed")
      }

      toast({
        title: "Paper Submitted",
        description: "Your paper has been submitted successfully. We will review it and get back to you.",
      })

      // Reset form and redirect
      form.reset()
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
      router.push("/submit/success")
    } catch (error) {
      console.error("Paper submission error:", error)
      toast({
        title: "Submission Failed",
        description:
          error instanceof Error ? error.message : "There was an error submitting your paper. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+91 XXXXX XXXXX" {...field} />
                      </FormControl>
                      <FormDescription>Phone number used during abstract submission.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="abstractId"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Abstract ID</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input placeholder="e.g., ABS-123456-7890" {...field} />
                        </FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={verifyAbstract}
                          disabled={isVerifying || isVerified}
                        >
                          {isVerifying ? "Verifying..." : isVerified ? "Verified" : "Verify"}
                        </Button>
                      </div>
                      <FormDescription>The ID received after abstract submission.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {verificationMessage && (
                <Alert variant={verificationMessage.type === "success" ? "default" : "destructive"}>
                  {verificationMessage.type === "success" ? (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  ) : (
                    <AlertCircle className="h-4 w-4 mr-2" />
                  )}
                  <AlertDescription>{verificationMessage.message}</AlertDescription>
                </Alert>
              )}

              <FormField
                control={form.control}
                name="paperTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Paper Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter the title of your paper" {...field} />
                    </FormControl>
                    <FormDescription>This should match or be similar to your abstract title.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="malayalam">Malayalam</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Font style: English - Times New Roman (12 pt), Malayalam - ML-TTKarthika (14 pt)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <h3 className="text-sm font-medium mb-2">Upload Paper File (Required)</h3>
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="paper-file"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/40 hover:bg-muted"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <p className="mb-2 text-sm text-muted-foreground">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">Accepted formats: .doc, .docx, .pdf (max 10MB)</p>
                      {selectedFile && (
                        <p className="mt-2 text-sm font-medium text-emerald-600">Selected: {selectedFile.name}</p>
                      )}
                    </div>
                    <input
                      id="paper-file"
                      type="file"
                      className="hidden"
                      accept=".doc,.docx,.pdf"
                      onChange={handleFileChange}
                      ref={fileInputRef}
                    />
                  </label>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting || !isVerified}>
              {isSubmitting ? "Submitting..." : "Submit Full Paper"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

