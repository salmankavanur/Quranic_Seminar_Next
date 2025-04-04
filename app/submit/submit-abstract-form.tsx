"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const formSchema = z.object({
  phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  institution: z.string().min(2, {
    message: "Institution name must be at least 2 characters.",
  }),
  abstractTitle: z.string().min(5, {
    message: "Abstract title must be at least 5 characters.",
  }),
  subTheme: z.string({
    required_error: "Please select a sub-theme.",
  }),
  keywords: z.string().min(5, {
    message: "Please enter 3-5 keywords separated by commas.",
  }),
  abstract: z
    .string()
    .min(200, {
      message: "Abstract must be at least 200 characters.",
    })
    .max(1500, {
      message: "Abstract must not exceed 1500 characters (approximately 300 words).",
    }),
})

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

export function SubmitAbstractForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: "",
      institution: "",
      abstractTitle: "",
      subTheme: "",
      keywords: "",
      abstract: "",
    },
  })

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      setSelectedFile(files[0])
    }
  }

  async function verifyPhone() {
    setIsVerifying(true)

    try {
      const response = await fetch("/api/verify-phone", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: form.getValues("phone") }),
      })

      const data = await response.json()

      if (data.verified) {
        setIsVerified(true)
        toast({
          title: "Phone Verified",
          description: data.message || "Your phone number has been verified. You can now submit your abstract.",
        })
      } else {
        toast({
          title: "Verification Failed",
          description: data.message || "Phone number verification failed. Please check your number and try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Phone verification error:", error)
      toast({
        title: "Verification Error",
        description: "There was an error verifying your phone number. Please try again.",
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
        description: "Please verify your phone number before submitting.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Create FormData to handle file upload
      const formData = new FormData()
      formData.append("phone", values.phone)
      formData.append("institution", values.institution)
      formData.append("abstractTitle", values.abstractTitle)
      formData.append("subTheme", values.subTheme)
      formData.append("keywords", values.keywords)
      formData.append("abstract", values.abstract)

      // Add file if selected (optional)
      if (selectedFile) {
        formData.append("file", selectedFile)
      }

      const response = await fetch("/api/submit-abstract", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Abstract submission failed")
      }

      toast({
        title: "Abstract Submitted",
        description: "Your abstract has been submitted successfully. We will review it and get back to you.",
      })

      // Store the abstract ID in session storage to display on the success page
      if (data.abstractId) {
        sessionStorage.setItem("abstractId", data.abstractId)
      }

      // Reset form and redirect
      form.reset()
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
      router.push("/submit/success")
    } catch (error) {
      console.error("Abstract submission error:", error)
      toast({
        title: "Submission Failed",
        description:
          error instanceof Error ? error.message : "There was an error submitting your abstract. Please try again.",
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
                      <div className="flex gap-2">
                        <FormControl>
                          <Input placeholder="+91 XXXXX XXXXX" {...field} />
                        </FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={verifyPhone}
                          disabled={isVerifying || isVerified}
                        >
                          {isVerifying ? "Verifying..." : isVerified ? "Verified" : "Verify"}
                        </Button>
                      </div>
                      <FormDescription>Your phone number must be registered as a Paper Presenter.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="institution"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Institution/Organization</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your institution or organization" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="abstractTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Abstract Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter the title of your abstract" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subTheme"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sub-theme</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select relevant sub-theme" />
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
                control={form.control}
                name="keywords"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Keywords (3-5, separated by commas)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., numerical patterns, divine precision, mathematical structure"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="abstract"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Abstract (200-300 words)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter your abstract content here" className="min-h-[200px]" {...field} />
                    </FormControl>
                    <FormDescription>
                      Character count: {field.value.length}/1500 (approximately {Math.round(field.value.length / 5)}{" "}
                      words)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <h3 className="text-sm font-medium mb-2">Upload Abstract File (Optional)</h3>
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="abstract-file"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/40 hover:bg-muted"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <p className="mb-2 text-sm text-muted-foreground">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">Accepted formats: .doc, .docx, .pdf (max 5MB)</p>
                      {selectedFile && (
                        <p className="mt-2 text-sm font-medium text-emerald-600">Selected: {selectedFile.name}</p>
                      )}
                    </div>
                    <input
                      id="abstract-file"
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
              {isSubmitting ? "Submitting..." : "Submit Abstract"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

