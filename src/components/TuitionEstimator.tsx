/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { Calculator, CheckCircle2, Award, Sparkles, ArrowRight, ShieldCheck, DollarSign } from 'lucide-react';

interface TuitionEstimatorProps {
  lang: 'en' | 'kh';
  onApplyPlan?: (planSummary: string) => void;
}

export default function TuitionEstimator({ lang, onApplyPlan }: TuitionEstimatorProps) {
  const [selectedCampus, setSelectedCampus] = useState<'tk' | 'ttp' | 'cap' | 'rsk' | 'nr3' | 'kpt'>('tk');
  const [selectedLevel, setSelectedLevel] = useState<'preschool' | 'primary' | 'secondary' | 'highschool'>('primary');
  const [selectedTrack, setSelectedTrack] = useState<'bilingual' | 'international'>('bilingual');
  const [paymentTerm, setPaymentTerm] = useState<'annual' | 'semi' | 'term'>('annual');

  // Baseline tuition fee matrix (standardized realistic estimates for PSIS)
  const baseFees = {
    preschool: { bilingual: 1850, international: 2450 },
    primary: { bilingual: 2250, international: 2950 },
    secondary: { bilingual: 2650, international: 3450 },
    highschool: { bilingual: 3100, international: 3950 }
  };

  // Campus adjustment multiplier (regional affordability discount for NR3 & KPT)
  const campusMultipliers = {
    tk: 1.0,
    ttp: 1.0,
    cap: 0.95,
    rsk: 0.95,
    nr3: 0.88,
    kpt: 0.85
  };

  const calculated = useMemo(() => {
    const rawAnnual = baseFees[selectedLevel][selectedTrack] * campusMultipliers[selectedCampus];
    
    let discount = 0;
    let termLabel = '';
    let installmentAmount = 0;
    let installmentsCount = 1;

    if (paymentTerm === 'annual') {
      discount = rawAnnual * 0.05; // 5% annual prepayment discount
      installmentAmount = Math.round(rawAnnual - discount);
      installmentsCount = 1;
      termLabel = lang === 'en' ? '1 Annual Payment (Save 5%)' : 'បង់ ១ លើកក្នុងមួយឆ្នាំ (សន្សំ ៥%)';
    } else if (paymentTerm === 'semi') {
      installmentAmount = Math.round(rawAnnual / 2);
      installmentsCount = 2;
      termLabel = lang === 'en' ? '2 Semi-Annual Payments' : 'បង់ ២ លើក (តាមឆមាស)';
    } else {
      installmentAmount = Math.round(rawAnnual / 4);
      installmentsCount = 4;
      termLabel = lang === 'en' ? '4 Termly Payments' : 'បង់ ៤ លើក (តាមត្រីមាស)';
    }

    const totalAnnual = paymentTerm === 'annual' ? Math.round(rawAnnual - discount) : Math.round(rawAnnual);

    // PUC Pathway Scholarship eligibility
    let pucScholarship = '10% - 20%';
    if (selectedLevel === 'highschool') {
      pucScholarship = '25% - 40%';
    } else if (selectedLevel === 'secondary') {
      pucScholarship = '20% - 30%';
    }

    return {
      totalAnnual,
      installmentAmount,
      installmentsCount,
      discount: Math.round(discount),
      termLabel,
      pucScholarship
    };
  }, [selectedCampus, selectedLevel, selectedTrack, paymentTerm, lang]);

  const campusNames = {
    tk: { en: 'Toul Kork (Headquarters)', kh: 'ទួលគោក (ទីស្នាក់ការកណ្តាល)' },
    ttp: { en: 'Toul Tom Poung Campus', kh: 'ទួលទំពូង' },
    cap: { en: 'Chbar Ampov Campus', kh: 'ច្បារអំពៅ' },
    rsk: { en: 'Russey Keo Campus', kh: 'ឫស្សីកែវ' },
    nr3: { en: 'National Road 3 Campus', kh: 'ផ្លូវជាតិលេខ ៣' },
    kpt: { en: 'Kampong Thom / Battambang', kh: 'កំពង់ធំ / បាត់ដំបង' }
  };

  const levelNames = {
    preschool: { en: 'Preschool (Ages 2.5 - 5)', kh: 'មត្តេយ្យ (អាយុ ២.៥ - ៥ ឆ្នាំ)' },
    primary: { en: 'Primary (Grades 1 - 6)', kh: 'បឋមសិក្សា (ថ្នាក់ទី ១ - ៦)' },
    secondary: { en: 'Secondary (Grades 7 - 9)', kh: 'អនុវិទ្យាល័យ (ថ្នាក់ទី ៧ - ៩)' },
    highschool: { en: 'High School (Grades 10 - 12)', kh: 'វិទ្យាល័យ (ថ្នាក់ទី ១០ - ១២)' }
  };

  const handleApply = () => {
    const summary = `${campusNames[selectedCampus].en} - ${levelNames[selectedLevel].en} (${selectedTrack.toUpperCase()})`;
    if (onApplyPlan) {
      onApplyPlan(summary);
      return;
    }
    const form = document.getElementById('apply-now');
    if (form) {
      form.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="tuition-estimator" className="py-20 sm:py-28 bg-[#fafbfc] border-t border-slate-100 scroll-mt-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
          <span className="inline-flex items-center gap-1.5 bg-brand-blue/5 text-brand-blue font-sans font-extrabold text-[10px] tracking-widest uppercase px-3.5 py-1.5 rounded-full border border-brand-blue/10">
            <Calculator size={12} className="text-brand-gold" />
            {lang === 'en' ? 'Transparent Tuition Guidance' : 'ការប៉ាន់ស្មានតម្លៃសិក្សា និងអាហារូបករណ៍'}
          </span>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl md:text-4xl text-brand-dark tracking-tight leading-tight">
            {lang === 'en' ? 'Interactive Tuition & Scholarship Calculator' : 'គណនាតម្លៃសិក្សាតាមសាខា និងកម្រិតថ្នាក់'}
          </h2>
          <div className="w-16 h-0.5 bg-brand-gold mx-auto rounded"></div>
          <p className="text-xs sm:text-sm text-slate-500 font-sans leading-relaxed">
            {lang === 'en'
              ? 'Calculate custom investment estimates for your child including Singapore Math, digital SaaS licenses, and PUC university pathway scholarships.'
              : 'ជ្រើសរើសសាខា កម្រិតថ្នាក់ និងកម្មវិធីសិក្សា ដើម្បីដឹងពីតម្លៃប៉ាន់ស្មាន រួមទាំងការបញ្ចុះតម្លៃ និងអាហារូបករណ៍ PUC ភ្លាមៗ។'}
          </p>
        </div>

        {/* Calculator Main Frame */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* Controls Panel (7 cols on desktop) */}
          <div className="lg:col-span-7 p-6 sm:p-8 md:p-10 space-y-6 sm:space-y-8">
            
            {/* Step 1: Select Campus */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 font-nav flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-brand-blue text-white text-[10px] flex items-center justify-center font-bold">1</span>
                <span>{lang === 'en' ? 'Choose Preferred Campus' : 'ជ្រើសរើសសាខាសាលា'}</span>
              </label>
              
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {(['tk', 'ttp', 'cap', 'rsk', 'nr3', 'kpt'] as const).map((code) => {
                  const isSelected = selectedCampus === code;
                  return (
                    <button
                      key={code}
                      onClick={() => setSelectedCampus(code)}
                      className={`p-2 sm:p-2.5 rounded-xl border text-center transition-all cursor-pointer font-sans ${
                        isSelected
                          ? 'bg-[#071B5C] text-white border-[#071B5C] shadow-md ring-2 ring-brand-gold'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      <div className="font-mono font-black text-xs sm:text-sm uppercase">{code}</div>
                      <div className="text-[8px] sm:text-[9px] mt-0.5 font-medium truncate">
                        {code === 'nr3' ? 'NR 3' : code.toUpperCase()}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Select Academic Level */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 font-nav flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-brand-blue text-white text-[10px] flex items-center justify-center font-bold">2</span>
                <span>{lang === 'en' ? 'Select Academic Division' : 'ជ្រើសរើសកម្រិតថ្នាក់'}</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['preschool', 'primary', 'secondary', 'highschool'] as const).map((lvl) => {
                  const isSelected = selectedLevel === lvl;
                  return (
                    <button
                      key={lvl}
                      onClick={() => setSelectedLevel(lvl)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-1 ring-brand-gold'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                      }`}
                    >
                      <div className="text-[10px] font-bold font-nav uppercase tracking-wider text-brand-gold">
                        {lvl === 'preschool' ? 'K1-K3' : lvl === 'primary' ? 'G1-G6' : lvl === 'secondary' ? 'G7-G9' : 'G10-G12'}
                      </div>
                      <div className="text-xs font-bold mt-1 line-clamp-1">
                        {lvl === 'preschool' ? 'Preschool' : lvl === 'primary' ? 'Primary' : lvl === 'secondary' ? 'Secondary' : 'High School'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Track & Payment Term */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Program Track */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 font-nav flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-brand-blue text-white text-[10px] flex items-center justify-center font-bold">3</span>
                  <span>{lang === 'en' ? 'Curriculum Track' : 'កម្មវិធីសិក្សា'}</span>
                </label>
                
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => setSelectedTrack('bilingual')}
                    className={`p-2.5 rounded-xl border text-center text-xs font-bold transition cursor-pointer ${
                      selectedTrack === 'bilingual'
                        ? 'bg-brand-blue text-white border-brand-blue shadow'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {lang === 'en' ? 'Bilingual Track' : 'ទ្វិភាសា'}
                  </button>
                  <button
                    onClick={() => setSelectedTrack('international')}
                    className={`p-2.5 rounded-xl border text-center text-xs font-bold transition cursor-pointer ${
                      selectedTrack === 'international'
                        ? 'bg-brand-blue text-white border-brand-blue shadow'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {lang === 'en' ? 'International' : 'អន្តរជាតិ'}
                  </button>
                </div>
              </div>

              {/* Payment Schedule */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 font-nav flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-brand-blue text-white text-[10px] flex items-center justify-center font-bold">4</span>
                  <span>{lang === 'en' ? 'Payment Term' : 'ជម្រើសបង់ប្រាក់'}</span>
                </label>

                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => setPaymentTerm('annual')}
                    className={`p-2 rounded-xl border text-center text-[10px] font-bold transition cursor-pointer ${
                      paymentTerm === 'annual'
                        ? 'bg-brand-blue text-white border-brand-blue shadow'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {lang === 'en' ? 'Annual (-5%)' : '១ ឆ្នាំ (-5%)'}
                  </button>
                  <button
                    onClick={() => setPaymentTerm('semi')}
                    className={`p-2 rounded-xl border text-center text-[10px] font-bold transition cursor-pointer ${
                      paymentTerm === 'semi'
                        ? 'bg-brand-blue text-white border-brand-blue shadow'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {lang === 'en' ? '2 Terms' : 'ឆមាស (២x)'}
                  </button>
                  <button
                    onClick={() => setPaymentTerm('term')}
                    className={`p-2 rounded-xl border text-center text-[10px] font-bold transition cursor-pointer ${
                      paymentTerm === 'term'
                        ? 'bg-brand-blue text-white border-brand-blue shadow'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {lang === 'en' ? '4 Terms' : 'ត្រីមាស (៤x)'}
                  </button>
                </div>
              </div>

            </div>

            {/* Inclusions summary pills */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <span className="text-[10px] font-bold uppercase text-slate-400 font-sans tracking-wider block">
                {lang === 'en' ? 'All Plans Automatically Include:' : 'កញ្ចប់ទាំងអស់រួមបញ្ចូលដោយឥតគិតថ្លៃ៖'}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 font-sans">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                  <span>KooBits Math & Raz-Kids AI licenses</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                  <span>Smart World Robotics lab sessions</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                  <span>Free Placement test & Counseling</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                  <span>PUC direct scholarship credential</span>
                </div>
              </div>
            </div>

          </div>

          {/* Result Dashboard Card (5 cols on desktop) */}
          <div className="lg:col-span-5 bg-gradient-to-b from-[#07133C] via-[#051445] to-[#030A24] text-white p-6 sm:p-8 md:p-10 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="space-y-6 relative z-10">
              
              {/* Selected summary badge */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] text-brand-gold uppercase tracking-widest font-mono font-bold block">
                    {lang === 'en' ? 'Plan Summary' : 'សេចក្តីសង្ខេប'}
                  </span>
                  <h4 className="font-serif font-bold text-base sm:text-lg text-white mt-0.5">
                    {campusNames[selectedCampus][lang]}
                  </h4>
                  <p className="text-xs text-slate-300 font-sans font-light">
                    {levelNames[selectedLevel][lang]} • {selectedTrack === 'bilingual' ? 'Bilingual' : 'International'}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 text-brand-gold shrink-0">
                  <DollarSign size={20} />
                </div>
              </div>

              {/* Price Display */}
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-sans block">
                  {calculated.termLabel}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4.5xl font-black text-brand-gold font-mono tracking-tight">
                    ${calculated.installmentAmount.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-300 font-sans">
                    {paymentTerm === 'annual' ? '/ year' : `/ payment (${calculated.installmentsCount}x)`}
                  </span>
                </div>
                {calculated.discount > 0 && (
                  <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 pt-1">
                    <Sparkles size={12} />
                    <span>{lang === 'en' ? `Includes $${calculated.discount} annual prepayment discount` : `បានបញ្ចុះតម្លៃ $${calculated.discount} រួចជាស្រេច`}</span>
                  </p>
                )}
              </div>

              {/* PUC Pathway Benefit Box */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-xs font-bold text-brand-gold uppercase tracking-wide font-nav">
                  <Award size={15} />
                  <span>{lang === 'en' ? 'PUC University Scholarship' : 'អាហារូបករណ៍សាកលវិទ្យាល័យ PUC'}</span>
                </div>
                <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                  {lang === 'en'
                    ? `Graduates from this division are pre-qualified for a ${calculated.pucScholarship} tuition grant at Paññāsāstra University.`
                    : `សិស្សបញ្ចប់កម្រិតនេះនឹងទទួលបានសិទ្ធិអាហារូបករណ៍បញ្ចុះតម្លៃពី ${calculated.pucScholarship} នៅសាកលវិទ្យាល័យ PUC។`}
                </p>
              </div>

            </div>

            {/* Action CTA */}
            <div className="pt-6 border-t border-white/10 space-y-3 relative z-10 mt-6">
              <button
                onClick={handleApply}
                className="w-full py-4 rounded-xl bg-brand-gold hover:bg-amber-400 active:scale-98 text-brand-dark font-nav font-bold text-xs uppercase tracking-wider shadow-xl transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{lang === 'en' ? 'Apply with this Plan' : 'ចុះឈ្មោះជាមួយកញ្ចប់សិក្សានេះ'}</span>
                <ArrowRight size={14} />
              </button>
              <p className="text-[9px] text-center text-slate-400 font-sans">
                {lang === 'en' ? '*Exact tuition may vary slightly by official registration fees and uniforms.' : '*តម្លៃជាក់ស្តែងអាចមានការប្រែប្រួលតិចតួចអាស្រ័យលើថ្លៃរដ្ឋបាល និងឯកសណ្ឋាន។'}
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
