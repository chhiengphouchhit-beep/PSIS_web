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
      {/* Main Jitter-style Navigation - Clean and minimal */}
      <nav className={`transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-xl py-2 border-b border-gray-200 shadow-sm' 
          : 'bg-white py-4 border-b border-gray-100'
      } text-gray-900 px-4 md:px-8`}>
        
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
          
          {/* Brand Identity / Logo */}
          <div 
            onClick={() => handleNavClick('home')} 
            className="flex items-center cursor-pointer shrink-0 space-x-3"
          >
            <img
              src={logoUrl || logoImage}
              alt="Paññāsāstra International School logo"
              className="h-10 w-10 md:h-12 md:w-12 object-contain"
              referrerPolicy="no-referrer"
              onError={(event) => {
                event.currentTarget.src = logoImage;
              }}
            />
            <div className="hidden md:flex">
              <span className="text-sm md:text-base font-bold text-gray-900 tracking-tight">{text[lang].schoolName}</span>
            </div>
          </div>

          {/* Desktop Nav Items - Jitter-style */}
          <div className="hidden lg:flex items-center justify-center gap-1 flex-1">
            {navItems.map((item, index) => {
              const isActive = currentSection === item.id;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className={`relative text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'text-purple-600 bg-purple-50' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  {item.label}
                </motion.button>
              );
            })}
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setLang(lang === 'en' ? 'kh' : 'en')}
              className="text-xs font-semibold px-3 py-1.5 rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200 transition-all"
            >
              {lang === 'en' ? 'ខ' : 'EN'}
            </motion.button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-gray-900 hover:text-purple-600 transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-white border-b border-gray-200 space-y-1 px-4 py-3"
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`block w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentSection === item.id
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
