import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Bot, CheckCircle2, MessageCircle, Send, User, X } from 'lucide-react';
import { getPersistedLeads, savePersistedLeads } from '../mockData';
import { saveAdmissionAssistantLead } from '../services/googleSheet';
import { Lead } from '../types';

type AssistantLanguage = 'en' | 'kh';
type LeadField = 'name' | 'phone' | 'question';
type Message = {
  id: string;
  role: 'assistant' | 'user';
  text: string;
};

const quickReplies = {
  en: ['Admissions', 'Tuition Fees', 'Programs', 'Campuses', 'Contact', 'Calendar'],
  kh: ['ចុះឈ្មោះ', 'តម្លៃសិក្សា', 'កម្មវិធីសិក្សា', 'សាខា', 'ទំនាក់ទំនង', 'ប្រតិទិនសិក្សា'],
};

const copy = {
  en: {
    greeting: 'Hello, I am the PSIS Admission Assistant. How can I help you today?',
    placeholder: 'Ask about admissions, tuition, campuses...',
    fallback: 'I want to make sure an admission officer answers this correctly. May I take your name?',
    askPhone: 'Thank you. What phone number should our admissions team call?',
    askQuestion: 'Please type your question so our admission officer can follow up clearly.',
    done: 'An admission officer will contact you shortly.',
    typing: 'PSIS Assistant is typing',
    title: 'PSIS Admission Assistant',
    subtitle: 'Khmer and English support',
    open: 'Open admission chat',
    close: 'Close admission chat',
  },
  kh: {
    greeting: 'សួស្តី ខ្ញុំជាជំនួយការចុះឈ្មោះរបស់ PSIS។ តើខ្ញុំអាចជួយអ្វីបានខ្លះ?',
    placeholder: 'សួរអំពីការចុះឈ្មោះ តម្លៃសិក្សា ឬសាខា...',
    fallback: 'ខ្ញុំចង់ឱ្យមន្ត្រីចុះឈ្មោះឆ្លើយសំណួរនេះឱ្យបានត្រឹមត្រូវ។ សូមប្រាប់ឈ្មោះរបស់អ្នក។',
    askPhone: 'សូមអរគុណ។ តើលេខទូរស័ព្ទណាដែលក្រុមការងារយើងគួរទាក់ទង?',
    askQuestion: 'សូមសរសេរសំណួររបស់អ្នក ដើម្បីឱ្យមន្ត្រីចុះឈ្មោះអាចតាមដានបានច្បាស់។',
    done: 'មន្ត្រីចុះឈ្មោះនឹងទាក់ទងអ្នកក្នុងពេលឆាប់ៗនេះ។',
    typing: 'ជំនួយការ PSIS កំពុងវាយ',
    title: 'ជំនួយការចុះឈ្មោះ PSIS',
    subtitle: 'គាំទ្រភាសាខ្មែរ និងអង់គ្លេស',
    open: 'បើកប្រអប់ជជែកចុះឈ្មោះ',
    close: 'បិទប្រអប់ជជែកចុះឈ្មោះ',
  },
};

const answers: Record<AssistantLanguage, Array<{ keys: string[]; text: string }>> = {
  en: [
    {
      keys: ['admission', 'admissions', 'apply', 'enroll', 'registration'],
      text: 'Admissions are open for the 2026-2027 academic year. Families can submit an inquiry, choose a preferred campus, schedule a campus tour, and complete a student assessment before enrollment confirmation.',
    },
    {
      keys: ['tuition', 'fee', 'fees', 'price', 'cost', 'discount'],
      text: 'Tuition depends on grade level, program, and campus. PSIS offers admissions consultation for tuition packages, early-bird incentives, and installment options. Please share your child grade and preferred campus for an exact quote.',
    },
    {
      keys: ['program', 'programs', 'preschool', 'primary', 'secondary', 'high school', 'puc', 'stem', 'english'],
      text: 'PSIS offers bilingual and international preschool, Singapore-aligned primary, secondary school, high school and PUC preparation, PUC-IFL English pathways, digital learning, and STEM robotics programs.',
    },
    {
      keys: ['campus', 'campuses', 'location', 'tk', 'ttp', 'chbar', 'russey', 'battambang', 'national road'],
      text: 'PSIS has 6 campuses: Toul Kork, Toul Tom Poung, Chbar Ampov, Russey Keo, National Road 3, and Battambang. Each campus offers admissions support, campus tours, and program guidance.',
    },
    {
      keys: ['contact', 'phone', 'email', 'hotline', 'address'],
      text: 'You can contact Central Admissions at +855 23 884 991 or +855 12 555 999. Email: admission@psis.edu.kh or tk.info@psis.edu.kh. Main office: Street 315, Toul Kork, Phnom Penh.',
    },
    {
      keys: ['calendar', 'term', 'semester', 'holiday', 'schedule', 'school year'],
      text: 'The academic year information and school calendar are shared by the admissions office. For term dates, holidays, and assessment schedules, please leave your phone number and our team will confirm the latest calendar.',
    },
  ],
  kh: [
    {
      keys: ['ចុះឈ្មោះ', 'ដាក់ពាក្យ', 'ចូលរៀន', 'admission', 'apply'],
      text: 'ការចុះឈ្មោះសម្រាប់ឆ្នាំសិក្សា 2026-2027 កំពុងបើកទទួល។ មាតាបិតាអាចផ្ញើសំណើ ជ្រើសរើសសាខា កំណត់ពេលទស្សនាសាលា និងធ្វើតេស្តវាយតម្លៃសិស្ស មុនបញ្ជាក់ការចូលរៀន។',
    },
    {
      keys: ['តម្លៃ', 'ថ្លៃ', 'tuition', 'fee', 'បង់រំលស់'],
      text: 'តម្លៃសិក្សាអាស្រ័យលើកម្រិតថ្នាក់ កម្មវិធីសិក្សា និងសាខា។ PSIS មានការប្រឹក្សាអំពីកញ្ចប់តម្លៃ ការបញ្ចុះតម្លៃ និងជម្រើសបង់រំលស់។',
    },
    {
      keys: ['កម្មវិធី', 'program', 'ថ្នាក់', 'បឋម', 'អនុវិទ្យាល័យ', 'វិទ្យាល័យ', 'stem'],
      text: 'PSIS មានថ្នាក់មត្តេយ្យទ្វេភាសា និងអន្តរជាតិ បឋមសិក្សាតាមស្តង់ដារសិង្ហបុរី អនុវិទ្យាល័យ វិទ្យាល័យ ការត្រៀម PUC កម្មវិធីភាសាអង់គ្លេស PUC-IFL ការសិក្សាឌីជីថល និង STEM Robotics។',
    },
    {
      keys: ['សាខា', 'ទីតាំង', 'campus', 'tk', 'ttp', 'ច្បារអំពៅ', 'ឫស្សីកែវ', 'បាត់ដំបង'],
      text: 'PSIS មាន 6 សាខា៖ ទួលគោក ទួលទំពូង ច្បារអំពៅ ឫស្សីកែវ ផ្លូវជាតិលេខ 3 និងបាត់ដំបង។ សាខានីមួយៗមានក្រុមការងារចុះឈ្មោះ និងទស្សនកិច្ចសាលា។',
    },
    {
      keys: ['ទាក់ទង', 'ទូរស័ព្ទ', 'អ៊ីមែល', 'contact', 'phone'],
      text: 'ទំនាក់ទំនងការិយាល័យចុះឈ្មោះកណ្តាល៖ +855 23 884 991 ឬ +855 12 555 999។ អ៊ីមែល៖ admission@psis.edu.kh ឬ tk.info@psis.edu.kh។',
    },
    {
      keys: ['ប្រតិទិន', 'calendar', 'ថ្ងៃឈប់', 'កាលវិភាគ'],
      text: 'ប្រតិទិនសិក្សា និងកាលវិភាគថ្មីៗត្រូវបានបញ្ជាក់ដោយការិយាល័យចុះឈ្មោះ។ សូមទុកលេខទូរស័ព្ទ ដើម្បីឱ្យក្រុមការងារបញ្ជាក់ព័ត៌មានចុងក្រោយ។',
    },
  ],
};

function makeMessage(role: Message['role'], text: string): Message {
  return { id: `${role}-${Date.now()}-${Math.random().toString(16).slice(2)}`, role, text };
}

function getAnswer(message: string, language: AssistantLanguage) {
  const normalized = message.toLowerCase();
  return answers[language].find((entry) => entry.keys.some((key) => normalized.includes(key.toLowerCase())))?.text;
}

export default function AdmissionAssistant({ onLeadSaved }: { onLeadSaved?: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<AssistantLanguage>('en');
  const [messages, setMessages] = useState<Message[]>([makeMessage('assistant', copy.en.greeting)]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [leadField, setLeadField] = useState<LeadField | null>(null);
  const [leadDraft, setLeadDraft] = useState({ name: '', phone: '', question: '' });
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeCopy = copy[language];
  const chips = useMemo(() => quickReplies[language], [language]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping, isOpen]);

  function addAssistantMessage(text: string) {
    setIsTyping(true);
    window.setTimeout(() => {
      setMessages((current) => [...current, makeMessage('assistant', text)]);
      setIsTyping(false);
    }, 550);
  }

  function changeLanguage(nextLanguage: AssistantLanguage) {
    setLanguage(nextLanguage);
    setMessages((current) => [...current, makeMessage('assistant', copy[nextLanguage].greeting)]);
  }

  async function saveLead(finalDraft: typeof leadDraft) {
    const createdAt = new Date().toISOString();
    const lead: Lead = {
      id: `AI-${Date.now()}`,
      parentName: finalDraft.name,
      studentName: 'Not provided',
      studentAge: '',
      phone: finalDraft.phone,
      email: '',
      campus: 'Website AI Assistant',
      program: 'Admissions Inquiry',
      status: 'New',
      notes: finalDraft.question,
      createdAt,
      source: 'AI Admission Assistant',
    };

    savePersistedLeads([lead, ...getPersistedLeads()]);
    onLeadSaved?.();

    try {
      await saveAdmissionAssistantLead({
        name: finalDraft.name,
        phone: finalDraft.phone,
        question: finalDraft.question,
        language,
        createdAt,
      });
    } catch {
      // Local Admin CMS lead is already saved; Google Sheet availability depends on Apps Script deployment.
    }
  }

  function startLeadCapture(question: string) {
    setLeadDraft({ name: '', phone: '', question });
    setLeadField('name');
    addAssistantMessage(activeCopy.fallback);
  }

  async function handleLeadReply(value: string) {
    if (leadField === 'name') {
      setLeadDraft((current) => ({ ...current, name: value }));
      setLeadField('phone');
      addAssistantMessage(activeCopy.askPhone);
      return;
    }

    if (leadField === 'phone') {
      const nextDraft = { ...leadDraft, phone: value };
      setLeadDraft(nextDraft);
      if (nextDraft.question) {
        await saveLead(nextDraft);
        setLeadField(null);
        setLeadDraft({ name: '', phone: '', question: '' });
        addAssistantMessage(activeCopy.done);
      } else {
        setLeadField('question');
        addAssistantMessage(activeCopy.askQuestion);
      }
      return;
    }

    if (leadField === 'question') {
      const nextDraft = { ...leadDraft, question: value };
      await saveLead(nextDraft);
      setLeadField(null);
      setLeadDraft({ name: '', phone: '', question: '' });
      addAssistantMessage(activeCopy.done);
    }
  }

  async function handleUserMessage(rawMessage: string) {
    const text = rawMessage.trim();
    if (!text) return;

    setMessages((current) => [...current, makeMessage('user', text)]);
    setInput('');

    if (leadField) {
      await handleLeadReply(text);
      return;
    }

    const answer = getAnswer(text, language);
    if (answer) {
      addAssistantMessage(answer);
      return;
    }

    startLeadCapture(text);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    handleUserMessage(input);
  }

  return (
    <div className="fixed bottom-4 right-4 z-[90] font-sans sm:bottom-6 md:left-6 md:right-auto">
      {isOpen && (
        <div className="mb-4 flex h-[min(680px,calc(100vh-7rem))] w-[calc(100vw-2rem)] max-w-[420px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          <div className="bg-[#071B5C] p-4 text-white">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-gold text-[#071B5C]">
                  <Bot size={20} />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold">{activeCopy.title}</h2>
                  <p className="text-[11px] text-[#DDE6FF]">{activeCopy.subtitle}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
                aria-label={activeCopy.close}
              >
                <X size={16} />
              </button>
            </div>
            <div className="mt-4 flex rounded-full bg-white/10 p-1 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => changeLanguage('en')}
                className={`flex-1 rounded-full px-3 py-1.5 transition ${language === 'en' ? 'bg-white text-[#071B5C]' : 'text-white/80'}`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => changeLanguage('kh')}
                className={`flex-1 rounded-full px-3 py-1.5 transition ${language === 'kh' ? 'bg-white text-[#071B5C]' : 'text-white/80'}`}
              >
                Khmer
              </button>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto bg-slate-50 p-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {message.role === 'assistant' && (
                  <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#071B5C] text-white">
                    <Bot size={14} />
                  </div>
                )}
                <div
                  className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                    message.role === 'user'
                      ? 'bg-[#071B5C] text-white'
                      : 'border border-slate-200 bg-white text-slate-700 shadow-sm'
                  }`}
                >
                  {message.text}
                </div>
                {message.role === 'user' && (
                  <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-gold text-[#071B5C]">
                    <User size={14} />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#071B5C] text-white">
                  <Bot size={14} />
                </div>
                <span>{activeCopy.typing}</span>
                <span className="flex gap-1">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-gold" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-gold [animation-delay:120ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-gold [animation-delay:240ms]" />
                </span>
              </div>
            )}
          </div>

          <div className="border-t border-slate-200 bg-white p-4">
            <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
              {chips.map((reply) => (
                <button
                  key={reply}
                  type="button"
                  onClick={() => handleUserMessage(reply)}
                  className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-bold text-[#071B5C] transition hover:border-brand-gold hover:bg-brand-gold/10"
                >
                  {reply}
                </button>
              ))}
            </div>
            <form onSubmit={handleSubmit} className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 focus-within:border-brand-gold">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                className="min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                placeholder={activeCopy.placeholder}
              />
              <button type="submit" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-gold text-[#071B5C] transition hover:bg-amber-400">
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex h-15 w-15 items-center justify-center rounded-full bg-[#071B5C] text-white shadow-2xl ring-4 ring-brand-gold/20 transition hover:-translate-y-0.5 hover:bg-[#112B8C]"
        aria-label={activeCopy.open}
      >
        {isOpen ? <CheckCircle2 size={26} /> : <MessageCircle size={26} />}
      </button>
    </div>
  );
}
