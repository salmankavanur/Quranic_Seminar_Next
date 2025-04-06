'use client';

import { Button } from "@/components/ui/button"
import { Download, FileDown, RefreshCw, Users, Filter, Search, Loader2 } from "lucide-react"
import { CreateRegistrationDialog } from "./create-registration-dialog"
import { RegistrationsClient } from "./registrations-client"
import { exportToCSV, exportToPDF } from "./export-utils"
import { Registration } from "@/types/registration"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { toast } from "@/components/ui/use-toast"

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState<Registration[]>([]);
  const [counts, setCounts] = useState({
    all: 0,
    pending: 0,
    confirmed: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState<'csv' | 'pdf' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/registrations');
      if (!response.ok) {
        throw new Error('Failed to fetch registrations');
      }
      const data: Registration[] = await response.json();
      setRegistrations(data);
      setFilteredRegistrations(data);
      
      // Update counts
      setCounts({
        all: data.length,
        pending: data.filter((r) => r.status === "pending").length,
        confirmed: data.filter((r) => r.status === "confirmed").length,
        rejected: data.filter((r) => r.status === "rejected").length,
      });

      toast({
        title: "Registrations loaded",
        description: `${data.length} registrations retrieved successfully.`,
      });
    } catch (error) {
      console.error("Error fetching registrations:", error);
      toast({
        title: "Error",
        description: "Failed to load registrations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredRegistrations(registrations);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = registrations.filter(reg => 
        reg.first_name?.toLowerCase().includes(query) || 
        reg.last_name?.toLowerCase().includes(query) || 
        reg.email?.toLowerCase().includes(query) || 
        reg.institution?.toLowerCase().includes(query) ||
        reg.participant_type?.toLowerCase().includes(query)
      );
      setFilteredRegistrations(filtered);
    }
  }, [searchQuery, registrations]);

  const handleExportCSV = async () => {
    setExporting('csv');
    try {
      await exportToCSV(registrations);
      toast({
        title: "Export Successful",
        description: "Registrations data has been exported to CSV.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Could not export to CSV. Please try again.",
        variant: "destructive",
      });
    } finally {
      setExporting(null);
    }
  };

  const handleExportPDF = async () => {
    setExporting('pdf');
    try {
      await exportToPDF(registrations);
      toast({
        title: "Export Successful",
        description: "Registrations data has been exported to PDF.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Could not export to PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="container py-8">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-4 mb-6 sm:flex-row sm:justify-between sm:items-center"
      >
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-md">
            <Users className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Registrations</h1>
            <p className="text-muted-foreground text-sm">
              Manage seminar participant registrations
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <CreateRegistrationDialog />
          
          <Button 
            variant="outline" 
            onClick={fetchRegistrations}
            className="h-10"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          
          <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
            <Button 
              variant="outline" 
              onClick={handleExportCSV}
              className="flex-1 sm:flex-initial justify-center h-10"
              disabled={exporting !== null || loading}
            >
              {exporting === 'csv' ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              <span className="whitespace-nowrap">Export CSV</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={handleExportPDF}
              className="flex-1 sm:flex-initial justify-center h-10"
              disabled={exporting !== null || loading}
            >
              {exporting === 'pdf' ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <FileDown className="h-4 w-4 mr-2" />
              )}
              <span className="whitespace-nowrap">Export PDF</span>
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="bg-background hover:border-emerald-200 dark:hover:border-emerald-800 transition-all">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{counts.all}</p>
              </div>
              <Badge variant="outline" className="text-md px-2 py-1">
                100%
              </Badge>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="bg-yellow-50 dark:bg-yellow-900/10 hover:border-yellow-200 dark:hover:border-yellow-900/50 transition-all">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-700 dark:text-yellow-400">Pending</p>
                <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">{counts.pending}</p>
              </div>
              <Badge className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 border-yellow-300 px-2 py-1">
                {counts.all > 0 ? Math.round((counts.pending / counts.all) * 100) : 0}%
              </Badge>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="bg-emerald-50 dark:bg-emerald-900/10 hover:border-emerald-200 dark:hover:border-emerald-900/50 transition-all">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-700 dark:text-emerald-400">Confirmed</p>
                <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">{counts.confirmed}</p>
              </div>
              <Badge className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 border-emerald-300 px-2 py-1">
                {counts.all > 0 ? Math.round((counts.confirmed / counts.all) * 100) : 0}%
              </Badge>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card className="bg-red-50 dark:bg-red-900/10 hover:border-red-200 dark:hover:border-red-900/50 transition-all">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-red-700 dark:text-red-400">Rejected</p>
                <p className="text-2xl font-bold text-red-700 dark:text-red-400">{counts.rejected}</p>
              </div>
              <Badge className="bg-red-100 hover:bg-red-200 text-red-700 border-red-300 px-2 py-1">
                {counts.all > 0 ? Math.round((counts.rejected / counts.all) * 100) : 0}%
              </Badge>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.5 }}
        className="mb-6 flex items-center gap-2"
      >
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search registrations by name, email, institution..."
            className="pl-9 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-2" onClick={() => setSearchQuery('')}>
          <Filter className="h-4 w-4" />
          <span>Clear</span>
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
      >
        <RegistrationsClient 
          registrations={filteredRegistrations} 
          counts={counts} 
          isLoading={loading}
        />
      </motion.div>
    </div>
  )
}