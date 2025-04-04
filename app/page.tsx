import { PublicNav } from "@/components/public-nav"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getCollection } from "@/lib/db"
import { SpeakersSection } from "@/components/speakers-section"
import { CountdownSection } from "@/components/countdown-section"
import { AboutSection } from "@/components/about-section"
import { ImportantDates } from "@/components/important-dates"

async function getSeminarInfo() {
  try {
    const settingsCollection = await getCollection("seminar_settings")
    const settings = await settingsCollection.findOne({})

    return (
      settings || {
        seminar_date: new Date("2025-04-10"),
        abstract_deadline: new Date("2025-03-21"),
        paper_deadline: new Date("2025-04-08"),
        venue: "Abode Islamic Centre, Oorkadave, Kerala, India",
        contact_info: { email: "contact@numericalquran.org", phone: "+91 XXXXX XXXXX" },
      }
    )
  } catch (error) {
    console.error("Error fetching seminar info:", error)
    return {
      seminar_date: new Date("2025-04-10"),
      abstract_deadline: new Date("2025-03-21"),
      paper_deadline: new Date("2025-04-08"),
      venue: "Abode Islamic Centre, Oorkadave, Kerala, India",
      contact_info: { email: "contact@numericalquran.org", phone: "+91 XXXXX XXXXX" },
    }
  }
}

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <PublicNav />
      
      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-background text-center px-4">
        <div className="container mx-auto">
          <p className="text-sm text-muted-foreground mb-4">April 11, 2025 • Abode Islamic Centre</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            National Seminar on
            <br />
            <span className="text-emerald-500">Numerical Inimitability</span> in{" "}
            <span className="text-sky-500">the Holy Quran</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Evidence of Divine Precision through mathematical patterns and numerical structures, revealing the
            miraculous nature of the sacred text.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/register">Register Now</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link href="/submit">Submit Abstract</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Countdown Section */}
      <CountdownSection />

      {/* About Section */}
      <AboutSection />

      {/* Speakers Section */}
      <SpeakersSection />

      {/* Important Dates Section */}
      <ImportantDates />

      <Footer />
    </main>
  )
}

