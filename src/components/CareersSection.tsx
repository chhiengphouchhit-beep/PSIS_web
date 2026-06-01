/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Send } from 'lucide-react';

export default function CareersSection({ lang }: { lang: 'en' | 'kh' }) {
  return (
    <section id="careers" className="py-20 bg-white border-t border-gray-100 scroll-mt-12 relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Career Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="inline-block bg-brand-gold/15 text-brand-dark font-sans font-medium text-[10px] tracking-widest uppercase px-3 py-1 rounded-full">
            {lang === 'en' ? 'Join Our Premium Academic Team' : 'ចូលរួមជាមួយក្រុមការងារឆ្នើមរបស់យើង'}
          </span>
          <h2 className="font-serif font-bold text-3xl md:text-4.5xl text-brand-dark tracking-tight leading-tight">
            {lang === 'en' ? 'Build the Leaders of Tomorrow' : 'កសាងអ្នកដឹកនាំនាពេលអនាគត'}
          </h2>
          <div className="w-16 h-0.5 bg-[#112B8C] mx-auto rounded"></div>
          <p className="text-xs text-gray-500 font-sans max-w-xl mx-auto leading-relaxed">
            {lang === 'en'
              ? 'Paññāsāstra International School provides a highly professional environment, advanced technology classrooms, continuous Cambridge teacher-trainings, and generous financial benefits.'
              : 'សាលាអន្តរជាតិ បញ្ញាសាស្ត្រ ផ្តល់នូវបរិយាកាសការងារប្រកបដោយវិជ្ជាជីវៈខ្ពស់ ឧបករណ៍បច្ចេកវិទ្យាទំនើបៗ និងប្រាក់បៀវត្សដ៏សមរម្យ។'}
          </p>
        </div>

        {/* Benefits Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200/50 space-y-2">
            <h4 className="font-serif font-bold text-sm text-brand-blue tracking-tight">
              {lang === 'en' ? 'Advanced Class Tech' : 'បច្ចេកវិទ្យាថ្នាក់រៀនទំនើប'}
            </h4>
            <p className="text-[11px] text-gray-600 leading-relaxed font-sans">
              All classrooms are embedded with Newline interactive displays, robotics assets (KUBO, Smart World kits), and synchronized digital app interfaces.
            </p>
          </div>
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200/50 space-y-2">
            <h4 className="font-serif font-bold text-sm text-brand-blue tracking-tight">
              {lang === 'en' ? 'Global Accreditations' : 'ការទទួលស្គាល់កម្រិតអន្តរជាតិ'}
            </h4>
            <p className="text-[11px] text-gray-600 leading-relaxed font-sans">
              We coordinate directly with British Council and PUC-IFL Language Institute to provide official qualification credentials and continuous workshops.
            </p>
          </div>
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200/50 space-y-2">
            <h4 className="font-serif font-bold text-sm text-brand-blue tracking-tight">
              {lang === 'en' ? 'Growth & Mentorship' : 'ឱកាសលូតលាស់ និងការណែនាំ'}
            </h4>
            <p className="text-[11px] text-gray-600 leading-relaxed font-sans">
              Experience dynamic promotion paths from classroom teachers to senior curriculum planners, subject heads, or school campus directors.
            </p>
          </div>
        </div>

        {/* Career Positions Board with "All Roles Filled" notice */}
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 md:p-8">
          <h3 className="font-sans font-extrabold text-xs text-gray-500 uppercase tracking-widest mb-4">
            {lang === 'en' ? 'Current Active Vacancies' : 'ឱកាសការងារកំពុងជ្រើសរើស'}
          </h3>

          <div className="bg-white p-8 rounded-xl border border-gray-200/50 text-center space-y-3 animate-fadeIn">
            <span className="inline-block bg-slate-100 text-slate-600 font-sans font-bold text-[9px] uppercase px-2.5 py-1 rounded">
              {lang === 'en' ? 'All Roles Filled' : 'គ្រប់តំណែងត្រូវបានបំពេញរួចរាល់'}
            </span>
            <p className="text-xs text-[#475569] leading-relaxed font-sans max-w-lg mx-auto">
              {lang === 'en'
                ? 'Thank you for your interest in joining our academic family! All educator and administrative openings for the active semester are currently filled. However, we are always on the lookout for outstanding talent. You are welcome to submit your curriculum vitae for future opportunities.'
                : 'សូមអរគុណសម្រាប់ចំណាប់អារម្មណ៍របស់អ្នកក្នុងការចូលរួមជាមួយក្រុមគ្រួសារអប់រំរបស់យើង! រាល់តំណែងបង្រៀន និងរដ្ឋបាលសម្រាប់ឆមាសបច្ចុប្បន្នត្រូវបានបំពេញរួចរាល់ហើយ។ ទោះជាយ៉ាងណាក៏ដោយ យើងតែងតែស្វែងរកអ្នកមានសមត្ថភាពខ្ពស់។ លោកអ្នកអាចផ្ញើប្រវត្តិរូបសង្ខេបសម្រាប់ឱកាសពេលក្រោយបាន។'}
            </p>
            <div className="pt-2">
              <a
                href="mailto:admission@psis.edu.kh"
                className="inline-flex items-center text-xs text-brand-blue font-bold font-nav tracking-wider uppercase hover:underline cursor-pointer"
              >
                <span>{lang === 'en' ? 'Email CV to our Recruitment Board' : 'ផ្ញើប្រវត្តិរូបមកកាន់ផ្នែកជ្រើសរើសបុគ្គលិក'}</span>
                <Send size={11} className="ml-1.5" />
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
