import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  Trash2, 
  Check, 
  Image as ImageIcon, 
  Info, 
  RefreshCw, 
  FolderOpen,
  UserCheck,
  Eye,
  Camera
} from 'lucide-react';
import { 
  saveCustomSlide, 
  deleteCustomSlide, 
  clearAllCustomSlides, 
  savePrincipalPhoto, 
  deletePrincipalPhoto 
} from '../utils/slideStorage';
import { PRINCIPAL_INFO } from '../data/schoolData';

export type PhotoModalTab = 'slides' | 'principal' | 'guide';

interface PhotoManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: PhotoModalTab;
  customSlides: Record<number, string>;
  onSlidesUpdated: (newSlides: Record<number, string>) => void;
  principalPhoto: string | null;
  onPrincipalPhotoUpdated: (photo: string | null) => void;
  showClearPhotoView?: boolean;
  onToggleClearPhotoView?: () => void;
}

interface SlideInfo {
  index: number;
  title: string;
  defaultPath: string;
  recommendedDesc: string;
}

const SLIDE_INFOS: SlideInfo[] = [
  {
    index: 0,
    title: 'Slide 1: Gedung Sekolah & Selasar Siswa',
    defaultPath: '/images/slide1_gedung.jpg',
    recommendedDesc: 'Foto gedung sekolah bertingkat dua dengan para siswa-siswi di selasar & tangga.'
  },
  {
    index: 1,
    title: 'Slide 2: Apel Pagi & Upacara Bendera',
    defaultPath: '/images/slide2_upacara.jpg',
    recommendedDesc: 'Foto apel pagi / upacara bendera merah putih di lapangan sekolah.'
  },
  {
    index: 2,
    title: 'Slide 3: Laboratorium Komputer ANBK',
    defaultPath: '/images/slide3_lab_komputer.jpg',
    recommendedDesc: 'Foto ruang lab komputer sekolah dengan PC desktop dan siswa/operator.'
  },
  {
    index: 3,
    title: 'Slide 4: Halaman Depan & Lapangan',
    defaultPath: '/images/slide4_lapangan.jpg',
    recommendedDesc: 'Foto lapangan sekolah, arena bermain, atau halaman depan RA Al-Maqom.'
  }
];

export const PhotoManagerModal: React.FC<PhotoManagerModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'slides',
  customSlides,
  onSlidesUpdated,
  principalPhoto,
  onPrincipalPhotoUpdated,
  showClearPhotoView,
  onToggleClearPhotoView
}) => {
  const [activeTab, setActiveTab] = useState<PhotoModalTab>(initialTab);
  const [loadingSlideIndex, setLoadingSlideIndex] = useState<number | null>(null);
  const [loadingPrincipal, setLoadingPrincipal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});
  const principalInputRef = useRef<HTMLInputElement | null>(null);

  // Sync tab if initialTab changes when opened
  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  // Process Slide File
  const handleSlideFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih file gambar (JPG, PNG, atau WEBP).');
      return;
    }

    setLoadingSlideIndex(index);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      try {
        await saveCustomSlide(index, dataUrl);
        const updated = { ...customSlides, [index]: dataUrl };
        onSlidesUpdated(updated);
        setSuccessMessage(`Foto asli untuk ${SLIDE_INFOS[index].title} berhasil dipasang murni!`);
        setTimeout(() => setSuccessMessage(null), 3500);
      } catch (err) {
        console.error('Failed to save slide image:', err);
        alert('Gagal menyimpan gambar. Mohon coba lagi.');
      } finally {
        setLoadingSlideIndex(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveSlide = async (index: number) => {
    try {
      await deleteCustomSlide(index);
      const updated = { ...customSlides };
      delete updated[index];
      onSlidesUpdated(updated);
      setSuccessMessage(`Foto slide ${index + 1} dikembalikan ke foto bawaan.`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetAllSlides = async () => {
    if (window.confirm('Kembalikan semua slide ke foto awal bawaan?')) {
      await clearAllCustomSlides();
      onSlidesUpdated({});
      setSuccessMessage('Semua foto slide telah di-reset ke bawaan.');
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  // Process Principal File
  const handlePrincipalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih file gambar (JPG, PNG, atau WEBP).');
      return;
    }

    setLoadingPrincipal(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      try {
        await savePrincipalPhoto(dataUrl);
        onPrincipalPhotoUpdated(dataUrl);
        setSuccessMessage('Foto asli Ibu Kepala Sekolah berhasil diperbarui secara murni!');
        setTimeout(() => setSuccessMessage(null), 3500);
      } catch (err) {
        console.error('Failed to save principal photo:', err);
        alert('Gagal menyimpan foto kepala sekolah. Mohon coba lagi.');
      } finally {
        setLoadingPrincipal(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePrincipalPhoto = async () => {
    try {
      await deletePrincipalPhoto();
      onPrincipalPhotoUpdated(null);
      setSuccessMessage('Foto kepala sekolah dikembalikan ke foto bawaan.');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border-b border-slate-800 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-700/70 border border-emerald-500/50 flex items-center justify-center text-amber-300 shadow">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <span>Kelola Foto Asli Sekolah</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                Foto murni tanpa rekayasa AI, resolusi penuh & otomatis tersimpan rapi.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors"
            title="Tutup Modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950/70 px-4 sm:px-6 pt-3 gap-2 sm:gap-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('slides')}
            className={`pb-3 px-3 sm:px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'slides'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Foto Slide Banner ({Object.keys(customSlides).length}/4)</span>
          </button>

          <button
            onClick={() => setActiveTab('principal')}
            className={`pb-3 px-3 sm:px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'principal'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Foto Kepala Sekolah {principalPhoto ? '✓' : ''}</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`pb-3 px-3 sm:px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'guide'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FolderOpen className="w-4 h-4" />
            <span>Panduan File Explorer</span>
          </button>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="mx-6 mt-4 p-3.5 bg-emerald-900/70 border border-emerald-500 rounded-xl text-emerald-200 text-sm flex items-center gap-2 shadow">
            <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-4 sm:p-6 max-h-[65vh] overflow-y-auto">
          {/* TAB 1: SLIDES */}
          {activeTab === 'slides' && (
            <div>
              <div className="mb-5 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs sm:text-sm flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white">4 Foto Slide Asli RA Al-Maqom:</p>
                    <p className="mt-0.5 text-slate-300">
                      Pilih foto asli dari perangkat Anda. Setiap foto akan langsung menggantikan gambar slide dan ditampilkan murni (pixel-asli, tanpa filter AI).
                    </p>
                  </div>
                </div>

                {onToggleClearPhotoView && (
                  <button
                    type="button"
                    onClick={onToggleClearPhotoView}
                    className={`flex-shrink-0 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                      showClearPhotoView
                        ? 'bg-amber-400 text-slate-950 border-amber-500'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-600'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{showClearPhotoView ? 'Mode Jelas: Aktif' : 'Mode Foto Jelas'}</span>
                  </button>
                )}
              </div>

              {/* 4 Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SLIDE_INFOS.map((info) => {
                  const hasCustom = Boolean(customSlides[info.index]);
                  const currentImgSrc = customSlides[info.index] || info.defaultPath;
                  const isLoading = loadingSlideIndex === info.index;

                  return (
                    <div 
                      key={info.index}
                      className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 flex flex-col justify-between hover:border-emerald-500/40 transition-all"
                    >
                      <div>
                        {/* Title & Badge */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <h4 className="font-bold text-white text-sm">
                            {info.title}
                          </h4>
                          {hasCustom ? (
                            <span className="bg-emerald-700 text-emerald-100 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-500 flex items-center gap-1">
                              <Check className="w-3 h-3 text-amber-300" />
                              Foto Asli Terpasang
                            </span>
                          ) : (
                            <span className="bg-slate-700 text-slate-300 text-[11px] font-medium px-2 py-0.5 rounded-full">
                              Foto Bawaan
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-400 mb-3 line-clamp-2">
                          {info.recommendedDesc}
                        </p>

                        {/* Image Preview Box */}
                        <div className="relative w-full h-44 rounded-lg overflow-hidden bg-slate-950 border border-slate-700 mb-3 group">
                          <img
                            src={currentImgSrc}
                            alt={info.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          {isLoading && (
                            <div className="absolute inset-0 bg-black/75 flex items-center justify-center">
                              <RefreshCw className="w-8 h-8 text-amber-400 animate-spin" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 pt-2 border-t border-slate-700/60">
                        <input
                          type="file"
                          accept="image/*"
                          ref={(el) => (fileInputRefs.current[info.index] = el)}
                          className="hidden"
                          onChange={(e) => handleSlideFileChange(info.index, e)}
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRefs.current[info.index]?.click()}
                          disabled={isLoading}
                          className="flex-1 bg-emerald-700 hover:bg-emerald-600 active:scale-95 text-white font-bold py-2.5 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all shadow border border-emerald-500/50"
                        >
                          <Upload className="w-3.5 h-3.5 text-amber-300" />
                          <span>{hasCustom ? 'Ganti Foto Asli Ini' : 'Pilih Foto Asli'}</span>
                        </button>

                        {hasCustom && (
                          <button
                            type="button"
                            onClick={() => handleRemoveSlide(info.index)}
                            className="p-2.5 rounded-lg bg-red-900/40 hover:bg-red-800 text-red-300 hover:text-white transition-colors border border-red-700/50 text-xs"
                            title="Kembalikan slide ini ke foto bawaan"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {Object.keys(customSlides).length > 0 && (
                <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
                  <button
                    onClick={handleResetAllSlides}
                    className="text-xs text-slate-400 hover:text-red-400 flex items-center gap-1.5 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset semua foto slide ke bawaan</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: KEPALA SEKOLAH */}
          {activeTab === 'principal' && (
            <div className="max-w-2xl mx-auto py-2">
              <div className="mb-6 p-4 rounded-xl bg-emerald-950/50 border border-emerald-600/40 text-emerald-200 text-xs sm:text-sm flex items-start gap-3">
                <Info className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">Ganti Foto Kepala Sekolah Asli:</p>
                  <p className="mt-0.5 text-slate-300">
                    Unggah foto asli Ibu Kepala Sekolah ({PRINCIPAL_INFO.name}). Foto akan langsung tampil pada bagian Sambutan Kepala Sekolah di halaman Profil dan Beranda tanpa rekayasa AI.
                  </p>
                </div>
              </div>

              <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6">
                {/* Photo Preview Frame */}
                <div className="relative w-48 h-48 sm:w-52 sm:h-52 flex-shrink-0 rounded-2xl overflow-hidden border-4 border-amber-400/80 shadow-2xl bg-slate-950 group">
                  <img
                    src={principalPhoto || PRINCIPAL_INFO.photo}
                    alt={PRINCIPAL_INFO.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {loadingPrincipal && (
                    <div className="absolute inset-0 bg-black/75 flex items-center justify-center">
                      <RefreshCw className="w-8 h-8 text-amber-400 animate-spin" />
                    </div>
                  )}
                  <div className="absolute bottom-2 inset-x-2 bg-slate-950/85 backdrop-blur-sm py-1 px-2 rounded-lg text-center border border-amber-400/30">
                    <span className="text-[10px] font-bold text-amber-300">
                      {principalPhoto ? 'Foto Asli Anda' : 'Foto Default'}
                    </span>
                  </div>
                </div>

                {/* Info & Upload Button */}
                <div className="flex-1 text-center sm:text-left space-y-3">
                  <div>
                    <h4 className="text-lg font-black text-white">
                      {PRINCIPAL_INFO.name}
                    </h4>
                    <p className="text-xs sm:text-sm text-emerald-400 font-semibold">
                      {PRINCIPAL_INFO.role}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      RA Al-Maqom — Yayasan Al-Maqom
                    </p>
                  </div>

                  <div className="text-xs text-slate-400 space-y-1 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                    <p className="font-semibold text-slate-300">Saran Format:</p>
                    <p>• Format foto: JPG, PNG, atau WEBP</p>
                    <p>• Rasio foto: Persegi (1:1) atau Potret (4:5)</p>
                    <p>• Kualitas asli Anda dipertahankan 100%</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <input
                      type="file"
                      accept="image/*"
                      ref={principalInputRef}
                      className="hidden"
                      onChange={handlePrincipalFileChange}
                    />
                    <button
                      type="button"
                      onClick={() => principalInputRef.current?.click()}
                      disabled={loadingPrincipal}
                      className="bg-emerald-700 hover:bg-emerald-600 active:scale-95 text-white font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-all shadow border border-emerald-500/50"
                    >
                      <Upload className="w-4 h-4 text-amber-300" />
                      <span>{principalPhoto ? 'Ganti Foto Asli Ini' : 'Pilih Foto Asli Kepala Sekolah'}</span>
                    </button>

                    {principalPhoto && (
                      <button
                        type="button"
                        onClick={handleRemovePrincipalPhoto}
                        className="bg-red-900/40 hover:bg-red-800 text-red-200 hover:text-white font-semibold py-2.5 px-3 rounded-xl text-xs flex items-center gap-1.5 transition-colors border border-red-700/50"
                        title="Kembalikan foto kepala sekolah ke bawaan"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Kembalikan Bawaan</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FILE EXPLORER GUIDE */}
          {activeTab === 'guide' && (
            <div className="space-y-4 text-slate-200 text-sm">
              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
                <h4 className="font-bold text-white text-base mb-2 flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-amber-400" />
                  <span>Menyimpan Foto Asli ke Folder Proyek (Permanen)</span>
                </h4>
                <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">
                  Jika Anda ingin file foto asli sekolah disimpan secara permanen di dalam repositori source code website ini, Anda dapat langsung menyeret (drag-and-drop) file foto asli Anda ke folder <code className="text-amber-300 bg-slate-900 px-2 py-0.5 rounded font-mono">public/images/</code> melalui panel <strong>File Explorer</strong> di sebelah kiri editor AI Studio dengan penamaan berikut:
                </p>

                <div className="mt-4 space-y-2 font-mono text-xs">
                  <div className="p-2.5 rounded bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <span className="text-emerald-400">public/images/slide1_gedung.jpg</span>
                    <span className="text-slate-400 text-[11px]">Foto Gedung Sekolah</span>
                  </div>
                  <div className="p-2.5 rounded bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <span className="text-emerald-400">public/images/slide2_upacara.jpg</span>
                    <span className="text-slate-400 text-[11px]">Foto Apel / Upacara</span>
                  </div>
                  <div className="p-2.5 rounded bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <span className="text-emerald-400">public/images/slide3_lab_komputer.jpg</span>
                    <span className="text-slate-400 text-[11px]">Foto Lab Komputer</span>
                  </div>
                  <div className="p-2.5 rounded bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <span className="text-emerald-400">public/images/slide4_lapangan.jpg</span>
                    <span className="text-slate-400 text-[11px]">Foto Lapangan / Halaman</span>
                  </div>
                  <div className="p-2.5 rounded bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <span className="text-amber-400">public/images/kepala_sekolah.jpg</span>
                    <span className="text-slate-400 text-[11px]">Foto Kepala Sekolah</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-600/30 text-xs sm:text-sm text-emerald-200">
                <p className="font-semibold text-white">Catatan Keaslian:</p>
                <p className="mt-1 text-emerald-100/90 leading-relaxed">
                  Semua foto yang dimasukkan baik melalui menu <strong>Kelola Foto</strong> maupun File Explorer akan langsung ditampilkan secara murni, tajam, dan tidak akan diubah atau digenerate ulang oleh AI.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-400 flex items-center gap-3">
            <span>
              Slide: {Object.keys(customSlides).length} dari 4 terpasang
            </span>
            <span>•</span>
            <span>
              Kepala Sekolah: {principalPhoto ? 'Foto Asli' : 'Bawaan'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold px-5 py-2 rounded-xl text-xs sm:text-sm transition-colors shadow"
          >
            Selesai & Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
