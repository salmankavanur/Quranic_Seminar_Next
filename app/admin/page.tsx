import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getCollection } from "@/lib/db"
import { AdminCheck } from "./admin-check"
import { getServerSession } from "@/lib/server-auth"
import { redirect } from "next/navigation"
import AdminLogin from "./login"

async function getDashboardStats() {
  try {
    const registrationsCollection = await getCollection("registrations")
    const abstractsCollection = await getCollection("abstracts")
    const messagesCollection = await getCollection("messages")
    const papersCollection = await getCollection("papers")
    const settingsCollection = await getCollection("seminar_settings")

    // Get counts
    const registrationsCount = await registrationsCollection.countDocuments()
    const abstractsCount = await abstractsCollection.countDocuments()
    const messagesCount = await messagesCollection.countDocuments()

    // Get seminar date
    const settings = await settingsCollection.findOne({})
    const seminarDate = settings ? new Date(settings.seminar_date) : new Date("2025-04-10")
    const currentDate = new Date()
    const daysRemaining = Math.ceil((seminarDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24))

    // Get recent registrations
    const recentRegistrations = await registrationsCollection.find({}).sort({ created_at: -1 }).limit(4).toArray()

    // Get abstract stats
    const abstractStats = {
      accepted: await abstractsCollection.countDocuments({ status: "accepted" }),
      pending: await abstractsCollection.countDocuments({ status: "pending" }),
      rejected: await abstractsCollection.countDocuments({ status: "rejected" }),
    }

    // Get paper stats
    const paperStats = {
      accepted: await papersCollection.countDocuments({ status: "accepted" }),
      pending: await papersCollection.countDocuments({ status: "pending" }),
      rejected: await papersCollection.countDocuments({ status: "rejected" }),
    }

    return {
      registrationsCount,
      abstractsCount,
      messagesCount,
      daysRemaining,
      recentRegistrations,
      abstractStats,
      paperStats,
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return {
      registrationsCount: 0,
      abstractsCount: 0,
      messagesCount: 0,
      daysRemaining: 0,
      recentRegistrations: [],
      abstractStats: { accepted: 0, pending: 0, rejected: 0 },
      paperStats: { accepted: 0, pending: 0, rejected: 0 },
    }
  }
}

export default function AdminPage() {
  return <AdminLogin />
}

