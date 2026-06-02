import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Eye, FileText, Inbox, Users, TrendingUp, ArrowRight,
  Plus, CheckCircle
} from 'lucide-react';
import AdminLayout, { useAdminToast } from '@/components/layout/AdminLayout';
import { getStories, getSubmissions, getSubscribers, getDonations } from '@/lib/dataService';
import type { Story, Submission } from '@/types/database';
import { StatsSkeleton } from '@/components/Skeleton';

export default function AdminDashboard() {
  const { addToast } = useAdminToast();
  const [stats, setStats] = useState({
    totalViews: 0, totalStories: 0, pendingSubmissions: 0,
    totalSubscribers: 0, totalDonations: 0,
  });
  const [recentStories, setRecentStories] = useState<Story[]>([]);
  const [recentSubmissions, setRecentSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    try {
      const [storiesData, submissionsData, subscribersData, donationsData] = await Promise.all([
        getStories({ limit: 5 }).catch(() => []),
        getSubmissions('pending').catch(() => []),
        getSubscribers().catch(() => []),
        getDonations().catch(() => []),
      ]);

      const totalViews = storiesData.reduce((sum, s) => sum + (s.views_count || 0), 0);
      const totalDonations = donationsData.reduce((sum, d) => sum + Number(d.amount || 0), 0);

      setStats({
        totalViews,
        totalStories: storiesData.length,
        pendingSubmissions: submissionsData.length,
        totalSubscribers: subscribersData.filter(s => s.is_active).length,
        totalDonations,
      });
      setRecentStories(storiesData.slice(0, 5));
      setRecentSubmissions(submissionsData.slice(0, 5));
    } catch {
      addToast('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-hti-gray mt-1">Overview of your platform</p>
        </div>
        <Link
          to="/admin/stories"
          className="btn-primary text-sm py-2.5 px-4 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> New Story
        </Link>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total Views', value: stats.totalViews.toLocaleString(), icon: Eye, color: 'text-hti-primary', bg: 'bg-hti-primary/10' },
            { label: 'Stories', value: stats.totalStories.toString(), icon: FileText, color: 'text-hti-green', bg: 'bg-hti-green/10' },
            { label: 'Pending', value: stats.pendingSubmissions.toString(), icon: Inbox, color: 'text-hti-breaking', bg: 'bg-hti-breaking/10' },
            { label: 'Subscribers', value: stats.totalSubscribers.toLocaleString(), icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
            { label: 'Donations', value: `₹${stats.totalDonations.toLocaleString()}`, icon: TrendingUp, color: 'text-amber-400', bg: 'bg-amber-400/10' },
          ].map((s) => (
            <div key={s.label} className="card-glass rounded-xl p-4">
              <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center mb-3`}>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <div className="text-xl font-bold">{s.value}</div>
              <div className="text-xs text-hti-gray mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <Link
          to="/admin/stories"
          className="card-glass rounded-xl p-5 flex items-center gap-4 hover:border-hti-primary/50 transition-all group"
        >
          <div className="w-12 h-12 rounded-lg bg-hti-primary/10 flex items-center justify-center">
            <Plus className="w-5 h-5 text-hti-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium">Create New Story</h3>
            <p className="text-xs text-hti-gray">Write and publish a new article</p>
          </div>
          <ArrowRight className="w-4 h-4 text-hti-gray group-hover:text-hti-primary transition-colors" />
        </Link>
        <Link
          to="/admin/submissions"
          className="card-glass rounded-xl p-5 flex items-center gap-4 hover:border-hti-primary/50 transition-all group"
        >
          <div className="w-12 h-12 rounded-lg bg-hti-breaking/10 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-hti-breaking" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium">Review Submissions</h3>
            <p className="text-xs text-hti-gray">{stats.pendingSubmissions} pending to review</p>
          </div>
          <ArrowRight className="w-4 h-4 text-hti-gray group-hover:text-hti-primary transition-colors" />
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Stories */}
        <div className="card-glass rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold flex items-center gap-2">
              <FileText className="w-4 h-4 text-hti-primary" /> Recent Stories
            </h2>
            <Link to="/admin/stories" className="text-xs text-hti-primary hover:underline">View All</Link>
          </div>
          <div className="space-y-3">
            {recentStories.length === 0 ? (
              <p className="text-sm text-hti-gray text-center py-4">No stories yet</p>
            ) : (
              recentStories.map((story) => (
                <div key={story.id} className="flex items-center gap-3 p-3 rounded-lg bg-hti-bg/50">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{
                    backgroundColor: story.is_breaking ? '#DC2626' : story.is_pinned ? '#FF4500' : '#00C853'
                  }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{story.title}</p>
                    <p className="text-xs text-hti-gray">{story.category} &bull; {story.views_count?.toLocaleString()} views</p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded ${story.status === 'published' ? 'bg-hti-green/10 text-hti-green' :
                      story.status === 'draft' ? 'bg-amber-400/10 text-amber-400' :
                        'bg-hti-gray/10 text-hti-gray'
                    }`}>
                    {story.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Submissions */}
        <div className="card-glass rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold flex items-center gap-2">
              <Inbox className="w-4 h-4 text-hti-breaking" /> Recent Submissions
            </h2>
            <Link to="/admin/submissions" className="text-xs text-hti-primary hover:underline">View All</Link>
          </div>
          <div className="space-y-3">
            {recentSubmissions.length === 0 ? (
              <p className="text-sm text-hti-gray text-center py-4">No pending submissions</p>
            ) : (
              recentSubmissions.map((sub) => (
                <div key={sub.id} className="flex items-center gap-3 p-3 rounded-lg bg-hti-bg/50">
                  <div className="w-2 h-2 rounded-full bg-hti-breaking shrink-0 animate-pulse" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{sub.story_title}</p>
                    <p className="text-xs text-hti-gray">
                      {sub.is_anonymous ? 'Anonymous' : sub.name || 'Named'} &bull; {sub.category}
                    </p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-hti-breaking/10 text-hti-breaking">
                    {sub.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}