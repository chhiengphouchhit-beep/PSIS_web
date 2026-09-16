import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { Campus } from '../types';

interface FooterSliderProps {
  campuses: Campus[];
  lang: 'en' | 'kh';
  onCampusClick: () => void;
}

export default function FooterSlider({ campuses, lang, onCampusClick }: FooterSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const hasSlides = campuses.length > 0;

  useEffect(() => {
    if (!hasSlides) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % campuses.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, [campuses.length, hasSlides]);

  if (!hasSlides) return null;

  function showPrevious() {
    setActiveIndex((current) => (current - 1 + campuses.length) % campuses.length);
  }

  function showNext() {
    setActiveIndex((current) => (current + 1) % campuses.length);
  }

  return (
    <section className="border-y border-white/10 bg-[#061342] text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-6 px-4 py-10 md:grid-cols-[260px_1fr_140px] md:px-8 lg:py-12">
        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-brand-gold">
            {lang === 'en' ? 'Campus Highlights' : 'សាខាសំខាន់ៗ'}
          </p>
          <h3 className="font-serif text-2xl font-bold leading-tight text-white md:text-3xl">
            {lang === 'en' ? 'Explore PSIS locations' : 'ស្វែងយល់ពីសាខា PSIS'}
          </h3>
          <p className="text-xs leading-6 text-slate-300">
            {lang === 'en' ? 'A quick visual tour of our campus network.' : 'ទស្សនាសាខារបស់យើងតាមរយៈរូបភាពសង្ខេប។'}
          </p>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-2xl">
          <div
            className="flex transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {campuses.map((campus) => (
              <button
                key={campus.id}
                type="button"
                onClick={onCampusClick}
                className="grid min-w-full grid-cols-1 text-left md:grid-cols-[260px_1fr]"
              >
                <img
                  src={campus.image}
                  alt={campus.name}
                  className="h-56 w-full object-cover md:h-48"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const fallback = `/images/campuses/${campus.id}.jpg`;
                    if (e.currentTarget.src !== fallback) {
                      e.currentTarget.src = fallback;
                    }
                  }}
                />
                <div className="flex min-w-0 flex-col justify-center p-5 md:p-7">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-brand-gold px-2 py-1 text-[9px] font-extrabold uppercase tracking-wider text-[#061342]">
                      {campus.code}
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${
                      campus.isComingSoon ? 'text-amber-400' : 'text-slate-300'
                    }`}>
                      {campus.isComingSoon 
                        ? (lang === 'en' ? 'Coming Soon' : 'បើកដំណើរការឆាប់ៗនេះ')
                        : (lang === 'en' ? 'Official Campus' : 'សាខាផ្លូវការ')}
                    </span>
                  </div>
                  <h4 className="mt-3 truncate font-serif text-2xl font-bold text-white md:text-3xl">{campus.name}</h4>
                  <p className="mt-1 flex items-center gap-1 truncate text-xs text-slate-300">
                    <MapPin size={12} className="shrink-0 text-brand-gold" />
                    {campus.location}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 md:justify-end">
          <div className="flex gap-1.5">
            {campuses.map((campus, index) => (
              <button
                key={campus.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === activeIndex ? 'w-7 bg-brand-gold' : 'w-2 bg-white/30 hover:bg-white/60'
                }`}
                aria-label={`Show ${campus.name}`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={showPrevious}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
              aria-label="Previous campus"
            >
              <ChevronLeft size={17} />
            </button>
            <button
              type="button"
              onClick={showNext}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
              aria-label="Next campus"
            >
              <ChevronRight size={17} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
