export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  category: 'Berita' | 'Prestasi' | 'Pengumuman' | 'Agenda';
  date: string;
  author: string;
  excerpt: string;
  content: string[];
  image: string;
  readTime: string;
  featured?: boolean;
}

export interface ProgramUnggulan {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  icon: string;
  badge: string;
  image: string;
  highlights: string[];
}

export interface FacilityItem {
  id: string;
  name: string;
  category: 'Akademik' | 'Olahraga' | 'Seni & Budaya' | 'Penunjang';
  description: string;
  image: string;
  features: string[];
}

export interface ExtracurricularItem {
  id: string;
  name: string;
  category: 'Olahraga' | 'Seni & Budaya' | 'Sains & Teknologi' | 'Bahasa & Keorganisasian';
  description: string;
  schedule: string;
  iconName: string;
  achievements: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  studentName: string;
  event: string;
  level: 'Internasional' | 'Nasional' | 'Provinsi' | 'Kota' | 'DKI Jakarta';
  year: string;
  category: 'Akademik' | 'Robotik / Riset' | 'Seni' | 'Olahraga' | 'Kesiswaan' | 'Keagamaan' | 'Seni & Budaya';
  image: string;
}

export interface TeacherStaff {
  id: string;
  name: string;
  role: string;
  subject: string;
  education: string;
  image: string;
}

export interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  role: string;
  relation: string;
  image: string;
}

export interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

export interface HeroSlideContent {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  bgImage: string;
  alt: string;
  primaryBtn: string;
  secondaryBtn: string;
}

export interface PrincipalProfileContent {
  name: string;
  role: string;
  quote: string;
  photo: string;
}

export interface SchoolSiteContent {
  heroSlides: HeroSlideContent[];
  principal: PrincipalProfileContent;
  programs: ProgramUnggulan[];
  news: NewsItem[];
  facilities: FacilityItem[];
  extracurriculars: ExtracurricularItem[];
  achievements: AchievementItem[];
  teachers?: TeacherStaff[];
  customLogo?: string;
  stats?: {
    students?: string;
    teachers?: string;
    extracurriculars?: string;
    accreditation?: string;
    achievementsPerYear?: string;
    accreditationScore?: string;
    alumniSuccess?: string;
    updatedAt?: number;
    [key: string]: any;
  };
  updatedAt?: number;
  updatedBy?: string;
}
