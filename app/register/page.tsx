import { PublicNav } from "@/components/public-nav"
import { Footer } from "@/components/footer"
import { RegistrationForm } from "./registration-form"
import { CalendarIcon, UserIcon, ClipboardCheckIcon, BookOpenIcon, CoffeeIcon, UsersIcon } from "lucide-react"

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <PublicNav />

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950/20 dark:to-background">
        <div className="container max-w-5xl">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 tracking-tight">Register for the Seminar</h1>
          <p className="text-center text-muted-foreground mb-6 text-lg max-w-2xl mx-auto">
            Join us for this groundbreaking academic exploration of numerical patterns in the Holy Quran.
          </p>
          <div className="flex justify-center gap-4 mb-8">
            <div className="inline-flex items-center text-sm gap-1.5 bg-background px-3 py-1.5 rounded-full border">
              <CalendarIcon className="w-4 h-4 text-emerald-500" />
              <span>April 15, 2025</span>
            </div>
            <div className="inline-flex items-center text-sm gap-1.5 bg-background px-3 py-1.5 rounded-full border">
              <UserIcon className="w-4 h-4 text-emerald-500" />
              <span>Limited Seats Available</span>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Form Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold mb-6 text-center">Secure Your Place</h2>
          <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
            Please complete the form below to register for the National Seminar on Numerical Inimitability in the Holy Quran.
          </p>
          
          <RegistrationForm />
        </div>
      </section>

      {/* What's Included Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">What's Included in Your Registration</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-background rounded-xl p-6 shadow-sm transition-all hover:shadow-md flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                <ClipboardCheckIcon className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Scholarly Presentations</h3>
              <p className="text-muted-foreground">
                Attend lectures from distinguished scholars on numerical patterns in the Holy Quran.
              </p>
            </div>

            <div className="bg-background rounded-xl p-6 shadow-sm transition-all hover:shadow-md flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                <BookOpenIcon className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Quranic Research</h3>
              <p className="text-muted-foreground">
                Gain insights into cutting-edge research on numerical inimitability in the Holy Quran.
              </p>
            </div>

            <div className="bg-background rounded-xl p-6 shadow-sm transition-all hover:shadow-md flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                <CoffeeIcon className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Hospitality</h3>
              <p className="text-muted-foreground">
                Enjoy complimentary lunch and refreshments served in accordance with Islamic traditions.
              </p>
            </div>

            <div className="bg-background rounded-xl p-6 shadow-sm transition-all hover:shadow-md flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-emerald-600">
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3z"></path>
                  <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Recognition</h3>
              <p className="text-muted-foreground">
                Receive a certificate of participation from the Akode Islamic Centre.
              </p>
            </div>

            <div className="bg-background rounded-xl p-6 shadow-sm transition-all hover:shadow-md flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                <UsersIcon className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Islamic Community</h3>
              <p className="text-muted-foreground">
                Connect with a community of scholars and students dedicated to Quranic studies.
              </p>
            </div>

            <div className="bg-background rounded-xl p-6 shadow-sm transition-all hover:shadow-md flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-emerald-600">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Spiritual Insights</h3>
              <p className="text-muted-foreground">
                Discover divine precision through mathematical and numerical patterns in the Holy Quran.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-12 bg-gradient-to-b from-white to-emerald-50 dark:from-background dark:to-emerald-950/10">
        <div className="container max-w-4xl text-center">
          <div className="bg-background rounded-xl p-8 shadow-md border border-border">
            <h2 className="text-2xl font-bold mb-4">Have Questions?</h2>
            <p className="mb-6 max-w-xl mx-auto">
              If you have any questions about the registration process or the seminar, please don't hesitate to contact us.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
              <a href="mailto:contact@akodeislamiccentre.org" className="bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-md font-medium transition-colors inline-flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </svg>
                Contact Us
              </a>
              <a href="/documents/seminar_brochure.pdf" target="_blank" rel="noopener noreferrer" className="bg-muted hover:bg-muted/80 py-3 px-6 rounded-md font-medium transition-colors inline-flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v8"></path>
                  <path d="m16 6-4 4-4-4"></path>
                  <rect width="20" height="8" x="2" y="14" rx="2"></rect>
                </svg>
                Download Brochure
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}