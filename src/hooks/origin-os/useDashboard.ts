import { useQuery } from '@tanstack/react-query';
import { reportsService } from '@/services/origin-os/reports';
import { goalsService } from '@/services/origin-os/goals';
import { investmentsService } from '@/services/origin-os/financial';
import { contentService } from '@/services/origin-os/content';
import { followupsService } from '@/services/origin-os/followups';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';
import type { DashboardKPIs, DailyChartPoint, FunnelPoint } from '@/types/origin-os';

export const DASHBOARD_KEY = 'os-dashboard';

export function useDashboardData(userId: string) {
  return useQuery({
    queryKey: [DASHBOARD_KEY, userId],
    queryFn: async () => {
      const now = new Date();
      const startMonth = format(startOfMonth(now), 'yyyy-MM-dd');
      const endMonth = format(endOfMonth(now), 'yyyy-MM-dd');

      const [reports, activeGoal, patrimony, followups] = await Promise.all([
        reportsService.getByPeriod(userId, startMonth, endMonth),
        goalsService.getActive(userId),
        investmentsService.getTotalPatrimony(userId),
        followupsService.getAll(userId),
      ]);

      // KPIs aggregated from daily reports
      const kpis: DashboardKPIs = {
        revenue: reports.reduce((s, r) => s + Number(r.revenue), 0),
        invested: reports.reduce((s, r) => s + Number(r.invested), 0),
        patrimony,
        prospections: reports.reduce((s, r) => s + r.prospections, 0),
        responses: reports.reduce((s, r) => s + r.responses, 0),
        meetings: reports.reduce((s, r) => s + r.meetings, 0),
        proposals: reports.reduce((s, r) => s + r.proposals, 0),
        closings: followups.filter(f => f.status === 'fechado').length,
        conversion:
          reports.reduce((s, r) => s + r.prospections, 0) > 0
            ? Math.round(
                (followups.filter(f => f.status === 'fechado').length /
                  reports.reduce((s, r) => s + r.prospections, 0)) *
                  100,
              )
            : 0,
        publishedContent: 0, // updated below
      };

      // Content count for month
      const monthStart = startOfMonth(now).toISOString();
      const monthEnd = endOfMonth(now).toISOString();
      kpis.publishedContent = await contentService.countByPeriod(userId, monthStart, monthEnd);

      // Daily revenue chart (last 30 days)
      const last30 = await reportsService.getByPeriod(
        userId,
        format(subDays(now, 29), 'yyyy-MM-dd'),
        format(now, 'yyyy-MM-dd'),
      );

      const revenueChart: DailyChartPoint[] = last30.map(r => ({
        date: r.date,
        value: Number(r.revenue),
      }));

      const investedChart: DailyChartPoint[] = last30.map(r => ({
        date: r.date,
        value: Number(r.invested),
      }));

      const prospectionsChart: DailyChartPoint[] = last30.map(r => ({
        date: r.date,
        value: r.prospections,
      }));

      // Funnel
      const funnel: FunnelPoint[] = [
        { name: 'Prospecções', value: kpis.prospections },
        { name: 'Respostas', value: kpis.responses },
        { name: 'Reuniões', value: kpis.meetings },
        { name: 'Propostas', value: kpis.proposals },
        { name: 'Fechados', value: kpis.closings },
      ];

      return {
        kpis,
        activeGoal,
        revenueChart,
        investedChart,
        prospectionsChart,
        funnel,
        followups,
      };
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 min cache
  });
}
