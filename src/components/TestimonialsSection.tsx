import { motion } from 'motion/react';
import { Quote, Star } from 'lucide-react';

interface Props { lang: 'en' | 'kh'; }

const testimonials = [
  {
    name: { en: 'Sok Vicheka', kh: 'សុខ វិច្ឆិកា' },
    role: { en: 'Parent of Grade 5 Student', kh: 'អាណាព្យាបាលសិស្សថ្នាក់ទី ៥' },
    campus: 'TK Campus (ទួលគោក)',
    avatarBg: 'bg-blue-600',
    initial: 'V',
    text: {
      en: 'My son joined PSIS three years ago. The Singapore Math framework and CodeMonkey robotics have dramatically boosted his logical problem-solving. His English pronunciation is natural and confident.',
      kh: 'កូនប្រុសរបស់ខ្ញុំបានចូលរៀននៅ PSIS រយៈពេល ៣ ឆ្នាំហើយ។ កម្មវិធីគណិតវិទ្យាសិង្ហបុរី និងថ្នាក់រ៉ូបូតជួយឱ្យគាត់មានការគិតពិចារណាល្អខ្លាំងណាស់ ហើយការបញ្ចេញសំឡេងភាសាអង់គ្លេសក៏មានទំនុកចិត្ត និងរលូនល្អ។'
    }
  },
  {
    name: { en: 'Heng Sovannara', kh: 'ហេង សុវណ្ណារ៉ា' },
    role: { en: 'Grade 12 Senior & Debate Captain', kh: 'សិស្សថ្នាក់ទី ១២ និងជាប្រធានក្រុមតស៊ូមតិ' },
    campus: 'RSK Campus (ឫស្សីកែវ)',
    avatarBg: 'bg-amber-600',
    initial: 'S',
    text: {
      en: 'The direct pathway to Paññāsāstra University (PUC) and intensive IELTS mock training gave me the exact foundation I needed. The teachers mentor us like family.',
      kh: 'ផ្លូវតភ្ជាប់ផ្ទាល់ទៅកាន់សាកលវិទ្យាល័យបញ្ញាសាស្ត្រ (PUC) និងការហ្វឹកហាត់ប្រឡងតេស្ត IELTS យ៉ាងយកចិត្តទុកដាក់ បានផ្តល់ឱ្យខ្ញុំនូវគ្រឹះដ៏រឹងមាំសម្រាប់ថ្នាក់ឧត្តមសិក្សា។ លោកគ្រូអ្នកគ្រូយកចិត្តទុកដាក់ដូចក្រុមគ្រួសារ។'
    }
  },
  {
    name: { en: 'Keo Rithy & Chanthy', kh: 'កែវ រិទ្ធី និង ចាន់ធី' },
    role: { en: 'Preschool & Primary Parents', kh: 'អាណាព្យាបាលសិស្សមត្តេយ្យ និងបឋម' },
    campus: 'TTP Campus (ទួលទំពូង)',
    avatarBg: 'bg-emerald-600',
    initial: 'R',
    text: {
      en: 'What impressed us most is the warm, child-safe environment and daily health check. Our daughter loves going to school every morning, especially the interactive ELIF English games.',
      kh: 'អ្វីដែលធ្វើឱ្យយើងពេញចិត្តបំផុតគឺបរិយាកាសសុវត្ថិភាពខ្ពស់ និងការពិនិត្យសុខភាពប្រចាំថ្ងៃ។ កូនស្រីរបស់ខ្ញុំស្រឡាញ់សាលាណាស់ នាងតែងតែសប្បាយរីករាយជាមួយកម្មវិធីភាសាអង់គ្លេស ELIF និងការលេងបែបអប់រំ។'
    }
  }
];

export default function TestimonialsSection({ lang }: Props) {
  return (
    <section className="py-24 bg-[#fafbfc] border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-[10px] font-nav font-bold uppercase tracking-[0.24em] text-brand-gold bg-brand-gold/10 px-4 py-2 rounded-full border border-brand-gold/20">
            {lang === 'en' ? 'Parent & Student Voice' : 'មតិមាតាបិតា និងសិស្សានុសិស្ស'}
          </span>
          <h2 className="font-serif font-bold text-3xl md:text-5xl text-brand-blue leading-tight tracking-tight">
            {lang === 'en' ? 'Trust Built on Real Stories' : 'ទំនុកចិត្តកើតចេញពីភាពជោគជ័យជាក់ស្តែង'}
          </h2>
          <div className="w-16 h-0.5 bg-brand-gold mx-auto rounded"></div>
          <p className="text-xs md:text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto font-sans">
            {lang === 'en'
              ? 'Discover genuine experiences from families across our 6 campuses sharing their journey of academic achievement and personal growth.'
              : 'ស្វែងយល់ពីបទពិសោធន៍ពិតប្រាកដរបស់អាណាព្យាបាល និងសិស្សានុសិស្សនៅតាមសាខាទាំង ៦ នៃសាលាអន្តរជាតិ បញ្ញាសាស្ត្រ។'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((q, i) => (
            <motion.article
              key={q.name.en}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="bg-white rounded-3xl p-8 border border-slate-200/70 shadow-lg shadow-slate-200/40 flex flex-col justify-between hover:shadow-xl transition duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex gap-1 text-amber-400">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star key={idx} size={15} fill="currentColor" />
                    ))}
                  </div>
                  <Quote size={28} className="text-brand-blue/15" />
                </div>
                <p className="text-xs md:text-[13px] leading-relaxed text-slate-650 font-sans font-light italic">
                  “{lang === 'kh' ? q.text.kh : q.text.en}”
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center gap-3.5">
                <div className={`w-10 h-10 rounded-full ${q.avatarBg} text-white font-bold font-nav flex items-center justify-center text-sm shadow-md shrink-0`}>
                  {q.initial}
                </div>
                <div className="text-left">
                  <h4 className="font-nav font-bold text-brand-blue text-sm">
                    {lang === 'kh' ? q.name.kh : q.name.en}
                  </h4>
                  <p className="text-[10px] text-slate-500 font-medium">
                    {lang === 'kh' ? q.role.kh : q.role.en}
                  </p>
                  <span className="inline-block text-[9px] text-brand-gold font-bold uppercase tracking-wider mt-0.5">
                    {q.campus}
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
