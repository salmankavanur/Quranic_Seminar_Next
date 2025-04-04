import { PublicNav } from "@/components/public-nav"
import { Footer } from "@/components/footer"
import { SpeakersSection } from "@/components/speakers-section"
import { CountdownSection } from "@/components/countdown-section"
import { AboutSection } from "@/components/about-section"
import { ImportantDates } from "@/components/important-dates"
import { AnimatedHeroSection } from "@/components/animated-hero-section"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <PublicNav />
      
      {/* Enhanced Hero Section with animations */}
      <AnimatedHeroSection />

      {/* Countdown Section */}
      <CountdownSection />

      {/* About Section */}
      <AboutSection />

      {/* Speakers Section */}
      <SpeakersSection />

      {/* Important Dates Section */}
      <ImportantDates />

      <Footer />
    </main>
  )
}