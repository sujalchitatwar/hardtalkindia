import { useEffect, useState } from 'react';
import {
  Plus, Search, Edit, Trash2, Pin, X
} from 'lucide-react';
import AdminLayout, { useAdminToast } from '@/components/layout/AdminLayout';
import { supabase, supabaseUntyped } from '@/lib/supabase';
import type { Story } from '@/types/database';
import { TableRowSkeleton } from '@/components/Skeleton';

const CATEGORIES = ['Women Safety', 'Crime', 'Politics', 'Ground Reports', 'Fake News Debunked', 'Survivor Stories'];
const STATUSES = ['draft', 'published', 'archived'];

export default function StoriesManager() {
  const { addToast } = useAdminToast();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Story | null>(null);
  const [form, setForm] = useState({
    title: '', slug: '', content: '', excerpt: '', category: 'Women Safety',
    author: 'HardTalkIndia', is_pinned: false, is_breaking: false, status: 'draft',
    meta_title: '', meta_description: '',
    thumbnail_url: '', reel_url: '', video_url: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadStories(); }, []);

  async function loadStories() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setStories(data || []);
    } catch {
      addToast('Failed to load stories', 'error');
    } finally { setLoading(false); }
  }

  const filtered = stories.filter(s => {
    const matchesSearch = !search || s.title.toLowerCase().includes(search.toLowerCase()) || s.slug.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !filterStatus || s.status === filterStatus;
    const matchesCategory = !filterCategory || s.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const openNew = () => {
    setEditing(null);
    setForm({
      title: '', slug: '', content: '', excerpt: '', category: 'Women Safety',
      author: 'HardTalkIndia', is_pinned: false, is_breaking: false, status: 'draft',
      meta_title: '', meta_description: '',
      thumbnail_url: '', reel_url: '', video_url: '',
    });
    setShowModal(true);
  };

  const openEdit = (story: Story) => {
    setEditing(story);
    setForm({
      title: story.title, slug: story.slug, content: story.content,
      excerpt: story.excerpt || '', category: story.category,
      author: story.author, is_pinned: story.is_pinned, is_breaking: story.is_breaking,
      status: story.status, meta_title: story.meta_title || '', meta_description: story.meta_description || '',
      thumbnail_url: story.thumbnail_url || '', reel_url: story.reel_url || '', video_url: story.video_url || '',
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.slug.trim() || !form.content.trim()) {
      addToast('Title, slug and content are required', 'error');
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        const { error } = await supabaseUntyped.from('stories').update({
          ...form, updated_at: new Date().toISOString()
        }).eq('id', editing.id);
        if (error) throw error;
        addToast('Story updated successfully', 'success');
      } else {
        const { error } = await supabaseUntyped.from('stories').insert([{
          ...form,
          excerpt: form.excerpt || null,
          meta_title: form.meta_title || null,
          meta_description: form.meta_description || null,
          thumbnail_url: form.thumbnail_url || null,
          reel_url: form.reel_url || null,
          video_url: form.video_url || null,
        }]);
        if (error) throw error;
        addToast('Story created successfully', 'success');
      }
      setShowModal(false);
      loadStories();
    } catch (err: any) {
      addToast(err.message || 'Failed to save story', 'error');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this story?')) return;
    try {
      const { error } = await supabase.from('stories').delete().eq('id', id);
      if (error) throw error;
      addToast('Story deleted', 'success');
      loadStories();
    } catch {
      addToast('Failed to delete story', 'error');
    }
  };

  const togglePin = async (story: Story) => {
    try {
      const { error } = await supabaseUntyped.from('stories').update({ is_pinned: !story.is_pinned }).eq('id', story.id);
      if (error) throw error;
      loadStories();
    } catch {
      addToast('Failed to update', 'error');
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Stories Manager</h1>
          <p className="text-sm text-hti-gray mt-1">Create, edit, and manage articles</p>
        </div>
        <button onClick={openNew} className="btn-primary text-sm py-2.5 px-4 flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Story
        </button>
      </div>

      {/* Filters */}
      <div className="card-glass rounded-xl p-4 mb-6 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-hti-gray" />
          <input
            type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search stories..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-hti-bg border border-hti-border text-white text-sm placeholder:text-hti-gray/40 focus:outline-none focus:border-hti-primary"
          />
        </div>
        <select
          value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 rounded-lg bg-hti-bg border border-hti-border text-white text-sm focus:outline-none focus:border-hti-primary"
        >
          <option value="" className="bg-hti-card">All Status</option>
          {STATUSES.map(s => <option key={s} value={s} className="bg-hti-card">{s}</option>)}
        </select>
        <select
          value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 rounded-lg bg-hti-bg border border-hti-border text-white text-sm focus:outline-none focus:border-hti-primary"
        >
          <option value="" className="bg-hti-card">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c} className="bg-hti-card">{c}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="card-glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-hti-border">
                <th className="text-left px-4 py-3 text-hti-gray font-medium">Title</th>
                <th className="text-left px-4 py-3 text-hti-gray font-medium">Category</th>
                <th className="text-left px-4 py-3 text-hti-gray font-medium">Status</th>
                <th className="text-left px-4 py-3 text-hti-gray font-medium">Views</th>
                <th className="text-left px-4 py-3 text-hti-gray font-medium">Date</th>
                <th className="text-right px-4 py-3 text-hti-gray font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} cols={6} />)
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-hti-gray">No stories found</td>
                </tr>
              ) : (
                filtered.map((story) => (
                  <tr key={story.id} className="border-b border-hti-border/50 hover:bg-white/[0.02]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {story.is_pinned && <Pin className="w-3 h-3 text-hti-primary" />}
                        {story.is_breaking && <span className="text-[10px] bg-hti-breaking/20 text-hti-breaking px-1.5 rounded">BREAKING</span>}
                        <span className="font-medium truncate max-w-[200px]">{story.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-hti-gray">{story.category}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                        story.status === 'published' ? 'bg-hti-green/10 text-hti-green' :
                        story.status === 'draft' ? 'bg-amber-400/10 text-amber-400' :
                        'bg-hti-gray/10 text-hti-gray'
                      }`}>
                        {story.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-hti-gray">{story.views_count?.toLocaleString()}</td>
                    <td className="px-4 py-3 text-hti-gray text-xs">
                      {new Date(story.created_at).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => togglePin(story)} className="p-1.5 rounded hover:bg-white/5 text-hti-gray hover:text-hti-primary" title="Toggle Pin">
                          <Pin className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => openEdit(story)} className="p-1.5 rounded hover:bg-white/5 text-hti-gray hover:text-blue-400" title="Edit">
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(story.id)} className="p-1.5 rounded hover:bg-white/5 text-hti-gray hover:text-hti-breaking" title="Delete">
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
          <div className="bg-hti-card border border-hti-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-hti-card border-b border-hti-border px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-lg font-semibold">{editing ? 'Edit Story' : 'New Story'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded hover:bg-white/5">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-hti-gray mb-1">Title *</label>
                  <input
                    type="text" value={form.title}
                    onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg bg-hti-bg border border-hti-border text-white text-sm focus:outline-none focus:border-hti-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm text-hti-gray mb-1">Slug *</label>
                  <input
                    type="text" value={form.slug}
                    onChange={(e) => setForm(p => ({ ...p, slug: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg bg-hti-bg border border-hti-border text-white text-sm focus:outline-none focus:border-hti-primary"
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-hti-gray mb-1">Category</label>
                  <select
                    value={form.category} onChange={(e) => setForm(p => ({ ...p, category: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg bg-hti-bg border border-hti-border text-white text-sm focus:outline-none focus:border-hti-primary"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c} className="bg-hti-card">{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-hti-gray mb-1">Status</label>
                  <select
                    value={form.status} onChange={(e) => setForm(p => ({ ...p, status: e.target.value as any }))}
                    className="w-full px-3 py-2 rounded-lg bg-hti-bg border border-hti-border text-white text-sm focus:outline-none focus:border-hti-primary"
                  >
                    {STATUSES.map(s => <option key={s} value={s} className="bg-hti-card">{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-hti-gray mb-1">Author</label>
                  <input
                    type="text" value={form.author}
                    onChange={(e) => setForm(p => ({ ...p, author: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg bg-hti-bg border border-hti-border text-white text-sm focus:outline-none focus:border-hti-primary"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox" checked={form.is_pinned}
                    onChange={(e) => setForm(p => ({ ...p, is_pinned: e.target.checked }))}
                    className="rounded border-hti-border"
                  />
                  Pin to top
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox" checked={form.is_breaking}
                    onChange={(e) => setForm(p => ({ ...p, is_breaking: e.target.checked }))}
                    className="rounded border-hti-border"
                  />
                  Breaking news
                </label>
              </div>
              <div>
                <label className="block text-sm text-hti-gray mb-1">Excerpt</label>
                <input
                  type="text" value={form.excerpt}
                  onChange={(e) => setForm(p => ({ ...p, excerpt: e.target.value }))}
                  placeholder="Short description..."
                  className="w-full px-3 py-2 rounded-lg bg-hti-bg border border-hti-border text-white text-sm placeholder:text-hti-gray/40 focus:outline-none focus:border-hti-primary"
                />
              </div>
              <div>
                <label className="block text-sm text-hti-gray mb-1">Content *</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm(p => ({ ...p, content: e.target.value }))}
                  rows={10}
                  placeholder="Story content (HTML supported)..."
                  className="w-full px-3 py-2 rounded-lg bg-hti-bg border border-hti-border text-white text-sm placeholder:text-hti-gray/40 focus:outline-none focus:border-hti-primary resize-none font-mono"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-hti-gray mb-1">Thumbnail URL</label>
                  <input
                    type="text" value={form.thumbnail_url}
                    onChange={(e) => setForm(p => ({ ...p, thumbnail_url: e.target.value }))}
                    placeholder="Image URL..."
                    className="w-full px-3 py-2 rounded-lg bg-hti-bg border border-hti-border text-white text-sm focus:outline-none focus:border-hti-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm text-hti-gray mb-1">Instagram Reel Link</label>
                  <input
                    type="text" value={form.reel_url}
                    onChange={(e) => setForm(p => ({ ...p, reel_url: e.target.value }))}
                    placeholder="https://instagram.com/reels/..."
                    className="w-full px-3 py-2 rounded-lg bg-hti-bg border border-hti-border text-white text-sm focus:outline-none focus:border-hti-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-hti-gray mb-1">Video URL (Uploaded)</label>
                <input
                  type="text" value={form.video_url}
                  onChange={(e) => setForm(p => ({ ...p, video_url: e.target.value }))}
                  placeholder="Direct video link..."
                  className="w-full px-3 py-2 rounded-lg bg-hti-bg border border-hti-border text-white text-sm focus:outline-none focus:border-hti-primary"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-hti-gray mb-1">Meta Title</label>
                  <input
                    type="text" value={form.meta_title}
                    onChange={(e) => setForm(p => ({ ...p, meta_title: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg bg-hti-bg border border-hti-border text-white text-sm focus:outline-none focus:border-hti-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm text-hti-gray mb-1">Meta Description</label>
                  <input
                    type="text" value={form.meta_description}
                    onChange={(e) => setForm(p => ({ ...p, meta_description: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg bg-hti-bg border border-hti-border text-white text-sm focus:outline-none focus:border-hti-primary"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowModal(false)} className="btn-secondary flex-1 py-2.5 text-sm">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 py-2.5 text-sm disabled:opacity-50">
                  {saving ? 'Saving...' : editing ? 'Update Story' : 'Publish Story'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
