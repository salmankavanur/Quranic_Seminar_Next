"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { PublicNav } from "@/components/public-nav"
import { Footer } from "@/components/footer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SubmissionGuidelines } from "./submission-guidelines"
import { SubmitAbstractForm } from "./submit-abstract-form"
import { SubmitPaperForm } from "./submit-paper-form"

export default function SubmitPage() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("guidelines")

  useEffect(() => {
    // Check if there's a tab parameter in the URL
    const tabParam = searchParams.get("tab")
    if (tabParam && ["guidelines", "abstract", "paper"].includes(tabParam)) {
      setActiveTab(tabParam)
    }
  }, [searchParams])

  return (
    <main className="min-h-screen flex flex-col">
      <PublicNav />

      <section className="py-8 md:py-12 px-4">
        <div className="container mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4">Submit Your Research</h1>
          <p className="text-center text-muted-foreground mb-8 md:mb-12 text-base sm:text-lg">
            Contribute to the academic discourse on numerical inimitability in the Holy Quran.
          </p>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3">
              <TabsTrigger value="guidelines" className="text-sm sm:text-base">Submission Guidelines</TabsTrigger>
              <TabsTrigger value="abstract" className="text-sm sm:text-base">Submit Abstract</TabsTrigger>
              <TabsTrigger value="paper" className="text-sm sm:text-base">Submit Full Paper</TabsTrigger>
            </TabsList>

            <TabsContent value="guidelines" className="mt-6">
              <SubmissionGuidelines />
            </TabsContent>

            <TabsContent value="abstract" className="mt-6">
              <SubmitAbstractForm />
            </TabsContent>

            <TabsContent value="paper" className="mt-6">
              <SubmitPaperForm />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </main>
  )
}

