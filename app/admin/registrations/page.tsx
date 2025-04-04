import { Button } from "@/components/ui/button"
import { getCollection } from "@/lib/db"
import { Download } from "lucide-react"
import { CreateRegistrationDialog } from "./create-registration-dialog"
import { RegistrationsClient } from "./registrations-client"

async function getRegistrations() {
  try {
    const registrationsCollection = await getCollection("registrations")
    const registrations = await registrationsCollection.find({}).sort({ created_at: -1 }).toArray()

    // Convert MongoDB objects to plain objects for serialization
    return registrations.map((reg) => ({
      ...reg,
      _id: reg._id.toString(),
      created_at: reg.created_at.toISOString(),
      updated_at: reg.updated_at ? reg.updated_at.toISOString() : null,
    }))
  } catch (error) {
    console.error("Error fetching registrations:", error)
    return []
  }
}

export default async function RegistrationsPage() {
  const registrations = await getRegistrations()

  // Count registrations by status
  const counts = {
    all: registrations.length,
    pending: registrations.filter((r) => r.status === "pending").length,
    confirmed: registrations.filter((r) => r.status === "confirmed").length,
    rejected: registrations.filter((r) => r.status === "rejected").length,
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Registrations</h1>
        <div className="flex gap-2">
          <CreateRegistrationDialog />
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      <RegistrationsClient registrations={registrations} counts={counts} />
    </div>
  )
}

