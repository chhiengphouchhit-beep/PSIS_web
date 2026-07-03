/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Award, BookOpen, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';

interface Question {
  q: string;
  options: string[];
  correct: number;
}

export default function PlacementTest({ lang }: { lang: 'en' | 'kh' }) {
  const [started, setStarted] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  // Questions aligned to standard levels
  const questions: Question[] = [
    {
      q: 'Which of the following sentences has the correct tense structure?',
      options: [
        'He has been studying in PSIS since three years.',
        'He has been studying in PSIS for three years.',
        'He is studying in PSIS since three years.',
        'He was studied in PSIS during three years.'
      ],
      correct: 1
    },
    {
      q: 'Choose the word that best completes the sentence: "The robotics teams breakthrough was _____ than we anticipated."',
      options: [
        'much more impressive',
        'such impressive',
        'most impressive',
        'more impress'
      ],
      correct: 0
    },
    {
      q: 'Identify the synonym for "Excellence" in an academic context.',
      options: [
        'Mediocrity',
        'Distinction',
        'Divergence',
        'Subservience'
      ],
      correct: 1
    },
    {
      q: 'Choose the correct preposition: "The student was admitted _____ Toul Kork Campus after her assessment."',
      options: [
        'at',
        'into',
        'with',
        'on'
      ],
      correct: 1
    },
    {
      q: 'Select the punctuation layout with correct quotation formatting:',
      options: [
        '"Knowledge is power" stated the principal Sokheng.',
        '"Knowledge is power," stated the principal Sokheng.',
        'Knowledge is power, "stated the principal Sokheng."',
        '"Knowledge is power", stated the principal Sokheng.'
      ],
      correct: 1
    }
  ];

  const handleNext = () => {
    if (selectedOpt === null) return;
    
    if (selectedOpt === questions[currentQIndex].correct) {
      setScore(score + 1);
    }

    if (currentQIndex + 1 < questions.length) {
      setCurrentQIndex(currentQIndex + 1);
      setSelectedOpt(null);
    } else {
      setFinished(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQIndex(0);
    setSelectedOpt(null);
    setScore(0);
    setFinished(false);
    setStarted(false);
  };

  const getRecommendation = (points: number) => {
    if (points === 5) {
      return {
        program: 'TOEFL iBT Academic Prep or Elite IELTS Mastery',
        details: 'Splendid! You scored a perfect 100%. We recommend our high-end university prep tracks. You are primed to master IELTS 7.5+ scoring structures.',
        level: 'C1 / Advanced English'
      };
    } else if (points >= 3) {
      return {
        program: 'General English Programme (GEP) - High Intermediate (Level 7-9)',
        details: 'Great command of core grammar rules. Your syntax matches the secondary school GEP structure. Perfect to polish academic debate skills.',
        level: 'B2 / Upper-Intermediate'
      };
    } else if (points >= 1) {
      return {
        program: 'English for Teens (EFT) or GEP Foundations',
        details: 'A moderate baseline. Our interactive classroom routines, Raz Kids integration, and native accent drills will help you build total communicative confidence.',
        level: 'A2-B1 / Pre-Intermediate'
      };
    } else {
      return {
        program: 'English For Kids (EFK) or Foundation language clubs',
        details: 'New to formal grammar tracks? Do not worry! Our visual models and intuitive physical tags are designed to expand kids fluency effortlessly.',
        level: 'A1 / Elementary Foundations'
      };
    }
  };

  const rec = getRecommendation(score);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 md:p-8 max-w-2xl mx-auto">
      {/* Interactive Title */}
      <div className="flex items-start md:items-center justify-between pb-6 border-b border-gray-100 mb-6 gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded bg-[#112B8C]/10 flex items-center justify-center text-brand-blue">
            <BookOpen size={20} />
          </div>
          <div>
            <h4 className="font-serif font-bold text-sm md:text-base text-brand-dark tracking-tight">
              {lang === 'en' ? 'Simulated PUC-IFL Placement Evaluator' : 'ប្រព័ន្ធវាស់ស្ទង់សមត្ថភាពភាសាអង់គ្លេស PUC'}
            </h4>
            <p className="text-[10px] text-gray-500 font-sans">
              {lang === 'en' ? 'Quick 5-Question Immediate Evaluation' : 'វាស់កម្រិតល្បឿនដោយឥតគិតថ្លៃ ចំនួន ៥ សំណួរ'}
            </p>
          </div>
        </div>
        <span className="bg-brand-gold/10 text-brand-dark font-mono font-bold text-[10px] px-2 py-1 rounded">
          {lang === 'en' ? 'Online Free Integration' : 'ឥតគិតថ្លៃ'}
        </span>
      </div>

      {!started && !finished && (
        <div className="text-center py-6 space-y-4">
          <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
            {lang === 'en'
              ? 'Evaluate your structural comprehension and grammar baseline. Receive instant recommendations calibrated against the official PUC-IFL levels and IELTS standards.'
              : 'សាកល្បងសមត្ថភាពវេយ្យាករណ៍ និងរចនាសម្ព័ន្ធប្រយោគរបស់អ្នក។ ប្រព័ន្ធនឹងផ្តល់លទ្ធផលភ្លាមៗស្របតាមកម្រិតសិក្សាផ្លូវការរបស់ PUC-IFL និងស្តង់ដារ IELTS។'}
          </p>
          <div className="bg-yellow-50 rounded-lg p-3 text-left max-w-md mx-auto flex items-start space-x-2 text-[10px] text-yellow-800 border border-yellow-200">
            <AlertCircle size={14} className="mt-0.5 shrink-0" />
            <span>
              {lang === 'en'
                ? 'Disclaimer: This represents an interactive mock platform. On-campus physical test remains required for official classroom placements.'
                : 'លក្ខខណ្ឌ៖ នេះជាការវាស់ស្ទង់បឋមប៉ុណ្ណោះ។ សិស្សតម្រូវឱ្យមកធ្វើតេស្តផ្ទាល់នៅបរិវេណសាលាសម្រាប់ការចូលរៀនផ្លូវការ។'}
            </span>
          </div>
          <button
            onClick={() => setStarted(true)}
            className="bg-brand-blue hover:bg-brand-dark transition-all text-white font-sans text-xs uppercase tracking-wider font-extrabold px-6 py-3 rounded shadow cursor-pointer mt-2"
          >
            {lang === 'en' ? 'Begin Online Evaluation' : 'ចាប់ផ្តើមធ្វើតេស្តភ្លាមៗ'}
          </button>
        </div>
      )}

      {started && !finished && (
        <div className="space-y-6">
          {/* Question gauge bar */}
          <div className="flex justify-between items-center text-[10px] font-sans text-gray-400">
            <span>{lang === 'en' ? `Question ${currentQIndex + 1} of ${questions.length}` : `សំណួរទី ${currentQIndex + 1} ក្នុងចំណោម ${questions.length}`}</span>
            <span>{Math.round(((currentQIndex) / questions.length) * 100)}% Complete</span>
          </div>
          
          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-brand-gold h-full transition-all duration-300"
              style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-bold text-brand-dark font-sans bg-gray-50 p-4 rounded-lg border border-gray-100">
              {questions[currentQIndex].q}
            </p>

            <div className="space-y-2">
              {questions[currentQIndex].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedOpt(i)}
                  className={`w-full text-left p-3 text-xs rounded border transition-all cursor-pointer ${
                    selectedOpt === i
                      ? 'border-brand-blue bg-brand-blue/5 text-brand-blue font-semibold ring-1 ring-brand-blue/30'
                      : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className={`w-5 h-5 rounded-full border text-[10px] font-bold flex items-center justify-center ${
                      selectedOpt === i ? 'bg-brand-blue text-white border-brand-blue' : 'border-gray-300 text-gray-500'
                    }`}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span>{opt}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={handleNext}
              disabled={selectedOpt === null}
              className={`px-5 py-2.5 text-xs font-bold rounded shadow transition flex items-center gap-1 cursor-pointer ${
                selectedOpt !== null
                  ? 'bg-brand-gold text-brand-dark hover:bg-yellow-500'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <span>{currentQIndex === questions.length - 1 ? (lang === 'en' ? 'Submit Answers' : 'បញ្ចប់ការធ្វើតេស្ត') : (lang === 'en' ? 'Next Question' : 'សំណួរបន្ទាប់')}</span>
            </button>
          </div>
        </div>
      )}

      {finished && (
        <div className="space-y-6 text-center py-4 animate-scaleUp">
          <div className="inline-block bg-brand-gold/10 text-brand-gold rounded-full p-4 mx-auto">
            <Award size={36} />
          </div>

          <div className="space-y-1">
            <h5 className="font-serif font-bold text-[#112B8C] text-xl tracking-tight">
              {lang === 'en' ? 'Placement Diagnostic Result' : 'លទ្ធផលតេស្តវាស់យកកម្រិត'}
            </h5>
            <p className="text-sm font-sans font-semibold text-gray-700">
              {lang === 'en' ? 'Your Evaluation Score:' : 'ពិន្ទុនៃការសាកល្បងរបស់អ្នក៖'}{' '}
              <span className="text-brand-red text-base font-extrabold font-mono">{score} / {questions.length}</span> (
              {Math.round((score / questions.length) * 100)}%)
            </p>
          </div>

          <div className="bg-[#071B5C] text-white p-5 rounded-xl border border-white/10 text-left space-y-3 max-w-md mx-auto">
            <span className="bg-yellow-500 text-[#071B5C] font-extrabold text-[9px] uppercase px-2 py-0.5 rounded tracking-wide">
              {lang === 'en' ? 'Advisable Curricular Pathway' : 'កម្មវិធីសិក្សាសមស្របបំផុត'}
            </span>
            <div>
              <h6 className="font-sans font-bold text-sm text-brand-gold">{rec.program}</h6>
              <p className="text-[10px] text-gray-300 font-mono mt-0.5">{lang === 'en' ? 'Skill Level Indicator' : 'សូចនាករកម្រិតសមត្ថភាព'} • {rec.level}</p>
            </div>
            <p className="text-xs text-gray-200 leading-relaxed font-light border-t border-white/10 pt-2.5">
              {rec.details}
            </p>
          </div>

          <div className="flex justify-center space-x-3 pt-2 font-sans">
            <button
              onClick={restartQuiz}
              className="px-5 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-bold rounded-md flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw size={12} />
              <span>{lang === 'en' ? 'Retry Evaluation' : 'វាស់ម្តងទៀត'}</span>
            </button>
            <button
              onClick={() => {
                const element = document.getElementById('apply-now');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="px-5 py-2.5 bg-brand-blue hover:bg-brand-dark text-white text-xs font-extrabold rounded-md shadow flex items-center gap-1 cursor-pointer"
            >
              <CheckCircle2 size={12} className="text-brand-gold" />
              <span>{lang === 'en' ? 'Apply for this program' : 'ចុះឈ្មោះចូលរៀនឥឡូវនេះ'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
