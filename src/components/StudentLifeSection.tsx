import { motion } from 'motion/react';
import { Camera, Music, Trophy, Microscope, Plane, Users } from 'lucide-react';

interface Props {
  lang: 'en' | 'kh';
  assets?: { id: string; title: string; url: string }[];
  isLoading?: boolean;
}

const moments = [
  { title: 'Robotics Lab', kh: 'ថ្នាក់រ៉ូបូត', icon: Microscope, image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=900&q=80', span: 'lg:col-span-2' },
  { title: 'Student Leadership', kh: 'ភាពជាអ្នកដឹកនាំ', icon: Users, image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=900&q=80', span: '' },
  { title: 'Arts & Music', kh: 'សិល្បៈ និងតន្ត្រី', icon: Music, image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=900&q=80', span: '' },
  { title: 'Sports & Teamwork', kh: 'កីឡា និងក្រុមការងារ', icon: Trophy, image: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=900&q=80', span: 'lg:col-span-2' },
  { title: 'Field Trips', kh: 'ដំណើរទស្សនកិច្ច', icon: Plane, image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80', span: '' },
];

export default function StudentLifeSection({ lang, assets = [], isLoading = false }: Props) {
  const displayMoments = assets.length > 0
    ? assets.map((asset, index) => ({
      title: asset.title,
      kh: asset.title,
      icon: moments[index % moments.length].icon,
      image: asset.url,
      span: moments[index % moments.length].span,
    }))
    : moments;

  return (
    <section className="py-24 bg-white border-t border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end mb-12">
          <div className="lg:col-span-7 space-y-4">
            <span className="inline-flex items-center gap-2 text-[10px] font-nav font-bold uppercase tracking-[0.24em] text-brand-gold bg-brand-gold/10 px-4 py-2 rounded-full">
              <Camera size={14} /> {lang === 'en' ? 'Student Life Experience' : 'ជីវិតសិស្សនៅ PSIS'}
            </span>
            <h2 className="font-serif font-bold text-3xl md:text-5xl text-brand-blue leading-tight tracking-tight">
              {lang === 'en' ? 'Learning should feel alive, confident and memorable.' : 'ការសិក្សាគួរតែមានភាពរស់រវើក ទំនុកចិត្ត និងចងចាំបាន។'}
            </h2>
          </div>
          <p className="lg:col-span-5 text-sm md:text-base leading-relaxed text-slate-600 font-sans">
            {lang === 'en'
              ? 'Use this section to replace generic template visuals with real PSIS photography: classrooms, student activities, science, robotics, field trips, graduation and sports.'
              : 'ផ្នែកនេះសម្រាប់ដាក់រូបភាពពិតរបស់ PSIS ដូចជា ថ្នាក់រៀន សកម្មភាពសិស្ស វិទ្យាសាស្ត្រ រ៉ូបូត ទស្សនកិច្ច បញ្ចប់ការសិក្សា និងកីឡា។'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-[260px]">
          {isLoading ? Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="animate-pulse rounded-[2rem] bg-slate-100" />
          )) : displayMoments.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
                className={`group relative overflow-hidden rounded-[2rem] border border-white/20 shadow-2xl ${item.span}`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                  onError={(event) => {
                    event.currentTarget.src = moments[index % moments.length].image;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand-dark/25 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-brand-gold">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-serif font-bold text-2xl tracking-tight">{lang === 'en' ? item.title : item.kh}</h3>
                  <p className="mt-2 text-xs text-[#E8EEFF] font-sans leading-relaxed max-w-sm">
                    {lang === 'en' ? 'Real campus moments help parents feel the school culture before they visit.' : 'រូបភាពសកម្មភាពពិតជួយឱ្យមាតាបិតាស្គាល់វប្បធម៌សាលាមុនពេលមកទស្សនា។'}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
