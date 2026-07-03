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

  const milestones = lang === 'en' ? [
    { id: 'preschool', name: 'Preschool International', age: 'Ages 3 - 5', step: '01', desc: 'Bilingual play foundations, sensory focus development, and early English scripts.' },
    { id: 'primary', name: 'Singapore Primary School', age: 'Ages 6 - 11', step: '02', desc: 'Comprehensive Singapore mathematics, critical analysis, and computer science basics.' },
    { id: 'secondary', name: 'Secondary School Track', age: 'Ages 12 - 15', step: '03', desc: 'Robotics kits, code scripting, bilingual science, and intermediate humanities.' },
    { id: 'highschool', name: 'High School & PUC prep', age: 'Ages 16 - 18', step: '04', desc: 'Elite physics, university calculus, professional IELTS training, and scholarships.' }
  ] : [
    { id: 'preschool', name: 'មត្តេយ្យសិក្សាអន្តរជាតិ', age: 'អាយុ ៣ - ៥ ឆ្នាំ', step: '01', desc: 'គ្រឹះនៃការលេងបែបពីរភាសា ការអភិវឌ្ឍផ្នែក حواس (sensory) និងការចាប់ផ្ដើមរៀនភាសាអង់គ្លេសដំបូង។' },
    { id: 'primary', name: 'បឋមសិក្សាស្តង់ដារសិង្ហបុរី', age: 'អាយុ ៦ - ១១ ឆ្នាំ', step: '02', desc: 'កម្មវិធីសិក្សាគណិតវិទ្យាសិង្ហបុរីពេញលេញ ការវិភាគស៊ីជម្រៅ និងគ្រឹះវិទ្យាសាស្ត្រកុំព្យូទ័រ។' },
    { id: 'secondary', name: 'អនុវិទ្យាល័យ', age: 'អាយុ ១២ - ១៥ ឆ្នាំ', step: '03', desc: 'បំពាក់ឧបករណ៍រ៉ូបូត ការសរសេរកូដបញ្ជា វិទ្យាសាស្ត្របែបពីរភាសា និងមុខវិជ្ជាសង្គមថ្នាក់កណ្តាល។' },
    { id: 'highschool', name: 'វិទ្យាល័យ និងការត្រៀម PUC', age: 'អាយុ ១៦ - ១៨ ឆ្នាំ', step: '04', desc: 'មុខវិជ្ជា រូបវិទ្យាថ្នាក់ខ្ពស់ គណិតវិទ្យាកម្រិតសាកលវិទ្យាល័យ ការបង្វឹក IELTS អាជីព និងអាហារូបករណ៍។' }
  ];

  const academicTranslations: Record<string, {
    name: string;
    description: string;
    curriculum: string[];
    features: string[];
    ageGroup: string;
  }> = {
    preschool: {
      name: 'មត្តេយ្យសិក្សាទ្វេភាសា និងអន្តរជាតិ',
      description: 'បណ្តុះការចង់ដឹងចង់ឃើញតាមរយៈការលេងបែបវិទ្យាសាស្ត្រ ការប៉ះផ្ទាល់ គ្រឿងយន្តមូលដ្ឋាន និងភាសា។ សិស្សតូចៗត្រូវបានណែនាំឱ្យស្គាល់សូរសព្ទភាសា និងគណិតវិទ្យាដំបូង ក្រោមការត្រួតពិនិត្យសុវត្ថិភាពខ្ពស់បំផុត។',
      curriculum: ['សូរសព្ទភាសា និងការនិទានរឿង', 'ប្រព័ន្ធភាសាអង់គ្លេស ELIF', 'រ៉ូបូតរូបវន្ត KUBO', 'សិល្បៈច្នៃប្រឌិត និងការលេងបែបវិទ្យាសាស្ត្រ', 'គ្រឹះវប្បធម៌ខ្មែរ'],
      features: ['សមាមាត្រសិស្សនិងគ្រូទាបបំផុត (៥:១)', 'តំបន់លេងដែលធានាសុវត្ថិភាពកូនៗ', 'ការត្រួតពិនិត្យសុខភាពកុមារប្រចាំថ្ងៃ', 'ហ្គេមបញ្ចាំងលើកម្រាលឥដ្ឋបែបអន្តរកម្ម'],
      ageGroup: 'អាយុ ២.៥ ដល់ ៥ ឆ្នាំ'
    },
    primary: {
      name: 'បឋមសិក្សាស្តង់ដារសិង្ហបុរី',
      description: 'ការបង្កើតមូលដ្ឋានគ្រឹះដ៏រឹងមាំក្នុងជំនាញ STEM តក្កវិទ្យាគណិតវិទ្យា និងភាសាទាំងពីរ។ បញ្ចូលស្តង់ដាររដ្ឋជាមួយ Koobits និង Raz-Kids ដើម្បីពន្លឿនការសិក្សា។',
      curriculum: ['វិធីសាស្ត្រគណិតវិទ្យាសិង្ហបុរី', 'វិទ្យាសាស្ត្រពិសោធន៍ពេញលេញ', 'ភាសាទ្វេភាសា អង់គ្លេស/ខ្មែរ', 'ការណែនាំភាសាចិន', 'ការអានឌីជីថល Raz-Kids'],
      features: ['កម្មវិធីសិក្សារ៉ូបូតចងភ្ជាប់រៀងរាល់សប្តាហ៍', 'គន្លងគណិតវិទ្យាផ្ទាល់ខ្លួនតាមរយៈ Koobits AI', 'ការសរសេរច្នៃប្រឌិត និងសិល្បៈសម្តែង', 'ការប្រកួតប្រជែងវិទ្យាសាស្ត្ររវាងសាខា'],
      ageGroup: 'អាយុ ៦ ដល់ ១១ ឆ្នាំ'
    },
    secondary: {
      name: 'អនុវិទ្យាល័យ',
      description: 'ការលើកកម្ពស់ការវិភាគអរូបីស៊ីជម្រៅ ការជជែកដេញដោលជាលក្ខណៈរចនាសម្ព័ន្ធ ការសរសេរកូដវេបសាយ និងជីវវិទ្យាឯកទេស។ ត្រៀមគំនិតដើម្បីដោះស្រាយបញ្ហាជាជាងការទន្ទេញចាំ។',
      curriculum: ['វិទ្យាសាស្ត្រកុំព្យូទ័រ និងកូដ CodeMonkey', 'រូបវិទ្យា និងគីមីវិទ្យាថ្នាក់ខ្ពស់', 'ប្រវត្តិវិទ្យា និងភូមិវិទ្យាអន្តរជាតិ', 'អក្សរសិល្ប៍ខ្មែរពេញលេញ', 'ការសរសេរភាសាអង់គ្លេសកម្រិតខ្ពស់'],
      features: ['ការវាយតម្លៃមន្ទីរពិសោធន៍វិទ្យាសាស្ត្រប្រចាំសប្តាហ៍', 'ការហោះហើរដ្រូន និងតេស្តកូដជាក់ស្តែង', 'ការបង្វឹកនិយាយជាសាធារណៈ និងដេញដោលសភា', 'អក្ខរកម្មឌីជីថល និងការត្រួតពិនិត្យការលួចចម្លងនៅលើ Turnitin'],
      ageGroup: 'អាយុ ១២ ដល់ ១៥ ឆ្នាំ'
    },
    highschool: {
      name: 'វិទ្យាល័យ និងការត្រៀម PUC',
      description: 'គន្លងផ្លូវត្រៀមចូលសាកលវិទ្យាល័យលំដាប់កំពូល។ សិស្សវិទ្យាល័យទទួលបានកញ្ចប់តេស្ត IELTS និង TOEFL ព្រមទាំងសេវាកម្មតម្រង់ទិសដើម្បីចូលរៀននៅសាកលវិទ្យាល័យលំដាប់អន្តរជាតិ។',
      curriculum: ['ការបណ្តុះបណ្តាល IELTS កម្រិតខ្ពស់ (British Council)', 'គណិតវិទ្យាឧត្តម (Calculus) & ស្ថិតិ', 'វិទ្យាសាស្ត្រសង្គម & ទំនាក់ទំនងអន្តរជាតិ', 'ការត្រៀមប្រឡងបាក់ឌុបជាតិ', 'ជំនាញត្រៀមសម្រាប់សាកលវិទ្យាល័យ (PUC)'],
      features: ['សេវាកម្មប្រឹក្សាអាហារូបករណ៍សាកលវិទ្យាល័យ', 'ការចុះកម្មសិក្សានៅបណ្តាស្ថាប័នដៃគូ', 'ការតម្រង់ទិសអាជីព និងសហគ្រិនភាព', 'អាហារូបករណ៍ ១០% - ៤០% ទៅកាន់សាកលវិទ្យាល័យបញ្ញាសាស្ត្រកម្ពុជា'],
      ageGroup: 'អាយុ ១៦ ដល់ ១៨ ឆ្នាំ'
    }
  };

  return (
    <section id="academics" className="py-28 bg-white scroll-mt-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <span className="inline-block bg-brand-blue/5 text-brand-blue font-sans font-medium text-[10px] tracking-widest uppercase px-3.5 py-1.5 rounded-full border border-brand-blue/10">
            {lang === 'en' ? 'Elite Academic Pathways' : 'កម្មវិធីសិក្សាអប់រំលំដាប់អន្តរជាតិ'}
          </span>
          <h2 className="font-serif font-bold text-3xl md:text-[45px] text-brand-dark tracking-tight leading-tight">
            {lang === 'en' ? 'Bilingual Journey. Global Futures.' : 'កម្មវិធីពីរភាសា គំនិតច្នៃប្រឌិតឆ្ពោះទៅអនាគត'}
          </h2>
          <div className="w-16 h-0.5 bg-brand-gold mx-auto rounded"></div>
          <p className="text-xs md:text-sm text-slate-500 font-sans leading-relaxed">
            {lang === 'en'
              ? 'Paññāsāstra International School deploys modern, dual language tracks completely synced with Singapore mathematics standards, Cambridge language competencies, and tech engineering matrices.'
              : 'សាលាអន្តរជាតិ បញ្ញាសាស្ត្រ ផ្តល់ជូននូវការសិក្សាពីរភាសា (អង់គ្លេស-ខ្មែរ) ស្របតាមស្តង់ដារគណិតវិទ្យាសិង្ហបុរី ស្តង់ដារភាសាអង់គ្លេស Cambridge និងបច្គេកវិទ្យាឌីជីថល។'}
          </p>
        </div>

        {/* Infographic Learning Journey Timeline Widget */}
        <div className="mb-16 grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {/* Connecting line behind milestones on desktop */}
          <div className="hidden md:block absolute top-[50px] left-[12.5%] right-[12.5%] h-1 bg-slate-100 z-0"></div>
          
          {milestones.map((ms) => {
            const isSelected = activeProgId === ms.id;
            return (
              <button
                key={ms.id}
                onClick={() => setActiveProgId(ms.id)}
                className={`text-left p-6 rounded-2xl border transition-all duration-300 relative z-10 cursor-pointer outline-none ${
                  isSelected
                    ? 'bg-slate-900 border-slate-900 text-white shadow-xl'
                    : 'bg-slate-50 hover:bg-slate-100/70 border-slate-100 text-slate-800'
                }`}
              >
                <div className="flex justify-between items-center mb-4">
                  <span className={`text-[10px] font-bold font-nav uppercase px-2.5 py-1 rounded tracking-widest ${
                    isSelected ? 'bg-brand-gold text-slate-950' : 'bg-slate-200 text-slate-505'
                  }`}>
                    {ms.age}
                  </span>
                  <span className={`font-mono text-xl font-black ${isSelected ? 'text-white/20' : 'text-slate-300'}`}>
                    {ms.step}
                  </span>
                </div>
                
                <h4 className="text-xs font-bold font-nav tracking-wide mb-2">
                  {ms.name}
                </h4>
                <p className={`text-[10px] leading-relaxed font-sans ${isSelected ? 'text-slate-300 font-light' : 'text-slate-500'}`}>
                  {ms.desc}
                </p>

                {isSelected && (
                  <motion.div 
                    layoutId="journeyTimelineGlow"
                    className="absolute bottom-0 left-6 right-6 h-1.5 bg-brand-gold rounded-t-full"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Active Division Information Dashboard Block */}
        <div className="bg-slate-50 border border-slate-100 rounded-3xl overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-0">
          
          {/* Side Graphic Image Box */}
          <div className="lg:col-span-5 h-72 lg:h-auto min-h-[450px] relative overflow-hidden bg-slate-900">
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
            
            <div className="absolute bottom-10 left-10 right-10 text-white space-y-2">
              <span className="bg-brand-gold text-brand-dark font-nav font-semibold text-[9px] uppercase px-2.5 py-1 rounded tracking-widest">
                {lang === 'en' ? 'Admission Registry Target Age' : 'លក្ខខណ្ឌអាយុ'}
              </span>
              <h4 className="font-serif font-bold text-white text-lg tracking-wide leading-tight">
                {lang === 'en' ? selectedProg.ageGroup : (academicTranslations[selectedProg.id]?.ageGroup || selectedProg.ageGroup)}
              </h4>
            </div>
          </div>

          {/* Details & Module Highlights Box */}
          <div className="lg:col-span-7 p-8 md:p-12 space-y-8 flex flex-col justify-between">
            
            <div className="space-y-4">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#112B8C] bg-brand-blue/5 px-3.5 py-1.5 rounded-full font-sans border border-brand-blue/10">
                {lang === 'en' ? 'Curriculum Overview' : 'ព័ត៌មានទូទៅនៃកម្មវិធីសិក្សា'}
              </span>
              
              <h3 className="font-serif font-bold text-brand-blue text-2xl md:text-[28px] tracking-tight mt-1 leading-tight">
                {lang === 'en' ? selectedProg.name : (academicTranslations[selectedProg.id]?.name || selectedProg.khmerName || selectedProg.name)}
              </h3>
              
              <p className="text-xs md:text-sm text-slate-650 leading-relaxed font-sans font-light">
                {lang === 'en' ? selectedProg.description : (academicTranslations[selectedProg.id]?.description || selectedProg.description)}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-200">
              
              {/* Column 1: Subjects List */}
              <div className="space-y-3">
                <h4 className="font-nav font-bold text-[10px] uppercase text-slate-400 tracking-widest flex items-center">
                  <BookOpen size={12} className="mr-1.5 text-brand-gold" />
                  {lang === 'en' ? 'Core Sub-Modules' : 'មុខវិជ្ជាគោលៗ'}
                </h4>
                
                <ul className="space-y-2.5">
                  {(lang === 'en' ? selectedProg.curriculum : (academicTranslations[selectedProg.id]?.curriculum || selectedProg.curriculum)).map((subject, idx) => (
                    <li key={idx} className="flex items-center text-xs text-slate-700 font-sans">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-gold mr-3"></span>
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
                
                <ul className="space-y-2.5">
                  {(lang === 'en' ? selectedProg.features : (academicTranslations[selectedProg.id]?.features || selectedProg.features)).map((feature, idx) => (
                    <li key={idx} className="flex items-start text-xs text-slate-700 font-sans font-medium">
                      <CheckSquare size={13} className="mr-2.5 text-emerald-500 mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Quick action button inside curriculum drawer */}
            <div className="pt-6 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => {
                  const form = document.getElementById('apply-now');
                  if (form) {
                    form.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="bg-brand-blue hover:bg-brand-dark text-white font-nav font-bold text-xs uppercase tracking-wider px-7 py-[15px] rounded-xl shadow-md hover:shadow-lg transition flex items-center space-x-2.5 cursor-pointer"
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
