import { motion } from 'motion/react';
import { Quote, Star } from 'lucide-react';

interface Props { lang: 'en' | 'kh'; }

const quotes = [
  { name: 'Parent of Primary Student', campus: 'TK Campus', text: 'PSIS gives our child confidence in English, technology, and communication.' },
  { name: 'High School Student', campus: 'RSK Campus', text: 'The learning environment feels international and helps me prepare for university.' },
  { name: 'PUC-IFL Learner', campus: 'CAP Campus', text: 'The English program helps me improve speaking confidence and exam readiness.' }
];

export default function TestimonialsSection({ lang }: Props) {
  return (
    <section className="py-24 bg-[#fafbfc] border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <span className="text-[10px] font-nav font-bold uppercase tracking-[0.24em] text-brand-gold bg-brand-gold/10 px-4 py-2 rounded-full">
            {lang === 'en' ? 'Parent & Student Voice' : 'មតិមាតាបិតា និងសិស្ស'}
          </span>
          <h2 className="font-serif font-bold text-3xl md:text-5xl text-brand-blue leading-tight tracking-tight">
            {lang === 'en' ? 'Trust is built through real stories.' : 'ទំនុកចិត្តកើតឡើងតាមរយៈរឿងពិត។'}
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            {lang === 'en' ? 'Replace these demo testimonials with real parent and student stories from each campus.' : 'សូមជំនួសមតិគំរូទាំងនេះដោយមតិពិតពីមាតាបិតា និងសិស្សតាមសាខា។'}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quotes.map((q, i) => (
            <motion.article
              key={q.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-3xl p-7 border border-slate-100 shadow-xl shadow-slate-200/50"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex gap-1 text-brand-gold">{Array.from({ length: 5 }).map((_, idx) => <Star key={idx} size={14} fill="currentColor" />)}</div>
                <Quote size={28} className="text-brand-blue/15" />
              </div>
              <p className="text-sm leading-relaxed text-slate-600 font-sans">“{q.text}”</p>
              <div className="mt-6 pt-5 border-t border-slate-100">
                <h4 className="font-nav font-bold text-brand-blue text-sm">{q.name}</h4>
                <p className="text-[11px] text-brand-gold font-bold uppercase tracking-wider mt-1">{q.campus}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
