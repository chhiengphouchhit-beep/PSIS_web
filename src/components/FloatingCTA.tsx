import { MessageCircle, CalendarCheck, PenLine, Send } from 'lucide-react';

interface Props {
  lang: 'en' | 'kh';
  setCurrentSection: (s: string) => void;
}

export default function FloatingCTA({ lang, setCurrentSection }: Props) {
  const handleItemClick = (type: string, section?: string) => {
    if (type === 'telegram') {
      window.open('https://t.me/psis_official', '_blank', 'noopener,noreferrer');
    } else if (section) {
      setCurrentSection(section);
      const el = document.getElementById(section);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="fixed bottom-16 sm:bottom-5 right-4 sm:right-5 z-40 flex flex-col gap-2.5 items-end">
      {/* Direct Telegram Chat Button */}
      <button
        onClick={() => handleItemClick('telegram')}
        className="group flex items-center justify-end gap-2.5 rounded-full bg-[#229ED9] text-white shadow-xl hover:bg-[#1e8bc2] transition-all duration-300 pl-3.5 pr-2.5 py-2.5 hover:shadow-cyan-500/25 hover:-translate-y-0.5 cursor-pointer border border-white/20"
        title="Chat on Telegram"
      >
        <span className="max-w-0 overflow-hidden whitespace-nowrap text-xs font-nav font-bold tracking-wider transition-all duration-300 group-hover:max-w-[130px] opacity-0 group-hover:opacity-100">
          {lang === 'en' ? 'Telegram Chat' : 'ឆាតតាម Telegram'}
        </span>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#229ED9] shadow-inner">
          <Send size={15} className="translate-x-[1px]" />
        </span>
      </button>

      {/* Book a Tour Button */}
      <button
        onClick={() => handleItemClick('section', 'apply-now')}
        className="group hidden sm:flex items-center justify-end gap-2.5 rounded-full bg-brand-dark text-white shadow-xl hover:bg-brand-blue transition-all duration-300 pl-3.5 pr-2.5 py-2.5 cursor-pointer border border-white/10"
      >
        <span className="max-w-0 overflow-hidden whitespace-nowrap text-xs font-nav font-bold tracking-wider transition-all duration-300 group-hover:max-w-[130px] opacity-0 group-hover:opacity-100">
          {lang === 'en' ? 'Book a Tour' : 'កក់ទស្សនកិច្ច'}
        </span>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-gold text-brand-dark">
          <CalendarCheck size={16} />
        </span>
      </button>

      {/* Apply Now Button */}
      <button
        onClick={() => handleItemClick('section', 'apply-now')}
        className="group flex items-center justify-end gap-2.5 rounded-full bg-[#C5A059] text-[#051445] shadow-xl hover:bg-amber-400 transition-all duration-300 pl-3.5 pr-2.5 py-2.5 cursor-pointer border border-white/30 font-bold"
      >
        <span className="max-w-0 overflow-hidden whitespace-nowrap text-xs font-nav font-bold tracking-wider transition-all duration-300 group-hover:max-w-[130px] opacity-0 group-hover:opacity-100">
          {lang === 'en' ? 'Apply Now' : 'ចុះឈ្មោះឥឡូវនេះ'}
        </span>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#051445] text-[#C5A059]">
          <PenLine size={16} />
        </span>
      </button>
    </div>
  );
}
