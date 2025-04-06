'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, Grid, Text, Title, Metric, Badge, AreaChart } from "@tremor/react";
import { calculateAnalytics, type AnalyticsData } from '@/lib/analytics-utils';
import { Registration } from '@/types/registration';
import { 
  StatusDistributionChart, 
  ParticipantTypeChart, 
  InstitutionChart, 
  RegistrationTrendsChart 
} from '@/components/analytics/RegistrationCharts';
import { 
  RefreshCw, 
  Download, 
  Filter, 
  TrendingUp, 
  Users, 
  Building, 
  PieChart, 
  Calendar,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState('charts');
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/registrations');
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch registrations: ${errorText}`);
      }
      
      const registrations: Registration[] = await response.json();
      
      if (!Array.isArray(registrations)) {
        throw new Error('Invalid response format');
      }
      
      const analyticsData = calculateAnalytics(registrations);
      setAnalytics(analyticsData);
      setLastUpdated(new Date());
      
      toast({
        title: "Analytics Updated",
        description: `Data refreshed with ${registrations.length} registrations`,
      });
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to load analytics data',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleExportData = async () => {
    if (!analytics) return;
    
    try {
      setExporting(true);
      
      const dataStr = JSON.stringify(analytics, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      const exportFileDefaultName = `seminar-analytics-${new Date().toISOString().slice(0, 10)}.json`;
      
      // Create link element, trigger download, and remove
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      document.body.appendChild(linkElement); // Required for Firefox
      linkElement.click();
      document.body.removeChild(linkElement);
      
      toast({
        title: "Export Successful",
        description: "Analytics data has been exported as JSON",
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      
      toast({
        title: "Export Failed",
        description: "Could not export analytics data",
        variant: "destructive",
      });
    } finally {
      setExporting(false);
    }
  };

  // Loading state
  if (loading && !analytics) {
    return (
      <div className="container py-12">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="mx-auto w-12 h-12 text-emerald-500">
              <Loader2 className="h-12 w-12 animate-spin" />
            </div>
            <p className="mt-4 text-muted-foreground">Loading analytics dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !analytics) {
    return (
      <div className="container py-12">
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <div className="text-center mb-4">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Failed to load analytics</h3>
            <p className="text-muted-foreground max-w-md mx-auto">{error}</p>
          </div>
          <Button onClick={fetchData} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Animation variants for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5
      }
    })
  };

  // Ensure analytics exists before rendering
  const data = analytics || {
    totalRegistrations: 0,
    registrationTrend: 0,
    statusDistribution: { pending: 0, confirmed: 0, rejected: 0 }
  };

  // Render main content
  return (
    <div className="container py-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
              <TrendingUp className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          </div>
          
          {lastUpdated && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                Last updated: {lastUpdated.toLocaleTimeString()} {lastUpdated.toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-1.5 h-9"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Updating...</span>
              </>
            ) : (
              <>
                <RefreshCw size={14} />
                <span>Refresh</span>
              </>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExportData}
            disabled={exporting || loading || !analytics}
            className="flex items-center gap-1.5 h-9"
          >
            {exporting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <Download size={14} />
                <span>Export</span>
              </>
            )}
          </Button>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <AnimatePresence>
        {loading && analytics ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-3 w-32" />
              </div>
            ))}
          </div>
        ) : (
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="mb-8"
          >
            <Grid numItems={1} numItemsSm={2} numItemsLg={4} className="gap-4">
              <motion.div custom={0} variants={itemVariants}>
                <Card decoration="top" decorationColor="emerald">
                  <div className="flex justify-between items-start">
                    <div>
                      <Text>Total Registrations</Text>
                      <Metric>{data.totalRegistrations}</Metric>
                    </div>
                    <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500">
                      <Users size={20} />
                    </div>
                  </div>
                  <Text className="mt-2 text-xs">
                    <span className={data.registrationTrend > 0 ? "text-emerald-500" : data.registrationTrend < 0 ? "text-red-500" : ""}>
                      {data.registrationTrend > 0 ? '↑' : data.registrationTrend < 0 ? '↓' : '→'} 
                      {Math.abs(data.registrationTrend)}% 
                    </span> from last week
                  </Text>
                </Card>
              </motion.div>

              <motion.div custom={1} variants={itemVariants}>
                <Card decoration="top" decorationColor="yellow">
                  <div className="flex justify-between items-start">
                    <div>
                      <Text>Pending</Text>
                      <Metric>{data.statusDistribution.pending}</Metric>
                    </div>
                    <Badge color="yellow" size="sm">
                      {data.totalRegistrations > 0 ? ((data.statusDistribution.pending / data.totalRegistrations) * 100).toFixed(1) : '0.0'}%
                    </Badge>
                  </div>
                </Card>
              </motion.div>

              <motion.div custom={2} variants={itemVariants}>
                <Card decoration="top" decorationColor="emerald">
                  <div className="flex justify-between items-start">
                    <div>
                      <Text>Confirmed</Text>
                      <Metric>{data.statusDistribution.confirmed}</Metric>
                    </div>
                    <Badge color="emerald" size="sm">
                      {data.totalRegistrations > 0 ? ((data.statusDistribution.confirmed / data.totalRegistrations) * 100).toFixed(1) : '0.0'}%
                    </Badge>
                  </div>
                </Card>
              </motion.div>

              <motion.div custom={3} variants={itemVariants}>
                <Card decoration="top" decorationColor="red">
                  <div className="flex justify-between items-start">
                    <div>
                      <Text>Rejected</Text>
                      <Metric>{data.statusDistribution.rejected}</Metric>
                    </div>
                    <Badge color="red" size="sm">
                      {data.totalRegistrations > 0 ? ((data.statusDistribution.rejected / data.totalRegistrations) * 100).toFixed(1) : '0.0'}%
                    </Badge>
                  </div>
                </Card>
              </motion.div>
            </Grid>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chart Tabs */}
      <motion.div 
        className="mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <Tabs 
          defaultValue="charts" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="w-full mb-6" variant="underline">
            <TabsTrigger value="charts" variant="underline" className="flex items-center gap-2">
              <PieChart size={16} />
              <span>Charts</span>
            </TabsTrigger>
            <TabsTrigger value="trends" variant="underline" className="flex items-center gap-2">
              <TrendingUp size={16} />
              <span>Trends</span>
            </TabsTrigger>
            <TabsTrigger value="breakdown" variant="underline" className="flex items-center gap-2">
              <Building size={16} />
              <span>Breakdown</span>
            </TabsTrigger>
          </TabsList>
          
          <AnimatePresence mode="wait">
            {loading && analytics ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="h-64 w-full" />
                </div>
              </motion.div>
            ) : (
              <>
                <motion.div
                  key="charts-tab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: activeTab === 'charts' ? 1 : 0 }}
                  exit={{ opacity: 0 }}
                  className={`space-y-6 ${activeTab !== 'charts' ? 'hidden' : ''}`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <StatusDistributionChart analytics={data} />
                    <ParticipantTypeChart analytics={data} />
                  </div>
                </motion.div>
                
                <motion.div
                  key="trends-tab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: activeTab === 'trends' ? 1 : 0 }}
                  exit={{ opacity: 0 }}
                  className={`space-y-6 ${activeTab !== 'trends' ? 'hidden' : ''}`}
                >
                  <RegistrationTrendsChart analytics={data} />
                </motion.div>
                
                <motion.div
                  key="breakdown-tab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: activeTab === 'breakdown' ? 1 : 0 }}
                  exit={{ opacity: 0 }}
                  className={`space-y-6 ${activeTab !== 'breakdown' ? 'hidden' : ''}`}
                >
                  <InstitutionChart analytics={data} />
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </Tabs>
      </motion.div>
    </div>
  );
}