export function AboutSection() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">About the Seminar</h2>
        <p className="text-center max-w-3xl mx-auto mb-12 text-lg text-muted-foreground leading-relaxed">
          The National Seminar on Numerical Inimitability in the Holy Quran - Evidence of Divine Precision is a
          one-day seminar organized by Abode Islamic Centre under the QLF Project. This seminar aims to explore the
          profound numerical patterns in the Quran, highlighting their role as evidence of divine precision and
          authenticity.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-muted/30 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold mb-4 text-seminar-gold">Event Details</h3>
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
            <h3 className="text-xl font-semibold mb-4 text-seminar-gold">Venue</h3>
            <p className="text-muted-foreground mb-4">Abode Islamic Centre, Oorkadave, Kerala, India</p>
            <p className="text-sm text-muted-foreground italic">
              (Complete address will be sent to registered participants)
            </p>
          </div>

          <div className="bg-muted/30 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold mb-4 text-seminar-gold">Submissions</h3>
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
                <span className="font-medium">Languages:</span>
                <span className="text-muted-foreground">English or Malayalam</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
} 