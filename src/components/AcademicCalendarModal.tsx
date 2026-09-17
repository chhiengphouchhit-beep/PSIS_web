/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Download, X, Clock, CheckCircle2, FileText, ChevronRight } from 'lucide-react';

interface AcademicCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'en' | 'kh';
}

export default function AcademicCalendarModal({ isOpen, onClose, lang }: AcademicCalendarModalProps) {
  const [activeTab, setActiveTab] = useState<'sem1' | 'sem2'>('sem1');

  const semester1Events = [
    { date: 'August 17, 2026', titleEn: 'Academic Year 2026-2027 Opening Day', titleKh: 'ថ្ងៃបើកបវេសនកាលឆ្នាំសិក្សា ២០២៦ - ២០២៧', tag: 'Semester 1' },
    { date: 'October 8 - 12, 2026', titleEn: 'Pchum Ben Festival Holidays', titleKh: 'ពិធីបុណ្យភ្ជុំបិណ្ឌ (ឈប់សម្រាក)', tag: 'Holiday' },
    { date: 'November 2 - 6, 2026', titleEn: 'Mid-Term Examinations & Progress Reports', titleKh: 'ការប្រឡងឆមាសទី១ លើកទី១ & របាយការណ៍សិក្សា', tag: 'Exam' },
    { date: 'November 23 - 25, 2026', titleEn: 'Water Festival Celebrations', titleKh: 'ព្រះរាជពិធីបុណ្យអុំទូក (ឈប់សម្រាក)', tag: 'Holiday' },
    { date: 'January 11 - 15, 2027', titleEn: 'Semester 1 Final Examinations', titleKh: 'ការប្រឡងបញ្ចប់ឆមាសទី១', tag: 'Exam' },
    { date: 'January 18 - 22, 2027', titleEn: 'Mid-Year Term Break', titleKh: 'ការឈប់សម្រាកពាក់កណ្តាលឆ្នាំ', tag: 'Break' }
  ];

  const semester2Events = [
    { date: 'January 25, 2027', titleEn: 'Semester 2 Commences', titleKh: 'ចាប់ផ្តើមឆមាសទី២', tag: 'Semester 2' },
    { date: 'February 15 - 17, 2027', titleEn: 'Lunar New Year Cultural Festival', titleKh: 'ពិធីបុណ្យចូលឆ្នាំប្រពៃណីចិន (សកម្មភាពវប្បធម៌)', tag: 'Culture' },
    { date: 'April 12 - 19, 2027', titleEn: 'Khmer Traditional New Year Holiday', titleKh: 'ពិធីបុណ្យចូលឆ្នាំថ្មីប្រពៃណីជាតិខ្មែរ (ឈប់សម្រាក)', tag: 'Holiday' },
    { date: 'May 10 - 14, 2027', titleEn: 'Cambridge Checkpoint & Mock IELTS Exams', titleKh: 'ការប្រឡង Cambridge Checkpoint & IELTS សាកល្បង', tag: 'Exam' },
    { date: 'June 14 - 18, 2027', titleEn: 'Annual Final Examinations', titleKh: 'ការប្រឡងបញ្ចប់ឆ្នាំសិក្សា', tag: 'Exam' },
    { date: 'July 2, 2027', titleEn: 'Grand Commencement & Graduation Ceremony', titleKh: 'ពិធីចែកសញ្ញាបត្រ និងបញ្ចប់ការសិក្សាផ្លូវការ', tag: 'Graduation' }
  ];

  const handleDownloadBrochure = () => {
    // Generate brochure download simulation or print
    window.print();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-md"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-10 my-8 max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="bg-[#07133C] text-white p-5 sm:p-6 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-gold/15 flex items-center justify-center text-brand-gold border border-brand-gold/20">
                  <Calendar size={18} />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base sm:text-lg text-white">
                    {lang === 'en' ? 'Academic Calendar 2026 - 2027' : 'កាលវិភាគឆ្នាំសិក្សា ២០២៦ - ២០២៧'}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-slate-300 font-sans">
                    {lang === 'en' ? 'Paññāsāstra International School' : 'សាលាអន្តរជាតិ បញ្ញាសាស្ត្រ'}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Sub-bar Tabs */}
            <div className="flex items-center justify-between p-3 sm:p-4 bg-slate-50 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-1.5 bg-slate-200/70 p-1 rounded-xl">
                <button
                  onClick={() => setActiveTab('sem1')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    activeTab === 'sem1'
                      ? 'bg-white text-brand-blue shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {lang === 'en' ? 'Semester 1 (Aug - Jan)' : 'ឆមាសទី ១ (សីហា - មករា)'}
                </button>
                <button
                  onClick={() => setActiveTab('sem2')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    activeTab === 'sem2'
                      ? 'bg-white text-brand-blue shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {lang === 'en' ? 'Semester 2 (Jan - Jul)' : 'ឆមាសទី ២ (មករា - កក្កដា)'}
                </button>
              </div>

              <button
                onClick={handleDownloadBrochure}
                className="hidden sm:flex items-center gap-1.5 text-xs text-brand-blue font-bold px-3 py-1.5 rounded-xl bg-brand-blue/5 hover:bg-brand-blue/10 border border-brand-blue/10 transition cursor-pointer"
              >
                <Download size={13} />
                <span>{lang === 'en' ? 'Print / PDF' : 'ទាញយក PDF'}</span>
              </button>
            </div>

            {/* Events List (Scrollable) */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-3 flex-1">
              {(activeTab === 'sem1' ? semester1Events : semester2Events).map((ev, idx) => (
                <div
                  key={idx}
                  className="p-3.5 sm:p-4 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition flex items-start justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-brand-gold shrink-0 mt-2"></div>
                    <div>
                      <h4 className="font-nav font-bold text-xs sm:text-sm text-slate-800">
                        {lang === 'en' ? ev.titleEn : ev.titleKh}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-sans mt-0.5 flex items-center gap-1">
                        <Clock size={11} className="text-slate-400" />
                        <span>{ev.date}</span>
                      </p>
                    </div>
                  </div>

                  <span className={`text-[9px] uppercase font-mono font-bold px-2 py-0.5 rounded shrink-0 ${
                    ev.tag === 'Exam' ? 'bg-amber-100 text-amber-800' :
                    ev.tag === 'Holiday' ? 'bg-rose-100 text-rose-800' :
                    ev.tag === 'Graduation' ? 'bg-brand-gold text-brand-dark' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {ev.tag}
                  </span>
                </div>
              ))}
            </div>

            {/* Footer with Brochure CTA */}
            <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <FileText size={15} className="text-brand-gold shrink-0" />
                <span className="text-[11px] sm:text-xs">
                  {lang === 'en' ? 'Official PSIS Prospectus & Curriculum Guide' : 'សៀវភៅណែនាំសាលា និងកម្មវិធីសិក្សាផ្លូវការ'}
                </span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleDownloadBrochure}
                  className="flex-1 sm:flex-initial py-2.5 px-4 rounded-xl bg-brand-gold hover:bg-amber-400 text-brand-dark font-nav font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Download size={13} />
                  <span>{lang === 'en' ? 'Download Prospectus' : 'ទាញយកសៀវភៅណែនាំ'}</span>
                </button>
                <button
                  onClick={onClose}
                  className="py-2.5 px-4 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition cursor-pointer"
                >
                  {lang === 'en' ? 'Close' : 'បិទ'}
                </button>
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
