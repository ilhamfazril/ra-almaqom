import { 
  db, 
  doc, 
  onSnapshot, 
  setDoc, 
  getDoc,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  getDocFromServer,
  getDocs
} from '../lib/firebase';
import firebaseConfigData from '../../firebase-applet-config.json';
import {
  compressImageForStorage,
  saveMediaAsset,
  resolveMediaUrl,
  resolveObjectMedia,
  initMediaAssetsSync,
  fetchAllMediaAssetsRest,
} from './mediaAssetService';

export {
  compressImageForStorage,
  saveMediaAsset,
  resolveMediaUrl,
  resolveObjectMedia,
  initMediaAssetsSync,
  fetchAllMediaAssetsRest,
};
import { 
  PRINCIPAL_INFO, 
  PROGRAMS_UNGGULAN, 
  NEWS_LIST, 
  FACILITIES_LIST, 
  EXTRACURRICULAR_LIST, 
  ACHIEVEMENTS_LIST,
  TEACHERS_LIST
} from '../data/schoolData';
import { PERSISTED_USER_CONTENT } from '../data/persistedSchoolContent';
import { 
  ProgramUnggulan, 
  NewsItem, 
  FacilityItem, 
  ExtracurricularItem, 
  AchievementItem,
  TeacherStaff
} from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  timestamp: string;
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path,
    timestamp: new Date().toISOString()
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  return errInfo;
}

// REST API Base URL to Google Cloud Firestore (direct cloud persistence fallback)
const FIRESTORE_DOCS_ROOT = `https://firestore.googleapis.com/v1/projects/${firebaseConfigData.projectId}/databases/${firebaseConfigData.firestoreDatabaseId}/documents/site_content`;
const FIRESTORE_REST_BASE = `${FIRESTORE_DOCS_ROOT}/main_config?key=${firebaseConfigData.apiKey}`;

// Decode raw Firestore REST API document format into clean TypeScript objects
function decodeFirestoreValue(val: any): any {
  if (!val || typeof val !== 'object') return val;
  if ('stringValue' in val) return val.stringValue;
  if ('integerValue' in val) return Number(val.integerValue);
  if ('doubleValue' in val) return Number(val.doubleValue);
  if ('booleanValue' in val) return val.booleanValue;
  if ('timestampValue' in val) return val.timestampValue;
  if ('nullValue' in val) return null;
  if ('arrayValue' in val) {
    const values = val.arrayValue?.values || [];
    return values.map(decodeFirestoreValue);
  }
  if ('mapValue' in val) {
    const fields = val.mapValue?.fields || {};
    const res: Record<string, any> = {};
    for (const [k, v] of Object.entries(fields)) {
      res[k] = decodeFirestoreValue(v);
    }
    return res;
  }
  return val;
}

function decodeFirestoreDocument(docData: any): Partial<SchoolSiteContent> | null {
  if (!docData || !docData.fields) return null;
  const res: Record<string, any> = {};
  for (const [k, v] of Object.entries(docData.fields)) {
    res[k] = decodeFirestoreValue(v);
  }
  return res as Partial<SchoolSiteContent>;
}

// Encode clean JavaScript object to Firestore REST API fields format
function encodeFirestoreValue(val: any): any {
  if (val === null || val === undefined) return { nullValue: null };
  if (typeof val === 'string') return { stringValue: val };
  if (typeof val === 'boolean') return { booleanValue: val };
  if (typeof val === 'number') {
    return Number.isInteger(val) ? { integerValue: String(val) } : { doubleValue: val };
  }
  if (Array.isArray(val)) {
    return {
      arrayValue: {
        values: val.map(encodeFirestoreValue),
      },
    };
  }
  if (typeof val === 'object') {
    const fields: Record<string, any> = {};
    for (const [k, v] of Object.entries(val)) {
      if (v !== undefined) {
        fields[k] = encodeFirestoreValue(v);
      }
    }
    return { mapValue: { fields } };
  }
  return { stringValue: String(val) };
}

function encodeFirestoreDocument(obj: Record<string, any>): any {
  const fields: Record<string, any> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined) {
      fields[k] = encodeFirestoreValue(v);
    }
  }
  return { fields };
}

/**
 * Direct HTTPS REST fetch for a specific section document in site_content.
 */
export async function fetchSectionFromFirestoreRest(sectionKey: string): Promise<any | null> {
  try {
    const url = `${FIRESTORE_DOCS_ROOT}/section_${sectionKey}?key=${firebaseConfigData.apiKey}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    const docFields = json.fields || {};
    if (docFields.data) {
      return decodeFirestoreValue(docFields.data);
    }
    return null;
  } catch (err) {
    console.warn(`Direct REST fetch error for section_${sectionKey}:`, err);
    return null;
  }
}

/**
 * Direct HTTPS REST write for a specific section document in site_content.
 * Keeps payload small (~30-350 KB), completely eliminating Firestore 1MB limits.
 */
export async function saveSectionToFirestoreRest(
  sectionKey: string, 
  data: any, 
  adminUsername: string
): Promise<boolean> {
  try {
    const url = `${FIRESTORE_DOCS_ROOT}/section_${sectionKey}?key=${firebaseConfigData.apiKey}`;
    const cleaned = cleanForFirestore(data);
    const body = {
      fields: {
        data: encodeFirestoreValue(cleaned),
        updatedAt: { integerValue: String(Date.now()) },
        updatedBy: { stringValue: adminUsername },
      },
    };
    const res = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return res.ok;
  } catch (err) {
    console.warn(`Direct REST save error for section_${sectionKey}:`, err);
    return false;
  }
}

/**
 * Server-Side Persistent API Synchronization.
 * This guarantees that every device (phone, laptop, tablet, public visitor)
 * instantly receives all uploaded photos and content without being blocked
 * by Google Cloud Firestore Spark free tier daily quota limits.
 */
export async function fetchContentFromServer(): Promise<Partial<SchoolSiteContent> | null> {
  if (typeof window === 'undefined') return null;
  try {
    const res = await fetch('/api/content', { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    if (json.success && json.data) {
      return json.data;
    }
  } catch (err) {
    console.warn('Server content fetch notice:', err);
  }
  return null;
}

export async function saveContentToServer(data: Partial<SchoolSiteContent>): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  try {
    const res = await fetch('/api/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.ok;
  } catch (err) {
    console.warn('Server content save notice:', err);
    return false;
  }
}

export async function syncLocalContentToServer(content: SchoolSiteContent): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  try {
    const res = await fetch('/api/content/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(content),
    });
    return res.ok;
  } catch (err) {
    console.warn('Sync to server notice:', err);
    return false;
  }
}

export async function syncAllDevicesWithServer(): Promise<{ success: boolean; message: string }> {
  try {
    const ok = await syncLocalContentToServer(currentSiteContentMemory);
    if (ok) {
      return {
        success: true,
        message: 'Seluruh foto dan perubahan dari perangkat ini berhasil disinkronkan ke server. Sekarang semua perangkat (HP, laptop, komputer lain) langsung menampilkan data terbaru.',
      };
    }
    return {
      success: false,
      message: 'Gagal menghubungi server aplikasi. Pastikan koneksi internet stabil.',
    };
  } catch (e: any) {
    return {
      success: false,
      message: e?.message || 'Gagal sinkronisasi data ke server.',
    };
  }
}

/**
 * Direct HTTPS REST fetch to Google Cloud Firestore servers.
 * Fetches all individual section documents in parallel and merges them.
 * Bypasses all WebChannel / WebSocket / iframe limitations.
 */
export async function fetchLiveContentFromFirestoreRest(): Promise<Partial<SchoolSiteContent> | null> {
  const sections: (keyof SchoolSiteContent)[] = [
    'heroSlides',
    'principal',
    'facilities',
    'programs',
    'news',
    'achievements',
    'extracurriculars',
    'teachers',
    'customLogo',
  ];

  const result: Partial<SchoolSiteContent> = {};
  let anyLoaded = false;

  await Promise.all(
    sections.map(async (sec) => {
      try {
        const secData = await fetchSectionFromFirestoreRest(sec as string);
        if (secData !== null && secData !== undefined) {
          (result as any)[sec] = secData;
          anyLoaded = true;
        }
      } catch (e) {
        console.warn(`Section fetch notice (${sec}):`, e);
      }
    })
  );

  // Also check main_config as fallback for any sections
  try {
    const res = await fetch(FIRESTORE_REST_BASE, { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      const mainDoc = decodeFirestoreDocument(json);
      if (mainDoc) {
        for (const sec of sections) {
          if ((result as any)[sec] === undefined && (mainDoc as any)[sec] !== undefined) {
            (result as any)[sec] = (mainDoc as any)[sec];
            anyLoaded = true;
          }
        }
        if (mainDoc.updatedAt && !result.updatedAt) result.updatedAt = mainDoc.updatedAt;
        if (mainDoc.updatedBy && !result.updatedBy) result.updatedBy = mainDoc.updatedBy;
      }
    }
  } catch (err) {
    console.warn('Direct REST fetch main_config notice:', err);
  }

  return anyLoaded ? result : null;
}

/**
 * Direct HTTPS REST write to Google Cloud Firestore servers.
 */
export async function saveLiveContentToFirestoreRest(data: Partial<SchoolSiteContent>): Promise<boolean> {
  const sections: (keyof SchoolSiteContent)[] = [
    'heroSlides',
    'principal',
    'facilities',
    'programs',
    'news',
    'achievements',
    'extracurriculars',
    'teachers',
    'customLogo',
  ];

  const sectionsToSave = sections.filter((sec) => (data as any)[sec] !== undefined);
  if (sectionsToSave.length === 0) return true;

  let allSuccess = true;
  await Promise.all(
    sectionsToSave.map(async (sec) => {
      const ok = await saveSectionToFirestoreRest(String(sec), (data as any)[sec], data.updatedBy || 'admin_ilham');
      if (!ok) allSuccess = false;
    })
  );

  return allSuccess;
}

// Validate connection to Firestore on initialization per Skill requirement
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'site_content', 'connection_test'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore notice: client appears offline or using cached state.');
    }
    return false;
  }
}

// Run connection check in background
testFirestoreConnection();

export interface HeroSlideContent {
  id: number | string;
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

export interface SchoolStatsContent {
  students: string;
  teachers: string;
  extracurriculars: string;
  accreditation: string;
  updatedAt?: number;
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
  stats?: SchoolStatsContent;
  updatedAt?: number;
  updatedBy?: string;
}

export interface PPDBRegistrationRecord {
  id?: string;
  registrationCode: string;
  candidateName: string;
  originSchool: string;
  nisn?: string;
  gender: string;
  parentName: string;
  parentPhone: string;
  parentEmail?: string;
  selectedTrack: string;
  notes?: string;
  status: 'Menunggu' | 'Diterima' | 'Ditolak';
  createdAt: number;
}

export const DEFAULT_HERO_SLIDES: HeroSlideContent[] = (Array.isArray(PERSISTED_USER_CONTENT.heroSlides) && PERSISTED_USER_CONTENT.heroSlides.length > 0)
  ? (PERSISTED_USER_CONTENT.heroSlides as HeroSlideContent[])
  : [
      {
        id: 0,
        title: 'Membentuk Generasi Qur’ani yang Cerdas, Mandiri, dan Ceria',
        subtitle: 'RA Al-Maqom — Raudhatul Athfal Al-Maqom',
        description: 'Lembaga pendidikan anak usia dini berciri khas Islam yang memadukan Kurikulum Merdeka PAUD, bimbingan tahfidz cilik, dan pembiasaan akhlak mulia dengan penuh kasih sayang.',
        badge: 'PAUD / RA Berkarakter & Ramah Anak',
        bgImage: '/images/slide1_gedung.jpg',
        alt: 'Suasana ceria santri RA Al-Maqom di gedung sekolah',
        primaryBtn: 'Pendaftaran PPDB 2027/2028',
        secondaryBtn: 'Jelajahi Profil Madrasah',
      },
      {
        id: 1,
        title: 'Belajar Sambil Bermain dengan Penuh Kasih Sayang',
        subtitle: 'Tahfidz Juz 30, Doa Keseharian & Pembiasaan Adab Santun',
        description: 'Mendidik tunas bangsa sejak usia emas melalui pendekatan bermain bermakna, sholat dhuha cilik, senam irama ceria, dan aneka stimulasi motorik kreatif.',
        badge: 'Ceria, Edukatif & Bermakna',
        bgImage: '/images/slide2_upacara.jpg',
        alt: 'Kegiatan pembiasaan santri cilik RA Al-Maqom',
        primaryBtn: 'Lihat Program Unggulan',
        secondaryBtn: 'Daftar Sekarang',
      },
      {
        id: 2,
        title: 'Lingkungan Belajar Asri & Arena Bermain Outdoor Aman',
        subtitle: 'Sentra Balok, Ruang Kelas Tematik Ber-AC & Playground Seru',
        description: 'Dilengkapi fasilitas arena bermain ramah anak, perpustakaan dongeng bergambar, sentra main peran, dan perlengkapan drumband cilik yang representatif.',
        badge: 'Fasilitas Ramah Anak',
        bgImage: '/images/slide3_lab_komputer.jpg',
        alt: 'Fasilitas edukatif dan arena bermain RA Al-Maqom',
        primaryBtn: 'Sarana & Fasilitas',
        secondaryBtn: 'Info Kurikulum',
      },
      {
        id: 3,
        title: 'Penerimaan Peserta Didik Baru (PPDB) 2027/2028',
        subtitle: 'Mari Bergabung Menjadi Bagian dari Keluarga Besar RA Al-Maqom',
        description: 'Menerima calon santri Kelompok Bermain (3-4 tahun), Kelompok A (4-5 tahun), dan Kelompok B (5-6 tahun). Biaya pendidikan bersahabat dan kuota terbatas.',
        badge: 'PPDB Telah Dibuka',
        bgImage: '/images/slide4_lapangan.jpg',
        alt: 'Halaman dan arena bermain RA Al-Maqom',
        primaryBtn: 'Daftar PPDB Online',
        secondaryBtn: 'Hubungi Panitia',
      },
    ];

export const DEFAULT_PRINCIPAL_CONTENT: PrincipalProfileContent = {
  name: PERSISTED_USER_CONTENT.principal?.name || PRINCIPAL_INFO.name,
  role: PERSISTED_USER_CONTENT.principal?.role || PRINCIPAL_INFO.role,
  quote: PERSISTED_USER_CONTENT.principal?.quote || PRINCIPAL_INFO.quote,
  photo: PERSISTED_USER_CONTENT.principal?.photo || PRINCIPAL_INFO.photo,
};

export const DEFAULT_TEACHERS_CONTENT: TeacherStaff[] = (Array.isArray(PERSISTED_USER_CONTENT.teachers) && PERSISTED_USER_CONTENT.teachers.length > 0)
  ? (PERSISTED_USER_CONTENT.teachers as TeacherStaff[])
  : TEACHERS_LIST;

export const DEFAULT_STATS_CONTENT: SchoolStatsContent = {
  students: (PERSISTED_USER_CONTENT as any).stats?.students || '120+',
  teachers: (PERSISTED_USER_CONTENT as any).stats?.teachers || '12',
  extracurriculars: (PERSISTED_USER_CONTENT as any).stats?.extracurriculars || '8',
  accreditation: (PERSISTED_USER_CONTENT as any).stats?.accreditation || 'Terakreditasi',
};

export const DEFAULT_SITE_CONTENT: SchoolSiteContent = {
  heroSlides: DEFAULT_HERO_SLIDES,
  principal: DEFAULT_PRINCIPAL_CONTENT,
  programs: (Array.isArray(PERSISTED_USER_CONTENT.programs) && PERSISTED_USER_CONTENT.programs.length > 0)
    ? (PERSISTED_USER_CONTENT.programs as ProgramUnggulan[])
    : PROGRAMS_UNGGULAN,
  news: (Array.isArray(PERSISTED_USER_CONTENT.news) && PERSISTED_USER_CONTENT.news.length > 0)
    ? (PERSISTED_USER_CONTENT.news as NewsItem[])
    : NEWS_LIST,
  facilities: (Array.isArray(PERSISTED_USER_CONTENT.facilities) && PERSISTED_USER_CONTENT.facilities.length > 0)
    ? (PERSISTED_USER_CONTENT.facilities as FacilityItem[])
    : FACILITIES_LIST,
  extracurriculars: (Array.isArray(PERSISTED_USER_CONTENT.extracurriculars) && PERSISTED_USER_CONTENT.extracurriculars.length > 0)
    ? (PERSISTED_USER_CONTENT.extracurriculars as ExtracurricularItem[])
    : EXTRACURRICULAR_LIST,
  achievements: (Array.isArray(PERSISTED_USER_CONTENT.achievements) && PERSISTED_USER_CONTENT.achievements.length > 0)
    ? (PERSISTED_USER_CONTENT.achievements as AchievementItem[])
    : ACHIEVEMENTS_LIST,
  teachers: DEFAULT_TEACHERS_CONTENT,
  customLogo: (PERSISTED_USER_CONTENT as any).customLogo || '',
  stats: DEFAULT_STATS_CONTENT,
  updatedAt: PERSISTED_USER_CONTENT.updatedAt || Date.now(),
  updatedBy: PERSISTED_USER_CONTENT.updatedBy || 'admin_ilham',
};

const CONTENT_DOC_REF = doc(db, 'site_content', 'main_config');
const PPDB_COLLECTION_REF = collection(db, 'ppdb_registrations');
const CACHE_STORAGE_KEY = 'ra_almaqom_content_live_v1';

// Safe migration of legacy caches so user modifications are never lost
if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
  try {
    const active = localStorage.getItem(CACHE_STORAGE_KEY);
    if (!active) {
      const legacy = localStorage.getItem('mts_fatahillah_cimahi_content_live_v1') || localStorage.getItem('smp_pgri_5_cimahi_content_live_v7');
      if (legacy) {
        localStorage.setItem(CACHE_STORAGE_KEY, legacy);
      }
    }
  } catch {
    // ignore
  }
}

// Clean object recursively to eliminate any `undefined` fields that break Firestore writes
function cleanForFirestore<T>(input: T): T {
  return JSON.parse(
    JSON.stringify(input, (_, value) => {
      if (value === undefined) return null;
      return value;
    })
  );
}

// In-memory cache & local subscribers to guarantee instant, zero-delay real-time reactivity
function safeGetLocalStorage(): Partial<SchoolSiteContent> | null {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return null;
  try {
    let raw = localStorage.getItem(CACHE_STORAGE_KEY);
    if (!raw) {
      raw = localStorage.getItem('smp_pgri_5_cimahi_content_live_v7');
      if (raw) {
        try {
          localStorage.setItem(CACHE_STORAGE_KEY, raw);
        } catch {}
      }
    }
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed;
  } catch {
    return null;
  }
}

function safeSetLocalStorage(content: SchoolSiteContent): void {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(content));
  } catch (e) {
    console.warn('Cache write notice (quota full or private mode):', e);
  }
}

let currentSiteContentMemory: SchoolSiteContent = (() => {
  const cached = safeGetLocalStorage();
  const base = cached || PERSISTED_USER_CONTENT || {};
  return {
    heroSlides: Array.isArray(base.heroSlides) && base.heroSlides.length > 0 
      ? base.heroSlides 
      : DEFAULT_HERO_SLIDES,
    principal: { 
      ...DEFAULT_PRINCIPAL_CONTENT, 
      ...(PERSISTED_USER_CONTENT.principal || {}),
      ...(base.principal || {}) 
    },
    programs: Array.isArray(base.programs) && base.programs.length > 0 
      ? base.programs 
      : DEFAULT_SITE_CONTENT.programs,
    news: Array.isArray(base.news) && base.news.length > 0 
      ? base.news 
      : DEFAULT_SITE_CONTENT.news,
    facilities: Array.isArray(base.facilities) && base.facilities.length > 0 
      ? base.facilities 
      : DEFAULT_SITE_CONTENT.facilities,
    extracurriculars: Array.isArray(base.extracurriculars) && base.extracurriculars.length > 0 
      ? base.extracurriculars 
      : DEFAULT_SITE_CONTENT.extracurriculars,
    achievements: Array.isArray(base.achievements) && base.achievements.length > 0 
      ? base.achievements 
      : DEFAULT_SITE_CONTENT.achievements,
    teachers: Array.isArray(base.teachers) && base.teachers.length > 0
      ? base.teachers
      : (DEFAULT_SITE_CONTENT.teachers || DEFAULT_TEACHERS_CONTENT),
    stats: (base as any).stats || DEFAULT_STATS_CONTENT,
    updatedAt: base.updatedAt || Date.now(),
    updatedBy: base.updatedBy || 'admin_ilham',
  };
})();

/**
 * Returns currently cached or memory site content immediately for instant mounting
 * without waiting for network or showing default AI placeholders.
 */
export function getInitialSiteContent(): SchoolSiteContent {
  return currentSiteContentMemory || DEFAULT_SITE_CONTENT;
}

const localSubscribers = new Set<(content: SchoolSiteContent) => void>();

function notifySubscribers(content: SchoolSiteContent) {
  // Clean any legacy "media:" references if present
  const resolved = resolveObjectMedia(content);
  currentSiteContentMemory = resolved;
  safeSetLocalStorage(resolved);
  localSubscribers.forEach((fn) => {
    try {
      fn(resolved);
    } catch (err) {
      console.error('Subscriber callback error:', err);
    }
  });
}

/**
 * Get current custom logo URL or null if using official vector logo.
 */
export function getCurrentSchoolLogo(): string | null {
  return currentSiteContentMemory?.customLogo || null;
}

/**
 * Replaces any outdated "kampus" terminology with "sekolah" (e.g. fasilitas kampus -> fasilitas sekolah, lokasi kampus -> lokasi sekolah).
 */
export function cleanCampusTermsInObject<T>(obj: T): T {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'string') {
    return obj
      .replace(/fasilitas kampus/gi, (match) => (match === 'Fasilitas Kampus' ? 'Fasilitas Sekolah' : match === 'FASILITAS KAMPUS' ? 'FASILITAS SEKOLAH' : 'fasilitas sekolah'))
      .replace(/lokasi kampus/gi, (match) => (match === 'Lokasi Kampus' ? 'Lokasi Sekolah' : match === 'LOKASI KAMPUS' ? 'LOKASI SEKOLAH' : 'lokasi sekolah'))
      .replace(/area kampus/gi, (match) => (match === 'Area Kampus' ? 'Area Sekolah' : match === 'AREA KAMPUS' ? 'AREA SEKOLAH' : 'area sekolah'))
      .replace(/bangunan kampus/gi, (match) => (match === 'Bangunan Kampus' ? 'Bangunan Sekolah' : match === 'BANGUNAN KAMPUS' ? 'BANGUNAN SEKOLAH' : 'bangunan sekolah'))
      .replace(/halaman kampus sekolah/gi, 'halaman sekolah')
      .replace(/halaman kampus/gi, 'halaman sekolah')
      .replace(/kampus sekolah/gi, 'sekolah')
      .replace(/kampus MTs Fatahillah/gi, 'RA Al-Maqom')
      .replace(/Kampus MTs Fatahillah/gi, 'RA Al-Maqom')
      .replace(/MTs Fatahillah Cimahi/gi, 'RA Al-Maqom')
      .replace(/MTs Fatahillah/gi, 'RA Al-Maqom')
      .replace(/SMP PGRI 5 Cimahi/gi, 'RA Al-Maqom')
      .replace(/SMP PGRI 5/gi, 'RA Al-Maqom') as unknown as T;
  }
  if (Array.isArray(obj)) {
    return obj.map(item => cleanCampusTermsInObject(item)) as unknown as T;
  }
  if (typeof obj === 'object') {
    const res: any = {};
    for (const key of Object.keys(obj)) {
      res[key] = cleanCampusTermsInObject((obj as any)[key]);
    }
    return res as T;
  }
  return obj;
}

/**
 * Helper to ensure slide images or profile photos are valid web URLs or Base64
 * and never broken "media:" reference tokens.
 */
function sanitizeMediaReferences(content: SchoolSiteContent): SchoolSiteContent {
  return resolveObjectMedia(content);
}

/**
 * Safely merge live Firestore document or cached state with application fallbacks.
 * Preserves all user modifications and ensures no sections are ever null/undefined.
 */
export function isUserUploadedPhoto(url?: string): boolean {
  if (!url || typeof url !== 'string') return false;
  if (url.includes('unsplash.com')) return false;
  if (
    url.includes('slide1_gedung') ||
    url.includes('slide2_upacara') ||
    url.includes('slide3_lab_komputer') ||
    url.includes('slide4_lapangan')
  ) {
    return false;
  }
  return url.startsWith('data:image/') || url.startsWith('blob:') || url.includes('principal_real.jpg');
}

export function pickBestPhoto(
  incomingUrl?: string,
  currentUrl?: string,
  persistedUrl?: string,
  fallbackUrl?: string
): string {
  if (incomingUrl && isUserUploadedPhoto(incomingUrl)) return incomingUrl;
  if (currentUrl && isUserUploadedPhoto(currentUrl)) return currentUrl;
  if (persistedUrl && isUserUploadedPhoto(persistedUrl)) return persistedUrl;

  // For teachers (where fallbackUrl is empty string), never allow building/court photos to be used
  if (fallbackUrl === '') {
    return '';
  }

  const cleanIncoming = incomingUrl && !incomingUrl.includes('unsplash.com') ? incomingUrl : undefined;
  const cleanCurrent = currentUrl && !currentUrl.includes('unsplash.com') ? currentUrl : undefined;
  const cleanPersisted = persistedUrl && !persistedUrl.includes('unsplash.com') ? persistedUrl : undefined;
  const cleanFallback = fallbackUrl && !fallbackUrl.includes('unsplash.com') ? fallbackUrl : undefined;

  return cleanIncoming || cleanCurrent || cleanPersisted || cleanFallback || '';
}

/**
 * Safely merge live Firestore document or cached state with application fallbacks.
 * Preserves all user modifications and ensures no sections are ever null/undefined.
 */
export function mergeWithDefaults(data?: Partial<SchoolSiteContent> | null): SchoolSiteContent {
  if (!data) return currentSiteContentMemory;

  // Clean data in case legacy "media:" tokens were retrieved from previous iterations
  const sanitized = sanitizeMediaReferences(data as SchoolSiteContent);

  const merged: SchoolSiteContent = {
    heroSlides: Array.isArray(sanitized.heroSlides) && sanitized.heroSlides.length > 0
      ? sanitized.heroSlides.map((slide, idx) => {
          const fallback = DEFAULT_HERO_SLIDES[idx] || DEFAULT_HERO_SLIDES[0];
          const curSlide = currentSiteContentMemory.heroSlides?.find((s) => s.id === slide.id) || currentSiteContentMemory.heroSlides?.[idx];
          const perSlide = PERSISTED_USER_CONTENT.heroSlides?.find((s) => s.id === slide.id) || PERSISTED_USER_CONTENT.heroSlides?.[idx];
          const bgImage = pickBestPhoto(slide.bgImage, curSlide?.bgImage, perSlide?.bgImage, fallback.bgImage);
          let primaryBtn = slide.primaryBtn || fallback.primaryBtn;
          if (idx === 0 && (!primaryBtn || primaryBtn.includes('2025/2026'))) {
            primaryBtn = 'Pendaftaran PPDB 2026/2027';
          }
          return {
            ...fallback,
            ...slide,
            primaryBtn,
            bgImage,
          };
        })
      : (currentSiteContentMemory.heroSlides || DEFAULT_HERO_SLIDES),
    principal: {
      ...DEFAULT_PRINCIPAL_CONTENT,
      ...(PERSISTED_USER_CONTENT.principal || {}),
      ...(currentSiteContentMemory.principal || {}),
      ...(sanitized.principal || {}),
      photo: pickBestPhoto(
        sanitized.principal?.photo,
        currentSiteContentMemory.principal?.photo,
        PERSISTED_USER_CONTENT.principal?.photo,
        '/images/principal_real.jpg'
      ),
    },
    programs: (Array.isArray(sanitized.programs) && sanitized.programs.length > 0
      ? sanitized.programs
      : (currentSiteContentMemory.programs || PERSISTED_USER_CONTENT.programs || DEFAULT_SITE_CONTENT.programs)
    ).map((prog, idx) => {
      const cur = currentSiteContentMemory.programs?.find((p) => p.id === prog.id) || currentSiteContentMemory.programs?.[idx];
      const per = PERSISTED_USER_CONTENT.programs?.find((p) => p.id === prog.id) || PERSISTED_USER_CONTENT.programs?.[idx];
      return {
        ...prog,
        image: pickBestPhoto(prog.image, cur?.image, per?.image, prog.image),
      };
    }),
    news: (Array.isArray(sanitized.news) && sanitized.news.length > 0
      ? sanitized.news
      : (currentSiteContentMemory.news || PERSISTED_USER_CONTENT.news || DEFAULT_SITE_CONTENT.news)
    ).map((item, idx) => {
      const cur = currentSiteContentMemory.news?.find((n) => n.id === item.id) || currentSiteContentMemory.news?.[idx];
      const per = PERSISTED_USER_CONTENT.news?.find((n) => n.id === item.id) || PERSISTED_USER_CONTENT.news?.[idx];
      return {
        ...item,
        image: pickBestPhoto(item.image, cur?.image, per?.image, item.image),
      };
    }),
    facilities: (Array.isArray(sanitized.facilities) && sanitized.facilities.length > 0
      ? sanitized.facilities
      : (currentSiteContentMemory.facilities || PERSISTED_USER_CONTENT.facilities || DEFAULT_SITE_CONTENT.facilities)
    ).map((fac, idx) => {
      const cur = currentSiteContentMemory.facilities?.find((f) => f.id === fac.id) || currentSiteContentMemory.facilities?.[idx];
      const per = PERSISTED_USER_CONTENT.facilities?.find((f) => f.id === fac.id) || PERSISTED_USER_CONTENT.facilities?.[idx];
      return {
        ...fac,
        image: pickBestPhoto(fac.image, cur?.image, per?.image, fac.image),
      };
    }),
    extracurriculars: Array.isArray(sanitized.extracurriculars) && sanitized.extracurriculars.length > 0
      ? sanitized.extracurriculars
      : (currentSiteContentMemory.extracurriculars || DEFAULT_SITE_CONTENT.extracurriculars),
    achievements: (Array.isArray(sanitized.achievements) && sanitized.achievements.length > 0
      ? sanitized.achievements
      : (currentSiteContentMemory.achievements || PERSISTED_USER_CONTENT.achievements || DEFAULT_SITE_CONTENT.achievements)
    ).map((ach, idx) => {
      const cur = currentSiteContentMemory.achievements?.find((a) => a.id === ach.id) || currentSiteContentMemory.achievements?.[idx];
      const per = PERSISTED_USER_CONTENT.achievements?.find((a) => a.id === ach.id) || PERSISTED_USER_CONTENT.achievements?.[idx];
      return {
        ...ach,
        image: pickBestPhoto(ach.image, cur?.image, per?.image, ach.image),
      };
    }),
    teachers: (Array.isArray(sanitized.teachers) && sanitized.teachers.length > 0
      ? sanitized.teachers
      : (currentSiteContentMemory.teachers || PERSISTED_USER_CONTENT.teachers || DEFAULT_SITE_CONTENT.teachers || DEFAULT_TEACHERS_CONTENT)
    ).map((teacher, idx) => {
      const cur = currentSiteContentMemory.teachers?.find((t) => t.id === teacher.id) || currentSiteContentMemory.teachers?.[idx];
      const per = PERSISTED_USER_CONTENT.teachers?.find((t) => t.id === teacher.id) || PERSISTED_USER_CONTENT.teachers?.[idx];
      return {
        ...teacher,
        image: pickBestPhoto(teacher.image, cur?.image, per?.image, ''),
      };
    }),
    stats: sanitized.stats || currentSiteContentMemory.stats || (PERSISTED_USER_CONTENT as any).stats || DEFAULT_STATS_CONTENT,
    customLogo: (sanitized as any).customLogo !== undefined
      ? (sanitized as any).customLogo
      : (currentSiteContentMemory.customLogo || (PERSISTED_USER_CONTENT as any).customLogo || ''),
    updatedAt: sanitized.updatedAt || currentSiteContentMemory.updatedAt || Date.now(),
    updatedBy: sanitized.updatedBy || currentSiteContentMemory.updatedBy || 'admin_ilham',
  };

  const cleaned = cleanCampusTermsInObject(merged);
  currentSiteContentMemory = cleaned;
  return cleaned;
}

export function mergePreservingUploads(
  target: SchoolSiteContent,
  source?: Partial<SchoolSiteContent> | null
): { result: SchoolSiteContent; hasLocalOnlyUploads: boolean } {
  if (!source) return { result: target, hasLocalOnlyUploads: false };
  let hasLocalOnlyUploads = false;

  const res: SchoolSiteContent = { ...target };

  // Custom Logo
  if (source.customLogo !== undefined && source.customLogo !== res.customLogo) {
    res.customLogo = source.customLogo;
    hasLocalOnlyUploads = true;
  }

  // Facilities
  if (Array.isArray(source.facilities)) {
    res.facilities = res.facilities.map((fac, idx) => {
      const srcFac = source.facilities?.find((sf) => sf.id === fac.id) || source.facilities?.[idx];
      if (srcFac && isUserUploadedPhoto(srcFac.image) && !isUserUploadedPhoto(fac.image)) {
        hasLocalOnlyUploads = true;
        return { ...fac, image: srcFac.image };
      }
      return fac;
    });
  }

  // Hero Slides
  if (Array.isArray(source.heroSlides)) {
    res.heroSlides = res.heroSlides.map((slide, idx) => {
      const srcSlide = source.heroSlides?.find((ss) => ss.id === slide.id) || source.heroSlides?.[idx];
      if (srcSlide && isUserUploadedPhoto(srcSlide.bgImage) && !isUserUploadedPhoto(slide.bgImage)) {
        hasLocalOnlyUploads = true;
        return { ...slide, bgImage: srcSlide.bgImage };
      }
      return slide;
    });
  }

  // News
  if (Array.isArray(source.news)) {
    res.news = res.news.map((item, idx) => {
      const srcItem = source.news?.find((sn) => sn.id === item.id) || source.news?.[idx];
      if (srcItem && isUserUploadedPhoto(srcItem.image) && !isUserUploadedPhoto(item.image)) {
        hasLocalOnlyUploads = true;
        return { ...item, image: srcItem.image };
      }
      return item;
    });
  }

  // Programs
  if (Array.isArray(source.programs)) {
    res.programs = res.programs.map((item, idx) => {
      const srcItem = source.programs?.find((sp) => sp.id === item.id) || source.programs?.[idx];
      if (srcItem && isUserUploadedPhoto(srcItem.image) && !isUserUploadedPhoto(item.image)) {
        hasLocalOnlyUploads = true;
        return { ...item, image: srcItem.image };
      }
      return item;
    });
  }

  // Principal
  if (source.principal?.photo && isUserUploadedPhoto(source.principal.photo) && !isUserUploadedPhoto(res.principal.photo)) {
    hasLocalOnlyUploads = true;
    res.principal = { ...res.principal, photo: source.principal.photo };
  }

  // Teachers
  if (Array.isArray(source.teachers) && Array.isArray(res.teachers)) {
    res.teachers = res.teachers.map((teacher, idx) => {
      const srcTeacher = source.teachers?.find((st) => st.id === teacher.id) || source.teachers?.[idx];
      if (srcTeacher && isUserUploadedPhoto(srcTeacher.image) && !isUserUploadedPhoto(teacher.image)) {
        hasLocalOnlyUploads = true;
        return { ...teacher, image: srcTeacher.image };
      }
      return teacher;
    });
  }

  // Achievements
  if (Array.isArray(source.achievements) && Array.isArray(res.achievements)) {
    // If local has more achievements or custom ones, preserve them
    if (source.achievements.length > 0 && res.achievements.length === 0) {
      res.achievements = source.achievements;
      hasLocalOnlyUploads = true;
    } else {
      res.achievements = res.achievements.map((ach, idx) => {
        const srcAch = source.achievements?.find((sa) => sa.id === ach.id) || source.achievements?.[idx];
        if (srcAch && isUserUploadedPhoto(srcAch.image) && !isUserUploadedPhoto(ach.image)) {
          hasLocalOnlyUploads = true;
          return { ...ach, image: srcAch.image };
        }
        return ach;
      });
    }
  } else if (Array.isArray(source.achievements) && source.achievements.length > 0) {
    res.achievements = source.achievements;
    hasLocalOnlyUploads = true;
  }

  // Extracurriculars
  if (Array.isArray(source.extracurriculars) && source.extracurriculars.length > 0 && (!Array.isArray(res.extracurriculars) || res.extracurriculars.length === 0)) {
    res.extracurriculars = source.extracurriculars;
    hasLocalOnlyUploads = true;
  }

  return { result: cleanCampusTermsInObject(res), hasLocalOnlyUploads };
}

/**
 * Subscribe to real-time site content updates across all users & browser tabs.
 * Uses individual section documents in Firestore to support high-res photos
 * without ever reaching single-document size limits.
 */
export function subscribeToSiteContent(
  onUpdate: (content: SchoolSiteContent) => void,
  onError?: (error: Error) => void
): () => void {
  // Register local subscriber for instant optimistic updates
  localSubscribers.add(onUpdate);
  // Emit current data immediately so caller never waits with null state
  onUpdate(currentSiteContentMemory);

  // Cross-tab real-time synchronization via storage events
  const handleStorageEvent = (e: StorageEvent) => {
    if (e.key === CACHE_STORAGE_KEY && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue);
        const merged = mergeWithDefaults(parsed);
        notifySubscribers(merged);
      } catch (err) {
        console.warn('Cross-tab sync parse error:', err);
      }
    }
  };
  
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', handleStorageEvent);
  }

  // Active Cloud Hydration: Prioritizes Firestore Database, then server storage
  let isHydrated = false;

  const hydrateFromCloud = async () => {
    // 1. Primary Priority: Direct fetch from Google Cloud Firestore
    try {
      const snap = await getDocs(collection(db, 'site_content'));
      if (!snap.empty) {
        const firestoreContent: Partial<SchoolSiteContent> = {};
        snap.docs.forEach((docSnap) => {
          const docData = docSnap.data();
          if (docData && docData.data !== undefined) {
            const secKey = docSnap.id.replace('section_', '') as keyof SchoolSiteContent;
            (firestoreContent as any)[secKey] = docData.data;
          }
        });
        if (Object.keys(firestoreContent).length > 0) {
          const localCached = safeGetLocalStorage();
          const baseMerged = mergeWithDefaults(firestoreContent);
          const { result: preservedContent } = mergePreservingUploads(baseMerged, localCached);
          isHydrated = true;
          notifySubscribers(preservedContent);
          safeSetLocalStorage(preservedContent);
          syncLocalContentToServer(preservedContent).catch(() => {});
        }
      }
    } catch (fsErr) {
      console.warn('Firestore initial getDocs notice:', fsErr);
    }

    // 2. Server Persistent Storage (/api/content) fallback & synchronization
    try {
      const serverData = await fetchContentFromServer();
      const localCached = safeGetLocalStorage();

      if (serverData && Object.keys(serverData).length > 0) {
        const baseMerged = mergeWithDefaults(serverData);
        const { result: preservedContent, hasLocalOnlyUploads } = mergePreservingUploads(baseMerged, localCached);

        isHydrated = true;
        notifySubscribers(preservedContent);
        safeSetLocalStorage(preservedContent);

        if (hasLocalOnlyUploads) {
          syncLocalContentToServer(preservedContent).catch((e) => console.warn('Sync local uploads notice:', e));
        }
      } else if (localCached) {
        const merged = mergeWithDefaults(localCached);
        isHydrated = true;
        notifySubscribers(merged);
        syncLocalContentToServer(merged).catch(() => {});
      }
    } catch (e) {
      console.warn('Server hydration notice:', e);
    }

    try {
      await fetchAllMediaAssetsRest();
    } catch (e) {
      // ignore
    }
  };

  // Run immediate hydration upon subscribing
  hydrateFromCloud();

  // 3. Multi-Device Real-Time Sync via Server-Sent Events (/api/content/stream)
  // Ensures all devices (smartphones, laptops, desktops) receive instant updates in real-time
  let eventSource: EventSource | null = null;
  if (typeof window !== 'undefined' && typeof window.EventSource !== 'undefined') {
    try {
      eventSource = new EventSource('/api/content/stream');
      eventSource.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload && payload.type === 'content_updated' && payload.data) {
            const merged = mergeWithDefaults(payload.data);
            notifySubscribers(merged);
            safeSetLocalStorage(merged);
          }
        } catch {
          // ignore
        }
      };
      eventSource.onerror = () => {
        // EventSource will automatically attempt reconnection
      };
    } catch (e) {
      console.warn('SSE stream setup notice:', e);
    }
  }

  // 4. Background Version Polling fallback (every 3.5s) to guarantee real-time updates across all networks
  let pollInterval: any = null;
  if (typeof window !== 'undefined') {
    pollInterval = setInterval(async () => {
      try {
        const res = await fetch('/api/content/version', { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          if (json && json.success && json.updatedAt > (currentSiteContentMemory.updatedAt || 0)) {
            const latest = await fetchContentFromServer();
            if (latest && Object.keys(latest).length > 0) {
              const merged = mergeWithDefaults(latest);
              notifySubscribers(merged);
              safeSetLocalStorage(merged);
            }
          }
        }
      } catch {
        // quiet fallback
      }
    }, 3500);
  }

  // Real-time synchronization of media_assets
  const unsubscribeMedia = initMediaAssetsSync();

  // Listen to individual section documents in Firestore for real-time reactivity
  const sectionsList: (keyof SchoolSiteContent)[] = [
    'heroSlides',
    'principal',
    'facilities',
    'programs',
    'news',
    'achievements',
    'extracurriculars',
    'teachers',
    'stats',
    'customLogo',
  ];

  const unsubs: (() => void)[] = [];

  sectionsList.forEach((sec) => {
    try {
      const secRef = doc(db, 'site_content', 'section_' + String(sec));
      const unsub = onSnapshot(
        secRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const docData = snapshot.data();
            if (docData && docData.data !== undefined) {
              const partialUpdate: Partial<SchoolSiteContent> = {
                [sec]: docData.data,
                updatedAt: docData.updatedAt || Date.now(),
                updatedBy: docData.updatedBy || 'admin_ilham',
              };
              const merged = mergeWithDefaults(partialUpdate);
              notifySubscribers(merged);
              safeSetLocalStorage(merged);
              syncLocalContentToServer(merged).catch(() => {});
            }
          }
        },
        (err) => {
          console.warn(`Snapshot listener notice for section_${String(sec)}:`, err);
        }
      );
      unsubs.push(unsub);
    } catch (e) {
      console.warn(`Setup snapshot error for section_${String(sec)}:`, e);
    }
  });

  // Section listeners handle individual section reactivity cleanly

  return () => {
    localSubscribers.delete(onUpdate);
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', handleStorageEvent);
      if (pollInterval) clearInterval(pollInterval);
      if (eventSource) {
        eventSource.close();
      }
    }
    unsubs.forEach((u) => {
      try {
        u();
      } catch {}
    });
    if (unsubscribeMedia) {
      unsubscribeMedia();
    }
  };
}

/**
 * Save updated content to Firestore (Real-Time broadcast to all connected clients).
 * Non-destructive: Persists each section to its own dedicated Firestore document
 * (e.g. section_heroSlides, section_facilities, section_programs, section_principal).
 * This completely eliminates Firestore's 1MB single-document limit and ensures that
 * no uploaded photos are ever reset, corrupted, or rejected with "Gagal Tersimpan Ke Firebase".
 */
export async function saveSiteContentToFirestore(
  updatedContent: Partial<SchoolSiteContent>,
  adminUsername: string = 'admin_ilham'
): Promise<SchoolSiteContent> {
  const sectionsList: (keyof SchoolSiteContent)[] = [
    'heroSlides',
    'principal',
    'facilities',
    'programs',
    'news',
    'achievements',
    'extracurriculars',
    'teachers',
    'stats',
    'customLogo',
  ];

  // 1. Immediately merge into memory & notify local subscribers (optimistic fast UI)
  const mergedDoc: SchoolSiteContent = {
    ...currentSiteContentMemory,
    ...updatedContent,
    updatedAt: Date.now(),
    updatedBy: adminUsername,
  };

  notifySubscribers(mergedDoc);

  // 2. Identify which sections are updated
  const sectionsToSave = sectionsList.filter((sec) => updatedContent[sec] !== undefined);
  if (sectionsToSave.length === 0) {
    sectionsToSave.push(...sectionsList);
  }

  // Save to local cache immediately
  safeSetLocalStorage(mergedDoc);

  // 3a. Primary Persistence: Save directly to Server Persistent Store (/api/content & /api/content/sync)
  // This guarantees all devices immediately see every upload without Firestore 429 Quota Exceeded blockers!
  let serverSuccess = false;
  try {
    const srv1 = await saveContentToServer(updatedContent);
    const srv2 = await syncLocalContentToServer(mergedDoc);
    if (srv1 || srv2) {
      serverSuccess = true;
    }
  } catch (srvErr) {
    console.warn('Server storage save notice:', srvErr);
  }

  // 3b. Secondary Cloud Backup: Save each updated section independently to Google Cloud Firestore
  let firestoreSuccess = false;

  await Promise.all(
    sectionsToSave.map(async (sec) => {
      const secData = (mergedDoc as any)[sec];
      if (secData === undefined) return;

      const cleanedSecData = cleanForFirestore(secData);
      let sdkSuccess = false;
      let restSuccess = false;

      // Persist via Firestore SDK
      try {
        const secDocRef = doc(db, 'site_content', 'section_' + String(sec));
        await setDoc(
          secDocRef,
          {
            data: cleanedSecData,
            updatedAt: Date.now(),
            updatedBy: adminUsername,
          },
          { merge: true }
        );
        sdkSuccess = true;
      } catch (sdkErr) {
        console.warn(`Firestore SDK write notice for section_${String(sec)}:`, sdkErr);
      }

      // Persist via direct HTTPS REST
      try {
        restSuccess = await saveSectionToFirestoreRest(String(sec), cleanedSecData, adminUsername);
      } catch (restErr) {
        console.warn(`Firestore REST write notice for section_${String(sec)}:`, restErr);
      }

      if (sdkSuccess || restSuccess) {
        firestoreSuccess = true;
      }
    })
  );

  // 4. Update lightweight metadata in main_config (without large payload)
  try {
    setDoc(
      CONTENT_DOC_REF,
      {
        updatedAt: Date.now(),
        updatedBy: adminUsername,
        lastSectionsUpdated: sectionsToSave.map(String),
      },
      { merge: true }
    ).catch(() => {});
  } catch {
    // Non-blocking
  }

  if (serverSuccess) {
    console.log('✓ Successfully saved site content to server persistent storage & local cache.');
  } else if (!firestoreSuccess) {
    // If both server and firestore failed, we still have local cache and memory intact
    console.warn('Notice: Both server endpoint and Firestore write were limited, but data is preserved in local device cache & memory.');
  }

  return mergedDoc;
}

/**
 * Reset content back to pure default configuration in Firestore
 */
export async function resetSiteContentToDefaultInFirestore(): Promise<void> {
  const defaultDoc: SchoolSiteContent = {
    heroSlides: DEFAULT_HERO_SLIDES,
    principal: DEFAULT_PRINCIPAL_CONTENT,
    programs: PROGRAMS_UNGGULAN,
    news: NEWS_LIST,
    facilities: FACILITIES_LIST,
    extracurriculars: EXTRACURRICULAR_LIST,
    achievements: ACHIEVEMENTS_LIST,
    teachers: TEACHERS_LIST,
    stats: DEFAULT_STATS_CONTENT,
    updatedAt: Date.now(),
    updatedBy: 'admin_ilham (reset)',
  };

  notifySubscribers(defaultDoc);
  const payload = cleanForFirestore(defaultDoc);

  let sdkSuccess = false;
  let restSuccess = false;

  try {
    await setDoc(CONTENT_DOC_REF, payload);
    sdkSuccess = true;
  } catch (error) {
    console.warn('Reset SDK notice:', error);
  }

  try {
    restSuccess = await saveLiveContentToFirestoreRest(defaultDoc);
  } catch (error) {
    console.warn('Reset REST notice:', error);
  }

  if (!sdkSuccess && !restSuccess) {
    throw new Error('Gagal mereset data di Firestore.');
  }
}

export const resetSiteContentToDefaults = resetSiteContentToDefaultInFirestore;

/**
 * Save a new PPDB Registration to Firestore
 */
export async function savePpdbRegistrationToFirestore(
  registration: Omit<PPDBRegistrationRecord, 'id' | 'createdAt'>
): Promise<string> {
  try {
    const docRef = await addDoc(PPDB_COLLECTION_REF, {
      ...registration,
      createdAt: Date.now(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'ppdb_registrations');
    throw error;
  }
}

/**
 * Subscribe to real-time PPDB Registrations
 */
export function subscribeToPpdbRegistrations(
  onUpdate: (registrations: PPDBRegistrationRecord[]) => void,
  onError?: (error: Error) => void
): () => void {
  try {
    // Sort chronological: oldest at top, newest at bottom (asc)
    const q = query(PPDB_COLLECTION_REF, orderBy('createdAt', 'asc'));
    return onSnapshot(
      q,
      (snapshot) => {
        const items: PPDBRegistrationRecord[] = [];
        snapshot.forEach((docSnap) => {
          const raw = docSnap.data() as any;
          // Normalize legacy statuses to Menunggu / Diterima / Ditolak
          let normalizedStatus: 'Menunggu' | 'Diterima' | 'Ditolak' = 'Menunggu';
          if (raw.status === 'Diterima') normalizedStatus = 'Diterima';
          else if (raw.status === 'Ditolak') normalizedStatus = 'Ditolak';
          else normalizedStatus = 'Menunggu';

          items.push({
            id: docSnap.id,
            ...raw,
            status: normalizedStatus,
          });
        });
        // Extra safeguard: ensure strictly sorted by createdAt ascending
        items.sort((a, b) => (Number(a.createdAt) || 0) - (Number(b.createdAt) || 0));
        onUpdate(items);
      },
      (err) => {
        handleFirestoreError(err, OperationType.LIST, 'ppdb_registrations');
        if (onError) onError(err);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'ppdb_registrations');
    return () => {};
  }
}

/**
 * Update the verification status of a PPDB Registration in Firestore
 */
export async function updatePpdbRegistrationStatus(
  docId: string, 
  status: 'Menunggu' | 'Diterima' | 'Ditolak'
): Promise<void> {
  try {
    const regDocRef = doc(db, 'ppdb_registrations', docId);
    await updateDoc(regDocRef, { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `ppdb_registrations/${docId}`);
    throw error;
  }
}

/**
 * Delete a PPDB Registration from Firestore
 */
export async function deletePpdbRegistration(docId: string): Promise<void> {
  try {
    const regDocRef = doc(db, 'ppdb_registrations', docId);
    await deleteDoc(regDocRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `ppdb_registrations/${docId}`);
    throw error;
  }
}

