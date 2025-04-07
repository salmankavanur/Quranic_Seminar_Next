import { getCollection } from "@/lib/db"
import { getServerSession } from "@/lib/server-auth"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const user = await getServerSession()

    if (!user || user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const registrationsCollection = await getCollection("registrations")
    const abstractsCollection = await getCollection("abstracts")
    const messagesCollection = await getCollection("messages")
    const papersCollection = await getCollection("papers")
    const settingsCollection = await getCollection("seminar_settings")

    // Get counts with error handling
    const [
      registrationsCount,
      abstractsCount,
      messagesCount,
      unreadMessagesCount,
      settings,
      recentRegistrations,
      abstractAccepted,
      abstractPending,
      abstractRejected,
      paperAccepted,
      paperPending,
      paperRejected,
    ] = await Promise.all([
      registrationsCollection.countDocuments().catch(() => 0),
      abstractsCollection.countDocuments().catch(() => 0),
      messagesCollection.countDocuments().catch(() => 0),
      messagesCollection.countDocuments({ is_read: false }).catch(() => 0),
      settingsCollection.findOne({}).catch(() => null),
      registrationsCollection.find({}).sort({ created_at: -1 }).limit(5).toArray().catch(() => []),
      abstractsCollection.countDocuments({ status: "accepted" }).catch(() => 0),
      abstractsCollection.countDocuments({ status: "pending" }).catch(() => 0),
      abstractsCollection.countDocuments({ status: "rejected" }).catch(() => 0),
      papersCollection.countDocuments({ status: "accepted" }).catch(() => 0),
      papersCollection.countDocuments({ status: "pending" }).catch(() => 0),
      papersCollection.countDocuments({ status: "rejected" }).catch(() => 0),
    ])

    // Get seminar date
    const seminarDate = settings ? new Date(settings.seminar_date) : new Date("2025-04-10")
    const currentDate = new Date()
    const daysRemaining = Math.max(0, Math.ceil((seminarDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)))

    // Get registration change trend
    const oneDayAgo = new Date(currentDate)
    oneDayAgo.setDate(currentDate.getDate() - 1)
    const registrationsToday = await registrationsCollection.countDocuments({
      created_at: { $gte: oneDayAgo }
    }).catch(() => 0)

    // Structure the abstract and paper stats
    const abstractStats = {
      accepted: abstractAccepted,
      pending: abstractPending,
      rejected: abstractRejected,
    }

    const paperStats = {
      accepted: paperAccepted,
      pending: paperPending,
      rejected: paperRejected,
    }

    return NextResponse.json({
      registrationsCount,
      abstractsCount,
      messagesCount,
      unreadMessagesCount,
      daysRemaining,
      recentRegistrations,
      abstractStats,
      paperStats,
      registrationsToday,
      seminarDate
    })
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json({
      registrationsCount: 0,
      abstractsCount: 0,
      messagesCount: 0,
      unreadMessagesCount: 0,
      daysRemaining: 0,
      recentRegistrations: [],
      abstractStats: { accepted: 0, pending: 0, rejected: 0 },
      paperStats: { accepted: 0, pending: 0, rejected: 0 },
      registrationsToday: 0,
      seminarDate: new Date("2025-04-10")
    })
  }
} 