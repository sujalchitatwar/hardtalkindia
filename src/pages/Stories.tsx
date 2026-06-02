import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Eye, Clock, Filter, X, ImageIcon } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { getStories } from '@/lib/dataService';
import type { Story } from '@/types/database';
import { StoryGridSkeleton } from '@/components/Skeleton';

const CATEGORIES = ['All', 'Women Safety', 'Crime', 'Politics', 'Ground Reports', 'Fake News Debunked', 'Survivor Stories'];

const CATEGORY_COLORS: Record<string, string> = {
  'Women Safety': '#DC2626', 'Crime': '#FF4500', 'Politics': '#FF6B00',
  'Ground Reports': '#00C853', 'Fake News Debunked': '#F59E0B', 'Survivor Stories': '#3B82F6',
};

const DEFAULT_IMAGES: Record<string, string> = {
  'Women Safety': '/images/women-safety.jpg', 'Crime': '/images/crime.jpg', 'Politics': '/images/politics.jpg',
  'Ground Reports': '/images/ground-reports.jpg', 'Fake News Debunked': '/images/fake-news.jpg', 'Survivor Stories': '/images/survivor.jpg',
};

function StoryImage({ src, alt, className, category }: { src: string; alt: string; className?: string; category?: string }) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const getFallbackSrc = () => category && DEFAULT_IMAGES[category] ? DEFAULT_IMAGES[category] : '/images/crime.jpg';
  const imageSrc = error || !src ? getFallbackSrc() : src;
  return (
    <div className={`${className} relative overflow-hidden bg-hti-card`}>
      {!loaded && <div className="absolute inset-0 bg-hti-card animate-pulse flex items-center justify-center"><ImageIcon className="w-8 h-8 text-hti-gray/30" /></div>}
      <img src={imageSrc} alt={alt} className={`w-full h-full object-cover transition-all duration-500 ${loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`} onLoad={() => setLoaded(true)} onError={() => { if (!error) setError(true); else setLoaded(true); }} loading="lazy" />
    </div>
  );
}

export default function Stories() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const activeCategory = searchParams.get('category') || 'All';

  useEffect(() => { loadStories(); }, [activeCategory]);

  async function loadStories() {
    setLoading(true);
    try {
      const data = await getStories({ category: activeCategory === 'All' ? undefined : activeCategory, limit: 50 });
      setStories(data);
    } catch { setStories([]); }
    finally { setLoading(false); }
  }

  const filteredStories = stories.filter(s => searchQuery === '' || s.title.toLowerCase().includes(searchQuery.toLowerCase()) || s.category.toLowerCase().includes(searchQuery.toLowerCase()));

  const setCategory = (cat: string) => {
    if (cat === 'All') searchParams.delete('category');
    else searchParams.set('category', cat);
    setSearchParams(searchParams);
  };

  const getImageSrc = (story: Story) => story.thumbnail_url?.startsWith('http') ? story.thumbnail_url : DEFAULT_IMAGES[story.category] || DEFAULT_IMAGES['Crime'];

  return (
    <Layout>
      <section className="pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div><h1 className="text-3xl sm:text-4xl font-bold mb-2">Stories</h1><p className="text-hti-gray">Ground reports, investigations, and citizen journalism</p></div>
            <div className="text-sm text-hti-gray">{filteredStories.length} {filteredStories.length === 1 ? 'story' : 'stories'}</div>
          </div>
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-hti-gray" />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search stories by title or category..." className="w-full pl-12 pr-4 py-3 rounded-xl bg-hti-card border border-hti-border text-white placeholder:text-hti-gray/50 focus:outline-none focus:border-hti-primary transition-colors" />
            {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-hti-gray hover:text-white"><X className="w-5 h-5" /></button>}
          </div>
          <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
            <Filter className="w-4 h-4 text-hti-gray shrink-0" />
            {CATEGORIES.map((cat) => <button key={cat} onClick={() => setCategory(cat)} className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${activeCategory === cat ? 'bg-hti-primary text-white' : 'bg-hti-card border border-hti-border text-hti-gray hover:text-white hover:border-hti-primary/50'}`}>{cat}</button>)}
          </div>
        </div>
      </section>
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? <StoryGridSkeleton count={9} /> : filteredStories.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-hti-gray text-lg">No stories found</p>
              {searchQuery && <button onClick={() => setSearchQuery('')} className="mt-4 text-hti-primary hover:underline">Clear search</button>}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStories.map((story, index) => (
                <Link key={story.id} to={`/story/${story.slug}`} className="group card-glass rounded-xl overflow-hidden animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                  <div className="aspect-video relative overflow-hidden">
                    <StoryImage src={getImageSrc(story)} alt={story.title} category={story.category} className="w-full h-full group-hover:scale-105 transition-transform duration-500" />
                    {story.is_breaking && <span className="absolute top-3 left-3 px-2 py-0.5 bg-hti-breaking text-white text-[10px] font-bold uppercase rounded animate-pulse">Breaking</span>}
                    <span className="absolute top-3 right-3 px-2 py-0.5 text-[10px] font-semibold uppercase rounded backdrop-blur-sm" style={{ backgroundColor: `${CATEGORY_COLORS[story.category] || '#FF4500'}33`, color: CATEGORY_COLORS[story.category] || '#FF4500' }}>{story.category}</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm sm:text-base mb-3 group-hover:text-hti-primary transition-colors line-clamp-2 leading-snug">{story.title}</h3>
                    <div className="flex items-center justify-between text-xs text-hti-gray">
                      <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{story.views_count?.toLocaleString() || 0}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{new Date(story.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}