'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { getCollection } from "@/lib/db"
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
  ArrowUpRight,
  LayoutDashboard,
  RefreshCw,
  Bell,
  Settings,
  Zap
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Suspense, useEffect, useState } from "react"

// Status indicator component
function StatusIndicator({ status }: { status: string }) {
  switch(status.toLowerCase()) {
    case 'accepted':
    case 'confirmed':
      return (
        <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200 dark:border-green-900/50 whitespace-nowrap">
          <CheckCircle className="w-3 h-3 mr-1" />
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      )
    case 'pending':
      return (
        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-200 dark:border-yellow-900/50 whitespace-nowrap">
          <Clock3 className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      )
    default:
      return (
        <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-200 dark:border-red-900/50 whitespace-nowrap">
          <XCircle className="w-3 h-3 mr-1" />
          Rejected
        </Badge>
      )
  }
}

// Dashboard loading skeleton
function DashboardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-12 w-64 bg-muted/50 rounded-md mb-4"></div>
      <div className="h-6 w-96 bg-muted/30 rounded-md mb-8"></div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-36 bg-muted/30 rounded-xl"></div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="md:col-span-2 h-80 bg-muted/30 rounded-xl"></div>
        <div className="h-80 bg-muted/30 rounded-xl"></div>
      </div>
    </div>
  )
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  created_at?: string;
}

interface DashboardStats {
  registrationsCount: number;
  abstractsCount: number;
  messagesCount: number;
  unreadMessagesCount: number;
  daysRemaining: number;
  recentRegistrations: any[];
  abstractStats: {
    accepted: number;
    pending: number;
    rejected: number;
  };
  paperStats: {
    accepted: number;
    pending: number;
    rejected: number;
  };
  registrationsToday: number;
  seminarDate: string;
}

export default function AdminDashboardContent({ user }: { user: User }) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/admin/dashboard-stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading || !stats) {
    return <DashboardSkeleton />;
  }

  const totalPapers = stats.paperStats.accepted + stats.paperStats.pending + stats.paperStats.rejected;
  const seminarDate = new Date(stats.seminarDate);

  return (
    <div className="container py-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-md">
              <LayoutDashboard className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          </div>
          <p className="text-muted-foreground">
            Welcome back, <span className="font-medium text-foreground">{user.email?.split('@')[0] || 'Admin'}</span>. Here's what's happening with your seminar.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <div className="px-3 py-1.5 bg-background rounded-md border border-border flex items-center gap-2">
            <Calendar className="h-4 w-4 text-emerald-500" />
            <span>Seminar Date: </span>
            <span className="font-medium">{seminarDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
          <div className={`px-3 py-1.5 rounded-md flex items-center gap-2 ${
            stats.daysRemaining <= 7 
              ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300" 
              : stats.daysRemaining <= 30 
                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
          }`}>
            <Clock className="h-4 w-4" />
            <span className="font-medium">{stats.daysRemaining} days left</span>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <Card className="border-border/60 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 bg-gradient-to-r from-emerald-500/10 to-transparent">
            <CardTitle className="text-2xl font-bold flex gap-4 items-start">
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

        <Card className="border-border/60 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 bg-gradient-to-r from-blue-500/10 to-transparent">
            <CardTitle className="text-2xl font-bold flex gap-4 items-start">
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
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              {stats.abstractStats.accepted} accepted
            </div>
          </CardFooter>
        </Card>

        <Card className="border-border/60 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 bg-gradient-to-r from-purple-500/10 to-transparent">
            <CardTitle className="text-2xl font-bold flex gap-4 items-start">
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

        <Card className="border-border/60 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 bg-gradient-to-r from-amber-500/10 to-transparent">
            <CardTitle className="text-2xl font-bold flex gap-4 items-start">
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
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              {stats.paperStats.accepted} accepted
            </div>
          </CardFooter>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Recent Registrations */}
        <Card className="border-border/60 lg:col-span-2 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
          <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0 bg-gradient-to-r from-gray-50/50 to-transparent dark:from-gray-900/20">
            <div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <CardTitle className="text-xl">Recent Registrations</CardTitle>
              </div>
              <CardDescription>Latest registrations for the seminar</CardDescription>
            </div>
            <Link href="/admin/registrations">
              <Button variant="outline" size="sm" className="gap-1 text-xs h-8 border-border/60">
                <span>View All</span>
                <ChevronRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted/50 text-xs font-medium">
                      <th className="text-left p-3 pl-6 w-3/12">Name</th>
                      <th className="text-left p-3 w-5/12">Email</th>
                      <th className="text-left p-3 w-2/12">Status</th>
                      <th className="text-left p-3 pr-6 w-2/12">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {stats.recentRegistrations.length > 0 ? (
                      stats.recentRegistrations.map((reg: any) => (
                        <tr key={reg._id.toString()} className="hover:bg-muted/30 transition-colors">
                          <td className="p-3 pl-6 font-medium">
                            {reg.first_name} {reg.last_name}
                          </td>
                          <td className="p-3 text-muted-foreground max-w-[200px] truncate">
                            {reg.email}
                          </td>
                          <td className="p-3">
                            <StatusIndicator status={reg.status || 'pending'} />
                          </td>
                          <td className="p-3 pr-6 text-xs text-muted-foreground">
                            {new Date(reg.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="text-center py-6 text-muted-foreground">
                          No registrations yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
          <CardFooter className="text-xs text-muted-foreground border-t py-3 px-6 bg-muted/20">
            <div className="flex justify-between w-full items-center">
              <span>Showing {stats.recentRegistrations.length} of {stats.registrationsCount} total registrations</span>
              <span className="text-xs text-muted-foreground/70">Last updated: {new Date().toLocaleTimeString()}</span>
            </div>
          </CardFooter>
        </Card>

        {/* Submission Status */}
        <Card className="border-border/60 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
          <CardHeader className="pb-3 bg-gradient-to-r from-gray-50/50 to-transparent dark:from-gray-900/20">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <CardTitle className="text-xl">Submission Status</CardTitle>
            </div>
            <CardDescription>Abstract and paper submissions</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
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
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Zap className="h-4 w-4 text-amber-500" />
        Quick Actions
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/admin/registrations" className="block">
          <Card className="border-border/60 hover:border-emerald-200 dark:hover:border-emerald-800 transition-all cursor-pointer group h-full shadow-sm hover:shadow-md">
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
        
        <Link href="/admin/submissions" className="block">
          <Card className="border-border/60 hover:border-blue-200 dark:hover:border-blue-800 transition-all cursor-pointer group h-full shadow-sm hover:shadow-md">
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
        
        <Link href="/admin/messages" className="block">
          <Card className="border-border/60 hover:border-purple-200 dark:hover:border-purple-800 transition-all cursor-pointer group h-full shadow-sm hover:shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-purple-500 group-hover:text-purple-600 transition-colors" />
                <span>View Messages</span>
                {stats.unreadMessagesCount > 0 && (
                  <Badge className="ml-1 bg-purple-600">
                    {stats.unreadMessagesCount}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <p className="text-xs text-muted-foreground">Read and respond to contact messages</p>
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/admin/settings" className="block">
          <Card className="border-border/60 hover:border-amber-200 dark:hover:border-amber-800 transition-all cursor-pointer group h-full shadow-sm hover:shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="h-5 w-5 text-amber-500 group-hover:text-amber-600 transition-colors" />
                <span>Seminar Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <p className="text-xs text-muted-foreground">Update dates, venue, and seminar details</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* CSS for animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out;
        }
      `}</style>
    </div>
  )
} 