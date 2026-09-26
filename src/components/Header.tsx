import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, 
  Mail, 
  Clock, 
  MapPin, 
  Menu, 
  X, 
  ChevronDown, 
  Search, 
  GraduationCap, 
  Award,
  BookOpen,
  Users,
  Building2,
  Sparkles,
  Lock,
  ShieldCheck,
  LogOut,
  User,
  Sliders,
  Trophy,
  Newspaper
} from 'lucide-react';
import { SCHOOL_INFO } from '../data/schoolData';
import { SchoolLogo } from './SchoolLogo';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSearch: () => void;
  onOpenPsbModal: () => void;
  isAdmin: boolean;
  onOpenAdminLogin: () => void;
  onOpenAdminDashboard: () => void;
  onLogoutAdmin: () => void;
  onSelectAcademicFilter?: (filter: 'all' | 'kurikulum' | 'anbk' | 'karakter') => void;
  customLogo?: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenSearch,
  onOpenPsbModal,
  isAdmin,
  onOpenAdminLogin,
  onOpenAdminDashboard,
  onLogoutAdmin,
  onSelectAcademicFilter,
  customLogo,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<'profil' | 'akademik' | 'kesiswaan' | 'informasi' | null>(null);

  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navContainerRef = useRef<HTMLDivElement | null>(null);

  const handleOpenDropdown = (menu: 'profil' | 'akademik' | 'kesiswaan' | 'informasi') => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setActiveDropdown(menu);
  };

  const handleToggleDropdown = (menu: 'profil' | 'akademik' | 'kesiswaan' | 'informasi') => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setActiveDropdown((prev) => (prev === menu ? null : menu));
  };

  const handleCloseDropdown = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    // 380ms generous buffer guarantees the submenu never detaches on laptop trackpads
    closeTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 380);
  };

  const handleCancelClose = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handlePointerDownOutside = (event: MouseEvent | TouchEvent) => {
      if (navContainerRef.current && !navContainerRef.current.contains(event.target as Node)) {
        if (closeTimeoutRef.current) {
          clearTimeout(closeTimeoutRef.current);
          closeTimeoutRef.current = null;
        }
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handlePointerDownOutside);
    document.addEventListener('touchstart', handlePointerDownOutside);
    return () => {
      document.removeEventListener('mousedown', handlePointerDownOutside);
      document.removeEventListener('touchstart', handlePointerDownOutside);
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (tab: string, academicSub?: 'all' | 'kurikulum' | 'anbk' | 'karakter') => {
    setActiveTab(tab);
    if (academicSub && onSelectAcademicFilter) {
      onSelectAcademicFilter(academicSub);
    }
    setMobileMenuOpen(false);
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setActiveDropdown(null);
    
    // Always land cleanly and accurately at the top of the selected page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="w-full sticky top-0 z-50 transition-all duration-300 shadow-md select-none">
      {/* Main Navbar */}
      <nav className={`w-full bg-white transition-all duration-300 border-b border-slate-100 ${
        isScrolled ? 'py-2 sm:py-2.5 shadow-md' : 'py-3 sm:py-3.5'
      }`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo Brand & School Title */}
          <div 
            onClick={() => handleNavClick('beranda')}
            className="flex items-center gap-2.5 sm:gap-3.5 cursor-pointer group min-w-0"
          >
            {/* Official RA Al-Maqom Vector Logo */}
            <div className="relative group-hover:scale-105 transition-transform duration-300 shrink-0">
              <SchoolLogo className="w-10 h-10 sm:w-[50px] sm:h-[50px]" size={50} customSrc={customLogo} />
            </div>

            <div className="flex flex-col justify-center min-w-0">
              {/* Title: 1 jajar penuh "RA Al-Maqom" */}
              <div className="flex items-center leading-none">
                <span className="text-[15px] xs:text-[16px] sm:text-2xl font-black text-slate-900 tracking-tight group-hover:text-emerald-800 transition-colors whitespace-nowrap">
                  RA Al-Maqom
                </span>
              </div>

              {/* Subtitle / Slogan */}
              <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold mt-1 leading-none">
                <span className="text-emerald-800 font-bold sm:font-extrabold tracking-wide uppercase truncate">
                  <span className="inline sm:hidden">Ceria • Cerdas • Berakhlak</span>
                  <span className="hidden sm:inline">CERIA • ISLAMI • CERDAS • BERAKHLAKUL KARIMAH</span>
                </span>
                <span className="text-slate-300 hidden md:inline">|</span>
                <span className="hidden md:inline text-slate-600 font-normal">
                  Yayasan Al-Maqom
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links (With Seamless Hover Bridge & Zero Detachment) */}
          <div ref={navContainerRef} className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {/* 1. Beranda */}
            <button
              id="nav-beranda"
              onClick={() => handleNavClick('beranda')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                activeTab === 'beranda'
                  ? 'text-emerald-800 bg-emerald-50 shadow-xs border border-emerald-200/60'
                  : 'text-slate-700 hover:text-emerald-700 hover:bg-slate-50'
              }`}
            >
              Beranda
            </button>

            {/* 2. Profil ▾ */}
            <div 
              className="relative py-1"
              onMouseEnter={() => handleOpenDropdown('profil')}
              onMouseLeave={handleCloseDropdown}
            >
              <button
                id="nav-profil-btn"
                onClick={() => handleToggleDropdown('profil')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap flex items-center gap-1 transition-all ${
                  activeTab === 'profil' || activeTab === 'sejarah' || activeTab === 'guru-staf' || activeTab === 'fasilitas' || activeDropdown === 'profil'
                    ? 'text-emerald-800 bg-emerald-50 shadow-xs border border-emerald-200/60'
                    : 'text-slate-700 hover:text-emerald-700 hover:bg-slate-50'
                }`}
              >
                <span>Profil</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'profil' ? 'rotate-180 text-emerald-700' : ''}`} />
              </button>

              {activeDropdown === 'profil' && (
                <div 
                  className="absolute left-0 top-full pt-2 w-72 z-50 animate-in fade-in zoom-in-95 duration-150 before:content-[''] before:absolute before:-top-3 before:left-0 before:right-0 before:h-4 before:bg-transparent"
                  onMouseEnter={handleCancelClose}
                  onMouseLeave={handleCloseDropdown}
                >
                  <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 py-2.5 p-1.5 ring-1 ring-black/5">
                    <button
                      onClick={() => handleNavClick('profil')}
                      className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 flex items-center gap-3 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-100/70 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <Award className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 group-hover:text-emerald-900">Sambutan & Visi Misi</div>
                        <div className="text-[11px] text-slate-400">Kepala Sekolah & Arah Kebijakan</div>
                      </div>
                    </button>
                    <button
                      onClick={() => handleNavClick('sejarah')}
                      className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 flex items-center gap-3 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-100/70 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 group-hover:text-emerald-900">Sejarah & Profil Madrasah</div>
                        <div className="text-[11px] text-slate-400">Dedikasi pendidikan sejak 1983</div>
                      </div>
                    </button>
                    <button
                      onClick={() => handleNavClick('guru-staf')}
                      className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 flex items-center gap-3 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-100/70 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 group-hover:text-emerald-900">Dewan Guru & Staf</div>
                        <div className="text-[11px] text-slate-400">Pendidik profesional & berdedikasi</div>
                      </div>
                    </button>
                    <div className="my-1 border-t border-slate-100" />
                    <button
                      onClick={() => handleNavClick('fasilitas')}
                      className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 flex items-center gap-3 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-100/70 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 group-hover:text-emerald-900">Sarana & Fasilitas</div>
                        <div className="text-[11px] text-slate-400">Lab CBT, lapangan & ruang kelas</div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Akademik ▾ */}
            <div 
              className="relative py-1"
              onMouseEnter={() => handleOpenDropdown('akademik')}
              onMouseLeave={handleCloseDropdown}
            >
              <button
                id="nav-akademik-btn"
                onClick={() => handleToggleDropdown('akademik')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap flex items-center gap-1 transition-all ${
                  activeTab === 'program' || activeDropdown === 'akademik'
                    ? 'text-emerald-800 bg-emerald-50 shadow-xs border border-emerald-200/60'
                    : 'text-slate-700 hover:text-emerald-700 hover:bg-slate-50'
                }`}
              >
                <span>Akademik</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'akademik' ? 'rotate-180 text-emerald-700' : ''}`} />
              </button>

              {activeDropdown === 'akademik' && (
                <div 
                  className="absolute left-0 top-full pt-2 w-72 z-50 animate-in fade-in zoom-in-95 duration-150 before:content-[''] before:absolute before:-top-3 before:left-0 before:right-0 before:h-4 before:bg-transparent"
                  onMouseEnter={handleCancelClose}
                  onMouseLeave={handleCloseDropdown}
                >
                  <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 py-2.5 p-1.5 ring-1 ring-black/5">
                    <button
                      onClick={() => handleNavClick('program', 'kurikulum')}
                      className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 flex items-center gap-3 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-100/70 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 group-hover:text-emerald-900">Kurikulum Merdeka Mandiri</div>
                        <div className="text-[11px] text-slate-400">Pembelajaran aktif & P5 kontekstual</div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleNavClick('program', 'anbk')}
                      className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 flex items-center gap-3 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-100/70 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 group-hover:text-emerald-900">ANBK & Literasi Digital</div>
                        <div className="text-[11px] text-slate-400">Lab CBT, asesmen & digitalisasi</div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleNavClick('program', 'karakter')}
                      className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 flex items-center gap-3 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-100/70 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 group-hover:text-emerald-900">Pembiasaan & Karakter</div>
                        <div className="text-[11px] text-slate-400">Sholat dhuha berjamaah & tadarus</div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 4. Kesiswaan ▾ */}
            <div 
              className="relative py-1"
              onMouseEnter={() => handleOpenDropdown('kesiswaan')}
              onMouseLeave={handleCloseDropdown}
            >
              <button
                id="nav-kesiswaan-btn"
                onClick={() => handleToggleDropdown('kesiswaan')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap flex items-center gap-1 transition-all ${
                  activeTab === 'kesiswaan' || activeTab === 'prestasi' || activeDropdown === 'kesiswaan'
                    ? 'text-emerald-800 bg-emerald-50 shadow-xs border border-emerald-200/60'
                    : 'text-slate-700 hover:text-emerald-700 hover:bg-slate-50'
                }`}
              >
                <span>Kesiswaan</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'kesiswaan' ? 'rotate-180 text-emerald-700' : ''}`} />
              </button>

              {activeDropdown === 'kesiswaan' && (
                <div 
                  className="absolute left-0 top-full pt-2 w-72 z-50 animate-in fade-in zoom-in-95 duration-150 before:content-[''] before:absolute before:-top-3 before:left-0 before:right-0 before:h-4 before:bg-transparent"
                  onMouseEnter={handleCancelClose}
                  onMouseLeave={handleCloseDropdown}
                >
                  <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 py-2.5 p-1.5 ring-1 ring-black/5">
                    <button
                      onClick={() => handleNavClick('kesiswaan')}
                      className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 flex items-center gap-3 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-100/70 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 group-hover:text-emerald-900">Ekstrakurikuler & OSIS</div>
                        <div className="text-[11px] text-slate-400">Paskibra, Pramuka, Futsal & Seni</div>
                      </div>
                    </button>
                    <button
                      onClick={() => handleNavClick('prestasi')}
                      className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 flex items-center gap-3 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                        <Trophy className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 group-hover:text-emerald-900">Prestasi Siswa</div>
                        <div className="text-[11px] text-slate-400">Juara kejuaraan kota & provinsi</div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 5. Informasi ▾ */}
            <div 
              className="relative py-1"
              onMouseEnter={() => handleOpenDropdown('informasi')}
              onMouseLeave={handleCloseDropdown}
            >
              <button
                id="nav-informasi-btn"
                onClick={() => handleToggleDropdown('informasi')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap flex items-center gap-1 transition-all ${
                  activeTab === 'berita' || activeTab === 'kontak' || activeDropdown === 'informasi'
                    ? 'text-emerald-800 bg-emerald-50 shadow-xs border border-emerald-200/60'
                    : 'text-slate-700 hover:text-emerald-700 hover:bg-slate-50'
                }`}
              >
                <span>Informasi</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'informasi' ? 'rotate-180 text-emerald-700' : ''}`} />
              </button>

              {activeDropdown === 'informasi' && (
                <div 
                  className="absolute right-0 lg:left-0 top-full pt-2 w-72 z-50 animate-in fade-in zoom-in-95 duration-150 before:content-[''] before:absolute before:-top-3 before:left-0 before:right-0 before:h-4 before:bg-transparent"
                  onMouseEnter={handleCancelClose}
                  onMouseLeave={handleCloseDropdown}
                >
                  <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 py-2.5 p-1.5 ring-1 ring-black/5">
                    <button
                      onClick={() => handleNavClick('berita')}
                      className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 flex items-center gap-3 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-100/70 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <Newspaper className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 group-hover:text-emerald-900">Warta & Berita Sekolah</div>
                        <div className="text-[11px] text-slate-400">Agenda kegiatan & kabar terkini</div>
                      </div>
                    </button>
                    <button
                      onClick={() => handleNavClick('kontak')}
                      className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 flex items-center gap-3 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-100/70 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 group-hover:text-emerald-900">Kontak & Lokasi Sekolah</div>
                        <div className="text-[11px] text-slate-400">Peta, WhatsApp resmi & layanan info</div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action CTAs Desktop Right (Search + Login Admin / Panel Admin) */}
          <div className="hidden lg:flex items-center space-x-2 shrink-0">
            <button
              id="btn-search-header"
              onClick={onOpenSearch}
              className="p-2.5 rounded-xl text-slate-600 hover:text-emerald-700 hover:bg-slate-100 transition-colors"
              title="Pencarian Cepat"
            >
              <Search className="w-5 h-5" />
            </button>

            {!isAdmin ? (
              <button
                id="nav-login-admin"
                type="button"
                onClick={onOpenAdminLogin}
                className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700 hover:text-emerald-800 hover:bg-emerald-50 transition-all flex items-center gap-1.5 border border-slate-200 shadow-sm whitespace-nowrap shrink-0"
                title="Login Admin untuk merubah foto & teks slide real-time"
              >
                <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Login Admin</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  id="nav-panel-admin"
                  type="button"
                  onClick={onOpenAdminDashboard}
                  className="px-3 py-2 rounded-xl text-xs sm:text-sm font-black bg-emerald-700 hover:bg-emerald-800 text-white transition-all flex items-center gap-1.5 shadow-md hover:shadow-lg hover:scale-105 whitespace-nowrap"
                  title="Buka Panel Pengaturan Konten Real-Time"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>Panel Admin</span>
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
                </button>

                <button
                  id="nav-logout-admin"
                  type="button"
                  onClick={onLogoutAdmin}
                  className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors shrink-0"
                  title="Keluar dari Akun Admin"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu and search toggle */}
          <div className="flex lg:hidden items-center space-x-1.5">
            <button
              id="btn-search-mobile"
              onClick={onOpenSearch}
              className="p-2 rounded-xl text-slate-600 hover:text-emerald-700 hover:bg-slate-100"
              aria-label="Cari"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              id="btn-mobile-menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:text-emerald-700 hover:bg-slate-100 focus:outline-none"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-slate-800" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-8 space-y-3.5 shadow-xl animate-in slide-in-from-top-2 duration-200 max-h-[82vh] overflow-y-auto overscroll-contain">
            {/* Quick PPDB banner */}
            <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white rounded-2xl p-3.5 shadow-sm">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-amber-300" />
                <div className="text-xs font-bold">PPDB 2027/2028 RA AL-MAQOM</div>
              </div>
              <p className="text-[11px] text-emerald-100 mt-1">
                Penerimaan Peserta Didik Baru telah dibuka. Biaya terjangkau & fasilitas lengkap.
              </p>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenPsbModal();
                }}
                className="mt-2.5 w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black py-2 px-3 rounded-xl text-xs text-center shadow transition-colors"
              >
                Daftar PPDB Sekarang
              </button>
            </div>

            {/* 1. Beranda (Tampilan HP biasa abu-putih) */}
            <button
              id="mobile-nav-beranda"
              onClick={() => handleNavClick('beranda')}
              className="w-full text-left px-3.5 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-colors flex items-center justify-between bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 shadow-xs active:bg-slate-100"
            >
              <div className="flex items-center gap-2">
                <span className="text-slate-900 font-bold">Beranda</span>
              </div>
              <span className="text-[10px] font-medium text-slate-500">Halaman Utama</span>
            </button>

            {/* 2. Profil Sekolah (Dibiarkan Terbuka Semua) */}
            <div className="rounded-2xl border border-slate-200/90 bg-slate-50/70 p-2.5">
              <div className="flex items-center gap-2 px-2 py-1 mb-1 text-[11px] font-black text-emerald-800 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                <span>Profil</span>
              </div>
              <div className="space-y-1.5">
                <button
                  onClick={() => handleNavClick('profil')}
                  className={`w-full text-left px-3 py-2 text-xs rounded-xl flex items-center gap-2.5 transition-colors ${
                    activeTab === 'profil'
                      ? 'bg-emerald-100 text-emerald-950 font-bold border border-emerald-300 shadow-xs'
                      : 'bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-100'
                  }`}
                >
                  <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-xs truncate">Sambutan & Visi Misi</div>
                    <div className="text-[10px] text-slate-500 truncate">Kepala Sekolah & Arah Tujuan</div>
                  </div>
                </button>

                <button
                  onClick={() => handleNavClick('sejarah')}
                  className={`w-full text-left px-3 py-2 text-xs rounded-xl flex items-center gap-2.5 transition-colors ${
                    activeTab === 'sejarah'
                      ? 'bg-emerald-100 text-emerald-950 font-bold border border-emerald-300 shadow-xs'
                      : 'bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-100'
                  }`}
                >
                  <BookOpen className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-xs truncate">Sejarah & Profil Madrasah</div>
                    <div className="text-[10px] text-slate-500 truncate">Dedikasi pendidikan Cimahi</div>
                  </div>
                </button>

                <button
                  onClick={() => handleNavClick('guru-staf')}
                  className={`w-full text-left px-3 py-2 text-xs rounded-xl flex items-center gap-2.5 transition-colors ${
                    activeTab === 'guru-staf'
                      ? 'bg-emerald-100 text-emerald-950 font-bold border border-emerald-300 shadow-xs'
                      : 'bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-100'
                  }`}
                >
                  <Users className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-xs truncate">Dewan Guru & Staf</div>
                    <div className="text-[10px] text-slate-500 truncate">Tenaga pendidik berkompeten</div>
                  </div>
                </button>

                <button
                  onClick={() => handleNavClick('fasilitas')}
                  className={`w-full text-left px-3 py-2 text-xs rounded-xl flex items-center gap-2.5 transition-colors ${
                    activeTab === 'fasilitas'
                      ? 'bg-emerald-100 text-emerald-950 font-bold border border-emerald-300 shadow-xs'
                      : 'bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-100'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-xs truncate">Sarana & Fasilitas</div>
                    <div className="text-[10px] text-slate-500 truncate">Lab komputer, lapangan & kelas</div>
                  </div>
                </button>
              </div>
            </div>

            {/* 3. Akademik (Dibiarkan Terbuka Semua) */}
            <div className="rounded-2xl border border-slate-200/90 bg-slate-50/70 p-2.5">
              <div 
                onClick={() => handleNavClick('program', 'all')}
                className="flex items-center gap-2 px-2 py-1 mb-1 text-[11px] font-black text-emerald-800 uppercase tracking-wider cursor-pointer"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                <span>Akademik</span>
              </div>
              <div className="space-y-1.5">
                <button
                  onClick={() => handleNavClick('program', 'kurikulum')}
                  className={`w-full text-left px-3 py-2 text-xs rounded-xl flex items-center gap-2.5 transition-colors ${
                    activeTab === 'program'
                      ? 'bg-emerald-100 text-emerald-950 font-bold border border-emerald-300 shadow-xs'
                      : 'bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-100'
                  }`}
                >
                  <BookOpen className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-xs truncate">Kurikulum Merdeka Mandiri</div>
                    <div className="text-[10px] text-slate-500 truncate">Pembelajaran aktif berpusat siswa</div>
                  </div>
                </button>

                <button
                  onClick={() => handleNavClick('program', 'anbk')}
                  className={`w-full text-left px-3 py-2 text-xs rounded-xl flex items-center gap-2.5 transition-colors ${
                    activeTab === 'program'
                      ? 'bg-emerald-100 text-emerald-950 font-bold border border-emerald-300 shadow-xs'
                      : 'bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-100'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-xs truncate">ANBK & Literasi Digital</div>
                    <div className="text-[10px] text-slate-500 truncate">Lab CBT & teknologi informatika</div>
                  </div>
                </button>

                <button
                  onClick={() => handleNavClick('program', 'karakter')}
                  className={`w-full text-left px-3 py-2 text-xs rounded-xl flex items-center gap-2.5 transition-colors ${
                    activeTab === 'program'
                      ? 'bg-emerald-100 text-emerald-950 font-bold border border-emerald-300 shadow-xs'
                      : 'bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-100'
                  }`}
                >
                  <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-xs truncate">Pembiasaan & Karakter</div>
                    <div className="text-[10px] text-slate-500 truncate">Sholat dhuha & tadarus rutin</div>
                  </div>
                </button>
              </div>
            </div>

            {/* 4. Kesiswaan (Dibiarkan Terbuka Semua) */}
            <div className="rounded-2xl border border-slate-200/90 bg-slate-50/70 p-2.5">
              <div className="flex items-center gap-2 px-2 py-1 mb-1 text-[11px] font-black text-emerald-800 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                <span>Kesiswaan</span>
              </div>
              <div className="space-y-1.5">
                <button
                  onClick={() => handleNavClick('kesiswaan')}
                  className={`w-full text-left px-3 py-2 text-xs rounded-xl flex items-center gap-2.5 transition-colors ${
                    activeTab === 'kesiswaan'
                      ? 'bg-emerald-100 text-emerald-950 font-bold border border-emerald-300 shadow-xs'
                      : 'bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-100'
                  }`}
                >
                  <Users className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-xs truncate">Ekstrakurikuler & OSIS</div>
                    <div className="text-[10px] text-slate-500 truncate">Paskibra, Pramuka, Futsal & Seni</div>
                  </div>
                </button>

                <button
                  onClick={() => handleNavClick('prestasi')}
                  className={`w-full text-left px-3 py-2 text-xs rounded-xl flex items-center gap-2.5 transition-colors ${
                    activeTab === 'prestasi'
                      ? 'bg-emerald-100 text-emerald-950 font-bold border border-emerald-300 shadow-xs'
                      : 'bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-100'
                  }`}
                >
                  <Trophy className="w-4 h-4 text-amber-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-xs truncate">Prestasi Siswa</div>
                    <div className="text-[10px] text-slate-500 truncate">Juara akademik & non-akademik</div>
                  </div>
                </button>
              </div>
            </div>

            {/* 5. Informasi (Dibiarkan Terbuka Semua) */}
            <div className="rounded-2xl border border-slate-200/90 bg-slate-50/70 p-2.5">
              <div className="flex items-center gap-2 px-2 py-1 mb-1 text-[11px] font-black text-emerald-800 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                <span>Informasi</span>
              </div>
              <div className="space-y-1.5">
                <button
                  onClick={() => handleNavClick('berita')}
                  className={`w-full text-left px-3 py-2 text-xs rounded-xl flex items-center gap-2.5 transition-colors ${
                    activeTab === 'berita'
                      ? 'bg-emerald-100 text-emerald-950 font-bold border border-emerald-300 shadow-xs'
                      : 'bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-100'
                  }`}
                >
                  <Newspaper className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-xs truncate">Warta & Berita Sekolah</div>
                    <div className="text-[10px] text-slate-500 truncate">Agenda kegiatan & kabar terbaru</div>
                  </div>
                </button>

                <button
                  onClick={() => handleNavClick('kontak')}
                  className={`w-full text-left px-3 py-2 text-xs rounded-xl flex items-center gap-2.5 transition-colors ${
                    activeTab === 'kontak'
                      ? 'bg-emerald-100 text-emerald-950 font-bold border border-emerald-300 shadow-xs'
                      : 'bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-100'
                  }`}
                >
                  <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-xs truncate">Kontak & Lokasi Sekolah</div>
                    <div className="text-[10px] text-slate-500 truncate">Peta, kontak WhatsApp & pengaduan</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Mobile Section: Akses Khusus Akun Admin */}
            <div className="pt-3 mt-3 border-t border-slate-200">
              {!isAdmin ? (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAdminLogin();
                  }}
                  className="w-full py-3 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-sm transition-colors whitespace-nowrap"
                >
                  <Lock className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Login Admin</span>
                </button>
              ) : (
                <div className="space-y-2 bg-emerald-900 text-white p-3.5 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs">
                      <ShieldCheck className="w-4 h-4 text-amber-300" />
                      <span className="font-bold text-emerald-100">Akun: admin_ilham</span>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onOpenAdminDashboard();
                      }}
                      className="w-full py-2.5 px-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow transition-colors"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>Buka Panel Admin (Ubah Teks & Foto)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onLogoutAdmin();
                      }}
                      className="w-full py-2 px-3 bg-emerald-950/80 hover:bg-rose-700 text-emerald-200 hover:text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Keluar dari Akun Admin</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
