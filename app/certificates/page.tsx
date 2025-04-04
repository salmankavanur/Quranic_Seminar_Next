"use client"

import { useState } from "react"
import { PublicNav } from "@/components/public-nav"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Award, Download, CheckCircle, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function CertificatesPage() {
  const [phone, setPhone] = useState("")
  const [abstractId, setAbstractId] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [certificateData, setCertificateData] = useState<{
    name: string
    paperTitle: string
    certificateNumber: string
    downloadUrl: string
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleVerify = async () => {
    if (!phone) {
      toast({
        title: "Phone number required",
        description: "Please enter your phone number to verify your certificate.",
        variant: "destructive",
      })
      return
    }

    setIsVerifying(true)
    setError(null)
    setCertificateData(null)

    try {
      const response = await fetch("/api/verify-certificate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone,
          abstractId: abstractId || undefined,
        }),
      })

      const data = await response.json()

      if (data.verified) {
        setCertificateData({
          name: data.name,
          paperTitle: data.paperTitle,
          certificateNumber: data.certificateNumber,
          downloadUrl: data.downloadUrl,
        })
      } else {
        setError(data.message || "Certificate verification failed. Please check your information and try again.")
      }
    } catch (error) {
      console.error("Certificate verification error:", error)
      setError("An error occurred during verification. Please try again.")
    } finally {
      setIsVerifying(false)
    }
  }

  const handleDownload = () => {
    if (!certificateData) return

    // Create a temporary link element and trigger the download
    const link = document.createElement("a")
    link.href = certificateData.downloadUrl
    link.setAttribute("download", `certificate-${certificateData.certificateNumber}.pdf`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Download started",
      description: "Your certificate download has started.",
    })
  }

  return (
    <main className="min-h-screen flex flex-col">
      <PublicNav />

      <section className="py-12 flex-1">
        <div className="container max-w-2xl">
          <div className="text-center mb-8">
            <Award className="h-16 w-16 text-amber-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Certificate Download</h1>
            <p className="text-muted-foreground">
              Download your paper presentation certificate for the National Seminar on Numerical Inimitability in the
              Holy Quran.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Verify Your Certificate</CardTitle>
              <CardDescription>
                Enter your phone number and optionally your Abstract ID to verify and download your certificate.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  Phone Number
                </label>
                <Input
                  id="phone"
                  placeholder="+91 XXXXX XXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Enter the phone number you used during registration.</p>
              </div>

              <div className="space-y-2">
                <label htmlFor="abstractId" className="text-sm font-medium">
                  Abstract ID (Optional)
                </label>
                <Input
                  id="abstractId"
                  placeholder="e.g., ABS-123456-7890"
                  value={abstractId}
                  onChange={(e) => setAbstractId(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  If you have multiple papers, enter the Abstract ID to download a specific certificate.
                </p>
              </div>

              <Button onClick={handleVerify} disabled={isVerifying} className="w-full">
                {isVerifying ? "Verifying..." : "Verify & Download Certificate"}
              </Button>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {certificateData && (
                <div className="space-y-4">
                  <Alert variant="success">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>Certificate verification successful!</AlertDescription>
                  </Alert>

                  <div className="bg-muted p-4 rounded-lg space-y-2">
                    <div>
                      <span className="font-medium">Name:</span> {certificateData.name}
                    </div>
                    <div>
                      <span className="font-medium">Paper Title:</span> {certificateData.paperTitle}
                    </div>
                    <div>
                      <span className="font-medium">Certificate Number:</span> {certificateData.certificateNumber}
                    </div>
                  </div>

                  <Button onClick={handleDownload} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download Certificate
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>
              Note: Certificates are only available for papers that have been marked as "Qualified for Presentation".
            </p>
            <p className="mt-2">
              If you have any issues downloading your certificate, please contact us at{" "}
              <a href="mailto:contact@numericalquran.org" className="text-primary">
                contact@numericalquran.org
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

