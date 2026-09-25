import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Compass, 
  Trophy, 
  Globe, 
  ShieldCheck, 
  Atom, 
  ChevronRight, 
  CheckCircle2, 
  X,
  BookOpen,
  Monitor,
  Heart,
  Clock,
  Layers,
  Award,
  CalendarCheck,
  Check
} from 'lucide-react';
import { PROGRAMS_UNGGULAN } from '../data/schoolData';
import { ProgramUnggulan } from '../types';

export type AcademicFilterType = 'all' | 'kurikulum' | 'anbk' | 'karakter';

interface ProgramsSectionProps {
  programsData?: ProgramUnggulan[];
  activeFilter?: AcademicFilterType;
  onFilterChange?: (filter: AcademicFilterType) => void;
}

export const ProgramsSection: React.FC<ProgramsSectionProps> = ({ 
  programsData,
  activeFilter = 'all',
  onFilterChange
}) => {
  const [selectedProgram, setSelectedProgram] = useState<ProgramUnggulan | null>(null);
  const [currentTab, setCurrentTab] = useState<AcademicFilterType>(activeFilter);

  // Synchronize internal state with external prop if it changes
  useEffect(() => {
    if (activeFilter) {
      setCurrentTab(activeFilter);
    }
  }, [activeFilter]);

  const handleTabSelect = (filter: AcademicFilterType) => {
    setCurrentTab(filter);
    if (onFilterChange) {
      onFilterChange(filter);
    }
  };

  const programs = (programsData && programsData.length > 0) ? programsData : PROGRAMS_UNGGULAN;

  // Filter programs based on the selected academic category
  const filteredPrograms = programs.filter((prog) => {
    if (currentTab === 'all') return true;

    if (currentTab === 'kurikulum') {
      return prog.id === 'p5' || 
             prog.id === 'seni' || 
             prog.badge.toLowerCase().includes('kurikulum') || 
             prog.title.toLowerCase().includes('profil pelajar pancasila') ||
             prog.title.toLowerCase().includes('kurikulum') ||
             prog.badge.toLowerCase().includes('bakat');
    }

    if (currentTab === 'anbk') {
      return prog.id === 'anbk' || 
             prog.badge.toLowerCase().includes('digital') || 
             prog.title.toLowerCase().includes('anbk') || 
             prog.title.toLowerCase().includes('komputer') || 
             prog.title.toLowerCase().includes('cbt');
    }

    if (currentTab === 'karakter') {
      return prog.id === 'religius' || 
             prog.id === 'pramuka' || 
             prog.badge.toLowerCase().includes('karakter') || 
             prog.badge.toLowerCase().includes('disiplin') || 
             prog.title.toLowerCase().includes('sholat') || 
             prog.title.toLowerCase().includes('pramuka');
    }

    return true;
  });

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Compass':
        return <Compass className="w-6 h-6" />;
      case 'Trophy':
        return <Trophy className="w-6 h-6" />;
      case 'Globe':
        return <Globe className="w-6 h-6" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6" />;
      case 'Atom':
        return <Atom className="w-6 h-6" />;
      case 'Monitor':
        return <Monitor className="w-6 h-6" />;
      case 'Heart':
        return <Heart className="w-6 h-6" />;
      case 'BookOpen':
        return <BookOpen className="w-6 h-6" />;
      default:
        return <Sparkles className="w-6 h-6" />;
    }
  };

  return (
    <section id="program" className="py-12 sm:py-16 bg-slate-50/60 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-3">
            <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
            <span>Pilar Keunggulan Akademik</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Informasi & Program Pendidikan <span className="text-emerald-700">RA Al-Maqom</span>
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            Pilih sub-kategori di bawah ini untuk melihat kurikulum merdeka PAUD, bimbingan tahfidz cilik & doa harian, serta pembiasaan karakter budi pekerti secara terstruktur.
          </p>
        </div>

        {/* 3 Sub-Menu Interactive Category Tabs */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-10">
          <button
            onClick={() => handleTabSelect('all')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-xs ${
              currentTab === 'all'
                ? 'bg-slate-900 text-white shadow-md scale-102 ring-2 ring-slate-900/20'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Semua Akademik</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-200">
              {programs.length}
            </span>
          </button>

          <button
            onClick={() => handleTabSelect('kurikulum')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-xs ${
              currentTab === 'kurikulum'
                ? 'bg-emerald-700 text-white shadow-md scale-102 ring-2 ring-emerald-700/20'
                : 'bg-white text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-500" />
            <span>Kurikulum Merdeka Mandiri</span>
          </button>

          <button
            onClick={() => handleTabSelect('anbk')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-xs ${
              currentTab === 'anbk'
                ? 'bg-emerald-700 text-white shadow-md scale-102 ring-2 ring-emerald-700/20'
                : 'bg-white text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200'
            }`}
          >
            <Monitor className="w-4 h-4 text-blue-500" />
            <span>ANBK & Literasi Digital</span>
          </button>

          <button
            onClick={() => handleTabSelect('karakter')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-xs ${
              currentTab === 'karakter'
                ? 'bg-emerald-700 text-white shadow-md scale-102 ring-2 ring-emerald-700/20'
                : 'bg-white text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200'
            }`}
          >
            <Heart className="w-4 h-4 text-rose-500" />
            <span>Pembiasaan & Karakter</span>
          </button>
        </div>

        {/* Dynamic Deep-Dive Feature Spotlight Card (Changes based on selected filter) */}
        <div className="mb-12 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

          {currentTab === 'kurikulum' && (
            <div className="animate-in fade-in duration-300">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                <div className="max-w-3xl">
                  <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold mb-2">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Fokus: Kurikulum Merdeka Mandiri Belajar</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    Pembelajaran Berdiferensiasi & Projek Penguatan Profil Pelajar Pancasila (P5)
                  </h3>
                  <p className="mt-2 text-slate-600 text-xs sm:text-sm leading-relaxed">
                    RA Al-Maqom mengimplementasikan Kurikulum Merdeka PAUD/RA dengan pendekatan berpusat pada anak yang memberi ruang eksplorasi, bermain sambil belajar, dan penguatan nilai-nilai Islami.
                  </p>
                </div>

                <div className="bg-emerald-50/80 rounded-2xl p-4 border border-emerald-200/80 shrink-0 text-center sm:text-left">
                  <div className="text-xs font-bold text-emerald-900">Jadwal Gelar Karya P5</div>
                  <div className="text-sm font-extrabold text-emerald-700 mt-0.5">Semester Ganjil & Genap</div>
                  <div className="text-[11px] text-slate-500 mt-1">Tema: Kearifan Lokal & Gaya Hidup Berkelanjutan</div>
                </div>
              </div>

              {/* 4 Pillars of Kurikulum Merdeka */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs mb-3">
                    01
                  </div>
                  <div className="font-bold text-slate-900 text-sm">Pembelajaran Berdiferensiasi</div>
                  <div className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Guru mengelompokkan materi dan metode sesuai kesiapan belajar, gaya belajar visual/auditori, serta minat murid.
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs mb-3">
                    02
                  </div>
                  <div className="font-bold text-slate-900 text-sm">Kokurikuler P5 Terpadu</div>
                  <div className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Alokasi 20–25% jam belajar untuk riset karya nyata, pengolahan daur ulang sampah, dan pelestarian budaya Sunda.
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs mb-3">
                    03
                  </div>
                  <div className="font-bold text-slate-900 text-sm">Asesmen Formatif & Sumatif</div>
                  <div className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Evaluasi komprehensif mengukur daya nalar kritis dan pemecahan masalah kontekstual, bukan hafalan rumus kaku.
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs mb-3">
                    04
                  </div>
                  <div className="font-bold text-slate-900 text-sm">Konseling Minat & Karir</div>
                  <div className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Bimbingan intensif persiapan pilihan peminatan saat lulus dan melanjutkan ke jenjang SMA/SMK di Kota Cimahi & Bandung.
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentTab === 'anbk' && (
            <div className="animate-in fade-in duration-300">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                <div className="max-w-3xl">
                  <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-800 border border-blue-200 px-3 py-1 rounded-full text-xs font-bold mb-2">
                    <Monitor className="w-3.5 h-3.5 text-blue-600" />
                    <span>Fokus: Asesmen Nasional & Literasi Komputer</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    Kesiapan Laboratorium CBT Mandiri & Penguasaan Literasi Digital
                  </h3>
                  <p className="mt-2 text-slate-600 text-xs sm:text-sm leading-relaxed">
                    RA Al-Maqom menghadirkan fasilitas pengenalan literasi digital dan multimedia interaktif anak usia dini dengan suasana belajar berpendingin udara dan ramah anak.
                  </p>
                </div>

                <div className="bg-blue-50/80 rounded-2xl p-4 border border-blue-200/80 shrink-0 text-center sm:text-left">
                  <div className="text-xs font-bold text-blue-900">Status Penyelenggaraan ANBK</div>
                  <div className="text-sm font-extrabold text-blue-700 mt-0.5">Mandiri 100% CBT</div>
                  <div className="text-[11px] text-slate-500 mt-1">Lab Komputer AC & Fiber Optic Dedicated</div>
                </div>
              </div>

              {/* 4 Pillars of ANBK & Digital */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs mb-3">
                    01
                  </div>
                  <div className="font-bold text-slate-900 text-sm">Lab CBT Terstandar</div>
                  <div className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Ruang lab nyaman berpendingin AC, puluhan unit PC berspesifikasi resmi Kemendikbud, serta LAN gigabit stabil.
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs mb-3">
                    02
                  </div>
                  <div className="font-bold text-slate-900 text-sm">Simulasi & Gladi Bersih</div>
                  <div className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Siswa dilatih rutin mengerjakan soal AKM literasi membaca, penalaran numerasi, survei karakter, dan survei lingkungan.
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs mb-3">
                    03
                  </div>
                  <div className="font-bold text-slate-900 text-sm">Mata Pelajaran Informatika</div>
                  <div className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Kurikulum mengajarkan dasar aplikasi perkantoran, desain presentasi, etika internet sehat, dan logika komputasi.
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs mb-3">
                    04
                  </div>
                  <div className="font-bold text-slate-900 text-sm">Asesmen Paperless</div>
                  <div className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Penilaian tengah semester dan akhir semester dilakukan via portal digital ramah lingkungan dan hasil instan.
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentTab === 'karakter' && (
            <div className="animate-in fade-in duration-300">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                <div className="max-w-3xl">
                  <div className="inline-flex items-center gap-2 bg-rose-50 text-rose-800 border border-rose-200 px-3 py-1 rounded-full text-xs font-bold mb-2">
                    <Heart className="w-3.5 h-3.5 text-rose-600" />
                    <span>Fokus: Pembiasaan Religius & Akhlak Mulia</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    Pembiasaan Ibadah Harian, Budaya 5S Santun, dan Kepanduan Disiplin
                  </h3>
                  <p className="mt-2 text-slate-600 text-xs sm:text-sm leading-relaxed">
                    Pendidikan di RA Al-Maqom menyeimbangkan keceriaan masa kecil dengan kematangan spiritual. Nilai-nilai keteladanan, rasa hormat, adab makan/minum, dan doa harian ditanamkan dengan penuh kasih sayang.
                  </p>
                </div>

                <div className="bg-rose-50/80 rounded-2xl p-4 border border-rose-200/80 shrink-0 text-center sm:text-left">
                  <div className="text-xs font-bold text-rose-900">Rutinitas Ibadah Harian</div>
                  <div className="text-sm font-extrabold text-rose-700 mt-0.5">Sholat Dhuha & Dzuhur</div>
                  <div className="text-[11px] text-slate-500 mt-1">Musala Sekolah & Pembacaan Asmaul Husna</div>
                </div>
              </div>

              {/* 4 Pillars of Karakter */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center font-bold text-xs mb-3">
                    01
                  </div>
                  <div className="font-bold text-slate-900 text-sm">Sholat Dhuha & Dzuhur Bersama</div>
                  <div className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Setiap hari siswa dibimbing sholat dhuha berjamaah dan sholat dzuhur bergantian sebelum kepulangan sekolah.
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center font-bold text-xs mb-3">
                    02
                  </div>
                  <div className="font-bold text-slate-900 text-sm">Tadarus Al-Qur'an Pagi</div>
                  <div className="text-xs text-slate-600 mt-1 leading-relaxed">
                    15 menit sebelum pelajaran jam pertama, seluruh kelas membaca juz amma dan asmaul husna secara serentak.
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center font-bold text-xs mb-3">
                    03
                  </div>
                  <div className="font-bold text-slate-900 text-sm">Budaya Santun 5S</div>
                  <div className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Senyum, Salam, Sapa, Sopan, dan Santun kepada bapak/ibu guru serta menyayangi sesama teman tanpa perundungan.
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center font-bold text-xs mb-3">
                    04
                  </div>
                  <div className="font-bold text-slate-900 text-sm">Pramuka & Disiplin Positif</div>
                  <div className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Kepramukaan gugus depan melatih kekompakan, kemandirian, tanggung jawab tugas, serta jiwa kepemimpinan siswa.
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentTab === 'all' && (
            <div className="animate-in fade-in duration-300">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                <div className="max-w-3xl">
                  <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-full text-xs font-bold mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Integrasi 3 Pilar Utama</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    Sinergi Kurikulum Merdeka, Literasi Digital, dan Karakter Religius
                  </h3>
                  <p className="mt-2 text-slate-600 text-xs sm:text-sm leading-relaxed">
                    Di RA Al-Maqom, kami mengintegrasikan 3 dimensi pembelajaran: stimulasi perkembangan anak berbasis kurikulum merdeka, sarana pembelajaran aktif yang menyenangkan, serta pembiasaan adab dan akhlakul karimah.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Klik tab di atas untuk menyaring informasi spesifik.</span>
                </div>
              </div>

              {/* 3 Pillars Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div 
                  onClick={() => handleTabSelect('kurikulum')}
                  className="p-5 rounded-2xl bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-200/80 cursor-pointer transition-all hover:scale-102 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <ChevronRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <h4 className="font-bold text-slate-900 mt-3 text-base">Kurikulum Merdeka Mandiri</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Pembelajaran berdiferensiasi, asesmen holistik, dan gelar pameran karya P5 semesteran.
                  </p>
                </div>

                <div 
                  onClick={() => handleTabSelect('anbk')}
                  className="p-5 rounded-2xl bg-blue-50/50 hover:bg-blue-50 border border-blue-200/80 cursor-pointer transition-all hover:scale-102 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                      <Monitor className="w-5 h-5" />
                    </div>
                    <ChevronRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <h4 className="font-bold text-slate-900 mt-3 text-base">ANBK & Literasi Digital</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Lab CBT modern, simulasi asesmen nasional, dan kurikulum informatika terpadu.
                  </p>
                </div>

                <div 
                  onClick={() => handleTabSelect('karakter')}
                  className="p-5 rounded-2xl bg-rose-50/50 hover:bg-rose-50 border border-rose-200/80 cursor-pointer transition-all hover:scale-102 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold">
                      <Heart className="w-5 h-5" />
                    </div>
                    <ChevronRight className="w-4 h-4 text-rose-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <h4 className="font-bold text-slate-900 mt-3 text-base">Pembiasaan & Karakter Mulia</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Sholat dhuha & dzuhur berjamaah, tadarus pagi juz amma, budaya 5S, dan kepramukaan aktif.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section Sub-heading for Program Cards */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
              {currentTab === 'all' && 'Daftar Seluruh Program Akademik & Pembiasaan'}
              {currentTab === 'kurikulum' && 'Program Kurikulum Merdeka & Gelar Karya P5'}
              {currentTab === 'anbk' && 'Fasilitas & Program Literasi Komputer CBT'}
              {currentTab === 'karakter' && 'Program Pembiasaan Religius & Kedisiplinan'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Menampilkan {filteredPrograms.length} program akademik unggulan
            </p>
          </div>

          {currentTab !== 'all' && (
            <button
              onClick={() => handleTabSelect('all')}
              className="text-xs text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200"
            >
              <span>Tampilkan Semua Program</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPrograms.map((program) => (
            <div
              key={program.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              {/* Card Image */}
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={program.image}
                  alt={program.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-black/20 to-transparent" />
                
                {/* Badge */}
                <div className="absolute top-3 left-3 bg-emerald-700/90 backdrop-blur-md text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30">
                  {program.badge}
                </div>

                {/* Floating Icon */}
                <div className="absolute bottom-3 left-3 w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-lg">
                  {getIcon(program.icon)}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {program.title}
                  </h3>
                  <p className="mt-2 text-slate-600 text-sm leading-relaxed line-clamp-3">
                    {program.shortDesc}
                  </p>

                  {/* Highlights preview */}
                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-1.5">
                    {program.highlights.slice(0, 2).map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span className="truncate">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action button */}
                <button
                  onClick={() => setSelectedProgram(program)}
                  className="mt-6 w-full py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-emerald-50 text-emerald-800 text-xs font-bold border border-slate-200 hover:border-emerald-300 transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Lihat Detail Program</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Modal Detail Program */}
      {selectedProgram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 relative max-h-[90vh] flex flex-col">
            
            {/* Modal Header with Image */}
            <div className="relative h-56 w-full">
              <img
                src={selectedProgram.image}
                alt={selectedProgram.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <button
                onClick={() => setSelectedProgram(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-6 right-6">
                <span className="bg-emerald-600 text-amber-300 text-xs font-bold px-3 py-1 rounded-full">
                  {selectedProgram.badge}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-2">
                  {selectedProgram.title}
                </h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-4">
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                {selectedProgram.fullDesc}
              </p>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-3">
                  Poin Keunggulan Utama
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedProgram.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setSelectedProgram(null)}
                  className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-colors"
                >
                  Tutup Informasi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
