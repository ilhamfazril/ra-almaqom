import React, { useState } from 'react';
import { 
  GraduationCap, 
  Calendar, 
  FileText, 
  CheckCircle, 
  ArrowRight, 
  Download, 
  HelpCircle, 
  UserCheck, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { PSB_INFO } from '../data/schoolData';
import { downloadPpdbGuidePdf } from '../utils/downloadPpdbGuide';

interface PsbSectionProps {
  onOpenPsbModal: () => void;
}

export const PsbSection: React.FC<PsbSectionProps> = ({ onOpenPsbModal }) => {
  const [activeTab, setActiveTab] = useState<'jalur' | 'alur' | 'syarat'>('jalur');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadBrochure = () => {
    try {
      downloadPpdbGuidePdf();
      setDownloadSuccess(true);
      setTimeout(() => {
        setDownloadSuccess(false);
      }, 4000);
    } catch (err) {
      console.error('Error generating PDF:', err);
    }
  };

  return (
    <section id="psb" className="py-16 sm:py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider mb-3 border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Penerimaan Peserta Didik Baru (PPDB)</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Penerimaan Peserta Didik Baru <br className="hidden sm:inline" />
            <span className="text-amber-400">Tahun Pelajaran {PSB_INFO.academicYear}</span>
          </h2>
          <p className="mt-3 text-slate-300 text-base sm:text-lg">
            Bergabunglah bersama keluarga besar RA Al-Maqom. Dapatkan pendidikan anak usia dini berkualitas, cinta Al-Qur’an, dan berakhlakul karimah dengan suasana ceria.
          </p>
        </div>

        {/* Quick Alert Status */}
        <div className="max-w-4xl mx-auto mb-10 bg-emerald-950/80 border border-emerald-500/40 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-300">Status Pendaftaran</div>
              <div className="text-sm font-semibold text-white">Jalur Prestasi & Jalur Reguler 2027/2028 Dibuka</div>
            </div>
          </div>
          <button
            id="btn-register-psb-banner"
            onClick={onOpenPsbModal}
            className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-lg transition-colors flex items-center justify-center gap-1.5"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Formulir Pra-Pendaftaran PPDB</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 bg-slate-800/80 rounded-2xl border border-slate-700">
            <button
              onClick={() => setActiveTab('jalur')}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'jalur'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Jalur Pendaftaran
            </button>
            <button
              onClick={() => setActiveTab('alur')}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'alur'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Alur 6 Langkah
            </button>
            <button
              onClick={() => setActiveTab('syarat')}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'syarat'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Syarat Dokumen
            </button>
          </div>
        </div>

        {/* Tab 1: Jalur Pendaftaran */}
        {activeTab === 'jalur' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {PSB_INFO.batches.map((batch, idx) => (
              <div
                key={idx}
                className="bg-slate-800/90 rounded-3xl p-6 sm:p-8 border border-slate-700 hover:border-emerald-500/50 shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                      Jalur {idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                      {batch.status}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{batch.name}</h3>
                  <p className="text-slate-300 text-sm leading-relaxed mb-6">
                    {batch.desc}
                  </p>

                  <div className="space-y-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-700/80 text-xs sm:text-sm">
                    <div className="flex justify-between items-center text-slate-300">
                      <span className="text-slate-400">Periode Pendaftaran:</span>
                      <span className="font-semibold text-white">{batch.startDate} - {batch.endDate}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-300 border-t border-slate-800 pt-2">
                      <span className="text-slate-400">Pengumuman Kelulusan:</span>
                      <span className="font-bold text-amber-300">{batch.announcementDate}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-700 flex items-center justify-between">
                  <button
                    onClick={onOpenPsbModal}
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 group"
                  >
                    <span>Ajukan Konsultasi Pendaftaran</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Alur Pendaftaran 6 Langkah */}
        {activeTab === 'alur' && (
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {PSB_INFO.steps.map((item) => (
                <div
                  key={item.step}
                  className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 hover:border-emerald-500 transition-all relative"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-extrabold flex items-center justify-center text-sm mb-4 shadow">
                    0{item.step}
                  </div>
                  <h4 className="text-base font-bold text-white mb-2">{item.title}</h4>
                  <p className="text-slate-300 text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Dokumen Persyaratan */}
        {activeTab === 'syarat' && (
          <div className="max-w-3xl mx-auto bg-slate-800/90 rounded-3xl p-6 sm:p-8 border border-slate-700">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-6 h-6 text-amber-400" />
              <h3 className="text-xl font-bold text-white">Dokumen Wajib Persyaratan Pendaftaran</h3>
            </div>
            <div className="space-y-3">
              {PSB_INFO.requirements.map((req, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-700/60 text-slate-200 text-xs sm:text-sm"
                >
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{req}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Action Cards */}
        <div className="mt-12 pt-8 border-t border-slate-800 max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <div className="text-sm font-bold text-white">Butuh Panduan Lengkap PPDB 2027/2028?</div>
            <p className="text-xs text-slate-400">Unduh booklet informasi resmi, tabel biaya, dan panduan seleksi.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadBrochure}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>{downloadSuccess ? 'Panduan Berhasil Diunduh!' : 'Unduh Pedoman PPDB'}</span>
            </button>
            <button
              onClick={onOpenPsbModal}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              <span>Daftar Sekarang</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
