'use client';

import { useEffect, useState } from 'react';
import { Card, Grid, Text, Title, Metric, Badge } from "@tremor/react";
import { calculateAnalytics, type AnalyticsData } from '@/lib/analytics-utils';
import { Registration } from '@/types/registration';
import { 
  StatusDistributionChart, 
  ParticipantTypeChart, 
  InstitutionChart, 
  RegistrationTrendsChart 
} from '@/components/analytics/RegistrationCharts';
import { RefreshCw, Download, Filter, TrendingUp, Users, Building, PieChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { motion } from 'framer-motion';

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [activeView, setActiveView] = useState('all');

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/registrations');
      if (!response.ok) {
        throw new Error('Failed to fetch registrations');
      }
      const registrations: Registration[] = await response.json();
      const analyticsData = calculateAnalytics(registrations);
      setAnalytics(analyticsData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleExportData = () => {
    if (!analytics) return;
    
    const dataStr = JSON.stringify(analytics, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `seminar-analytics-${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  if (loading && !analytics) {
    return (
      <div className="container py-12">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="mx-auto w-12 h-12 text-emerald-500"
            >
              <RefreshCw size={48} />
            </motion.div>
            <p className="mt-4 text-muted-foreground">Loading analytics dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="container py-12">
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <div className="text-center text-muted-foreground mb-4">
            Failed to load analytics data
          </div>
          <Button onClick={fetchData}>Try Again</Button>
        </div>
      </div>
    );
  }

  const fadeInVariants = {
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

  return (
    <div className="container py-8">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          {lastUpdated && (
            <p className="text-sm text-muted-foreground mt-1">
              Last updated: {lastUpdated.toLocaleTimeString()} {lastUpdated.toLocaleDateString()}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchData}
            className="flex items-center gap-1"
          >
            <RefreshCw size={14} />
            <span>Refresh</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExportData}
            className="flex items-center gap-1"
          >
            <Download size={14} />
            <span>Export</span>
          </Button>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
      >
        <Grid numItems={1} numItemsSm={2} numItemsLg={4} className="gap-4">
          <motion.div custom={0} variants={fadeInVariants}>
            <Card decoration="top" decorationColor="emerald">
              <div className="flex justify-between items-start">
                <div>
                  <Text>Total Registrations</Text>
                  <Metric>{analytics.totalRegistrations}</Metric>
                </div>
                <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500">
                  <Users size={20} />
                </div>
              </div>
              <Text className="mt-2 text-xs">
                <span className={analytics.registrationTrend > 0 ? "text-emerald-500" : analytics.registrationTrend < 0 ? "text-red-500" : ""}>
                  {analytics.registrationTrend > 0 ? '↑' : analytics.registrationTrend < 0 ? '↓' : '→'} 
                  {Math.abs(analytics.registrationTrend)}% 
                </span> from last week
              </Text>
            </Card>
          </motion.div>

          <motion.div custom={1} variants={fadeInVariants}>
            <Card decoration="top" decorationColor="yellow">
              <div className="flex justify-between items-start">
                <div>
                  <Text>Pending</Text>
                  <Metric>{analytics.statusDistribution.pending}</Metric>
                </div>
                <Badge color="yellow" size="sm">
                  {((analytics.statusDistribution.pending / analytics.totalRegistrations) * 100).toFixed(1)}%
                </Badge>
              </div>
            </Card>
          </motion.div>

          <motion.div custom={2} variants={fadeInVariants}>
            <Card decoration="top" decorationColor="emerald">
              <div className="flex justify-between items-start">
                <div>
                  <Text>Confirmed</Text>
                  <Metric>{analytics.statusDistribution.confirmed}</Metric>
                </div>
                <Badge color="emerald" size="sm">
                  {((analytics.statusDistribution.confirmed / analytics.totalRegistrations) * 100).toFixed(1)}%
                </Badge>
              </div>
            </Card>
          </motion.div>

          <motion.div custom={3} variants={fadeInVariants}>
            <Card decoration="top" decorationColor="red">
              <div className="flex justify-between items-start">
                <div>
                  <Text>Rejected</Text>
                  <Metric>{analytics.statusDistribution.rejected}</Metric>
                </div>
                <Badge color="red" size="sm">
                  {((analytics.statusDistribution.rejected / analytics.totalRegistrations) * 100).toFixed(1)}%
                </Badge>
              </div>
            </Card>
          </motion.div>
        </Grid>
      </motion.div>

      {/* Chart Tabs */}
      <motion.div 
        className="mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <Tabs defaultValue="charts" className="w-full">
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
          
          <TabsContent value="charts" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StatusDistributionChart analytics={analytics} />
              <ParticipantTypeChart analytics={analytics} />
            </div>
          </TabsContent>
          
          <TabsContent value="trends" className="space-y-6">
            <RegistrationTrendsChart analytics={analytics} />
          </TabsContent>
          
          <TabsContent value="breakdown" className="space-y-6">
            <InstitutionChart analytics={analytics} />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}