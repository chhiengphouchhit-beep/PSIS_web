/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { PUC_COURSES } from '../mockData';
import PlacementTest from './PlacementTest';
import { Shield, Clock, Target, ArrowRight } from 'lucide-react';

interface PublicPUCProps {
  lang: 'en' | 'kh';
}

export default function PublicPUC({ lang }: PublicPUCProps) {
  const [activeCourseId, setActiveCourseId] = useState<string>('gep');

  const selectedCourse = PUC_COURSES.find(c => c.id === activeCourseId) || PUC_COURSES[0];

  return (
    <section id="puc-ifl" className="py-28 bg-[#f8fafc] border-y border-slate-100 scroll-mt-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <span className="inline-block bg-brand-gold/15 text-brand-dark font-sans font-medium text-[10px] tracking-widest uppercase px-3.5 py-1.5 rounded-full border border-brand-gold/25">
            {lang === 'en' ? 'Renowned English Partner' : 'ដៃគូភាសាបរទេសដ៏ល្បីល្បាញ'}
          </span>
          <h2 className="font-serif font-bold text-3xl md:text-[45px] text-brand-dark tracking-tight leading-tight">
            PUC Institute of Foreign Languages (IFL)
          </h2>
          <div className="w-16 h-0.5 bg-brand-blue mx-auto rounded"></div>
          <p className="text-xs md:text-sm text-slate-500 font-sans leading-relaxed">
            {lang === 'en'
              ? 'Our premier English training courses deliver linguistic elegance, certified IELTS/TOEFL preparation tracks, and interactive kids/teens timetables for global university pathways.'
              : 'កម្មវិធីបណ្តុះបណ្តាលភាសាបរទេសដ៏ល្បីល្បាញរបស់សាលាផ្តល់ជូននូវភាពស្ទាត់ជំនាញភាសាអង់គ្លេស ការរៀបចំប្រឡង TOEFL/IELTS និងការសិក្សាក្រៅម៉ោងសម្រាប់សិស្សានុសិស្ស។'}
          </p>
        </div>

        {/* Course Selection Landing Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start mb-12 sm:mb-16 md:mb-20">
          
          {/* Switcher left side - Styled like high-quality software features */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="font-nav font-bold text-[10px] uppercase text-slate-400 tracking-widest px-1">
              {lang === 'en' ? 'Select English Curriculum' : 'ជ្រើសរើសកម្មវិធីភាសា'}
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-2 font-sans font-medium">
              {PUC_COURSES.map((c) => {
                const isSelected = activeCourseId === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setActiveCourseId(c.id)}
                    className={`w-full text-left p-3 sm:p-4 rounded-xl transition duration-200 cursor-pointer text-xs font-semibold flex items-center justify-between border ${
                      isSelected
                        ? 'bg-brand-blue text-white border-brand-blue shadow-lg'
                        : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-100 shadow-sm'
                    }`}
                  >
                    <span className="font-bold tracking-wide font-nav text-[11px] sm:text-xs">{c.name}</span>
                    <span className={`text-[9px] sm:text-[10px] uppercase font-mono font-bold tracking-wider px-2 sm:px-2.5 py-0.5 rounded shrink-0 ml-2 ${
                      isSelected ? 'text-brand-dark bg-brand-gold font-bold' : 'text-slate-400 bg-slate-100'
                    }`}>
                      {c.id.toUpperCase()}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Quick British Council stamp */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#0a1b55] text-white space-y-2 border border-blue-900/10">
              <div className="flex items-center space-x-2">
                <Shield size={14} className="text-brand-gold shrink-0" />
                <span className="text-[10px] uppercase tracking-widest text-brand-gold font-extrabold font-nav">Accredited testing site</span>
              </div>
              <p className="text-[10px] text-slate-300 font-sans leading-relaxed font-light">
                Our English courses sync with the British Council exam timelines and PUC Board credentials.
              </p>
            </div>
          </div>

          {/* Details Panel right side - Clean layout */}
          <div className="lg:col-span-8 bg-white border border-slate-100 rounded-2xl sm:rounded-3xl shadow-xl p-5 sm:p-8 md:p-12 space-y-6 sm:space-y-8 flex flex-col justify-between min-h-[380px]">
            <div className="space-y-3 sm:space-y-4">
              <span className="bg-brand-gold/15 text-[#07133C] font-sans font-medium text-[9px] uppercase px-3 py-1 rounded-full border border-brand-gold/20 tracking-wider inline-block">
                Elite English standard
              </span>
              <h3 className="font-serif font-bold text-xl sm:text-2xl md:text-3xl text-brand-dark tracking-tight leading-tight">
                {selectedCourse.name}
              </h3>
              
              <div className="w-10 h-0.5 bg-brand-gold rounded"></div>
              
              <p className="text-xs sm:text-sm text-slate-655 leading-relaxed font-sans font-light">
                {selectedCourse.desc}
              </p>
            </div>

            {/* Feature lists mapping */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 pt-5 sm:pt-6">
              
              <div className="flex items-center space-x-3 sm:space-x-4 text-xs text-slate-705 font-sans font-medium">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-50 text-brand-blue flex items-center justify-center border border-slate-100/50 shadow-sm shrink-0">
                  <Clock size={16} />
                </div>
                <div>
                  <span className="font-bold text-slate-400 uppercase text-[9px] tracking-widest block font-nav">Cycle Duration</span>
                  <span className="text-slate-805 font-bold">{selectedCourse.duration}</span>
                </div>
              </div>

              <div className="flex items-center space-x-3 sm:space-x-4 text-xs text-slate-705 font-sans font-medium">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-50 text-brand-blue flex items-center justify-center border border-slate-100/50 shadow-sm shrink-0">
                  <Target size={16} />
                </div>
                <div>
                  <span className="font-bold text-slate-400 uppercase text-[9px] tracking-widest block font-nav font-bold">Pupil target span</span>
                  <span className="text-slate-805 font-bold">{selectedCourse.age}</span>
                </div>
              </div>

            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                onClick={() => {
                  const form = document.getElementById('apply-now');
                  if (form) {
                    form.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="bg-brand-gold hover:bg-amber-500 text-brand-dark text-xs uppercase tracking-wider font-nav font-bold px-6 sm:px-7 py-3.5 sm:py-[15px] rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer w-full sm:w-auto text-center flex items-center justify-center gap-1.5"
              >
                <span>{lang === 'en' ? 'Register for this course' : 'ចុះឈ្មោះរៀនវគ្គសិក្សានេះ'}</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

        </div>

        {/* Embedded simulated interactive check */}
        <div className="pt-16 border-t border-slate-200">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
            <h4 className="font-serif font-bold text-xl md:text-2xl text-brand-dark tracking-tight leading-tight">
              {lang === 'en' ? 'Evaluate student current language tier' : 'តើអ្នកស្គាល់កម្រិតភាសាអង់គ្លេសរបស់អ្នកដែរឬទេ?'}
            </h4>
            <div className="w-10 h-0.5 bg-brand-gold mx-auto"></div>
            <p className="text-xs text-slate-500 font-sans leading-relaxed font-light">
              {lang === 'en'
                ? 'Check academic placement requirements instantly! Provide preliminary matches using our 5-question logic assessment widget below.'
                : 'សន្សំពេលវេលា!  ធ្វើតេស្តសាកល្បងវេយ្យាករណ៍ និងរចនាសម្ព័ន្ធប្រយោគបឋមខាងក្រោមដើម្បីណែនាំវគ្គសិក្សាសមស្រប។'}
            </p>
          </div>

          <PlacementTest lang={lang} />
        </div>

      </div>
    </section>
  );
}
