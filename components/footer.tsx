import Link from "next/link"
import { Github, Facebook, Twitter, Instagram } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-b from-background to-muted/30 border-t border-border">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* First Column - About */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold tracking-tight">
              <span className="text-emerald-500">Numerical</span>{' '}
              <span className="text-sky-500 dark:text-white">Inimitability</span>
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Exploring the mathematical miracles and numerical patterns in the Holy Quran through academic research and collaboration.
            </p>
            <div className="flex space-x-3 pt-3">
              <a 
                href="#" 
                className="w-8 h-8 flex items-center justify-center rounded-full bg-background border border-border hover:bg-emerald-100 hover:text-emerald-600 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400 transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={16} />
              </a>
              <a 
                href="#" 
                className="w-8 h-8 flex items-center justify-center rounded-full bg-background border border-border hover:bg-emerald-100 hover:text-emerald-600 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400 transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={16} />
              </a>
              <a 
                href="#" 
                className="w-8 h-8 flex items-center justify-center rounded-full bg-background border border-border hover:bg-emerald-100 hover:text-emerald-600 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
            </div>
          </div>

          {/* Second Column - Quick Links */}
          <div>
            <h4 className="font-medium mb-4 text-base pb-1 border-b border-border/50">Quick Links</h4>
            <nav className="flex flex-col space-y-2.5">
              <Link href="/" className="text-sm text-muted-foreground hover:text-emerald-500 transition-colors inline-flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/70 mr-2 opacity-0 transform -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"></span>
                Home
              </Link>
              <Link href="/about" className="text-sm text-muted-foreground hover:text-emerald-500 transition-colors inline-flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/70 mr-2 opacity-0 transform -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"></span>
                About
              </Link>
              <Link href="/register" className="text-sm text-muted-foreground hover:text-emerald-500 transition-colors inline-flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/70 mr-2 opacity-0 transform -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"></span>
                Register
              </Link>
              <Link href="/submit" className="text-sm text-muted-foreground hover:text-emerald-500 transition-colors inline-flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/70 mr-2 opacity-0 transform -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"></span>
                Submit Abstract
              </Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-emerald-500 transition-colors inline-flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/70 mr-2 opacity-0 transform -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"></span>
                Contact
              </Link>
            </nav>
          </div>

          {/* Third Column - Organizing by */}
          <div>
            <h4 className="font-medium mb-4 text-base pb-1 border-b border-border/50">Organizing by</h4>
            <nav className="flex flex-col space-y-2.5">
              <a href="#" className="text-sm text-muted-foreground hover:text-emerald-500 transition-colors group inline-flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/70 mr-2 opacity-0 transform -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"></span>
                UNIVERSITY OF CALICUT
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-emerald-500 transition-colors group inline-flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/70 mr-2 opacity-0 transform -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"></span>
                SA'ADA STUDENTS' UNION
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-emerald-500 transition-colors group inline-flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/70 mr-2 opacity-0 transform -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"></span>
                AKODE ISLAMIC CENTRE
              </a>
            </nav>
          </div>

          {/* Fourth Column - Our Partners */}
          <div>
            <h4 className="font-medium mb-4 text-base pb-1 border-b border-border/50">Our Partners</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="aspect-square bg-white dark:bg-gray-800 rounded-full border-2 border-emerald-500/30 overflow-hidden flex items-center justify-center shadow-sm hover:shadow-md hover:border-emerald-500/70 transition-all duration-300 max-w-[80px] sm:max-w-full">
                <img 
                  src="/images/logo round.png" 
                  alt="Akode Islamic Centre" 
                  className="w-full h-full object-contain p-2"
                  loading="lazy"
                />
              </div>
              {/* <div className="aspect-square bg-white dark:bg-white rounded-full border-2 border-emerald-500/30 overflow-hidden flex items-center justify-center shadow-sm hover:shadow-md hover:border-emerald-500/70 transition-all duration-300 max-w-[80px] sm:max-w-full">
                <img 
                  src="/images/university-logo.png" 
                  alt="University of Calicut" 
                  className="w-full h-full object-contain p-2"
                  loading="lazy"
                />
              </div> */}
              <div className="aspect-square bg-white dark:bg-gray-800 rounded-full border-2 border-emerald-500/30 overflow-hidden flex items-center justify-center shadow-sm hover:shadow-md hover:border-emerald-500/70 transition-all duration-300 max-w-[80px] sm:max-w-full">
                <img 
                  src="/images/union-logo.jpg" 
                  alt="Sa'da Students Union - Islamic Da'wa Academy" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contact Bar */}
        <div className="mt-12 py-5 px-6 bg-background rounded-lg border border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            <span className="text-sm">+91 70345 46331</span>
          </div>
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
              <rect width="20" height="16" x="2" y="4" rx="2"></rect>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
            </svg>
            <span className="text-sm">quraniclearningfestival@gmail.com</span>
          </div>
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span className="text-sm">Akode Islamic Centre, Vazhakkad, Kerala</span>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="border-t border-border mt-8 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} Akode Islamic Centre. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-emerald-500 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-emerald-500 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-emerald-500 transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  )
}