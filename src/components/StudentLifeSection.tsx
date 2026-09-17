import { motion } from 'motion/react';
import { Camera, Music, Trophy, Microscope, Plane, Users } from 'lucide-react';

interface Props {
  lang: 'en' | 'kh';
  assets?: { id: string; title: string; url: string }[];
  isLoading?: boolean;
  onImageClick?: (item: { url: string; title: string; tag?: string }, index: number) => void;
}

const moments = [
  {
    id: 'robotics',
    title: 'Robotics Lab',
    kh: 'ថ្នាក់រ៉ូបូត & STEM',
    descEn: 'Interactive KUBO coding and smart robotics fostering algorithmic thinking and hands-on innovation.',
    descKh: 'ការបណ្ដុះបណ្ដាលសរសេរកូដមនុស្សយន្ត KUBO បង្កើនការគិតបែបស៊ីជម្រៅ និងភាពច្នៃប្រឌិត។',
    icon: Microscope,
    image: '/images/student-life/robotics.jpg',
    span: 'lg:col-span-2'
  },
  {
    id: 'leadership',
    title: 'Student Leadership',
    kh: 'ភាពជាអ្នកដឹកនាំ',
    descEn: 'Public speaking, debate competitions, and confidence building for tomorrow’s leaders.',
    descKh: 'ការនិយាយជាសាធារណៈ ការប្រកួតជជែកដេញដោល និងការកសាងទំនុកចិត្តជាអ្នកដឹកនាំ។',
    icon: Users,
    image: '/images/student-life/leadership.jpg',
    span: ''
  },
  {
    id: 'arts',
    title: 'Arts & Culture',
    kh: 'សិល្បៈ និងវប្បធម៌',
    descEn: 'Cultural heritage celebrations, traditional music, and creative artistic expression.',
    descKh: 'ការអបអរសាទរវប្បធម៌ប្រពៃណី និងការបញ្ចេញទេពកោសល្យសិល្បៈច្នៃប្រឌិត។',
    icon: Music,
    image: '/images/student-life/arts.jpg',
    span: ''
  },
  {
    id: 'sports',
    title: 'Sports & Teamwork',
    kh: 'កីឡា និងក្រុមការងារ',
    descEn: 'Martial arts discipline, Taekwondo mastery, physical agility, and sportsmanship.',
    descKh: 'វិន័យក្បាច់គុនតេក្វាន់ដូ សុខភាពរាងកាយរឹងមាំ និងស្មារតីសាមគ្គីភាពជាក្រុម។',
    icon: Trophy,
    image: '/images/student-life/sports.jpg',
    span: 'lg:col-span-2'
  },
  {
    id: 'field-trips',
    title: 'Field Trips',
    kh: 'ដំណើរទស្សនកិច្ច',
    descEn: 'Experiential learning excursions, nature discovery, and memorable outdoor exploration.',
    descKh: 'ការសិក្សាស្វែងយល់ជាក់ស្តែង ការទស្សនកិច្ចកម្សាន្ត និងអនុស្សាវរីយ៍ល្អៗក្រៅថ្នាក់រៀន។',
    icon: Plane,
    image: '/images/student-life/field-trip.jpg',
    span: 'md:col-span-2 lg:col-span-3'
  },
];

export default function StudentLifeSection({ lang, assets = [], isLoading = false }: Props) {
  // Use curated moments, with optional image override if matching asset is healthy
  const displayMoments = moments.map((moment) => {
    const matchingAsset = assets.find(
      (a) => a.title && (a.title.toLowerCase().includes(moment.id) || a.title.toLowerCase().includes(moment.title.toLowerCase()))
    );
    return {
      ...moment,
      image: matchingAsset?.url || moment.image,
    };
  });

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
              ? 'Real PSIS photography showcasing classrooms, STEM robotics, student leadership, cultural arts, sports discipline, and outdoor excursions.'
              : 'រូបភាពសកម្មភាពពិតរបស់សិស្ស PSIS ដូចជា ថ្នាក់រ៉ូបូត STEM ភាពជាអ្នកដឹកនាំ សិល្បៈវប្បធម៌ កីឡាតេក្វាន់ដូ និងដំណើរទស្សនកិច្ចសិក្សា។'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-[270px]">
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
                className={`group relative overflow-hidden rounded-[2rem] border border-white/20 shadow-2xl ${item.span} cursor-pointer`}
                onClick={() => onImageClick?.({
                  url: item.image,
                  title: lang === 'en' ? item.title : item.kh,
                  tag: lang === 'en' ? 'Student Life' : 'ជីវិតសិស្ស'
                }, index)}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                  onError={(event) => {
                    event.currentTarget.src = moments[index].image;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/95 via-brand-dark/35 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-brand-gold">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-serif font-bold text-2xl tracking-tight">{lang === 'en' ? item.title : item.kh}</h3>
                  <p className="mt-2 text-xs text-[#E8EEFF] font-sans leading-relaxed max-w-lg">
                    {lang === 'en' ? item.descEn : item.descKh}
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
