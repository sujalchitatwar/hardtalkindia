import { useEffect, useState } from 'react';
import { Check, X, Eye, Download, Shield, Clock, CheckCircle, XCircle } from 'lucide-react';
import AdminLayout, { useAdminToast } from '@/components/layout/AdminLayout';
import { getSubmissions, updateSubmissionStatus } from '@/lib/dataService';
import type { Submission } from '@/types/database';
import { TableRowSkeleton } from '@/components/Skeleton';

export default function SubmissionsManager() {
  const { addToast } = useAdminToast();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState<Submission | null>(null);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    try {
      const data = await getSubmissions();
      setSubmissions(data);
    } catch {
      addToast('Failed to load submissions', 'error');
    } finally { setLoading(false); }
  }

  const filtered = filter ? submissions.filter(s => s.status === filter) : submissions;

  const handleStatus = async (id: string, status: string) => {
    try {
      await updateSubmissionStatus(id, status);
      addToast(`Submission ${status}`, 'success');
      loadData();
      if (selected?.id === id) setSelected(null);
    } catch {
      addToast('Failed to update status', 'error');
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Submissions Inbox</h1>
        <p className="text-sm text-hti-gray mt-1">Review and manage citizen-submitted stories</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total', value: submissions.length, icon: Clock, color: 'text-hti-primary', bg: 'bg-hti-primary/10' },
          { label: 'Pending', value: submissions.filter(s => s.status === 'pending').length, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-400/10' },
          { label: 'Approved', value: submissions.filter(s => s.status === 'approved').length, icon: CheckCircle, color: 'text-hti-green', bg: 'bg-hti-green/10' },
          { label: 'Rejected', value: submissions.filter(s => s.status === 'rejected').length, icon: XCircle, color: 'text-hti-breaking', bg: 'bg-hti-breaking/10' },
        ].map(s => (
          <button key={s.label} onClick={() => setFilter(filter === s.label.toLowerCase() ? '' : s.label.toLowerCase())}
            className={`card-glass rounded-xl p-4 text-left transition-all ${filter === s.label.toLowerCase() ? 'border-hti-primary' : ''}`}>
            <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center mb-2`}>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <div className="text-xl font-bold">{s.value}</div>
            <div className="text-xs text-hti-gray">{s.label}</div>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        {['all', 'pending', 'approved', 'rejected'].map(f => (
          <button key={f} onClick={() => setFilter(f === 'all' ? '' : f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
              (f === 'all' && !filter) || filter === f
                ? 'bg-hti-primary text-white' : 'bg-hti-card border border-hti-border text-hti-gray hover:text-white'
            }`}>
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card-glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-hti-border">
                <th className="text-left px-4 py-3 text-hti-gray font-medium">Story</th>
                <th className="text-left px-4 py-3 text-hti-gray font-medium">Submitted By</th>
                <th className="text-left px-4 py-3 text-hti-gray font-medium">Category</th>
                <th className="text-left px-4 py-3 text-hti-gray font-medium">Status</th>
                <th className="text-left px-4 py-3 text-hti-gray font-medium">Date</th>
                <th className="text-right px-4 py-3 text-hti-gray font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} cols={6} />)
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-hti-gray">No submissions found</td></tr>
              ) : (
                filtered.map((sub) => (
                  <tr key={sub.id} className="border-b border-hti-border/50 hover:bg-white/[0.02]">
                    <td className="px-4 py-3">
                      <p className="font-medium truncate max-w-[200px]">{sub.story_title}</p>
                      {sub.evidence_urls && sub.evidence_urls.length > 0 && (
                        <p className="text-[10px] text-hti-primary">{sub.evidence_urls.length} file(s) attached</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-hti-gray">
                      {sub.is_anonymous ? (
                        <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Anonymous</span>
                      ) : (
                        sub.name || sub.email || 'Unknown'
                      )}
                    </td>
                    <td className="px-4 py-3 text-hti-gray">{sub.category}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                        sub.status === 'pending' ? 'bg-amber-400/10 text-amber-400' :
                        sub.status === 'approved' ? 'bg-hti-green/10 text-hti-green' :
                        'bg-hti-breaking/10 text-hti-breaking'
                      }`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-hti-gray text-xs">
                      {new Date(sub.submitted_at).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setSelected(sub)} className="p-1.5 rounded hover:bg-white/5 text-hti-gray hover:text-blue-400" title="View">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {sub.status === 'pending' && (
                          <>
                            <button onClick={() => handleStatus(sub.id, 'approved')} className="p-1.5 rounded hover:bg-white/5 text-hti-gray hover:text-hti-green" title="Approve">
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => handleStatus(sub.id, 'rejected')} className="p-1.5 rounded hover:bg-white/5 text-hti-gray hover:text-hti-breaking" title="Reject">
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-hti-card border border-hti-border rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-hti-card border-b border-hti-border px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-lg font-semibold">Submission Details</h2>
              <button onClick={() => setSelected(null)} className="p-1.5 rounded hover:bg-white/5">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs text-hti-gray uppercase">Submitted By</label>
                <p className="text-sm mt-1">
                  {selected.is_anonymous ? (
                    <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Anonymous</span>
                  ) : (
                    <>
                      {selected.name || 'N/A'}
                      {selected.email && <span className="text-hti-gray ml-2">({selected.email})</span>}
                      {selected.phone && <span className="text-hti-gray ml-2">{selected.phone}</span>}
                    </>
                  )}
                </p>
              </div>
              <div>
                <label className="text-xs text-hti-gray uppercase">Category</label>
                <p className="text-sm mt-1">{selected.category}</p>
              </div>
              <div>
                <label className="text-xs text-hti-gray uppercase">Story Title</label>
                <p className="text-sm font-medium mt-1">{selected.story_title}</p>
              </div>
              <div>
                <label className="text-xs text-hti-gray uppercase">Story Content</label>
                <div className="mt-1 p-3 bg-hti-bg rounded-lg text-sm text-hti-gray whitespace-pre-wrap max-h-40 overflow-y-auto">
                  {selected.story_content}
                </div>
              </div>
              {selected.evidence_urls && selected.evidence_urls.length > 0 && (
                <div>
                  <label className="text-xs text-hti-gray uppercase">Evidence Files</label>
                  <div className="mt-1 space-y-1">
                    {selected.evidence_urls.map((url, i) => (
                      <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-hti-primary hover:underline">
                        <Download className="w-3.5 h-3.5" /> File {i + 1}
                      </a>
                    ))}
                  </div>
                </div>
              )}
              {selected.admin_notes && (
                <div>
                  <label className="text-xs text-hti-gray uppercase">Admin Notes</label>
                  <p className="text-sm text-hti-gray mt-1">{selected.admin_notes}</p>
                </div>
              )}
              <div>
                <label className="text-xs text-hti-gray uppercase">Submitted At</label>
                <p className="text-sm text-hti-gray mt-1">
                  {new Date(selected.submitted_at).toLocaleString('en-IN')}
                </p>
              </div>
              {selected.status === 'pending' && (
                <div className="flex gap-3 pt-2">
                  <button onClick={() => handleStatus(selected.id, 'approved')}
                    className="flex-1 btn-primary py-2.5 text-sm flex items-center justify-center gap-2">
                    <Check className="w-4 h-4" /> Approve
                  </button>
                  <button onClick={() => handleStatus(selected.id, 'rejected')}
                    className="flex-1 py-2.5 text-sm rounded-lg border border-hti-breaking text-hti-breaking hover:bg-hti-breaking/10 flex items-center justify-center gap-2 transition-colors">
                    <X className="w-4 h-4" /> Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
