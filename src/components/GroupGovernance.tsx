/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Network, GraduationCap, Cpu, Layers, Rocket, ShieldCheck, 
  ArrowRight, Award, Landmark
} from 'lucide-react';

interface GroupGovernanceProps {
  lang: 'en' | 'kh';
}

export default function GroupGovernance({ lang }: GroupGovernanceProps) {
  const [activeNode, setActiveNode] = useState<string>('parent');

  const locale = {
    en: {
      sectionBadge: 'Academic Governance & Structure',
      sectionTitle: 'Part of Australia Young Leaders Academy',
      sectionSub: 'Paññāsāstra International School is governed and supported by Australia Young Leaders Academy Co., Ltd. (AYLA), the parent organization of this elite educational ecosystem.',
      chartTitle: 'Governance Structure & Authority Flow',
      chartSub: 'Hover or tap a department block to inspect its direct mandates and ecosystem components.',
      
      parentTitle: 'Australia Young Leaders Academy Co., Ltd. (AYLA)',
      parentRole: 'Parent Organization / Head Office',
      parentDesc: 'AYLA coordinates strategic funding, global curriculum alignment, digital tool procurement, and Ministry audits to ensure absolute educational hegemony across all subsidiaries.',
      
      psisTitle: 'Paññāsāstra International School (PSIS)',
      psisRole: 'Flagship Academic Network',
      psisDesc: 'A premier dual-language K-12 schooling system providing bilingual excellence, Singapore Mathematics, and direct University entry routes across 6 active campus reserves.',

      pucTitle: 'PUC-IFL Academic Programs',
      pucRole: 'Elite Intensive Language Institute',
      pucDesc: 'Official university-grade curriculum alignment with Paññāsāstra University of Cambodia (PUC) and the Institute of Foreign Languages (IFL) for fluent English, bilingual masteries, and IELTS pathways.',

      digitalTitle: 'Digital Learning Suite',
      digitalRole: 'Global Software Portfolio Integration',
      digitalDesc: 'Mandatory high-performance platforms embedded into standard homework cycles, enhancing literacy, arithmetic, code reasoning, and anti-plagiarism audits.',

      stemTitle: 'STEM & Robotics Division',
      stemRole: 'Advanced Science, Technology & AI',
      stemDesc: 'State-of-the-art engineering laboratories loaded with robotics, drone flight navigation systems, Python controllers, and interactive physical devices.',

      futureTitle: 'Future Education Programs',
      futureRole: 'Continuous Academic Inception',
      futureDesc: 'Incubating next-generation vocational paths, artificial intelligence foundations, global exchange credentials, and early-entry international scholarships.',

      // Campus names and info
      campuses: 'TK (Head), TTP, CAP, RSK, NR3 & Battambang',
      digitalTools: 'ELIF, KooBits, Raz Kids, CodeMonkey, Turnitin, Chinese Programme',
      stemAssets: 'Smart World Robotics, Drone Education, KUBO Robot, Interactive Displays',
      futureAssets: 'AI Literacy, Global Exchange Credentials, Early University Scholarships',
      pucAssets: 'General English Proficiency, Intermediate Language mastery, IELTS / TOEFL Tracks',

      mandate: 'Key Governance Mandate',
      ecosystem: 'Synergistic Systems & Assets',
      governanceBoard: 'AYLA Board of Executive Directors',
      boardSub: 'Distinguished scholars and corporate governors steering Cambodian education into modern standards.',
      dir1Name: 'Oknha Dr. Chey Sam Ath',
      dir1Role: 'Chairman of the Board of Governors (AYLA)',
      dir2Name: 'Dr. Lynne Sherwood',
      dir2Role: 'Co-Founder & Group Chief Executive Officer (AYLA)',
      dir3Name: 'Professor Jean-Paul Laurent',
      dir3Role: 'Director of Global Curriculum & Technology Suites',
    },
    kh: {
      sectionBadge: 'រចនាសម្ព័ន្ធ និងអភិបាលកិច្ចសាលា',
      sectionTitle: 'ជាសមាជិកនៃបណ្ឌិត្យសភាអ្នកដឹកនាំវ័យក្មេងអូស្ត្រាលី',
      sectionSub: 'សាលាអន្តរជាតិ បញ្ញាសាស្ត្រ ត្រូវបានគ្រប់គ្រង និងគាំទ្រដោយក្រុមហ៊ុន Australia Young Leaders Academy Co., Ltd. (AYLA) ដែលជាអង្គភាពមេនៃប្រព័ន្ធអប់រំដ៏ឆ្នើមនេះ។',
      chartTitle: 'រចនាសម្ព័ន្ធគ្រប់គ្រង និងលំហូរអំណាចអភិបាលកិច្ច',
      chartSub: 'ចុចលើផ្នែកនីមួយៗដើម្បីពិនិត្យមើល តួនាទីភារកិច្ច និងប្រព័ន្ធគាំទ្រផ្ទាល់ខ្លួន។',
      
      parentTitle: 'Australia Young Leaders Academy Co., Ltd. (AYLA)',
      parentRole: 'បណ្ឌិត្យសភាមេ / ការិយាល័យកណ្តាល',
      parentDesc: 'AYLA ដឹកនាំលើការវិនិយោគយុទ្ធសាស្ត្រ ការតម្រឹមកម្មវិធីសិក្សាកម្រិតអន្តរជាតិ ការស្វែងរកឧបករណ៍ឌីជីថល និងសវនកម្មក្រសួង ដើម្បីធានាបាននូវឧត្តមភាពនៃការអប់រំ។',
      
      psisTitle: 'សាលាអន្តរជាតិ បញ្ញាសាស្ត្រ (PSIS)',
      psisRole: 'បណ្តាញគ្រឹះស្ថានសិក្សាឆ្នើម K-12',
      psisDesc: 'ប្រព័ន្ធអប់រំពីរភាសាលំដាប់កំពូល K-12 ផ្តល់ជូននូវឧត្តមភាពទ្វិភាសា គណិតវិទ្យាសិង្ហបុរី និងផ្លូវឆ្ពោះទៅកាន់សាកលវិទ្យាល័យដោយផ្ទាល់ក្នុងចំណោមសាខាទាំង៦។',

      pucTitle: 'កម្មវិធីសិក្សា PUC-IFL',
      pucRole: 'វិទ្យាស្ថានភាសាអង់គ្លេសកម្រិតខ្ពស់',
      pucDesc: 'ការតម្រឹមកម្មវិធីសិក្សាភាសាអង់គ្លេសកម្រិតសាកលវិទ្យាល័យ ជាមួយសាកលវិទ្យាល័យបញ្ញាសាស្ត្រកម្ពុជា (PUC) និងវិទ្យាស្ថានភាសាបរទេស (IFL) សម្រាប់សមត្ថភាព IELTS និង TOEFL។',

      digitalTitle: 'ប្រព័ន្ធសិក្សាឌីជីថល (Digital Suite)',
      digitalRole: 'ការរួមបញ្ចូលកម្មវិធីទន់កម្រិតពិភពលោក',
      digitalDesc: 'កម្មវិធីសិក្សាអេឡិចត្រូនិកដែលតម្រូវជាកាតព្វកិច្ចដើម្បីពង្រឹងការអាន គណិតវិទ្យា ការសរសេរកូដ និងសវនកម្មភាពត្រឹមត្រូវនៃស្នាដៃការងារសិស្ស (Anti-plagiarism)។',

      stemTitle: 'ផ្នែកបច្ចេកវិទ្យា STEM & Robotics',
      stemRole: 'វិទ្យាសាស្ត្រជឿនលឿន បច្ចេកវិទ្យា និង AI',
      stemDesc: 'មន្ទីរពិសោធន៍វិស្វកម្មទំនើប បំពាក់ដោយរ៉ូបូត ប្រព័ន្ធដ្រូនបញ្ជាទិស កម្មវិធី Python និងឧបករណ៍បច្ចេកវិទ្យាអន្តរកម្ម។',

      futureTitle: 'កម្មវិធីអប់រំនាពេលអនាគត',
      futureRole: 'ការបង្កើតថ្មីឥតឈប់ឈរលើកម្មវិធីអប់រំ',
      futureDesc: 'ការរៀបចំកម្មវិធីបណ្តុះបណ្តាលវិជ្ជាជីវៈជំនាន់ថ្មី មូលដ្ឋានគ្រឹះបញ្ញាសិប្បនិម្មិត (AI) និងកិច្ចសហការអាហារូបករណ៍ផ្ទាល់ទៅក្រៅប្រទេស។',

      campuses: 'សាខា ទួលគោក (ទីស្នាក់ការ), ទួលទំពូង, ច្បារអំពៅ, ឫស្សីកែវ, ផ្លូវជាតិលេខ៣, និងបាត់ដំបង',
      digitalTools: 'ELIF, KooBits, Raz Kids, CodeMonkey, Turnitin, កម្មវិធីភាសាចិន',
      stemAssets: 'រ៉ូបូត Smart World, ការអប់រំដ្រូន, រ៉ូបូត KUBO, កញ្ចក់អន្តរកម្ម Newline',
      futureAssets: 'ការយល់ដឹងពី AI, វិញ្ញាបនបត្រផ្លាស់ប្តូរកម្រិតសាកល, អាហារូបករណ៍សាកលវិទ្យាល័យសម្រាប់ការចុះឈ្មោះដំបូង',
      pucAssets: 'សមត្ថភាពភាសាអង់គ្លេសទូទៅ, កម្រិតភាសាមធ្យម, ថ្នាក់ត្រៀមប្រឡង IELTS និង TOEFL',

      mandate: 'ភារកិច្ចអភិបាលកិច្ចចម្បង',
      ecosystem: 'ប្រព័ន្ធគាំទ្រ និងឧបករណ៍សហការ',
      governanceBoard: 'ក្រុមប្រឹក្សាភិបាលប្រតិបត្តិនៃ AYLA',
      boardSub: 'អ្នកប្រាជ្ញ និងអភិបាលសាជីវកម្មដ៏លេចធ្លោ ដែលដឹកនាំប្រព័ន្ធអប់រំកម្ពុជាឱ្យឈានដល់ស្តង់ដារទំនើប។',
      dir1Name: 'ឧកញ៉ា បណ្ឌិត ជា សំអាត',
      dir1Role: 'ប្រធានក្រុមប្រឹក្សាភិបាល (AYLA)',
      dir2Name: 'បណ្ឌិត Lynne Sherwood',
      dir2Role: 'សហស្ថាបនិក និងអគ្គនាយិកាប្រតិបត្តិក្រុមការងារ AYLA',
      dir3Name: 'សាស្ត្រាចារ្យ Jean-Paul Laurent',
      dir3Role: 'នាយកផ្នែកកម្មវិធីសិក្សាសកល និងប្រព័ន្ធបច្ចេកវិទ្យា',
    }
  };

  const getActiveNodeData = () => {
    const t = locale[lang];
    switch (activeNode) {
      case 'parent':
        return {
          title: t.parentTitle,
          role: t.parentRole,
          desc: t.parentDesc,
          mandator: lang === 'en' ? 'Governance, strategic capital allocation, global resource procurement, and regulatory compliance.' : 'យុទ្ធសាស្ត្រហិរញ្ញវត្ថុ ការសម្របសម្រួលធនធាន និងអភិបាលកិច្ចទូទៅ។',
          ecosystems: 'AYLA Head Office, Executive Secretariat, Board of Audits',
          icon: <Landmark className="text-amber-400 w-8 h-8" />
        };
      case 'psis':
        return {
          title: t.psisTitle,
          role: t.psisRole,
          desc: t.psisDesc,
          mandator: lang === 'en' ? 'Bilingual academic development, school branch audits, community enrichment, and MoEYS localized integration.' : 'ការអភិវឌ្ឍជំនាញពីរភាសា កិច្ចសហការជាមួយក្រសួងអប់រំ និងការគ្រប់គ្រងសាខា។',
          ecosystems: t.campuses,
          icon: <GraduationCap className="text-blue-400 w-8 h-8" />
        };
      case 'puc':
        return {
          title: t.pucTitle,
          role: t.pucRole,
          desc: t.pucDesc,
          mandator: lang === 'en' ? 'Seamless progression to PUC colleges, official Cambridge ESL training formats, and academic accreditation guarantees.' : 'ការធានានូវការបញ្ជូនសិស្សទៅគ្រឹះស្ថានឧត្តមសិក្សា និងកម្មវិធីភាសាអង់គ្លេស IFL។',
          ecosystems: t.pucAssets,
          icon: <Award className="text-emerald-400 w-8 h-8" />
        };
      case 'digital':
        return {
          title: t.digitalTitle,
          role: t.digitalRole,
          desc: t.digitalDesc,
          mandator: lang === 'en' ? 'Providing high-speed API synchronizations to log metrics directly to school management systems, preventing plagiarism, and training Chinese.' : 'ការគាំទ្រប្រព័ន្ធគ្រប់គ្រងសិស្សតាមបច្ចេកវិទ្យាកម្រិតខ្ពស់ និងការសរសេរកូដ។',
          ecosystems: t.digitalTools,
          icon: <Layers className="text-purple-400 w-8 h-8" />
        };
      case 'stem':
        return {
          title: t.stemTitle,
          role: t.stemRole,
          desc: t.stemDesc,
          mandator: lang === 'en' ? 'Constructing advanced algorithmic structures, training robotics mentors, and funding aerospace drone testing reserves.' : 'ការផ្តល់ឧបករណ៍ដ្រូន កម្មវិធីរ៉ូបូត និងកញ្ចក់បច្ចេកវិទ្យាអន្តរកម្ម។',
          ecosystems: t.stemAssets,
          icon: <Cpu className="text-[#E6B83E] w-8 h-8" />
        };
      case 'future':
        return {
          title: t.futureTitle,
          role: t.futureRole,
          desc: t.futureDesc,
          mandator: lang === 'en' ? 'Inception of AI foundation classes, secure coding for blockchain applications, and international Ivy League scholarship pathways.' : 'ការរៀបចំគ្រឹះការយល់ដឹងពី AI និងទម្រង់អាហារូបករណ៍អន្តរជាតិ។',
          ecosystems: t.futureAssets,
          icon: <Rocket className="text-rose-400 w-8 h-8" />
        };
      default:
        return {
          title: '',
          role: '',
          desc: '',
          mandator: '',
          ecosystems: '',
          icon: <Layers />
        };
    }
  };

  const activeData = getActiveNodeData();
  const t = locale[lang];

  return (
    <section id="ayla-governance" className="py-20 bg-gradient-to-b from-[#051034] to-[#0c2264] text-white overflow-hidden scroll-mt-12 relative border-t border-white/5">
      {/* Background Graphic Grid */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="inline-flex items-center space-x-2 bg-brand-gold/15 border border-brand-gold/30 text-brand-gold font-sans font-semibold text-[10px] tracking-widest uppercase px-4 py-1.5 rounded-full">
            <ShieldCheck size={12} className="text-brand-gold" />
            <span>{t.sectionBadge}</span>
          </span>
          <h2 className="font-serif font-bold text-3xl md:text-5xl text-white tracking-tight leading-tight">
            {t.sectionTitle}
          </h2>
          <div className="w-20 h-0.5 bg-brand-gold mx-auto rounded"></div>
          <p className="text-xs md:text-sm text-[#E8EEFF]/80 leading-relaxed font-sans max-w-2xl mx-auto">
            {t.sectionSub}
          </p>
        </div>

        {/* Dynamic Corporate Visual Hierarchy Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Interactive Flow Chart Tree Left (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-2">
              <h3 className="font-serif font-bold text-lg md:text-xl text-brand-gold flex items-center">
                <Network size={18} className="mr-2" />
                {t.chartTitle}
              </h3>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {t.chartSub}
              </p>
            </div>

            {/* Simulated Interactive Tree Drawing with CSS & Tailwind */}
            <div className="relative p-6 bg-slate-950/40 border border-white/10 rounded-2xl flex flex-col items-center gap-6 shadow-2xl backdrop-blur-sm">
              
              {/* Connector line background vectors */}
              <div className="absolute top-1/3 bottom-10 left-1/2 w-0.5 bg-dashed bg-white/20 -translate-x-1/2 hidden md:block"></div>

              {/* LEVEL 1: Parent Organization */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveNode('parent')}
                className={`w-full max-w-xl p-5 rounded-xl border-2 transition-all text-center flex flex-col items-center relative z-10 cursor-pointer ${
                  activeNode === 'parent'
                    ? 'bg-brand-gold border-white text-slate-950 shadow-lg shadow-brand-gold/25'
                    : 'bg-slate-900/90 hover:bg-slate-800 border-white/10 text-white'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Landmark className={`w-5 h-5 ${activeNode === 'parent' ? 'text-slate-950' : 'text-brand-gold'}`} />
                  <span className="font-nav font-black text-xs uppercase tracking-wider">
                    Australia Young Leaders Academy Co., Ltd. (AYLA)
                  </span>
                </div>
                <p className={`text-[10px] mt-1 font-sans ${activeNode === 'parent' ? 'text-slate-950/90 font-medium' : 'text-[#DDE6FF]'}`}>
                  {lang === 'en' ? 'Central Governing Parent Organisation / Head Office' : 'ក្រុមប្រឹក្សាភិបាលជាគណៈគ្រប់គ្រងមេ / ការិយាល័យកណ្តាល'}
                </p>
                {activeNode === 'parent' && (
                  <span className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-brand-gold rotate-45 border-r border-b border-white"></span>
                )}
              </motion.button>

              {/* Level Connector indicator */}
              <div className="h-4 flex items-center justify-center">
                <div className="w-0.5 h-full bg-white/20"></div>
              </div>

              {/* LEVEL 2: Flagship Subsidiary & Allied Divisions (2x3 cluster) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                
                {/* SUBSIDIARY 1: PSIS (K-12 Flagship) */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveNode('psis')}
                  className={`p-4 rounded-xl border transition-all text-left flex flex-col justify-between relative cursor-pointer ${
                    activeNode === 'psis'
                      ? 'bg-blue-900/60 border-blue-400 text-white ring-1 ring-blue-400 shadow-xl'
                      : 'bg-[#0b163a]/80 border-white/5 text-slate-300 hover:border-slate-800'
                  }`}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="text-[9px] uppercase tracking-widest font-bold text-blue-400 font-nav">K-12 Network</span>
                    <GraduationCap size={14} className="text-blue-400" />
                  </div>
                  <h4 className="font-serif font-bold text-xs text-white mt-1.5 uppercase">
                    Paññāsāstra Int'l School (PSIS)
                  </h4>
                  <p className="text-[9px] font-sans text-slate-400 line-clamp-1 mt-1">
                    6 Campuses Network in Cambodia
                  </p>
                </motion.button>

                {/* DIVISION 2: PUC-IFL Programs */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveNode('puc')}
                  className={`p-4 rounded-xl border transition-all text-left flex flex-col justify-between relative cursor-pointer ${
                    activeNode === 'puc'
                      ? 'bg-emerald-950/60 border-emerald-400 text-white ring-1 ring-emerald-400 shadow-xl'
                      : 'bg-[#0b163a]/80 border-white/5 text-slate-300 hover:border-slate-800'
                  }`}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="text-[9px] uppercase tracking-widest font-bold text-emerald-400 font-nav">English Institute</span>
                    <Award size={14} className="text-emerald-400" />
                  </div>
                  <h4 className="font-serif font-bold text-xs text-white mt-1.5 uppercase">
                    PUC-IFL Language System
                  </h4>
                  <p className="text-[9px] font-sans text-slate-400 line-clamp-1 mt-1">
                    TOEFL & IELTS Prep Frameworks
                  </p>
                </motion.button>

                {/* DIVISION 3: Digital Learning Suite */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveNode('digital')}
                  className={`p-4 rounded-xl border transition-all text-left flex flex-col justify-between relative cursor-pointer ${
                    activeNode === 'digital'
                      ? 'bg-purple-950/60 border-purple-400 text-white ring-1 ring-purple-400 shadow-xl'
                      : 'bg-[#0b163a]/80 border-white/5 text-slate-300 hover:border-slate-800'
                  }`}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="text-[9px] uppercase tracking-widest font-bold text-purple-400 font-nav">EdTech Suite</span>
                    <Layers size={14} className="text-purple-400" />
                  </div>
                  <h4 className="font-serif font-bold text-xs text-white mt-1.5 uppercase">
                    Digital Learning Programs
                  </h4>
                  <p className="text-[9px] font-sans text-slate-400 line-clamp-1 mt-1">
                    ELIF, KooBits, Raz Kids, Monkey
                  </p>
                </motion.button>

                {/* DIVISION 4: STEM & Robotics */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveNode('stem')}
                  className={`p-4 rounded-xl border transition-all text-left flex flex-col justify-between relative cursor-pointer ${
                    activeNode === 'stem'
                      ? 'bg-[#403010]/50 border-brand-gold text-white ring-1 ring-brand-gold shadow-xl'
                      : 'bg-[#0b163a]/80 border-white/5 text-slate-300 hover:border-slate-800'
                  }`}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="text-[9px] uppercase tracking-widest font-bold text-brand-gold font-nav">Robotics-AI Lab</span>
                    <Cpu size={14} className="text-brand-gold" />
                  </div>
                  <h4 className="font-serif font-bold text-xs text-white mt-1.5 uppercase">
                    STEM & Robotics Division
                  </h4>
                  <p className="text-[9px] font-sans text-slate-400 line-clamp-1 mt-1">
                    Smart World, Drones & KUBO Robot
                  </p>
                </motion.button>

              </div>

              {/* LEVEL 3: Future Education Programs Section node */}
              <div className="h-4 flex items-center justify-center">
                <div className="w-0.5 h-full bg-white/20"></div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveNode('future')}
                className={`w-full max-w-sm p-4 rounded-xl border transition-all text-center flex flex-col items-center cursor-pointer ${
                  activeNode === 'future'
                    ? 'bg-rose-950/60 border-rose-400 text-white ring-1 ring-rose-400 shadow-xl'
                    : 'bg-[#0b163a]/80 border-white/5 text-slate-300 hover:border-slate-800'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Rocket className="w-4 h-4 text-rose-400" />
                  <span className="font-nav font-bold text-[10px] uppercase tracking-widest">
                    Future Education Programs (FEP)
                  </span>
                </div>
                <p className="text-[9px] text-slate-400 font-sans mt-0.5">
                  AI, blockchain and early global partnerships
                </p>
              </motion.button>

            </div>
          </div>

          {/* Core Division Inspector Desk Right (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            
            {/* Division Card Display */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeNode}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="bg-slate-900 border border-white/10 rounded-2xl p-6 md:p-8 space-y-6 flex flex-col justify-between h-full shadow-2xl relative"
              >
                {/* Giant watermark icon */}
                <div className="absolute top-4 right-4 opacity-5 pointer-events-none scale-150">
                  {activeData.icon}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3.5">
                    <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                      {activeData.icon}
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-[#E6B83E] font-bold font-nav block">
                        {activeData.role}
                      </span>
                      <h3 className="font-serif font-bold text-lg md:text-xl text-white tracking-tight leading-snug">
                        {activeData.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs md:text-[13px] text-slate-300 leading-relaxed font-sans font-light">
                    {activeData.desc}
                  </p>

                  <div className="w-12 h-px bg-white/10"></div>

                  {/* Mandate description */}
                  <div className="space-y-2">
                    <span className="text-[9px] font-bold text-[#E6B83E] font-nav uppercase tracking-widest block flex items-center">
                      <ShieldCheck size={11} className="mr-1.5 shrink-0" />
                      {t.mandate}
                    </span>
                    <p className="text-xs text-white leading-relaxed font-sans font-medium">
                      {activeData.mandator}
                    </p>
                  </div>

                  {/* Synergistic Tools listed */}
                  <div className="space-y-2 pt-2">
                    <span className="text-[9px] font-bold text-slate-400 font-nav uppercase tracking-widest block flex items-center">
                      <Layers size={11} className="mr-1.5 shrink-0" />
                      {t.ecosystem}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeData.ecosystems.split(', ').map((tech, idx) => (
                        <span key={idx} className="bg-white/5 border border-white/10 px-2.5 py-1 rounded text-[10px] font-mono text-slate-200">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex justify-end">
                  <span className="text-[9px] uppercase font-bold text-brand-gold font-nav flex items-center gap-1">
                    <span>Part of the Australia Young Leaders Academy Suite</span>
                    <ArrowRight size={11} />
                  </span>
                </div>

              </motion.div>
            </AnimatePresence>

          </div>

        </div>

        {/* Corporate Directors Registry Board */}
        <div id="board-gov" className="mt-16 pt-16 border-t border-white/10">
          <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
            <h3 className="font-serif font-bold text-xl md:text-2xl text-white tracking-tight">
              {t.governanceBoard}
            </h3>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              {t.boardSub}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            
            {/* Director 1 */}
            <div className="bg-slate-900/40 p-5 rounded-2xl border border-white/5 flex flex-col justify-between text-center space-y-4">
              <div className="space-y-2">
                <div className="w-16 h-16 rounded-full bg-brand-gold/15 flex items-center justify-center text-brand-gold mx-auto font-black text-lg">CS</div>
                <h4 className="font-serif font-bold text-sm text-white tracking-tight leading-snug">{t.dir1Name}</h4>
                <p className="text-[10px] text-[#E6B83E] uppercase font-nav font-bold tracking-wider">{t.dir1Role}</p>
              </div>
              <p className="text-[11px] text-slate-400 font-sans leading-relaxed italic">
                {lang === 'en' 
                  ? 'Fostering compliance with Ministry rules and safeguarding academic integrity.'
                  : 'ធានានូវការអនុលោមតាមលក្ខខណ្ឌក្រសួង និងការពារសញ្ញាបត្រសិក្សា។'}
              </p>
            </div>

            {/* Director 2 */}
            <div className="bg-slate-900/40 p-5 rounded-2xl border border-white/5 flex flex-col justify-between text-center space-y-4">
              <div className="space-y-2">
                <div className="w-16 h-16 rounded-full bg-brand-gold/15 flex items-center justify-center text-brand-gold mx-auto font-black text-lg">LS</div>
                <h4 className="font-serif font-bold text-sm text-white tracking-tight leading-snug">{t.dir2Name}</h4>
                <p className="text-[10px] text-[#E6B83E] uppercase font-nav font-bold tracking-wider">{t.dir2Role}</p>
              </div>
              <p className="text-[11px] text-slate-400 font-sans leading-relaxed italic">
                {lang === 'en'
                  ? 'Managing head-office digital assets and international university partnerships.'
                  : 'ដឹកនាំការសម្របសម្រួលប្រព័ន្ធឌីជីថល និងដៃគូកម្រិតសាកលវិទ្យាល័យ។'}
              </p>
            </div>

            {/* Director 3 */}
            <div className="bg-slate-900/40 p-5 rounded-2xl border border-white/5 flex flex-col justify-between text-center space-y-4">
              <div className="space-y-2">
                <div className="w-16 h-16 rounded-full bg-brand-gold/15 flex items-center justify-center text-brand-gold mx-auto font-black text-lg">JL</div>
                <h4 className="font-serif font-bold text-sm text-white tracking-tight leading-snug">{t.dir3Name}</h4>
                <p className="text-[10px] text-[#E6B83E] uppercase font-nav font-bold tracking-wider">{t.dir3Role}</p>
              </div>
              <p className="text-[11px] text-slate-400 font-sans leading-relaxed italic">
                {lang === 'en'
                  ? 'Implementing aero-robot technology standards and Singapore math frameworks.'
                  : 'ជំរុញការតម្រឹមកម្មវិធីសិក្សាគណិតវិទ្យាសិង្ហបុរី និងដ្រូនបច្ចេកវិទ្យា។'}
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
