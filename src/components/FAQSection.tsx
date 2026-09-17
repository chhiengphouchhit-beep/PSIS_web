/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, ChevronDown, Search, Sparkles } from 'lucide-react';

interface FAQItem {
  id: string;
  category: 'admission' | 'scholarship' | 'transport' | 'life';
  questionEn: string;
  questionKh: string;
  answerEn: string;
  answerKh: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'admission',
    questionEn: 'What is the admission procedure for new students at PSIS?',
    questionKh: 'តើការចុះឈ្មោះចូលរៀនថ្មីនៅ PSIS មាននីតិវិធីយ៉ាងដូចម្តេច?',
    answerEn: 'Parents can fill out our online inquiry form or visit any of our 6 campuses in person. Prospective students undergo a friendly placement assessment in English and Mathematics to ensure optimal grade level matching. Our admission officers provide complete counseling regarding curriculum and timetables.',
    answerKh: 'អាណាព្យាបាលអាចបំពេញទម្រង់ចុះឈ្មោះតាមអនឡាញ ឬអញ្ជើញមកកាន់សាខាណាមួយក្នុងចំណោមសាខាទាំង ៦ ដោយផ្ទាល់។ សិស្សថ្មីនឹងត្រូវធ្វើតេស្តវាស់កម្រិតចំណេះដឹង (Placement Test) ផ្នែកភាសាអង់គ្លេស និងគណិតវិទ្យា ដើម្បីធានាការរៀបចំចូលរៀនក្នុងកម្រិតថ្នាក់ត្រឹមត្រូវបំផុត។'
  },
  {
    id: 'faq-2',
    category: 'scholarship',
    questionEn: 'How does the PUC University Pathway scholarship work?',
    questionKh: 'តើអាហារូបករណ៍គន្លងផ្លូវឆ្ពោះទៅសាកលវិទ្យាល័យបញ្ញាសាស្ត្រ (PUC) ដំណើរការយ៉ាងដូចម្តេច?',
    answerEn: 'All PSIS high school graduates automatically qualify for our direct university pathway into Paññāsāstra University of Cambodia (PUC). Depending on academic achievements and official IELTS results, students receive exclusive tuition scholarship grants ranging from 10% to 40% across all PUC faculties.',
    answerKh: 'សិស្សដែលបញ្ចប់ការសិក្សាថ្នាក់វិទ្យាល័យពី PSIS ទាំងអស់ទទួលបានសិទ្ធិដោយស្វ័យប្រវត្តិក្នុងការបន្តការសិក្សាថ្នាក់បរិញ្ញាបត្រនៅសាកលវិទ្យាល័យបញ្ញាសាស្ត្រកម្ពុជា (PUC)។ ផ្អែកលើលទ្ធផលសិក្សា និងពិន្ទុ IELTS សិស្សានុសិស្សនឹងទទួលបានអាហារូបករណ៍បញ្ចុះតម្លៃពី ១០% ដល់ ៤០% លើគ្រប់មហាវិទ្យាល័យទាំងអស់របស់ PUC។'
  },
  {
    id: 'faq-3',
    category: 'transport',
    questionEn: 'Does PSIS provide school bus transportation services?',
    questionKh: 'តើសាលា PSIS មានសេវារថយន្តដឹកជញ្ជូនសិស្សដែរឬទេ?',
    answerEn: 'Yes, PSIS operates safe, air-conditioned school bus routes connecting residential districts across Phnom Penh, Kandal (NR3), and Battambang. Every bus is monitored by a dedicated child chaperone, equipped with first aid kits, speed limiters, and seatbelts for each passenger.',
    answerKh: 'បាទ/ចាស សាលា PSIS មានសេវារថយន្តក្រុងទំនើប បំពាក់ម៉ាស៊ីនត្រជាក់ និងខ្សែក្រវាត់សុវត្ថិភាព ដឹកជញ្ជូនសិស្សានុសិស្សតាមតំបន់នានាក្នុងរាជធានីភ្នំពេញ កណ្តាល (ផ្លូវជាតិលេខ ៣) និងខេត្តបាត់ដំបង។ រាល់រថយន្តនីមួយៗមានអ្នកថែទាំកុមារប្រចាំការយ៉ាងយកចិត្តទុកដាក់ខ្ពស់បំផុត។'
  },
  {
    id: 'faq-4',
    category: 'admission',
    questionEn: 'What is the curriculum difference between Bilingual and International tracks?',
    questionKh: 'តើកម្មវិធីសិក្សាទ្វិភាសា និងកម្មវិធីអន្តរជាតិ មានភាពខុសគ្នាយ៉ាងដូចម្តេច?',
    answerEn: 'The Bilingual track perfectly integrates the Cambodian National Curriculum with advanced Cambridge English and Singapore Math. The International track focuses on full-immersion English instruction with Singapore STEM and Cambridge primary/secondary equivalents, preparing students seamlessly for foreign university admissions.',
    answerKh: 'កម្មវិធីទ្វិភាសា បញ្ចូលគ្នាយ៉ាងសុខដុមរវាងកម្មវិធីចំណេះទូទៅខ្មែរ របស់ក្រសួងអប់រំ និងស្តង់ដារអន្តរជាតិ Cambridge English & Singapore Math។ ចំណែកកម្មវិធីអន្តរជាតិ សង្កត់ធ្ងន់លើការបង្រៀនជាភាសាអង់គ្លេសពេញលេញ ជាមួយបច្ចេកវិទ្យា STEM សឹង្ហបុរី ដើម្បីត្រៀមលក្ខណៈបន្តការសិក្សានៅក្រៅប្រទេស។'
  },
  {
    id: 'faq-5',
    category: 'life',
    questionEn: 'What safety, dining, and extracurricular facilities are available?',
    questionKh: 'តើសាលាមានសុវត្ថិភាព អាហារដ្ឋាន និងសកម្មភាពក្រៅម៉ោងយ៉ាងដូចម្តេច?',
    answerEn: 'Every campus features 24/7 security, certified biometric access, pediatric health checkups, and hygienic canteens serving nutritious, freshly prepared Asian and Western meals. Extracurriculars include Smart World Robotics, drone programming, Taekwondo, traditional arts, and competitive debate.',
    answerKh: 'គ្រប់សាខាទាំងអស់មានសន្តិសុខយាមកាម ២៤/៧ ប្រព័ន្ធសុវត្ថិភាពទំនើប បន្ទប់សុខភាពបឋម និងអាហារដ្ឋានអនាម័យខ្ពស់ដែលចម្អិនស្រស់ៗជារៀងរាល់ថ្ងៃ។ សកម្មភាពក្រៅម៉ោងសិក្សាមានដូចជា៖ ក្លឹបរ៉ូបូត និងកូដឌីង ដ្រូន កីឡាតេក្វាន់ដូ សិល្បៈវប្បធម៌ និងការប្រកួតជជែកដេញដោល។'
  },
  {
    id: 'faq-6',
    category: 'scholarship',
    questionEn: 'Are there sibling discounts or term payment options?',
    questionKh: 'តើសាលាមានការបញ្ចុះតម្លៃសម្រាប់បងប្អូន និងការបង់ប្រាក់រំលស់ដែរឬទេ?',
    answerEn: 'Yes! Families enrolling two or more siblings receive a 5% to 10% discount on tuition fees. We also offer flexible payment schemes: annual upfront (with maximum fee savings), semi-annual installments, or quarterly term payments to suit family budgets.',
    answerKh: 'បាទ/ចាស! ក្រុមគ្រួសារដែលមានកូនរៀនចាប់ពី ២ នាក់ឡើងទៅ នឹងទទួលបានការបញ្ចុះតម្លៃពិសេសពី ៥% ទៅ ១០%។ សាលាក៏ផ្តល់ជម្រើសបង់ថ្លៃសិក្សាជាប្រចាំឆ្នាំ (ទទួលបានការបញ្ចុះតម្លៃខ្ពស់បំផុត) បង់ជាឆមាស ឬបង់ជាត្រីមាសផងដែរ។'
  }
];

export default function FAQSection({ lang }: { lang: 'en' | 'kh' }) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');

  const categories = [
    { id: 'all', en: 'All Questions', kh: 'សំណួរទាំងអស់' },
    { id: 'admission', en: 'Admissions & Tuition', kh: 'ការចុះឈ្មោះ និងតម្លៃ' },
    { id: 'scholarship', en: 'PUC Scholarships', kh: 'អាហារូបករណ៍ PUC' },
    { id: 'transport', en: 'School Bus & Safety', kh: 'រថយន្តសាលា និងសុវត្ថិភាព' },
    { id: 'life', en: 'Campus Life & Meals', kh: 'ជីវិតសាលា និងអាហារដ្ឋាន' }
  ];

  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter((faq) => {
      const matchCat = activeCategory === 'all' || faq.category === activeCategory;
      const query = searchQuery.trim().toLowerCase();
      if (!query) return matchCat;
      const matchText =
        faq.questionEn.toLowerCase().includes(query) ||
        faq.questionKh.toLowerCase().includes(query) ||
        faq.answerEn.toLowerCase().includes(query) ||
        faq.answerKh.toLowerCase().includes(query);
      return matchCat && matchText;
    });
  }, [activeCategory, searchQuery]);

  return (
    <section id="faq" className="py-20 sm:py-28 bg-white border-t border-slate-100 scroll-mt-12 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 space-y-3">
          <span className="inline-flex items-center gap-1.5 bg-brand-gold/15 text-brand-dark font-sans font-bold text-[10px] tracking-widest uppercase px-3.5 py-1.5 rounded-full border border-brand-gold/30">
            <HelpCircle size={12} className="text-brand-gold" />
            {lang === 'en' ? 'Frequently Asked Questions' : 'សំណួរដែលសួរញឹកញាប់'}
          </span>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl md:text-4xl text-brand-dark tracking-tight">
            {lang === 'en' ? 'Everything Parents Need to Know' : 'អ្វីៗគ្រប់យ៉ាងដែលអាណាព្យាបាលចង់ដឹង'}
          </h2>
          <div className="w-16 h-0.5 bg-brand-blue mx-auto rounded"></div>
          <p className="text-xs sm:text-sm text-slate-500 font-sans leading-relaxed">
            {lang === 'en'
              ? 'Find answers regarding admissions, PUC scholarships, bus routes, meals, and Cambridge curriculum.'
              : 'ស្វែងយល់បន្ថែមអំពីការចុះឈ្មោះ អាហារូបករណ៍សាកលវិទ្យាល័យ PUC រថយន្តដឹកសិស្ស និងកម្មវិធីសិក្សា Cambridge។'}
          </p>
        </div>

        {/* Search Bar & Category Pills */}
        <div className="space-y-4 mb-10">
          <div className="relative max-w-md mx-auto">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'en' ? 'Search questions (e.g. scholarship, bus, tuition)...' : 'ស្វែងរកសំណួរ (ឧទាហរណ៍៖ អាហារូបករណ៍, តម្លៃ, រថយន្ត)...'}
              className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-blue focus:bg-white transition"
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
            {categories.map((cat) => {
              const isSelected = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#071B5C] text-white shadow-md scale-102 ring-1 ring-brand-gold'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {lang === 'en' ? cat.en : cat.kh}
                </button>
              );
            })}
          </div>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div
                key={faq.id}
                className={`border rounded-2xl transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-slate-50/80 border-brand-blue/30 shadow-md'
                    : 'bg-white hover:bg-slate-50 border-slate-200/80 shadow-sm'
                }`}
              >
                <button
                  onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${isOpen ? 'bg-brand-gold' : 'bg-slate-300'}`}></span>
                    <h4 className="font-nav font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                      {lang === 'en' ? faq.questionEn : faq.questionKh}
                    </h4>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-slate-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-brand-blue' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-5 sm:px-5 sm:pb-6 text-xs sm:text-sm text-slate-600 font-sans leading-relaxed border-t border-slate-200/60 pt-3 pl-8 sm:pl-9">
                        <p>{lang === 'en' ? faq.answerEn : faq.answerKh}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          {filteredFaqs.length === 0 && (
            <div className="text-center py-12 text-slate-400 text-xs">
              {lang === 'en' ? 'No questions match your search.' : 'មិនមានសំណួរត្រូវគ្នានឹងការស្វែងរករបស់អ្នកឡើយ។'}
            </div>
          )}
        </div>

        {/* Quick Contact Footer CTA */}
        <div className="mt-10 p-5 rounded-2xl bg-gradient-to-r from-[#07133C] to-[#0A1E66] text-white flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <div>
            <h4 className="font-serif font-bold text-sm sm:text-base text-brand-gold">
              {lang === 'en' ? 'Have a specific question not answered here?' : 'មានសំណួរពិសេសដែលមិនមាននៅក្នុងនេះមែនទេ?'}
            </h4>
            <p className="text-[11px] text-slate-300 font-sans mt-0.5">
              {lang === 'en' ? 'Speak directly with our friendly admissions staff.' : 'សូមទាក់ទងមកកាន់ការិយាល័យចុះឈ្មោះ ដើម្បីទទួលបានការប្រឹក្សាផ្ទាល់។'}
            </p>
          </div>
          <a
            href="tel:+85523884991"
            className="px-5 py-2.5 rounded-xl bg-brand-gold hover:bg-amber-400 text-brand-dark text-xs font-bold font-nav uppercase tracking-wider shrink-0 transition active:scale-95"
          >
            {lang === 'en' ? 'Call Admissions' : 'ទាក់ទងការិយាល័យ'}
          </a>
        </div>

      </div>
    </section>
  );
}
