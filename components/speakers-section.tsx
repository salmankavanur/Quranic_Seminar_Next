import Image from "next/image"

interface SpeakerCardProps {
  name: string
  role: string
  designation: string
  imagePath: string
}

function SpeakerCard({ name, role, designation, imagePath }: SpeakerCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-lg bg-background p-4 transition-all hover:shadow-lg border border-border">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-seminar-gold">
          <Image
            src={imagePath}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground">{name}</h3>
          <div className="space-y-1">
            <p className="text-sm font-medium text-seminar-gold">{role}</p>
            <p className="text-sm text-muted-foreground">{designation}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function SpeakersSection() {
  const speakers = [
    {
      name: "Suhail Hidaya Hudawi",
      role: "Moderator",
      designation: "Dean, Kulliyyah of Qur'an & Sunnah",
      imagePath: "/images/Suhail Hidaya Hudawi.jpeg"
    },
    {
      name: "Shuhaibul Haitami",
      role: "Panelist",
      designation: "Professor, Nandhi Darussalam",
      imagePath: "/images/shuhaibul haithami.jpeg"
    },
    {
      name: "Dr. Abdul Qayoom",
      role: "Panelist",
      designation: "Ass. Professor, PTM Govt College Perinthalmanna",
      imagePath: "/images/Dr. Abdul Qayoom.jpeg"
    },
    {
      name: "Salam Faisy Olavattur",
      role: "Panelist",
      designation: "Iritaq, Academic Senate Member",
      imagePath: "/images/Salam Faisy Olavattur .jpeg"
    }
  ]

  return (
    <section className="py-12 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Speakers & Panelists</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Distinguished scholars and experts leading our discussions on numerical inimitability in the Holy Quran
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {speakers.map((speaker) => (
            <SpeakerCard
              key={speaker.name}
              name={speaker.name}
              role={speaker.role}
              designation={speaker.designation}
              imagePath={speaker.imagePath}
            />
          ))}
        </div>
      </div>
    </section>
  )
} 