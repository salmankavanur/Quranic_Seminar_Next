import { Button } from "@/components/ui/button"
import { getCollection } from "@/lib/db"
import { Download } from "lucide-react"
import { SubmissionsClient } from "./submissions-client"

// This function runs on the server
async function getSubmissions() {
  try {
    const abstractsCollection = await getCollection("abstracts")
    const papersCollection = await getCollection("papers")

    // Get abstracts with author information
    const abstracts = await abstractsCollection
      .aggregate([
        {
          $lookup: {
            from: "registrations",
            localField: "registration_id",
            foreignField: "_id",
            as: "registration",
          },
        },
        { $unwind: "$registration" },
        {
          $project: {
            _id: 1,
            title: 1,
            sub_theme: 1,
            keywords: 1,
            content: 1,
            status: 1,
            file_path: 1,
            created_at: 1,
            first_name: "$registration.first_name",
            last_name: "$registration.last_name",
            email: "$registration.email",
          },
        },
        { $sort: { created_at: -1 } },
      ])
      .toArray()

    // Get papers with author information
    const papers = await papersCollection
      .aggregate([
        {
          $lookup: {
            from: "registrations",
            localField: "registration_id",
            foreignField: "_id",
            as: "registration",
          },
        },
        { $unwind: "$registration" },
        {
          $project: {
            _id: 1,
            title: 1,
            content: 1,
            file_path: 1,
            status: 1,
            created_at: 1,
            first_name: "$registration.first_name",
            last_name: "$registration.last_name",
            email: "$registration.email",
          },
        },
        { $sort: { created_at: -1 } },
      ])
      .toArray()

    // Convert MongoDB objects to plain objects for serialization
    const serializedAbstracts = abstracts.map((abstract) => ({
      ...abstract,
      _id: abstract._id.toString(),
      registration_id: abstract.registration_id ? abstract.registration_id.toString() : null,
      created_at: abstract.created_at.toISOString(),
    }))

    const serializedPapers = papers.map((paper) => ({
      ...paper,
      _id: paper._id.toString(),
      abstract_id: paper.abstract_id ? paper.abstract_id.toString() : null,
      registration_id: paper.registration_id ? paper.registration_id.toString() : null,
      created_at: paper.created_at.toISOString(),
    }))

    return {
      abstracts: serializedAbstracts,
      papers: serializedPapers,
    }
  } catch (error) {
    console.error("Error fetching submissions:", error)
    return { abstracts: [], papers: [] }
  }
}

export default async function SubmissionsPage() {
  const { abstracts, papers } = await getSubmissions()

  // Count abstracts by status
  const abstractCounts = {
    all: abstracts.length,
    pending: abstracts.filter((a) => a.status === "pending").length,
    accepted: abstracts.filter((a) => a.status === "accepted").length,
    rejected: abstracts.filter((a) => a.status === "rejected").length,
  }

  // Count papers by status
  const paperCounts = {
    all: papers.length,
    pending: papers.filter((p) => p.status === "pending").length,
    accepted: papers.filter((p) => p.status === "accepted").length,
    rejected: papers.filter((p) => p.status === "rejected").length,
    qualified: papers.filter((p) => p.status === "qualified").length,
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Submissions</h1>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      {/* Pass the data to the client component */}
      <SubmissionsClient
        abstracts={abstracts}
        papers={papers}
        abstractCounts={abstractCounts}
        paperCounts={paperCounts}
      />
    </div>
  )
}

