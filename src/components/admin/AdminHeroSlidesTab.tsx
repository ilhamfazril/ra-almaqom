import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Upload, 
  Image as ImageIcon, 
  Eye, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  Layers,
  Plus,
  Trash2,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  MoveLeft,
  MoveRight
} from 'lucide-react';
import { HeroSlideContent, compressImageForStorage } from '../../services/siteContentService';

interface AdminHeroSlidesTabProps {
  slides: HeroSlideContent[];
  onSaveSlides: (updatedSlides: HeroSlideContent[]) => Promise<void>;
  onBack?: () => void;
}

export const AdminHeroSlidesTab: React.FC<AdminHeroSlidesTabProps> = ({
  slides,
  onSaveSlides,
  onBack,
}) => {
  // Ensure we have at least 1 slide in the draft
  const [slidesDraft, setSlidesDraft] = useState<HeroSlideContent[]>(() => {
    return slides && slides.length > 0 ? slides : [
      {
        id: 1,
        bgImage: '/images/slide1_gedung.jpg',
        title: 'RA Al-Maqom - Ceria, Cerdas, Berakhlakul Karimah',
        subtitle: 'Terakreditasi BAP-S/M | Kurikulum Merdeka PAUD & Nilai Islami',
        description: 'Mewujudkan generasi Qur’ani usia dini yang mandiri, kreatif, dan berakhlak mulia dengan metode bermain sambil belajar yang menyenangkan.',
        badge: 'Profil Sekolah',
        primaryBtn: 'Pendaftaran PPDB 2026/2027',
        secondaryBtn: 'Jelajahi Profil Sekolah'
      }
    ];
  });

  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  // Sync slides from Firestore ONLY if user is not actively making unsaved changes
  useEffect(() => {
    if (!isDirty && slides && slides.length > 0) {
      setSlidesDraft(slides);
    }
  }, [slides, isDirty]);

  // Safe reference to currently selected slide
  const validIndex = Math.min(selectedIndex, Math.max(0, slidesDraft.length - 1));
  const currentSlide = slidesDraft[validIndex] || slidesDraft[0];

  const handleFieldChange = (field: keyof HeroSlideContent, value: string) => {
    setSlidesDraft((prev) => {
      const updated = [...prev];
      if (updated[validIndex]) {
        updated[validIndex] = {
          ...updated[validIndex],
          [field]: value,
        };
      }
      return updated;
    });
    setIsDirty(true);
    setSaveSuccess(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadStatus(`Mengompresi dan mengoptimalkan foto slide ${validIndex + 1}...`);
      const optimized = await compressImageForStorage(file, 1200, 700, 0.70);
      handleFieldChange('bgImage', optimized);
      setUploadStatus('✓ Foto slide berhasil dipasang. Klik "Simpan Semua Slide ke Cloud" di bawah untuk mempublikasikan secara permanen.');
      setTimeout(() => setUploadStatus(null), 5000);
    } catch (err) {
      console.error(err);
      alert('Gagal memproses file foto. Pastikan format foto adalah JPG/PNG.');
      setUploadStatus(null);
    }
  };

  // Add new slide (dynamic - no limit of 4)
  const handleAddNewSlide = () => {
    const newSlideId = `slide-${Date.now()}`;
    const newSlideNumber = slidesDraft.length + 1;
    const newSlide: HeroSlideContent = {
      id: newSlideId,
      bgImage: '/images/slide1_gedung.jpg',
      alt: `Slide ${newSlideNumber} RA Al-Maqom`,
      title: `Slide ${newSlideNumber} - Program & Kegiatan RA Al-Maqom`,
      subtitle: 'Membimbing Potensi Terbaik Generasi Penerus Bangsa',
      description: 'Kegiatan edukatif dan pembentukan kepribadian siswa berwawasan global yang didampingi oleh tenaga pendidik profesional.',
      badge: 'Kegiatan Sekolah',
      primaryBtn: 'Informasi Lengkap',
      secondaryBtn: 'Hubungi Kami'
    };

    const updated = [...slidesDraft, newSlide];
    setSlidesDraft(updated);
    setSelectedIndex(updated.length - 1);
    setSaveSuccess(false);
  };

  // Delete slide (with minimum 1 slide constraint)
  const handleDeleteSlide = (indexToDelete: number) => {
    if (slidesDraft.length <= 1) {
      alert('Minimal harus ada 1 slide untuk tampilan beranda website.');
      return;
    }

    const confirmDelete = window.confirm(`Apakah Anda yakin ingin menghapus Slide ${indexToDelete + 1}?`);
    if (!confirmDelete) return;

    const updated = slidesDraft.filter((_, idx) => idx !== indexToDelete);
    setSlidesDraft(updated);
    if (validIndex >= updated.length) {
      setSelectedIndex(Math.max(0, updated.length - 1));
    }
    setSaveSuccess(false);
  };

  // Move slide reordering
  const handleMoveSlide = (fromIndex: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? fromIndex - 1 : fromIndex + 1;
    if (targetIndex < 0 || targetIndex >= slidesDraft.length) return;

    const updated = [...slidesDraft];
    const temp = updated[fromIndex];
    updated[fromIndex] = updated[targetIndex];
    updated[targetIndex] = temp;

    setSlidesDraft(updated);
    setSelectedIndex(targetIndex);
    setSaveSuccess(false);
  };

  // Save to Firestore in real-time
  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onSaveSlides(slidesDraft);
      setIsDirty(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan perubahan slide ke Firestore.');
    } finally {
      setIsSaving(false);
    }
  };

  const presetPhotos = [
    { label: 'Gedung Utama', url: '/images/slide1_gedung.jpg' },
    { label: 'Upacara & Siswa', url: '/images/slide2_upacara.jpg' },
    { label: 'Lab Komputer ANBK', url: '/images/slide3_lab_komputer.jpg' },
    { label: 'Lapangan Olahraga', url: '/images/slide4_lapangan.jpg' },
    { label: 'Gedung Sekolah RA Al-Maqom', url: '/images/slide1_gedung.jpg' },
    { label: 'Aktivitas Belajar Siswa', url: '/images/slide3_lab_komputer.jpg' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="Kembali"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-emerald-700" />
              <span>Pengaturan Hero Slides (Beranda)</span>
              <span className="text-xs font-normal text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                {slidesDraft.length} Slide Aktif
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelola slide beranda secara dinamis (bisa ditambah, dikurangi, dan diubah urutan) dengan sinkronisasi Cloud Firestore.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleAddNewSlide}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold transition-all shadow-xs"
          >
            <Plus className="w-4 h-4 text-emerald-700" />
            <span>Tambah Slide</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Menyimpan ke Cloud...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan Slide</span>
              </>
            )}
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2 animate-in fade-in shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Seluruh slide ({slidesDraft.length} slide) berhasil disimpan dan diperbarui di Cloud Firestore secara Real-Time!</span>
        </div>
      )}

      {/* Dynamic Slide Carousel Selector */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-black uppercase tracking-wider text-slate-500">
            Daftar Slide Banner ({slidesDraft.length} slide total)
          </label>
          <span className="text-[11px] text-slate-500">
            Klik tab untuk mengedit kontennya
          </span>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {slidesDraft.map((slide, idx) => {
            const isCurrent = idx === validIndex;
            return (
              <div
                key={slide.id || idx}
                className={`relative flex-shrink-0 w-44 p-2.5 rounded-xl border text-left transition-all flex flex-col gap-1.5 ${
                  isCurrent
                    ? 'border-emerald-600 bg-emerald-50/80 shadow-md ring-2 ring-emerald-500/30'
                    : 'border-slate-200 bg-white hover:bg-slate-50 shadow-xs'
                }`}
              >
                {/* Header row in card */}
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setSelectedIndex(idx)}
                    className="flex items-center gap-1.5 text-left flex-1 truncate"
                  >
                    <span className={`text-xs font-bold ${isCurrent ? 'text-emerald-800' : 'text-slate-700'}`}>
                      Slide {idx + 1}
                    </span>
                    {idx === 0 && (
                      <span className="text-[9px] uppercase font-black text-amber-600 bg-amber-100 px-1 py-0.2 rounded">
                        Utama
                      </span>
                    )}
                  </button>

                  {/* Move & Delete controls */}
                  <div className="flex items-center gap-1">
                    {idx > 0 && (
                      <button
                        type="button"
                        onClick={() => handleMoveSlide(idx, 'left')}
                        className="p-1 hover:bg-slate-200 rounded text-slate-500 hover:text-slate-800"
                        title="Geser ke kiri"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {idx < slidesDraft.length - 1 && (
                      <button
                        type="button"
                        onClick={() => handleMoveSlide(idx, 'right')}
                        className="p-1 hover:bg-slate-200 rounded text-slate-500 hover:text-slate-800"
                        title="Geser ke kanan"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {slidesDraft.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDeleteSlide(idx)}
                        className="p-1 hover:bg-rose-100 rounded text-slate-400 hover:text-rose-600 transition-colors"
                        title="Hapus slide ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Thumbnail */}
                <div 
                  onClick={() => setSelectedIndex(idx)}
                  className="h-16 w-full rounded-lg overflow-hidden bg-slate-100 border border-slate-200 relative cursor-pointer group"
                >
                  <img
                    src={slide.bgImage}
                    alt={slide.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                </div>

                {/* Title snippet */}
                <p 
                  onClick={() => setSelectedIndex(idx)}
                  className="text-[11px] text-slate-600 truncate font-medium cursor-pointer"
                  title={slide.title}
                >
                  {slide.title || 'Belum ada judul'}
                </p>
              </div>
            );
          })}

          {/* Quick Add Button Tab */}
          <button
            type="button"
            onClick={handleAddNewSlide}
            className="flex-shrink-0 w-36 h-[126px] rounded-xl border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/40 hover:bg-emerald-50 text-emerald-800 flex flex-col items-center justify-center gap-2 text-xs font-bold transition-all"
            title="Tambah Slide Baru"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-200/80 flex items-center justify-center">
              <Plus className="w-5 h-5 text-emerald-800" />
            </div>
            <span>+ Tambah Slide</span>
          </button>
        </div>
      </div>

      {/* Main Slide Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: 7 cols */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
              Form Konten Slide {validIndex + 1} dari {slidesDraft.length}
            </h4>

            {slidesDraft.length > 1 && (
              <button
                type="button"
                onClick={() => handleDeleteSlide(validIndex)}
                className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-lg border border-rose-200 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus Slide Ini</span>
              </button>
            )}
          </div>

          {/* Image control */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              Foto Latar Belakang Slide
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={currentSlide.bgImage}
                onChange={(e) => handleFieldChange('bgImage', e.target.value)}
                placeholder="https://... atau /images/slide1_gedung.jpg"
                className="flex-grow px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <label className="cursor-pointer inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-bold transition-colors whitespace-nowrap">
                <Upload className="w-3.5 h-3.5" />
                <span>Unggah Foto</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>Mendukung file JPG, PNG, atau WEBP dari HP/komputer.</span>
              <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/80">⚡ Kompresi otomatis &lt;80 KB</span>
            </div>
            {uploadStatus && (
              <p className="text-[11px] text-emerald-700 font-medium animate-pulse">
                {uploadStatus}
              </p>
            )}

            {/* Presets */}
            <div className="pt-1">
              <span className="text-[11px] text-slate-500 font-medium mr-2">Pilihan cepat:</span>
              <div className="inline-flex flex-wrap gap-1.5 mt-1">
                {presetPhotos.map((preset, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleFieldChange('bgImage', preset.url)}
                    className="text-[10px] bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-900 border border-slate-200 px-2 py-0.5 rounded font-medium transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Judul Utama Slide
            </label>
            <input
              type="text"
              value={currentSlide.title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              placeholder="Judul besar yang menarik"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none font-semibold text-slate-900"
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Sub-Judul
            </label>
            <input
              type="text"
              value={currentSlide.subtitle}
              onChange={(e) => handleFieldChange('subtitle', e.target.value)}
              placeholder="Sub judul singkat"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Deskripsi Paragraf
            </label>
            <textarea
              rows={3}
              value={currentSlide.description}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              placeholder="Penjelasan ringkas mengenai slide"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none leading-relaxed"
            />
          </div>

          {/* Buttons Labels */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Teks Tombol Utama
              </label>
              <input
                type="text"
                value={currentSlide.primaryBtn || ''}
                onChange={(e) => handleFieldChange('primaryBtn', e.target.value)}
                placeholder="Pendaftaran PPDB"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Teks Tombol Sekunder
              </label>
              <input
                type="text"
                value={currentSlide.secondaryBtn || ''}
                onChange={(e) => handleFieldChange('secondaryBtn', e.target.value)}
                placeholder="Jelajahi Profil"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Right Preview: 5 cols */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-emerald-600" />
              <span>Pratinjau Slide {validIndex + 1}</span>
            </h4>
            <span className="text-[11px] text-slate-400">Tampilan Live Beranda</span>
          </div>

          <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-300 bg-slate-950 aspect-[4/3] flex flex-col justify-end p-5 text-white">
            <img
              src={currentSlide.bgImage}
              alt={currentSlide.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

            <div className="relative z-10 space-y-2">
              <h5 className="text-base font-extrabold leading-tight text-white drop-shadow">
                {currentSlide.title || 'Judul Slide'}
              </h5>
              <p className="text-[11px] text-amber-200 font-medium">
                {currentSlide.subtitle}
              </p>
              <p className="text-[11px] text-slate-200 line-clamp-2 leading-relaxed">
                {currentSlide.description}
              </p>
              <div className="flex gap-2 pt-1">
                <span className="bg-emerald-700 text-white text-[10px] font-bold px-2.5 py-1 rounded">
                  {currentSlide.primaryBtn || 'PPDB Online'}
                </span>
                <span className="bg-white/20 text-white text-[10px] font-bold px-2.5 py-1 rounded">
                  {currentSlide.secondaryBtn || 'Profil Sekolah'}
                </span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
            <p className="font-bold text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Kapasitas Slide Dinamis:</span>
            </p>
            <p className="text-[11px] leading-relaxed">
              Anda kini bebas menambah atau menghapus slide sesuai kebutuhan promosi atau pengumuman sekolah, tidak lagi terpatok pada 4 slide.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
