import { useEffect, useState } from 'react';
import { Users, Download, Mail, Search, Check, X } from 'lucide-react';
import AdminLayout, { useAdminToast } from '@/components/layout/AdminLayout';
import { getSubscribers } from '@/lib/dataService';
import type { Subscriber } from '@/types/database';
import { TableRowSkeleton } from '@/components/Skeleton';

export default function SubscribersManager() {
  const { addToast } = useAdminToast();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    try {
      const data = await getSubscribers();
      setSubscribers(data);
    } catch {
      addToast('Failed to load subscribers', 'error');
    } finally { setLoading(false); }
  }

  const filtered = subscribers.filter(s =>
    !search || s.email.toLowerCase().includes(search.toLowerCase()) ||
    (s.name && s.name.toLowerCase().includes(search.toLowerCase()))
  );

  const exportCSV = () => {
    const headers = ['Email', 'Name', 'Source', 'Active', 'Subscribed At'];
    const rows = subscribers.map(s => [
      s.email, s.name || '', s.source, s.is_active ? 'Yes' : 'No',
      new Date(s.subscribed_at).toISOString()
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('CSV exported successfully', 'success');
  };

  const activeCount = subscribers.filter(s => s.is_active).length;

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Subscribers</h1>
        <p className="text-sm text-hti-gray mt-1">Newsletter subscriber management</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        <div className="card-glass rounded-xl p-4">
          <div className="w-8 h-8 rounded-lg bg-hti-primary/10 flex items-center justify-center mb-2">
            <Users className="w-4 h-4 text-hti-primary" />
          </div>
          <div className="text-xl font-bold">{subscribers.length}</div>
          <div className="text-xs text-hti-gray">Total Subscribers</div>
        </div>
        <div className="card-glass rounded-xl p-4">
          <div className="w-8 h-8 rounded-lg bg-hti-green/10 flex items-center justify-center mb-2">
            <Check className="w-4 h-4 text-hti-green" />
          </div>
          <div className="text-xl font-bold text-hti-green">{activeCount}</div>
          <div className="text-xs text-hti-gray">Active</div>
        </div>
        <div className="card-glass rounded-xl p-4">
          <div className="w-8 h-8 rounded-lg bg-hti-breaking/10 flex items-center justify-center mb-2">
            <X className="w-4 h-4 text-hti-breaking" />
          </div>
          <div className="text-xl font-bold text-hti-breaking">{subscribers.length - activeCount}</div>
          <div className="text-xs text-hti-gray">Inactive</div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-hti-gray" />
          <input
            type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search subscribers..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-hti-card border border-hti-border text-white text-sm placeholder:text-hti-gray/40 focus:outline-none focus:border-hti-primary"
          />
        </div>
        <button onClick={exportCSV}
          className="btn-secondary text-sm py-2.5 px-4 flex items-center gap-2">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="card-glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-hti-border">
                <th className="text-left px-4 py-3 text-hti-gray font-medium">Email</th>
                <th className="text-left px-4 py-3 text-hti-gray font-medium">Name</th>
                <th className="text-left px-4 py-3 text-hti-gray font-medium">Source</th>
                <th className="text-left px-4 py-3 text-hti-gray font-medium">Status</th>
                <th className="text-left px-4 py-3 text-hti-gray font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} cols={5} />)
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-hti-gray">No subscribers found</td></tr>
              ) : (
                filtered.map((sub) => (
                  <tr key={sub.id} className="border-b border-hti-border/50 hover:bg-white/[0.02]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-hti-gray" />
                        <span className="text-hti-primary">{sub.email}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-hti-gray">{sub.name || '-'}</td>
                    <td className="px-4 py-3 text-hti-gray capitalize">{sub.source}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                        sub.is_active ? 'bg-hti-green/10 text-hti-green' : 'bg-hti-breaking/10 text-hti-breaking'
                      }`}>
                        {sub.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-hti-gray text-xs">
                      {new Date(sub.subscribed_at).toLocaleDateString('en-IN')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
