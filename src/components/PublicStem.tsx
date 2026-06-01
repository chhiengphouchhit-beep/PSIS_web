/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { STEM_RESOURCES } from '../mockData';

interface PublicStemProps {
  lang: 'en' | 'kh';
  resourceImages?: Record<string, string>;
}

export default function PublicStem({ lang, resourceImages = {} }: PublicStemProps) {
  return (
    <section id="stem" className="py-28 bg-[#fafbfc] border-b border-slate-100 scroll-mt-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <span className="inline-block bg-brand-blue/5 text-brand-blue font-sans font-medium text-[10px] tracking-widest uppercase px-3.5 py-1.5 rounded-full border border-brand-blue/10">
            {lang === 'en' ? 'Pioneering STEM & Autonomous Systems' : 'ជំនាញ STEM និង បច្ចេកវិទ្យារ៉ូបូត'}
          </span>
          <h2 className="font-serif font-bold text-3xl md:text-[45px] text-brand-dark tracking-tight leading-tight">
            {lang === 'en' ? 'Smart World Robotics & AI Lab' : 'រៀបចំកូនៗលោកអ្នកដើម្បីក្លាយជាអ្នកបច្ចេកវិទ្យាជំនាន់ក្រោយ'}
          </h2>
          <div className="w-16 h-0.5 bg-brand-gold mx-auto rounded"></div>
          <p className="text-xs md:text-sm text-slate-500 font-sans leading-relaxed">
            {lang === 'en'
              ? 'Our exclusive Smart World Robotics program merges physical engineering with logical thinking. Pupils construct active environmental sensors, coordinate autonomous aero-drones, and draft custom coding parameters.'
              : 'កម្មវិធីសិក្សារ៉ូបូត Smart World របស់យើងផ្តល់ការពិសោធន៍ផ្ទាល់ដៃ។ សិស្សានុសិស្សសរសេរកូដបញ្ជាដ្រូនអាកាសចរណ៍ បង្កើតឧបករណ៍សេនសឺស្ទង់កម្រិតបរិស្ថាន និងកូដមីក្រូកុងត្រូល័រ។'}
          </p>
        </div>

        {/* Futuristic Grid showcasing tech kits */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {STEM_RESOURCES.map((kit) => (
              <div
                key={kit.id}
                className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden hover:shadow-2xl transition duration-300 grid grid-cols-1 md:grid-cols-12 relative group"
              >
                {/* Microchip line design overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_50%_-10%,rgba(17,43,140,0.15),transparent_100%)]"></div>

                {/* Left Side: Graphic Box */}
                <div className="md:col-span-5 h-60 md:h-full relative overflow-hidden bg-slate-900 shrink-0">
                  <img
                    src={resourceImages[kit.id] || kit.image}
                    alt={kit.name}
                    className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition duration-500 select-none"
                    referrerPolicy="no-referrer"
                    onError={(event) => {
                      event.currentTarget.src = kit.image;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent md:hidden"></div>
                  
                  {/* Floating kit tag */}
                  <span className="absolute bottom-4 left-4 text-[#07133C] bg-brand-gold font-bold text-[9px] tracking-wider uppercase font-sans px-2.5 py-1 rounded md:hidden">
                    {kit.type}
                  </span>
                </div>

                {/* Right Side: Detailed specs */}
                <div className="md:col-span-7 p-6 md:p-8 space-y-6 flex flex-col justify-between relative z-10 text-white">
                  <div className="space-y-3">
                    <div className="hidden md:flex items-center space-x-2">
                      <span className="bg-brand-blue/30 text-white font-sans font-bold text-[9px] uppercase px-2.5 py-1 rounded border border-white/5 tracking-wider">
                        {kit.type}
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-base md:text-lg text-brand-gold tracking-tight leading-tight">
                      {kit.name}
                    </h3>
                    
                    <p className="text-xs text-slate-300 leading-relaxed font-sans font-light">
                      {kit.description}
                    </p>
                  </div>

                  {/* Skills tags list */}
                  <div className="border-t border-slate-800 pt-4.5 space-y-2.5">
                    <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest pl-0.5 block font-sans">
                      {lang === 'en' ? 'Core Capabilities Developed' : 'ជំនាញដែលអាចទទួលបាន៖'}
                    </span>
                    
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {kit.skillsAcquired.map((skill, si) => (
                        <span key={si} className="bg-slate-900 border border-slate-800 text-slate-300 text-[9px] uppercase tracking-wide font-bold px-2.5 py-1 rounded-md">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
          ))}
        </div>

        {/* Global Tech Stats Banner */}
        <div className="mt-16 bg-gradient-to-r from-brand-dark to-[#091b5a] text-white rounded-3xl p-8 md:p-12 border border-white/5 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-84 h-84 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center items-center relative z-10 font-sans">
            <div className="space-y-1">
              <div className="text-4xl font-black text-brand-gold font-sans leading-none">NO. 1</div>
              <p className="text-[10px] uppercase font-semibold tracking-widest text-slate-300 mt-1">
                {lang === 'en' ? 'High Tech Robotic Lab in TK' : 'បន្ទប់ពិសោធន៍បច្ចេកវិទ្យាលំដាប់ទី១'}
              </p>
            </div>
            
            <div className="space-y-1 md:border-x md:border-white/10 py-2">
              <div className="text-4xl font-black text-brand-gold font-sans leading-none">PYTHON</div>
              <p className="text-[10px] uppercase font-semibold tracking-widest text-slate-300 mt-1">
                {lang === 'en' ? 'UAV Flight Automation Coding' : 'ការរៀបចំយកស្តង់ដារមហាវិទ្យាល័យ'}
              </p>
            </div>

            <div className="space-y-1">
              <div className="text-4xl font-black text-brand-gold font-sans leading-none">MoEYS</div>
              <p className="text-[10px] uppercase font-semibold tracking-widest text-slate-300 mt-1">
                {lang === 'en' ? 'Approved Engineering Curriculum' : 'កម្មវិធីសិក្សារ៉ូបូតទទួលស្គាល់ផ្លូវការ'}
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
