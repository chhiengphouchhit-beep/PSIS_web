/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Campus } from '../types';
import { MapPin, Building2, CheckCircle, Sparkles, ArrowUpRight } from 'lucide-react';

interface CampusesSectionProps {
  campuses: Campus[];
  lang: 'en' | 'kh';
}

export default function CampusesSection({ campuses, lang }: CampusesSectionProps) {
  const [selectedCampusId, setSelectedCampusId] = useState<string>('tk');
  const [mapCampus, setMapCampus] = useState<Campus | null>(null);

  const activeCampus = campuses.find((c) => c.id === selectedCampusId) || campuses[0];

  if (!activeCampus) {
    return (
      <section id="campuses" className="py-24 bg-slate-50 scroll-mt-12 text-center text-gray-400 font-sans text-xs">
        {lang === 'en' ? 'No campus info available' : 'មិនមានព័ត៌មានសាខាឡើយ'}
      </section>
    );
  }

  return (
    <section id="campuses" className="py-28 bg-[#fafbfc] scroll-mt-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <span className="inline-block bg-brand-blue/5 text-brand-blue font-sans font-medium text-[10px] tracking-widest uppercase px-3.5 py-1.5 rounded-full border border-brand-blue/10">
            {lang === 'en' ? 'Exclusive Academic Footprint' : 'បណ្តាញសាខាទូទាំងប្រទេសរបស់យើង'}
          </span>
          <h2 className="font-serif font-bold text-3xl md:text-[45px] text-brand-dark tracking-tight leading-tight">
            {lang === 'en' ? '6 Campus Operations. One Standard.' : 'សាខាទាំង៦ តម្រង់ទិសដៅស្តង់ដារតែមួយ'}
          </h2>
          <div className="w-16 h-0.5 bg-brand-gold mx-auto rounded"></div>
          <p className="text-xs md:text-sm text-slate-500 font-sans leading-relaxed">
            {lang === 'en'
              ? 'Paññāsāstra International School group deploys world-class high-speed digital arrays, certified native teachers, and highly functional engineering research labs seamlessly across Phnom Penh and provinces.'
              : 'សហគមន៍សាលាអន្តរជាតិ បញ្ញាសាស្ត្រ ចែករំលែកនូវហេដ្ឋារចនាសម្ព័ន្ធបច្ចេកវិទ្យាលំដាប់ពិភពលោក គ្រូជនជាតិដើម និងប្រព័ន្ធពិសោធន៍រ៉ូបូតគ្រប់សាខាទាំងអស់។'}
          </p>
        </div>

        {/* Master Interactive Core Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Switchboard column (4 cols on lg layout) */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="font-nav font-bold text-[10px] uppercase text-slate-400 tracking-widest px-1">
              {lang === 'en' ? 'Select Campus Location' : 'ជ្រើសរើសសាខាសាលា'}
            </h3>
            
            <div className="space-y-3">
              {campuses.map((c) => {
                const isSelected = selectedCampusId === c.id;
                return (
                  <div key={c.id} className="space-y-2">
                    <button
                      onClick={() => setSelectedCampusId(c.id)}
                      className={`w-full text-left p-4 rounded-2xl transition-all duration-300 cursor-pointer border relative outline-none ${
                        isSelected
                          ? 'bg-gradient-to-r from-brand-blue to-brand-dark text-white border-brand-blue shadow-lg scale-[1.02]'
                          : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border-slate-200/60 shadow-sm'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2.5 rounded-xl transition-colors duration-300 ${isSelected ? 'bg-white/10 text-brand-gold shadow-inner' : 'bg-slate-50 text-brand-blue'}`}>
                          <Building2 size={16} />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <h4 className="font-nav font-bold text-xs tracking-wide">{c.name}</h4>
                            <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded font-nav tracking-widest transition-colors duration-300 ${
                              isSelected ? 'text-brand-dark bg-brand-gold' : 'text-slate-500 bg-slate-100'
                            }`}>
                              {c.code}
                            </span>
                          </div>
                          <p className={`text-[10px] tracking-normal mt-1 font-sans ${isSelected ? 'text-slate-200' : 'text-slate-500'}`}>
                            {c.location.split(',')[1] || c.location}
                          </p>
                        </div>
                      </div>
                    </button>

                    <div className="flex justify-end">
                      <button
                        onClick={() => setMapCampus(c)}
                        className="text-[10px] px-3 py-2 rounded-xl bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 shadow-sm transition duration-150"
                        aria-label={lang === 'en' ? `Show ${c.name} on map` : `បង្ហាញ ${c.name} លើផែនទី`}
                      >
                        {lang === 'en' ? 'Show on Map' : 'បង្ហាញផែនទី'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Structured Stats display panel under switcher */}
            <div className="bg-[#07133C] text-white rounded-2xl p-6 border border-white/5 space-y-5 shadow-xl relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-gold/10 rounded-full blur-2xl"></div>
              
              <span className="text-[9px] uppercase tracking-widest text-brand-gold font-bold font-nav">
                {lang === 'en' ? 'Consolidated Physical Footprint' : 'ទិន្នន័យសរុប'}
              </span>
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 border-r border-white/10">
                  <div className="text-xl font-bold font-sans text-brand-gold text-2xl">5,100+</div>
                  <div className="text-[9px] uppercase tracking-wider text-slate-300 mt-1 font-nav font-bold">
                    {lang === 'en' ? 'Total Pupils' : 'សិស្សសរុប'}
                  </div>
                </div>
                <div className="p-3">
                  <div className="text-xl font-bold font-sans text-brand-gold text-2xl">185+</div>
                  <div className="text-[9px] uppercase tracking-wider text-slate-300 mt-1 font-nav font-bold">
                    {lang === 'en' ? 'Classrooms' : 'បន្ទប់សិក្សា'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Dynamic detail workspace of selected campus with stunning entry/swaps */}
          <div className="lg:col-span-8 bg-white border border-slate-100 rounded-3xl shadow-xl overflow-hidden min-h-[600px] flex flex-col">
            
            {/* Image Banner Container */}
            <div className="h-72 md:h-96 w-full relative overflow-hidden bg-slate-900 shadow-inner shrink-0">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeCampus.image}
                  initial={{ scale: 1.15, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  src={activeCampus.image}
                  alt={activeCampus.name}
                  className="w-full h-full object-cover select-none absolute inset-0"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const fallback = `/images/campuses/${activeCampus.id}.jpg`;
                    if (e.currentTarget.src !== fallback) {
                      e.currentTarget.src = fallback;
                    }
                  }}
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/45 to-transparent"></div>
              
              {/* Overlay Campus Identity Details */}
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                <span className="bg-brand-gold text-[#07133C] text-[9px] font-bold uppercase px-2.5 py-1 rounded font-nav tracking-widest shadow-md">
                  {lang === 'en' ? 'Official Campus Site' : 'មជ្ឈមណ្ឌលសិក្សាផ្លូវការ'}
                </span>
                
                <h3 className="font-serif font-bold text-2xl md:text-3.5xl text-white tracking-wide leading-tight">
                  {activeCampus.name}
                </h3>
                
                <div className="flex items-center text-xs text-slate-200 font-sans font-light">
                  <MapPin size={13} className="mr-1.5 text-brand-gold shrink-0" />
                  <span>{activeCampus.location || ''}</span>
                </div>
              </div>
            </div>

            {/* Profile Content and highlights blocks */}
            <div className="p-6 md:p-10 space-y-8 flex-grow">
              
              {/* Message from Campus Principal: Designed like a high-end editorial block */}
              <div className="bg-amber-50/40 border border-amber-200/45 rounded-2xl p-6 relative">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-11 h-11 rounded-full bg-brand-dark text-brand-gold flex items-center justify-center font-black text-sm shadow-md ring-2 ring-amber-100">
                    {(activeCampus.principal || 'Principal').split(' ').slice(-1)[0]?.[0] || 'P'}
                  </div>
                  <div>
                    <h5 className="text-[10px] font-extrabold text-[#071B5C] uppercase tracking-wider font-sans">
                      {lang === 'en' ? 'Campus Principal Message' : 'សារលិខិតពីនាយកសាលា'}
                    </h5>
                    <p className="text-xs text-slate-800 font-extrabold font-sans mt-0.5">
                      {activeCampus.principal || ''}
                    </p>
                    <p className="text-[10px] text-slate-400 font-sans tracking-wide">
                      {lang === 'en' ? 'Campus Director & Academic Head' : 'នាយកគ្រប់គ្រងប្រចាំសាខា'}
                    </p>
                  </div>
                </div>
                
                <p className="text-xs text-slate-600 italic leading-relaxed font-sans font-light relative z-10 pl-1">
                  "{activeCampus.message || ''}"
                </p>
              </div>

              {/* Infrastructure List: Custom Bento-style visual tags */}
              <div className="space-y-4">
                <h4 className="font-sans font-extrabold text-[10px] uppercase text-slate-500 tracking-widest flex items-center">
                  <Sparkles size={11} className="mr-1.5 text-brand-gold animate-pulse" />
                  {lang === 'en' ? 'Premium On-Site Infrastructure' : 'ហេដ្ឋារចនាសម្ព័ន្ធលេចធ្លោប្រចាំសាខា'}
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans">
                  {(activeCampus.facilities || []).map((fac, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-start text-xs text-slate-700 bg-slate-50 border border-slate-100/50 p-3 rounded-xl hover:bg-slate-100/50 transition-colors"
                    >
                      <CheckCircle size={14} className="mr-2.5 text-brand-gold shrink-0 mt-0.5" />
                      <span className="font-medium">{fac}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Action and Phone Lines footer layout */}
              <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-xs text-slate-500 font-sans flex flex-col sm:flex-row sm:items-center gap-1">
                  <span className="font-bold text-slate-800">{lang === 'en' ? 'Central Contact Line:' : 'ទំនាក់ទំនងព័ត៌មាន៖'}</span>
                  <span className="text-brand-blue font-mono font-semibold tracking-wide bg-brand-blue/5 border border-brand-blue/10 px-2 py-0.5 rounded text-[11px]">{activeCampus.contact || ''}</span>
                </div>
                
                <button
                  onClick={() => {
                    const form = document.getElementById('apply-now');
                    if (form) {
                      form.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="bg-brand-gold hover:bg-amber-500 text-brand-dark text-xs uppercase tracking-wider font-nav font-bold px-6 py-3.5 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition duration-150 cursor-pointer w-full sm:w-auto text-center flex items-center justify-center gap-1.5"
                >
                  <span>{lang === 'en' ? 'Contact Campus Office' : 'ទាក់ទងមកកាន់ការិយាល័យសាខានេះ'}</span>
                  <ArrowUpRight size={13} />
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Map Modal */}
      <AnimatePresence>
        {mapCampus && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              onClick={() => setMapCampus(null)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="relative w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border"
            >
              <div className="flex items-center justify-between p-3 border-b">
                <div className="text-sm font-bold">{mapCampus.name}</div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setMapCampus(null)}
                    className="text-xs px-3 py-1 rounded bg-slate-100 hover:bg-slate-200"
                  >
                    {lang === 'en' ? 'Close' : 'បិទ'}
                  </button>
                </div>
              </div>

              <div className="w-full h-[60vh] md:h-[70vh] bg-slate-100">
                {mapCampus ? (
                  <div className="w-full h-full flex flex-col">
                    <div className="flex items-center justify-end p-2 gap-2 bg-white/30 border-b">
                      <a
                        href={`https://www.google.com/maps/d/viewer?mid=1h57f7r9rMOuAuuc60o698HUZ7szHk7I`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs px-3 py-1 rounded bg-brand-blue/5 text-brand-blue border border-brand-blue/10 hover:bg-brand-blue/10"
                      >
                        {lang === 'en' ? 'Open in My Maps' : 'បើកក្នុងផែនទីរបស់ខ្ញុំ'}
                      </a>
                    </div>

                    <iframe
                      title={`map-${mapCampus.id}`}
                      src={`https://www.google.com/maps/d/embed?mid=1h57f7r9rMOuAuuc60o698HUZ7szHk7I`}
                      className="w-full flex-1 border-0"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm text-slate-500">{lang === 'en' ? 'Map not available' : 'មិនមានផែនទី'}</div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
