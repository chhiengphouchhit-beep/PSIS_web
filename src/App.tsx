/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  getPersistedNews, getPersistedCampuses,
  getPersistedImageAssets,
  INITIAL_CAMPUSES,
  ACADEMIC_PROGRAMS,
  STEM_RESOURCES,
} from './mockData';
import { Campus, ImageAsset, NewsItem } from './types';

// Import modular UI elements
import Header from './components/Header';
import Footer from './components/Footer';
import FooterSlider from './components/FooterSlider';
import CampusesSection from './components/CampusesSection';
import GroupGovernance from './components/GroupGovernance';
import PartnerLogoSection from './components/PartnerLogoSection';
import PublicAcademic from './components/PublicAcademic';
import PublicPUC from './components/PublicPUC';
import PublicDigital from './components/PublicDigital';
import PublicStem from './components/PublicStem';
import InquiryForm from './components/InquiryForm';
import CareersSection from './components/CareersSection';
import StudentLifeSection from './components/StudentLifeSection';
import TestimonialsSection from './components/TestimonialsSection';
import FloatingCTA from './components/FloatingCTA';
import AdmissionAssistant from './components/AdmissionAssistant';
import CampusDetailPages from './components/CampusDetailPages';
import { ImageLibraryItem, useGoogleSheetCMS } from './services/googleSheet';
import { getCmsAssets, isSupabaseConfigured } from './lib/supabase';

function mapAssetTypeToCategory(type: string): ImageAsset['category'] {
  switch (type) {
    case 'hero': return 'Hero Banner';
    case 'campus': return 'Campus Image';
    case 'gallery': return 'Campus Gallery';
    case 'partner': return 'Partner Logo';
    case 'logo': return 'AYLA Logo';
    case 'news': return 'News';
    case 'student-life': return 'Student Life';
    default: return 'Campus Gallery';
  }
}

function cleanMergedAssets(assets: ImageAsset[]): ImageAsset[] {
  const grouped = new Map<string, ImageAsset>();
  for (const asset of assets) {
    const key = `${asset.category}-${asset.campus || ''}-${asset.priority || 1}`;
    const existing = grouped.get(key);
    if (!existing) {
      grouped.set(key, asset);
    } else {
      const isNewSupabase = asset.url.includes('supabase.co');
      const isExistingSupabase = existing.url.includes('supabase.co');
      if (isNewSupabase && !isExistingSupabase) {
        grouped.set(key, asset);
      } else if (!isNewSupabase && !isExistingSupabase) {
        if (new Date(asset.createdAt) > new Date(existing.createdAt)) {
          grouped.set(key, asset);
        }
      }
    }
  }
  return Array.from(grouped.values());
}

import { 
  ChevronLeft, ChevronRight,
  MapPin, Phone, Mail,
} from 'lucide-react';

type HeroSlide = Pick<ImageLibraryItem, 'id' | 'title' | 'directImageUrl'>;
type EditableGalleryImage = {
  id: string;
  title: string;
  url: string;
  tag: string;
  category: ImageAsset['category'];
  campus: string;
  sheetId?: number;
};

function itemToImageAsset(item: ImageLibraryItem): ImageAsset {
  return {
    id: String(item.id),
    title: item.title,
    url: item.directImageUrl,
    originalUrl: item.imageUrl,
    category: item.category as ImageAsset['category'],
    campus: item.campus,
    priority: item.priority,
    status: item.status,
    createdAt: item.createdAt,
    storageProvider: 'google-drive',
  };
}

function normalizeCampusIdentifier(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function campusAssetMatchesCampus(asset: ImageAsset, campus: Campus): boolean {
  const assetCampus = normalizeCampusIdentifier(asset.campus || '');
  const campusName = normalizeCampusIdentifier(campus.name);
  const campusCode = normalizeCampusIdentifier(campus.code);
  const campusId = normalizeCampusIdentifier(campus.id);
  if (!assetCampus) return false;

  return (
    assetCampus === campusCode ||
    assetCampus === campusId ||
    assetCampus === campusName ||
    campusName.includes(assetCampus) ||
    assetCampus.includes(campusName)
  );
}

function campusTitleMatchesCampus(asset: ImageAsset, campus: Campus): boolean {
  const assetTitle = normalizeCampusIdentifier(asset.title || '');
  const campusName = normalizeCampusIdentifier(campus.name);
  const campusCode = normalizeCampusIdentifier(campus.code);
  const campusId = normalizeCampusIdentifier(campus.id);
  if (!assetTitle) return false;

  return (
    assetTitle === campusCode ||
    assetTitle === campusId ||
    assetTitle.includes(campusCode) ||
    assetTitle.includes(campusId) ||
    assetTitle.includes(campusName)
  );
}

function sortImageAssetsByPriority(items: ImageAsset[]): ImageAsset[] {
  return [...items].sort((a, b) => {
    const priorityDiff = (a.priority || 9999) - (b.priority || 9999);
    if (priorityDiff !== 0) return priorityDiff;
    return String(a.id || a.title || '').localeCompare(String(b.id || b.title || ''));
  });
}

function HeroCarousel({
  slides,
  fallbackImage,
  isLoading,
}: {
  slides: HeroSlide[];
  fallbackImage: string;
  isLoading: boolean;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const hasMultipleSlides = slides.length > 1;

  useEffect(() => {
    setActiveIndex(0);
  }, [slides.length]);

  useEffect(() => {
    if (!hasMultipleSlides || isPaused) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [hasMultipleSlides, isPaused, slides.length]);

  function showPrevious() {
    setActiveIndex((current) => (current - 1 + slides.length) % slides.length);
  }

  function showNext() {
    setActiveIndex((current) => (current + 1) % slides.length);
  }

  function handleTouchEnd(clientX: number) {
    if (touchStartX === null || !hasMultipleSlides) return;

    const distance = touchStartX - clientX;
    if (Math.abs(distance) > 45) {
      distance > 0 ? showNext() : showPrevious();
    }
    setTouchStartX(null);
  }

  return (
    <div
      className="absolute inset-0 z-0"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={(event) => setTouchStartX(event.touches[0]?.clientX ?? null)}
      onTouchEnd={(event) => handleTouchEnd(event.changedTouches[0]?.clientX ?? 0)}
    >
      {isLoading && (
        <div className="absolute inset-0 animate-pulse bg-[#12308F]" />
      )}

      <div className="absolute inset-x-0 top-0 h-[42vh] bg-[radial-gradient(ellipse_at_top,_rgba(230,184,62,0.18),transparent_55%)] opacity-80" />

      {slides.map((slide, index) => (
        <img
          key={slide.id}
          src={slide.directImageUrl}
          alt={slide.title || 'PSIS hero banner'}
          className={`absolute inset-0 h-full w-full object-cover filter brightness-75 contrast-125 scale-102 transition-opacity duration-1000 ease-out ${
            index === activeIndex ? 'opacity-45' : 'opacity-0'
          }`}
          referrerPolicy="no-referrer"
          onError={(event) => {
            event.currentTarget.src = fallbackImage;
          }}
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-b from-[#071B5C]/70 via-[#071B5C]/76 to-[#071B5C]"></div>
      <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-[#071B5C]/20 via-[#071B5C]/35 to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-5"></div>

      {hasMultipleSlides && (
        <>
          <button
            type="button"
            onClick={showPrevious}
            className="absolute left-4 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20 md:flex"
            aria-label="Previous hero banner"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            type="button"
            onClick={showNext}
            className="absolute right-4 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20 md:flex"
            aria-label="Next hero banner"
          >
            <ChevronRight size={22} />
          </button>
          <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`h-2.5 rounded-full transition-all ${
                  index === activeIndex ? 'w-8 bg-brand-gold' : 'w-2.5 bg-white/35 hover:bg-white/60'
                }`}
                aria-label={`Go to hero banner ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const psisVideos = [
  {
    id: 'vid1',
    title: 'PSIS Campus Virtual Walkthrough',
    khmerTitle: 'ទស្សនាសកម្មភាពសាលា និងទិដ្ឋភាពថ្នាក់រៀន',
    youtubeId: 'nygRAxjN2h4',
    gradient: 'from-[#071B5C] to-[#1E3A8A]',
    duration: '3:12'
  },
  {
    id: 'vid2',
    title: 'Interactive Classrooms & STEM Lab',
    khmerTitle: 'សកម្មភាពថ្នាក់សិក្សា និងការអនុវត្តមន្ទីរពិសោធន៍',
    youtubeId: 'SKNsHm0qdug',
    gradient: 'from-[#1E3A8A] to-[#C5A059]',
    duration: '2:45'
  },
  {
    id: 'vid3',
    title: 'PSIS Annual Sports Day & Activities',
    khmerTitle: 'ទិដ្ឋភាពកម្មវិធីកីឡា និងសកម្មភាពក្រៅម៉ោងសិក្សា',
    youtubeId: 'lVY5nzzkBZ8',
    gradient: 'from-[#8B1E1E] to-[#051445]',
    duration: '4:08'
  },
  {
    id: 'vid4',
    title: 'PSIS Charity Projects & Study Tours',
    khmerTitle: 'កម្មវិធីមនុស្សធម៌ និងដំណើរកម្សាន្តសិក្សា',
    youtubeId: 'shJkZFEQGho',
    gradient: 'from-[#051445] to-[#1E3A8A]',
    duration: '3:34'
  },
  {
    id: 'vid5',
    title: 'Paññāsāstra Graduation Highlights',
    khmerTitle: 'ទិដ្ឋភាពទិវាបញ្ចប់ការសិក្សាដ៏ជោគជ័យ',
    youtubeId: 'TjM8iywJxMA',
    gradient: 'from-[#C5A059] to-[#071B5C]',
    duration: '5:15'
  }
];

function FacebookPost({ item, lang }: { key?: string; item: NewsItem; lang: 'en' | 'kh' }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(() => Math.floor(Math.random() * 80) + 45);
  const [sharesCount] = useState(() => Math.floor(Math.random() * 8) + 2);
  const [showComments, setShowComments] = useState(true);
  const [commentInput, setCommentInput] = useState('');
  const [comments, setComments] = useState<{ id: string; author: string; avatarChar: string; text: string; date: string }[]>([
    {
      id: 'c1',
      author: lang === 'en' ? 'Sothea Kim' : 'គឹម សុធា',
      avatarChar: 'S',
      text: lang === 'en' ? 'Great pathway to PUC! My son registered last week.' : 'គន្លងផ្លូវសិក្សាល្អណាស់ទៅកាន់ PUC! កូនប្រុសខ្ញុំបានចុះឈ្មោះកាលពីសប្តាហ៍មុន។',
      date: lang === 'en' ? '2h ago' : '២ម៉ោងមុន'
    },
    {
      id: 'c2',
      author: lang === 'en' ? 'David Miller' : 'ដេវីត មីល័រ',
      avatarChar: 'D',
      text: lang === 'en' ? 'Amazing robotics classroom, the kids love drone programming!' : 'ថ្នាក់រៀនរ៉ូបូតប្លែកនិងល្អណាស់ កូនៗចូលចិត្តការបញ្ជាដ្រូនខ្លាំងណាស់!',
      date: lang === 'en' ? '5h ago' : '៥ម៉ោងមុន'
    }
  ]);

  const toggleLike = () => {
    if (liked) {
      setLiked(false);
      setLikeCount(prev => prev - 1);
    } else {
      setLiked(true);
      setLikeCount(prev => prev + 1);
    }
  };

  const handlePostComment = (e: any) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    
    const newComment = {
      id: `c-${Date.now()}`,
      author: lang === 'en' ? 'Parent Guest' : 'អាណាព្យាបាលសិស្ស',
      avatarChar: 'P',
      text: commentInput.trim(),
      date: lang === 'en' ? 'Just now' : 'មុននេះបន្តិច'
    };
    
    setComments(prev => [...prev, newComment]);
    setCommentInput('');
  };

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm p-4 md:p-5 space-y-4">
      {/* Post Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {/* Circular School Logo Avatar */}
          <div className="w-10 h-10 rounded-full bg-brand-blue flex items-center justify-center text-brand-gold border border-brand-gold/25 shadow-inner shrink-0 select-none">
            <span className="font-serif font-black text-xs">P</span>
          </div>
          <div className="ml-3 text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-xs md:text-sm font-extrabold text-slate-800 font-sans tracking-tight">
                Paññāsāstra International School - PSIS
              </span>
              {/* Blue Verification Check */}
              <svg className="w-3.5 h-3.5 text-blue-500 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            </div>
            <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5 mt-0.5">
              <span>{item.category}</span>
              <span>•</span>
              <span>{item.date}</span>
              <span>•</span>
              <svg className="w-3 h-3 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16z" />
              </svg>
            </div>
          </div>
        </div>
        <button className="text-slate-400 hover:text-slate-600 transition cursor-pointer">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
          </svg>
        </button>
      </div>

      {/* Post Text Content */}
      <div className="text-left space-y-2">
        <h3 className="font-serif text-sm md:text-base font-extrabold text-[#051445] leading-snug">
          {lang === 'kh' && item.khmerTitle ? item.khmerTitle : item.title}
        </h3>
        <p className="text-xs md:text-[13px] text-slate-600 leading-relaxed font-sans font-light whitespace-pre-line text-left">
          {item.content}
        </p>
      </div>

      {/* Post Media (Image) */}
      {item.image && (
        <div className="rounded-xl overflow-hidden border border-slate-100 max-h-[460px] bg-slate-50 flex items-center justify-center relative group">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover transition duration-300 group-hover:scale-[1.01]"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.src = "/images/campuses/tk.jpg";
            }}
          />
        </div>
      )}

      {/* Likes & Comments Summary */}
      <div className="flex justify-between items-center text-[10px] text-slate-500 pt-3 pb-2 border-b border-slate-100 select-none">
        <div className="flex items-center gap-1">
          <span className="flex items-center justify-center w-4 h-4 rounded-full bg-blue-500 text-white text-[9px]">👍</span>
          <span className="flex items-center justify-center w-4 h-4 rounded-full bg-red-500 text-white text-[9px] -ml-1.5">❤️</span>
          <span className="ml-1 text-slate-500 font-medium">PSIS and {likeCount} others</span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowComments(prev => !prev)} className="hover:underline cursor-pointer">
            {comments.length} comments
          </button>
          <span>•</span>
          <span>{sharesCount} shares</span>
        </div>
      </div>

      {/* Interactive Action Buttons */}
      <div className="flex justify-between items-center pt-2 text-[11px] md:text-xs font-semibold text-slate-500 select-none">
        <button
          onClick={toggleLike}
          className={`flex-1 py-2 hover:bg-slate-50 rounded-lg flex items-center justify-center gap-2 cursor-pointer transition ${
            liked ? 'text-blue-600' : 'text-slate-600'
          }`}
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
          </svg>
          <span>Like</span>
        </button>
        
        <button
          onClick={() => setShowComments(prev => !prev)}
          className={`flex-1 py-2 hover:bg-slate-50 rounded-lg flex items-center justify-center gap-2 cursor-pointer transition ${
            showComments ? 'text-blue-600' : 'text-slate-650'
          }`}
        >
          <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span>Comment</span>
        </button>

        <button className="flex-1 py-2 hover:bg-slate-50 rounded-lg flex items-center justify-center gap-2 cursor-pointer text-slate-600 transition">
          <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          <span>Share</span>
        </button>
      </div>

      {/* Interactive Mock Comments list */}
      {showComments && (
        <div className="space-y-3.5 pt-4 border-t border-slate-100 text-left font-sans">
          <div className="space-y-3">
            {comments.map((comment) => (
              <div key={comment.id} className="flex items-start gap-2.5 text-xs">
                <div className="w-7 h-7 rounded-full bg-brand-blue/10 text-brand-blue font-bold flex items-center justify-center shrink-0 select-none">
                  {comment.avatarChar}
                </div>
                <div className="bg-slate-50 border border-slate-100/80 rounded-2xl px-3 py-2 max-w-[90%] space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-800">{comment.author}</span>
                    <span className="text-[8px] text-slate-400 font-light">{comment.date}</span>
                  </div>
                  <p className="text-slate-650 font-normal leading-relaxed text-xs">{comment.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Comment Form */}
          <form onSubmit={handlePostComment} className="flex items-center gap-2 pt-2">
            <div className="w-7 h-7 rounded-full bg-brand-gold/15 text-brand-gold font-bold flex items-center justify-center shrink-0 select-none text-[10px]">
              P
            </div>
            <div className="flex-grow flex bg-slate-50 border border-slate-200/80 rounded-xl overflow-hidden focus-within:border-brand-gold transition-colors">
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder={lang === 'en' ? "Write a public comment..." : "សរសេរមតិយោបល់ជាសាធារណៈ..."}
                className="w-full bg-transparent text-xs text-slate-800 px-3 py-2 focus:outline-none placeholder-slate-400 border-0 focus:ring-0"
              />
              <button
                type="submit"
                className="text-xs font-bold text-blue-600 hover:text-blue-800 px-3.5 border-l border-slate-200 transition cursor-pointer"
              >
                {lang === 'en' ? 'Post' : 'ផ្ញើ'}
              </button>
            </div>
          </form>
        </div>
      )}
    </article>
  );
}

export default function App() {
  const [lang, setLang] = useState<'en' | 'kh'>('en');
  const [currentSection, setCurrentSection] = useState('home');
  const [allCampuses, setAllCampuses] = useState<Campus[]>(getPersistedCampuses());
  const [allNews, setAllNews] = useState<NewsItem[]>(getPersistedNews());
  const [imageAssets, setImageAssets] = useState<ImageAsset[]>(getPersistedImageAssets());
  const [supabaseAssetsCache, setSupabaseAssetsCache] = useState<ImageAsset[]>([]);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoImageErrors, setVideoImageErrors] = useState<Record<string, boolean>>({});
  const [activeAboutSlide, setActiveAboutSlide] = useState(0);
  const googleSheetCMS = useGoogleSheetCMS();

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveAboutSlide((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Load and sync records count
  const syncCounts = () => {
    setAllCampuses(getPersistedCampuses());
    setAllNews(getPersistedNews());
    
    const local = getPersistedImageAssets();
    const merged = new Map<string, ImageAsset>();
    local.forEach((a) => merged.set(a.id, a));
    supabaseAssetsCache.forEach((a) => merged.set(a.id, a));
    
    const allMerged = Array.from(merged.values());
    setImageAssets(cleanMergedAssets(allMerged));
  };

  // Load Supabase image assets on startup if configured
  useEffect(() => {
    if (isSupabaseConfigured) {
      getCmsAssets().then((cmsAssets) => {
        const supabaseAssets: ImageAsset[] = cmsAssets.map((asset) => ({
          id: String(asset.id),
          title: asset.title,
          category: mapAssetTypeToCategory(asset.type),
          campus: asset.campus || '',
          originalUrl: asset.url,
          url: asset.url,
          priority: asset.section ? Number(asset.section) : 1,
          status: 'Active',
          createdAt: asset.created_at || new Date().toISOString(),
          storageProvider: 'external-url',
        }));
        setSupabaseAssetsCache(supabaseAssets);
        setImageAssets((prev) => {
          const merged = new Map<string, ImageAsset>();
          prev.forEach((a) => merged.set(a.id, a));
          supabaseAssets.forEach((a) => merged.set(a.id, a));
          const allMerged = Array.from(merged.values());
          return cleanMergedAssets(allMerged);
        });
      }).catch((err) => {
        console.error('Failed to load image assets from Supabase:', err);
      });
    }
  }, []);

  useEffect(() => {
    syncCounts();
    // Scroll window to top on section switch
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [currentSection]);

  const handleLeadSub = () => {
    syncCounts();
  };

  // Translation references for standard static parts
  const locale = {
    en: {
      heroTitle: 'Future Leaders Start Here',
      heroSub: '6 Campuses. One Vision. Future-Ready Education.',
      ctaApply: 'Apply Now',
      ctaExplore: 'Explore Campuses',
      aboutTitle: 'About Paññāsāstra International School',
      aboutSubtitle: 'Inspiring Global Mindset & Academic Excellence since 1997',
      aboutP1: 'Paññāsāstra International School (PSIS) is deeply committed to delivering elite bilingual education across the Kingdom of Cambodia. In partnership with Paññāsāstra University of Cambodia (PUC), we provide an uninterrupted, high-integrity pathway from preschool up to tertiary doctoral degrees, ensuring continuous English and academic masteries.',
      aboutP2: 'Our classrooms are not spaces for generic memory tasks. We deliver Singapore mathematics frameworks, CodeMonkey interactive workshops, and Tello python aero-drone coordinates to empower children to construct analytical solutions from early ages.',
      coreV1: 'Character Integrity',
      coreV1Desc: 'Nurturing deep moral reasoning, selflessness, and cultural pride.',
      coreV2: 'Technological Literacy',
      coreV2Desc: 'Empowering children with real, tactile robotics algorithms and Python.',
      coreV3: 'Global Fluency',
      coreV3Desc: 'Cultivating dual fluencies, Singapore algebra, and IELTS test preparers.',
      galleryTitle: 'Ecosystem Gallery',
      gallerySub: 'A look inside our technology labs, sports meets, and graduations',
      newsTitle: 'Admissions Broadcast & News',
      newsSub: 'Milestone reports and calendar alerts from our administrative offices',
      contactTitle: 'Central Admissions Office',
      contactSub: 'Get in touch for custom tuition packages and installment options'
    },
    kh: {
      heroTitle: 'អនាគតរបស់អ្នកដឹកនាំ ចាប់ផ្តើមនៅទីនេះ',
      heroSub: 'សាខាទាំង៦ ទស្សនវិស័យតែមួយ ការអប់រំឆ្ពោះទៅកាន់អនាគត។',
      ctaApply: 'ចុះឈ្មោះសិក្សា',
      ctaExplore: 'ស្វែងយល់ពីសាខា',
      aboutTitle: 'អំពីសាលាអន្តរជាតិ បញ្ញាសាស្ត្រ',
      aboutSubtitle: 'ការបំផុសគំនិតជាសកល និងឧត្តមភាពសិក្សាចាប់តាំងពីឆ្នាំ១៩៩៧',
      aboutP1: 'សាលាអន្តរជាតិ បញ្ញាសាស្ត្រ (PSIS) ប្តេជ្ញាចិត្តយ៉ាងមុតមាំក្នុងការផ្តល់ជូននូវការអប់រំពីរភាសាលំដាប់កំពូលនៅក្នុងព្រះរាជាណាចក្រកម្ពុជា។ ក្នុងនាមជាដៃគូជាមួយសាកលវិទ្យាល័យ បញ្ញាសាស្ត្រកម្ពុជា (PUC) យើងធានានូវគ្រឹះដ៏រឹងមាំតាំងពីថ្នាក់មត្តេយ្យរហូតដល់សញ្ញាបត្រជាន់ខ្ពស់។',
      aboutP2: 'ថ្នាក់រៀនរបស់យើងមិនមែនសម្រាប់ការទន្ទេញមេរៀននោះទេ។ យើងបង្រៀនគណិតវិទ្យាសិង្ហបុរី កម្មវិធីកូដឌីង CodeMonkey និងបច្ចេកវិទ្យាដ្រូនបញ្ជាដោយ Python ដើម្បីឱ្យកូនៗរបស់លោកអ្នកមានសមត្ថភាពវិភាគ និងដោះស្រាយបញ្ហាជាក់ស្តែង។',
      coreV1: 'សីលធម៌ និងគុណតម្លៃ',
      coreV1Desc: 'ការបណ្តុះបណ្តាលសីលធម៌ ទំនួលខុសត្រូវខ្ពស់ និងមោទនភាពជាតិ។',
      coreV2: 'បច្ចេកវិទ្យាទំនើបកម្ម',
      coreV2Desc: 'បំពាក់បំប៉នកូនៗនូវជំនាញសរសេរកូដ រ៉ូបូត និងដ្រូនជាក់ស្តែង។',
      coreV3: 'ភាសាសាកល',
      coreV3Desc: 'ពង្រីកភាសាទ្វិភាសារហូតដល់ត្រៀមប្រឡង IELTS ថ្នាក់ជាតិ និងអន្តរជាតិ។',
      galleryTitle: 'បណ្ណាល័យរូបភាព',
      gallerySub: 'សកម្មភាពថ្នាក់ពិសោធន៍ បាល់ទាត់ និងទិវាបញ្ចប់ការសិក្សា',
      newsTitle: 'ព័ត៌មានទូទៅ និងសេចក្តីជូនដំណឹង',
      newsSub: 'រាល់ព្រឹត្តិការណ៍លេចធ្លោ និងកាលវិភាគសិក្សាប្រចាំសាខានីមួយៗ',
      contactTitle: 'ការិយាល័យកណ្តាលចុះឈ្មោះសិក្សា',
      contactSub: 'សាកសួរព័ត៌មានបន្ថែមឥតគិតថ្លៃអំពីកញ្ចប់តម្លៃសិក្សា និងការបង់រំលស់'
    }
  };

  const fallbackHeroImage = '/images/hero/hero-bg.jpg';
  const cmsImageAssets = googleSheetCMS.allImages.map(itemToImageAsset);
  const combinedImageAssets = cmsImageAssets.length > 0
    ? sortImageAssetsByPriority(cleanMergedAssets([...cmsImageAssets, ...imageAssets]))
    : sortImageAssetsByPriority(cleanMergedAssets(imageAssets));
  const isHealthyImageUrl = (url?: string | null): boolean => {
    if (!url || typeof url !== 'string') return false;
    const trimmed = url.trim();
    if (!trimmed) return false;
    if (trimmed.includes('supabase.co') || trimmed.includes('unsplash.com')) {
      return false;
    }
    return true;
  };

  const findCmsImage = (category: ImageAsset['category'], matcher?: (asset: ImageAsset) => boolean) =>
    combinedImageAssets.find((asset) => asset.category === category && isHealthyImageUrl(asset.url) && (!matcher || matcher(asset)))?.url;

  const headerLogoUrl = findCmsImage('Header Logo');

  const campusesWithCmsImages = allCampuses.map((campus, index) => {
    const defaultCampus = INITIAL_CAMPUSES.find((c) => c.id === campus.id);
    const defaultImage = defaultCampus?.image || `/images/campuses/${campus.id}.jpg`;
    const cmsImage = findCmsImage('Campus Image', (asset) => {
      if (campusAssetMatchesCampus(asset, campus) || campusTitleMatchesCampus(asset, campus)) {
        return true;
      }
      return asset.campus === '' && asset.priority === index + 1;
    });
    return {
      ...campus,
      image: isHealthyImageUrl(cmsImage) ? cmsImage! : (isHealthyImageUrl(campus.image) ? campus.image : defaultImage),
    };
  });

  const academicProgramImages = Object.fromEntries(
    ACADEMIC_PROGRAMS.map((program, index) => {
      const cmsImage = findCmsImage('Academic Program', (asset) => asset.campus === program.id || asset.title.includes(program.name) || asset.priority === index + 1);
      return [
        program.id,
        isHealthyImageUrl(cmsImage) ? cmsImage! : program.image,
      ];
    })
  );

  const stemResourceImages = Object.fromEntries(
    STEM_RESOURCES.map((kit, index) => {
      const cmsImage = findCmsImage('STEM Resource', (asset) => asset.campus === kit.id || asset.title.includes(kit.name) || asset.priority === index + 1);
      return [
        kit.id,
        isHealthyImageUrl(cmsImage) ? cmsImage! : kit.image,
      ];
    })
  );

  const heroSlides: HeroSlide[] = googleSheetCMS.heroBanners.filter((banner) => isHealthyImageUrl(banner.directImageUrl));

  const fallbackGalleryImages = [
    { url: '/images/student-life/robotics.jpg', tag: 'Robotic Class' },
    { url: '/images/campuses/tk.jpg', tag: 'TK Science Lab' },
    { url: '/images/programs/primary.jpg', tag: 'Digital Suite Session' },
    { url: '/images/student-life/leadership.jpg', tag: 'Graduation Ceremony' },
    { url: '/images/student-life/sports.jpg', tag: 'International Sports Meet' },
    { url: '/images/campuses/ttp.jpg', tag: 'TTP Interactive Board Study' }
  ];

  const libraryGalleryImages = sortImageAssetsByPriority(combinedImageAssets.filter((asset) => asset.category === 'Campus Gallery' && isHealthyImageUrl(asset.url)))
    .map((asset) => ({ url: asset.url, tag: asset.campus ? `${asset.title} - ${asset.campus}` : asset.title }));

  const sheetGalleryImages: EditableGalleryImage[] = googleSheetCMS.campusGallery
    .filter((item) => isHealthyImageUrl(item.directImageUrl))
    .map((item) => ({
      id: `sheet-gallery-${item.id}`,
      title: item.title,
      url: item.directImageUrl,
      tag: item.campus ? `${item.title} - ${item.campus}` : item.title,
      category: 'Campus Gallery',
      campus: item.campus,
      sheetId: item.id,
    }));

  const editableFallbackGalleryImages: EditableGalleryImage[] = fallbackGalleryImages.map((item, index) => ({
    id: `fallback-gallery-${index}`,
    title: item.tag,
    url: item.url,
    tag: item.tag,
    category: 'Campus Gallery',
    campus: '',
  }));

  const editableLibraryGalleryImages: EditableGalleryImage[] = libraryGalleryImages.map((item, index) => ({
    id: `library-gallery-${index}`,
    title: item.tag,
    url: item.url,
    tag: item.tag,
    category: 'Campus Gallery',
    campus: '',
  }));

  const galleryImages = sheetGalleryImages.length > 0
    ? sheetGalleryImages
    : editableLibraryGalleryImages.length > 0
      ? editableLibraryGalleryImages
      : editableFallbackGalleryImages;

  const validPartnerSheet = googleSheetCMS.partnerLogos
    .filter((item) => isHealthyImageUrl(item.directImageUrl))
    .map((item) => ({
      id: String(item.id),
      title: item.title,
      url: item.directImageUrl,
      originalUrl: item.imageUrl,
      category: 'Partner Logo' as const,
      campus: item.campus,
      priority: item.priority,
      status: item.status,
      createdAt: '',
      storageProvider: 'external-url' as const,
    }));

  const partnerLogoAssets = validPartnerSheet.length > 0
    ? validPartnerSheet
    : sortImageAssetsByPriority(combinedImageAssets.filter((asset) => isHealthyImageUrl(asset.url) && (asset.category === 'Partner Logo' || asset.category === 'Partner Logos' || asset.category === 'AYLA Logo' || asset.category === 'AYLA Logos')));

  const validStudentLifeSheet = googleSheetCMS.studentLife
    .filter((item) => isHealthyImageUrl(item.directImageUrl))
    .map((item) => ({
      id: String(item.id),
      title: item.title,
      url: item.directImageUrl,
    }));

  const studentLifeAssets = validStudentLifeSheet.length > 0
    ? validStudentLifeSheet
    : sortImageAssetsByPriority(combinedImageAssets.filter((asset) => isHealthyImageUrl(asset.url) && asset.category === 'Student Life')).map((asset) => ({
      id: asset.id,
      title: asset.title,
      url: asset.url,
    }));

  const sheetNews = googleSheetCMS.news
    .filter((item) => isHealthyImageUrl(item.directImageUrl))
    .map((item) => ({
      id: `sheet-${item.id}`,
      sheetId: item.id,
      title: item.title,
      category: 'News',
      campus: item.campus,
      date: item.campus || 'Google Sheet CMS',
      content: item.campus ? `Latest update from ${item.campus}.` : 'Latest update from PSIS.',
      image: item.directImageUrl,
    }));

  const publicNews = sheetNews.length > 0 ? sheetNews : allNews.slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col font-sans select-none bg-[#fafbfc]">
      {/* Global Announcement Ticker (Top Bar) */}
      <div className="bg-[#C5A059] text-[#051445] text-[10px] md:text-xs font-semibold py-2 px-4 relative z-[100] border-b border-brand-gold/25 select-none overflow-hidden shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="bg-[#051445] text-white px-2 py-0.5 rounded text-[8px] font-extrabold tracking-wider uppercase animate-pulse">
              {lang === 'en' ? 'Announcements' : 'ដំណឹងបន្ទាន់'}
            </span>
          </div>
          
          <div className="flex-grow overflow-hidden relative h-4 flex items-center font-nav">
            <div className="animate-marquee whitespace-nowrap flex gap-12 text-[#051445]">
              <span>
                {lang === 'en'
                  ? '🔔 Admissions for Academic Year 2026-2027 are officially open! Early-bird registrations receive up to 15% discount on tuition fees.'
                  : '🔔 ការចុះឈ្មោះចូលរៀនសម្រាប់ឆ្នាំសិក្សា ២០២៦-២០២៧ ត្រូវបានបើកជាផ្លូវការហើយ! ការចុះឈ្មោះមុននឹងទទួលបានការបញ្ចុះតម្លៃរហូតដល់ ១៥% លើតម្លៃសិក្សា។'}
              </span>
              <span className="opacity-40">|</span>
              <span>
                {lang === 'en'
                  ? '🎓 Paññāsāstra University (PUC) Pathway Scholarship Program: High school seniors at PSIS are eligible for 10% to 40% automatic scholarships based on IELTS scores.'
                  : '🎓 កម្មវិធីអាហារូបករណ៍សាកលវិទ្យាល័យបញ្ញាសាស្ត្រ (PUC)៖ សិស្សវិទ្យាល័យ PSIS ទាំងអស់មានសិទ្ធិទទួលបានអាហារូបករណ៍ពី ១០% ទៅ ៤០% ដោយស្វ័យប្រវត្តផ្អែកលើពិន្ទុ IELTS។'}
              </span>
              <span className="opacity-40">|</span>
              <span>
                {lang === 'en'
                  ? '🤖 Advanced STEM Robotic Labs: PSIS campuses are equipped with kubo programming platforms and drone coordinate analytics software.'
                  : '🤖 មន្ទីរពិសោធន៍ STEM រ៉ូបូតទំនើប៖ គ្រប់សាខា PSIS ទាំងអស់ត្រូវបានបំពាក់ដោយឧបករណ៍សរសេរកូដ kubo និងបច្ចេកវិទ្យាដ្រូនទំនើបៗ។'}
              </span>
            </div>
          </div>
          
          <button
            onClick={() => setCurrentSection('apply-now')}
            className="text-[9px] uppercase font-extrabold tracking-widest text-[#051445] border border-[#051445]/40 px-2 py-0.5 rounded hover:bg-[#051445] hover:text-white transition shrink-0 cursor-pointer"
          >
            {lang === 'en' ? 'Register Now' : 'ចុះឈ្មោះឥឡូវ'}
          </button>
        </div>
      </div>

      {/* Primary Headers */}
      <FloatingCTA lang={lang} setCurrentSection={setCurrentSection} />
      <Header
        lang={lang}
        setLang={setLang}
        currentSection={currentSection}
        setCurrentSection={setCurrentSection}
        logoUrl={headerLogoUrl}
      />
      <FooterSlider
        lang={lang}
        campuses={campusesWithCmsImages}
        onCampusClick={() => setCurrentSection('campuses')}
      />

      <main className="flex-grow">
        <AnimatePresence mode="wait">
            <motion.div
              key={currentSection}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="space-y-0 flex flex-col min-h-screen"
            >
              <div className="flex-grow">
                {/* 1. HOME VIEW */}
                {(currentSection === 'home' || currentSection === 'about') && (
                  <div id="home-view" className="space-y-0 animate-fade-in">
                    {/* HERO SECTION */}
                    <section id="home" className="relative min-h-screen flex items-start justify-center overflow-hidden bg-[#071B5C] bg-[radial-gradient(ellipse_at_top,_#1a3cad_0%,_#071B5C_75%)] pt-24 pb-20 sm:pt-28 sm:pb-24 lg:pt-32 lg:pb-28">
                      <div className="absolute inset-0 bg-[#071B5C]" />
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.06),transparent_45%)] opacity-90" />
                      <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#1a3cad]/30 rounded-full blur-3xl animate-pulse"></div>
                      <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-brand-gold/10 rounded-full blur-3xl"></div>

                      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 text-center space-y-10 md:space-y-12">
                        <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md">
                          <span className="flex h-2.5 w-2.5 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-gold opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-gold"></span>
                          </span>
                          <span className="text-[10px] md:text-xs font-sans font-medium text-brand-gold uppercase tracking-widest">
                            {lang === 'en' ? 'Admission Registry Open • 2026 - 2027' : 'បើកទទួលចុះឈ្មោះចូលរៀន • ២០២៦ - ២០២៧'}
                          </span>
                        </div>

                        <div className="space-y-8 max-w-5xl mx-auto md:space-y-10">
                          <h1 className="font-serif font-bold text-[44px] md:text-[64px] xl:text-[88px] text-white tracking-tight leading-[1.02] capitalize">
                            {locale[lang].heroTitle}
                          </h1>
                          <p className="text-base md:text-[20px] text-[#E8EEFF] max-w-3xl mx-auto font-sans font-medium leading-relaxed">
                            {locale[lang].heroSub}
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-2 md:pt-4">
                          <button
                            onClick={() => setCurrentSection('apply-now')}
                            className="w-full sm:w-auto bg-brand-gold hover:bg-amber-500 text-brand-dark text-xs uppercase tracking-wider font-nav font-bold px-10 py-5 rounded-lg shadow-2xl hover:shadow-brand-gold/15 transform hover:-translate-y-0.5 transition duration-150 cursor-pointer"
                          >
                            {locale[lang].ctaApply}
                          </button>
                          
                          <button
                            onClick={() => setCurrentSection('campuses')}
                            className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white text-xs uppercase tracking-wider font-nav font-bold px-10 py-5 rounded-lg border border-white/20 transition cursor-pointer"
                          >
                            {locale[lang].ctaExplore}
                          </button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6 max-w-5xl mx-auto pt-16 md:pt-20 lg:pt-24 text-center">
                          <div className="bg-white/[0.08] border border-white/[0.14] backdrop-blur-md p-6 rounded-2xl">
                            <div className="text-3xl md:text-4.5xl font-black text-[#E6B83E] font-sans">6</div>
                            <div className="text-[10px] md:text-xs font-bold text-[#E8EEFF] uppercase tracking-wider mt-1">State-of-the-Art Campuses</div>
                          </div>
                          <div className="bg-white/[0.08] border border-white/[0.14] backdrop-blur-md p-6 rounded-2xl">
                            <div className="text-3xl md:text-4.5xl font-black text-[#E6B83E] font-sans">28+</div>
                            <div className="text-[10px] md:text-xs font-bold text-[#E8EEFF] uppercase tracking-wider mt-1">Years of Academic Mastery</div>
                          </div>
                          <div className="bg-white/[0.08] border border-white/[0.14] backdrop-blur-md p-6 rounded-2xl">
                            <div className="text-3xl md:text-4.5xl font-black text-[#E6B83E] font-sans">15,000+</div>
                            <div className="text-[10px] md:text-xs font-bold text-[#E8EEFF] uppercase tracking-wider mt-1">High-Achieving Alumni</div>
                          </div>
                          <div className="bg-white/[0.08] border border-white/[0.14] backdrop-blur-md p-6 rounded-2xl">
                            <div className="text-3xl md:text-4.5xl font-black text-[#E6B83E] font-sans">100%</div>
                            <div className="text-[10px] md:text-xs font-bold text-[#E8EEFF] uppercase tracking-wider mt-1">PUC Pathway Scholarship</div>
                          </div>
                        </div>

                        <div className="hidden lg:grid grid-cols-3 gap-6 max-w-4xl mx-auto pt-8">
                          <div className="flex items-center space-x-3 bg-slate-900/60 border border-white/5 p-3 rounded-xl text-left backdrop-blur-sm shadow">
                            <div className="w-8 h-8 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold font-black text-xs font-mono">01</div>
                            <p className="text-[10px] text-[#DDE6FF] leading-tight font-sans">Official Cambridge Assessment English Preparation Center.</p>
                          </div>
                          <div className="flex items-center space-x-3 bg-slate-900/60 border border-white/5 p-3 rounded-xl text-left backdrop-blur-sm shadow">
                            <div className="w-8 h-8 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold font-black text-xs font-mono">02</div>
                            <p className="text-[10px] text-[#DDE6FF] leading-tight font-sans">Singapore Math Core Standards for advanced cognitive analytics.</p>
                          </div>
                          <div className="flex items-center space-x-3 bg-slate-900/60 border border-white/5 p-3 rounded-xl text-left backdrop-blur-sm shadow">
                            <div className="w-8 h-8 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold font-black text-xs font-mono">03</div>
                            <p className="text-[10px] text-[#DDE6FF] leading-tight font-sans">Aero-Robot Lab in partnership with international STEM institutes.</p>
                          </div>
                        </div>
                      </div>
                    </section>                    {/* ABOUT PSIS & CAMBODIA HERITAGE CONTINUITY */}
                    <section id="about" className="py-24 bg-[#030718] text-white border-t border-slate-900 relative overflow-hidden select-none">
                      {/* Ambient background video loop */}
                      {/* Ambient background video loop from YouTube */}
                      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-[1] opacity-[0.28]">
                        <iframe
                          src="https://www.youtube.com/embed/mNG-D2fu8hY?autoplay=1&mute=1&loop=1&playlist=mNG-D2fu8hY&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1"
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180%] h-[180%] min-w-full min-h-full object-cover scale-[1.4]"
                          frameBorder="0"
                          allow="autoplay; encrypted-media"
                          allowFullScreen
                        ></iframe>
                      </div>
                      <div className="absolute inset-0 bg-[#030718]/70 z-[2]"></div>

                      {/* Glowing cosmic/futuristic depth background bubbles */}
                      <div className="absolute top-1/4 left-1/12 w-[350px] h-[350px] bg-brand-blue/30 rounded-full blur-3xl opacity-45 z-[3]"></div>
                      <div className="absolute bottom-1/4 right-1/12 w-[300px] h-[300px] bg-brand-gold/10 rounded-full blur-3xl opacity-25 z-[3]"></div>
                      
                      {/* Technical mesh cyber-grid overlay */}
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:35px_35px] opacity-80 mix-blend-overlay z-[4]"></div>

                      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
                          
                          {/* Column 1: School Description in Glassmorphic Panel */}
                          <div className="lg:col-span-4 backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col justify-between space-y-6 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-gold/5 rounded-full blur-xl"></div>
                            
                            <div className="space-y-4 relative z-10">
                              <span className="inline-block bg-brand-gold/15 text-brand-gold border border-brand-gold/30 text-[9px] font-bold uppercase px-3 py-1.5 rounded-full tracking-widest font-sans">
                                {lang === 'en' ? 'Educating Minds since 1997' : 'បណ្តុះបណ្តាលចំណេះដឹងតាំងពីឆ្នាំ១៩៩៧'}
                              </span>
                              <h2 className="font-serif font-extrabold text-2xl md:text-3.5xl text-white tracking-tight leading-tight">
                                {locale[lang].aboutTitle}
                              </h2>
                              <p className="text-[10px] text-brand-gold font-sans font-bold tracking-wider uppercase">
                                {locale[lang].aboutSubtitle}
                              </p>
                              <div className="w-16 h-0.5 bg-brand-gold rounded-full"></div>
                              
                              <div className="space-y-4 text-slate-350 text-xs leading-relaxed font-sans font-light">
                                <p className="indent-4">{locale[lang].aboutP1}</p>
                                <p className="indent-4">{locale[lang].aboutP2}</p>
                              </div>
                            </div>
                          </div>

                          {/* Column 2: Fading Slideshow Campus Card (Highly Futuristic!) */}
                          <div className="lg:col-span-4 min-h-[380px] relative rounded-3xl overflow-hidden shadow-2xl border-2 border-brand-gold/30 hover:border-brand-gold/70 hover:shadow-brand-gold/10 transition-all duration-500 group flex flex-col justify-between p-6 bg-slate-950">
                            
                            {/* Slide Scene Fade Transitions */}
                            {[
                              '/images/campuses/tk.jpg',
                              '/images/student-life/robotics.jpg',
                              '/images/hero/hero-bg.jpg'
                            ].map((slideUrl, idx) => (
                              <img
                                key={slideUrl}
                                src={slideUrl}
                                alt="Campus Showcase"
                                className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${
                                  activeAboutSlide === idx ? 'opacity-40 scale-105' : 'opacity-0 scale-100'
                                }`}
                              />
                            ))}

                            {/* Black gradient mask */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-slate-950/40 z-[1]"></div>

                            {/* Top Bar with active indicators */}
                            <div className="relative z-10 flex justify-between items-center w-full">
                              <span className="inline-block bg-brand-gold text-brand-dark text-[8px] font-extrabold uppercase px-2.5 py-1 rounded-full tracking-wider shadow-md font-sans">
                                {lang === 'en' ? 'Campus Life Showcase' : 'ទិដ្ឋភាពសាលាទំនើប'}
                              </span>
                              
                              {/* Glowing slideshow dots */}
                              <div className="flex gap-1">
                                {[0, 1, 2].map((dotIdx) => (
                                  <span 
                                    key={dotIdx} 
                                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                                      activeAboutSlide === dotIdx ? 'bg-brand-gold w-3 shadow-sm shadow-brand-gold' : 'bg-white/20'
                                    }`}
                                  ></span>
                                ))}
                              </div>
                            </div>

                            {/* Bottom Content banner */}
                            <div className="relative z-10 space-y-1.5 mt-auto">
                              <h3 className="text-white font-serif font-bold text-base md:text-lg tracking-wide group-hover:text-brand-gold transition-colors duration-300">
                                {lang === 'en' ? 'Modern Learning Environment' : 'បរិយាកាសសិក្សាទំនើប'}
                              </h3>
                              <p className="text-[10px] text-slate-300 leading-normal font-sans font-light">
                                {lang === 'en' 
                                  ? 'Equipped with cutting-edge science labs, high-tech robotics studios, and spacious libraries.' 
                                  : 'បំពាក់ដោយមន្ទីរពិសោធន៍វិទ្យាសាស្ត្រទំនើប ស្ទូឌីយ៉ូរ៉ូបូត និងបណ្ណាល័យធំទូលាយ។'}
                              </p>
                            </div>
                          </div>

                          {/* Column 3: High-Tech Pathway Card */}
                          <div className="lg:col-span-4 bg-gradient-to-b from-[#051445]/60 to-[#0c2269]/60 backdrop-blur-xl text-white rounded-3xl p-6 md:p-8 border-2 border-[#C5A059]/30 space-y-6 relative overflow-hidden shadow-2xl min-h-[380px] flex flex-col justify-between hover:border-[#C5A059]/60 hover:-translate-y-1.5 transition-all duration-300 group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-2xl -mr-8 -mt-8 group-hover:bg-yellow-500/10 transition-colors duration-500"></div>
                            
                            <div className="space-y-4 relative z-10">
                              <span className="inline-block bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/30 text-[9px] font-bold uppercase px-3 py-1 rounded-full tracking-widest font-nav">
                                {lang === 'en' ? 'Tertiary Level Integration' : 'ការអប់រំបន្តទៅកាន់ថ្នាក់មហាវិទ្យាល័យ'}
                              </span>
                              <h3 className="font-serif font-bold text-xl md:text-2xl text-white leading-snug tracking-tight">
                                {lang === 'en' ? 'Paññāsāstra University Pathway' : 'គន្លងផ្លូវឆ្ពោះទៅសាកលវិទ្យាល័យបញ្ញាសាស្ត្រ'}
                              </h3>
                              <p className="text-[11px] text-[#DDE6FF] leading-relaxed font-sans font-light">
                                All high school seniors at PSIS receive synchronized early entry credentials and scholarships corresponding to 10% - 40% based on IELTS score cards to enroll instantly into PUC degree programs.
                              </p>
                            </div>

                            <div className="pt-5 border-t border-white/10 space-y-2.5 text-[10px] relative z-10 font-sans mt-auto">
                              <div className="flex justify-between items-center text-[9px] text-[#E8EEFF]">
                                <span className="font-medium tracking-wide uppercase opacity-75">Accreditation status</span>
                                <span className="text-emerald-400 font-bold flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                                  ● PUC PATHWAY
                                </span>
                              </div>
                              <div className="text-brand-gold font-bold flex items-center gap-1.5">
                                <svg className="w-3.5 h-3.5 text-brand-gold shrink-0 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                <span>British Council & Cambridge assessments</span>
                              </div>
                            </div>
                          </div>

                        </div>

                        {/* High-Tech Glassmorphic Core Values Selector Badges */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-white/10 mt-12">
                          <div className="space-y-2 backdrop-blur-xl bg-white/[0.02] border border-white/5 p-5 rounded-2xl hover:border-brand-gold/45 hover:bg-white/[0.05] transition-all duration-300 shadow-lg">
                            <div className="flex items-center space-x-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-brand-gold shadow shadow-brand-gold animate-pulse"></span>
                              <h4 className="font-nav font-extrabold text-xs text-white uppercase tracking-wider">{locale[lang].coreV1}</h4>
                            </div>
                            <p className="text-[11px] text-slate-400 leading-relaxed pl-3 font-sans font-light">{locale[lang].coreV1Desc}</p>
                          </div>
                          <div className="space-y-2 backdrop-blur-xl bg-white/[0.02] border border-white/5 p-5 rounded-2xl hover:border-brand-gold/45 hover:bg-white/[0.05] transition-all duration-300 shadow-lg">
                            <div className="flex items-center space-x-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-brand-gold shadow shadow-brand-gold animate-pulse"></span>
                              <h4 className="font-nav font-extrabold text-xs text-white uppercase tracking-wider">{locale[lang].coreV2}</h4>
                            </div>
                            <p className="text-[11px] text-slate-400 leading-relaxed pl-3 font-sans font-light">{locale[lang].coreV2Desc}</p>
                          </div>
                          <div className="space-y-2 backdrop-blur-xl bg-white/[0.02] border border-white/5 p-5 rounded-2xl hover:border-brand-gold/45 hover:bg-white/[0.05] transition-all duration-300 shadow-lg">
                            <div className="flex items-center space-x-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-brand-gold shadow shadow-brand-gold animate-pulse"></span>
                              <h4 className="font-nav font-extrabold text-xs text-white uppercase tracking-wider">{locale[lang].coreV3}</h4>
                            </div>
                            <p className="text-[11px] text-slate-400 leading-relaxed pl-3 font-sans font-light">{locale[lang].coreV3Desc}</p>
                          </div>
                        </div>
                      </div>
                    </section>

                    {currentSection === 'about' && (
                      <>
                        {/* GROUP ACADEMIC GOVERNANCE - AYLA */}
                        <GroupGovernance lang={lang} />
                      </>
                    )}

                    {/* VIDEO SHOWCASE SECTION */}
                    <section className="py-20 bg-slate-50 border-t border-gray-100">
                      <div className="max-w-7xl mx-auto px-4 md:px-8">
                        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
                          <span className="inline-block bg-brand-blue/5 text-brand-blue font-sans font-extrabold text-[10px] tracking-widest uppercase px-3.5 py-1.5 rounded-full border border-brand-blue/10">
                            {lang === 'en' ? 'Virtual Tour & Student Life' : 'ទស្សនាសកម្មភាពសាលា'}
                          </span>
                          <h2 className="font-serif font-bold text-3xl md:text-4.5xl text-brand-blue tracking-tight animate-fade-in">
                            {lang === 'en' ? 'Experience PSIS in Action' : 'វីដេអូនាំមុខ និងទិដ្ឋភាពសាលា'}
                          </h2>
                          <div className="w-16 h-0.5 bg-brand-gold mx-auto rounded"></div>
                          <p className="text-xs md:text-sm text-[#475569] font-sans leading-relaxed">
                            {lang === 'en'
                              ? 'Watch our latest campus walkthroughs, educational activities, and graduation ceremonies directly.'
                              : 'ទស្សនាវីដេអូសកម្មភាពសិក្សា ហេដ្ឋារចនាសម្ព័ន្ធថ្នាក់រៀន និងពិធីបញ្ចប់ការសិក្សារបស់សិស្សានុសិស្ស។'}
                          </p>
                        </div>

                        {/* Main Video Display with in-place YouTube iframe player */}
                        <div className="max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-950 aspect-video relative group">
                          {isVideoPlaying ? (
                            <iframe
                              className="w-full h-full border-0"
                              src={`https://www.youtube.com/embed/${psisVideos[activeVideoIndex].youtubeId}?autoplay=1&rel=0`}
                              title="PSIS Active Video Showcase"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              allowFullScreen
                            />
                          ) : (
                            <div 
                              onClick={() => setIsVideoPlaying(true)}
                              className={`w-full h-full relative cursor-pointer bg-gradient-to-br ${psisVideos[activeVideoIndex].gradient} p-8 flex flex-col justify-between overflow-hidden select-none`}
                            >
                              {/* Real Cover Image using i.ytimg.com with fallback chain */}
                              {!videoImageErrors[psisVideos[activeVideoIndex].youtubeId] && (
                                <img
                                  src={`https://i.ytimg.com/vi/${psisVideos[activeVideoIndex].youtubeId}/maxresdefault.jpg`}
                                  alt={psisVideos[activeVideoIndex].title}
                                  className="absolute inset-0 w-full h-full object-cover transition duration-500 group-hover:scale-105"
                                  onError={(e) => {
                                    const yid = psisVideos[activeVideoIndex].youtubeId;
                                    const currentSrc = e.currentTarget.src;
                                    if (currentSrc.includes('maxresdefault.jpg')) {
                                      e.currentTarget.src = `https://i.ytimg.com/vi/${yid}/sddefault.jpg`;
                                    } else if (currentSrc.includes('sddefault.jpg')) {
                                      e.currentTarget.src = `https://i.ytimg.com/vi/${yid}/hqdefault.jpg`;
                                    } else if (currentSrc.includes('hqdefault.jpg')) {
                                      e.currentTarget.src = `https://img.youtube.com/vi/${yid}/0.jpg`;
                                    } else {
                                      setVideoImageErrors(prev => ({ ...prev, [yid]: true }));
                                    }
                                  }}
                                />
                              )}

                              {/* Dark overlay */}
                              <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/30 transition-colors duration-300"></div>

                              {/* High-tech mesh overlay */}
                              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:30px_30px] opacity-40 mix-blend-overlay"></div>
                              <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
                              <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-yellow-500/10 rounded-full blur-3xl"></div>

                              {/* Top Bar inside player */}
                              <div className="relative z-10 flex justify-between items-start w-full">
                                <span className="inline-block bg-white/15 backdrop-blur-md border border-white/20 px-3.5 py-1.5 rounded-full text-[10px] text-white font-bold tracking-wider uppercase font-sans">
                                  {lang === 'en' ? 'Featured Video' : 'វីដេអូនាំមុខ'}
                                </span>
                                <div className="flex items-center gap-1.5 bg-black/35 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10">
                                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                                  <span className="text-[9px] text-white font-extrabold uppercase font-sans tracking-wide">YouTube</span>
                                </div>
                              </div>

                              {/* Play Button Overlay - Centered */}
                              <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                                <div className="w-20 h-20 rounded-full bg-red-600 text-white flex items-center justify-center shadow-2xl transform group-hover:scale-110 group-hover:bg-red-500 transition duration-300 relative pointer-events-auto">
                                  <span className="absolute inset-0 rounded-full bg-red-600/30 animate-ping"></span>
                                  <svg className="w-8 h-8 fill-current ml-1" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                  </svg>
                                </div>
                              </div>

                              {/* Bottom Info inside player */}
                              <div className="relative z-10 space-y-2 mt-auto w-full pt-16">
                                <h3 className="text-white text-lg md:text-2xl font-bold font-serif leading-snug drop-shadow-md max-w-2xl group-hover:text-brand-gold transition-colors duration-300">
                                  {lang === 'kh' ? psisVideos[activeVideoIndex].khmerTitle : psisVideos[activeVideoIndex].title}
                                </h3>
                                <div className="flex items-center gap-3 text-xs text-white/80">
                                  <span className="bg-slate-900/60 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] text-brand-gold font-bold">
                                    {lang === 'en' ? `Duration: ${psisVideos[activeVideoIndex].duration}` : `រយៈពេល៖ ${psisVideos[activeVideoIndex].duration}`}
                                  </span>
                                  <span className="text-white/60">|</span>
                                  <span>{lang === 'en' ? 'Click to Play' : 'ចុចដើម្បីទស្សនា'}</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Slideshow Video Thumbnail Selector List */}
                        <div className="max-w-4xl mx-auto mt-8 space-y-3">
                          <div className="flex justify-between items-center px-1">
                            <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 font-sans">
                              {lang === 'en' ? 'Select Video to Play' : 'ជ្រើសរើសវីដេអូដើម្បីទស្សនា'}
                            </span>
                            <button
                              onClick={() => window.open('https://www.youtube.com/@PSISInternationalSchool', '_blank')}
                              className="text-[10px] text-brand-blue hover:text-brand-gold font-bold font-sans flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <span>{lang === 'en' ? 'Visit YouTube Channel' : 'ចូលទំព័រ YouTube ផ្លូវការ'}</span>
                              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
                              </svg>
                            </button>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                            {psisVideos.map((vid, idx) => {
                              const isActive = activeVideoIndex === idx;
                              return (
                                <button
                                  key={vid.id}
                                  onClick={() => {
                                    setActiveVideoIndex(idx);
                                    setIsVideoPlaying(false);
                                  }}
                                  className={`text-left rounded-2xl overflow-hidden border-2 transition-all duration-300 cursor-pointer shadow-sm relative group outline-none bg-slate-900 ${
                                    isActive 
                                      ? 'border-brand-gold ring-2 ring-brand-gold/10 scale-[1.03] shadow-md' 
                                      : 'border-slate-200 hover:border-brand-blue/35 hover:scale-[1.01]'
                                  }`}
                                >
                                  {/* Aspect Ratio Container for Gradient / Image Thumbnail */}
                                  <div className={`aspect-video relative overflow-hidden bg-gradient-to-br ${vid.gradient} p-3 flex flex-col justify-between`}>
                                    {/* Real Thumbnail from YouTube CDN */}
                                    {!videoImageErrors[vid.youtubeId] && (
                                      <img
                                        src={`https://i.ytimg.com/vi/${vid.youtubeId}/sddefault.jpg`}
                                        alt={vid.title}
                                        className="absolute inset-0 w-full h-full object-cover transition duration-300 group-hover:scale-105"
                                        onError={(e) => {
                                          const yid = vid.youtubeId;
                                          const currentSrc = e.currentTarget.src;
                                          if (currentSrc.includes('sddefault.jpg')) {
                                            e.currentTarget.src = `https://i.ytimg.com/vi/${yid}/hqdefault.jpg`;
                                          } else if (currentSrc.includes('hqdefault.jpg')) {
                                            e.currentTarget.src = `https://img.youtube.com/vi/${yid}/mqdefault.jpg`;
                                          } else {
                                            setVideoImageErrors(prev => ({ ...prev, [yid]: true }));
                                          }
                                        }}
                                      />
                                    )}

                                    {/* Overlay blend details */}
                                    <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/10 transition-colors z-[1]"></div>
                                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:15px_15px] opacity-40 mix-blend-overlay z-[2]"></div>
                                    
                                    {/* Duration Badge */}
                                    <div className="flex justify-end w-full relative z-[3]">
                                      <span className="bg-black/60 px-1.5 py-0.5 rounded text-[8px] font-bold text-white font-mono">
                                        {vid.duration}
                                      </span>
                                    </div>

                                    {/* Play icon overlay on thumbnail */}
                                    <div className="absolute inset-0 flex items-center justify-center z-[4] transition-colors">
                                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white backdrop-blur-md transition-all duration-300 ${isActive ? 'bg-red-600 scale-110 shadow-lg' : 'bg-slate-950/60 group-hover:bg-red-600/90'}`}>
                                        <svg className="w-4 h-4 fill-current ml-0.5" viewBox="0 0 24 24">
                                          <path d="M8 5v14l11-7z" />
                                        </svg>
                                      </div>
                                    </div>

                                    {/* Micro Channel Indicator */}
                                    <div className="relative z-[3] mt-auto text-[7px] text-white/70 font-bold uppercase tracking-wide drop-shadow-md">
                                      PSIS Video
                                    </div>
                                  </div>
                                  
                                  {/* Title block */}
                                  <div className="p-3 bg-white">
                                    <h4 className="text-[10px] font-bold leading-snug line-clamp-2 text-slate-700 group-hover:text-slate-950">
                                      {lang === 'kh' ? vid.khmerTitle : vid.title}
                                    </h4>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </section>

                    {/* PARTNERS & LEARNING PLATFORMS */}
                    <PartnerLogoSection
                      lang={lang}
                      assets={partnerLogoAssets}
                      isLoading={googleSheetCMS.loading && googleSheetCMS.partnerLogos.length === 0}
                    />

                    {/* STUDENT LIFE VISUAL STORYTELLING */}
                    <StudentLifeSection lang={lang} assets={studentLifeAssets} isLoading={googleSheetCMS.loading && googleSheetCMS.studentLife.length === 0} />

                    {/* TRUST / TESTIMONIALS */}
                    <TestimonialsSection lang={lang} />

                    {currentSection === 'about' && (
                      <section className="py-20 bg-[#fafbfc] border-t border-gray-100">
                        <div className="max-w-7xl mx-auto px-4 md:px-8">
                          <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
                            <h2 className="font-serif font-bold text-3xl md:text-4.5xl text-brand-blue tracking-tight">
                              {locale[lang].galleryTitle}
                            </h2>
                            <div className="w-16 h-0.5 bg-brand-gold mx-auto rounded"></div>
                            <p className="text-xs md:text-sm text-[#475569] font-sans leading-relaxed">
                              {locale[lang].gallerySub}
                            </p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {googleSheetCMS.loading && googleSheetCMS.campusGallery.length === 0 ? (
                              Array.from({ length: 6 }).map((_, idx) => (
                                <div key={idx} className="aspect-video animate-pulse rounded-2xl border border-gray-200 bg-slate-200" />
                              ))
                            ) : galleryImages.map((img, idx) => (
                              <div key={idx} className="group relative rounded-2xl overflow-hidden aspect-video border border-gray-200">
                                <img 
                                  src={img.url} 
                                  alt={img.tag} 
                                  className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                                  referrerPolicy="no-referrer"
                                  onError={(event) => {
                                    event.currentTarget.src = fallbackGalleryImages[idx % fallbackGalleryImages.length].url;
                                  }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4">
                                  <span className="text-xs font-bold text-white tracking-wide uppercase">{img.tag}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </section>
                    )}

                  </div>
                )}

                {/* 2. CAMPUSES VIEW */}
                {currentSection === 'campuses' && (
                  <div id="campuses" className="animate-fade-in">
                    <CampusesSection campuses={campusesWithCmsImages} lang={lang} />
                    <CampusDetailPages campuses={campusesWithCmsImages} lang={lang} />
                  </div>
                )}

                {/* 3. ACADEMICS VIEW */}
                {currentSection === 'academics' && (
                  <div id="academics" className="animate-fade-in">
                    <PublicAcademic lang={lang} programImages={academicProgramImages} />
                  </div>
                )}

                {/* 4. PUC-IFL VIEW */}
                {currentSection === 'puc-ifl' && (
                  <div id="puc-ifl" className="animate-fade-in">
                    <PublicPUC lang={lang} />
                  </div>
                )}

                {/* 5. DIGITAL SUITE VIEW */}
                {currentSection === 'digital' && (
                  <div id="digital" className="animate-fade-in">
                    <PublicDigital lang={lang} />
                  </div>
                )}

                {/* 6. STEM VIEW */}
                {currentSection === 'stem' && (
                  <div id="stem" className="animate-fade-in">
                    <PublicStem lang={lang} resourceImages={stemResourceImages} />
                  </div>
                )}

                {/* 7. CAREERS VIEW */}
                {currentSection === 'careers' && (
                  <div id="careers" className="animate-fade-in">
                    <CareersSection lang={lang} />
                  </div>
                )}

                {/* 8. APPLY NOW VIEW */}
                {currentSection === 'apply-now' && (
                  <div id="apply-now" className="animate-fade-in space-y-0">
                    {/* ADMISSIONS FUNNEL INQUIRY FORM */}
                    <section className="py-20 bg-gray-50/50 scroll-mt-12">
                      <div className="max-w-7xl mx-auto px-4 md:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                          <div className="space-y-6">
                            <span className="inline-block bg-brand-red/10 text-brand-red font-sans font-medium text-[10px] tracking-widest uppercase px-3.5 py-1.5 rounded-full">
                              {lang === 'en' ? 'Fast-Track Admissions' : 'ការចុះឈ្មោះរៀនរហ័សទាន់ចិត្ត'}
                            </span>
                            <h2 className="font-serif font-bold text-3xl md:text-4.5xl text-brand-blue tracking-tight leading-tight">
                              {lang === 'en' ? 'Enroll Your Child in 5 Simple Steps' : 'ចុះឈ្មោះកូនលោកអ្នកត្រឹមតែ ៥ ជំហាន'}
                            </h2>
                            <div className="w-12 h-1 bg-brand-gold rounded"></div>
                            <div className="space-y-5 font-sans text-xs md:text-[13px] text-[#475569]">
                              <div className="flex items-start space-x-3.5">
                                <div className="w-6 h-6 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold text-xs shrink-0 font-nav">1</div>
                                <div>
                                  <span className="font-nav font-bold text-brand-blue block uppercase text-[10px] tracking-wider">Step 1: Discover</span>
                                  <span>Explore our 6-campus facilities and curriculum tabs.</span>
                                </div>
                              </div>
                              <div className="flex items-start space-x-3.5">
                                <div className="w-6 h-6 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold text-xs shrink-0 font-nav">2</div>
                                <div>
                                  <span className="font-nav font-bold text-brand-blue block uppercase text-[10px] tracking-wider">Step 2: Submit Inquiry</span>
                                  <span>Fill out standard family parameters via the form to sync our local CRM database immediately.</span>
                                </div>
                              </div>
                              <div className="flex items-start space-x-3.5">
                                <div className="w-6 h-6 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold text-xs shrink-0 font-nav">3</div>
                                <div>
                                  <span className="font-nav font-bold text-brand-blue block uppercase text-[10px] tracking-wider">Step 3: Campus Tour</span>
                                  <span>Receive immediate coordinate follow-ups to conduct physical smart-lab inspections.</span>
                                </div>
                              </div>
                              <div className="flex items-start space-x-3.5">
                                <div className="w-6 h-6 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold text-xs shrink-0 font-nav">4</div>
                                <div>
                                  <span className="font-nav font-bold text-brand-blue block uppercase text-[10px] tracking-wider">Step 4: Student Assessment</span>
                                  <span>Diagnostic testing for language baseline levels and Singapore-math standards placement.</span>
                                </div>
                              </div>
                              <div className="flex items-start space-x-3.5">
                                <div className="w-6 h-6 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold text-xs shrink-0 font-nav">5</div>
                                <div>
                                  <span className="font-nav font-bold text-brand-blue block uppercase text-[10px] tracking-wider">Step 5: Enrollment Confirmed</span>
                                  <span>Lock in schedules, uniform packages, and activate digital tool accounts.</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div>
                            <InquiryForm lang={lang} onLeadAdded={handleLeadSub} />
                          </div>
                        </div>
                      </div>
                    </section>

                    {/* CONTACT DETAILS & DIRECTORY */}
                    <section id="contact" className="py-20 bg-white border-t border-gray-100 scroll-mt-12">
                      <div className="max-w-7xl mx-auto px-4 md:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                          <div className="space-y-6">
                            <h2 className="font-serif font-bold text-3xl md:text-4.5xl text-brand-blue tracking-tight leading-tight">
                              {locale[lang].contactTitle}
                            </h2>
                            <div className="w-12 h-1 bg-brand-gold rounded"></div>
                            <p className="text-xs text-[#475569] leading-relaxed font-sans font-light">
                              {locale[lang].contactSub}
                            </p>
                            <div className="space-y-3.5 font-sans text-xs text-slate-600">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded bg-gray-50 text-brand-blue flex items-center justify-center">
                                  <Phone size={14} />
                                </div>
                                <div>
                                  <span className="text-gray-400 font-bold block uppercase text-[10px]">Admission Hotlines</span>
                                  <span className="text-gray-800 font-semibold font-mono">+855 23 884 991 | +855 12 555 999</span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded bg-gray-50 text-brand-blue flex items-center justify-center">
                                  <Mail size={14} />
                                </div>
                                <div>
                                  <span className="text-gray-400 font-bold block uppercase text-[10px]">Email channels</span>
                                  <span className="text-gray-800 font-semibold font-mono">admission@psis.edu.kh | tk.info@psis.edu.kh</span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded bg-gray-50 text-brand-blue flex items-center justify-center">
                                  <MapPin size={14} />
                                </div>
                                <div>
                                  <span className="text-gray-400 font-bold block uppercase text-[10px]">Phnom Penh Head Office</span>
                                  <span className="text-gray-800 font-semibold">Street 315, Toul Kork, Phnom Penh, Kingdom of Cambodia</span>
                                </div>
                              </div>
                            </div>
                            <div className="p-4 bg-yellow-50/50 rounded-xl border border-yellow-200/50 text-xs font-sans max-w-sm space-y-1.5 leading-relaxed text-yellow-950">
                              <span className="font-bold text-[10px] uppercase text-brand-blue block tracking-widest">Office hours:</span>
                              <div className="flex justify-between">
                                <span>Monday to Friday:</span>
                                <span className="font-bold">7:30 AM - 5:00 PM</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Saturday & Sunday:</span>
                                <span className="font-bold text-brand-blue">8:00 AM - 12:00 PM</span>
                              </div>
                            </div>
                          </div>        
                          <div className="bg-[#071B5C] text-white rounded-3xl p-8 relative overflow-hidden flex flex-col justify-between min-h-[350px] border border-white/10 shadow-xl">
                            <div className="space-y-4">
                              <span className="text-brand-gold text-[9px] uppercase font-bold tracking-widest pl-1 block">Campus Locations Directory Map</span>
                              <h4 className="font-sans font-bold text-base text-white uppercase">Central Phnom Penh Grid Map</h4>
                              <div className="w-full bg-[#051445] h-36 rounded-xl border border-white/5 relative flex items-center justify-center font-mono">
                                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
                                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/5"></div>
                                <div className="absolute left-1/3 top-0 bottom-0 w-0.5 bg-white/5"></div>
                                <div className="absolute left-2/3 top-0 bottom-0 w-0.5 bg-white/5"></div>
                                <div className="absolute top-10 left-10 flex flex-col items-center">
                                  <span className="text-brand-gold text-xs leading-none">●</span>
                                  <span className="text-[8px] bg-brand-gold text-brand-dark px-1.5 py-0.5 mt-1 rounded font-bold leading-none">TK</span>
                                </div>
                                <div className="absolute top-24 left-32 flex flex-col items-center">
                                  <span className="text-brand-gold text-xs leading-none">●</span>
                                  <span className="text-[8px] bg-brand-gold text-brand-dark px-1.5 py-0.5 mt-1 rounded font-bold leading-none">TTP</span>
                                </div>
                                <div className="absolute top-16 right-16 flex flex-col items-center">
                                  <span className="text-brand-gold text-xs leading-none">●</span>
                                  <span className="text-[8px] bg-brand-gold text-brand-dark px-1.5 py-0.5 mt-1 rounded font-bold leading-none">CAP</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-[10px] text-[#E8EEFF] font-sans mt-4">
                              * Click on the "CAMPUSES" tab above to toggle specific directions, principal phone directories, and photos of all our properties.
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                )}
              </div>

              {/* NEWS FEED (Always visible at the bottom of every page view!) */}
              <section className="py-20 bg-[#fafbfc] border-t border-slate-200/50">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                  <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
                    <h2 className="font-serif font-bold text-3xl md:text-4.5xl text-brand-blue tracking-tight">
                      {locale[lang].newsTitle}
                    </h2>
                    <div className="w-16 h-0.5 bg-brand-gold mx-auto rounded"></div>
                    <p className="text-xs md:text-sm text-[#475569] font-sans leading-relaxed">
                      {locale[lang].newsSub}
                    </p>
                  </div>

                  <div className="max-w-2xl mx-auto space-y-6">
                    {googleSheetCMS.loading && googleSheetCMS.news.length === 0 ? (
                      Array.from({ length: 2 }).map((_, idx) => (
                        <div key={idx} className="h-96 animate-pulse rounded-2xl border border-slate-200 bg-slate-100" />
                      ))
                    ) : publicNews.map((item) => (
                      <FacebookPost key={item.id} item={item} lang={lang} />
                    ))}
                  </div>
                </div>
              </section>

              {/* FOOTER */}
              <Footer
                lang={lang}
                setCurrentSection={setCurrentSection}
              />
            </motion.div>
        </AnimatePresence>
      </main>

      <AdmissionAssistant onLeadSaved={syncCounts} />

    </div>
  );
}
