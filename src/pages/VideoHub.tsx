import { useEffect, useState } from 'react';
import { Play, Eye, TrendingUp, ImageIcon } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { getReels } from '@/lib/dataService';
import type { Reel } from '@/types/database';
import { ReelCardSkeleton } from '@/components/Skeleton';

// LOCAL IMAGES - Copy these to public/images/ folder
const DEFAULT_IMAGES: Record<string, string> = {
  'Women Safety': '/images/women-safety.jpg',
  'Crime': '/images/crime.jpg',
  'Politics': '/images/politics.jpg',
  'Ground Reports': '/images/ground-reports.jpg',
  'Fake News Debunked': '/images/fake-news.jpg',
  'Survivor Stories': '/images/survivor.jpg',
  'Video': '/images/video.jpg',
};

// Image component with error handling and fallback
function ReelImage({ src, alt, className, category }: { src: string; alt: string; className?: string; category?: string }) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const getFallbackSrc = () => {
    if (category && DEFAULT_IMAGES[category]) return DEFAULT_IMAGES[category];
    return DEFAULT_IMAGES['Video'];
  };

  const imageSrc = error || !src ? getFallbackSrc() : src;

  return (
    <div className={`${className} relative overflow-hidden bg-hti-card`}>
      {!loaded && (
        <div className="absolute inset-0 bg-hti-card animate-pulse flex items-center justify-center">
          <ImageIcon className="w-8 h-8 text-hti-gray/30" />
        </div>
      )}
      <img
        src={imageSrc}
        alt={alt}
        className={`w-full h-full object-cover transition-all duration-500 ${loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
        onLoad={() => setLoaded(true)}
        onError={() => {
          if (!error) setError(true);
          else setLoaded(true);
        }}
        loading="lazy"
      />
    </div>
  );
}

const PLACEHOLDER_REELS: Reel[] = [
  { id: '1', title: 'Zirakpur harassment caught on camera', instagram_url: 'https://instagram.com/HardTalkIndia', embed_code: null, category: 'Women Safety', thumbnail_url: '', views_count: 45000, is_featured: true, created_at: '2025-05-28T10:00:00Z' },
  { id: '2', title: 'Real face of Indian politics', instagram_url: 'https://instagram.com/HardTalkIndia', embed_code: null, category: 'Politics', thumbnail_url: '', views_count: 32000, is_featured: true, created_at: '2025-05-27T08:00:00Z' },
  { id: '3', title: 'Civic sense fail - Tourist edition', instagram_url: 'https://instagram.com/HardTalkIndia', embed_code: null, category: 'Ground Reports', thumbnail_url: '', views_count: 28000, is_featured: true, created_at: '2025-05-26T12:00:00Z' },
  { id: '4', title: 'Racism against Indians abroad', instagram_url: 'https://instagram.com/HardTalkIndia', embed_code: null, category: 'Crime', thumbnail_url: '', views_count: 51000, is_featured: true, created_at: '2025-05-25T15:00:00Z' },
  { id: '5', title: 'Toll plaza reality check', instagram_url: 'https://instagram.com/HardTalkIndia', embed_code: null, category: 'Crime', thumbnail_url: '', views_count: 22000, is_featured: false, created_at: '2025-05-24T09:00:00Z' },
  { id: '6', title: 'Survivor story: She fought back', instagram_url: 'https://instagram.com/HardTalkIndia', embed_code: null, category: 'Survivor Stories', thumbnail_url: '', views_count: 38000, is_featured: true, created_at: '2025-05-23T11:00:00Z' },
  { id: '7', title: 'Fake news debunked: The truth', instagram_url: 'https://instagram.com/HardTalkIndia', embed_code: null, category: 'Fake News Debunked', thumbnail_url: '', views_count: 19000, is_featured: false, created_at: '2025-05-22T14:00:00Z' },
  { id: '8', title: 'Police system failure exposed', instagram_url: 'https://instagram.com/HardTalkIndia', embed_code: null, category: 'Crime', thumbnail_url: '', views_count: 41000, is_featured: true, created_at: '2025-05-21T10:00:00Z' },
];

export default function VideoHub() {
  const [reels, setReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadReels(); }, []);

  async function loadReels() {
    try {
      const data = await getReels({ limit: 20 });
      setReels(data.length > 0 ? data : PLACEHOLDER_REELS);
    } catch {
      setReels(PLACEHOLDER_REELS);
    } finally { setLoading(false); }
  }

  const featuredReels = reels.filter(r => r.is_featured);
  const regularReels = reels.filter(r => !r.is_featured);

  const getImageSrc = (reel: Reel) => {
    if (reel.thumbnail_url && reel.thumbnail_url.trim().startsWith('http')) {
      return reel.thumbnail_url;
    }
    return DEFAULT_IMAGES[reel.category || 'Video'] || DEFAULT_IMAGES['Video'];
  };

  return (
    <Layout>
      <section className="pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6 text-hti-green" />
            <h1 className="text-3xl sm:text-4xl font-bold">Video Hub</h1>
          </div>
          <p className="text-hti-gray mb-8">Watch our latest ground reports and investigative videos</p>
        </div>
      </section>

      {/* Featured Reels */}
      {featuredReels.length > 0 && (
        <section className="pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-hti-primary animate-pulse" />
              Featured
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {featuredReels.map((reel, i) => (
                <ReelCard key={reel.id} reel={reel} src={getImageSrc(reel)} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Reels */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-semibold mb-4">All Videos</h2>
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => <ReelCardSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {regularReels.map((reel, i) => (
                <ReelCard key={reel.id} reel={reel} src={getImageSrc(reel)} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}

function ReelCard({ reel, src, index }: { reel: Reel; src: string; index: number }) {
  const link = reel.instagram_url || '#';

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="group card-glass rounded-xl overflow-hidden animate-fade-in block"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="aspect-[9/16] sm:aspect-[4/5] relative overflow-hidden">
        <ReelImage
          src={src}
          alt={reel.title}
          category={reel.category || 'Video'}
          className="w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-hti-primary/90 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Play className="w-5 h-5 text-white ml-0.5" />
          </div>
        </div>
        {reel.category && (
          <span className="absolute top-3 left-3 px-2 py-0.5 bg-black/60 backdrop-blur-sm text-white text-[10px] font-semibold uppercase rounded">
            {reel.category}
          </span>
        )}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-0.5 bg-black/60 backdrop-blur-sm rounded text-white text-[10px]">
          <Eye className="w-3 h-3" />
          {(reel.views_count || 0) >= 1000 ? `${((reel.views_count || 0) / 1000).toFixed(1)}K` : reel.views_count || 0}
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-medium text-xs sm:text-sm line-clamp-2 group-hover:text-hti-primary transition-colors">
          {reel.title}
        </h3>
      </div>
    </a>
  );
}