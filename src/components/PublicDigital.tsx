/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DIGITAL_LEARNING_SUITE } from '../mockData';
import { Sparkles, GraduationCap, BookOpen, Code, ShieldCheck, Languages, AppWindow } from 'lucide-react';

interface PublicDigitalProps {
  lang: 'en' | 'kh';
}

const iconsMap: Record<string, any> = {
  Sparkles,
  GraduationCap,
  BookOpen,
  Code,
  ShieldCheck,
  Languages
};

function matchesGradeFilter(gradeLevels: string, filter: string) {
  if (filter === 'All') return true;

  const normalized = gradeLevels.toLowerCase();
  if (filter === 'Primary') {
    return normalized.includes('preschool') || normalized.includes('grade 1') || normalized.includes('grade 1 to 6');
  }

  if (filter === 'Secondary') {
    return normalized.includes('grade 7') || normalized.includes('grade 8') || normalized.includes('grade 9') || normalized.includes('grade 2 to 9');
  }

  if (filter === 'High School') {
    return normalized.includes('grade 10') || normalized.includes('grade 11') || normalized.includes('grade 12');
  }

  return normalized.includes(filter.toLowerCase());
}

export default function PublicDigital({ lang }: PublicDigitalProps) {
  const [activeTab, setActiveTab] = useState<string>('All');

  // Filter keys
  const filtersList = ['All', 'Primary', 'Secondary', 'High School'];

  const filteredApps = DIGITAL_LEARNING_SUITE.filter((app) => matchesGradeFilter(app.gradeLevels, activeTab));

  return (
    <section id="digital" className="py-28 bg-[#fafbfc] border-b border-slate-100 scroll-mt-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Header Block Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-20 gap-8">
          <div className="space-y-4 max-w-2xl">
            <span className="inline-block bg-brand-blue/5 text-brand-blue font-sans font-extrabold text-[10px] tracking-widest uppercase px-3.5 py-1.5 rounded-full border border-brand-blue/10">
              {lang === 'en' ? 'Proprietary Digital Licenses' : 'ការអប់រំបែបឌីជីថលឆ្លាតវៃ'}
            </span>
            <h2 className="font-serif font-bold text-3xl md:text-[45px] text-brand-dark tracking-tight leading-tight">
              {lang === 'en' ? 'Centralized SaaS Apps In Every Classroom' : 'ប្រព័ន្ធអប់រំបច្ចេកវិទ្យាលំដាប់ថ្នាក់អន្តរជាតិ'}
            </h2>
            <div className="w-16 h-1 bg-brand-blue rounded"></div>
            <p className="text-xs md:text-sm text-slate-500 font-sans leading-relaxed">
              {lang === 'en'
                ? 'We completely bypass heavy textbook fatigue. PSIS pupils enjoy dedicated single-sign-on access to premium learning tools. Math homework is gamified, reading tracked by AI models, and coding introduced at early grades.'
                : 'យើងជៀសវាងការធុញទ្រាន់នឹងសៀវភៅក្រាស់ៗ។ សิស្សានុសិស្សទទួលបានអាខោនផ្ទាល់ខ្លួនសម្រាប់ការប្រកួតប្រជែងគណិតវិទ្យា KooBits, កូដឌីង CodeMonkey និងបណ្ណាល័យឌីជីថល Raz-Kids។'}
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#071B5C] to-[#051445] text-white p-6 rounded-2xl border border-brand-gold/25 shadow-xl space-y-2 text-xs font-sans max-w-sm shrink-0 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-brand-gold/10 rounded-full blur-xl animate-pulse"></div>
            <span className="text-[10px] text-brand-gold font-extrabold uppercase tracking-widest block font-sans">
              ★ SYSTEM SYNCHRONIZATION
            </span>
            <p className="text-slate-200 leading-relaxed font-light pl-0.5">
              Pupils track scores, reading milestones, and software modules directly on our unified administrative control database.
            </p>
          </div>
        </div>

        {/* Dashboard Frame (Inspired by Linear / Stripe - Recoded in PSIS Colors) */}
        <div className="bg-[#051445] rounded-3xl border border-brand-blue/60 shadow-2xl p-6 md:p-8 space-y-8 relative overflow-hidden">
          {/* Subtle grid decor list using blue themed line patterns */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#112b8c_1px,transparent_1px),linear-gradient(to_bottom,#112b8c_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35 pointer-events-none"></div>

          {/* SaaS Header Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-brand-blue pb-5 relative z-10">
            <div className="flex items-center space-x-2.5">
              <AppWindow className="text-brand-gold w-5.5 h-5.5" />
              <div>
                <h4 className="font-sans font-extrabold text-[11px] text-slate-350 uppercase tracking-widest">
                  Software Suite Directory
                </h4>
                <p className="text-[10px] text-slate-300 font-sans">
                  Active authorized platforms certified for 2026 academic semesters
                </p>
              </div>
            </div>

            {/* Filter buttons inline */}
            <div className="flex flex-wrap gap-1.5 bg-[#030e2f] border border-brand-blue/50 p-1 rounded-xl">
              {filtersList.map((filter) => {
                const isSelected = activeTab === filter;
                return (
                  <button
                    key={filter}
                    onClick={() => setActiveTab(filter)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider transition-all duration-150 cursor-pointer outline-none ${
                      isSelected
                        ? 'bg-brand-gold text-brand-dark shadow-md'
                        : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    {filter}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Datagrid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
            <AnimatePresence mode="popLayout">
              {filteredApps.map((app) => {
                const IconComponent = iconsMap[app.iconName] || BookOpen;
                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.25 }}
                    key={app.id}
                    className="bg-[#071B5C]/35 hover:bg-[#071B5C]/55 border border-brand-blue/70 rounded-2xl p-6 shadow-xl transition-all duration-300 space-y-6 flex flex-col justify-between hover:border-brand-gold/45 active:scale-[0.98]"
                  >
                    <div className="space-y-4">
                      {/* Left Top Logo and Pill */}
                      <div className="flex justify-between items-start">
                        <div className="w-11 h-11 rounded-xl bg-brand-gold/10 text-slate-100 flex items-center justify-center border border-brand-gold/25 shadow-inner">
                          <IconComponent size={20} className="text-brand-gold stroke-[2]" />
                        </div>
                        
                        <span className="bg-[#030e2f] text-brand-gold font-sans font-bold text-[9px] uppercase px-2.5 py-1 rounded-md border border-brand-gold/20 tracking-wider">
                          {app.gradeLevels}
                        </span>
                      </div>

                      {/* Main Title and Description parameters */}
                      <div className="space-y-2">
                        <h4 className="font-serif font-bold text-base text-white tracking-tight">
                          {app.name}
                        </h4>
                        <p className="text-[11px] text-slate-200 leading-relaxed font-sans font-light">
                          {app.description}
                        </p>
                      </div>
                    </div>

                    {/* Integrated Information parameters */}
                    <div className="border-t border-brand-blue pt-4.5 space-y-2 text-[10px] font-sans">
                      <div>
                        <span className="font-extrabold text-slate-400 uppercase tracking-widest block">{lang === 'en' ? 'Syllabus integration' : 'គោលបំណងសំខាន់'}</span>
                        <span className="text-slate-200 font-semibold">{app.purpose}</span>
                      </div>
                    </div>

                  </motion.div>
                );
              })}
            </AnimatePresence>
            {filteredApps.length === 0 && (
              <div className="col-span-full rounded-2xl border border-brand-blue bg-[#071B5C]/30 p-8 text-center text-sm font-semibold text-slate-200">
                {lang === 'en' ? 'No software suites are assigned to this level yet.' : 'មិនទាន់មានកម្មវិធីសម្រាប់កម្រិតនេះនៅឡើយទេ។'}
              </div>
            )}
          </div>
        </div>

        {/* Dynamic CTA Banner */}
        <div className="bg-brand-blue rounded-3xl p-8 md:p-12 mt-12 text-white flex flex-col sm:flex-row justify-between items-center gap-8 relative overflow-hidden shadow-xl border border-white/5">
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="space-y-1.5 text-center sm:text-left relative z-10">
            <h4 className="font-serif font-bold text-xl md:text-2xl text-white tracking-tight">
              {lang === 'en' ? 'Request physical classroom inspection?' : 'ចង់ឃើញការបង្ហាញបច្ចេកវិទ្យាទាំងនេះផ្ទាល់ដែរឬទេ?'}
            </h4>
            <p className="text-xs text-brand-gold font-sans font-semibold uppercase tracking-widest leading-loose">
              {lang === 'en' ? 'Book a premium personalized tour today.' : 'កក់ពេលមកទស្សនាសាលា ដើម្បីសាកល្បងហេដ្ឋារចនាសម្ព័ន្ធបច្ចេកវិទ្យា។'}
            </p>
          </div>

          <button
            onClick={() => {
              const form = document.getElementById('apply-now');
              if (form) {
                form.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="bg-brand-gold hover:bg-amber-500 text-brand-dark font-nav font-bold text-xs uppercase tracking-wider px-8 py-[17px] rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition duration-150 cursor-pointer relative z-10 shrink-0"
          >
            {lang === 'en' ? 'Explore Lab Infrastructure' : 'កក់ពេលមកទស្សនាភ្លាមៗ'}
          </button>
        </div>

      </div>
    </section>
  );
}
