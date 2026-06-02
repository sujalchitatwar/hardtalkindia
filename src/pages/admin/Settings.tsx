import { useEffect, useState } from 'react';
import { Save, Globe, Bell, Image, Type, RefreshCw } from 'lucide-react';
import AdminLayout, { useAdminToast } from '@/components/layout/AdminLayout';
import { supabase, supabaseUntyped } from '@/lib/supabase';
import type { SiteSettings } from '@/types/database';

export default function SettingsPage() {
  const { addToast } = useAdminToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<Partial<SiteSettings>>({});

  useEffect(() => { loadSettings(); }, []);

  async function loadSettings() {
    try {
      const { data, error } = await supabase.from('site_settings').select('*').eq('id', 1).single();
      if (error) throw error;
      if (data) setSettings(data);
    } catch {
      // Use defaults if no settings found
      setSettings({
        hero_headline: 'The Voice of Unfiltered India',
        hero_subheadline: 'Ground Reality | No Filters | No Lies',
        breaking_news_enabled: false,
        breaking_news_text: '',
        trending_topics: ['Women Safety', 'Crime', 'Politics', 'System Failure'],
      });
    } finally { setLoading(false); }
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabaseUntyped.from('site_settings').upsert({
        id: 1,
        ...settings,
        updated_at: new Date().toISOString(),
      } as any);
      if (error) throw error;
      addToast('Settings saved successfully', 'success');
    } catch (err: any) {
      addToast(err.message || 'Failed to save settings', 'error');
    } finally { setSaving(false); }
  };

  const update = (field: string, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-hti-border/30 rounded w-48" />
          <div className="h-64 bg-hti-border/30 rounded-xl" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Site Settings</h1>
        <p className="text-sm text-hti-gray mt-1">Configure homepage content and platform settings</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Hero Section */}
        <div className="card-glass rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Type className="w-5 h-5 text-hti-primary" />
            <h2 className="font-semibold">Hero Section</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-hti-gray mb-1">Headline</label>
              <input
                type="text" value={settings.hero_headline || ''}
                onChange={e => update('hero_headline', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-hti-bg border border-hti-border text-white text-sm focus:outline-none focus:border-hti-primary"
              />
            </div>
            <div>
              <label className="block text-sm text-hti-gray mb-1">Subheadline</label>
              <input
                type="text" value={settings.hero_subheadline || ''}
                onChange={e => update('hero_subheadline', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-hti-bg border border-hti-border text-white text-sm focus:outline-none focus:border-hti-primary"
              />
            </div>
          </div>
        </div>

        {/* Breaking News */}
        <div className="card-glass rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-hti-breaking" />
            <h2 className="font-semibold">Breaking News Banner</h2>
          </div>
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={settings.breaking_news_enabled || false}
                onChange={e => update('breaking_news_enabled', e.target.checked)}
                className="rounded border-hti-border"
              />
              Enable breaking news banner
            </label>
            <div>
              <label className="block text-sm text-hti-gray mb-1">Breaking News Text</label>
              <input
                type="text" value={settings.breaking_news_text || ''}
                onChange={e => update('breaking_news_text', e.target.value)}
                placeholder="Enter breaking news headline..."
                className="w-full px-3 py-2 rounded-lg bg-hti-bg border border-hti-border text-white text-sm placeholder:text-hti-gray/40 focus:outline-none focus:border-hti-primary"
              />
            </div>
          </div>
        </div>

        {/* Trending Topics */}
        <div className="card-glass rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <RefreshCw className="w-5 h-5 text-hti-green" />
            <h2 className="font-semibold">Trending Topics</h2>
          </div>
          <div>
            <label className="block text-sm text-hti-gray mb-1">Topics (comma separated)</label>
            <input
              type="text"
              value={(settings.trending_topics || []).join(', ')}
              onChange={e => update('trending_topics', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
              placeholder="Women Safety, Crime, Politics..."
              className="w-full px-3 py-2 rounded-lg bg-hti-bg border border-hti-border text-white text-sm placeholder:text-hti-gray/40 focus:outline-none focus:border-hti-primary"
            />
            <p className="text-xs text-hti-gray mt-1">These appear on the homepage trending section</p>
          </div>
        </div>

        {/* Social Links */}
        <div className="card-glass rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-blue-400" />
            <h2 className="font-semibold">Social Media Links</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-hti-gray mb-1">Instagram</label>
              <input
                type="url" value={settings.social_instagram || ''}
                onChange={e => update('social_instagram', e.target.value)}
                placeholder="https://instagram.com/HardTalkIndia"
                className="w-full px-3 py-2 rounded-lg bg-hti-bg border border-hti-border text-white text-sm placeholder:text-hti-gray/40 focus:outline-none focus:border-hti-primary"
              />
            </div>
            <div>
              <label className="block text-sm text-hti-gray mb-1">Twitter/X</label>
              <input
                type="url" value={settings.social_twitter || ''}
                onChange={e => update('social_twitter', e.target.value)}
                placeholder="https://x.com/hardtalkindiaa"
                className="w-full px-3 py-2 rounded-lg bg-hti-bg border border-hti-border text-white text-sm placeholder:text-hti-gray/40 focus:outline-none focus:border-hti-primary"
              />
            </div>
            <div>
              <label className="block text-sm text-hti-gray mb-1">YouTube</label>
              <input
                type="url" value={settings.social_youtube || ''}
                onChange={e => update('social_youtube', e.target.value)}
                placeholder="https://youtube.com/@HardTalkIndiaa"
                className="w-full px-3 py-2 rounded-lg bg-hti-bg border border-hti-border text-white text-sm placeholder:text-hti-gray/40 focus:outline-none focus:border-hti-primary"
              />
            </div>
            <div>
              <label className="block text-sm text-hti-gray mb-1">Facebook</label>
              <input
                type="url" value={settings.social_facebook || ''}
                onChange={e => update('social_facebook', e.target.value)}
                placeholder="https://facebook.com/HardTalkIndia"
                className="w-full px-3 py-2 rounded-lg bg-hti-bg border border-hti-border text-white text-sm placeholder:text-hti-gray/40 focus:outline-none focus:border-hti-primary"
              />
            </div>
            <div>
              <label className="block text-sm text-hti-gray mb-1">Telegram</label>
              <input
                type="url" value={settings.social_telegram || ''}
                onChange={e => update('social_telegram', e.target.value)}
                placeholder="https://t.me/HardTalkIndia"
                className="w-full px-3 py-2 rounded-lg bg-hti-bg border border-hti-border text-white text-sm placeholder:text-hti-gray/40 focus:outline-none focus:border-hti-primary"
              />
            </div>
            <div>
              <label className="block text-sm text-hti-gray mb-1">WhatsApp</label>
              <input
                type="url" value={settings.social_whatsapp || ''}
                onChange={e => update('social_whatsapp', e.target.value)}
                placeholder="https://wa.me/..."
                className="w-full px-3 py-2 rounded-lg bg-hti-bg border border-hti-border text-white text-sm placeholder:text-hti-gray/40 focus:outline-none focus:border-hti-primary"
              />
            </div>
          </div>
        </div>

        {/* Donation */}
        <div className="card-glass rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Image className="w-5 h-5 text-amber-400" />
            <h2 className="font-semibold">Donation Settings</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-hti-gray mb-1">UPI ID</label>
              <input
                type="text" value={settings.donation_upi_id || ''}
                onChange={e => update('donation_upi_id', e.target.value)}
                placeholder="hardtalkindia@upi"
                className="w-full px-3 py-2 rounded-lg bg-hti-bg border border-hti-border text-white text-sm placeholder:text-hti-gray/40 focus:outline-none focus:border-hti-primary"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full btn-primary py-3.5 font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {saving ? 'Saving...' : <><Save className="w-4 h-4" /> Save All Settings</>}
        </button>
      </div>
    </AdminLayout>
  );
}
