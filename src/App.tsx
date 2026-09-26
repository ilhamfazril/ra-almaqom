/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { WelcomeSection } from './components/WelcomeSection';
import { ProgramsSection } from './components/ProgramsSection';
import { PsbSection } from './components/PsbSection';
import { NewsSection } from './components/NewsSection';
import { FacilitiesSection } from './components/FacilitiesSection';
import { ExtracurricularSection } from './components/ExtracurricularSection';
import { AchievementsSection } from './components/AchievementsSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { ContactSection } from './components/ContactSection';
import { TeachersSection } from './components/TeachersSection';
import { HistorySection } from './components/HistorySection';
import { Footer } from './components/Footer';
import { NewsDetailModal } from './components/NewsDetailModal';
import { PsbRegistrationModal } from './components/PsbRegistrationModal';
import { SearchModal } from './components/SearchModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminDashboardModal, AdminTab } from './components/AdminDashboardModal';
import { isAdminLoggedIn, logoutAdmin } from './services/adminAuthService';
import { 
  subscribeToSiteContent, 
  SchoolSiteContent, 
  DEFAULT_HERO_SLIDES,
  DEFAULT_PRINCIPAL_CONTENT,
  DEFAULT_SITE_CONTENT,
  getInitialSiteContent
} from './services/siteContentService';
import { NewsItem } from './types';
import { ArrowUp, GraduationCap, ArrowLeft, LogOut } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('beranda');
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);
  const [isPsbModalOpen, setIsPsbModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [academicFilter, setAcademicFilter] = useState<'all' | 'kurikulum' | 'anbk' | 'karakter'>('all');

  // Helper to return to the very top of the homepage
  const handleBackToHome = () => {
    setActiveTab('beranda');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderSubpageTopBackButton = () => (
    <div className="mb-4 flex items-center justify-start">
      <button
        type="button"
        onClick={handleBackToHome}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-emerald-800 text-white text-xs font-bold transition-all border border-white/20 hover:scale-[1.02] active:scale-[0.98] group shadow-xs"
        title="Kembali ke Beranda"
      >
        <ArrowLeft className="w-4 h-4 text-amber-400 group-hover:-translate-x-0.5 transition-transform" />
        <span>Kembali</span>
      </button>
    </div>
  );

  // Admin authentication state
  const [isAdmin, setIsAdmin] = useState<boolean>(() => isAdminLoggedIn());
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [adminDashboardInitialTab, setAdminDashboardInitialTab] = useState<AdminTab>('overview');

  const handleOpenAdminDashboard = (tab: AdminTab = 'overview') => {
    setAdminDashboardInitialTab(tab);
    setIsAdminDashboardOpen(true);
  };

  // Real-time Firestore content state initialized with cached / saved state
  const [siteContent, setSiteContent] = useState<SchoolSiteContent>(() => getInitialSiteContent());

  useEffect(() => {
    // Subscribe to real-time changes from Firestore database
    const unsubscribe = subscribeToSiteContent((content) => {
      setSiteContent(content);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Ensure every tab/page navigation lands cleanly at the top of the destination page
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (tab: string, subFilterOrElementId?: string) => {
    if (tab === 'program' && subFilterOrElementId && ['all', 'kurikulum', 'anbk', 'karakter'].includes(subFilterOrElementId)) {
      setAcademicFilter(subFilterOrElementId as 'all' | 'kurikulum' | 'anbk' | 'karakter');
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (subFilterOrElementId && !['all', 'kurikulum', 'anbk', 'karakter'].includes(subFilterOrElementId)) {
      setTimeout(() => {
        const el = document.getElementById(subFilterOrElementId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    }
  };

  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  // Trigger popup konfirmasi sebelum benar-benar keluar
  const handleRequestLogout = () => {
    setIsLogoutConfirmOpen(true);
  };

  const handleConfirmLogout = () => {
    logoutAdmin();
    setIsAdmin(false);
    setIsAdminDashboardOpen(false);
    setIsLogoutConfirmOpen(false);
  };

  const currentContent: SchoolSiteContent = siteContent ? {
    ...DEFAULT_SITE_CONTENT,
    ...siteContent,
    principal: {
      ...DEFAULT_PRINCIPAL_CONTENT,
      ...(siteContent.principal || {}),
    }
  } : DEFAULT_SITE_CONTENT;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans">
      {/* Sticky Main Header with Admin Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={handleNavigate}
        onOpenSearch={() => setIsSearchModalOpen(true)}
        onOpenPsbModal={() => setIsPsbModalOpen(true)}
        isAdmin={isAdmin}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        onOpenAdminDashboard={() => handleOpenAdminDashboard('overview')}
        onLogoutAdmin={handleRequestLogout}
        onSelectAcademicFilter={setAcademicFilter}
        customLogo={currentContent.customLogo}
      />

      {/* Main Content Areas based on Tab or Full Home Page */}
      <main className="flex-grow">
        {activeTab === 'beranda' && (
          <>
            <Hero
              onExploreClick={() => handleNavigate('profil')}
              onPsbClick={() => handleNavigate('psb')}
              onNavigate={handleNavigate}
              slidesData={currentContent.heroSlides}
              statsData={currentContent.stats}
              isAdmin={isAdmin}
              onOpenAdminDashboard={() => handleOpenAdminDashboard('stats')}
            />
            <WelcomeSection 
              principalProfile={currentContent.principal}
              isAdmin={isAdmin}
              onOpenAdminDashboard={() => handleOpenAdminDashboard('principal')}
            />
            <ProgramsSection 
              programsData={currentContent.programs} 
              activeFilter={academicFilter}
              onFilterChange={setAcademicFilter}
            />
            <PsbSection onOpenPsbModal={() => setIsPsbModalOpen(true)} />
            <NewsSection 
              newsData={currentContent.news} 
              onSelectArticle={(article) => setSelectedArticle(article)} 
            />
            <FacilitiesSection facilitiesData={currentContent.facilities} />
            <ExtracurricularSection extracurricularsData={currentContent.extracurriculars} />
            <AchievementsSection achievementsData={currentContent.achievements} />
            <TestimonialsSection />
            <ContactSection />
          </>
        )}

        {activeTab === 'profil' && (
          <div className="animate-in fade-in duration-300">
            {/* Breadcrumb banner */}
            <div className="bg-emerald-950 text-white py-8 px-4 border-b border-emerald-800">
              <div className="max-w-7xl mx-auto">
                {renderSubpageTopBackButton()}
                <div className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                  Profil Lembaga
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">
                  Sambutan Kepala Sekolah & Visi Misi
                </h1>
                <p className="text-xs sm:text-sm text-emerald-200 mt-1">
                  Mengenal kepemimpinan kepala sekolah, komitmen mutu pendidikan, visi misi unggul, dan nilai-nilai pembentukan budi pekerti luhur.
                </p>
              </div>
            </div>
            <WelcomeSection 
              principalProfile={currentContent.principal}
              isAdmin={isAdmin}
              onOpenAdminDashboard={() => setIsAdminDashboardOpen(true)}
            />
          </div>
        )}

        {activeTab === 'sejarah' && (
          <div className="animate-in fade-in duration-300">
            <div className="bg-emerald-950 text-white py-8 px-4 border-b border-emerald-800">
              <div className="max-w-7xl mx-auto">
                {renderSubpageTopBackButton()}
                <div className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                  Kilas Sejarah
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">
                  Sejarah & Profil RA Al-Maqom
                </h1>
                <p className="text-xs sm:text-sm text-emerald-200 mt-1">
                  Dedikasi pengabdian Yayasan Al-Maqom dalam mendidik generasi tunas bangsa yang cerdas, ceria, dan berakhlakul karimah.
                </p>
              </div>
            </div>
            <HistorySection />
          </div>
        )}

        {activeTab === 'guru-staf' && (
          <div className="animate-in fade-in duration-300">
            <div className="bg-emerald-950 text-white py-8 px-4 border-b border-emerald-800">
              <div className="max-w-7xl mx-auto">
                {renderSubpageTopBackButton()}
                <div className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                  Tenaga Pendidik & Staf
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">
                  Bunda Guru & Tenaga Kependidikan
                </h1>
                <p className="text-xs sm:text-sm text-emerald-200 mt-1">
                  Pendidik profesional, sabar, ramah, dan berdedikasi tinggi membimbing potensi kecerdasan serta adab santri cilik.
                </p>
              </div>
            </div>
            <TeachersSection 
              teachersData={currentContent.teachers}
              isAdmin={isAdmin}
              onOpenAdminDashboard={() => setIsAdminDashboardOpen(true)}
            />
          </div>
        )}

        {activeTab === 'program' && (
          <div className="animate-in fade-in duration-300">
            {/* Dedicated Academic Banner */}
            <div className="bg-emerald-950 text-white py-8 px-4 border-b border-emerald-800">
              <div className="max-w-7xl mx-auto">
                {renderSubpageTopBackButton()}
                <div className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                  Informasi Khusus Pembelajaran
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">
                  Kurikulum Merdeka PAUD/RA, Tahfidz Cilik & Karakter Islami
                </h1>
                <p className="text-xs sm:text-sm text-emerald-200 mt-1">
                  Pusat informasi kurikulum terpadu bermain sambil belajar, bimbingan hafalan surat pendek, dan pembiasaan adab santri RA Al-Maqom.
                </p>
              </div>
            </div>
            <ProgramsSection 
              programsData={currentContent.programs} 
              activeFilter={academicFilter}
              onFilterChange={setAcademicFilter}
            />
          </div>
        )}

        {activeTab === 'kesiswaan' && (
          <div className="animate-in fade-in duration-300">
            <div className="bg-emerald-950 text-white py-8 px-4 border-b border-emerald-800">
              <div className="max-w-7xl mx-auto">
                {renderSubpageTopBackButton()}
                <div className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                  Kreativitas & Minat Bakat
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">
                  Aktivitas Ekstrakurikuler & Kreativitas Santri RA Al-Maqom
                </h1>
                <p className="text-xs sm:text-sm text-emerald-200 mt-1">
                  Wadah pengembangan minat bakat anak usia dini, drumband cilik, seni tari Islami, menggambar, dan tahfidz.
                </p>
              </div>
            </div>
            <ExtracurricularSection extracurricularsData={currentContent.extracurriculars} />
          </div>
        )}

        {activeTab === 'prestasi' && (
          <div className="animate-in fade-in duration-300">
            <div className="bg-emerald-950 text-white py-8 px-4 border-b border-emerald-800">
              <div className="max-w-7xl mx-auto">
                {renderSubpageTopBackButton()}
                <div className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                  Pencapaian & Prestasi
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">
                  Prestasi Membanggakan Santri RA Al-Maqom
                </h1>
                <p className="text-xs sm:text-sm text-emerald-200 mt-1">
                  Bukti nyata komitmen bimbingan dalam melatih keberanian, kreativitas, dan rasa percaya diri santri cilik.
                </p>
              </div>
            </div>
            <AchievementsSection achievementsData={currentContent.achievements} />
          </div>
        )}

        {activeTab === 'fasilitas' && (
          <div className="animate-in fade-in duration-300">
            <div className="bg-emerald-950 text-white py-8 px-4 border-b border-emerald-800">
              <div className="max-w-7xl mx-auto">
                {renderSubpageTopBackButton()}
                <div className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                  Sarana & Prasarana
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">
                  Sarana & Fasilitas Edukatif RA Al-Maqom
                </h1>
                <p className="text-xs sm:text-sm text-emerald-200 mt-1">
                  Dukungan sarana ruang kelas tematik ber-AC, taman bermain outdoor (playground), musala cilik, dan pojok literasi bergambar.
                </p>
              </div>
            </div>
            <FacilitiesSection facilitiesData={currentContent.facilities} />
          </div>
        )}

        {activeTab === 'psb' && (
          <div className="animate-in fade-in duration-300">
            <div className="bg-emerald-950 text-white py-8 px-4 border-b border-emerald-800">
              <div className="max-w-7xl mx-auto">
                {renderSubpageTopBackButton()}
                <div className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                  Penerimaan Peserta Didik Baru (PPDB)
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">
                  Portal PPDB 2027/2028 RA Al-Maqom
                </h1>
                <p className="text-xs sm:text-sm text-emerald-200 mt-1">
                  Informasi resmi pendaftaran peserta didik baru, kuota kelas, serta fasilitas beasiswa pendidikan.
                </p>
              </div>
            </div>
            <PsbSection onOpenPsbModal={() => setIsPsbModalOpen(true)} />
          </div>
        )}

        {activeTab === 'berita' && (
          <div className="animate-in fade-in duration-300">
            <div className="bg-emerald-950 text-white py-8 px-4 border-b border-emerald-800">
              <div className="max-w-7xl mx-auto">
                {renderSubpageTopBackButton()}
                <div className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                  Warta & Publikasi
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">
                  Berita, Agenda & Pengumuman Sekolah
                </h1>
              </div>
            </div>
            <NewsSection 
              newsData={currentContent.news} 
              onSelectArticle={(article) => setSelectedArticle(article)} 
            />
          </div>
        )}

        {activeTab === 'kontak' && (
          <div className="animate-in fade-in duration-300">
            <div className="bg-emerald-950 text-white py-8 px-4 border-b border-emerald-800">
              <div className="max-w-7xl mx-auto">
                {renderSubpageTopBackButton()}
                <div className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                  Layanan Publik
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">
                  Kontak, Lokasi & Pusat Bantuan
                </h1>
              </div>
            </div>
            <ContactSection />
          </div>
        )}

        {/* Bottom Back Button for Sub-navigation pages (Non-floating, placed at bottom-left) */}
        {activeTab !== 'beranda' && (
          <div className="bg-slate-50 border-t border-slate-200 py-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto flex items-center justify-start">
              <button
                type="button"
                onClick={handleBackToHome}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98] group"
                title="Kembali ke Beranda"
              >
                <ArrowLeft className="w-4 h-4 text-amber-400 group-hover:-translate-x-0.5 transition-transform" />
                <span>Kembali</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenPsbModal={() => setIsPsbModalOpen(true)}
        customLogo={currentContent.customLogo}
      />

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2.5">
        <button
          onClick={() => setIsPsbModalOpen(true)}
          className="bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black py-2.5 px-4 rounded-full shadow-xl flex items-center gap-2 border border-amber-500 hover:scale-105 transition-transform"
          title="Daftar PPDB Online"
        >
          <GraduationCap className="w-4 h-4" />
          <span className="hidden sm:inline">Daftar PPDB</span>
        </button>

        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="w-11 h-11 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center shadow-lg transition-all hover:scale-105"
            title="Kembali ke atas"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Modals */}
      <NewsDetailModal
        article={
          selectedArticle
            ? currentContent.news?.find((n) => n.id === selectedArticle.id) || selectedArticle
            : null
        }
        onClose={() => setSelectedArticle(null)}
      />

      <PsbRegistrationModal
        isOpen={isPsbModalOpen}
        onClose={() => setIsPsbModalOpen(false)}
      />

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSelectArticle={(article) => {
          setSelectedArticle(article);
        }}
        onNavigateTab={handleNavigate}
        newsList={currentContent.news}
        programsList={currentContent.programs}
        facilitiesList={currentContent.facilities}
        extracurricularList={currentContent.extracurriculars}
      />

      {/* Admin Login Modal (Username: admin_ilham, Password: ilhamfazril) */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={() => {
          setIsAdmin(true);
          setIsAdminLoginOpen(false);
          handleOpenAdminDashboard('overview');
        }}
      />

      {/* Admin Centralized Content Dashboard Modal (Real-Time Firestore Synchronized) */}
      <AdminDashboardModal
        isOpen={isAdminDashboardOpen}
        onClose={() => setIsAdminDashboardOpen(false)}
        siteContent={currentContent}
        onLogout={handleRequestLogout}
        onNavigateTab={handleNavigate}
        initialTab={adminDashboardInitialTab}
      />

      {/* Pop-up Konfirmasi Keluar Admin */}
      {isLogoutConfirmOpen && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <div className="w-11 h-11 rounded-2xl bg-rose-100 flex items-center justify-center flex-shrink-0">
                <LogOut className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base leading-tight">Konfirmasi Keluar</h3>
                <p className="text-[11px] text-slate-500">Panel Admin RA Al-Maqom</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-5 leading-relaxed">
              Apakah Anda yakin ingin keluar dari akun admin? Anda harus login kembali menggunakan username dan kata sandi untuk mengelola data website dan pendaftaran PPDB.
            </p>

            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsLogoutConfirmOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm hover:shadow cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Ya, Keluar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
