/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Globe, Phone, Mail } from 'lucide-react';
import logoImage from '../../img/ong.png';

interface HeaderProps {
  lang: 'en' | 'kh';
  setLang: (lang: 'en' | 'kh') => void;
  currentSection: string;
  setCurrentSection: (sec: string) => void;
  logoUrl?: string;
}

export default function Header({
  lang,
  setLang,
  currentSection,
  setCurrentSection,
  logoUrl
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Detect scroll position to transform the header design
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Localization resources
  const text = {
    en: {
      schoolName: 'Paññāsāstra International School',
      publicSite: 'Public Website',
      phone: '+855 23 884 991',
      navHome: 'Home',
      navCampuses: 'Campuses',
      navAcademics: 'Academics',
      navPUC: 'PUC-IFL English',
      navDigital: 'Digital Suite',
      navSTEM: 'STEM & Robotics',
      navCareers: 'Careers',
      navApply: 'Apply Now'
    },
    kh: {
      schoolName: 'សាលាអន្តរជាតិ បញ្ញាសាស្ត្រ',
      publicSite: 'ត្រឡប់ទៅកាន់គេហទំព័រដើម',
      phone: '+៨៥៥ ២៣ ៨៨៤ ៩៩១',
      navHome: 'ទំព័រដើម',
      navCampuses: 'សាខាសាលា',
      navAcademics: 'កម្មវិធីសិក្សា',
      navPUC: 'ភាសាបរទេស PUC',
      navDigital: 'ប្រព័ន្ធឌីជីថល',
      navSTEM: 'បច្ចេកវិទ្យា STEM',
      navCareers: 'ឱកាសការងារ',
      navApply: 'ចុះឈ្មោះឥឡូវនេះ'
    }
  };

  const navItems = [
    { id: 'home', label: text[lang].navHome },
    { id: 'campuses', label: text[lang].navCampuses },
    { id: 'academics', label: text[lang].navAcademics },
    { id: 'puc-ifl', label: text[lang].navPUC },
    { id: 'digital', label: text[lang].navDigital },
    { id: 'stem', label: text[lang].navSTEM },
    { id: 'careers', label: text[lang].navCareers }
  ];

  const handleNavClick = (id: string) => {
    setCurrentSection(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header id="global_header" className="sticky top-0 z-50 w-full transition-all duration-300">
      {/* Top Utility Ribbon - Clean, compact, high-contrast HUD */}
      {!scrolled && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#07133C] text-slate-300 text-[11px] py-2 px-4 md:px-8 flex justify-between items-center border-b border-white/5"
        >
          <div className="flex items-center space-x-5">
            <span className="flex items-center hover:text-white transition-colors cursor-pointer font-sans">
              <Phone size={11} className="mr-1.5 text-brand-gold" />
              {text[lang].phone}
            </span>
            <span className="hidden md:flex items-center hover:text-white transition-colors cursor-pointer font-sans">
              <Mail size={11} className="mr-1.5 text-brand-gold" />
              admission@psis.edu.kh
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'en' ? 'kh' : 'en')}
              className="flex items-center space-x-1 hover:text-white text-slate-300 transition duration-150 py-0.5 px-2.5 rounded bg-white/5 border border-white/10 cursor-pointer font-sans font-medium"
            >
              <Globe size={11} className="text-brand-gold" />
              <span>{lang === 'en' ? 'កម្ពុជា (Khmer)' : 'English (EN)'}</span>
            </button>
            
            {/* Active System Indicator */}
            <span className="flex items-center text-emerald-400 font-semibold gap-1 px-2 py-0.5 rounded bg-emerald-500/10 text-[9px] tracking-wider uppercase font-sans">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              {lang === 'en' ? 'Official Portal' : 'គេហទំព័រផ្លូវការ'}
            </span>
          </div>
        </motion.div>
      )}

      {/* Main Glassmorphic Navigation with Apple-style backdrop filter */}
      <nav className={`transition-all duration-300 ${
        scrolled 
          ? 'bg-[#071B5C]/90 backdrop-blur-xl py-3 border-b border-white/10 shadow-lg' 
          : 'bg-[#071B5C] py-4 border-b border-white/5 shadow-md'
      } text-white px-4 md:px-8`}>
        
        <div className="max-w-7xl mx-auto flex min-h-[72px] items-center justify-between gap-8 md:min-h-[96px] lg:gap-16 xl:gap-24">
          
          {/* Brand Identity / Logo Unit */}
          <div 
            onClick={() => handleNavClick('home')} 
            className="flex items-center cursor-pointer shrink-0 space-x-4 md:space-x-6"
          >
            <img
              src={logoUrl || logoImage}
              alt="Paññāsāstra International School logo"
              className="h-14 w-14 sm:h-18 sm:w-18 md:h-24 md:w-24 object-contain"
              referrerPolicy="no-referrer"
              onError={(event) => {
                event.currentTarget.src = logoImage;
              }}
            />
            <div className="hidden md:flex items-center whitespace-nowrap">
              <span className="text-[15px] md:text-[17px] font-semibold leading-tight text-[#E8EEFF] tracking-wide">{text[lang].schoolName}</span>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex flex-1 items-center justify-end gap-2 xl:gap-3">
            {navItems.map((item) => {
              const isActive = currentSection === item.id;
              return (
                 <button
                   key={item.id}
                   onClick={() => handleNavClick(item.id)}
                   className={`relative group text-[10px] md:text-[12px] lg:text-[13px] uppercase font-nav font-semibold tracking-wider px-2.5 xl:px-3 py-2 rounded-lg transition-all duration-150 cursor-pointer whitespace-nowrap ${isActive ? 'text-brand-gold' : 'text-[#E8EEFF]'}`}
                >
                  <span className="relative z-10 group-hover:text-brand-gold">
                    {item.label}
                  </span>
                  {!isActive && (
                    <span className="absolute left-1/2 -bottom-1 w-0 group-hover:w-8 h-[2px] bg-brand-gold rounded transition-all duration-200 origin-center"></span>
                  )}
                  {isActive && (
                    <motion.span 
                      layoutId="activeSubNav"
                      className="absolute inset-0 bg-brand-gold/10 border border-brand-gold/30 rounded-lg"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Control buttons moved to footer per design */}

          {/* Toggle Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-slate-100 hover:text-white focus:outline-none p-1.5 cursor-pointer rounded-lg bg-white/5 border border-white/10"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Mobile Navigation Drawer with Beautiful Reveal */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden mt-3 pt-3 border-t border-white/10 space-y-1.5 overflow-hidden"
            >
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`block w-full text-left px-3 py-2 text-[13px] sm:text-[14px] uppercase tracking-wider rounded-lg font-nav font-bold transition-all ${
                    currentSection === item.id
                      ? 'bg-brand-gold text-brand-dark'
                      : 'text-[#E8EEFF] hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <div className="pt-2 border-t border-white/10 flex flex-col space-y-2 px-1">
                {/* Buttons moved to footer */}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
