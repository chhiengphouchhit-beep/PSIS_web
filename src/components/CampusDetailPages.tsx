/**
 * Added by ChatGPT: rich campus detail previews for launch demo.
 */
import { motion } from 'motion/react';
import { MapPin, Phone, Users, CheckCircle2, ImagePlus } from 'lucide-react';
import { Campus } from '../types';

interface Props {
  campuses: Campus[];
  lang: 'en' | 'kh';
}

export default function CampusDetailPages({ campuses, lang }: Props) {
  return (
    <section className="py-20 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="max-w-3xl mb-12 space-y-4">
          <span className="inline-block bg-brand-gold/10 text-brand-dark font-nav font-bold text-[10px] tracking-widest uppercase px-3.5 py-1.5 rounded-full">
            {lang === 'en' ? 'Campus Detail Page Structure' : 'រចនាសម្ព័ន្ធទំព័រសាខា'}
          </span>
          <h2 className="font-serif font-bold text-3xl md:text-5xl text-brand-blue tracking-tight leading-tight">
            {lang === 'en' ? 'Every campus gets a dedicated conversion page.' : 'សាខានីមួយៗមានទំព័រព័ត៌មានផ្ទាល់ខ្លួន។'}
          </h2>
          <p className="text-sm md:text-base text-slate-600 leading-relaxed font-sans">
            {lang === 'en'
              ? 'Each page is ready for overview, principal message, facilities, contact, map, gallery, and “Apply to this Campus” CTA.'
              : 'ទំព័រនីមួយៗអាចបង្ហាញព័ត៌មានទូទៅ សារនាយកសាខា សម្ភារៈសិក្សា ទំនាក់ទំនង ផែនទី រូបភាព និងប៊ូតុងចុះឈ្មោះ។'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {campuses.map((campus, index) => (
            <motion.article
              key={campus.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.04 }}
              className="bg-[#fbfbf9] border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition"
            >
              <div className="grid grid-cols-1 sm:grid-cols-5 min-h-[260px]">
                <div className="sm:col-span-2 relative overflow-hidden bg-brand-blue">
                  <img src={campus.image} alt={campus.name} className="w-full h-full min-h-[220px] object-cover opacity-80 hover:scale-105 transition duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="text-[10px] uppercase tracking-widest font-bold text-brand-gold">{campus.code}</div>
                    <div className="font-serif text-2xl font-bold">{campus.name}</div>
                  </div>
                </div>
                <div className="sm:col-span-3 p-6 space-y-4">
                  <div>
                    <h3 className="font-serif font-bold text-2xl text-brand-blue">{campus.name || ''}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed mt-2">{campus.message || ''}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-[11px] font-sans">
                    <div className="rounded-xl bg-white p-3 border border-slate-100 flex items-center gap-2"><Users size={15} className="text-brand-gold" /> {(campus.studentsCount !== undefined ? campus.studentsCount : 0)}+ students</div>
                    <div className="rounded-xl bg-white p-3 border border-slate-100 flex items-center gap-2"><ImagePlus size={15} className="text-brand-gold" /> Gallery ready</div>
                    <div className="rounded-xl bg-white p-3 border border-slate-100 flex items-center gap-2 col-span-2"><MapPin size={15} className="text-brand-gold" /> {campus.location || ''}</div>
                    <div className="rounded-xl bg-white p-3 border border-slate-100 flex items-center gap-2 col-span-2"><Phone size={15} className="text-brand-gold" /> {campus.contact || ''}</div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(campus.facilities || []).slice(0, 3).map((facility) => (
                      <span key={facility} className="inline-flex items-center gap-1 bg-brand-blue/5 text-brand-blue rounded-full px-3 py-1 text-[10px] font-bold">
                        <CheckCircle2 size={12} /> {facility}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
