/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ACADEMIC_PROGRAMS } from '../mockData';
import { ArrowRight, BookOpen, Compass, CheckSquare } from 'lucide-react';

interface PublicAcademicProps {
  lang: 'en' | 'kh';
  programImages?: Record<string, string>;
}

export default function PublicAcademic({ lang, programImages = {} }: PublicAcademicProps) {
  const [activeProgId, setActiveProgId] = useState<string>('primary');

  const selectedProg = ACADEMIC_PROGRAMS.find(p => p.id === activeProgId) || ACADEMIC_PROGRAMS[0];
  const selectedProgImage = programImages[selectedProg.id] || selectedProg.image;

  // Map key timelines for infographic summary representation
  const milestones = [
    { id: 'preschool', name: 'Preschool International', age: 'Ages 3 - 5', step: '01', desc: 'Bilingual play foundations, sensory focus development, and early English scripts.' },
    { id: 'primary', name: 'Singapore Primary School', age: 'Ages 6 - 11', step: '02', desc: 'Comprehensive Singapore mathematics, critical analysis, and computer science basics.' },
    { id: 'secondary', name: 'Secondary School Track', age: 'Ages 12 - 15', step: '03', desc: 'Robotics kits, code scripting, bilingual science, and intermediate humanities.' },
    { id: 'highschool', name: 'High School & PUC prep', age: 'Ages 16 - 18', step: '04', desc: 'Elite physics, university calculus, professional IELTS training, and scholarships.' }
  ];

  return (
    <section id="academics" className="py-16 sm:py-20 md:py-28 bg-white scroll-mt-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 md:mb-20 space-y-3 sm:space-y-4">
          <span className="inline-block bg-brand-blue/5 text-brand-blue font-sans font-medium text-[10px] tracking-widest uppercase px-3.5 py-1.5 rounded-full border border-brand-blue/10">
            {lang === 'en' ? 'Elite Academic Pathways' : 'កម្មវិធីសិក្សាអប់រំលំដាប់អន្តរជាតិ'}
          </span>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl md:text-[45px] text-brand-dark tracking-tight leading-tight">
            {lang === 'en' ? 'Bilingual Journey. Global Futures.' : 'កម្មវិធីពីរភាសា គំនិតច្នៃប្រឌិតឆ្ពោះទៅអនាគត'}
          </h2>
          <div className="w-16 h-0.5 bg-brand-gold mx-auto rounded"></div>
          <p className="text-xs sm:text-sm text-slate-500 font-sans leading-relaxed px-2">
            {lang === 'en'
              ? 'Paññāsāstra International School deploys modern, dual language tracks completely synced with Singapore mathematics standards, Cambridge language competencies, and tech engineering matrices.'
              : 'សាលាអន្តរជាតិ បញ្ញាសាស្ត្រ ផ្តល់ជូននូវការសិក្សាពីរភាសា (អង់គ្លេស-ខ្មែរ) ស្របតាមស្តង់ដារគណិតវិទ្យាសិង្ហបុរី ស្តង់ដារភាសាអង់គ្លេស Cambridge និងបច្គេកវិទ្យាឌីជីថល។'}
          </p>
        </div>

        {/* Infographic Learning Journey Timeline Widget (2x2 on phone, 4 cols on desktop) */}
        <div className="mb-10 sm:mb-14 md:mb-16 grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5 md:gap-4 relative">
          {/* Connecting line behind milestones on desktop */}
          <div className="hidden lg:block absolute top-[50px] left-[12.5%] right-[12.5%] h-1 bg-slate-100 z-0"></div>
          
          {milestones.map((ms) => {
            const isSelected = activeProgId === ms.id;
            return (
              <button
                key={ms.id}
                onClick={() => setActiveProgId(ms.id)}
                className={`text-left p-3.5 sm:p-5 md:p-6 rounded-2xl border transition-all duration-300 relative z-10 cursor-pointer outline-none flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-900 border-slate-900 text-white shadow-xl scale-[1.01]'
                    : 'bg-slate-50 hover:bg-slate-100/70 border-slate-100 text-slate-800'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-2.5 sm:mb-4">
                    <span className={`text-[8px] sm:text-[10px] font-bold font-nav uppercase px-2 sm:px-2.5 py-0.5 sm:py-1 rounded tracking-wider sm:tracking-widest ${
                      isSelected ? 'bg-brand-gold text-slate-950' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {ms.age}
                    </span>
                    <span className={`font-mono text-base sm:text-xl font-black ${isSelected ? 'text-white/30' : 'text-slate-300'}`}>
                      {ms.step}
                    </span>
                  </div>
                  
                  <h4 className="text-[11px] sm:text-xs font-bold font-nav tracking-wide mb-1 sm:mb-2 line-clamp-1 sm:line-clamp-none">
                    {ms.name}
                  </h4>
                  <p className={`text-[9px] sm:text-[10px] leading-relaxed font-sans line-clamp-2 sm:line-clamp-none ${isSelected ? 'text-slate-300 font-light' : 'text-slate-500'}`}>
                    {ms.desc}
                  </p>
                </div>

                {isSelected && (
                  <motion.div 
                    layoutId="journeyTimelineGlow"
                    className="absolute bottom-0 left-4 right-4 sm:left-6 sm:right-6 h-1 sm:h-1.5 bg-brand-gold rounded-t-full"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Active Division Information Dashboard Block */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-0">
          
          {/* Side Graphic Image Box (Responsive Height on mobile/tablet) */}
          <div className="lg:col-span-5 h-60 sm:h-72 md:h-84 lg:h-auto lg:min-h-[460px] relative overflow-hidden bg-slate-900 shrink-0">
            <AnimatePresence mode="wait">
              <motion.img
                key={selectedProgImage}
                initial={{ scale: 1.15, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.35 }}
                src={selectedProgImage}
                alt={selectedProg.name}
                className="w-full h-full object-cover absolute inset-0 select-none"
                referrerPolicy="no-referrer"
                onError={(event) => {
                  event.currentTarget.src = selectedProg.image;
                }}
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-[#071B5C] via-[#071B5C]/30 to-transparent"></div>
            
            <div className="absolute bottom-5 sm:bottom-8 md:bottom-10 left-5 sm:left-8 md:left-10 right-5 sm:right-8 md:right-10 text-white space-y-1.5 sm:space-y-2">
              <span className="bg-brand-gold text-brand-dark font-nav font-semibold text-[8px] sm:text-[9px] uppercase px-2.5 py-1 rounded tracking-widest inline-block">
                {lang === 'en' ? 'Admission Registry Target Age' : 'លក្ខខណ្ឌអាយុ'}
              </span>
              <h4 className="font-serif font-bold text-white text-base sm:text-lg tracking-wide leading-tight">
                {selectedProg.ageGroup}
              </h4>
            </div>
          </div>

          {/* Details & Module Highlights Box */}
          <div className="lg:col-span-7 p-5 sm:p-8 md:p-12 space-y-6 sm:space-y-8 flex flex-col justify-between">
            
            <div className="space-y-3 sm:space-y-4">
              <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-[#112B8C] bg-brand-blue/5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full font-sans border border-brand-blue/10 inline-block">
                {lang === 'en' ? 'Curriculum Overview' : 'ព័ត៌មានទូទៅនៃកម្មវិធីសិក្សា'}
              </span>
              
              <h3 className="font-serif font-bold text-brand-blue text-xl sm:text-2xl md:text-[28px] tracking-tight mt-1 leading-tight">
                {lang === 'en' ? selectedProg.name : selectedProg.khmerName}
              </h3>
              
              <p className="text-xs sm:text-sm text-slate-650 leading-relaxed font-sans font-light">
                {selectedProg.description}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 pt-5 sm:pt-6 border-t border-slate-200">
              
              {/* Column 1: Subjects List */}
              <div className="space-y-3">
                <h4 className="font-nav font-bold text-[10px] uppercase text-slate-400 tracking-widest flex items-center">
                  <BookOpen size={12} className="mr-1.5 text-brand-gold" />
                  {lang === 'en' ? 'Core Sub-Modules' : 'មុខវិជ្ជាគោលៗ'}
                </h4>
                
                <ul className="space-y-2 sm:space-y-2.5">
                  {selectedProg.curriculum.map((subject, idx) => (
                    <li key={idx} className="flex items-center text-xs text-slate-705 font-sans">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-gold mr-2.5 sm:mr-3 shrink-0"></span>
                      <span className="font-medium">{subject}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 2: Program Keys */}
              <div className="space-y-3">
                <h4 className="font-nav font-bold text-[10px] uppercase text-slate-400 tracking-widest flex items-center">
                  <Compass size={12} className="mr-1.5 text-brand-gold" />
                  {lang === 'en' ? 'Program Advantages' : 'លក្ខណៈពិសេសប្រចាំកម្មវិធី'}
                </h4>
                
                <ul className="space-y-2 sm:space-y-2.5">
                  {selectedProg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-xs text-slate-700 font-sans font-medium">
                      <CheckSquare size={13} className="mr-2 sm:mr-2.5 text-emerald-500 mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Quick action button inside curriculum drawer */}
            <div className="pt-5 sm:pt-6 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => {
                  const form = document.getElementById('apply-now');
                  if (form) {
                    form.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="w-full sm:w-auto justify-center bg-brand-blue hover:bg-brand-dark text-white font-nav font-bold text-xs uppercase tracking-wider px-6 sm:px-7 py-3.5 sm:py-[15px] rounded-xl shadow-md hover:shadow-lg transition flex items-center space-x-2.5 cursor-pointer"
              >
                <span>{lang === 'en' ? 'Apply for this program' : 'ចុះឈ្មោះចូលរៀនក្នុងកម្មវិធីនេះ'}</span>
                <ArrowRight size={13} />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
