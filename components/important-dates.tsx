import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CalendarDays } from "lucide-react"

export function ImportantDates() {
  const dates = [
    {
      title: "Abstract Submission Deadline",
      date: "March 21, 2025"
    },
    {
      title: "Abstract Acceptance",
      date: "February 1, 2025"
    },
    {
      title: "Abstract Acceptance Notification",
      date: "March 24, 2025"
    },
    {
      title: "Full Paper Submission Deadline",
      date: "April 08, 2025"
    },
    {
      title: "Date of the Seminar",
      date: "April 11, 2025"
    }
  ]

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Important Dates</h2>
          <p className="text-muted-foreground">Mark your calendar for these crucial deadlines</p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-background rounded-xl shadow-lg overflow-hidden">
            {dates.map((item, index) => (
              <div
                key={item.title}
                className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 ${
                  index !== dates.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <div className="flex items-center gap-3 mb-2 sm:mb-0">
                  <CalendarDays className="w-5 h-5 text-seminar-gold" />
                  <h3 className="font-medium">{item.title}</h3>
                </div>
                <span className="text-muted-foreground ml-8">{item.date}</span>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button asChild size="lg">
              <Link href="/register">Register for the Seminar</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
} 