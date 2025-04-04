"use client"

import { useEffect, useState } from "react"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function CountdownSection() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const seminarDate = new Date("2025-04-11T09:00:00").getTime()
      const now = new Date().getTime()
      const difference = seminarDate - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-8">Seminar Starting In</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 max-w-3xl mx-auto gap-4">
          <div className="bg-background rounded-lg p-6 shadow-lg border border-border">
            <div className="text-3xl sm:text-4xl font-bold text-seminar-gold text-center mb-2">
              {String(timeLeft.days).padStart(2, '0')}
            </div>
            <div className="text-sm text-center text-muted-foreground font-medium">Days</div>
          </div>
          <div className="bg-background rounded-lg p-6 shadow-lg border border-border">
            <div className="text-3xl sm:text-4xl font-bold text-seminar-gold text-center mb-2">
              {String(timeLeft.hours).padStart(2, '0')}
            </div>
            <div className="text-sm text-center text-muted-foreground font-medium">Hours</div>
          </div>
          <div className="bg-background rounded-lg p-6 shadow-lg border border-border">
            <div className="text-3xl sm:text-4xl font-bold text-seminar-gold text-center mb-2">
              {String(timeLeft.minutes).padStart(2, '0')}
            </div>
            <div className="text-sm text-center text-muted-foreground font-medium">Minutes</div>
          </div>
          <div className="bg-background rounded-lg p-6 shadow-lg border border-border">
            <div className="text-3xl sm:text-4xl font-bold text-seminar-gold text-center mb-2">
              {String(timeLeft.seconds).padStart(2, '0')}
            </div>
            <div className="text-sm text-center text-muted-foreground font-medium">Seconds</div>
          </div>
        </div>
      </div>
    </section>
  )
} 