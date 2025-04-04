"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function CountdownSection() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    const calculateTimeLeft = () => {
      const seminarDate = new Date("2025-04-15T09:00:00").getTime()
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

  // Variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

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
  }

  // Digit flip animation for seconds
  const flipVariants = {
    initial: { rotateX: 0 },
    animate: { 
      rotateX: 360,
      transition: { duration: 0.6, ease: "easeInOut" }
    }
  }

  if (!mounted) {
    // Non-animated version for SSR
    return (
      <section className="py-12 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">Seminar Starting In</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 max-w-3xl mx-auto gap-4">
            {/* Non-animated placeholder countdown */}
            {["Days", "Hours", "Minutes", "Seconds"].map((unit) => (
              <div key={unit} className="bg-background rounded-lg p-6 shadow-lg border border-border">
                <div className="text-3xl sm:text-4xl font-bold text-emerald-500 text-center mb-2">00</div>
                <div className="text-sm text-center text-muted-foreground font-medium">{unit}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/30 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern"></div>
      </div>
      
      <motion.div 
        className="container mx-auto px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <motion.div 
            className="h-1 w-20 bg-emerald-500 rounded-full mb-6"
            initial={{ width: 0 }}
            animate={{ width: 80 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          ></motion.div>
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">Seminar Starting In</h2>
          <p className="text-muted-foreground text-center mb-10 max-w-xl">
            Join us for this groundbreaking exploration of numerical patterns in the Holy Quran
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-4 max-w-3xl mx-auto gap-4 md:gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Days */}
          <motion.div 
            className="bg-background rounded-xl p-6 shadow-lg border border-border relative group"
            variants={itemVariants}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            <div className="relative">
              <div className="text-3xl sm:text-4xl font-bold text-emerald-500 text-center mb-2 flex justify-center">
                <span className="inline-block w-10 text-center">{String(timeLeft.days).padStart(2, '0')}</span>
              </div>
              <div className="text-sm text-center text-muted-foreground font-medium uppercase tracking-wider">Days</div>
            </div>
          </motion.div>

          {/* Hours */}
          <motion.div 
            className="bg-background rounded-xl p-6 shadow-lg border border-border relative group"
            variants={itemVariants}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            <div className="relative">
              <div className="text-3xl sm:text-4xl font-bold text-emerald-500 text-center mb-2 flex justify-center">
                <span className="inline-block w-10 text-center">{String(timeLeft.hours).padStart(2, '0')}</span>
              </div>
              <div className="text-sm text-center text-muted-foreground font-medium uppercase tracking-wider">Hours</div>
            </div>
          </motion.div>

          {/* Minutes */}
          <motion.div 
            className="bg-background rounded-xl p-6 shadow-lg border border-border relative group"
            variants={itemVariants}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            <div className="relative">
              <div className="text-3xl sm:text-4xl font-bold text-emerald-500 text-center mb-2 flex justify-center">
                <span className="inline-block w-10 text-center">{String(timeLeft.minutes).padStart(2, '0')}</span>
              </div>
              <div className="text-sm text-center text-muted-foreground font-medium uppercase tracking-wider">Minutes</div>
            </div>
          </motion.div>

          {/* Seconds */}
          <motion.div 
            className="bg-background rounded-xl p-6 shadow-lg border border-border relative group"
            variants={itemVariants}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            <div className="relative">
              <div className="text-3xl sm:text-4xl font-bold text-emerald-500 text-center mb-2 flex justify-center perspective">
                <motion.span 
                  className="inline-block w-10 text-center backface-hidden"
                  key={timeLeft.seconds}
                  variants={flipVariants}
                  initial="initial"
                  animate="animate"
                >
                  {String(timeLeft.seconds).padStart(2, '0')}
                </motion.span>
              </div>
              <div className="text-sm text-center text-muted-foreground font-medium uppercase tracking-wider">Seconds</div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Custom CSS for perspective effect */}
      <style jsx>{`
        .perspective {
          perspective: 1000px;
        }
        .backface-hidden {
          backface-visibility: hidden;
          transform-style: preserve-3d;
        }
        .bg-grid-pattern {
          background-image: radial-gradient(circle, rgba(0,0,0,0.1) 1px, transparent 1px);
          background-size: 30px 30px;
        }
      `}</style>
    </section>
  )
}