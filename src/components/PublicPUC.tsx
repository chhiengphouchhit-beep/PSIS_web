/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { PUC_COURSES } from '../mockData';
import PlacementTest from './PlacementTest';
import { Shield, Clock, Target, ArrowRight } from 'lucide-react';

function ScholarshipCalculator({ lang }: { lang: 'en' | 'kh' }) {
  const [ielts, setIelts] = useState<number>(5.5);
  const [grade, setGrade] = useState<'primary' | 'secondary' | 'high'>('high');

  // Base tuition estimations per semester
  const baseTuition = {
    primary: 380,
    secondary: 480,
    high: 580
  };

  // Scholarship rules:
  // IELTS < 5.0 -> 10%
  // 5.0 <= IELTS < 6.0 -> 20%
  // 6.0 <= IELTS < 7.0 -> 30%
  // IELTS >= 7.0 -> 40%
  let scholarshipPercent = 10;
  if (ielts >= 7.0) scholarshipPercent = 40;
  else if (ielts >= 6.0) scholarshipPercent = 30;
  else if (ielts >= 5.0) scholarshipPercent = 20;

  const currentBase = baseTuition[grade];
  const savings = (currentBase * scholarshipPercent) / 100;
  const netPayable = currentBase - savings;

  return (
    <div className="bg-[#051445] text-white rounded-3xl p-6 md:p-8 border border-brand-gold/20 shadow-2xl relative overflow-hidden text-left font-sans my-12">
      {/* Background radial highlight */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-brand-gold/10 rounded-full blur-3xl" />
      
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left column: Inputs */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <span className="bg-brand-gold text-brand-dark font-extrabold text-[8px] uppercase tracking-widest px-2.5 py-1 rounded">
              {lang === 'en' ? 'PUC Pathway Pathway Tool' : 'គណនាអាហារូបករណ៍ PUC'}
            </span>
            <h3 className="font-serif font-bold text-xl md:text-2xl text-white mt-3">
              {lang === 'en' ? 'Pathway Scholarship & Tuition Calculator' : 'គណនីគណនាអាហារូបករណ៍ និងតម្លៃសិក្សា'}
            </h3>
            <p className="text-[11px] text-slate-300 leading-relaxed font-light mt-1.5">
              {lang === 'en'
                ? "Estimate your tuition savings and guaranteed PUC scholarship tiers automatically based on your child's English level and IELTS score."
                : 'គណនាប្រាក់សន្សំ និងកម្រិតអាហារូបករណ៍សាកលវិទ្យាល័យ PUC របស់បុត្រធីតាដោយស្វ័យប្រវត្តផ្អែកលើកម្រិតភាសា ឬពិន្ទុ IELTS។'}
            </p>
          </div>

          <div className="space-y-4">
            {/* Grade Selection */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold block mb-2">
                {lang === 'en' ? 'Select School Grade Level' : 'ជ្រើសរើសកម្រិតថ្នាក់សិក្សា'}
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'primary', label: lang === 'en' ? 'Primary' : 'បឋមសិក្សា' },
                  { value: 'secondary', label: lang === 'en' ? 'Secondary' : 'អនុវិទ្យាល័យ' },
                  { value: 'high', label: lang === 'en' ? 'High School' : 'វិទ្យាល័យ' }
                ].map((g) => (
                  <button
                    key={g.value}
                    type="button"
                    onClick={() => setGrade(g.value as any)}
                    className={`py-2 px-3 rounded-lg border text-center text-xs font-bold transition-all cursor-pointer ${
                      grade === g.value
                        ? 'bg-brand-gold text-brand-dark border-brand-gold shadow'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* IELTS Slider Selection */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold block">
                  {lang === 'en' ? "Child's IELTS Level" : 'កម្រិតពិន្ទុ IELTS របស់បុត្រធីតា'}
                </span>
                <span className="text-xs font-black text-brand-gold bg-brand-gold/15 px-2 py-0.5 rounded border border-brand-gold/20 font-mono">
                  {ielts.toFixed(1)} / 9.0
                </span>
              </div>
              <input
                type="range"
                min="4.0"
                max="9.0"
                step="0.5"
                value={ielts}
                onChange={(e) => setIelts(parseFloat(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-gold focus:outline-none"
              />
              <div className="flex justify-between text-[9px] text-slate-400 font-bold px-1 mt-1.5 font-mono">
                <span>4.0</span>
                <span>5.0</span>
                <span>6.0</span>
                <span>7.0</span>
                <span>8.0</span>
                <span>9.0</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Results dashboard */}
        <div className="lg:col-span-5 bg-white/[0.03] border border-white/10 rounded-2xl p-5 md:p-6 space-y-4 relative flex flex-col justify-between">
          <div className="text-center space-y-1">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
              {lang === 'en' ? 'Estimated PUC Scholarship' : 'អាហារូបករណ៍ PUC ទទួលបាន'}
            </span>
            <div className="text-4xl md:text-5xl font-black text-brand-gold tracking-tight py-2 font-mono flex items-center justify-center">
              <span>{scholarshipPercent}%</span>
              <span className="text-xs text-white/50 font-normal uppercase tracking-wider ml-1">{lang === 'en' ? 'off' : 'បញ្ចុះ'}</span>
            </div>
            <p className="text-[10px] text-slate-300 leading-relaxed font-light">
              {lang === 'en'
                ? 'Guaranteed tuition waiver pathway to PUC Bachelors program.'
                : 'ការធានាបញ្ចុះតម្លៃសិក្សាដោយស្វ័យប្រវត្តទៅថ្នាក់បរិញ្ញាបត្រ PUC។'}
            </p>
          </div>

          <div className="border-t border-white/10 pt-4 space-y-2 text-xs font-sans">
            <div className="flex justify-between text-slate-400">
              <span>{lang === 'en' ? 'Base Semester Tuition:' : 'តម្លៃសិក្សាមូលដ្ឋានប្រចាំឆមាស៖'}</span>
              <span className="font-mono text-white font-semibold">${currentBase}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>{lang === 'en' ? 'Scholarship Savings:' : 'ប្រាក់សន្សំពីអាហារូបករណ៍៖'}</span>
              <span className="font-mono text-brand-gold font-bold">-${savings.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-350 font-bold pt-2 border-t border-white/5 text-sm">
              <span>{lang === 'en' ? 'Net Payable Tuition:' : 'តម្លៃសិក្សាដែលត្រូវបង់ពិតប្រាកដ៖'}</span>
              <span className="font-mono text-brand-gold text-base font-black">${netPayable.toFixed(2)}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              const form = document.getElementById('apply-now');
              if (form) {
                form.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="w-full py-3 bg-brand-gold hover:bg-amber-500 text-brand-dark font-extrabold uppercase tracking-wider text-[10px] rounded-xl transition shadow hover:shadow-lg text-center cursor-pointer font-nav"
          >
            {lang === 'en' ? 'Apply & Claim Scholarship' : 'ចុះឈ្មោះ និងទទួលយកអាហារូបករណ៍'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PublicPUC({ lang }: { lang: 'en' | 'kh' }) {
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-20">
          
          {/* Switcher left side - Styled like high-quality software features */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="font-nav font-bold text-[10px] uppercase text-slate-400 tracking-widest px-1">
              {lang === 'en' ? 'Select English Curriculum' : 'ជ្រើសរើសកម្មវិធីភាសា'}
            </h3>
            
            <div className="space-y-2 font-sans font-medium">
              {PUC_COURSES.map((c) => {
                const isSelected = activeCourseId === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setActiveCourseId(c.id)}
                    className={`w-full text-left p-4 rounded-xl transition duration-200 cursor-pointer text-xs font-semibold flex items-center justify-between border ${
                      isSelected
                        ? 'bg-brand-blue text-white border-brand-blue shadow-lg'
                        : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-100 shadow-sm'
                    }`}
                  >
                    <span className="font-bold tracking-wide font-nav">{c.name}</span>
                    <span className={`text-[10px] uppercase font-mono font-bold tracking-wider px-2.5 py-0.5 rounded ${
                      isSelected ? 'text-brand-dark bg-brand-gold font-bold' : 'text-slate-400 bg-slate-100'
                    }`}>
                      {c.id.toUpperCase()}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Quick British Council stamp */}
            <div className="p-5 rounded-2xl bg-[#0a1b55] text-white space-y-2 border border-blue-900/10">
              <div className="flex items-center space-x-2">
                <Shield size={14} className="text-brand-gold" />
                <span className="text-[10px] uppercase tracking-widest text-brand-gold font-extrabold font-nav">Accredited testing site</span>
              </div>
              <p className="text-[10px] text-slate-300 font-sans leading-relaxed font-light">
                Our English courses sync with the British Council exam timelines and PUC Board credentials.
              </p>
            </div>
          </div>

          {/* Details Panel right side - Clean layout */}
          <div className="lg:col-span-8 bg-white border border-slate-100 rounded-3xl shadow-xl p-8 md:p-12 space-y-8 flex flex-col justify-between min-h-[400px]">
            <div className="space-y-4">
              <span className="bg-brand-gold/15 text-[#07133C] font-sans font-medium text-[9px] uppercase px-3 py-1 rounded-full border border-brand-gold/20 tracking-wider">
                Elite English standard
              </span>
              <h3 className="font-serif font-bold text-2xl md:text-3xl text-brand-dark tracking-tight leading-tight">
                {selectedCourse.name}
              </h3>
              
              <div className="w-10 h-0.5 bg-brand-gold rounded"></div>
              
              <p className="text-xs md:text-sm text-slate-655 leading-relaxed font-sans font-light">
                {selectedCourse.desc}
              </p>
            </div>

            {/* Feature lists mapping */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-6">
              
              <div className="flex items-center space-x-4 text-xs text-slate-705 font-sans font-medium">
                <div className="w-10 h-10 rounded-xl bg-slate-50 text-brand-blue flex items-center justify-center border border-slate-100/50 shadow-sm shrink-0">
                  <Clock size={16} />
                </div>
                <div>
                  <span className="font-bold text-slate-400 uppercase text-[9px] tracking-widest block font-nav">Cycle Duration</span>
                  <span className="text-slate-805 font-bold">{selectedCourse.duration}</span>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-xs text-slate-705 font-sans font-medium">
                <div className="w-10 h-10 rounded-xl bg-slate-50 text-brand-blue flex items-center justify-center border border-slate-100/50 shadow-sm shrink-0">
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
                className="bg-brand-gold hover:bg-amber-500 text-brand-dark text-xs uppercase tracking-wider font-nav font-bold px-7 py-[15px] rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer w-full sm:w-auto text-center flex items-center justify-center gap-1.5"
              >
                <span>{lang === 'en' ? 'Register for this course' : 'ចុះឈ្មោះរៀនវគ្គសិក្សានេះ'}</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

        </div>

        {/* Dynamic Scholarship Calculator widget */}
        <ScholarshipCalculator lang={lang} />

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
