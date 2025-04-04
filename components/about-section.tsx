import { MapPin, Clock, Calendar, Users, Languages } from "lucide-react"

export function AboutSection() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">About the Seminar</h2>
        <p className="text-center max-w-3xl mx-auto mb-12 text-lg text-muted-foreground leading-relaxed">
          The National Seminar on Numerical Inimitability in the Holy Quran - Evidence of Divine Precision is a
          one-day seminar organized by Akode Islamic Centre under the QLF Project. This seminar aims to explore the
          profound numerical patterns in the Quran, highlighting their role as evidence of divine precision and
          authenticity.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-muted/30 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-seminar-gold" />
              <h3 className="text-xl font-semibold text-seminar-gold">Event Details</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex flex-col">
                <span className="font-medium">Date:</span>
                <span className="text-muted-foreground">April 11, 2025</span>
              </li>
              <li className="flex flex-col">
                <span className="font-medium">Time:</span>
                <span className="text-muted-foreground">9:00 AM - 5:00 PM</span>
              </li>
              <li className="flex flex-col">
                <span className="font-medium">Format:</span>
                <span className="text-muted-foreground">Keynote lectures, panel discussions, paper presentations</span>
              </li>
            </ul>
          </div>

          <div className="bg-muted/30 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-seminar-gold" />
              <h3 className="text-xl font-semibold text-seminar-gold">Venue</h3>
            </div>
            <div className="space-y-3">
              <div className="space-y-2">
                <h4 className="font-medium">Akode Islamic Centre</h4>
                <address className="text-muted-foreground not-italic leading-relaxed">
                  Virippadam, Akode<br />
                  Vazhakkad, Malappuram<br />
                  Kerala, India
                </address>
              </div>
              <div className="pt-2 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 inline-block mr-1 mb-1" />
                  Registration opens at 8:30 AM
                </p>
              </div>
            </div>
          </div>

          <div className="bg-muted/30 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-seminar-gold" />
              <h3 className="text-xl font-semibold text-seminar-gold">Submissions</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex flex-col">
                <span className="font-medium">Abstract:</span>
                <span className="text-muted-foreground">200 to 300 words</span>
              </li>
              <li className="flex flex-col">
                <span className="font-medium">Full Paper:</span>
                <span className="text-muted-foreground">4000 to 6000 words</span>
              </li>
              <li className="flex flex-col">
                <div className="flex items-center gap-2">
                  <Languages className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Languages:</span>
                </div>
                <span className="text-muted-foreground">English or Malayalam</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
} 