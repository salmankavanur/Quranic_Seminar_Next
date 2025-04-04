"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CalendarDays, CalendarClock, PenSquare, Check, Clock3, Calendar } from "lucide-react"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"

export function ImportantDates() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const dates = [
    {
      title: "Abstract Submission Deadline",
      date: "March 21, 2025",
      icon: <PenSquare className="w-5 h-5" />
    },
    {
      title: "Abstract Acceptance",
      date: "February 1, 2025",
      icon: <Check className="w-5 h-5" />
    },
    {
      title: "Abstract Acceptance Notification",
      date: "March 24, 2025",
      icon: <CalendarClock className="w-5 h-5" />
    },
    {
      title: "Full Paper Submission Deadline",
      date: "April 08, 2025",
      icon: <Clock3 className="w-5 h-5" />
    },
    {
      title: "Date of the Seminar",
      date: "April 15, 2025",
      icon: <Calendar className="w-5 h-5" />
    }
  ]

  // SSR-friendly version
  if (!mounted) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Important Dates</h2>
            <p className="text-muted-foreground">Mark your calendar for these crucial deadlines</p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-background rounded-xl shadow-lg overflow-hidden">
              {/* Placeholder for SSR */}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 left-[10%] w-64 h-64 rounded-full bg-emerald-500/5 blur-3xl"></div>
        <div className="absolute -bottom-32 right-[20%] w-96 h-96 rounded-full bg-sky-500/5 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="h-1 w-0 bg-emerald-500 mx-auto mb-8 rounded-full"
            animate={{ width: 80 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          ></motion.div>
          <h2 className="text-3xl font-bold mb-4">Important Dates</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Mark your calendar for these crucial deadlines for the National
            Seminar on Numerical Inimitability in the Holy Quran
          </p>
        </motion.div>

        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <div className="bg-background rounded-xl shadow-lg overflow-hidden border border-border">
            {dates.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index + 0.4 }}
                className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 sm:p-6 ${
                  index !== dates.length - 1 ? "border-b border-border" : ""
                } hover:bg-muted/20 transition-colors duration-200`}
              >
                <div className="flex items-center gap-4 mb-2 sm:mb-0">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-emerald-600 dark:text-emerald-400">
                      {item.icon}
                    </span>
                  </div>
                  <h3 className="font-medium text-foreground">{item.title}</h3>
                </div>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold sm:ml-8 pl-14 sm:pl-0">
                  {item.date}
                </span>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <div className="bg-background rounded-xl p-8 shadow-md border border-border inline-block">
              <p className="mb-4 text-muted-foreground">
                Don't miss your opportunity to be part of this enlightening
                event
              </p>
              <Button
                asChild
                size="lg"
                className="group relative overflow-hidden"
              >
                <Link href="/register">
                  <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                    Register for the Seminar
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </Link>
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}