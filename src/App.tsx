/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  getPersistedNews, getPersistedCampuses,
  getPersistedImageAssets,
  ACADEMIC_PROGRAMS,
  STEM_RESOURCES,
} from './mockData';
import { Campus, ImageAsset, NewsItem } from './types';

// Import modular UI elements
import Header from './components/Header';
import HeroMotion from './components/HeroMotion';
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

export default function App() {
  const [lang, setLang] = useState<'en' | 'kh'>('en');
  const [currentSection, setCurrentSection] = useState('home');
  const [allCampuses, setAllCampuses] = useState<Campus[]>(getPersistedCampuses());
  const [allNews, setAllNews] = useState<NewsItem[]>(getPersistedNews());
  const [imageAssets, setImageAssets] = useState<ImageAsset[]>(getPersistedImageAssets());
  const googleSheetCMS = useGoogleSheetCMS();

  // Load and sync records count
  const syncCounts = () => {
    setAllCampuses(getPersistedCampuses());
    setAllNews(getPersistedNews());
    setImageAssets(getPersistedImageAssets());
  };

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

  const fallbackHeroImage = 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1920&q=80';
  const cmsImageAssets = googleSheetCMS.allImages.map(itemToImageAsset);
  const combinedImageAssets = cmsImageAssets.length > 0
    ? sortImageAssetsByPriority([...cmsImageAssets, ...imageAssets])
    : sortImageAssetsByPriority(imageAssets);
  const findCmsImage = (category: ImageAsset['category'], matcher?: (asset: ImageAsset) => boolean) =>
    combinedImageAssets.find((asset) => asset.category === category && (!matcher || matcher(asset)))?.url;
  const headerLogoUrl = findCmsImage('Header Logo');
  const campusesWithCmsImages = allCampuses.map((campus, index) => ({
    ...campus,
    image: findCmsImage('Campus Image', (asset) =>
      asset.campus === campus.name || asset.campus === campus.code || asset.priority === index + 1
    ) || campus.image,
  }));
  const academicProgramImages = Object.fromEntries(
    ACADEMIC_PROGRAMS.map((program, index) => [
      program.id,
      findCmsImage('Academic Program', (asset) => asset.campus === program.id || asset.title.includes(program.name) || asset.priority === index + 1) || program.image,
    ])
  );
  const stemResourceImages = Object.fromEntries(
    STEM_RESOURCES.map((kit, index) => [
      kit.id,
      findCmsImage('STEM Resource', (asset) => asset.campus === kit.id || asset.title.includes(kit.name) || asset.priority === index + 1) || kit.image,
    ])
  );
  const heroSlides: HeroSlide[] = googleSheetCMS.heroBanners;
  const fallbackGalleryImages = [
    { url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80', tag: 'Robotic Class' },
    { url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80', tag: 'TK Science Lab' },
    { url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=600&q=80', tag: 'Digital Suite Session' },
    { url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80', tag: 'Graduation Ceremony' },
    { url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80', tag: 'International Sports Meet' },
    { url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80', tag: 'TTP Interactive Board Study' }
  ];
  const libraryGalleryImages = sortImageAssetsByPriority(combinedImageAssets.filter((asset) => asset.category === 'Campus Gallery'))
    .map((asset) => ({ url: asset.url, tag: asset.campus ? `${asset.title} - ${asset.campus}` : asset.title }));
  const sheetGalleryImages: EditableGalleryImage[] = googleSheetCMS.campusGallery.map((item) => ({
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
  const partnerLogoAssets = googleSheetCMS.partnerLogos.length > 0
    ? googleSheetCMS.partnerLogos.map((item) => ({
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
    }))
    : sortImageAssetsByPriority(combinedImageAssets.filter((asset) => asset.category === 'Partner Logo' || asset.category === 'Partner Logos' || asset.category === 'AYLA Logo' || asset.category === 'AYLA Logos'));
  const studentLifeAssets = googleSheetCMS.studentLife.length > 0
    ? googleSheetCMS.studentLife.map((item) => ({
    id: String(item.id),
    title: item.title,
    url: item.directImageUrl,
  }))
    : sortImageAssetsByPriority(combinedImageAssets.filter((asset) => asset.category === 'Student Life')).map((asset) => ({
      id: asset.id,
      title: asset.title,
      url: asset.url,
    }));
  const sheetNews = googleSheetCMS.news.map((item) => ({
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
                    {/* ENHANCED HERO SECTION WITH MOTION GRAPHICS */}
                    <HeroMotion
                      title={locale[lang].heroTitle}
                      subtitle={locale[lang].heroSub}
                      lang={lang}
                    />

                    {/* HERO SECTION */}
                    <section id="home" className="relative min-h-screen flex items-start justify-center overflow-hidden bg-[#071B5C] bg-[radial-gradient(ellipse_at_top,_#1a3cad_0%,_#071B5C_75%)] pt-24 pb-20 sm:pt-28 sm:pb-24 lg:pt-32 lg:pb-28">
                      <HeroCarousel
                        slides={heroSlides}
                        fallbackImage={fallbackHeroImage}
                        isLoading={googleSheetCMS.loading && googleSheetCMS.heroBanners.length === 0}
                      />

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
                    </section>

                    {/* ABOUT PSIS & CAMBODIA HERITAGE CONTINUITY */}
                    <section id="about" className="py-20 bg-white border-t border-gray-100">
                      <div className="max-w-7xl mx-auto px-4 md:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                          <div className="lg:col-span-7 space-y-6">
                            <span className="inline-block bg-brand-gold/10 text-brand-dark font-sans font-medium text-[10px] tracking-widest uppercase px-3.5 py-1.5 rounded-full">
                              {lang === 'en' ? 'Educating Minds since 1997' : 'បណ្តុះបណ្តាលចំណេះដឹងតាំងពីឆ្នាំ១៩៩៧'}
                            </span>
                            <h2 className="font-serif font-bold text-3xl md:text-4.5xl text-brand-dark tracking-tight leading-tight">
                              {locale[lang].aboutTitle}
                            </h2>
                            <p className="text-sm text-brand-gold font-sans font-medium tracking-wide">
                              {locale[lang].aboutSubtitle}
                            </p>
                            <div className="w-12 h-0.5 bg-brand-gold rounded"></div>
                            <div className="space-y-4 text-xs md:text-[13px] text-slate-600 leading-relaxed font-sans font-normal">
                              <p>{locale[lang].aboutP1}</p>
                              <p>{locale[lang].aboutP2}</p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-100">
                              <div className="space-y-1.5">
                                <h4 className="font-nav font-bold text-[11px] text-brand-blue uppercase tracking-wider">{locale[lang].coreV1}</h4>
                                <p className="text-xs text-slate-500 leading-relaxed">{locale[lang].coreV1Desc}</p>
                              </div>
                              <div className="space-y-1.5 border-l sm:border-l-0 sm:border-t-0 border-slate-200 pl-3 sm:pl-0 sm:border-r pr-2 border-slate-200">
                                <h4 className="font-nav font-bold text-[11px] text-brand-blue uppercase tracking-wider">{locale[lang].coreV2}</h4>
                                <p className="text-xs text-slate-500 leading-relaxed">{locale[lang].coreV2Desc}</p>
                              </div>
                              <div className="space-y-1.5">
                                <h4 className="font-nav font-bold text-[11px] text-brand-blue uppercase tracking-wider">{locale[lang].coreV3}</h4>
                                <p className="text-xs text-slate-500 leading-relaxed">{locale[lang].coreV3Desc}</p>
                              </div>
                            </div>
                          </div>

                          <div className="lg:col-span-5 bg-gradient-to-b from-brand-blue to-brand-dark text-white rounded-3xl p-8 border border-white/10 space-y-6 relative overflow-hidden shadow-2xl min-h-[400px] flex flex-col justify-between">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-2xl"></div>
                            <div className="space-y-4 relative z-10">
                              <span className="bg-brand-gold text-brand-dark text-[9px] font-bold uppercase px-2.5 py-1 rounded tracking-widest font-nav">
                                {lang === 'en' ? 'Tertiary Level Integration' : 'ការអប់រំបន្តទៅកាន់ថ្នាក់មហាវិទ្យាល័យ'}
                              </span>
                              <h3 className="font-serif font-bold text-xl md:text-[22px] text-white leading-snug">
                                {lang === 'en' ? 'Paññāsāstra University Pathway' : 'គន្លងផ្លូវឆ្ពោះទៅសាកលវិទ្យាល័យបញ្ញាសាស្ត្រ'}
                              </h3>
                              <p className="text-xs md:text-[13px] text-[#DDE6FF] leading-relaxed font-sans font-light">
                                All high school seniors at PSIS receive synchronized early entry credentials and scholarships corresponding to 10% - 40% based on IELTS score cards to enroll instantly into PUC degree programs.
                              </p>
                            </div>
                            <div className="pt-4 border-t border-white/10 space-y-2 text-xs relative z-10 font-sans">
                              <div className="flex justify-between items-center text-[10px] text-[#E8EEFF]">
                                <span>PUC-IFL Accreditation status</span>
                                <span className="text-emerald-400 font-bold">● ACTIVE</span>
                              </div>
                              <div className="text-brand-gold font-bold">
                                Official partner: British Council & Cambridge English assessments
                              </div>
                            </div>
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

                    {/* NEWS FEED */}
                    <section className="py-20 bg-white border-t border-gray-100">
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

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {googleSheetCMS.loading && googleSheetCMS.news.length === 0 ? (
                            Array.from({ length: 3 }).map((_, idx) => (
                              <div key={idx} className="h-80 animate-pulse rounded-2xl border border-gray-200 bg-slate-100" />
                            ))
                          ) : publicNews.map((item) => (
                            <article key={item.id} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                              <div className="relative">
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="h-48 w-full object-cover"
                                  referrerPolicy="no-referrer"
                                  onError={(event) => {
                                    event.currentTarget.src = fallbackGalleryImages[0].url;
                                  }}
                                />
                              </div>
                              <div className="p-5">
                                <div className="mb-3 flex items-center justify-between gap-3">
                                  <span className="rounded bg-[#112B8C] px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-white">{item.category}</span>
                                  <span className="text-[10px] font-bold uppercase text-slate-400">{item.date}</span>
                                </div>
                                <h3 className="font-serif text-lg font-bold leading-snug text-brand-blue">
                                  {lang === 'kh' && item.khmerTitle ? item.khmerTitle : item.title}
                                </h3>
                                <p className="mt-3 line-clamp-3 text-xs leading-6 text-slate-600">{item.content}</p>
                              </div>
                            </article>
                          ))}
                        </div>
                      </div>
                    </section>
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
