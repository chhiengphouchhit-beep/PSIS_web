import { motion } from 'motion/react';
import { ImageAsset } from '../types';

interface Props {
  lang: 'en' | 'kh';
  assets?: ImageAsset[];
  isLoading?: boolean;
}

const partners = [
  { key: 'ayla', base: 'ayla', alt: 'Australia Young Leaders Academy' },
  { key: 'puc', base: 'puc', alt: 'Paññāsāstra University of Cambodia' },
  { key: 'puc-ifl', base: 'puc-ifl', alt: 'PUC-IFL' },
  { key: 'elif', base: 'elif', alt: 'ELIF' },
  { key: 'koobits', base: 'koobits', alt: 'Koobits' },
  { key: 'raz-kids', base: 'raz-kids', alt: 'Raz-Kids' },
  { key: 'codemonkey', base: 'codemonkey', alt: 'CodeMonkey' },
  { key: 'turnitin', base: 'turnitin', alt: 'Turnitin' },
  { key: 'kubo', base: 'kubo', alt: 'KUBO' },
  { key: 'smart-world', base: 'smart-world', alt: 'Smart World Robotics' }
];

function srcCandidates(base: string) {
  // prefer modern formats if available on the server; fall back to svg
  return [
    `/images/partners/${base}.webp`,
    `/images/partners/${base}.png`,
    `/images/partners/${base}.jpg`,
    `/images/partners/${base}.svg`
  ];
}

export default function PartnerLogoSection({ assets = [], isLoading = false }: Props) {
  const libraryPartners = assets.map((asset) => ({
    key: asset.id,
    alt: asset.title,
    url: asset.url,
    asset,
  }));
  const displayPartners = libraryPartners.length > 0 ? libraryPartners : partners.map((partner) => ({
    key: partner.key,
    alt: partner.alt,
    url: srcCandidates(partner.base)[3],
    sources: srcCandidates(partner.base),
  }));

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="bg-white py-12"
    >
      <div className="w-full">
        {/* Small screen: horizontal carousel */}
        <div className="sm:hidden">
          <div className="overflow-x-auto no-scrollbar px-4">
            <div className="flex gap-4 py-3 items-stretch">
              {isLoading ? Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="h-24 w-44 flex-shrink-0 animate-pulse rounded-xl border border-slate-100 bg-slate-100" />
              )) : displayPartners.map((p) => (
                <div key={p.key} className="relative flex-shrink-0 w-44 p-4 bg-white rounded-xl border border-slate-100 shadow-sm flex items-center justify-center">
                  <picture className="w-full h-full flex items-center justify-center">
                    {'sources' in p && <source srcSet={p.sources[0]} type="image/webp" />}
                    {'sources' in p && <source srcSet={p.sources[1]} type="image/png" />}
                    <img
                      src={p.url}
                      alt={p.alt}
                      className="max-h-14 object-contain opacity-100 transition-all duration-200 hover:scale-105"
                      referrerPolicy="no-referrer"
                      onError={(event) => {
                        event.currentTarget.src = '/images/partners/ayla.svg';
                      }}
                    />
                  </picture>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop / Tablet grid */}
        <div className="hidden sm:block max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 items-center">
            {isLoading ? Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="h-28 animate-pulse rounded-xl border border-slate-100 bg-slate-100" />
            )) : displayPartners.map((p) => (
              <div key={p.key} className="relative p-6 bg-white rounded-xl border border-slate-100 shadow-sm flex items-center justify-center h-28 hover:shadow-md transition-shadow duration-200">
                <picture className="w-full h-full flex items-center justify-center">
                  {'sources' in p && <source srcSet={p.sources[0]} type="image/webp" />}
                  {'sources' in p && <source srcSet={p.sources[1]} type="image/png" />}
                  <img
                    src={p.url}
                    alt={p.alt}
                    className="max-h-16 object-contain opacity-100 transition-all duration-200 hover:scale-105"
                    referrerPolicy="no-referrer"
                    onError={(event) => {
                      event.currentTarget.src = '/images/partners/ayla.svg';
                    }}
                  />
                </picture>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
