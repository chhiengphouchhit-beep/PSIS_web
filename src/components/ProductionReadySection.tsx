/**
 * Added by ChatGPT: production-readiness roadmap and missing-feature checklist.
 */
import { motion } from 'motion/react';
import { Database, Bell, SearchCheck, UploadCloud, Globe2, ShieldCheck, Server, BarChart3 } from 'lucide-react';

interface Props { lang: 'en' | 'kh'; }

const items = [
  { icon: UploadCloud, title: 'Image CMS', desc: 'Hero, campus gallery, partner logo and news image upload UI.' },
  { icon: Database, title: 'Supabase Backend', desc: 'Database, real admin authentication and online content storage.' },
  { icon: Bell, title: 'Lead Notification', desc: 'Send inquiry alerts to email, Telegram, Google Sheet or CRM.' },
  { icon: SearchCheck, title: 'SEO Pack', desc: 'Meta tags, Open Graph, sitemap.xml and robots.txt for launch.' },
  { icon: Globe2, title: 'Bilingual Content', desc: 'Full English and Khmer content consistency across the site.' },
  { icon: ShieldCheck, title: 'Security Roles', desc: 'Super Admin, Marketing, Admissions and Campus Admin permissions.' },
  { icon: Server, title: 'Deployment', desc: 'Vercel hosting, domain, SSL, backup and environment variables.' },
  { icon: BarChart3, title: 'Analytics', desc: 'GA4, Meta Pixel and lead conversion tracking.' },
];

export default function ProductionReadySection({ lang }: Props) {
  return (
    <section className="py-20 bg-[#071B5C] text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-4 space-y-5">
            <span className="inline-block bg-brand-gold text-brand-dark font-nav font-bold text-[10px] tracking-widest uppercase px-3.5 py-1.5 rounded-full">
              {lang === 'en' ? 'Launch Readiness' : 'ត្រៀមដាក់ប្រើផ្លូវការ'}
            </span>
            <h2 className="font-serif font-bold text-3xl md:text-5xl leading-tight tracking-tight">
              {lang === 'en' ? 'What remains before official launch?' : 'អ្វីនៅខ្វះ មុនដាក់ប្រើផ្លូវការ?'}
            </h2>
            <p className="text-sm leading-relaxed text-[#DDE6FF]">
              {lang === 'en'
                ? 'This website is now suitable for management demo. The next phase is connecting real data, upload tools, analytics and deployment.'
                : 'Website នេះអាចប្រើសម្រាប់ demo ជូនថ្នាក់ដឹកនាំបានហើយ។ ជំហានបន្ទាប់គឺភ្ជាប់ទិន្នន័យពិត ប្រព័ន្ធ upload រូបភាព analytics និង deployment។'}
            </p>
            <div className="rounded-2xl bg-white/10 border border-white/10 p-5">
              <div className="text-[10px] uppercase tracking-widest text-brand-gold font-bold">Production readiness estimate</div>
              <div className="mt-3 h-3 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-brand-gold rounded-full" style={{ width: '68%' }} />
              </div>
              <div className="mt-3 text-3xl font-black text-brand-gold">68%</div>
              <p className="text-xs text-blue-100 mt-1">Demo ready, not yet full production.</p>
            </div>
          </div>
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {items.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.03 }}
                  className="rounded-2xl bg-white/[0.08] border border-white/[0.12] p-5 hover:bg-white/[0.12] transition"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-gold/15 text-brand-gold flex items-center justify-center shrink-0"><Icon size={19} /></div>
                    <div>
                      <h3 className="font-nav font-bold text-sm uppercase tracking-wide">{item.title}</h3>
                      <p className="text-xs text-[#DDE6FF] leading-relaxed mt-1">{item.desc}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
