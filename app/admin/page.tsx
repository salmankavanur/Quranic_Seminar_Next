import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { getCollection } from "@/lib/db"
import { AdminCheck } from "./admin-check"
import { getServerSession } from "@/lib/server-auth"
import { redirect } from "next/navigation"
import { Metadata } from "next"
import { 
  Calendar, 
  Users, 
  FileText, 
  MessageSquare, 
  Clock, 
  ChevronRight,
  CheckCircle,
  Clock3,
  XCircle,
  ExternalLink,
  ArrowUpRight,
  LayoutDashboard
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "Admin Dashboard - Quranic Seminar",
  description: "Admin dashboard for managing the Quranic Seminar registrations, abstracts, and messages",
}

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
    const unreadMessagesCount = await messagesCollection.countDocuments({ is_read: false })

    // Get seminar date
    const settings = await settingsCollection.findOne({})
    const seminarDate = settings ? new Date(settings.seminar_date) : new Date("2025-04-10")
    const currentDate = new Date()
    const daysRemaining = Math.ceil((seminarDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24))

    // Get recent registrations
    const recentRegistrations = await registrationsCollection.find({}).sort({ created_at: -1 }).limit(5).toArray()

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

    // Get registration change trend
    const oneDayAgo = new Date(currentDate)
    oneDayAgo.setDate(currentDate.getDate() - 1)
    const registrationsToday = await registrationsCollection.countDocuments({
      created_at: { $gte: oneDayAgo }
    })

    return {
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
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return {
      registrationsCount: 0,
      abstractsCount: 0,
      messagesCount: 0,
      unreadMessagesCount: 0,
      daysRemaining: 0,
      recentRegistrations: [],
      abstractStats: { accepted: 0, pending: 0, rejected: 0 },
      paperStats: { accepted: 0, pending: 0, rejected: 0 },
      registrationsToday: 0,
      seminarDate: new Date("2025-04-15")
    }
  }
}

function StatusIndicator({ status }: { status: string }) {
  if (status === 'accepted' || status === 'confirmed') {
    return (
      <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200 dark:border-green-900/50">
        <CheckCircle className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  } else if (status === 'pending') {
    return (
      <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-200 dark:border-yellow-900/50">
        <Clock3 className="w-3 h-3 mr-1" />
        Pending
      </Badge>
    )
  } else {
    return (
      <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-200 dark:border-red-900/50">
        <XCircle className="w-3 h-3 mr-1" />
        Rejected
      </Badge>
    )
  }
}

export default async function AdminDashboard() {
  // Check authentication on the server
  const user = await getServerSession()

  if (!user || user.role !== "admin") {
    redirect("/admin/login")
  }

  const stats = await getDashboardStats()
  const totalPapers = stats.paperStats.accepted + stats.paperStats.pending + stats.paperStats.rejected

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6 text-emerald-500" />
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back, {user.email?.split('@')[0] || 'Admin'}. Here's what's happening with your seminar.
          </p>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <div className="px-3 py-1.5 bg-background rounded-md border border-border flex items-center gap-2">
            <Calendar className="h-4 w-4 text-emerald-500" />
            <span>Seminar Date: </span>
            <span className="font-medium">{stats.seminarDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
          <div className="px-3 py-1.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 rounded-md flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="font-medium">{stats.daysRemaining} days left</span>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-border/50 overflow-hidden">
          <CardHeader className="pb-2 bg-gradient-to-r from-emerald-500/10 to-transparent">
            <CardTitle className="text-3xl font-bold flex gap-4 items-start">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-md">
                <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="flex flex-col">
                {stats.registrationsCount}
                <CardDescription className="text-base mt-0.5">Registrations</CardDescription>
              </div>
            </CardTitle>
          </CardHeader>
          <CardFooter className="pt-2 pb-3 flex justify-between text-xs">
            <span className="text-muted-foreground">Registrations</span>
            {stats.registrationsToday > 0 && (
              <Badge variant="outline" className="text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-900/50">
                +{stats.registrationsToday} today
              </Badge>
            )}
          </CardFooter>
        </Card>

        <Card className="border-border/50 overflow-hidden">
          <CardHeader className="pb-2 bg-gradient-to-r from-blue-500/10 to-transparent">
            <CardTitle className="text-3xl font-bold flex gap-4 items-start">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-md">
                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex flex-col">
                {stats.abstractsCount}
                <CardDescription className="text-base mt-0.5">Abstracts</CardDescription>
              </div>
            </CardTitle>
          </CardHeader>
          <CardFooter className="pt-2 pb-3 flex justify-between text-xs">
            <span className="text-muted-foreground">Submissions</span>
            <div className="flex items-center text-muted-foreground gap-1.5">
              <div className="w-2 h-2 bg-green-500 rounded-full" />{stats.abstractStats.accepted} accepted
            </div>
          </CardFooter>
        </Card>

        <Card className="border-border/50 overflow-hidden">
          <CardHeader className="pb-2 bg-gradient-to-r from-purple-500/10 to-transparent">
            <CardTitle className="text-3xl font-bold flex gap-4 items-start">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-md">
                <MessageSquare className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex flex-col">
                {stats.messagesCount}
                <CardDescription className="text-base mt-0.5">Messages</CardDescription>
              </div>
            </CardTitle>
          </CardHeader>
          <CardFooter className="pt-2 pb-3 flex justify-between text-xs">
            <span className="text-muted-foreground">From contact form</span>
            {stats.unreadMessagesCount > 0 && (
              <Badge className="bg-purple-600">
                {stats.unreadMessagesCount} unread
              </Badge>
            )}
          </CardFooter>
        </Card>

        <Card className="border-border/50 overflow-hidden">
          <CardHeader className="pb-2 bg-gradient-to-r from-amber-500/10 to-transparent">
            <CardTitle className="text-3xl font-bold flex gap-4 items-start">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-md">
                <FileText className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex flex-col">
                {totalPapers}
                <CardDescription className="text-base mt-0.5">Papers</CardDescription>
              </div>
            </CardTitle>
          </CardHeader>
          <CardFooter className="pt-2 pb-3 flex justify-between text-xs">
            <span className="text-muted-foreground">Full papers</span>
            <div className="flex items-center text-muted-foreground gap-1.5">
              <div className="w-2 h-2 bg-green-500 rounded-full" />{stats.paperStats.accepted} accepted
            </div>
          </CardFooter>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-3 gap-8 mb-8">
        {/* Recent Registrations */}
        <Card className="border-border/50 md:col-span-3 lg:col-span-2">
          <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-xl">Recent Registrations</CardTitle>
              <CardDescription>Latest registrations for the seminar</CardDescription>
            </div>
            <Link href="/admin/registrations">
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                <span>View All</span>
                <ChevronRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-hidden">
              <div className="grid grid-cols-12 bg-muted/50 text-xs font-medium p-3">
                <div className="col-span-4">Name</div>
                <div className="col-span-4">Email</div>
                <div className="col-span-2">Type</div>
                <div className="col-span-2">Date</div>
              </div>

              <div className="divide-y divide-border">
                {stats.recentRegistrations.length > 0 ? (
                  stats.recentRegistrations.map((reg: any) => (
                    <div key={reg._id.toString()} className="grid grid-cols-12 text-sm p-3 hover:bg-muted/30 transition-colors">
                      <div className="col-span-4 font-medium truncate">
                        {reg.first_name} {reg.last_name}
                      </div>
                      <div className="col-span-4 text-muted-foreground truncate">{reg.email}</div>
                      <div className="col-span-2">
                        <StatusIndicator status={reg.status || 'pending'} />
                      </div>
                      <div className="col-span-2 text-xs text-muted-foreground">
                        {new Date(reg.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-muted-foreground">No registrations yet</div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="text-xs text-muted-foreground border-t pt-3">
            Showing {stats.recentRegistrations.length} of {stats.registrationsCount} total registrations
          </CardFooter>
        </Card>

        {/* Submission Status */}
        <Card className="border-border/50 md:col-span-2 lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">Submission Status</CardTitle>
            <CardDescription>Abstract and paper submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">Abstract Submissions</h3>
                  <Link href="/admin/submissions">
                    <Button variant="ghost" size="sm" className="h-6 gap-1 text-xs">
                      <span>Manage</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
                
                <div className="h-2.5 bg-muted rounded-full overflow-hidden">
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
                <div className="grid grid-cols-3 text-xs gap-1">
                  <div className="flex flex-col items-center p-2 rounded bg-muted/40">
                    <div className="flex items-center gap-1 text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span>Accepted</span>
                    </div>
                    <div className="font-medium mt-1">{stats.abstractStats.accepted}</div>
                  </div>
                  <div className="flex flex-col items-center p-2 rounded bg-muted/40">
                    <div className="flex items-center gap-1 text-yellow-600">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                      <span>Pending</span>
                    </div>
                    <div className="font-medium mt-1">{stats.abstractStats.pending}</div>
                  </div>
                  <div className="flex flex-col items-center p-2 rounded bg-muted/40">
                    <div className="flex items-center gap-1 text-red-600">
                      <div className="w-2 h-2 bg-red-500 rounded-full" />
                      <span>Rejected</span>
                    </div>
                    <div className="font-medium mt-1">{stats.abstractStats.rejected}</div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">Full Paper Submissions</h3>
                  <Link href="/admin/papers">
                    <Button variant="ghost" size="sm" className="h-6 gap-1 text-xs">
                      <span>Manage</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
                
                <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                  <div className="flex h-full">
                    <div
                      className="bg-green-500"
                      style={{
                        width: `${totalPapers > 0 ? (stats.paperStats.accepted / totalPapers) * 100 : 0}%`,
                      }}
                    />
                    <div
                      className="bg-yellow-500"
                      style={{
                        width: `${totalPapers > 0 ? (stats.paperStats.pending / totalPapers) * 100 : 0}%`,
                      }}
                    />
                    <div
                      className="bg-red-500"
                      style={{
                        width: `${totalPapers > 0 ? (stats.paperStats.rejected / totalPapers) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 text-xs gap-1">
                  <div className="flex flex-col items-center p-2 rounded bg-muted/40">
                    <div className="flex items-center gap-1 text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span>Accepted</span>
                    </div>
                    <div className="font-medium mt-1">{stats.paperStats.accepted}</div>
                  </div>
                  <div className="flex flex-col items-center p-2 rounded bg-muted/40">
                    <div className="flex items-center gap-1 text-yellow-600">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                      <span>Pending</span>
                    </div>
                    <div className="font-medium mt-1">{stats.paperStats.pending}</div>
                  </div>
                  <div className="flex flex-col items-center p-2 rounded bg-muted/40">
                    <div className="flex items-center gap-1 text-red-600">
                      <div className="w-2 h-2 bg-red-500 rounded-full" />
                      <span>Rejected</span>
                    </div>
                    <div className="font-medium mt-1">{stats.paperStats.rejected}</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Link href="/admin/registrations">
          <Card className="border-border/50 hover:border-emerald-200 dark:hover:border-emerald-800 transition-colors cursor-pointer group">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-emerald-500 group-hover:text-emerald-600 transition-colors" />
                <span>Manage Registrations</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <p className="text-xs text-muted-foreground">View, approve, and manage participant registrations</p>
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/admin/submissions">
          <Card className="border-border/50 hover:border-blue-200 dark:hover:border-blue-800 transition-colors cursor-pointer group">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-500 group-hover:text-blue-600 transition-colors" />
                <span>Manage Abstracts</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <p className="text-xs text-muted-foreground">Review and process submitted abstracts</p>
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/admin/messages">
          <Card className="border-border/50 hover:border-purple-200 dark:hover:border-purple-800 transition-colors cursor-pointer group">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-purple-500 group-hover:text-purple-600 transition-colors" />
                <span>View Messages</span>
                {stats.unreadMessagesCount > 0 && (
                  <Badge className="ml-1 bg-purple-600">{stats.unreadMessagesCount}</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <p className="text-xs text-muted-foreground">Read and respond to contact messages</p>
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/admin/settings">
          <Card className="border-border/50 hover:border-amber-200 dark:hover:border-amber-800 transition-colors cursor-pointer group">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-amber-500 group-hover:text-amber-600 transition-colors" />
                <span>Seminar Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <p className="text-xs text-muted-foreground">Update dates, venue, and seminar details</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}