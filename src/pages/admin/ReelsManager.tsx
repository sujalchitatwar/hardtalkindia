import { useEffect, useState } from 'react';
import {
  Plus, Edit, Trash2, Star, ExternalLink, X
} from 'lucide-react';
import AdminLayout, { useAdminToast } from '@/components/layout/AdminLayout';
import { supabase, supabaseUntyped } from '@/lib/supabase';
import type { Reel } from '@/types/database';
import { TableRowSkeleton } from '@/components/Skeleton';

const CATEGORIES = ['Women Safety', 'Crime', 'Politics', 'Ground Reports', 'Fake News Debunked', 'Survivor Stories'];

export default function ReelsManager() {
  const { addToast } = useAdminToast();
  const [reels, setReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Reel | null>(null);
  const [form, setForm] = useState({
    title: '', instagram_url: '', video_url: '', category: '', embed_code: '', is_featured: false,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('reels').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setReels(data || []);
    } catch {
      addToast('Failed to load reels', 'error');
    } finally { setLoading(false); }
  }

  const openNew = () => {
    setEditing(null);
    setForm({ title: '', instagram_url: '', video_url: '', category: '', embed_code: '', is_featured: false });
    setShowModal(true);
  };

  const openEdit = (reel: Reel) => {
    setEditing(reel);
    setForm({
      title: reel.title, instagram_url: reel.instagram_url || '', video_url: reel.video_url || '',
      category: reel.category || '', embed_code: reel.embed_code || '', is_featured: reel.is_featured,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || (!form.instagram_url.trim() && !form.video_url.trim())) {
      addToast('Title and either Instagram URL or Video URL are required', 'error');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        instagram_url: form.instagram_url || null,
        video_url: form.video_url || null,
        category: form.category || null,
        embed_code: form.embed_code || null,
      };
      if (editing) {
        const { error } = await supabaseUntyped.from('reels').update(payload as any).eq('id', editing.id);
        if (error) throw error;
        addToast('Reel updated', 'success');
      } else {
        const { error } = await supabaseUntyped.from('reels').insert([payload as any]);
        if (error) throw error;
        addToast('Reel added', 'success');
      }
      setShowModal(false);
      loadData();
    } catch (err: any) {
      addToast(err.message || 'Failed to save', 'error');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this reel?')) return;
    try {
      const { error } = await supabaseUntyped.from('reels').delete().eq('id', id);
      if (error) throw error;
      addToast('Reel deleted', 'success');
      loadData();
    } catch {
      addToast('Failed to delete', 'error');
    }
  };

  const toggleFeatured = async (reel: Reel) => {
    try {
      const { error } = await supabaseUntyped.from('reels').update({ is_featured: !reel.is_featured } as any).eq('id', reel.id);
      if (error) throw error;
      loadData();
    } catch {
      addToast('Failed to update', 'error');
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Reels Manager</h1>
          <p className="text-sm text-hti-gray mt-1">Manage video content and Instagram embeds</p>
        </div>
        <button onClick={openNew} className="btn-primary text-sm py-2.5 px-4 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Reel
        </button>
      </div>

      <div className="card-glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-hti-border">
                <th className="text-left px-4 py-3 text-hti-gray font-medium">Title</th>
                <th className="text-left px-4 py-3 text-hti-gray font-medium">Category</th>
                <th className="text-left px-4 py-3 text-hti-gray font-medium">Views</th>
                <th className="text-left px-4 py-3 text-hti-gray font-medium">Featured</th>
                <th className="text-right px-4 py-3 text-hti-gray font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} cols={5} />)
              ) : reels.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-hti-gray">No reels yet</td></tr>
              ) : (
                reels.map((reel) => (
                  <tr key={reel.id} className="border-b border-hti-border/50 hover:bg-white/[0.02]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {reel.is_featured && <Star className="w-3 h-3 text-hti-primary" />}
                        <span className="font-medium truncate max-w-[200px]">{reel.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-hti-gray">{reel.category || '-'}</td>
                    <td className="px-4 py-3 text-hti-gray">{reel.views_count?.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleFeatured(reel)}
                        className={`text-[10px] px-2 py-0.5 rounded font-medium transition-colors ${
                          reel.is_featured ? 'bg-hti-primary/10 text-hti-primary' : 'bg-hti-gray/10 text-hti-gray'
                        }`}>
                        {reel.is_featured ? 'Yes' : 'No'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <a href={reel.instagram_url} target="_blank" rel="noopener noreferrer"
                          className="p-1.5 rounded hover:bg-white/5 text-hti-gray hover:text-hti-primary" title="Open">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <button onClick={() => openEdit(reel)} className="p-1.5 rounded hover:bg-white/5 text-hti-gray hover:text-blue-400" title="Edit">
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(reel.id)} className="p-1.5 rounded hover:bg-white/5 text-hti-gray hover:text-hti-breaking" title="Delete">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-hti-card border border-hti-border rounded-2xl w-full max-w-lg">
            <div className="border-b border-hti-border px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">{editing ? 'Edit Reel' : 'Add Reel'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded hover:bg-white/5"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-hti-gray mb-1">Title *</label>
                <input type="text" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-hti-bg border border-hti-border text-white text-sm focus:outline-none focus:border-hti-primary" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-hti-gray mb-1">Instagram URL</label>
                  <input type="url" value={form.instagram_url} onChange={e => setForm(p => ({ ...p, instagram_url: e.target.value }))}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-lg bg-hti-bg border border-hti-border text-white text-sm focus:outline-none focus:border-hti-primary" />
                </div>
                <div>
                  <label className="block text-sm text-hti-gray mb-1">Video URL (Uploaded)</label>
                  <input type="url" value={form.video_url} onChange={e => setForm(p => ({ ...p, video_url: e.target.value }))}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-lg bg-hti-bg border border-hti-border text-white text-sm focus:outline-none focus:border-hti-primary" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-hti-gray mb-1">Category</label>
                  <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg bg-hti-bg border border-hti-border text-white text-sm focus:outline-none focus:border-hti-primary">
                    <option value="" className="bg-hti-card">None</option>
                    {CATEGORIES.map(c => <option key={c} value={c} className="bg-hti-card">{c}</option>)}
                  </select>
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 text-sm cursor-pointer pb-2">
                    <input type="checkbox" checked={form.is_featured}
                      onChange={e => setForm(p => ({ ...p, is_featured: e.target.checked }))}
                      className="rounded border-hti-border" />
                    Featured
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm text-hti-gray mb-1">Embed Code (optional)</label>
                <textarea value={form.embed_code} onChange={e => setForm(p => ({ ...p, embed_code: e.target.value }))}
                  rows={3} placeholder="Instagram embed HTML..."
                  className="w-full px-3 py-2 rounded-lg bg-hti-bg border border-hti-border text-white text-sm placeholder:text-hti-gray/40 focus:outline-none focus:border-hti-primary resize-none font-mono" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowModal(false)} className="btn-secondary flex-1 py-2.5 text-sm">Cancel</button>
                <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 py-2.5 text-sm disabled:opacity-50">
                  {saving ? 'Saving...' : editing ? 'Update' : 'Add Reel'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
