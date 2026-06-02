import { supabase, supabaseUntyped } from './supabase';
import type { Story, Submission, Reel, Subscriber, Donation, SiteSettings } from '@/types/database';

// ==================== STORIES ====================

export async function getStories(options?: {
  category?: string;
  limit?: number;
  status?: string;
  isBreaking?: boolean;
  isPinned?: boolean;
}): Promise<Story[]> {
  let query = supabase
    .from('stories')
    .select('*')
    .eq('status', options?.status || 'published')
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false });

  if (options?.category) {
    query = query.eq('category', options.category);
  }
  if (options?.isBreaking) {
    query = query.eq('is_breaking', true);
  }
  if (options?.isPinned) {
    query = query.eq('is_pinned', true);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data as Story[]) || [];
}

export async function getStoryBySlug(slug: string): Promise<Story | null> {
  const { data, error } = await supabase
    .from('stories')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error) return null;
  return data as Story;
}

export async function incrementViews(slug: string): Promise<void> {
  await supabase.rpc('increment_story_views', { story_slug: slug } as any);
}

export async function getRelatedStories(category: string, excludeSlug: string, limit: number = 3): Promise<Story[]> {
  const { data, error } = await supabase
    .from('stories')
    .select('*')
    .eq('category', category)
    .eq('status', 'published')
    .neq('slug', excludeSlug)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data as Story[]) || [];
}

// ==================== SUBMISSIONS ====================

export async function createSubmission(submission: {
  name?: string;
  email?: string;
  phone?: string;
  story_title: string;
  story_content: string;
  category: string;
  evidence_urls?: string[];
  is_anonymous?: boolean;
}): Promise<Submission | null> {
  const { data, error } = await supabaseUntyped
    .from('submissions')
    .insert([submission])
    .select()
    .single();

  if (error) throw error;
  return data as Submission;
}

export async function getSubmissions(status?: string): Promise<Submission[]> {
  let query = supabase
    .from('submissions')
    .select('*')
    .order('submitted_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data as Submission[]) || [];
}

export async function updateSubmissionStatus(id: string, status: string, adminNotes?: string): Promise<void> {
  const update: any = { status, reviewed_at: new Date().toISOString() };
  if (adminNotes) update.admin_notes = adminNotes;

  const { error } = await supabaseUntyped
    .from('submissions')
    .update(update)
    .eq('id', id);

  if (error) throw error;
}

// ==================== REELS ====================

export async function getReels(options?: { featured?: boolean; limit?: number }): Promise<Reel[]> {
  let query = supabase
    .from('reels')
    .select('*')
    .order('created_at', { ascending: false });

  if (options?.featured) {
    query = query.eq('is_featured', true);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data as Reel[]) || [];
}

// ==================== SUBSCRIBERS ====================

export async function subscribeNewsletter(email: string, name?: string): Promise<Subscriber | null> {
  const { data, error } = await supabaseUntyped
    .from('subscribers')
    .insert([{ email, name: name || null, source: 'website' }])
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      throw new Error('You are already subscribed!');
    }
    throw error;
  }
  return data as Subscriber;
}

export async function getSubscribers(): Promise<Subscriber[]> {
  const { data, error } = await supabase
    .from('subscribers')
    .select('*')
    .order('subscribed_at', { ascending: false });

  if (error) throw error;
  return (data as Subscriber[]) || [];
}

// ==================== DONATIONS ====================

export async function createDonation(donation: {
  donor_name?: string;
  donor_email?: string;
  amount: number;
  message?: string;
  payment_id?: string;
  payment_status?: string;
}): Promise<Donation | null> {
  const { data, error } = await supabaseUntyped
    .from('donations')
    .insert([donation])
    .select()
    .single();

  if (error) throw error;
  return data as Donation;
}

export async function getDonations(): Promise<Donation[]> {
  const { data, error } = await supabase
    .from('donations')
    .select('*')
    .order('donated_at', { ascending: false });

  if (error) throw error;
  return (data as Donation[]) || [];
}

// ==================== SITE SETTINGS ====================

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .eq('id', 1)
    .single();

  if (error) return null;
  return data as SiteSettings;
}

// ==================== STORAGE ====================

export async function uploadEvidence(file: File): Promise<string | null> {
  const fileName = `${Date.now()}_${file.name}`;
  const { error } = await supabase.storage
    .from('evidence')
    .upload(fileName, file);

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from('evidence')
    .getPublicUrl(fileName);

  return publicUrl;
}

// ==================== ANALYTICS ====================

export async function getAnalytics(): Promise<{
  totalViews: number;
  totalStories: number;
  pendingSubmissions: number;
  totalSubscribers: number;
  totalDonations: number;
  recentStories: Story[];
}> {
  const [
    { data: storiesData },
    { data: submissionsData },
    { data: subscribersData },
    { data: donationsData }
  ] = await Promise.all([
    supabase.from('stories').select('*').eq('status', 'published').order('created_at', { ascending: false }).limit(5),
    supabase.from('submissions').select('id').eq('status', 'pending'),
    supabase.from('subscribers').select('id').eq('is_active', true),
    supabase.from('donations').select('amount').eq('payment_status', 'completed')
  ]);

  const totalViews = ((storiesData as Story[]) || []).reduce((sum, s) => sum + (s.views_count || 0), 0);
  const totalDonations = ((donationsData as any[]) || []).reduce((sum, d) => sum + Number(d.amount || 0), 0);

  return {
    totalViews,
    totalStories: (storiesData as Story[])?.length || 0,
    pendingSubmissions: (submissionsData as any[])?.length || 0,
    totalSubscribers: (subscribersData as any[])?.length || 0,
    totalDonations,
    recentStories: (storiesData as Story[]) || []
  };
}
