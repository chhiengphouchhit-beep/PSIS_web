import { MessageCircle, CalendarCheck, PenLine } from 'lucide-react';

interface Props {
  lang: 'en' | 'kh';
  setCurrentSection: (s: string) => void;
}

export default function FloatingCTA({ lang, setCurrentSection }: Props) {
  const items = [
    { label: lang === 'en' ? 'Apply' : 'ចុះឈ្មោះ', icon: PenLine, section: 'apply-now' },
    { label: lang === 'en' ? 'Tour' : 'ទស្សនា', icon: CalendarCheck, section: 'apply-now' },
    { label: 'Telegram', icon: MessageCircle, section: 'apply-now' },
  ];
  return (
    <div className="fixed bottom-5 right-5 z-40 hidden md:flex flex-col gap-3">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.label}
            onClick={() => setCurrentSection(item.section)}
            className="group flex items-center justify-end gap-3 rounded-full bg-brand-dark text-white shadow-2xl border border-white/10 pl-4 pr-3 py-3 hover:bg-brand-blue transition"
          >
            <span className="max-w-0 overflow-hidden whitespace-nowrap text-xs font-nav font-bold uppercase tracking-wider transition-all duration-300 group-hover:max-w-[120px]">{item.label}</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-gold text-brand-dark"><Icon size={17} /></span>
          </button>
        );
      })}
    </div>
  );
}
