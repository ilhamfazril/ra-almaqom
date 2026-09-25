import React, { useState } from 'react';
import { 
  Sparkles, 
  Target, 
  Award, 
  Compass, 
  Heart, 
  BookOpen, 
  CheckCircle,
  Quote,
  ShieldCheck
} from 'lucide-react';
import { PRINCIPAL_INFO, SCHOOL_INFO } from '../data/schoolData';
import { PrincipalProfileContent } from '../services/siteContentService';

interface WelcomeSectionProps {
  principalProfile?: PrincipalProfileContent;
  isAdmin?: boolean;
  onOpenAdminDashboard?: () => void;
}

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({
  principalProfile,
  isAdmin = false,
  onOpenAdminDashboard
}) => {
  const [activeTab, setActiveTab] = useState<'sambutan' | 'visi-misi' | 'nilai'>('sambutan');

  const currentPrincipal = {
    name: principalProfile?.name || PRINCIPAL_INFO.name,
    role: principalProfile?.role || PRINCIPAL_INFO.role,
    quote: principalProfile?.quote || PRINCIPAL_INFO.quote,
    photo: principalProfile?.photo || PRINCIPAL_INFO.photo,
  };

  return (
    <section id="profil" className="py-16 sm:py-20 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Selamat Datang di <span className="text-emerald-700">{SCHOOL_INFO.name}</span>
          </h2>
          <p className="mt-3 text-slate-600 text-base sm:text-lg">
            Membentuk generasi Qur’ani usia dini yang beriman dan bertakwa, cerdas, kreatif, mandiri, serta berakhlakul karimah di bawah naungan Yayasan Al-Maqom.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 bg-slate-200/80 rounded-2xl border border-slate-300/70 shadow-inner">
            <button
              onClick={() => setActiveTab('sambutan')}
              className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'sambutan'
                  ? 'bg-white text-emerald-800 shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sambutan Kepala Sekolah
            </button>
            <button
              onClick={() => setActiveTab('visi-misi')}
              className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'visi-misi'
                  ? 'bg-white text-emerald-800 shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Visi & Misi Sekolah
            </button>
            <button
              onClick={() => setActiveTab('nilai')}
              className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'nilai'
                  ? 'bg-white text-emerald-800 shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Nilai: Disiplin, Cerdas, Berkarakter
            </button>
          </div>
        </div>

        {/* Content Tabs */}
        {activeTab === 'sambutan' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xl border border-slate-100 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center animate-in fade-in duration-300">
            {/* Principal Photo and Profile Card */}
            <div className="lg:col-span-4 flex flex-col items-center text-center">
              <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-2xl overflow-hidden shadow-2xl border-4 border-amber-400 p-1 bg-gradient-to-br from-emerald-700 to-teal-900 group">
                <img
                  src={currentPrincipal.photo}
                  alt={currentPrincipal.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-2 inset-x-2 bg-slate-950/90 backdrop-blur-md py-1.5 px-2 rounded-lg border border-amber-400/30">
                  <div className="text-xs font-bold text-amber-400">Kepala Sekolah</div>
                  <div className="text-[11px] text-slate-200">RA Al-Maqom</div>
                </div>
              </div>

              <h3 className="mt-5 text-lg sm:text-xl font-extrabold text-slate-900">
                {currentPrincipal.name}
              </h3>
              <p className="text-sm font-semibold text-emerald-700">
                {currentPrincipal.role}
              </p>
              <div className="mt-2 text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full font-medium">
                Yayasan Al-Maqom
              </div>
            </div>

            {/* Welcome Text */}
            <div className="lg:col-span-8 flex flex-col justify-center space-y-4">
              <div className="relative bg-emerald-50/70 border-l-4 border-emerald-600 p-4 rounded-r-xl">
                <Quote className="w-8 h-8 text-emerald-400/40 absolute top-2 right-2" />
                <p className="italic text-slate-700 text-sm sm:text-base font-medium">
                  {currentPrincipal.quote}
                </p>
              </div>

              <div className="space-y-3.5 text-slate-600 text-sm sm:text-base leading-relaxed">
                {PRINCIPAL_INFO.welcomeMessage.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Kurikulum Merdeka Mandiri</div>
                    <div className="text-[11px] text-slate-500">Kementerian Pendidikan Dasar dan Menengah</div>
                  </div>
                </div>

                <div className="text-xs text-slate-500 italic">
                  Kota Cimahi, Jawa Barat
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'visi-misi' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xl border border-slate-100 animate-in fade-in duration-300">
            {/* Visi */}
            <div className="mb-10 bg-gradient-to-r from-emerald-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
              <div className="absolute right-0 top-0 opacity-10 transform translate-x-10 -translate-y-10">
                <Target className="w-64 h-64 text-white" />
              </div>
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                  <Target className="w-4 h-4 text-amber-400" />
                  <span>Visi RA Al-Maqom</span>
                </div>
                <h3 className="text-lg sm:text-2xl font-extrabold text-white leading-relaxed">
                  "{SCHOOL_INFO.vision}"
                </h3>
              </div>
            </div>

            {/* Misi */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Compass className="w-6 h-6 text-emerald-700" />
                <h3 className="text-xl font-bold text-slate-900">Misi Penyelenggaraan Pendidikan</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SCHOOL_INFO.missions.map((mission, index) => (
                  <div 
                    key={index}
                    className="p-4 rounded-xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200/80 transition-colors flex items-start gap-3.5"
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex-shrink-0 flex items-center justify-center font-bold text-xs">
                      {index + 1}
                    </div>
                    <p className="text-slate-700 text-sm leading-relaxed font-medium">
                      {mission}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'nilai' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-300">
            {/* Disiplin */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 flex flex-col items-center text-center group hover:border-emerald-500 transition-all">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">DISIPLIN</h3>
              <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest mt-1 mb-4">Ketertiban & Tanggung Jawab</p>
              <p className="text-slate-600 text-sm leading-relaxed">
                Membiasakan hadir tepat waktu, menaati tata tertib sekolah, mengikuti apel pagi rutin, dan memiliki integritas dalam melaksanakan tugas pembelajaran sehari-hari.
              </p>
              <div className="mt-6 pt-4 border-t border-slate-100 w-full text-xs text-slate-500">
                Apel Pagi • Upacara Bendera • Tata Tertib Santun
              </div>
            </div>

            {/* Cerdas */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-amber-400 flex flex-col items-center text-center relative group hover:shadow-2xl transition-all">
              <div className="absolute -top-3.5 bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow">
                Intelektual & Literasi
              </div>
              <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <BookOpen className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">CERDAS</h3>
              <p className="text-xs font-bold text-amber-700 uppercase tracking-widest mt-1 mb-4">Literasi Digital & ANBK</p>
              <p className="text-slate-600 text-sm leading-relaxed">
                Menguasai kompetensi dasar akademis, keterampilan literasi dan numerasi berbasis komputer, bernalar kritis, dan siap menghadapi asesmen nasional (ANBK).
              </p>
              <div className="mt-6 pt-4 border-t border-slate-100 w-full text-xs text-slate-500">
                Lab Komputer ANBK • Pembelajaran Aktif • Bimbingan Belajar
              </div>
            </div>

            {/* Berkarakter */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 flex flex-col items-center text-center group hover:border-teal-500 transition-all">
              <div className="w-16 h-16 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Heart className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">BERKARAKTER</h3>
              <p className="text-xs font-bold text-teal-700 uppercase tracking-widest mt-1 mb-4">Akhlak Mulia & Kebajikan</p>
              <p className="text-slate-600 text-sm leading-relaxed">
                Menanamkan akhlak karimah, kepedulian terhadap sesama kawan dan guru, budaya 5S (Senyum, Salam, Sapa, Sopan, Santun), sholat dhuha dan tadarus rutin.
              </p>
              <div className="mt-6 pt-4 border-t border-slate-100 w-full text-xs text-slate-500">
                Sholat Berjamaah • Budaya 5S • Kepedulian Sosial
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
