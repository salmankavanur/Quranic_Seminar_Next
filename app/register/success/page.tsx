import { PublicNav } from "@/components/public-nav"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle } from "lucide-react"

export default function RegistrationSuccessPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <PublicNav />

      <section className="py-12 flex-1 flex items-center justify-center">
        <div className="container max-w-md text-center">
          <div className="mb-6 flex justify-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>

          <h1 className="text-2xl font-bold mb-4">Registration Successful!</h1>

          <p className="text-muted-foreground mb-8">
            Thank you for registering for the National Seminar on Numerical Inimitability in the Holy Quran. We have
            received your registration and will send you a confirmation email shortly with further details.
          </p>

          <div className="flex flex-col gap-4">
            <Button asChild>
              <Link href="/">Return to Home</Link>
            </Button>

            <Button asChild variant="outline">
              <Link href="/submit">Submit Abstract</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

