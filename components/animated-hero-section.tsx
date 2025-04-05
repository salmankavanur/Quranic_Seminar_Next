"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export function AnimatedHeroSection() {
  // Array of numerical values that will float in the background
  const numericalElements = [1, 3, 5, 7, 9, 11, 19, 21, 23, 29];
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a non-animated version for SSR
    return (
      <section className="py-12 md:py-20 bg-background text-center px-4">
        <div className="container mx-auto">
          <p className="text-sm text-muted-foreground mb-4">April 10, 2025 • Akode Islamic Centre</p>
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
    );
  }

  return (
    <section className="py-12 md:py-20 bg-background text-center px-4 overflow-hidden relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-10 left-[10%] w-32 h-32 rounded-full bg-emerald-500/5"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-[10%] w-24 h-24 rounded-full bg-sky-500/5"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
        />
        <motion.div
          className="absolute top-40 right-[20%] w-16 h-16 rounded-full bg-emerald-500/5"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.4, ease: "easeOut" }}
        />
      </div>

      <div className="container mx-auto relative z-10">
        <motion.p
          className="text-sm text-muted-foreground mb-4 font-medium"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          April 10, 2025 • Akode Islamic Centre
        </motion.p>

        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          National Seminar on
          <br />
          <motion.span
            className="text-emerald-500 inline-block"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Numerical Inimitability
          </motion.span>{" "}
          in{" "}
          <motion.span
            className="text-sky-500 inline-block"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            the Holy Quran
          </motion.span>
        </motion.h1>

        <motion.p
          className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          Evidence of Divine Precision through mathematical patterns and
          numerical structures, revealing the miraculous nature of the sacred
          text.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
        >
          <Button
            asChild
            size="lg"
            className="w-full sm:w-auto group relative overflow-hidden"
          >
            <Link href="/register">
              <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                Register Now
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full sm:w-auto group relative overflow-hidden"
          >
            <Link href="/submit">
              <span className="relative z-10">Submit Abstract</span>
              <span className="absolute inset-0 bg-gradient-to-r from-sky-100/10 to-sky-200/10 dark:from-sky-900/10 dark:to-sky-800/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          </Button>
        </motion.div>

        {/* Decorative numbers appearing dynamically */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {numericalElements.map((num, index) => (
            <motion.div
              key={index}
              className="absolute text-5xl font-bold text-gray-100 dark:text-gray-800/20"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 0.1, y: 0 }}
              transition={{
                duration: 2 + Math.random() * 3,
                delay: index * 0.2,
                repeat: Infinity,
                repeatType: "reverse",
                repeatDelay: Math.random() * 5,
              }}
              style={{
                top: `${Math.random() * 90 + 5}%`,
                left: `${Math.random() * 90 + 5}%`,
                transform: `rotate(${Math.random() * 30 - 15}deg)`,
              }}
            >
              {num}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}