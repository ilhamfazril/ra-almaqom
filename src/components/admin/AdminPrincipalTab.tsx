import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Upload, 
  UserCheck, 
  Eye, 
  CheckCircle2, 
  Quote, 
  Camera 
} from 'lucide-react';
import { PrincipalProfileContent, compressImageForStorage } from '../../services/siteContentService';

interface AdminPrincipalTabProps {
  principal: PrincipalProfileContent;
  onSavePrincipal: (updated: PrincipalProfileContent) => Promise<void>;
}

export const AdminPrincipalTab: React.FC<AdminPrincipalTabProps> = ({
  principal,
  onSavePrincipal,
}) => {
  const [draft, setDraft] = useState<PrincipalProfileContent>(principal);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  // Sync draft whenever principal prop updates from Firestore ONLY if no unsaved user changes
  useEffect(() => {
    if (!isDirty && principal) {
      setDraft(principal);
    }
  }, [principal, isDirty]);

  const handleFieldChange = (field: keyof PrincipalProfileContent, value: string) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
    setSaveSuccess(false);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadStatus('Mengompresi dan mengoptimalkan foto Kepala Sekolah...');
      const optimized = await compressImageForStorage(file, 500, 500, 0.70);
      handleFieldChange('photo', optimized);
      setUploadStatus('✓ Foto Kepala Sekolah siap. Klik "Simpan Profil Kepala Sekolah" untuk mempublikasikan secara permanen.');
      setTimeout(() => setUploadStatus(null), 5000);
    } catch (err) {
      console.error(err);
      alert('Gagal memproses file foto. Gunakan format JPG/PNG.');
      setUploadStatus(null);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onSavePrincipal(draft);
      setIsDirty(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan profil Kepala Sekolah ke Firestore.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-emerald-700" />
            <span>Profil & Sambutan Kepala Sekolah</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Perbarui foto resmi, nama lengkap, gelar, jabatan, serta kutipan mutiara Kepala Sekolah.
          </p>
        </div>

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
              <span>Simpan Profil Kepala Sekolah</span>
            </>
          )}
        </button>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Profil Kepala Sekolah berhasil diperbarui di Cloud Firestore secara Real-Time!</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: 7 cols */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-sm">
          {/* Photo */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Foto Resmi Kepala Sekolah
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={draft.photo}
                onChange={(e) => handleFieldChange('photo', e.target.value)}
                placeholder="https://... atau data:image/..."
                className="flex-grow px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <label className="cursor-pointer inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-bold transition-colors whitespace-nowrap">
                <Camera className="w-3.5 h-3.5" />
                <span>Pilih Foto Baru</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
              <span>Mendukung file JPG, PNG dari HP atau kamera.</span>
              <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/80">⚡ Kompresi cerdas &lt;60 KB</span>
            </div>
            {uploadStatus && (
              <p className="text-[11px] text-emerald-700 font-medium animate-pulse mt-1">
                {uploadStatus}
              </p>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nama Lengkap & Gelar
            </label>
            <input
              type="text"
              value={draft.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              placeholder="Contoh: Niken Isniyanti, S.Pd."
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none font-semibold text-slate-900"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Jabatan Resmi
            </label>
            <input
              type="text"
              value={draft.role}
              onChange={(e) => handleFieldChange('role', e.target.value)}
              placeholder="Kepala RA Al-Maqom"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Quote */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Kutipan Mutiara / Pesan Kepemimpinan
            </label>
            <textarea
              rows={4}
              value={draft.quote}
              onChange={(e) => handleFieldChange('quote', e.target.value)}
              placeholder="Tuliskan pesan motivasi atau visi kepemimpinan..."
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none leading-relaxed italic"
            />
          </div>
        </div>

        {/* Right Preview: 5 cols */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-emerald-600" />
              <span>Pratinjau Kartu Kepala Sekolah</span>
            </h4>
            <span className="text-[11px] text-slate-400">Tampilan Web</span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center shadow-sm flex flex-col items-center">
            <div className="relative w-40 h-40 rounded-2xl overflow-hidden shadow-md border-4 border-amber-400 p-1 bg-gradient-to-br from-emerald-700 to-teal-900 mb-4">
              <img
                src={draft.photo}
                alt={draft.name}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <h4 className="text-base font-extrabold text-slate-900">
              {draft.name || 'Nama Kepala Sekolah'}
            </h4>
            <p className="text-xs font-semibold text-emerald-700 mt-0.5">
              {draft.role || 'Jabatan'}
            </p>
            <div className="mt-1.5 text-[11px] text-slate-500 bg-slate-100 px-3 py-0.5 rounded-full font-medium">
              Yayasan Al-Maqom
            </div>

            <div className="mt-4 bg-emerald-50/80 border-l-4 border-emerald-600 p-3.5 rounded-r-xl text-left w-full relative">
              <Quote className="w-5 h-5 text-emerald-400/40 absolute top-2 right-2" />
              <p className="italic text-slate-700 text-xs font-medium leading-relaxed">
                {draft.quote || 'Kutipan sambutan kepala sekolah...'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
