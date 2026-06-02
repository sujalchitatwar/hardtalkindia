export interface Story {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  category: 'Women Safety' | 'Crime' | 'Politics' | 'Ground Reports' | 'Fake News Debunked' | 'Survivor Stories';
  thumbnail_url: string | null;
  reel_url: string | null;
  video_url: string | null;
  author: string;
  is_pinned: boolean;
  is_breaking: boolean;
  views_count: number;
  status: 'draft' | 'published' | 'archived';
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Submission {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  story_title: string;
  story_content: string;
  category: string;
  evidence_urls: string[] | null;
  is_anonymous: boolean;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes: string | null;
  submitted_at: string;
  reviewed_at: string | null;
}

export interface Reel {
  id: string;
  title: string;
  instagram_url: string | null;
  video_url: string | null;
  embed_code: string | null;
  category: string | null;
  thumbnail_url: string | null;
  views_count: number;
  is_featured: boolean;
  created_at: string;
}

export interface Subscriber {
  id: string;
  email: string;
  name: string | null;
  source: string;
  is_active: boolean;
  subscribed_at: string;
}

export interface Donation {
  id: string;
  donor_name: string | null;
  donor_email: string | null;
  amount: number | null;
  message: string | null;
  payment_status: 'pending' | 'completed' | 'failed';
  payment_id: string | null;
  donated_at: string;
}

export interface SiteSettings {
  id: number;
  hero_headline: string;
  hero_subheadline: string | null;
  hero_image_url: string | null;
  breaking_news_text: string | null;
  breaking_news_enabled: boolean;
  trending_topics: string[];
  donation_upi_id: string | null;
  donation_qr_url: string | null;
  social_instagram: string | null;
  social_twitter: string | null;
  social_youtube: string | null;
  social_facebook: string | null;
  social_telegram: string | null;
  social_whatsapp: string | null;
  updated_at: string;
}

export type Database = {
  public: {
    Tables: {
      stories: {
        Row: Story;
        Insert: Omit<Story, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Story>;
      };
      submissions: {
        Row: Submission;
        Insert: Omit<Submission, 'id' | 'submitted_at' | 'reviewed_at'>;
        Update: Partial<Submission>;
      };
      reels: {
        Row: Reel;
        Insert: Omit<Reel, 'id' | 'created_at'>;
        Update: Partial<Reel>;
      };
      subscribers: {
        Row: Subscriber;
        Insert: Omit<Subscriber, 'id' | 'subscribed_at'>;
        Update: Partial<Subscriber>;
      };
      donations: {
        Row: Donation;
        Insert: Omit<Donation, 'id' | 'donated_at'>;
        Update: Partial<Donation>;
      };
      site_settings: {
        Row: SiteSettings;
        Insert: Omit<SiteSettings, 'updated_at'>;
        Update: Partial<SiteSettings>;
      };
    };
  };
};
