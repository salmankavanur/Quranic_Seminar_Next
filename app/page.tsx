import { PublicNav } from "@/components/public-nav"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getCollection } from "@/lib/db"

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

export default async function Home() {
  const seminarInfo = await getSeminarInfo()
  const seminarDate = new Date(seminarInfo.seminar_date)
  const currentDate = new Date()

  // Calculate days remaining
  const daysRemaining = Math.ceil((seminarDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24))

  return (
    <main className="min-h-screen flex flex-col">
      <PublicNav />

      <section className="py-12 md:py-20 bg-background text-center px-4">
        <div className="container mx-auto">
          <p className="text-sm text-muted-foreground mb-4">April 10, 2025 • Abode Islamic Centre</p>
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

      <section className="py-12 bg-muted px-4">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Seminar Starting In</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 max-w-md mx-auto gap-4 text-center">
            <div className="bg-background rounded-lg p-4">
              <div className="text-2xl sm:text-3xl font-bold text-emerald-500">{Math.floor(daysRemaining / 30)}</div>
              <div className="text-sm text-muted-foreground">Days</div>
            </div>
            <div className="bg-background rounded-lg p-4">
              <div className="text-2xl sm:text-3xl font-bold text-emerald-500">{Math.floor((daysRemaining % 30) / 7)}</div>
              <div className="text-sm text-muted-foreground">Hours</div>
            </div>
            <div className="bg-background rounded-lg p-4">
              <div className="text-2xl sm:text-3xl font-bold text-emerald-500">{Math.floor((daysRemaining % 7) * 24)}</div>
              <div className="text-sm text-muted-foreground">Minutes</div>
            </div>
            <div className="bg-background rounded-lg p-4">
              <div className="text-2xl sm:text-3xl font-bold text-emerald-500">
                {Math.floor((((daysRemaining % 7) * 24) % 1) * 60)}
              </div>
              <div className="text-sm text-muted-foreground">Seconds</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8 md:mb-12">About the Seminar</h2>
          <p className="text-center max-w-3xl mx-auto mb-8 md:mb-12 text-base sm:text-lg">
            The National Seminar on Numerical Inimitability in the Holy Quran - Evidence of Divine Precision is a
            one-day seminar organized by Abode Islamic Centre under the QLF Project. This seminar aims to explore the
            profound numerical patterns in the Quran, highlighting their role as evidence of divine precision and
            authenticity.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="border rounded-lg p-4 md:p-6">
              <h3 className="text-lg font-semibold mb-2">Event Details</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="font-medium">Date:</span>
                  <span>
                    {seminarDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-medium">Time:</span>
                  <span>9:00 AM - 5:00 PM</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-medium">Format:</span>
                  <span>Keynote lectures, panel discussions, paper presentations</span>
                </li>
              </ul>
            </div>

            <div className="border rounded-lg p-4 md:p-6">
              <h3 className="text-lg font-semibold mb-2">Venue</h3>
              <p>{seminarInfo.venue}</p>
              <p className="text-sm text-muted-foreground mt-2">
                (Complete address will be sent to registered participants)
              </p>
            </div>

            <div className="border rounded-lg p-4 md:p-6">
              <h3 className="text-lg font-semibold mb-2">Submissions</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="font-medium">Abstract:</span>
                  <span>200 to 300 words</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-medium">Full Paper:</span>
                  <span>4000 to 6000 words</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-medium">Languages:</span>
                  <span>English or Malayalam</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-muted px-4">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8 md:mb-12">Speakers & Panelists</h2>
          <p className="text-center mb-8 md:mb-12 text-base sm:text-lg">
            Join us for this groundbreaking academic exploration featuring esteemed scholars and researchers.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <div className="bg-background rounded-lg p-4 md:p-6 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-emerald-500 text-xl sm:text-2xl">👤</span>
              </div>
              <h3 className="font-semibold">Prof. Jamal Abdul Rahman</h3>
              <p className="text-sm text-muted-foreground">Director of Center for Quranic Studies</p>
            </div>

            <div className="bg-background rounded-lg p-4 md:p-6 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-emerald-500 text-xl sm:text-2xl">👤</span>
              </div>
              <h3 className="font-semibold">Suhail Hidaya Hudawi</h3>
              <p className="text-sm text-muted-foreground">Dean, Kulliyyah of Qur'an & Sunnah</p>
            </div>

            <div className="bg-background rounded-lg p-4 md:p-6 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-emerald-500 text-xl sm:text-2xl">👤</span>
              </div>
              <h3 className="font-semibold">Shuhaibul Haitami</h3>
              <p className="text-sm text-muted-foreground">Professor of Nanhi darussalam</p>
            </div>

            <div className="bg-background rounded-lg p-4 md:p-6 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-emerald-500 text-xl sm:text-2xl">👤</span>
              </div>
              <h3 className="font-semibold">Dr. Abdul Qayoom</h3>
              <p className="text-sm text-muted-foreground">Ass. Professor PTM Govt College Perinthalmanna</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8 md:mb-12">Important Dates</h2>
          <div className="max-w-2xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="text-right font-medium">Abstract Submission Deadline:</div>
              <div>March 21, 2025</div>

              <div className="text-right font-medium">Abstract Acceptance:</div>
              <div>February 1, 2025</div>

              <div className="text-right font-medium">Abstract Acceptance Notification:</div>
              <div>March 24, 2025</div>

              <div className="text-right font-medium">Full Paper Submission Deadline:</div>
              <div>April 08, 2025</div>

              <div className="text-right font-medium">Date of the Seminar:</div>
              <div>April 10, 2025</div>
            </div>

            <div className="mt-8 text-center">
              <Button asChild className="w-full sm:w-auto">
                <Link href="/register">Register for the Seminar</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

