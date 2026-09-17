/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Phone, Send, UserCheck } from 'lucide-react';

interface MobileActionBarProps {
  lang: 'en' | 'kh';
  onApplyClick?: () => void;
}

export default function MobileActionBar({ lang, onApplyClick }: MobileActionBarProps) {
  const handleApply = () => {
    if (onApplyClick) {
      onApplyClick();
      return;
    }
    const form = document.getElementById('apply-now');
    if (form) {
      form.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <aside aria-label={lang === 'en' ? 'Quick Contact' : 'ទាក់ទងបន្ទាន់'} className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#07133C]/95 backdrop-blur-xl border-t border-white/10 shadow-[0_-8px_30px_rgba(0,0,0,0.35)] px-3 py-2.5">
      <div className="max-w-md mx-auto flex items-center justify-between gap-2">
        {/* Call Hotline */}
        <a
          href="tel:+85523884991"
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white transition text-center border border-white/10"
        >
          <Phone size={14} className="text-brand-gold shrink-0" />
          <span className="text-[11px] font-bold font-nav tracking-wide whitespace-nowrap">
            {lang === 'en' ? 'Call Now' : 'ខលសួរ'}
          </span>
        </a>

        {/* Telegram Hotline */}
        <a
          href="https://t.me/psisinternational"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-[#229ED9]/20 hover:bg-[#229ED9]/30 active:scale-95 text-[#229ED9] transition text-center border border-[#229ED9]/30"
        >
          <Send size={14} className="shrink-0" />
          <span className="text-[11px] font-bold font-nav tracking-wide whitespace-nowrap text-white">
            Telegram
          </span>
        </a>

        {/* Enroll / Apply Button */}
        <button
          onClick={handleApply}
          className="flex-[1.4] flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-brand-gold hover:bg-amber-400 active:scale-95 text-brand-dark transition text-center font-black shadow-md cursor-pointer"
        >
          <UserCheck size={15} className="shrink-0" />
          <span className="text-[11px] uppercase font-nav tracking-wider whitespace-nowrap">
            {lang === 'en' ? 'Apply Now' : 'ចុះឈ្មោះរៀន'}
          </span>
        </button>
      </div>
    </aside>
  );
}
