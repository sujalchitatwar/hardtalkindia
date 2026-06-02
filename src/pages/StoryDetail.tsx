import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Eye, Clock, Share2, Bookmark, Flag,
  MessageCircle, ThumbsUp, ThumbsDown, Send,
  Facebook, Twitter, Linkedin, Link as LinkIcon,
  ChevronRight, Flame, ImageIcon
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { getStoryBySlug, getStories } from '@/lib/dataService';
import type { Story } from '@/types/database';

const CATEGORY_COLORS: Record<string, string> = {
  'Women Safety': '#DC2626', 'Crime': '#FF4500', 'Politics': '#FF6B00',
  'Ground Reports': '#00C853', 'Fake News Debunked': '#F59E0B', 'Survivor Stories': '#3B82F6',
};

const DEFAULT_IMAGES: Record<string, string> = {
  'Women Safety': '/images/women-safety.jpg', 'Crime': '/images/crime.jpg', 'Politics': '/images/politics.jpg',
  'Ground Reports': '/images/ground-reports.jpg', 'Fake News Debunked': '/images/fake-news.jpg', 'Survivor Stories': '/images/survivor.jpg',
};

const PLACEHOLDER_STORIES: Story[] = [
  { id: '1', title: 'Oh baby chalega? Zirakpur ma ladki ka khuleaam harassment', slug: 'zirakpur-harassment', content: '', excerpt: 'A shocking incident...', category: 'Women Safety', thumbnail_url: '', video_url: '', reel_url: null, author: 'HardTalkIndia', is_pinned: true, is_breaking: true, views_count: 12500, status: 'published', meta_title: null, meta_description: null, created_at: '2025-05-28T10:00:00Z', updated_at: '2025-05-28T10:00:00Z' },
  { id: '2', title: 'India ke liye asli khatra kya hai?', slug: 'india-real-threat', content: '', excerpt: 'An in-depth analysis...', category: 'Politics', thumbnail_url: '', video_url: '', reel_url: null, author: 'HardTalkIndia', is_pinned: false, is_breaking: false, views_count: 8900, status: 'published', meta_title: null, meta_description: null, created_at: '2025-05-27T08:00:00Z', updated_at: '2025-05-27T08:00:00Z' },
  { id: '3', title: 'Kya Indian Tourists ko Civic Sense sikhane ki zarurat hai?', slug: 'indian-tourists-civic-sense', content: '', excerpt: 'From littering...', category: 'Ground Reports', thumbnail_url: '', video_url: '', reel_url: null, author: 'HardTalkIndia', is_pinned: false, is_breaking: false, views_count: 7200, status: 'published', meta_title: null, meta_description: null, created_at: '2025-05-26T12:00:00Z', updated_at: '2025-05-26T12:00:00Z' },
  { id: '4', title: 'America ma ek Indian couple ke sath khuleaam badtameezi', slug: 'america-indian-couple-racism', content: '', excerpt: 'An Indian couple...', category: 'Crime', thumbnail_url: '', video_url: '', reel_url: null, author: 'HardTalkIndia', is_pinned: false, is_breaking: true, views_count: 15400, status: 'published', meta_title: null, meta_description: null, created_at: '2025-05-25T15:00:00Z', updated_at: '2025-05-25T15:00:00Z' },
  { id: '5', title: 'Toll plaza par aap sochte hai aap safe hai?', slug: 'toll-plaza-safety', content: '', excerpt: 'The reality...', category: 'Crime', thumbnail_url: '', video_url: '', reel_url: null, author: 'HardTalkIndia', is_pinned: false, is_breaking: false, views_count: 9800, status: 'published', meta_title: null, meta_description: null, created_at: '2025-05-24T09:00:00Z', updated_at: '2025-05-24T09:00:00Z' },
  { id: '6', title: 'Political satire: Jumla vs Reality', slug: 'political-satire-jumla', content: '', excerpt: 'A satirical take...', category: 'Politics', thumbnail_url: '', video_url: '', reel_url: null, author: 'HardTalkIndia', is_pinned: false, is_breaking: false, views_count: 6500, status: 'published', meta_title: null, meta_description: null, created_at: '2025-05-23T11:00:00Z', updated_at: '2025-05-23T11:00:00Z' },
];

function generateContent(story: Story): string {
  const contents: Record<string, string> = {
    'zirakpur-harassment': `Zirakpur, Punjab - A shocking incident of public harassment has come to light where a young woman was openly harassed by a group of men in broad daylight. The incident, which occurred near the main market area, has sparked massive outrage across social media platforms.

Eyewitnesses reported that the woman was walking alone when she was approached by the accused who passed lewd comments and attempted to physically restrain her. The brave victim managed to record parts of the incident on her phone before bystanders intervened.

"Main dar gayi thi, lekin chup nahi reh sakti thi," the victim told HardTalkIndia in an exclusive interview. "Agar hum chup rahenge, toh ye log aur badmaash hote jayenge."

Local police have registered an FIR under Sections 354, 509, and 34 of the IPC. The accused have been identified and two arrests have been made so far. The SHO of Zirakpur police station has assured swift action.

Women's rights activists have demanded stricter implementation of safety measures in the area. "This is not an isolated incident. Zirakpur has seen a rise in such cases," said Priya Sharma, a local activist.

The video has garnered over 2 million views on Instagram, with netizens demanding justice. Hashtags #JusticeForZirakpurGirl and #WomenSafety have been trending since yesterday.

We at HardTalkIndia demand immediate action and strict punishment for the accused. Women's safety is not a privilege, it is a fundamental right.`,

    'india-real-threat': `As India celebrates its growing global stature, HardTalkIndia brings you an unfiltered analysis of the real threats that could destabilize our nation. Beyond the headlines and political rhetoric, here are the ground realities.

INTERNAL THREATS:
The Naxal-Maoist insurgency continues to claim lives in Chhattisgarh, Jharkhand, and Odisha. Despite Operation Green Hunt, over 90 districts remain affected. The recent attack in Dantewada that killed 22 security personnel exposed the gaps in our counter-insurgency strategy.

ECONOMIC VULNERABILITIES:
India's dependence on foreign oil, the rising NPAs in banking sectors, and the informal economy that employs 90% of the workforce remain ticking time bombs. The agrarian crisis has pushed over 12,000 farmers to suicide annually.

CYBER WARFARE:
With 800 million internet users, India is a prime target. The 2020 Mumbai power grid attack, allegedly orchestrated by Chinese hackers, showed our critical infrastructure vulnerability. Our cyber defense budget remains less than 0.01% of GDP.

COMMUNAL TENSIONS:
The polarization along religious lines has reached alarming levels. The recent incidents in Manipur and Haryana show how quickly situations can escalate. Social media has become a breeding ground for hate speech and misinformation.

CLIMATE CHANGE:
India ranks 7th in the Global Climate Risk Index. The melting Himalayan glaciers, rising sea levels threatening coastal cities, and erratic monsoons affecting agriculture are existential threats that need immediate attention.

EXTERNAL THREATS:
The two-front war scenario with Pakistan and China remains the biggest military challenge. The PLA's buildup in Ladakh and Pakistan's continued support for cross-border terrorism keeps our defense forces on high alert.

HardTalkIndia believes in presenting the truth, however uncomfortable it may be. Only when we acknowledge our vulnerabilities can we work towards strengthening them.`,

    'indian-tourists-civic-sense': `From the pristine beaches of Bali to the historic streets of Rome, Indian tourists are making their presence felt globally. But not always for the right reasons. HardTalkIndia's ground report exposes the ugly truth behind Indian tourist behavior.

THE LITTER PROBLEM:
Our team visited 5 popular international destinations frequented by Indians. The result was shocking. At Pattaya Beach, Thailand, local authorities have put up Hindi signs warning against littering specifically for Indian tourists. "We had to install separate bins with Hindi labels," a municipal worker told us.

DISRESPECTING LOCAL CUSTOMS:
In Bali, temples have banned entry to Indian tour groups after incidents of inappropriate behavior. "They take selfies during prayers, wear revealing clothes despite warnings, and speak loudly," said a temple priest who wished to remain anonymous.

THE EVERYTHING IS NEGOTIABLE MINDSET:
Indian tourists' obsession with bargaining has become a global stereotype. From street vendors in Vietnam to luxury stores in Dubai, the best price demand is often accompanied by aggressive behavior. A shopkeeper in Istanbul told us, "Indians want 50% discount on items already marked down."

ALCOHOL AND PUBLIC DRUNKENNESS:
In Goa, which is considered India's party capital, locals are fed up. "They drink on beaches, create ruckus, and harass women," said a shack owner. The recent incident where a tourist drove a car into the sea while drunk went viral.

WHAT CAN BE DONE:
Travel experts suggest mandatory orientation sessions for tour groups, stricter enforcement of local laws, and a cultural sensitivity campaign. "Travel is a privilege, not a right. We must respect the places we visit," said travel blogger Ankita Kumar.

The Ministry of Tourism has launched the Atithi Devo Bhava campaign, but ground impact remains minimal. Until we change our mindset, Indian tourists will continue to be viewed as problematic.`,

    'america-indian-couple-racism': `New Jersey, USA - In a disturbing incident that has shaken the Indian diaspora, a couple from Gujarat faced blatant racism and physical assault while dining at a restaurant. What started as a verbal altercation escalated into a hate crime.

Rajesh Patel (34) and his wife Priya (31) were at a local diner when a group of white men started mocking their accent. "Go back to your country," one of them shouted before throwing a drink at Priya. When Rajesh intervened, he was punched in the face.

"Hum sirf khaana khaane aaye the," Rajesh told HardTalkIndia via video call, his face still bruised. "We never expected this in America. We pay taxes, we work hard, we are Americans too."

The incident was captured on CCTV and has since gone viral. The local police have arrested three suspects and charged them with hate crime, assault, and disorderly conduct. The FBI is also investigating the case as a possible federal hate crime.

The Indian Embassy in Washington has taken cognizance and demanded strict action. "We will not tolerate attacks on our citizens," said Ambassador Taranjit Singh Sandhu.

COMMUNITY RESPONSE:
The Indian community in New Jersey has organized a peaceful protest. Over 500 people gathered at the diner's location, holding placards reading "Hate Has No Home Here" and "We Belong."

"This is not the America we came to," said Dr. Amit Shah, a local physician who has lived in the US for 20 years. "The political rhetoric has emboldened racists."

The restaurant owner has apologized and banned the accused permanently. A GoFundMe campaign for the couple has raised over $50,000.`,

    'toll-plaza-safety': `National Highway 44, India's longest highway, sees millions of vehicles daily. But what happens at toll plazas when you stop to pay? HardTalkIndia's undercover investigation reveals the shocking reality.

THE DARK SIDE OF TOLL PLAZAS:
Our team spent 72 hours at various toll plazas across NH44. What we found was alarming. Poor lighting, isolated locations, and minimal security make toll plazas perfect targets for criminals.

Between 2 AM and 5 AM, when traffic is minimal, toll plazas become dangerous zones. We witnessed multiple incidents where truck drivers were robbed at knife-point. The CCTV cameras are either non-functional or strategically positioned to miss the actual crime spots.

THE STAFF ARE NOT SAFE EITHER:
Toll booth operators work in fear. "We have no security guards after midnight," said Ramesh, a toll operator near Agra. "Last month, our colleague was beaten up when he refused to let a truck pass without paying."

WOMEN AT RISK:
Women drivers are particularly vulnerable. The lack of proper lighting in the lanes, absence of panic buttons, and no security personnel make them easy targets. A recent incident near Jaipur where a woman was dragged out of her car at a toll plaza sent shockwaves across the country.

WHAT THE DATA SAYS:
RTI data reveals that over 2,000 crimes were reported at toll plazas in 2024 alone. These include robbery, assault, harassment, and even murder. The actual numbers are likely much higher as many cases go unreported.

THE SOLUTION:
Experts recommend 24/7 security deployment, functional CCTV with cloud backup, emergency SOS buttons every 500 meters, and better lighting infrastructure. The NHAI has promised upgrades, but implementation remains slow.

Until then, think twice before stopping at a toll plaza late at night. Your safety is in your own hands.`,

    'political-satire-jumla': `In the grand theater of Indian politics, promises are made with the enthusiasm of a Bollywood hero and forgotten with the speed of a TikTok trend. HardTalkIndia presents "Jumla vs Reality" - the unfiltered truth.

THE 15 LAKH PROMISE:
Remember the 2014 promise of depositing 15 lakh rupees in every Indian's account? The reality: Not a single rupee was deposited. The explanation: "It was just an idea, not a promise." The voters: Still waiting.

THE SMART CITY DREAM:
100 smart cities were promised. 11 years later, only 33 have been partially developed. The rest exist in PowerPoint presentations. The smart part seems to be limited to smart advertising.

THE FARMER INCOME DOUBLING:
Double farmers' income by 2022. Well, 2022 came and went. Farmer income increased by 27%, which is commendable but far from doubled. The farmers who protested at Delhi borders for a year might have a different opinion.

THE 2 CRORE JOBS PER YEAR:
This was the headline promise of 2014. The reality: India created approximately 12 million jobs in 10 years, averaging 1.2 million per year. The unemployment rate among graduates is at a 45-year high.

THE CLEAN GANGA MISSION:
Rs 20,000 crores allocated. The Ganga remains polluted. The crocodiles are probably filing environmental complaints. The only thing that flows freely is the funding.

THE BLACK MONEY BRING BACK:
Swiss bank accounts were supposed to be emptied into Indian coffers. The result: India's black money in Swiss banks increased by 50% since 2014. Maybe the banks offered a Buy 1 Get 1 Free scheme?

THE UNFILTERED TRUTH:
Politicians across parties are guilty of this. Jumlas are not exclusive to any one party. The Congress promised "Garibi Hatao" in 1971 - poverty still exists. The AAP promised free WiFi in Delhi - most of it does not work.

The real question is: When will we, the voters, stop falling for these jumlas and start demanding accountability? The power is in our hands, quite literally - it is called the voting machine.`,
  };

  return contents[story.slug] || `This is a detailed ground report on "${story.title}". Our team investigated this story extensively to bring you the unfiltered truth.

The incident has sparked widespread debate across social media platforms. Ground reality often differs significantly from mainstream media narratives. We spoke to multiple eyewitnesses and gathered evidence to present the complete picture.

${story.excerpt || 'Stay tuned for the full investigative report.'}

This story falls under our ${story.category} category. We verify every fact before publishing. If you have additional information about this story, please submit it through our platform.

HardTalkIndia - No Filters. No Lies. Only Ground Reality.`;
}

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

export default function StoryDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [story, setStory] = useState<Story | null>(null);
  const [relatedStories, setRelatedStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [comment, setComment] = useState('');
  const [showShare, setShowShare] = useState(false);

  useEffect(() => { if (slug) loadStory(); }, [slug]);

  async function loadStory() {
    setLoading(true);
    try {
      const storyData = await getStoryBySlug(slug!).catch(() => null);
      if (storyData) {
        setStory(storyData);
        const allStories = await getStories({ limit: 10 }).catch(() => []);
        setRelatedStories(allStories.filter(s => s.id !== storyData.id).slice(0, 3));
      } else {
        const fallbackStory = PLACEHOLDER_STORIES.find(s => s.slug === slug);
        if (fallbackStory) {
          setStory(fallbackStory);
          setRelatedStories(PLACEHOLDER_STORIES.filter(s => s.id !== fallbackStory.id).slice(0, 3));
        }
      }
    } catch {
      const fallbackStory = PLACEHOLDER_STORIES.find(s => s.slug === slug);
      if (fallbackStory) {
        setStory(fallbackStory);
        setRelatedStories(PLACEHOLDER_STORIES.filter(s => s.id !== fallbackStory.id).slice(0, 3));
      }
    } finally { setLoading(false); }
  }

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = story?.title || 'Check this story';
    switch (platform) {
      case 'facebook': window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank'); break;
      case 'twitter': window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank'); break;
      case 'linkedin': window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank'); break;
      case 'copy': navigator.clipboard.writeText(url); break;
    }
    setShowShare(false);
  };

  const handleComment = (e: React.FormEvent) => { e.preventDefault(); if (!comment.trim()) return; setComment(''); };
  const getImageSrc = (story: Story) => story.thumbnail_url?.startsWith('http') ? story.thumbnail_url : DEFAULT_IMAGES[story.category] || DEFAULT_IMAGES['Crime'];

  if (loading) {
    return (
      <Layout>
        <div className="pt-24 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-hti-card rounded w-3/4"></div>
              <div className="h-96 bg-hti-card rounded-2xl"></div>
              <div className="space-y-4"><div className="h-4 bg-hti-card rounded w-full"></div><div className="h-4 bg-hti-card rounded w-full"></div><div className="h-4 bg-hti-card rounded w-3/4"></div></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!story) {
    return (
      <Layout>
        <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Story Not Found</h1>
            <p className="text-hti-gray mb-8">The story you are looking for does not exist or has been removed.</p>
            <button onClick={() => navigate('/stories')} className="btn-primary inline-flex items-center gap-2"><ArrowLeft className="w-4 h-4" />Browse All Stories</button>
          </div>
        </div>
      </Layout>
    );
  }

  const content = generateContent(story);
  const paragraphs = content.split('\n\n');

  return (
    <Layout>
      <div className="pt-20 pb-4 border-b border-hti-border/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-hti-gray">
            <Link to="/" className="hover:text-hti-primary transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/stories" className="hover:text-hti-primary transition-colors">Stories</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white truncate">{story.title}</span>
          </div>
        </div>
      </div>

      <article className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider" style={{ backgroundColor: `${CATEGORY_COLORS[story.category] || '#FF4500'}22`, color: CATEGORY_COLORS[story.category] || '#FF4500' }}>{story.category}</span>
            {story.is_breaking && <span className="px-3 py-1 bg-hti-breaking text-white text-xs font-bold uppercase rounded-full animate-pulse">Breaking</span>}
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 leading-tight">{story.title}</h1>

          <div className="flex items-center justify-between mb-8 pb-6 border-b border-hti-border/50">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-hti-primary/20 flex items-center justify-center"><span className="text-hti-primary font-bold text-sm">HTI</span></div>
              <div><p className="text-sm font-medium">{story.author}</p><p className="text-xs text-hti-gray">{new Date(story.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p></div>
            </div>
            <div className="flex items-center gap-4 text-sm text-hti-gray">
              <span className="flex items-center gap-1.5"><Eye className="w-4 h-4" />{story.views_count?.toLocaleString() || 0}</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />5 min read</span>
            </div>
          </div>

          <div className="aspect-video rounded-2xl overflow-hidden mb-8">
            <StoryImage src={getImageSrc(story)} alt={story.title} category={story.category} className="w-full h-full" />
          </div>

          <div className="flex items-center justify-between mb-8 pb-6 border-b border-hti-border/50">
            <div className="flex items-center gap-2">
              <button onClick={() => setLiked(!liked)} className={`p-2 rounded-lg transition-colors ${liked ? 'bg-hti-primary/20 text-hti-primary' : 'bg-hti-card text-hti-gray hover:text-white'}`}><ThumbsUp className="w-5 h-5" /></button>
              <button className="p-2 rounded-lg bg-hti-card text-hti-gray hover:text-white transition-colors"><ThumbsDown className="w-5 h-5" /></button>
              <button onClick={() => setBookmarked(!bookmarked)} className={`p-2 rounded-lg transition-colors ${bookmarked ? 'bg-hti-primary/20 text-hti-primary' : 'bg-hti-card text-hti-gray hover:text-white'}`}><Bookmark className="w-5 h-5" /></button>
            </div>
            <div className="relative">
              <button onClick={() => setShowShare(!showShare)} className="p-2 rounded-lg bg-hti-card text-hti-gray hover:text-white transition-colors"><Share2 className="w-5 h-5" /></button>
              {showShare && (
                <div className="absolute right-0 top-12 bg-hti-card border border-hti-border rounded-xl p-3 shadow-xl z-50 min-w-[200px]">
                  <div className="space-y-2">
                    <button onClick={() => handleShare('facebook')} className="flex items-center gap-2 w-full p-2 rounded-lg hover:bg-hti-bg text-sm text-hti-gray hover:text-white transition-colors"><Facebook className="w-4 h-4" /> Facebook</button>
                    <button onClick={() => handleShare('twitter')} className="flex items-center gap-2 w-full p-2 rounded-lg hover:bg-hti-bg text-sm text-hti-gray hover:text-white transition-colors"><Twitter className="w-4 h-4" /> Twitter</button>
                    <button onClick={() => handleShare('linkedin')} className="flex items-center gap-2 w-full p-2 rounded-lg hover:bg-hti-bg text-sm text-hti-gray hover:text-white transition-colors"><Linkedin className="w-4 h-4" /> LinkedIn</button>
                    <button onClick={() => handleShare('copy')} className="flex items-center gap-2 w-full p-2 rounded-lg hover:bg-hti-bg text-sm text-hti-gray hover:text-white transition-colors"><LinkIcon className="w-4 h-4" /> Copy Link</button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="prose prose-invert max-w-none mb-12">
            {paragraphs.map((paragraph, index) => {
              if (paragraph.startsWith('THE ') || paragraph.startsWith('WHAT ') || paragraph.startsWith('COMMUNITY') || paragraph.startsWith('EXTERNAL') || paragraph.startsWith('INTERNAL') || paragraph.startsWith('ECONOMIC') || paragraph.startsWith('CYBER') || paragraph.startsWith('COMMUNAL') || paragraph.startsWith('CLIMATE')) {
                return <h2 key={index} className="text-xl sm:text-2xl font-bold mt-8 mb-4 text-hti-primary">{paragraph}</h2>;
              }
              return <p key={index} className="text-base sm:text-lg text-hti-gray leading-relaxed mb-4">{paragraph}</p>;
            })}
          </div>

          <div className="flex flex-wrap gap-2 mb-8 pb-6 border-b border-hti-border/50">
            {['HardTalkIndia', 'GroundReport', story.category, 'Unfiltered'].map(tag => <span key={tag} className="px-3 py-1 rounded-full bg-hti-card border border-hti-border text-xs text-hti-gray">#{tag}</span>)}
          </div>

          <div className="flex items-center justify-between mb-12">
            <button className="flex items-center gap-2 text-sm text-hti-gray hover:text-hti-breaking transition-colors"><Flag className="w-4 h-4" />Report this story</button>
            <Link to="/stories" className="flex items-center gap-2 text-sm text-hti-primary hover:text-hti-orange transition-colors"><ArrowLeft className="w-4 h-4" />Back to Stories</Link>
          </div>

          <div className="mb-12">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><MessageCircle className="w-5 h-5 text-hti-primary" />Comments (0)</h3>
            <form onSubmit={handleComment} className="mb-6">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-hti-primary/20 flex items-center justify-center shrink-0"><span className="text-hti-primary font-bold text-xs">U</span></div>
                <div className="flex-1">
                  <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share your thoughts..." className="w-full px-4 py-3 rounded-xl bg-hti-card border border-hti-border text-white placeholder:text-hti-gray/50 focus:outline-none focus:border-hti-primary transition-colors resize-none" rows={3} />
                  <div className="flex justify-end mt-2"><button type="submit" className="btn-primary inline-flex items-center gap-2 text-sm px-4 py-2"><Send className="w-4 h-4" />Post Comment</button></div>
                </div>
              </div>
            </form>
          </div>

          {relatedStories.length > 0 && (
            <div>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Flame className="w-5 h-5 text-hti-primary" />Related Stories</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedStories.map((relatedStory) => (
                  <Link key={relatedStory.id} to={`/story/${relatedStory.slug}`} className="group card-glass rounded-xl overflow-hidden">
                    <div className="aspect-video relative overflow-hidden">
                      <StoryImage src={getImageSrc(relatedStory)} alt={relatedStory.title} category={relatedStory.category} className="w-full h-full group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-3">
                      <h4 className="font-medium text-sm line-clamp-2 group-hover:text-hti-primary transition-colors">{relatedStory.title}</h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </Layout>
  );
}
