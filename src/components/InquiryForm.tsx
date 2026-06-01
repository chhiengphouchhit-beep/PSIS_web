/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { getPersistedLeads, savePersistedLeads, INITIAL_CAMPUSES } from '../mockData';
import { Lead } from '../types';
import { CheckCircle, ShieldCheck, GraduationCap, ChevronRight, Sparkles } from 'lucide-react';

interface InquiryFormProps {
  lang: 'en' | 'kh';
  onLeadAdded?: () => void;
}

export default function InquiryForm({ lang, onLeadAdded }: InquiryFormProps) {
  // Step tracker
  const [step, setStep] = useState(1);
  const [parentName, setParentName] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentAge, setStudentAge] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [campus, setCampus] = useState('Toul Kork Campus (TK)');
  const [program, setProgram] = useState('Singapore Primary School');
  const [notes, setNotes] = useState('');
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [assignedConsultant, setAssignedConsultant] = useState('');

  // Form options
  const programs = [
    'Bilingual & International Preschool',
    'Singapore-aligned Primary School',
    'Rigorous Secondary School',
    'Premium High School & PUC Prep',
    'PUC-IFL General English (GEP)',
    'PUC-IFL English for Kids (EFK)',
    'PUC-IFL IELTS Certificate prep'
  ];

  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!parentName.trim()) errs.parentName = lang === 'en' ? 'Parent/Guardian name is required' : 'សូមបញ្ជាក់ឈ្មោះអាណាព្យាបាល';
    if (!studentName.trim()) errs.studentName = lang === 'en' ? 'Student name is required' : 'សូមបញ្ជាក់ឈ្មោះសិស្ស';
    if (!studentAge.trim()) errs.studentAge = lang === 'en' ? 'Age is required' : 'សូមបញ្ជាក់អាយុសិស្ស';
    if (!phone.trim()) errs.phone = lang === 'en' ? 'Phone number is required' : 'សូមបញ្ជាក់លេខទូរស័ព្ទ';
    if (!email.trim() || !email.includes('@')) errs.email = lang === 'en' ? 'Valid email required' : 'សូមបញ្ជាក់អ៊ីមែលត្រឹមត្រូវ';
    
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validateStep1()) return;

    // Create unique ID
    const leads = getPersistedLeads();
    const newId = `L-${String(leads.length + 1).padStart(3, '0')}`;
    
    // Choose standard mock campus advisors
    const advisors = ['Sok Mesa', 'Chen Sreymom', 'Visal Chan', 'Dr. Chhim Sokheng'];
    const chosenAdvisor = advisors[Math.floor(Math.random() * advisors.length)];
    setAssignedConsultant(chosenAdvisor);

    const newLead: Lead = {
      id: newId,
      parentName,
      studentName,
      studentAge,
      phone,
      email,
      campus,
      program,
      status: 'New',
      notes: notes || 'Enquired online through landing page.',
      createdAt: new Date().toISOString(),
      source: 'Website Form',
      assignedAdmin: chosenAdvisor
    };

    const updated = [newLead, ...leads];
    savePersistedLeads(updated);
    
    setStep(3);
    if (onLeadAdded) {
      onLeadAdded();
    }
  };

  const handleReset = () => {
    setParentName('');
    setStudentName('');
    setStudentAge('');
    setPhone('');
    setEmail('');
    setNotes('');
    setCampus('Toul Kork Campus (TK)');
    setProgram('Singapore Primary School');
    setStep(1);
    setErrors({});
  };

  return (
    <div id="apply-now" className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 max-w-xl mx-auto">
      {/* Accent Header panel */}
      <div className="bg-brand-blue text-white px-6 py-6 font-nav relative overflow-hidden">
        {/* Abstract vector backgrounds */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-2xl"></div>
        <div className="relative z-10 flex items-center space-x-3">
          <GraduationCap className="text-brand-gold w-8 h-8" />
          <div>
            <h3 className="font-extrabold text-base md:text-lg tracking-wide uppercase">
              {lang === 'en' ? 'Admission Inquiry System' : 'ប្រព័ន្ធសាកសួរព័ត៌មានចុះឈ្មោះ'}
            </h3>
            <p className="text-xs text-brand-gold font-sans font-medium mt-0.5">
              {lang === 'en' ? '6 Campuses • Fast Response Priority' : 'សាខាទាំង៦ • ឆ្លើយតបរហ័ស'}
            </p>
          </div>
        </div>
      </div>

      {/* Progress indicators */}
      <div className="px-8 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between text-[11px] font-sans font-semibold text-gray-500">
        <div className="flex items-center space-x-2">
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${step >= 1 ? 'bg-brand-blue text-white' : 'bg-gray-200'}`}>1</span>
          <span className={step >= 1 ? 'text-brand-blue font-bold' : ''}>{lang === 'en' ? 'Guardian Info' : 'ព័ត៌មានអាណាព្យាបាល'}</span>
        </div>
        <ChevronRight size={14} className="text-gray-300" />
        <div className="flex items-center space-x-2">
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${step >= 2 ? 'bg-brand-blue text-white' : 'bg-gray-200'}`}>2</span>
          <span className={step >= 2 ? 'text-brand-blue font-bold' : ''}>{lang === 'en' ? 'Program & Core' : 'កម្មវិធីសិក្សា'}</span>
        </div>
        <ChevronRight size={14} className="text-gray-300" />
        <div className="flex items-center space-x-2">
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${step >= 3 ? 'bg-brand-blue text-white' : 'bg-gray-200'}`}>3</span>
          <span className={step >= 3 ? 'text-brand-blue font-bold' : ''}>{lang === 'en' ? 'Receipt' : 'ជោគជ័យ'}</span>
        </div>
      </div>

      <div className="p-8">
        {step === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <p className="text-xs text-gray-500 mb-2 leading-relaxed">
              {lang === 'en' 
                ? 'Please supply your correct contact parameters. Our dedicated Admission Admins will follow up within 12 standard operating hours.'
                : 'សូមផ្តល់ព័ត៌មានទំនាក់ទំនងឱ្យបានត្រឹមត្រូវ។ ផ្នែករដ្ឋបាលចុះឈ្មោះរបស់យើងនឹងទាក់ទងមកអ្នកវិញក្នុងរយៈពេល ១២ម៉ោង។'}
            </p>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                {lang === 'en' ? 'Parent / Guardian Full Name *' : 'ឈ្មោះពេញអាណាព្យាបាល *'}
              </label>
              <input
                type="text"
                placeholder={lang === 'en' ? 'e.g. Sok Mean' : 'ឧ. សុខ មែន'}
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                className={`w-full px-3 py-2 text-sm rounded bg-gray-50 border ${errors.parentName ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-brand-blue'} focus:outline-none focus:bg-white text-gray-800`}
              />
              {errors.parentName && <span className="text-[10px] text-red-500 mt-1 block">{errors.parentName}</span>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  {lang === 'en' ? 'Student Full Name *' : 'ឈ្មោះពេញសិស្ស *'}
                </label>
                <input
                  type="text"
                  placeholder={lang === 'en' ? 'e.g. Sok Piseth' : 'ឧ. សុខ ពិសិដ្ឋ'}
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className={`w-full px-3 py-2 text-sm rounded bg-gray-50 border ${errors.studentName ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-brand-blue'} focus:outline-none focus:bg-white text-gray-800`}
                />
                {errors.studentName && <span className="text-[10px] text-red-500 mt-1 block">{errors.studentName}</span>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  {lang === 'en' ? 'Student Age *' : 'អាយុសិស្ស *'}
                </label>
                <input
                  type="number"
                  placeholder="e.g. 7"
                  value={studentAge}
                  onChange={(e) => setStudentAge(e.target.value)}
                  className={`w-full px-3 py-2 text-sm rounded bg-gray-50 border ${errors.studentAge ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-brand-blue'} focus:outline-none focus:bg-white text-gray-800`}
                />
                {errors.studentAge && <span className="text-[10px] text-red-500 mt-1 block">{errors.studentAge}</span>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  {lang === 'en' ? 'Mobile Phone Phone *' : 'លេខទូរស័ព្ទ *'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. 012 345 678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`w-full px-3 py-2 text-sm rounded bg-gray-50 border ${errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-brand-blue'} focus:outline-none focus:bg-white text-gray-800 font-mono`}
                />
                {errors.phone && <span className="text-[10px] text-red-500 mt-1 block">{errors.phone}</span>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  {lang === 'en' ? 'Email Address *' : 'អាសយដ្ឋានអ៊ីមែល *'}
                </label>
                <input
                  type="email"
                  placeholder="e.g. parent@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-3 py-2 text-sm rounded bg-gray-50 border ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-brand-blue'} focus:outline-none focus:bg-white text-gray-800`}
                />
                {errors.email && <span className="text-[10px] text-red-500 mt-1 block">{errors.email}</span>}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (validateStep1()) {
                  setStep(2);
                }
              }}
              className="w-full bg-brand-blue hover:bg-brand-dark text-white font-sans font-bold text-xs uppercase tracking-wider py-3 rounded shadow transition-all duration-150 flex items-center justify-center space-x-2 mt-6 cursor-pointer"
            >
              <span>{lang === 'en' ? 'Proceed to Academic Preferences' : 'បន្តទៅកម្មវិធីសិក្សា និងសាខា'}</span>
              <ChevronRight size={14} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                {lang === 'en' ? 'Target School Campus *' : 'ជ្រើសរើសសាខាដែលចង់សិក្សា *'}
              </label>
              <select
                value={campus}
                onChange={(e) => setCampus(e.target.value)}
                className="w-full px-3 py-2.5 text-sm rounded bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:border-brand-blue focus:bg-white"
              >
                {INITIAL_CAMPUSES.map((c) => (
                  <option key={c.id} value={`${c.name}`}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                {lang === 'en' ? 'Academic Program Interest *' : 'ជ្រើសរើសកម្មវិធីសិក្សា *'}
              </label>
              <select
                value={program}
                onChange={(e) => setProgram(e.target.value)}
                className="w-full px-3 py-2.5 text-sm rounded bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:border-brand-blue focus:bg-white"
              >
                {programs.map((p, idx) => (
                  <option key={idx} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                {lang === 'en' ? 'Additional Notes / Message (Optional)' : 'សំណួរ ឬសារបន្ថែម (មិនតម្រូវ)'}
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder={lang === 'en' ? 'Special requirements, learning needs or weekend priority...' : 'លក្ខខណ្ឌពិសេស តម្រូវការសិក្សាផ្សេងៗ...'}
                className="w-full px-3 py-2 text-sm rounded bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:border-brand-blue focus:bg-white"
              />
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-sans font-bold text-xs uppercase tracking-wider py-3 rounded transition-all duration-150 cursor-pointer"
              >
                {lang === 'en' ? 'Back' : 'ត្រឡប់ក្រោយ'}
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="w-2/3 bg-brand-gold hover:bg-yellow-500 text-brand-dark font-sans font-extrabold text-xs uppercase tracking-widest py-3 rounded shadow transition-all duration-150 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Sparkles size={14} />
                <span>{lang === 'en' ? 'Submit Secure Profile' : 'បញ្ជូនព័ត៌មានដែលបំពេញ'}</span>
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-6 space-y-6 animate-scaleUp">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto text-emerald-500">
              <CheckCircle size={42} className="stroke-[2.5]" />
            </div>
            
            <div className="space-y-2">
              <h4 className="font-serif font-bold text-xl text-brand-dark tracking-tight leading-tight">
                {lang === 'en' ? 'Inquiry Logged Successfully' : 'បានបញ្ជូនដោយជោគជ័យ'}
              </h4>
              <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                {lang === 'en' 
                  ? 'Your student file has been registered. It has been synced directly into our local multi-campus CRM dashboard.'
                  : 'ព័ត៌មានរបស់អ្នកត្រូវបានកត់ត្រទុកក្នុងប្រព័ន្ធ។ ទិន្នន័យនេះត្រូវបានភ្ជាប់ផ្ទាល់ទៅកាន់ប្រព័ន្ធគ្រប់គ្រងសាលា (CMS Dashboard)។'}
              </p>
            </div>

            {/* Simulated Case Assignment Box */}
            <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200/50 max-w-md mx-auto text-left">
              <span className="inline-block bg-yellow-500/10 text-yellow-800 font-bold text-[9px] uppercase px-2 py-0.5 rounded mb-2">
                {lang === 'en' ? 'Assigned Campus Counselor' : 'ទីប្រឹក្សាអប់រំដែលចាត់តាំង'}
              </span>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold text-sm">
                  {assignedConsultant.split(' ').map(n=>n[0]).join('')}
                </div>
                <div>
                  <h5 className="text-xs font-bold text-gray-800">{assignedConsultant}</h5>
                  <p className="text-[10px] text-gray-500 font-mono">
                    {campus} • {lang === 'en' ? 'Lead Status: New' : 'ស្ថានភាពទិន្នន័យ៖ ថ្មី'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center space-x-3 font-sans pt-2">
              <button
                onClick={handleReset}
                className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs uppercase tracking-wider font-bold rounded-md transition cursor-pointer"
              >
                {lang === 'en' ? 'Submit Another Lead' : 'ចុះឈ្មោះសិស្សម្នាក់ទៀត'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Security credentials badge Footer */}
      <div className="bg-gray-50 px-8 py-3.5 border-t border-gray-100 text-[10px] text-gray-400 font-sans flex items-center justify-between">
        <span className="flex items-center">
          <ShieldCheck size={11} className="mr-1 text-emerald-500" />
          {lang === 'en' ? 'SSL Secured Encrypted Tunnel' : 'តំណភ្ជាប់សុវត្ថិភាពខ្ពស់ SSL'}
        </span>
        <span>PE-256 MoEYS Certified</span>
      </div>
    </div>
  );
}
