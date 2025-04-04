import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getCollection } from "@/lib/db"
import { AdminCheck } from "./admin-check"
import { getServerSession } from "@/lib/server-auth"
import { redirect } from "next/navigation"

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

export default async function AdminDashboard() {
  // Check authentication on the server
  const user = await getServerSession()

  if (!user || user.role !== "admin") {
    redirect("/admin/login")
  }

  const stats = await getDashboardStats()

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Add the AdminCheck component for debugging */}
      <div className="mb-8">
        <AdminCheck />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-4xl">{stats.registrationsCount}</CardTitle>
            <CardDescription>Total Registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Attendees registered for the seminar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-4xl">{stats.abstractsCount}</CardTitle>
            <CardDescription>Abstract Submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Research abstracts submitted</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-4xl">{stats.messagesCount}</CardTitle>
            <CardDescription>Messages</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Contact form messages received</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-4xl">{stats.daysRemaining}</CardTitle>
            <CardDescription>Days Remaining</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Until the seminar date</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Registrations</CardTitle>
            <CardDescription>Latest participants who registered for the seminar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-4 text-sm font-medium">
                <div>Name</div>
                <div>Email</div>
                <div>Type</div>
                <div>Date</div>
              </div>

              {stats.recentRegistrations.length > 0 ? (
                stats.recentRegistrations.map((reg: any) => (
                  <div key={reg._id.toString()} className="grid grid-cols-4 text-sm">
                    <div>
                      {reg.first_name} {reg.last_name}
                    </div>
                    <div className="text-muted-foreground truncate">{reg.email}</div>
                    <div>{reg.participant_type}</div>
                    <div>{new Date(reg.created_at).toLocaleDateString()}</div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">No registrations yet</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Submission Status</CardTitle>
            <CardDescription>Overview of abstract and paper submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-2">Abstract Submissions</h3>
                <div className="text-sm mb-1">
                  {stats.abstractStats.accepted} of {stats.abstractsCount} Accepted
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="flex h-full">
                    <div
                      className="bg-green-500"
                      style={{
                        width: `${stats.abstractsCount > 0 ? (stats.abstractStats.accepted / stats.abstractsCount) * 100 : 0}%`,
                      }}
                    />
                    <div
                      className="bg-yellow-500"
                      style={{
                        width: `${stats.abstractsCount > 0 ? (stats.abstractStats.pending / stats.abstractsCount) * 100 : 0}%`,
                      }}
                    />
                    <div
                      className="bg-red-500"
                      style={{
                        width: `${stats.abstractsCount > 0 ? (stats.abstractStats.rejected / stats.abstractsCount) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="flex text-xs mt-2 justify-between">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
                    <span>{stats.abstractStats.accepted} Accepted</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1" />
                    <span>{stats.abstractStats.pending} Pending</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-1" />
                    <span>{stats.abstractStats.rejected} Rejected</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Full Paper Submissions</h3>
                <div className="text-sm mb-1">
                  {stats.paperStats.accepted} of{" "}
                  {stats.paperStats.accepted + stats.paperStats.pending + stats.paperStats.rejected} Accepted
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="flex h-full">
                    <div
                      className="bg-green-500"
                      style={{
                        width: `${
                          (stats.paperStats.accepted + stats.paperStats.pending + stats.paperStats.rejected) > 0
                            ? (
                                stats.paperStats.accepted /
                                  (stats.paperStats.accepted + stats.paperStats.pending + stats.paperStats.rejected)
                              ) * 100
                            : 0
                        }%`,
                      }}
                    />
                    <div
                      className="bg-yellow-500"
                      style={{
                        width: `${
                          (stats.paperStats.accepted + stats.paperStats.pending + stats.paperStats.rejected) > 0
                            ? (
                                stats.paperStats.pending /
                                  (stats.paperStats.accepted + stats.paperStats.pending + stats.paperStats.rejected)
                              ) * 100
                            : 0
                        }%`,
                      }}
                    />
                    <div
                      className="bg-red-500"
                      style={{
                        width: `${
                          (stats.paperStats.accepted + stats.paperStats.pending + stats.paperStats.rejected) > 0
                            ? (
                                stats.paperStats.rejected /
                                  (stats.paperStats.accepted + stats.paperStats.pending + stats.paperStats.rejected)
                              ) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
                <div className="flex text-xs mt-2 justify-between">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
                    <span>{stats.paperStats.accepted} Accepted</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1" />
                    <span>{stats.paperStats.pending} Pending</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-1" />
                    <span>{stats.paperStats.rejected} Rejected</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

