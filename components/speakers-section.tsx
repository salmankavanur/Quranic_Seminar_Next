"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"

interface SpeakerCardProps {
  name: string
  role: string
  designation: string
  imagePath: string
  description?: string
  index: number
}

function SpeakerCard({ name, role, designation, imagePath, description, index }: SpeakerCardProps) {
  return (
    <motion.div 
      className="group relative overflow-hidden rounded-xl bg-background shadow-sm hover:shadow-md transition-all duration-300 border border-border"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="p-6 flex flex-col items-center text-center relative z-10">
        <div className="relative w-36 h-36 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-emerald-500/20 mb-6 shadow-md">
          <Image
            src={imagePath}
            alt={name}
            fill
            sizes="(max-width: 768px) 144px, 160px"
            priority={index < 2}
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        
        <motion.div 
          className="space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 + (0.1 * index) }}
        >
          <h3 className="text-xl font-bold text-foreground">{name}</h3>
          <div className="space-y-1">
            <div className="inline-block px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-medium">
              {role}
            </div>
            <p className="text-sm text-muted-foreground pt-1">{designation}</p>
          </div>
          
          {description && (
            <div className="overflow-hidden transition-all duration-500 ease-in-out max-h-0 group-hover:max-h-24 opacity-0 group-hover:opacity-100">
              <p className="text-sm text-muted-foreground pt-3">
                {description}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}

export function SpeakersSection() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const speakers = [
    {
      name: "Suhail Hidaya Hudawi",
      role: "Moderator",
      designation: "Dean, Kulliyyah of Qur'an & Sunnah",
      imagePath: "/images/Suhail Hidaya Hudawi.jpeg",
      description: "Suhail Hidaya Hudawi is a distinguished scholar specializing in Quranic studies with extensive experience in Islamic education and research."
    },
    {
      name: "Shuhaibul Haitami",
      role: "Panelist",
      designation: "Professor, Nandhi Darussalam",
      imagePath: "/images/shuhaibul haithami.jpeg",
      description: "A respected academic with significant contributions to Islamic scholarship and research."
    },
    {
      name: "Dr. Abdul Qayoom",
      role: "Panelist",
      designation: "Ass. Professor, PTM Govt College Perinthalmanna",
      imagePath: "/images/Dr. Abdul Qayoom.jpeg",
      description: "Accomplished researcher with expertise in comparative religious studies and Quranic analysis."
    },
    {
      name: "Salam Faisy Olavattur",
      role: "Panelist",
      designation: "Iritaq, Academic Senate Member",
      imagePath: "/images/Salam Faisy Olavattur .jpeg",
      description: "Renowned scholar with a focus on numerical patterns and mathematical symmetry in Islamic texts."
    }
  ]

  if (!mounted) {
    // SSR-friendly version
    return (
      <section className="py-16 bg-gradient-to-b from-muted/30 to-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Speakers & Panelists</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Distinguished scholars and experts leading our discussions on numerical inimitability in the Holy Quran
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {speakers.map((_, i) => (
              <div key={i} className="rounded-xl bg-background h-64 shadow-sm border border-border"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-emerald-500/5 blur-2xl" 
          animate={{ 
            scale: [1, 1.05, 1],
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </div>
      
      <div className="container relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "80px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-1 bg-emerald-500 mx-auto mb-8 rounded-full"
          ></motion.div>
          
          <h2 className="text-3xl font-bold mb-4">Speakers & Panelists</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Distinguished scholars and experts leading our discussions on numerical inimitability in the Holy Quran
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {speakers.map((speaker, index) => (
            <SpeakerCard
              key={speaker.name}
              name={speaker.name}
              role={speaker.role}
              designation={speaker.designation}
              imagePath={speaker.imagePath}
              description={speaker.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  )
}