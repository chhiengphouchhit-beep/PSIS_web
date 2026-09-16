/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Campus, Lead, NewsItem, AdminUser, AcademicProgram, DigitLearningApp, StemKit, ImageAsset } from './types';
import { convertGoogleDriveUrl } from './utils/images';

// Hardcoded Campuses with detailed fields, messages, facilities, contacts and image layouts
export const INITIAL_CAMPUSES: Campus[] = [
  {
    id: 'tk',
    name: 'Toul Kork Campus (TK)',
    code: 'TK',
    principal: 'Dr. Chhim Sokheng',
    message: 'Welcome to the TK campus where technology and language merge to cultivate the global citizens of tomorrow. Our curriculum places a high focus on creative inquiry and analytical mastery from preschool onwards.',
    facilities: ['Advanced Robotic Lab', 'Olympic-size Indoor Swimming Pool', 'Science Lab with 3D Printers', 'Digital Apple-certified Mac Suite', 'Spacious Library with 50K+ volumes'],
    contact: 'tk.info@psis.edu.kh | +855 23 884 991',
    image: '/images/campuses/tk.jpg',
    location: 'Street 315, Sangkat Boeung Kak I, Khan Toul Kork, Phnom Penh',
    studentsCount: 1450
  },
  {
    id: 'ttp',
    name: 'Toul Tom Poung Campus (TTP)',
    code: 'TTP',
    principal: 'Mrs. Srey Sotheary',
    message: 'Our TTP Campus thrives on high community engagement and premium academic support. We deliver exceptional primary and secondary classes paired with the esteemed PUC-IFL language system.',
    facilities: ['Fully Equipped Science Laboratory', 'Multi-purpose Athletics court', 'Digital Learning Pods', 'Smart Interactive Displays in all classrooms', 'Art & Music Studios'],
    contact: 'ttp.info@psis.edu.kh | +855 23 221 688',
    image: '/images/campuses/ttp.jpg',
    location: 'Street 432, Sangkat Toul Tom Poung, Khan Chamkarmon, Phnom Penh',
    studentsCount: 980
  },
  {
    id: 'cap',
    name: 'Chbar Ampov Campus (CAP)',
    code: 'CAP',
    principal: 'Mr. Johnathan Baker',
    message: 'At CAP, children enjoy a green, serene learning eco-reserve. Our digital transformation is embedded into the environment, offering nature-inspired learning and advanced drone technology courses.',
    facilities: ['Outdoor Ecological Greenhouse', 'Drone Education Testing Field', 'Creative Play Hub', 'Tech Sandbox Lab', 'Modern Amphitheater'],
    contact: 'cap.info@psis.edu.kh | +855 23 555 125',
    image: '/images/campuses/cap.jpg',
    location: 'National Road 1, Sangkat Chbar Ampov, Khan Chbar Ampov, Phnom Penh',
    studentsCount: 720
  },
  {
    id: 'rsk',
    name: 'Russey Keo Campus (RSK)',
    code: 'RSK',
    principal: 'Dr. Heng Vireak',
    message: 'RSK represents our newest educational center of excellence. Built to inspire high school excellence and direct University pathways, it is Phnom Penhs premier north gate campus.',
    facilities: ['International Debate Chamber', 'Virtual Reality Learning Zone', 'Engineering & CAD Studio', 'Pre-university Resource Center', 'Indoors Basketball arena'],
    contact: 'rsk.info@psis.edu.kh | +855 23 998 012',
    image: '/images/campuses/rsk.jpg',
    location: 'National Road 5, Sangkat Russey Keo, Khan Russey Keo, Phnom Penh',
    studentsCount: 810
  },
  {
    id: 'nr3',
    name: 'National Road 3 Campus (NR3)',
    code: 'NR3',
    principal: 'Mr. Prak Chanra',
    message: 'Industrial progression and automation are the core disciplines here at NR3. We provide robust secondary educational structures focused heavily on practical engineering, mathematics, and science.',
    facilities: ['Robotics Testing Arena', 'Modern physics & chemistry blocks', 'Tech Sandbox Lab', 'Generous outdoor fields', 'Digital AV Broadcasting Studio'],
    contact: 'nr3.info@psis.edu.kh | +855 23 777 004',
    image: '/images/campuses/nr3.jpg',
    location: 'National Road 3 (Km 12), Sangkat Chom Chao, Khan Por Senchey, Phnom Penh',
    studentsCount: 640
  },
  {
    id: 'battambang',
    name: 'Battambang Campus (BTB)',
    code: 'Battambang',
    principal: 'Mrs. Chhim Sophoan',
    message: 'Bringing global education standard to Cambodias second city. Battambang campus fuses rich local heritage with cutting-edge international standards in digital learning models.',
    facilities: ['Agricultural Science Hub', 'Digital Kids Library', 'Modern Smart Classrooms', 'Sports Complex & Athletic Track', 'Advanced IT Training Center'],
    contact: 'btb.info@psis.edu.kh | +855 53 952 111',
    image: '/images/campuses/battambang.jpg',
    location: 'Street 3, Sangkat Svay Por, Krong Battambang, Battambang Province',
    studentsCount: 570
  },
  {
    id: 'kpt',
    name: 'Kampong Thom Campus (KPT)',
    code: 'KPT',
    principal: 'Academic Directorate',
    message: 'Paññāsāstra International School expands to Kampong Thom Province. Delivering 21st-century bilingual education, Singapore mathematics, and robotics engineering directly to the heart of Cambodia.',
    facilities: ['Robotics & STEM Innovation Lab', 'Smart Interactive Displays in all classrooms', 'Digital Resource Library', 'Eco-friendly Sports Grounds & Athletics', 'PUC-IFL Language Center'],
    contact: 'kpt.info@psis.edu.kh | +855 23 884 991',
    image: '/images/campuses/kpt.jpg',
    location: 'National Road 6, Krong Stueng Saen, Kampong Thom Province',
    studentsCount: 0,
    isComingSoon: true
  }
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'L-001',
    parentName: 'Sok Mean',
    studentName: 'Sok Piseth',
    studentAge: '7',
    phone: '012 345 678',
    email: 'mean.sok@gmail.com',
    campus: 'Toul Kork Campus (TK)',
    program: 'Primary School',
    status: 'Tour Booked',
    notes: 'Requested a morning physical tour. Wants to check out the Smart Lab, robotic components, and meet primary school teachers.',
    createdAt: '2026-05-28T04:20:00Z',
    source: 'Website Form'
  },
  {
    id: 'L-002',
    parentName: 'Keo Rotha',
    studentName: 'Keo Sreypich',
    studentAge: '4',
    phone: '099 888 777',
    email: 'rotha.keo@outlook.com',
    campus: 'Toul Tom Poung Campus (TTP)',
    program: 'Preschool International',
    status: 'New',
    notes: 'Interested in the Bilingual Nursery playgroups. Inquired if kids-focused English (PUC-IFL) is integrated.',
    createdAt: '2026-05-29T11:45:00Z',
    source: 'Ad Campaign'
  },
  {
    id: 'L-003',
    parentName: 'Chun Leng',
    studentName: 'Chun Davith',
    studentAge: '15',
    phone: '015 667 999',
    email: 'leng.chun@hotmail.com',
    campus: 'Russey Keo Campus (RSK)',
    program: 'High School',
    status: 'Assessment',
    notes: 'Student excels at coding. Scored highly in math. Scheduled for STEM entry evaluation and admissions test next Tuesday.',
    createdAt: '2026-05-25T02:10:00Z',
    source: 'Website Form'
  },
  {
    id: 'L-004',
    parentName: 'Chan Nary',
    studentName: 'Chan Monika',
    studentAge: '11',
    phone: '085 222 111',
    email: 'nary.chan@gmail.com',
    campus: 'Chbar Ampov Campus (CAP)',
    program: 'Primary School',
    status: 'Enrolled',
    notes: 'Registration fees paid. Enrolled into primary 5th-grade with Raz-Kids and Koobits interactive homework model.',
    createdAt: '2026-05-20T08:30:00Z',
    source: 'Referral'
  },
  {
    id: 'L-005',
    parentName: 'Ouk Boramy',
    studentName: 'Ouk Sereyvadh',
    studentAge: '13',
    phone: '012 990 011',
    email: 'boramy.ouk@gmail.com',
    campus: 'National Road 3 Campus (NR3)',
    program: 'Secondary School',
    status: 'Contacted',
    notes: 'Followed up via telephone. Parent asked for installment plan options and bus routes for national road 3.',
    createdAt: '2026-05-29T16:00:00Z',
    source: 'Website Form'
  },
  {
    id: 'L-006',
    parentName: 'Heng Sovan',
    studentName: 'Heng Rathana',
    studentAge: '17',
    phone: '092 112 334',
    email: 'sovan.heng@gmail.com',
    campus: 'TK Campus (TK)',
    program: 'High School',
    status: 'New',
    notes: 'Highly motivated to join PUC IELTS prep training. Needs morning schedules.',
    createdAt: '2026-05-30T09:05:00Z',
    source: 'Website Form'
  }
];

export const INITIAL_NEWS: NewsItem[] = [
  {
    id: 'N-1',
    title: 'PSIS Robotics Team Wins Gold at Phnom Penh STEM Championship',
    khmerTitle: 'ក្រុមរ៉ូបូតសាលា PSIS ឈ្នះមេដាយមាសក្នុងព្រឹត្តិការណ៍ជើងឯកបច្ចេកវិទ្យាភ្នំពេញ',
    category: 'STEM',
    content: 'Students from TK and RSK Campuses teamed up to construct a smart sorting system using KUBO structures and custom code scripts. The innovative design won first place in state efficiency, confirming the elite status of PSIS technology education.',
    date: 'May 28, 2026',
    image: '/images/news/stem-robotics.jpg',
    views: 450,
    featured: true
  },
  {
    id: 'N-2',
    title: 'PUC-IFL Partners with British Council for Instant TOEFL/IELTS Preparation',
    khmerTitle: 'PUC-IFL សហការជាមួយក្រុមប្រឹក្សាចក្រភពអង់គ្លេសសម្រាប់ការរៀបចំប្រឡង TOEFL/IELTS',
    category: 'PUC-IFL',
    content: 'Paññāsāstra International School is proud to expand its integration with pre-vetted educational tools, ensuring children acquire top tier mock assessments and native accent trainings during our weekend schedules.',
    date: 'May 25, 2026',
    image: '/images/news/mou-cambridge.jpg',
    views: 310,
    featured: false
  },
  {
    id: 'N-3',
    title: 'Admissions Open for Academic Year 2026 - 2027: Early Bird Incentives',
    khmerTitle: 'ការចុះឈ្មោះចូលរៀនសម្រាប់ឆ្នាំសិក្សា ២០២៦ - ២០២៧៖ ការផ្តល់ជូនពិសេស Early Bird',
    category: 'Admission',
    content: 'Explore secure enrollment packages now. Discover discounts of up to 15% on tuition, free digital learning application subscriptions (ELIF, Koobits, Raz Kids), and complimentary campus uniforms.',
    date: 'May 18, 2026',
    image: '/images/news/admissions-2026.jpg',
    views: 580,
    featured: true
  },
  {
    id: 'N-4',
    title: 'International Cultural Fair Unites all 6 Campuses in TK Sport Dome',
    khmerTitle: 'ពិព័រណ៍វប្បធម៌អន្តរជាតិរួមបញ្ចូលគ្នានៃសាខាទាំង ៦ នៅទួលគោក',
    category: 'Campus News',
    content: 'A dazzling showcase of food stalls, national costume pageantry, and traditional Cambodian art dances. Parents gathered to celebrate deep diverse education and global-mindset environments that thrive inside PSIS.',
    date: 'May 10, 2026',
    image: '/images/news/cultural-fair.jpg',
    views: 290,
    featured: false
  }
];

export const ACADEMIC_PROGRAMS: AcademicProgram[] = [
  {
    id: 'preschool',
    name: 'Bilingual & International Preschool',
    khmerName: 'មត្តេយ្យសិក្សា ទ្វិភាសា និង អន្តរជាតិ',
    description: 'Nurturing curiosity through active, sensory play, basic robotics, and early language tracks. Children are introduced to language phonics and basic math with high safety supervision.',
    curriculum: ['Phonetics & Storytelling', 'ELIF English system', 'KUBO Tangible Robots', 'Creative Art and Sensory Play', 'Khmer Heritage Basics'],
    features: ['Low student-to-teacher ratio (5:1)', 'Dedicated child-safe sensory zones', 'Daily pediatric health monitoring', 'Interactive floor projection games'],
    ageGroup: '2.5 to 5 Years Old',
    image: '/images/programs/preschool.jpg'
  },
  {
    id: 'primary',
    name: 'Singapore-aligned Primary School',
    khmerName: 'បឋមសិក្សា ស្តង់ដារ សឹង្ហបុរី',
    description: 'Building robust operational baselines in STEM, arithmetic logic, and dual fluencies. Combining state standards with Koobits and Raz-Kids online workflows to accelerate learning.',
    curriculum: ['Singapore Mathematics Method', 'Comprehensive Lab Science', 'Bilingual English/Khmer', 'Chinese Introductory Language', 'Raz-Kids digital reading'],
    features: ['Robotics curriculum integrated weekly', 'Personalised math paths via Koobits AI', 'Creative writing & public drama', 'Inter-campus science tournaments'],
    ageGroup: '6 to 11 Years Old',
    image: '/images/programs/primary.jpg'
  },
  {
    id: 'secondary',
    name: 'Rigorous Secondary School',
    khmerName: 'អនុវិទ្យាល័យ ទំនើបភាវូបនីយកម្ម',
    description: 'Fostering deep abstract analysis, structured debate, web programming, and specialized biology. Preparing minds to formulate answers rather than memorize text.',
    curriculum: ['Computer Science & CodeMonkey code paths', 'Advanced Physics & Chemistry', 'International History & Geography', 'Comprehensive Khmer literature', 'Advanced English Writing'],
    features: ['Weekly scientific laboratory evaluations', 'Guided drone flight and coding tests', 'Public speech training & parliamentary debate', 'Digital literacy and anti-plagiarism checks on Turnitin'],
    ageGroup: '12 to 15 Years Old',
    image: '/images/programs/secondary.jpg'
  },
  {
    id: 'highschool',
    name: 'Premium High School & PUC Prep',
    khmerName: 'វិទ្យាល័យ និងការរៀបចំគ្រឹះស្ថានឧត្តមសិក្សា',
    description: 'Top-tier pre-university track. High schoolers receive comprehensive IELTS and TOEFL testing packages alongside modern college guidance services to enter globally reputable universities.',
    curriculum: ['Mathematical Calculus & Stats', 'University-prep ESL & Academic writing', 'Advanced Chemical and Robotic Systems', 'Business Economics and Khmer Civics', 'IELTS/TOEFL simulated masterclasses'],
    features: ['Dedicated college application counselors', 'Elite research projects aligned with local industries', 'Internship opportunities at PSIS Corporate Network', 'Official Cambridge secondary equivalents'],
    ageGroup: '16 to 18 Years Old',
    image: '/images/programs/highschool.jpg'
  }
];

export const DIGITAL_LEARNING_SUITE: DigitLearningApp[] = [
  {
    id: 'elif',
    name: 'ELIF (English Learning Interactive)',
    description: 'Interactive high-frequency phonics and vocabulary simulator built to empower nursery and toddler groups with native pronunciations.',
    gradeLevels: 'Preschool & Grade 1',
    purpose: 'Active accent acquisition and sight-reading speed.',
    iconName: 'Sparkles'
  },
  {
    id: 'koobits',
    name: 'KooBits Singapore Math',
    description: 'AI-infused math homework module where pupils receive highly competitive gamified math challenges based on standard Singapore pedagogies.',
    gradeLevels: 'Grade 1 to 6',
    purpose: 'Math problem-solving strategies and self-paced homework.',
    iconName: 'GraduationCap'
  },
  {
    id: 'razkids',
    name: 'Raz-Kids Reading Plus',
    description: 'An interactive library containing thousands of reading resources where children can record audio of their speech and test reading comprehension parameters.',
    gradeLevels: 'Grade 1 to 9',
    purpose: 'Guided reading fluency and listening tracking.',
    iconName: 'BookOpen'
  },
  {
    id: 'codemonkey',
    name: 'CodeMonkey Premium',
    description: 'Interactive computer game curriculum that introduces kids to write genuine textual JavaScript and Python programming, with direct level builders.',
    gradeLevels: 'Grade 2 to 9',
    purpose: 'Algorithm formulation and syntax reasoning.',
    iconName: 'Code'
  },
  {
    id: 'turnitin',
    name: 'Turnitin Academic Integrity',
    description: 'Global benchmark database to scan student research writings, high-school homework, and essays for authentic, original academic research output.',
    gradeLevels: 'Grade 10 to 12',
    purpose: 'Academic integrity and proper academic citation.',
    iconName: 'ShieldCheck'
  },
  {
    id: 'chinese',
    name: 'Bilingual Mandarin Programme',
    description: 'Immersive Chinese language program featuring standard writing practices, native tones, Hanyu Shuiping Kaoshi (HSK) grade preparations.',
    gradeLevels: 'All grades',
    purpose: 'Third language mastery for international trade context.',
    iconName: 'Languages'
  }
];

export const STEM_RESOURCES: StemKit[] = [
  {
    id: 'kubo',
    name: 'KUBO Coding Pack',
    type: 'Tangible Robotic Tiles',
    description: 'Tag-tile physical puzzle systems that teach preschoolers the foundational principles of loop, sequence, and simple functions without screen exhaustion.',
    skillsAcquired: ['Aesthetic logic', 'Sequence tracking', 'Basic loop programming'],
    image: '/images/student-life/robotics.jpg'
  },
  {
    id: 'smartworld',
    name: 'Smart World Robotics kit',
    type: 'Embedded Microcontroller Set',
    description: 'Advanced Arduino and Raspberry Pi integration sensors. High schoolers use these to develop ecological sensors and smart house hardware models.',
    skillsAcquired: ['Electrical blueprints', 'C++ syntax code structures', 'Hardware manipulation'],
    image: '/images/news/stem-robotics.jpg'
  },
  {
    id: 'drone',
    name: 'Tello Drone Coding Hub',
    type: 'Programmed Aero-dynamics',
    description: 'Students learn drone flight parameters, programmatic coordinate control, and sensor telemetry analysis using simple Python script modules.',
    skillsAcquired: ['spatial calculus', 'Python coordinates', 'Flight mechanics'],
    image: '/images/student-life/leadership.jpg'
  },
  {
    id: 'interactive',
    name: 'Newline Smart Board Ecosystem',
    type: 'Collaborative Technology',
    description: 'Multi-touch displays inside every classroom allowing instant team collaborations, classroom screencasts, and quick cloud study note distributions.',
    skillsAcquired: ['Realtime peer collaboration', 'Digital AV layouts', 'Group presenting skills'],
    image: '/images/student-life/arts.jpg'
  }
];

export const PUC_COURSES = [
  {
    id: 'gep',
    name: 'General English Programme (GEP)',
    duration: '10 Levels',
    age: '15+ Years and Adults',
    desc: 'Perfect academic and career language enhancement program covering high-end writing, presentations, and interactive discussions.'
  },
  {
    id: 'efk',
    name: 'English for Kids (EFK)',
    duration: '12 Terms',
    age: '6 to 11 Years Old',
    desc: 'Interactive, child-safe language acquisition using phonics, song cues, and beautiful ELIF digital tools to promote early native pronunciation.'
  },
  {
    id: 'eft',
    name: 'English for Teens (EFT)',
    duration: '8 Terms',
    age: '12 to 14 Years Old',
    desc: 'Prepares teenage students for academic presentations, deep global awareness essays, and secondary school language proficiencies.'
  },
  {
    id: 'ielts',
    name: 'IELTS Certification Mastery',
    duration: '3 - 6 Months intensive',
    age: '15+ Years Old',
    desc: 'Official IELTS testing simulations. Instructed by certified local and native speakers targeting score criteria bands representing 6.5 to 8.5.'
  },
  {
    id: 'toefl',
    name: 'TOEFL iBT Academic Prep',
    duration: '3 - 6 Months intensive',
    age: '15+ Years Old',
    desc: 'Rigorous writing, active reading analysis, listening drills, and automated computer examinations matching ETS benchmarks.'
  },
  {
    id: 'weekend',
    name: 'Weekend Language Club',
    duration: 'Ongoing (Sat & Sun)',
    age: 'All Levels',
    desc: 'Special weekend timetables designed for busy pupils and working adults who want language progression without sacrificing weekday hours.'
  }
];

export const INITIAL_ADMINS: AdminUser[] = [
  {
    id: 'u-1',
    name: 'Oknha Dr. Chey Sam Ath',
    email: 'chhieng.phouchhit@psis.edu.kh', // using the context email
    role: 'Super Admin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'u-2',
    name: 'Sok Mesa',
    email: 'mesa.sok@psis.edu.kh',
    role: 'Admission Admin',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'u-3',
    name: 'Chen Sreymom',
    email: 'sreymom.chen@psis.edu.kh',
    role: 'Marketing Admin',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'u-4',
    name: 'Visal Chan',
    email: 'visal.chan@psis.edu.kh',
    role: 'Campus Admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    assignedCampus: 'TK Campus'
  }
];

export const OPEN_JOBS = [
  { id: 'j-1', title: 'English For Kids (EFK) Teacher', type: 'Full-time / Part-time', campus: 'TK Campus & TTP Campus', salary: '$1,200 - $1,800', desc: 'Seeking enthusiastic teachers with TESOL/CELTA certification to deliver our proprietary bilingual modules.' },
  { id: 'j-2', title: 'STEM & Robotics Instructor', type: 'Full-time', campus: 'TK Campus / Russey Keo Campus', salary: '$1,500 - $2,200', desc: 'Instructing Arduino, scratch systems, and KUBO robots. Relevant engineering or IT degree required.' },
  { id: 'j-3', title: 'Academic Admissions Coordinator', type: 'Full-time', campus: 'Chbar Ampov Campus', salary: '$800 - $1,200', desc: 'Managing parent campus tours, onboarding interviews, and updating our local lead management system.' }
];

// Helper functions for state manipulation using LocalStorage
const STORAGE_KEYS = {
  LEADS: 'psis_leads',
  NEWS: 'psis_news',
  CAMPUSES: 'psis_campuses',
  IMAGE_ASSETS: 'psis_image_assets',
  CURRENT_USER: 'psis_current_user'
};

export { convertGoogleDriveUrl };

export function getPersistedLeads(): Lead[] {
  const stored = localStorage.getItem(STORAGE_KEYS.LEADS);
  if (!stored) {
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(INITIAL_LEADS));
    return INITIAL_LEADS;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return INITIAL_LEADS;
  }
}

export function savePersistedLeads(leads: Lead[]): void {
  localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads));
}

export function getPersistedNews(): NewsItem[] {
  const initialMap = new Map(INITIAL_NEWS.map((n) => [n.id, n]));
  const stored = localStorage.getItem(STORAGE_KEYS.NEWS);
  if (!stored) {
    localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(INITIAL_NEWS));
    return INITIAL_NEWS;
  }
  try {
    const parsed = JSON.parse(stored) as NewsItem[];
    const sanitized = parsed.map((n) => {
      const defaultNews = initialMap.get(n.id);
      return {
        ...n,
        title: defaultNews ? defaultNews.title : n.title,
        khmerTitle: defaultNews ? defaultNews.khmerTitle : n.khmerTitle,
        image: defaultNews ? defaultNews.image : n.image,
        content: defaultNews ? defaultNews.content : n.content,
        category: defaultNews ? defaultNews.category : n.category,
      };
    });
    // Ensure any new items in INITIAL_NEWS are added
    const parsedIds = new Set(parsed.map((n) => n.id));
    for (const initNews of INITIAL_NEWS) {
      if (!parsedIds.has(initNews.id)) {
        sanitized.push(initNews);
      }
    }
    localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(sanitized));
    return sanitized;
  } catch (e) {
    return INITIAL_NEWS;
  }
}

export function savePersistedNews(news: NewsItem[]): void {
  localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(news));
}

export function getPersistedCampuses(): Campus[] {
  const initialMap = new Map(INITIAL_CAMPUSES.map((c) => [c.id, c]));
  const stored = localStorage.getItem(STORAGE_KEYS.CAMPUSES);
  if (!stored) {
    localStorage.setItem(STORAGE_KEYS.CAMPUSES, JSON.stringify(INITIAL_CAMPUSES));
    return INITIAL_CAMPUSES;
  }
  try {
    const parsed = JSON.parse(stored) as Campus[];
    const parsedIds = new Set(parsed.map((c) => c.id));
    const sanitized: Campus[] = parsed.map((c) => {
      const defaultCampus = initialMap.get(c.id);
      return {
        ...c,
        isComingSoon: defaultCampus?.isComingSoon ?? c.isComingSoon,
        image: defaultCampus ? defaultCampus.image : c.image,
      };
    });
    for (const initCampus of INITIAL_CAMPUSES) {
      if (!parsedIds.has(initCampus.id)) {
        sanitized.push(initCampus);
      }
    }
    localStorage.setItem(STORAGE_KEYS.CAMPUSES, JSON.stringify(sanitized));
    return sanitized;
  } catch (e) {
    return INITIAL_CAMPUSES;
  }
}

export function savePersistedCampuses(campuses: Campus[]): void {
  localStorage.setItem(STORAGE_KEYS.CAMPUSES, JSON.stringify(campuses));
}

export function getPersistedImageAssets(): ImageAsset[] {
  const stored = localStorage.getItem(STORAGE_KEYS.IMAGE_ASSETS);
  if (!stored) return [];
  try {
    const assets = JSON.parse(stored) as ImageAsset[];
    return assets.map((asset) => ({
      ...asset,
      url: convertGoogleDriveUrl(asset.originalUrl || asset.url),
      originalUrl: asset.originalUrl || asset.url,
      priority: asset.priority || 1,
      status: asset.status || 'Active',
      storageProvider: asset.storageProvider || 'external-url'
    }));
  } catch (e) {
    return [];
  }
}

export function savePersistedImageAssets(assets: ImageAsset[]): void {
  localStorage.setItem(STORAGE_KEYS.IMAGE_ASSETS, JSON.stringify(assets));
}

export function getActiveAdminUser(): AdminUser {
  const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  if (!stored) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(INITIAL_ADMINS[0]));
    return INITIAL_ADMINS[0];
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return INITIAL_ADMINS[0];
  }
}

export function setActiveAdminUser(user: AdminUser): void {
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
}
