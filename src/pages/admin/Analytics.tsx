import { useEffect, useState } from 'react';
import {
  Eye, FileText, Inbox, Users, TrendingUp, BarChart3,
  ArrowUp, Activity
} from 'lucide-react';
import AdminLayout, { useAdminToast } from '@/components/layout/AdminLayout';
import { getStories, getSubmissions, getSubscribers, getDonations } from '@/lib/dataService';
import type { Story } from '@/types/database';
import { StatsSkeleton } from '@/components/Skeleton';

export default function Analytics() {
  const { addToast } = useAdminToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalViews: 0, totalStories: 0, pendingSubmissions: 0,
    totalSubscribers: 0, totalDonations: 0,
  });
  const [topStories, setTopStories] = useState<Story[]>([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState<Record<string, number>>({});

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    try {
      const [storiesData, submissionsData, subscribersData, donationsData] = await Promise.all([
        getStories({ limit: 100 }).catch(() => []),
        getSubmissions().catch(() => []),
        getSubscribers().catch(() => []),
        getDonations().catch(() => []),
      ]);

      const totalViews = storiesData.reduce((sum, s) => sum + (s.views_count || 0), 0);
      const totalDonations = donationsData.reduce((sum, d) => sum + Number(d.amount || 0), 0);

      setStats({
        totalViews, totalStories: storiesData.length,
        pendingSubmissions: submissionsData.filter(s => s.status === 'pending').length,
        totalSubscribers: subscribersData.filter(s => s.is_active).length,
        totalDonations,
      });

      setTopStories(storiesData.sort((a, b) => (b.views_count || 0) - (a.views_count || 0)).slice(0, 10));

      const cats: Record<string, number> = {};
      storiesData.forEach(s => { cats[s.category] = (cats[s.category] || 0) + 1; });
      setCategoryBreakdown(cats);
    } catch {
      addToast('Failed to load analytics', 'error');
    } finally {
      setLoading(false);
    }
  }

  const maxCatCount = Math.max(...Object.values(categoryBreakdown), 1);

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-sm text-hti-gray mt-1">Platform performance and insights</p>
      </div>

      {/* Stats */}
      {loading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total Views', value: stats.totalViews.toLocaleString(), icon: Eye, color: 'text-hti-primary', bg: 'bg-hti-primary/10', trend: '+12%' },
            { label: 'Stories', value: stats.totalStories.toString(), icon: FileText, color: 'text-hti-green', bg: 'bg-hti-green/10', trend: '+3' },
            { label: 'Pending', value: stats.pendingSubmissions.toString(), icon: Inbox, color: 'text-hti-breaking', bg: 'bg-hti-breaking/10', trend: 'Now' },
            { label: 'Subscribers', value: stats.totalSubscribers.toLocaleString(), icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10', trend: '+8%' },
            { label: 'Donations', value: `₹${stats.totalDonations.toLocaleString()}`, icon: TrendingUp, color: 'text-amber-400', bg: 'bg-amber-400/10', trend: '+15%' },
          ].map((s) => (
            <div key={s.label} className="card-glass rounded-xl p-4">
              <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center mb-3`}>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <div className="text-xl font-bold">{s.value}</div>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-xs text-hti-green">{s.trend}</span>
                <ArrowUp className="w-3 h-3 text-hti-green" />
              </div>
              <div className="text-xs text-hti-gray mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="card-glass rounded-xl p-5">
          <h2 className="font-semibold flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-hti-primary" /> Stories by Category
          </h2>
          <div className="space-y-3">
            {Object.entries(categoryBreakdown)
              .sort(([, a], [, b]) => b - a)
              .map(([cat, count]) => (
                <div key={cat}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>{cat}</span>
                    <span className="text-hti-gray">{count} stories</span>
                  </div>
                  <div className="h-2 bg-hti-bg rounded-full overflow-hidden">
                    <div
                      className="h-full bg-hti-primary rounded-full transition-all duration-500"
                      style={{ width: `${(count / maxCatCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            {Object.keys(categoryBreakdown).length === 0 && (
              <p className="text-sm text-hti-gray text-center py-4">No data yet</p>
            )}
          </div>
        </div>

        {/* Top Stories */}
        <div className="card-glass rounded-xl p-5">
          <h2 className="font-semibold flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-hti-green" /> Top Performing Stories
          </h2>
          <div className="space-y-3">
            {topStories.length === 0 ? (
              <p className="text-sm text-hti-gray text-center py-4">No data yet</p>
            ) : (
              topStories.map((story, i) => (
                <div key={story.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/[0.02]">
                  <span className={`text-xs font-bold w-5 text-center ${i < 3 ? 'text-hti-primary' : 'text-hti-gray'}`}>
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{story.title}</p>
                    <p className="text-xs text-hti-gray">{story.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{story.views_count?.toLocaleString()}</p>
                    <p className="text-[10px] text-hti-gray">views</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
