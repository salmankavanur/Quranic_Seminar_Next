import { PublicNav } from "@/components/public-nav"
import { Footer } from "@/components/footer"
import { CalendarIcon, UserIcon, MapPinIcon, BookOpenIcon } from "lucide-react"

export default function AboutPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <PublicNav />

      {/* Hero Section with Improved Visual Hierarchy */}
      <section className="py-16 bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950/20 dark:to-background">
        <div className="container max-w-5xl">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 tracking-tight">About the Seminar</h1>
          <p className="text-center text-muted-foreground mb-6 text-lg max-w-2xl mx-auto">
            Discover the profound numerical patterns in the Holy Quran that reveal divine precision.
          </p>
          <div className="flex justify-center gap-4 mb-8">
            <div className="inline-flex items-center text-sm gap-1.5 bg-background px-3 py-1.5 rounded-full border">
              <CalendarIcon className="w-4 h-4 text-emerald-500" />
              <span>April 11, 2025</span>
            </div>
            <div className="inline-flex items-center text-sm gap-1.5 bg-background px-3 py-1.5 rounded-full border">
              <MapPinIcon className="w-4 h-4 text-emerald-500" />
              <span>Akode Islamic Centre</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content with Improved Typography and Spacing */}
      <section className="py-12">
        <div className="container">
          <div className="max-w-3xl mx-auto prose dark:prose-invert">
            <h2 className="text-3xl font-bold mb-6">National Seminar on Numerical Inimitability in the Holy Quran</h2>

            <p className="text-lg leading-relaxed">
              The National Seminar on Numerical Inimitability in the Holy Quran - Evidence of Divine Precision is a
              one-day seminar organized by Akode Islamic Centre under the QLF Project. This seminar aims to explore the
              profound numerical patterns in the Quran, highlighting their role as evidence of divine precision and
              authenticity.
            </p>

            <p className="text-lg leading-relaxed">
              Bringing together scholars, researchers, and academicians, it will serve as a platform for deep
              discussions on the intricate mathematical coherence within the Quran. The program will feature keynote
              lectures, panel discussions, research paper presentations, and interactive sessions, fostering scholarly
              engagement and knowledge exchange.
            </p>

            <p className="text-lg leading-relaxed">
              By examining these numerical aspects, the seminar seeks to uncover new insights, identify research gaps,
              and encourage further studies, contributing to the broader discourse on the miraculous nature of the
              Quran.
            </p>

            {/* Event Highlights Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-12">
              <div className="bg-muted p-6 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-md">
                    <UserIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-semibold m-0">Expert Speakers</h3>
                </div>
                <p className="m-0">Learn from renowned scholars and academics specializing in Quranic studies.</p>
              </div>
              
              <div className="bg-muted p-6 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-md">
                    <BookOpenIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-semibold m-0">Research Presentations</h3>
                </div>
                <p className="m-0">Discover cutting-edge research on numerical patterns in the Holy Quran.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              <div>
                <h3 className="text-2xl font-bold mb-4">About the QLF</h3>
                <p>
                  QLF (Qur'anic Learning Festival) is a unique initiative by Akode Islamic Centre dedicated to fostering
                  a deeper understanding and appreciation of the Qur'an through various academic, artistic, and
                  interactive programs.
                </p>
                <p>
                  Designed as a comprehensive platform, QLF brings together scholars, students, and the general public
                  to engage with the Qur'an in innovative ways. The project includes diverse programs such as Qur'anic
                  competitions, scholarly seminars, interactive topics, research discussions, and creative contests, all
                  aimed at promoting Qur'anic literacy and scholarship.
                </p>
                <p>
                  By integrating traditional and modern approaches, QLF aspires to enhance engagement with the Qur'an,
                  inspire research, and provide a space for dialogue and learning.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-4">About the Akode Islamic Centre</h3>
                <p>
                  The Akode Islamic Centre is a leading institution dedicated to education, Qur'anic studies, and social
                  welfare. While it provides a nurturing environment for over 400 orphaned children, it also serves a
                  broader community through quality education from kindergarten to post-secondary levels.
                </p>
                <p>
                  The Centre emphasizes profound Qur'anic studies alongside academic excellence. Under its Islamic Da'wa
                  Academy, Darya Women's College, Oorkadave Qasim Moulavi College, Little Pre-School, and various other
                  wings, the Centre fulfills its core objective to contribute to its mission of empowering individuals
                  through knowledge and preserving Islamic values.
                </p>
              </div>
            </div>

            {/* Sub-themes with Modern Card Layout */}
            <h3 className="text-2xl font-bold mt-12 mb-6">Seminar Sub-themes</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-12">
              {[
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
                "Numerical Miracles and the Concept of Divine Precision in Islam"
              ].map((theme, index) => (
                <div key={index} className="bg-muted/50 p-4 rounded-lg border border-border">
                  <p className="m-0 text-sm">{theme}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Speakers Section with Improved Cards */}
      <section className="py-16 bg-muted">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-4">Distinguished Speakers</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Meet our esteemed moderator and panelists for this groundbreaking academic exploration of numerical patterns in the Holy Quran.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
            <div className="bg-background rounded-xl p-6 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-emerald-600">SH</span>
                </div>
                <div>
                  <div className="text-emerald-500 text-sm font-medium mb-1">Moderator</div>
                  <h3 className="text-xl font-bold mb-1">Suhail Hidaya Hudawi</h3>
                  <div className="text-sm text-muted-foreground mb-3">Dean, Kulliyyah of Qur'an & Sunnah</div>
                  <p className="text-sm">
                    Suhail Hidaya Hudawi is a distinguished scholar specializing in Quranic studies with extensive
                    experience in Islamic education and research.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-background rounded-xl p-6 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-emerald-600">JA</span>
                </div>
                <div>
                  <div className="text-emerald-500 text-sm font-medium mb-1">Keynote Speaker</div>
                  <h3 className="text-xl font-bold mb-1">Prof. Jamal Abdul Rahman</h3>
                  <div className="text-sm text-muted-foreground mb-3">Director of Center for Quranic Studies</div>
                  <p className="text-sm">
                    Prof. Jamal Abdul Rahman is an internationally recognized authority on Quranic numerical patterns and
                    mathematical analysis.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                name: "Shuhaibul Haitami",
                role: "Panelist",
                position: "Professor of Nanhi darussalam",
                initials: "SH"
              },
              {
                name: "Dr. Abdul Qayoom",
                role: "Panelist",
                position: "Ass. Professor PTM Govt College Perinthalmanna",
                initials: "AQ"
              },
              {
                name: "Salam Faisy Olavatttur",
                role: "Panelist",
                position: "Intaq academic senate member",
                initials: "SF"
              }
            ].map((panelist, index) => (
              <div key={index} className="bg-background rounded-xl p-5 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-emerald-600">{panelist.initials}</span>
                  </div>
                  <div>
                    <div className="text-emerald-500 text-xs font-medium">{panelist.role}</div>
                    <h3 className="text-base font-bold">{panelist.name}</h3>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">{panelist.position}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration CTA Section */}
      <section className="py-16 bg-gradient-to-b from-white to-emerald-50 dark:from-background dark:to-emerald-950/10">
        <div className="container max-w-4xl">
          <div className="bg-background rounded-xl p-8 shadow-md border border-border">
            <h2 className="text-2xl font-bold text-center mb-4">Join Us at the Seminar</h2>
            <p className="text-center mb-8 max-w-xl mx-auto">
              Reserve your place at this unique academic event exploring the numerical inimitability in the Holy Quran.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-md font-medium transition-colors">
                Register Now
              </button>
              <button className="bg-muted hover:bg-muted/80 py-3 px-6 rounded-md font-medium transition-colors">
                Download Brochure
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}