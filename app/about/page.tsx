import { PublicNav } from "@/components/public-nav"
import { Footer } from "@/components/footer"

export default function AboutPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <PublicNav />

      <section className="py-12">
        <div className="container">
          <h1 className="text-3xl font-bold text-center mb-4">About the Seminar</h1>
          <p className="text-center text-muted-foreground mb-12">
            Discover the profound numerical patterns in the Holy Quran that reveal divine precision.
          </p>

          <div className="max-w-3xl mx-auto prose dark:prose-invert">
            <h2>National Seminar on Numerical Inimitability in the Holy Quran</h2>

            <p>
              The National Seminar on Numerical Inimitability in the Holy Quran - Evidence of Divine Precision is a
              one-day seminar organized by Abode Islamic Centre under the QLF Project. This seminar aims to explore the
              profound numerical patterns in the Quran, highlighting their role as evidence of divine precision and
              authenticity.
            </p>

            <p>
              Bringing together scholars, researchers, and academicians, it will serve as a platform for deep
              discussions on the intricate mathematical coherence within the Quran. The program will feature keynote
              lectures, panel discussions, research paper presentations, and interactive sessions, fostering scholarly
              engagement and knowledge exchange.
            </p>

            <p>
              By examining these numerical aspects, the seminar seeks to uncover new insights, identify research gaps,
              and encourage further studies, contributing to the broader discourse on the miraculous nature of the
              Quran.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              <div>
                <h3>About the QLF</h3>
                <p>
                  QLF (Qur'anic Learning Festival) is a unique initiative by Abode Islamic Centre dedicated to fostering
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
                <h3>About the Abode Islamic Centre</h3>
                <p>
                  The Abode Islamic Centre is a leading institution dedicated to education, Qur'anic studies, and social
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

            <h3 className="mt-12">Full List of Sub-themes</h3>
            <ul>
              <li>Historical Perspectives on Numerical Analysis of the Quran</li>
              <li>The Role of Mathematics in Classical and Modern Quranic Interpretation</li>
              <li>Patterns and Frequencies of Words and Numbers in the Quran</li>
              <li>Criticism and Debates on Numerical Miracles in the Quran</li>
              <li>Comparative Study: Numerical Miracles in Other Religious Texts</li>
              <li>Scientific and Mathematical Symmetry in the Quran</li>
              <li>The Role of Digital Tools in Analyzing Quranic Numbers</li>
              <li>Numerical Structure of Quranic Chapters and Verses</li>
              <li>Connection Between Numerical Miracles and Linguistic Miracles</li>
              <li>Impact of Mathematical Interpretation on Quranic Exegesis (Tafsir)</li>
              <li>The Quran and the Golden Ratio: Myth or Reality?</li>
              <li>Numerical Miracles and the Concept of Divine Precision in Islam</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted">
        <div className="container">
          <h2 className="text-2xl font-bold text-center mb-12">Joining Us</h2>
          <p className="text-center mb-12">
            Meet our esteemed moderator and panelists for this groundbreaking academic exploration.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-8">
            <div className="bg-background rounded-lg p-6">
              <div className="text-emerald-500 text-sm font-medium mb-2">Moderator</div>
              <h3 className="text-xl font-bold mb-1">Suhail Hidaya Hudawi</h3>
              <div className="text-sm text-muted-foreground mb-4">Dean, Kulliyyah of Qur'an & Sunnah</div>
              <p className="text-sm">
                Suhail Hidaya Hudawi is a distinguished scholar specializing in Quranic studies with extensive
                experience in Islamic education and research.
              </p>
            </div>

            <div className="bg-background rounded-lg p-6">
              <div className="text-emerald-500 text-sm font-medium mb-2">Keynote Speaker</div>
              <h3 className="text-xl font-bold mb-1">Prof. Jamal Abdul Rahman</h3>
              <div className="text-sm text-muted-foreground mb-4">Director of Center for Quranic Studies</div>
              <p className="text-sm">
                Prof. Jamal Abdul Rahman is an internationally recognized authority on Quranic numerical patterns and
                mathematical analysis.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-background rounded-lg p-6">
              <div className="text-emerald-500 text-sm font-medium mb-2">Panelist</div>
              <h3 className="text-lg font-bold mb-1">Shuhaibul Haitami</h3>
              <div className="text-sm text-muted-foreground mb-4">Professor of Nanhi darussalam</div>
            </div>

            <div className="bg-background rounded-lg p-6">
              <div className="text-emerald-500 text-sm font-medium mb-2">Panelist</div>
              <h3 className="text-lg font-bold mb-1">Dr. Abdul Qayoom</h3>
              <div className="text-sm text-muted-foreground mb-4">Ass. Professor PTM Govt College Perinthalmanna</div>
            </div>

            <div className="bg-background rounded-lg p-6">
              <div className="text-emerald-500 text-sm font-medium mb-2">Panelist</div>
              <h3 className="text-lg font-bold mb-1">Salam Faisy Olavatttur</h3>
              <div className="text-sm text-muted-foreground mb-4">Intaq academic senate member</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

