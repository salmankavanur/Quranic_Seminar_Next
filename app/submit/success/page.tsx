"use client"

import { useEffect, useState } from "react"
import { PublicNav } from "@/components/public-nav"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle, Copy } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export default function SubmissionSuccessPage() {
  const [abstractId, setAbstractId] = useState<string | null>(null)
  const [submissionType, setSubmissionType] = useState<"abstract" | "paper">("abstract")

  useEffect(() => {
    // Get the abstract ID from session storage
    const id = sessionStorage.getItem("abstractId")
    if (id) {
      setAbstractId(id)
      setSubmissionType("abstract")
      // Clear it after retrieving
      sessionStorage.removeItem("abstractId")
    } else {
      // If no abstract ID, it was likely a paper submission
      setSubmissionType("paper")
    }
  }, [])

  const copyToClipboard = () => {
    if (abstractId) {
      navigator.clipboard.writeText(abstractId)
      toast({
        title: "Copied to clipboard",
        description: "Abstract ID has been copied to your clipboard.",
      })
    }
  }

  return (
    <main className="min-h-screen flex flex-col">
      <PublicNav />

      <section className="py-12 flex-1 flex items-center justify-center">
        <div className="container max-w-md text-center">
          <div className="mb-6 flex justify-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>

          <h1 className="text-2xl font-bold mb-4">Submission Successful!</h1>

          <p className="text-muted-foreground mb-8">
            Thank you for your submission. We have received your information and will review it shortly. You will
            receive a confirmation email with further details.
          </p>

          {abstractId && (
            <div className="mb-8 p-4 bg-muted rounded-lg">
              <h2 className="font-semibold mb-2">Your Abstract ID</h2>
              <div className="flex items-center justify-center gap-2">
                <code className="bg-background p-2 rounded border">{abstractId}</code>
                <Button variant="ghost" size="icon" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Please save this ID. You will need it when submitting your full paper.
              </p>
            </div>
          )}

          <div className="flex flex-col gap-4">
            <Button asChild>
              <Link href="/">Return to Home</Link>
            </Button>

            {abstractId && (
              <Button asChild variant="outline">
                <Link href={`/submit?tab=paper&abstractId=${abstractId}`}>Submit Full Paper</Link>
              </Button>
            )}

            <Button asChild variant="outline">
              <Link href="/submit">Submit Another</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

