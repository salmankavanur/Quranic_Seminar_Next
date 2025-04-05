'use client';

import { Card, Title } from "@tremor/react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AnalyticsData } from "@/lib/analytics-utils";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

interface ChartProps {
  analytics: AnalyticsData;
}

export function StatusDistributionChart({ analytics }: ChartProps) {
  const data = Object.entries(analytics.statusDistribution).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value
  }));

  return (
    <Card className="mt-4">
      <Title>Registration Status Distribution</Title>
      <div className="h-80 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export function ParticipantTypeChart({ analytics }: ChartProps) {
  const data = Object.entries(analytics.participantTypeDistribution).map(([name, value]) => ({
    name,
    value
  }));

  return (
    <Card className="mt-4">
      <Title>Participant Type Distribution</Title>
      <div className="h-80 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export function InstitutionChart({ analytics }: ChartProps) {
  // Get top 10 institutions by registration count
  const data = Object.entries(analytics.institutionDistribution)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, value]) => ({
      name,
      value
    }));

  return (
    <Card className="mt-4">
      <Title>Top 10 Institutions</Title>
      <div className="h-80 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical">
            <XAxis type="number" />
            <YAxis type="category" dataKey="name" width={150} />
            <Tooltip />
            <Bar dataKey="value" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export function RegistrationTrendsChart({ analytics }: ChartProps) {
  return (
    <Card className="mt-4">
      <Title>Registration Trends</Title>
      <div className="h-80 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={analytics.monthlyTrends}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
} 