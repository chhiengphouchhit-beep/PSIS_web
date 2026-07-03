/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { Award, Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  lang: 'en' | 'kh';
  setCurrentSection: (sec: string) => void;
}

export default function Footer({ lang, setCurrentSection }: FooterProps) {
  const [emailSub, setEmailSub] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSub = (e: FormEvent) => {
    e.preventDefault();
    if (emailSub.trim()) {
      setSuccess(true);
      setEmailSub('');
      setTimeout(() => setSuccess(false), 4000);
    }
  };

  const handleNavClick = (id: string) => {
    setCurrentSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#040C29] text-white border-t border-white/10 relative overflow-hidden">
      {/* Visual Accent Divider: Triple gold-red-blue brand strip */}
      <div className="h-1.5 w-full bg-gradient-to-r from-brand-blue via-brand-gold to-brand-red"></div>

      {/* Subtle backdrop mesh */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-blue/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          
          {/* Column A: Branding Identity & Credentials (4 cols on lg) */}
          <div className="lg:col-span-4 space-y-6">
            <div 
              onClick={() => handleNavClick('home')}
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-full bg-brand-gold flex items-center justify-center shadow-lg">
                <Award className="text-brand-dark w-5.5 h-5.5 stroke-[2]" />
              </div>
              <div>
                <h2 className="font-serif font-black text-xs tracking-wider text-[#E6B83E] leading-none uppercase">
                  AUSTRALIA YOUNG LEADERS ACADEMY
                </h2>
                <p className="text-[10px] font-nav text-white mt-1 uppercase font-semibold tracking-wide">
                  {lang === 'en' ? 'PSIS MEMBER SCHOOL' : 'សាលាអន្តរជាតិ បញ្ញាសាស្ត្រ'}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-normal font-sans">
              {lang === 'en' 
                ? 'Australia Young Leaders Academy Co., Ltd. (AYLA) operates and governs the Paññāsāstra International School (PSIS), providing standard-of-excellence bilingual education, Singapore mathematics, advanced STEM robotic labs, and PUC pathways.'
                : 'ក្រុមហ៊ុន Australia Young Leaders Academy Co., Ltd. (AYLA) គ្រប់គ្រងលើសាលាអន្តរជាតិ បញ្ញាសាស្ត្រ (PSIS) ដើម្បីផ្តល់ជូនការអប់រំពីរភាសា គណិតវិទ្យាសឹង្ហបុរី បច្ចេកវិទ្យា STEM រ៉ូបូត និងគន្លងផ្លូវសិក្សាទៅកាន់សាកលវិទ្យាល័យបញ្ញាសាស្ត្រកម្ពុជា។'}
            </p>

            <div className="pt-2 space-y-3.5 text-xs text-slate-300 font-sans">
              <div className="flex items-start space-x-3">
                <MapPin size={14} className="text-brand-gold shrink-0 mt-0.5" />
                <span className="leading-snug">Main Campus Headquarters: Toul Kork, Phnom Penh, Kingdom of Cambodia</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={14} className="text-brand-gold shrink-0" />
                <span>+855 23 884 991 | Hotlines: +855 12 555 999</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={14} className="text-brand-gold shrink-0" />
                <span>admissions@psis.edu.kh</span>
              </div>
            </div>
          </div>

          {/* Column B: Campuses Directory (3 cols on lg) */}
          <div className="lg:col-span-3 space-y-5">
            <h3 className="font-nav font-bold text-xs uppercase tracking-wider text-brand-gold border-b border-white/10 pb-2.5">
              {lang === 'en' ? '6 Flagship Campuses' : 'បណ្តាញសាខាទាំង៦'}
            </h3>
            <ul className="space-y-3 text-xs font-sans">
              {[
                { name: 'Toul Kork (TK - Head)', code: 'tk' },
                { name: 'Toul Tom Poung (TTP)', code: 'ttp' },
                { name: 'Chbar Ampov (CAP)', code: 'cap' },
                { name: 'Russey Keo (RSK)', code: 'rsk' },
                { name: 'National Road 3 (NR3)', code: 'nr3' },
                { name: 'Battambang Campus (BTB)', code: 'battambang' }
              ].map((c) => (
                <li key={c.code}>
                  <button 
                    onClick={() => handleNavClick('campuses')} 
                    className="text-slate-300 hover:text-white transition-colors duration-150 flex items-center group cursor-pointer text-left"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-gold mr-3 group-hover:scale-150 transition-all"></span>
                    <span>{c.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column C: Syllabus Portals (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-5">
            <h3 className="font-nav font-bold text-xs uppercase tracking-wider text-brand-gold border-b border-white/10 pb-2.5">
              {lang === 'en' ? 'Syllabus Portals' : 'កម្មវិធីសិក្សាសំខាន់ៗ'}
            </h3>
            <ul className="space-y-3 text-xs font-sans">
              <li>
                <button onClick={() => handleNavClick('academics')} className="text-slate-300 hover:text-white transition text-left cursor-pointer">
                  {lang === 'en' ? 'Bilingual Preschool' : 'មត្តេយ្យទ្វិភាសា'}
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('academics')} className="text-slate-300 hover:text-white transition text-left cursor-pointer">
                  {lang === 'en' ? 'Singapore Primary' : 'បឋមសិក្សាសិង្ហបុរី'}
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('puc-ifl')} className="text-slate-300 hover:text-white transition text-left cursor-pointer">
                  General English (IFL)
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('puc-ifl')} className="text-slate-300 hover:text-white transition text-left cursor-pointer">
                  IELTS / TOEFL Tracks
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('digital')} className="text-slate-300 hover:text-white transition text-left cursor-pointer">
                  {lang === 'en' ? 'Central Digital App Suites' : 'ប្រព័ន្ធសិក្សាអេឡិចត្រូនិក'}
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('stem')} className="text-slate-300 hover:text-white transition text-left cursor-pointer">
                  {lang === 'en' ? 'STEM & Robotic Hubs' : 'បច្គេកវិទ្យាដ្រូន និង រ៉ូបូត'}
                </button>
              </li>
            </ul>
          </div>

          {/* Column D: Admissions & Newsletter (3 cols on lg) */}
          <div className="lg:col-span-3 space-y-5">
            <h3 className="font-nav font-bold text-xs uppercase tracking-wider text-brand-gold border-b border-white/10 pb-2.5">
              {lang === 'en' ? 'Admissions Update' : 'ព័ត៌មានចុះឈ្មោះសិក្សា'}
            </h3>
            <p className="text-xs text-slate-300 font-sans leading-relaxed font-light">
              {lang === 'en' 
                ? 'Subscribe to get priority updates, tuition discount options, and upcoming robotic tryouts.'
                : 'ចុះឈ្មោះដើម្បីទទួលបានព័ត៌មានមុនគេអំពីការចុះឈ្មោះ លក្ខខណ្ឌអាហារូបករណ៍ និងការបញ្ចុះតម្លៃសិក្សា។'}
            </p>
            
            <form onSubmit={handleSub} className="flex flex-col space-y-2">
              <div className="flex bg-white/5 border border-white/10 rounded-lg overflow-hidden focus-within:border-brand-gold transition-colors">
                <input
                  type="email"
                  placeholder={lang === 'en' ? 'parent.email@host.com' : 'អាសយដ្ឋានអ៊ីមែល'}
                  className="bg-transparent text-xs text-white px-3 py-2.5 focus:outline-none w-full border-0 focus:ring-0 placeholder-slate-500 font-sans"
                  value={emailSub}
                  onChange={(e) => setEmailSub(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="bg-brand-gold hover:bg-yellow-500 text-brand-dark px-3.5 flex items-center justify-center transition-colors duration-150 cursor-pointer shrink-0"
                >
                  <Send size={13} />
                </button>
              </div>
              {success && (
                <div className="flex items-center text-emerald-400 text-[11px] mt-1 gap-1.5 font-sans">
                  <CheckCircle2 size={12} className="shrink-0" />
                  <span>
                    {lang === 'en' ? 'Successfully subscribed. Thank you!' : 'បានចុះឈ្មោះដោយជោគជ័យ។ សូមអរគុណ!'}
                  </span>
                </div>
              )}
            </form>

            <div className="border border-white/5 bg-white/[0.03] pt-3 px-3 pb-3 rounded-lg space-y-1.5 text-[10px] font-sans text-slate-400">
              <span className="text-[9px] text-brand-red font-bold uppercase block tracking-wider">MoEYS ACCREDITATION</span>
              <p className="leading-snug">Official curriculum registration authorized by the Ministry of Education, Youth and Sport.</p>
            </div>
          </div>

        </div>

        {/* Global Footer Sub Bar */}
        <div className="pt-8 text-xs font-sans text-slate-400 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left space-y-1">
            <p className="text-slate-300">
              © 2026 Paññāsāstra International School (PSIS). All rights reserved.
            </p>
            <p className="text-[10px] text-slate-500 font-light">
              Gold-standard bilingual learning pathway. Partner of Paññāsāstra University of Cambodia (PUC) and British Council English Assessments.
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleNavClick('apply-now')}
                className="bg-brand-gold hover:bg-amber-500 text-brand-dark font-bold text-[12px] px-4 py-2 rounded-lg transition"
              >
                {lang === 'en' ? 'Apply Now' : 'ចុះឈ្មោះឥឡូវនេះ'}
              </button>

            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] text-slate-400">
              <a href="#about" onClick={(e) => { e.preventDefault(); handleNavClick('about'); }} className="hover:text-white transition">
                {lang === 'en' ? 'Partnerships' : 'បញ្ញត្តិនាយក'}
              </a>
              <span className="text-white/10 hidden md:inline">|</span>
              <a href="#about" onClick={(e) => { e.preventDefault(); handleNavClick('home'); }} className="hover:text-white transition">
                {lang === 'en' ? 'Accreditation' : 'លិខិតទទួលស្គាល់'}
              </a>
              <span className="text-white/10 hidden md:inline">|</span>
              <a href="/admin.html" className="hover:text-brand-gold font-semibold transition text-slate-450">
                {lang === 'en' ? 'Admin Portal' : 'គ្រប់គ្រងព័ត៌មាន (CMS)'}
              </a>
              <span className="text-white/10 hidden md:inline">|</span>
              <span className="text-brand-gold font-extrabold tracking-widest uppercase">
                {lang === 'en' ? 'EST. 1997' : 'បង្កើតឡើង ឆ្នាំ១៩៩៧'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
