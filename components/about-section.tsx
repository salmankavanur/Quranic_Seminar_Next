"use client"

import { MapPin, Clock, Calendar, Users, Languages, BookOpen } from "lucide-react"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export function AboutSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  // SSR-compatible version
  if (!mounted) {
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
            {/* Non-animated cards */}
            {Array(3).fill(null).map((_, i) => (
              <div key={i} className="bg-muted/30 rounded-xl p-6 shadow-sm">
                {/* Placeholder content */}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/10 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-emerald-500/5 blur-3xl"></div>
        <div className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full bg-sky-500/5 blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "80px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-1 bg-emerald-500 mx-auto mb-8 rounded-full"
          ></motion.div>
          
          <h2 className="text-3xl font-bold mb-6">About the Seminar</h2>
          <p className="max-w-3xl mx-auto mb-6 text-lg text-muted-foreground leading-relaxed">
            The National Seminar on Numerical Inimitability in the Holy Quran - Evidence of Divine Precision is a
            one-day seminar organized by Akode Islamic Centre under the QLF Project. This seminar aims to explore the
            profound numerical patterns in the Quran, highlighting their role as evidence of divine precision and
            authenticity.
          </p>
          <div className="flex justify-center">
            <a 
              href="/about" 
              className="text-emerald-500 hover:text-emerald-600 font-medium inline-flex items-center gap-1 transition-colors"
            >
              <span>Learn more about the seminar</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </a>
          </div>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Event Details Card */}
          <motion.div 
            className="bg-background rounded-xl p-8 shadow-md border border-border hover:shadow-lg transition-shadow relative overflow-hidden group"
            variants={itemVariants}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-6">
                <Calendar className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-emerald-600 dark:text-emerald-400">Event Details</h3>
              <ul className="space-y-4">
                <li className="flex flex-col">
                  <span className="font-medium mb-1">Date:</span>
                  <span className="text-muted-foreground">April 11, 2025</span>
                </li>
                <li className="flex flex-col">
                  <span className="font-medium mb-1">Time:</span>
                  <span className="text-muted-foreground">9:00 AM - 5:00 PM</span>
                </li>
                <li className="flex flex-col">
                  <span className="font-medium mb-1">Format:</span>
                  <span className="text-muted-foreground">Keynote lectures, panel discussions, paper presentations</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Venue Card */}
          <motion.div 
            className="bg-background rounded-xl p-8 shadow-md border border-border hover:shadow-lg transition-shadow relative overflow-hidden group"
            variants={itemVariants}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-6">
                <MapPin className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-emerald-600 dark:text-emerald-400">Venue</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Akode Islamic Centre</h4>
                  <address className="text-muted-foreground not-italic leading-relaxed">
                    Virippadam, Akode<br />
                    Vazhakkad, Malappuram<br />
                    Kerala, India
                  </address>
                </div>
                <div className="pt-3 border-t border-border">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Clock className="w-4 h-4 flex-shrink-0" />
                    <span>Registration opens at 8:30 AM</span>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Submissions Card */}
          <motion.div 
            className="bg-background rounded-xl p-8 shadow-md border border-border hover:shadow-lg transition-shadow relative overflow-hidden group"
            variants={itemVariants}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-6">
                <BookOpen className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-emerald-600 dark:text-emerald-400">Submissions</h3>
              <ul className="space-y-4">
                <li className="flex flex-col">
                  <span className="font-medium mb-1">Abstract:</span>
                  <span className="text-muted-foreground">200 to 300 words</span>
                </li>
                <li className="flex flex-col">
                  <span className="font-medium mb-1">Full Paper:</span>
                  <span className="text-muted-foreground">4000 to 6000 words</span>
                </li>
                <li className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <Languages className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Languages:</span>
                  </div>
                  <span className="text-muted-foreground">English or Malayalam</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}