import { Registration } from "@/types/registration";

export interface AnalyticsData {
  registrationTrend: number;
  totalRegistrations: number;
  statusDistribution: {
    pending: number;
    confirmed: number;
    rejected: number;
  };
  participantTypeDistribution: {
    [key: string]: number;
  };
  institutionDistribution: {
    [key: string]: number;
  };
  dailyTrends: {
    date: string;
    count: number;
  }[];
  weeklyTrends: {
    week: string;
    count: number;
  }[];
  monthlyTrends: {
    month: string;
    count: number;
  }[];
}

export function calculateAnalytics(registrations: Registration[]): AnalyticsData {
  const analytics: AnalyticsData = {
    totalRegistrations: registrations.length,
    statusDistribution: {
      pending: 0,
      confirmed: 0,
      rejected: 0,
    },
    participantTypeDistribution: {},
    institutionDistribution: {},
    dailyTrends: [],
    weeklyTrends: [],
    monthlyTrends: [],
  };

  // Status Distribution
  registrations.forEach(reg => {
    analytics.statusDistribution[reg.status]++;
  });

  // Participant Type Distribution
  registrations.forEach(reg => {
    analytics.participantTypeDistribution[reg.participant_type] = 
      (analytics.participantTypeDistribution[reg.participant_type] || 0) + 1;
  });

  // Institution Distribution
  registrations.forEach(reg => {
    analytics.institutionDistribution[reg.institution] = 
      (analytics.institutionDistribution[reg.institution] || 0) + 1;
  });

  // Time-based trends
  const dateGroups = new Map<string, number>();
  const weekGroups = new Map<string, number>();
  const monthGroups = new Map<string, number>();

  registrations.forEach(reg => {
    const date = new Date(reg.created_at);
    
    // Daily trends
    const dayKey = date.toISOString().split('T')[0];
    dateGroups.set(dayKey, (dateGroups.get(dayKey) || 0) + 1);

    // Weekly trends
    const weekKey = getWeekKey(date);
    weekGroups.set(weekKey, (weekGroups.get(weekKey) || 0) + 1);

    // Monthly trends
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    monthGroups.set(monthKey, (monthGroups.get(monthKey) || 0) + 1);
  });

  // Convert trends to sorted arrays
  analytics.dailyTrends = Array.from(dateGroups.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  analytics.weeklyTrends = Array.from(weekGroups.entries())
    .map(([week, count]) => ({ week, count }))
    .sort((a, b) => a.week.localeCompare(b.week));

  analytics.monthlyTrends = Array.from(monthGroups.entries())
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => a.month.localeCompare(b.month));

  return analytics;
}

function getWeekKey(date: Date): string {
  const year = date.getFullYear();
  const oneJan = new Date(year, 0, 1);
  const weekNumber = Math.ceil(
    ((date.getTime() - oneJan.getTime()) / 86400000 + oneJan.getDay() + 1) / 7
  );
  return `${year}-W${String(weekNumber).padStart(2, '0')}`;
} 