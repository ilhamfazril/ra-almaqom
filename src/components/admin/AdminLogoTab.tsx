import React, { useState, useRef } from 'react';
import { 
  Sparkles, 
  UploadCloud, 
  RotateCcw, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle, 
  Eye, 
  Sliders, 
  Check, 
  FileCheck, 
  ArrowRight,
  Info
} from 'lucide-react';
import { SchoolLogo } from '../SchoolLogo';
import { validateLogoFile, optimizeSchoolLogo, OptimizedImageResult } from '../../utils/imageOptimizer';

interface AdminLogoTabProps {
  currentCustomLogo?: string;
  onSaveLogo: (optimizedDataUrl: string) => Promise<boolean>;
  onResetLogo: () => Promise<boolean>;
}

export const AdminLogoTab: React.FC<AdminLogoTabProps> = ({
  currentCustomLogo,
  onSaveLogo,
  onResetLogo,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [optimizedResult, setOptimizedResult] = useState<OptimizedImageResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleProcessFile = async (file: File) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    const validation = validateLogoFile(file);
    if (!validation.valid) {
      setErrorMessage(validation.error || 'File tidak valid.');
      return;
    }

    setSelectedFile(file);
    setIsProcessing(true);

    try {
      const optimized = await optimizeSchoolLogo(file, 512, 0.92);
      setOptimizedResult(optimized);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Gagal memproses gambar. Pastikan format file didukung.');
      setSelectedFile(null);
      setOptimizedResult(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleApplyLogo = async () => {
    if (!optimizedResult) return;
    setIsSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const success = await onSaveLogo(optimizedResult.dataUrl);
      if (success) {
        setSuccessMessage('Logo sekolah berhasil diperbarui secara real-time ke seluruh website!');
        setSelectedFile(null);
        setOptimizedResult(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        setErrorMessage('Gagal menyimpan logo ke database cloud. Silakan coba kembali.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Terjadi kesalahan saat menyimpan logo.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefault = async () => {
    if (!window.confirm('Apakah Anda yakin ingin mengembalikan logo ke Logo Vektor Resmi default RA Al-Maqom?')) {
      return;
    }

    setIsResetting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const success = await onResetLogo();
      if (success) {
        setSuccessMessage('Logo berhasil dikembalikan ke Logo Vektor Resmi default.');
        setSelectedFile(null);
        setOptimizedResult(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        setErrorMessage('Gagal mereset logo sekolah. Silakan coba kembali.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Terjadi kesalahan saat mereset logo.');
    } finally {
      setIsResetting(false);
    }
  };

  const handleCancelSelection = () => {
    setSelectedFile(null);
    setOptimizedResult(null);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isUsingCustomLogo = !!currentCustomLogo;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              Fitur Admin Real-Time
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Manajemen Logo Resmi Sekolah
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Ubah logo sekolah dengan gambar kustom pilihan Anda. Sistem otomatis mengompresi gambar ke resolusi HD berukuran ultra-kecil dan aman, lalu menyinkronkannya secara <span className="text-emerald-400 font-semibold">langsung (real-time)</span> ke seluruh perangkat tanpa perlu memuat ulang halaman.
            </p>
          </div>

          {/* Quick status pill */}
          <div className="shrink-0 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-center gap-3">
            <SchoolLogo size={46} withWhiteBg />
            <div>
              <div className="text-[11px] text-slate-300 uppercase tracking-wider font-semibold">
                Status Logo Saat Ini
              </div>
              <div className="text-sm font-bold text-emerald-300 flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {isUsingCustomLogo ? 'Logo Kustom Aktif' : 'Logo Vektor Resmi Default'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-3 shadow-xs animate-in fade-in duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div className="text-xs sm:text-sm font-semibold">{successMessage}</div>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-center gap-3 shadow-xs">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <div className="text-xs sm:text-sm font-semibold">{errorMessage}</div>
        </div>
      )}

      {/* Main Grid: Upload & Live Previews */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Upload & Optimizer Controls (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Upload Dropzone Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Upload Gambar Logo Baru
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Mendukung format PNG transparan, JPG, WEBP, atau vektor SVG.
                </p>
              </div>
              <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                Maks. 10 MB
              </span>
            </div>

            {/* Hidden native input */}
            <input
              type="file"
              ref={fileInputRef}
              accept=".png,.jpg,.jpeg,.webp,.svg,image/png,image/jpeg,image/webp,image/svg+xml"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Drag & drop box */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-3 ${
                isDragging
                  ? 'border-emerald-500 bg-emerald-50/50 scale-[1.01]'
                  : selectedFile
                    ? 'border-emerald-400 bg-emerald-50/20'
                    : 'border-slate-300 hover:border-emerald-500 hover:bg-slate-50/80 bg-slate-50/40'
              }`}
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
                <UploadCloud className="w-7 h-7" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-800">
                  {selectedFile ? selectedFile.name : 'Klik untuk memilih file atau drag & drop ke sini'}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Direkomendasikan rasio 1:1 (persegi) dengan latar belakang transparan
                </div>
              </div>
              <button
                type="button"
                className="mt-1 px-4 py-2 rounded-xl bg-slate-900 hover:bg-emerald-800 text-white text-xs font-bold transition-colors shadow-xs"
              >
                Pilih File dari Komputer/HP
              </button>
            </div>

            {/* Compression & Optimization Stats */}
            {isProcessing && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
                <div className="inline-block w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                <div className="text-xs text-slate-600 font-medium">
                  Mengompresi dan memvalidasi keamanan gambar...
                </div>
              </div>
            )}

            {optimizedResult && !isProcessing && (
              <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-950">
                  <span className="flex items-center gap-1.5 text-emerald-800">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Hasil Kompresi &amp; Sanitasi Otomatis:
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-200/80 text-emerald-900 font-extrabold text-[11px]">
                    Hemat {optimizedResult.reductionPercentage}% Ukuran
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                    <div className="text-[10px] text-slate-500">Ukuran Asli</div>
                    <div className="font-bold text-slate-700">{formatFileSize(optimizedResult.originalSize)}</div>
                  </div>
                  <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                    <div className="text-[10px] text-emerald-700 font-semibold">Ukuran Baru</div>
                    <div className="font-bold text-emerald-900">{formatFileSize(optimizedResult.compressedSize)}</div>
                  </div>
                  <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                    <div className="text-[10px] text-slate-500">Resolusi HD</div>
                    <div className="font-bold text-slate-700">{optimizedResult.width} × {optimizedResult.height} px</div>
                  </div>
                  <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                    <div className="text-[10px] text-slate-500">Keamanan</div>
                    <div className="font-bold text-emerald-700 flex items-center gap-1">
                      <FileCheck className="w-3.5 h-3.5" /> 100% Bersih
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-emerald-900/80 leading-relaxed flex items-start gap-1.5 pt-1">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Gambar telah di-render ulang via Canvas untuk menghapus metadata tersembunyi serta menjaga latar transparan tetap jernih.</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleApplyLogo}
                disabled={!optimizedResult || isSaving}
                className={`px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md ${
                  optimizedResult && !isSaving
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer active:scale-95'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {isSaving ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Menyimpan ke Cloud...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Terapkan &amp; Simpan Logo Real-Time</span>
                  </>
                )}
              </button>

              {optimizedResult && (
                <button
                  type="button"
                  onClick={handleCancelSelection}
                  disabled={isSaving}
                  className="px-4 py-3 rounded-2xl border border-slate-300 text-slate-600 hover:bg-slate-100 text-xs sm:text-sm font-semibold transition-colors"
                >
                  Batal
                </button>
              )}

              {isUsingCustomLogo && (
                <button
                  type="button"
                  onClick={handleResetToDefault}
                  disabled={isResetting || isSaving}
                  className="ml-auto px-4 py-3 rounded-2xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors"
                >
                  {isResetting ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-rose-700 border-t-transparent rounded-full animate-spin" />
                      <span>Mereset...</span>
                    </>
                  ) : (
                    <>
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Kembalikan ke Logo Vektor Resmi</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Security & Technical Specifications */}
          <div className="bg-slate-50 rounded-3xl p-5 border border-slate-200 text-xs text-slate-600 space-y-2">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Mengapa Fitur Ini Aman &amp; Berukuran Kecil?
            </div>
            <ul className="space-y-1.5 pl-5 list-disc text-slate-600 leading-relaxed">
              <li>
                <strong>Kompresi Cerdas Kualitas Retina:</strong> Gambar otomatis dioptimasi ke batas maksimal 512×512 piksel dengan algoritma *high bicubic interpolation* sehingga tetap sangat tajam di layar HP maupun laptop retina.
              </li>
              <li>
                <strong>Ukuran Ultra-Kecil (~15–45 KB):</strong> Mengurangi ukuran file foto asli hingga 98% sehingga halaman web terbuka secepat kilat dan tidak boros kuota internet pengunjung.
              </li>
              <li>
                <strong>Pembersihan Metadata (Anti-Payload):</strong> Proses *canvas rasterization* otomatis mensterilkan EXIF, kode skrip tersembunyi, dan data berbahaya demi keamanan website madrasah.
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Real-Time Preview Simulation (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Card: Live Preview Modes */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-600" />
                Simulasi Pratinjau Langsung
              </h3>
              <span className="text-[11px] font-semibold text-slate-500">
                {optimizedResult ? 'Draft Baru' : 'Sedang Aktif'}
              </span>
            </div>

            {/* Comparison Grid: Light vs Dark Theme */}
            <div className="space-y-3">
              {/* Preview 1: On White / Light Background */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Di Latar Putih / Terang (Navbar &amp; Formulir)
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-center min-h-[110px]">
                  <SchoolLogo
                    size={80}
                    customSrc={optimizedResult ? optimizedResult.dataUrl : currentCustomLogo}
                  />
                </div>
              </div>

              {/* Preview 2: On Dark Background (Footer / Admin Header) */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Di Latar Gelap (Footer &amp; Panel Admin)
                </div>
                <div className="bg-slate-950 p-4 rounded-xl shadow-xs flex items-center justify-center min-h-[110px]">
                  <SchoolLogo
                    size={80}
                    withWhiteBg
                    customSrc={optimizedResult ? optimizedResult.dataUrl : currentCustomLogo}
                  />
                </div>
              </div>
            </div>

            {/* Simulated Live Navbar */}
            <div className="pt-2 border-t border-slate-100">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                Tampilan Pada Header Website:
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
                <SchoolLogo
                  size={46}
                  customSrc={optimizedResult ? optimizedResult.dataUrl : currentCustomLogo}
                />
                <div className="min-w-0">
                  <div className="font-black text-slate-900 text-sm tracking-tight leading-none">
                    RA Al-Maqom
                  </div>
                  <div className="text-[10px] text-emerald-700 font-semibold mt-1 leading-none">
                    Ceria, Islami, Cerdas, Berakhlakul Karimah
                  </div>
                </div>
              </div>
            </div>

            {/* Note */}
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/60 text-amber-900 text-[11px] flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Begitu tombol <strong>"Terapkan &amp; Simpan Logo"</strong> ditekan, logo di seluruh halaman website (Header, Footer, Dokumen Panduan PPDB, Login Admin) akan langsung berubah otomatis secara real-time.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
