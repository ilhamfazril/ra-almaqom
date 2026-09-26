import React, { useState } from 'react';
import { 
  Sparkles, 
  Image as ImageIcon, 
  UserCheck, 
  BookOpen, 
  Newspaper, 
  Building2, 
  Activity, 
  Trophy, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  Database,
  Smartphone,
  RefreshCw,
  Server,
  Check,
  GraduationCap,
  BarChart3
} from 'lucide-react';
import { SchoolSiteContent, syncAllDevicesWithServer } from '../../services/siteContentService';

interface AdminOverviewTabProps {
  content: SchoolSiteContent;
  onNavigateTab: (tabId: any) => void;
}

export const AdminOverviewTab: React.FC<AdminOverviewTabProps> = ({
  content,
  onNavigateTab,
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const handleSyncToAllDevices = async () => {
    setIsSyncing(true);
    setSyncFeedback(null);
    try {
      const res = await syncAllDevicesWithServer();
      setSyncFeedback(res);
      setTimeout(() => setSyncFeedback(null), 8000);
    } catch (e: any) {
      setSyncFeedback({
        success: false,
        message: e?.message || 'Gagal sinkronisasi ke server.',
      });
    } finally {
      setIsSyncing(false);
    }
  };
  const stats = [
    {
      id: 'slides',
      label: 'Slide Banner Hero',
      count: content.heroSlides.length,
      unit: 'Slide aktif',
      icon: <ImageIcon className="w-5 h-5 text-amber-600" />,
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      description: 'Banner foto utama halaman depan',
    },
    {
      id: 'logo',
      label: 'Logo & Lambang Sekolah',
      count: content.customLogo ? 'Kustom' : 'Vektor',
      unit: 'Aktif',
      icon: <Sparkles className="w-5 h-5 text-emerald-600" />,
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      description: 'Upload logo kustom kualitas HD & kompresi aman',
    },
    {
      id: 'stats',
      label: '4 Matriks Sekolah',
      count: 4,
      unit: 'Matriks aktif',
      icon: <BarChart3 className="w-5 h-5 text-amber-600" />,
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      description: 'Siswa, Guru, Ekskul & Akreditasi',
    },
    {
      id: 'principal',
      label: 'Profil Kepala Sekolah',
      count: 1,
      unit: 'Profil aktif',
      icon: <UserCheck className="w-5 h-5 text-emerald-600" />,
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      description: 'Foto resmi, sambutan & kutipan',
    },
    {
      id: 'teachers',
      label: 'Dewan Guru & Staf',
      count: content.teachers?.length || 4,
      unit: 'Guru terdaftar',
      icon: <GraduationCap className="w-5 h-5 text-indigo-600" />,
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      description: 'Pendidik, mata pelajaran & gelar',
    },
    {
      id: 'programs',
      label: 'Program Unggulan',
      count: content.programs.length,
      unit: 'Program terdaftar',
      icon: <BookOpen className="w-5 h-5 text-blue-600" />,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      description: 'ANBK, Karakter, P5 & Kurikulum',
    },
    {
      id: 'news',
      label: 'Berita & Agenda',
      count: content.news.length,
      unit: 'Artikel publikasi',
      icon: <Newspaper className="w-5 h-5 text-purple-600" />,
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      description: 'Warta, agenda & pengumuman resmi',
    },
    {
      id: 'facilities',
      label: 'Fasilitas Sekolah',
      count: content.facilities.length,
      unit: 'Sarana & prasarana',
      icon: <Building2 className="w-5 h-5 text-teal-600" />,
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-200',
      description: 'Lab Komputer, Lapangan, Musala, dll',
    },
    {
      id: 'extracurriculars',
      label: 'Ekstrakurikuler',
      count: content.extracurriculars.length,
      unit: 'Cabang ekskul',
      icon: <Activity className="w-5 h-5 text-rose-600" />,
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-200',
      description: 'Pramuka, Paskibra, Futsal, Tari, dll',
    },
    {
      id: 'achievements',
      label: 'Prestasi Siswa',
      count: content.achievements.length,
      unit: 'Catatan juara',
      icon: <Trophy className="w-5 h-5 text-yellow-600" />,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      description: 'Kejuaraan kota, provinsi & nasional',
    },
    {
      id: 'ppdb',
      label: 'Pendaftaran PPDB Online',
      count: 'Live',
      unit: 'Firebase',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      description: 'Data formulir calon siswa baru yang masuk real-time',
    },
  ];

  const lastUpdatedFormatted = content.updatedAt
    ? new Date(content.updatedAt).toLocaleString('id-ID', {
        dateStyle: 'full',
        timeStyle: 'short',
      })
    : 'Belum pernah diubah (Default)';

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-800/80 border border-emerald-600/40 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Workspace Administrator Resmi</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Selamat Datang di Panel Manajemen RA Al-Maqom
            </h2>
            <p className="text-emerald-100/90 text-sm mt-1.5 max-w-2xl leading-relaxed">
              Kini Anda memiliki hak akses penuh untuk menambah, mengubah, dan menghapus konten seluruh bagian website sekolah. Semua perubahan tersinkronisasi otomatis secara real-time ke Cloud Firestore.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-4 flex flex-col gap-1 min-w-[220px]">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>Status Basis Data</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-white mt-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Cloud Firestore Terhubung</span>
            </div>
            <div className="text-[11px] text-emerald-200/80 mt-1 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span className="truncate">Diperbarui: {lastUpdatedFormatted}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Device Server Synchronization Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 text-white shadow-md relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Sinkronisasi Foto & Perubahan Multi-Perangkat (HP, Laptop & Komputer)
                </h3>
                <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-emerald-500/30">
                  Server Aktif
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Server penyimpanan persisten kami memastikan 100% foto dan teks yang Anda unggah (Fasilitas, Foto Kepala Sekolah, Slide Hero, Berita) langsung disiarkan ke semua pengunjung dan perangkat lain tanpa terhalang batas kuota gratis Firebase.
              </p>
              {syncFeedback && (
                <div className={`mt-3 p-3 rounded-lg text-xs font-medium flex items-center gap-2 ${
                  syncFeedback.success 
                    ? 'bg-emerald-950/80 border border-emerald-600/50 text-emerald-200' 
                    : 'bg-rose-950/80 border border-rose-600/50 text-rose-200'
                }`}>
                  {syncFeedback.success ? <Check className="w-4 h-4 text-emerald-400 shrink-0" /> : <Clock className="w-4 h-4 text-rose-400 shrink-0" />}
                  <span>{syncFeedback.message}</span>
                </div>
              )}
            </div>
          </div>

          <div className="shrink-0 flex sm:flex-row lg:flex-col gap-2">
            <button
              onClick={handleSyncToAllDevices}
              disabled={isSyncing}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Menyinkronkan...' : 'Sinkronkan ke Semua Perangkat'}</span>
            </button>
            <div className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Otomatis tampil di HP & Pengunjung</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Sections */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-800">
            Daftar Modul Konten yang Dapat Dikelola
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            Pilih modul untuk menambah, mengedit, atau menghapus konten
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.map((item) => (
            <div
              key={item.id}
              onClick={() => onNavigateTab(item.id)}
              className="bg-white rounded-xl border border-slate-200 hover:border-emerald-500/80 p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl ${item.bgColor} border ${item.borderColor} flex items-center justify-center`}>
                    {item.icon}
                  </div>
                  <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full group-hover:bg-emerald-100 group-hover:text-emerald-800 transition-colors">
                    {item.count} {item.unit}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {item.label}
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:text-emerald-800">
                <span>Kelola Bagian Ini</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Security & Operations Guide */}
      <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-xl p-5">
        <h4 className="text-xs font-black uppercase tracking-wider text-emerald-900 flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Panduan Penggunaan Cepat</span>
        </h4>
        <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
          <li><strong>Tambah Baru:</strong> Klik tombol "+ Tambah" di pojok kanan atas masing-masing modul untuk memasukkan entri baru.</li>
          <li><strong>Unggah Foto:</strong> Anda dapat memilih foto dari komputer/HP Anda (otomatis dioptimalkan) atau memasukkan URL gambar langsung.</li>
          <li><strong>Penyimpanan Real-Time:</strong> Setelah klik simpan, data langsung terupdate ke seluruh pengunjung web sekolah tanpa perlu muat ulang halaman.</li>
          <li><strong>Hapus Aman:</strong> Setiap penghapusan akan meminta konfirmasi terlebih dahulu untuk mencegah kekeliruan klik.</li>
        </ul>
      </div>
    </div>
  );
};
