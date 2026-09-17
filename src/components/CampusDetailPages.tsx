/**
 * PSIS Campus Detail & Facilities Showcase
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
          <span className="inline-block bg-brand-gold/10 text-brand-dark font-nav font-bold text-[10px] tracking-widest uppercase px-3.5 py-1.5 rounded-full border border-brand-gold/20">
            {lang === 'en' ? 'Campus Profiles & Facilities' : 'ព័ត៌មានលម្អិតសាខា និងបរិក្ខារសិក្សា'}
          </span>
          <h2 className="font-serif font-bold text-3xl md:text-5xl text-brand-blue tracking-tight leading-tight">
            {lang === 'en' ? 'Discover Our Campuses & Facilities' : 'ស្វែងយល់ពីទីតាំង និងបរិក្ខារសិក្សានៃសាខានីមួយៗ'}
          </h2>
          <div className="w-16 h-0.5 bg-brand-gold rounded"></div>
          <p className="text-sm md:text-base text-slate-600 leading-relaxed font-sans">
            {lang === 'en'
              ? 'Explore modern classrooms, science labs, sport domes, and direct admissions contact details for all 6 PSIS campuses.'
              : 'ស្វែងយល់ពីបន្ទប់រៀនទំនើប បន្ទប់ពិសោធន៍វិទ្យាសាស្ត្រ ទីលានកីឡា និងលេខទូរស័ព្ទទំនាក់ទំនងការិយាល័យចុះឈ្មោះនៃសាខាទាំង ៦ របស់ PSIS។'}
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
                  <img
                    src={campus.image}
                    alt={campus.name}
                    className="w-full h-full min-h-[220px] object-cover opacity-80 hover:scale-105 transition duration-500"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const fallback = `/images/campuses/${campus.id}.jpg`;
                      if (e.currentTarget.src !== fallback) {
                        e.currentTarget.src = fallback;
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-brand-gold">{campus.code}</span>
                      {campus.isComingSoon && (
                        <span className="text-[8px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-amber-400 text-slate-950">
                          {lang === 'en' ? 'Coming Soon' : 'ឆាប់ៗនេះ'}
                        </span>
                      )}
                    </div>
                    <div className="font-serif text-2xl font-bold">{campus.name}</div>
                  </div>
                </div>
                <div className="sm:col-span-3 p-6 space-y-4">
                  <div>
                    <h3 className="font-serif font-bold text-2xl text-brand-blue">{campus.name}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed mt-2">{campus.message}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-[11px] font-sans">
                    <div className="rounded-xl bg-white p-3 border border-slate-100 flex items-center gap-2"><Users size={15} className="text-brand-gold" /> {campus.studentsCount}+ students</div>
                    <div className="rounded-xl bg-white p-3 border border-slate-100 flex items-center gap-2"><ImagePlus size={15} className="text-brand-gold" /> Gallery ready</div>
                    <div className="rounded-xl bg-white p-3 border border-slate-100 flex items-center gap-2 col-span-2"><MapPin size={15} className="text-brand-gold" /> {campus.location}</div>
                    <div className="rounded-xl bg-white p-3 border border-slate-100 flex items-center gap-2 col-span-2"><Phone size={15} className="text-brand-gold" /> {campus.contact}</div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {campus.facilities.slice(0, 3).map((facility) => (
                      <span key={facility} className="inline-flex items-center gap-1 bg-brand-blue/5 text-brand-blue rounded-full px-3 py-1 text-[10px] font-bold">
                        <CheckCircle2 size={12} /> {facility}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-100">
                    <a
                      href={campus.facebookUrl || "https://www.facebook.com/psisTKTTPNR3Campus/"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-[#1877F2]/10 hover:bg-[#1877F2] text-[#1877F2] hover:text-white text-xs font-bold px-3.5 py-2 rounded-xl transition shadow-sm"
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      <span>{lang === 'en' ? `${campus.code} Facebook` : `Facebook សាខា ${campus.code}`}</span>
                    </a>

                    <a
                      href={`tel:${campus.contact.split('|')[1]?.trim() || campus.contact}`}
                      className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-brand-blue font-bold transition"
                    >
                      <Phone size={13} className="text-brand-gold" />
                      <span>{lang === 'en' ? 'Direct Call' : 'ទាក់ទងផ្ទាល់'}</span>
                    </a>
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
