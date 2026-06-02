import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Flame, TrendingUp, Video, Mail, PenTool, ArrowRight,
  Eye, Clock, ChevronRight, Play, ImageIcon
} from 'lucide-react';
import Layout, { useToastContext } from '@/components/layout/Layout';
import { getStories, getReels, getSiteSettings, subscribeNewsletter } from '@/lib/dataService';
import type { Story, Reel, SiteSettings } from '@/types/database';
import { StoryGridSkeleton, HeroSkeleton, ReelCardSkeleton } from '@/components/Skeleton';

const CATEGORIES = [
  'Women Safety', 'Crime', 'Politics', 'Ground Reports', 'Fake News Debunked', 'Survivor Stories'
];

const CATEGORY_ICONS: Record<string, string> = {
  'Women Safety': '#DC2626',
  'Crime': '#FF4500',
  'Politics': '#FF6B00',
  'Ground Reports': '#00C853',
  'Fake News Debunked': '#F59E0B',
  'Survivor Stories': '#3B82F6',
};

const DEFAULT_IMAGES: Record<string, string> = {
  'Women Safety': '/images/women-safety.jpg',
  'Crime': '/images/crime.jpg',
  'Politics': '/images/politics.jpg',
  'Ground Reports': '/images/ground-reports.jpg',
  'Fake News Debunked': '/images/fake-news.jpg',
  'Survivor Stories': '/images/survivor.jpg',
  'Video': '/images/video.jpg',
};

function StoryImage({ src, alt, className, category }: { src: string; alt: string; className?: string; category?: string }) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const getFallbackSrc = () => category && DEFAULT_IMAGES[category] ? DEFAULT_IMAGES[category] : DEFAULT_IMAGES['Video'];
  const imageSrc = error || !src ? getFallbackSrc() : src;
  return (
    <div className={`${className} relative overflow-hidden bg-hti-card`}>
      {!loaded && <div className="absolute inset-0 bg-hti-card animate-pulse flex items-center justify-center"><ImageIcon className="w-8 h-8 text-hti-gray/30" /></div>}
      <img src={imageSrc} alt={alt} className={`w-full h-full object-cover transition-all duration-500 ${loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`} onLoad={() => setLoaded(true)} onError={() => { if (!error) setError(true); else setLoaded(true); }} loading="lazy" />
    </div>
  );
}

const PLACEHOLDER_STORIES: Story[] = [
  { id: '1', title: 'Oh baby chalega? Zirakpur ma ladki ka khuleaam harassment', slug: 'zirakpur-harassment', content: '', excerpt: 'A shocking incident...', category: 'Women Safety', thumbnail_url: '', reel_url: null, author: 'HardTalkIndia', is_pinned: true, is_breaking: true, views_count: 12500, status: 'published', meta_title: null, meta_description: null, created_at: '2025-05-28T10:00:00Z', updated_at: '2025-05-28T10:00:00Z' },
  { id: '2', title: 'India ke liye asli khatra kya hai?', slug: 'india-real-threat', content: '', excerpt: 'An in-depth analysis...', category: 'Politics', thumbnail_url: '', reel_url: null, author: 'HardTalkIndia', is_pinned: false, is_breaking: false, views_count: 8900, status: 'published', meta_title: null, meta_description: null, created_at: '2025-05-27T08:00:00Z', updated_at: '2025-05-27T08:00:00Z' },
  { id: '3', title: 'Kya Indian Tourists ko Civic Sense sikhane ki zarurat hai?', slug: 'indian-tourists-civic-sense', content: '', excerpt: 'From littering...', category: 'Ground Reports', thumbnail_url: '', reel_url: null, author: 'HardTalkIndia', is_pinned: false, is_breaking: false, views_count: 7200, status: 'published', meta_title: null, meta_description: null, created_at: '2025-05-26T12:00:00Z', updated_at: '2025-05-26T12:00:00Z' },
  { id: '4', title: 'America ma ek Indian couple ke sath khuleaam badtameezi', slug: 'america-indian-couple-racism', content: '', excerpt: 'An Indian couple...', category: 'Crime', thumbnail_url: '', reel_url: null, author: 'HardTalkIndia', is_pinned: false, is_breaking: true, views_count: 15400, status: 'published', meta_title: null, meta_description: null, created_at: '2025-05-25T15:00:00Z', updated_at: '2025-05-25T15:00:00Z' },
  { id: '5', title: 'Toll plaza par aap sochte hai aap safe hai?', slug: 'toll-plaza-safety', content: '', excerpt: 'The reality...', category: 'Crime', thumbnail_url: '', reel_url: null, author: 'HardTalkIndia', is_pinned: false, is_breaking: false, views_count: 9800, status: 'published', meta_title: null, meta_description: null, created_at: '2025-05-24T09:00:00Z', updated_at: '2025-05-24T09:00:00Z' },
  { id: '6', title: 'Political satire: Jumla vs Reality', slug: 'political-satire-jumla', content: '', excerpt: 'A satirical take...', category: 'Politics', thumbnail_url: '', reel_url: null, author: 'HardTalkIndia', is_pinned: false, is_breaking: false, views_count: 6500, status: 'published', meta_title: null, meta_description: null, created_at: '2025-05-23T11:00:00Z', updated_at: '2025-05-23T11:00:00Z' },
];

const PLACEHOLDER_REELS: Reel[] = [
  { id: '1', title: 'Zirakpur harassment caught on camera', instagram_url: 'https://instagram.com/p/...', embed_code: null, category: 'Women Safety', thumbnail_url: '', views_count: 45000, is_featured: true, created_at: '2025-05-28T10:00:00Z' },
  { id: '2', title: 'Real face of Indian politics', instagram_url: 'https://instagram.com/p/...', embed_code: null, category: 'Politics', thumbnail_url: '', views_count: 32000, is_featured: true, created_at: '2025-05-27T08:00:00Z' },
  { id: '3', title: 'Civic sense fail - Tourist edition', instagram_url: 'https://instagram.com/p/...', embed_code: null, category: 'Ground Reports', thumbnail_url: '', views_count: 28000, is_featured: true, created_at: '2025-05-26T12:00:00Z' },
  { id: '4', title: 'Racism against Indians abroad', instagram_url: 'https://instagram.com/p/...', embed_code: null, category: 'Crime', thumbnail_url: '', views_count: 51000, is_featured: true, created_at: '2025-05-25T15:00:00Z' },
];

export default function Home() {
  const { addToast } = useToastContext();
  const [stories, setStories] = useState<Story[]>([]);
  const [reels, setReels] = useState<Reel[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    try {
      const [storiesData, reelsData, settingsData] = await Promise.all([
        getStories({ limit: 6 }).catch(() => []),
        getReels({ featured: true, limit: 4 }).catch(() => []),
        getSiteSettings().catch(() => null),
      ]);
      setStories(storiesData.length > 0 ? storiesData : PLACEHOLDER_STORIES);
      setReels(reelsData.length > 0 ? reelsData : PLACEHOLDER_REELS);
      setSettings(settingsData);
    } catch {
      setStories(PLACEHOLDER_STORIES);
      setReels(PLACEHOLDER_REELS);
    } finally { setLoading(false); }
  }

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribing(true);
    try {
      await subscribeNewsletter(email);
      addToast('Successfully subscribed!', 'success');
      setEmail('');
    } catch (err: any) { addToast(err.message || 'Failed', 'error'); }
    finally { setSubscribing(false); }
  };

  const featuredStory = stories.find(s => s.is_pinned) || stories[0];
  const breakingStory = stories.find(s => s.is_breaking);
  const getImageSrc = (story: Story) => story.thumbnail_url?.startsWith('http') ? story.thumbnail_url : DEFAULT_IMAGES[story.category] || DEFAULT_IMAGES['Video'];
  const getReelImageSrc = (reel: Reel) => reel.thumbnail_url?.startsWith('http') ? reel.thumbnail_url : DEFAULT_IMAGES[reel.category || 'Video'] || DEFAULT_IMAGES['Video'];

  return (
    <Layout>
      {breakingStory && (
        <div className="bg-hti-breaking/10 border-b border-hti-breaking/30">
          <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-3">
            <span className="shrink-0 px-2 py-0.5 bg-hti-breaking text-white text-xs font-bold uppercase tracking-wider rounded animate-pulse">Breaking</span>
            <Link to={`/story/${breakingStory.slug}`} className="text-sm text-white truncate hover:text-hti-primary transition-colors">{breakingStory.title}</Link>
            <ChevronRight className="w-4 h-4 text-hti-breaking shrink-0" />
          </div>
        </div>
      )}

      <section className="relative overflow-hidden py-16 sm:py-24 lg:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,69,0,0.08)_0%,_transparent_70%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {loading ? <HeroSkeleton /> : (
            <div className="text-center space-y-8 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-hti-primary/10 border border-hti-primary/20 text-hti-primary text-sm font-medium mb-4">
                <Flame className="w-4 h-4" /> {settings?.hero_subheadline || 'Ground Reality | No Filters | No Lies'}
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-tight"><span className="text-gradient">{settings?.hero_headline || 'The Voice of Unfiltered India'}</span></h1>
              <p className="text-lg sm:text-xl text-hti-gray max-w-2xl mx-auto leading-relaxed">No Filters &bull; No Lies &bull; Only Ground Reality. We bring you the stories mainstream media will not touch.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link to="/stories" className="btn-primary inline-flex items-center gap-2 text-base px-8 py-3.5">Read Latest Stories <ArrowRight className="w-5 h-5" /></Link>
                <Link to="/submit-story" className="btn-secondary inline-flex items-center gap-2 text-base px-8 py-3.5"><PenTool className="w-5 h-5" /> Submit Your Story</Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="py-8 border-y border-hti-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4"><TrendingUp className="w-5 h-5 text-hti-primary" /><h2 className="text-sm font-semibold uppercase tracking-wider text-hti-gray">Trending Topics</h2></div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => <Link key={cat} to={`/stories?category=${encodeURIComponent(cat)}`} className="px-4 py-2 rounded-lg bg-hti-card border border-hti-border text-sm text-hti-gray hover:text-white hover:border-hti-primary/50 hover:bg-hti-primary/5 transition-all duration-200">{cat}</Link>)}
          </div>
        </div>
      </section>

      {featuredStory && (
        <section className="py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-6"><Flame className="w-5 h-5 text-hti-primary" /><h2 className="text-xl sm:text-2xl font-bold">Featured Story</h2></div>
            <Link to={`/story/${featuredStory.slug}`} className="group block">
              <div className="card-glass rounded-2xl overflow-hidden">
                <div className="grid lg:grid-cols-2 gap-0">
                  <div className="aspect-video lg:aspect-auto relative overflow-hidden">
                    <StoryImage src={getImageSrc(featuredStory)} alt={featuredStory.title} category={featuredStory.category} className="w-full h-full group-hover:scale-105 transition-transform duration-500" />
                    {featuredStory.is_breaking && <span className="absolute top-4 left-4 px-3 py-1 bg-hti-breaking text-white text-xs font-bold uppercase rounded-md animate-pulse">Breaking</span>}
                  </div>
                  <div className="p-6 lg:p-8 flex flex-col justify-center">
                    <span className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: CATEGORY_ICONS[featuredStory.category] || '#FF4500' }}>{featuredStory.category}</span>
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 group-hover:text-hti-primary transition-colors leading-tight">{featuredStory.title}</h3>
                    <p className="text-hti-gray text-sm sm:text-base mb-6 line-clamp-3 leading-relaxed">{featuredStory.excerpt || 'Read the full story...'}</p>
                    <div className="flex items-center gap-4 text-xs text-hti-gray">
                      <span className="flex items-center gap-1.5"><Eye className="w-4 h-4" />{featuredStory.views_count?.toLocaleString() || 0} views</span>
                      <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{new Date(featuredStory.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3"><Flame className="w-5 h-5 text-hti-primary" /><h2 className="text-xl sm:text-2xl font-bold">Latest Stories</h2></div>
            <Link to="/stories" className="text-sm text-hti-primary hover:text-hti-orange flex items-center gap-1 transition-colors">View All <ArrowRight className="w-4 h-4" /></Link>
          </div>
          {loading ? <StoryGridSkeleton count={6} /> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {stories.map((story, index) => (
                <Link key={story.id} to={`/story/${story.slug}`} className="group card-glass rounded-xl overflow-hidden animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="aspect-video relative overflow-hidden">
                    <StoryImage src={getImageSrc(story)} alt={story.title} category={story.category} className="w-full h-full group-hover:scale-105 transition-transform duration-500" />
                    {story.is_breaking && <span className="absolute top-3 left-3 px-2 py-0.5 bg-hti-breaking text-white text-[10px] font-bold uppercase rounded animate-pulse">Breaking</span>}
                    <span className="absolute top-3 right-3 px-2 py-0.5 text-[10px] font-semibold uppercase rounded" style={{ backgroundColor: `${CATEGORY_ICONS[story.category] || '#FF4500'}22`, color: CATEGORY_ICONS[story.category] || '#FF4500' }}>{story.category}</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm sm:text-base mb-3 group-hover:text-hti-primary transition-colors line-clamp-2 leading-snug">{story.title}</h3>
                    <div className="flex items-center justify-between text-xs text-hti-gray">
                      <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{story.views_count?.toLocaleString() || 0}</span>
                      <span>{new Date(story.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-12 lg:py-16 border-t border-hti-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3"><Video className="w-5 h-5 text-hti-green" /><h2 className="text-xl sm:text-2xl font-bold">Video Highlights</h2></div>
            <Link to="/videos" className="text-sm text-hti-green hover:text-hti-primary flex items-center gap-1 transition-colors">View All <ArrowRight className="w-4 h-4" /></Link>
          </div>
          {loading ? <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">{Array.from({ length: 4 }).map((_, i) => <ReelCardSkeleton key={i} />)}</div> : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {reels.map((reel, index) => (
                <div key={reel.id} className="group card-glass rounded-xl overflow-hidden animate-fade-in cursor-pointer" style={{ animationDelay: `${index * 0.1}s` }} onClick={() => window.open(reel.instagram_url, '_blank')}>
                  <div className="aspect-[9/16] sm:aspect-[4/5] relative overflow-hidden">
                    <StoryImage src={getReelImageSrc(reel)} alt={reel.title} category={reel.category || 'Video'} className="w-full h-full group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-hti-primary/90 flex items-center justify-center group-hover:scale-110 transition-transform"><Play className="w-5 h-5 text-white ml-0.5" /></div>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-xs sm:text-sm line-clamp-2 group-hover:text-hti-primary transition-colors">{reel.title}</h3>
                    <p className="text-hti-gray text-xs mt-1">{reel.views_count?.toLocaleString() || 0} views</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card-glass rounded-2xl p-8 sm:p-12 lg:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,69,0,0.1)_0%,_transparent_70%)]" />
            <div className="relative space-y-6">
              <PenTool className="w-12 h-12 text-hti-primary mx-auto" />
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Aapki Awaaz, Hamari Zimmedari</h2>
              <p className="text-hti-gray max-w-xl mx-auto text-base sm:text-lg">Have a story that needs to be heard? Submit it anonymously or with your name. We verify, we publish, we amplify your voice.</p>
              <Link to="/submit-story" className="btn-primary inline-flex items-center gap-2 text-base px-8 py-4">Submit Your Story <ArrowRight className="w-5 h-5" /></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16 border-t border-hti-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card-glass rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,200,83,0.08)_0%,_transparent_70%)]" />
            <div className="relative space-y-6">
              <Mail className="w-12 h-12 text-hti-green mx-auto" />
              <h2 className="text-2xl sm:text-3xl font-bold">Join 10,000+ Truth Seekers</h2>
              <p className="text-hti-gray max-w-lg mx-auto">Get unfiltered ground reports delivered to your inbox. No spam, no bias - just reality.</p>
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required className="flex-1 px-4 py-3 rounded-lg bg-hti-bg border border-hti-border text-white placeholder:text-hti-gray/50 focus:outline-none focus:border-hti-green transition-colors" />
                <button type="submit" disabled={subscribing} className="btn-primary px-6 py-3 flex items-center justify-center gap-2 disabled:opacity-50">{subscribing ? 'Subscribing...' : 'Subscribe'} <ArrowRight className="w-4 h-4" /></button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}