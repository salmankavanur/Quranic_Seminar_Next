import { PublicNav } from "@/components/public-nav"
import { Footer } from "@/components/footer"
import { RegistrationForm } from "./registration-form"

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <PublicNav />

      <section className="py-12">
        <div className="container">
          <h1 className="text-3xl font-bold text-center mb-4">Register for the Seminar</h1>
          <p className="text-center text-muted-foreground mb-12">
            Join us for this groundbreaking academic exploration of numerical patterns in the Holy Quran.
          </p>

          <RegistrationForm />
        </div>
      </section>

      <section className="py-12 bg-muted">
        <div className="container">
          <h2 className="text-2xl font-bold text-center mb-8">Registration Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <div>
              <h3 className="text-xl font-semibold mb-4">Fees & Payment</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Academics/Professionals:</span>
                  <span>₹1000</span>
                </div>
                <div className="flex justify-between">
                  <span>Research Scholars:</span>
                  <span>₹750</span>
                </div>
                <div className="flex justify-between">
                  <span>Students:</span>
                  <span>₹500</span>
                </div>
                <p className="text-sm text-muted-foreground mt-4">Payment details will be sent after registration</p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">What's Included</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Access to all seminar sessions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Seminar materials and resources</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Certificate of participation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Lunch and refreshments</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Networking opportunities</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

