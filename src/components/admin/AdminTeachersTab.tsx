import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Save, 
  X, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  GraduationCap, 
  Upload, 
  User, 
  BookOpen, 
  Award,
  Briefcase
} from 'lucide-react';
import { TeacherStaff } from '../../types';
import { compressImageForStorage } from '../../services/siteContentService';

interface AdminTeachersTabProps {
  teachersList: TeacherStaff[];
  onSaveTeachers: (
    updated: TeacherStaff[], 
    meta?: { action?: 'create' | 'update' | 'delete'; title?: string }
  ) => Promise<void>;
}

export const AdminTeachersTab: React.FC<AdminTeachersTabProps> = ({
  teachersList,
  onSaveTeachers,
}) => {
  const [items, setItems] = useState<TeacherStaff[]>(teachersList);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('Semua');
  const [editingItem, setEditingItem] = useState<TeacherStaff | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<TeacherStaff | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  // Sync state with parent updates
  useEffect(() => {
    if (teachersList) {
      setItems(teachersList);
    }
  }, [teachersList]);

  const roleCategories = [
    'Semua',
    'Kepala Sekolah & Pimpinan',
    'Guru Mata Pelajaran',
    'Wali Kelas',
    'Staf & Laboran',
  ];

  const filtered = items.filter((teacher) => {
    let matchesCategory = true;
    if (selectedRoleFilter === 'Kepala Sekolah & Pimpinan') {
      matchesCategory = teacher.role.toLowerCase().includes('kepala') || teacher.role.toLowerCase().includes('wakil');
    } else if (selectedRoleFilter === 'Guru Mata Pelajaran') {
      matchesCategory = teacher.role.toLowerCase().includes('guru') || (!teacher.role.toLowerCase().includes('kepala') && !teacher.role.toLowerCase().includes('laboran'));
    } else if (selectedRoleFilter === 'Wali Kelas') {
      matchesCategory = teacher.role.toLowerCase().includes('wali');
    } else if (selectedRoleFilter === 'Staf & Laboran') {
      matchesCategory = teacher.role.toLowerCase().includes('staf') || teacher.role.toLowerCase().includes('proktor') || teacher.role.toLowerCase().includes('laboran') || teacher.role.toLowerCase().includes('tata usaha');
    }

    const q = searchQuery.toLowerCase();
    const matchesSearch =
      teacher.name.toLowerCase().includes(q) ||
      teacher.role.toLowerCase().includes(q) ||
      teacher.subject.toLowerCase().includes(q) ||
      teacher.education.toLowerCase().includes(q);

    return matchesCategory && matchesSearch;
  });

  const handleOpenAdd = () => {
    setEditingItem({
      id: `t-${Date.now()}`,
      name: '',
      role: 'Guru Mata Pelajaran',
      subject: '',
      education: 'S1 Pendidikan',
      image: '',
    });
    setIsCreatingNew(true);
  };

  const handleOpenEdit = (item: TeacherStaff) => {
    setEditingItem(JSON.parse(JSON.stringify(item)));
    setIsCreatingNew(false);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    if (!editingItem.name.trim()) {
      alert('Nama guru / tenaga pendidik tidak boleh kosong.');
      return;
    }
    if (!editingItem.role.trim()) {
      alert('Jabatan / peran tidak boleh kosong.');
      return;
    }
    if (!editingItem.subject.trim()) {
      alert('Mata pelajaran atau bidang tugas tidak boleh kosong.');
      return;
    }

    let updatedList: TeacherStaff[];
    if (isCreatingNew) {
      updatedList = [...items, editingItem];
    } else {
      updatedList = items.map((t) => (t.id === editingItem.id ? editingItem : t));
    }

    setItems(updatedList);
    const actionType = isCreatingNew ? 'create' : 'update';
    const itemTitle = `${editingItem.name} (${editingItem.role})`;
    setEditingItem(null);

    try {
      setIsSaving(true);
      await onSaveTeachers(updatedList, { action: actionType, title: itemTitle });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan profil guru ke database.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    const deletedTitle = itemToDelete.name;
    const updatedList = items.filter((t) => t.id !== itemToDelete.id);
    setItems(updatedList);
    setItemToDelete(null);

    try {
      setIsSaving(true);
      await onSaveTeachers(updatedList, { action: 'delete', title: deletedTitle });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      console.error(err);
      alert('Gagal menghapus profil guru dari database.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingItem) return;

    try {
      setUploadStatus('Mengompresi dan mengoptimalkan foto guru...');
      const base64 = await compressImageForStorage(file, 600, 600, 0.75);
      setEditingItem({
        ...editingItem,
        image: base64,
      });
      setUploadStatus(null);
    } catch (err) {
      console.error(err);
      alert('Gagal memproses gambar foto guru. Silakan pilih foto lain berukuran lebih kecil.');
      setUploadStatus(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Tab Header & Action Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-emerald-700" />
              <span>Manajemen Dewan Guru & Tenaga Kependidikan</span>
            </h3>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {items.length} Guru Terdaftar
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Tambah, edit data profil pendidik, perbarui foto, jabatan, mata pelajaran dan kualifikasi pendidikan RA Al-Maqom.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Profil Guru</span>
        </button>
      </div>

      {/* Save Success Alert */}
      {saveSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-900 flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Perubahan profil guru berhasil disimpan & disinkronkan ke seluruh sistem!</span>
        </div>
      )}

      {/* Search & Role Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari guru berdasarkan nama, mata pelajaran, jabatan, atau pendidikan..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {roleCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedRoleFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedRoleFilter === cat
                  ? 'bg-emerald-800 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Teachers */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
          <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-bold">Tidak ada profil guru yang cocok dengan pencarian.</p>
          <p className="text-xs text-slate-400 mt-1">Coba kata kunci lain atau tambahkan guru baru.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((teacher) => (
            <div
              key={teacher.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between group"
            >
              {/* Photo & Role Header */}
              <div>
                <div className="relative h-48 bg-gradient-to-br from-emerald-900 via-slate-900 to-slate-950 overflow-hidden flex items-center justify-center">
                  {teacher.image && (teacher.image.startsWith('data:image/') || teacher.image.includes('principal_real.jpg')) ? (
                    <img
                      src={teacher.image}
                      alt={teacher.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-4 text-center select-none">
                      <div className="w-16 h-16 rounded-full bg-emerald-700/60 border border-emerald-400/40 flex items-center justify-center text-amber-300 shadow-inner mb-2">
                        <GraduationCap className="w-8 h-8" />
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-200">Belum Ada Foto</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Subject Badge */}
                  <span className="absolute top-2.5 left-2.5 bg-slate-900/85 backdrop-blur-xs text-amber-300 font-bold px-2.5 py-1 rounded-lg text-[10px] border border-slate-700/50">
                    {teacher.subject}
                  </span>

                  {/* Actions Overlay */}
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(teacher)}
                      className="p-1.5 bg-white/90 hover:bg-white text-slate-800 rounded-lg shadow hover:scale-105 transition-transform"
                      title="Edit profil guru"
                    >
                      <Pencil className="w-3.5 h-3.5 text-emerald-700" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setItemToDelete(teacher)}
                      className="p-1.5 bg-white/90 hover:bg-rose-50 text-rose-600 rounded-lg shadow hover:scale-105 transition-transform"
                      title="Hapus profil guru"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Name & Role on Photo */}
                  <div className="absolute bottom-2.5 left-3 right-3 text-white">
                    <h4 className="font-extrabold text-sm leading-snug line-clamp-1">
                      {teacher.name}
                    </h4>
                    <p className="text-[11px] text-emerald-200 font-medium line-clamp-1">
                      {teacher.role}
                    </p>
                  </div>
                </div>

                {/* Details Body */}
                <div className="p-3.5 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Briefcase className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span className="truncate">{teacher.role}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <BookOpen className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                    <span className="truncate">{teacher.subject}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Award className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                    <span className="truncate">{teacher.education}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Card Actions */}
              <div className="p-3 pt-0 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(teacher)}
                  className="flex-1 py-1.5 px-3 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Ubah Data</span>
                </button>
                <button
                  type="button"
                  onClick={() => setItemToDelete(teacher)}
                  className="py-1.5 px-2.5 bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-lg text-xs font-bold transition-colors"
                  title="Hapus Guru"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base font-extrabold text-slate-900">
                  {isCreatingNew ? 'Tambah Profil Pendidik Baru' : 'Edit Profil Guru'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4 pt-4">
              {/* Image Preview & Upload */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">
                  Foto Profil Guru
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-24 rounded-xl border-2 border-dashed border-slate-300 overflow-hidden bg-slate-100 flex-shrink-0 flex items-center justify-center relative shadow-inner">
                    {editingItem.image ? (
                      <img
                        src={editingItem.image}
                        alt="Preview"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-8 h-8 text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <label className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold cursor-pointer transition-colors">
                      <Upload className="w-4 h-4 text-emerald-600" />
                      <span>Unggah Foto dari HP / Komputer</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                    {uploadStatus && (
                      <p className="text-[11px] text-amber-600 font-semibold animate-pulse">
                        {uploadStatus}
                      </p>
                    )}
                    <p className="text-[11px] text-slate-400">
                      Format: JPG, PNG, WEBP. Foto otomatis dioptimalkan agar ringan dan cepat dimuat.
                    </p>
                  </div>
                </div>

                {/* Direct Image URL input */}
                <div className="pt-1">
                  <label className="text-[11px] text-slate-500 font-medium block mb-1">
                    Atau gunakan tautan URL foto langsung:
                  </label>
                  <input
                    type="text"
                    value={editingItem.image}
                    onChange={(e) => setEditingItem({ ...editingItem, image: e.target.value })}
                    placeholder="https://... atau /images/..."
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nama Lengkap & Gelar Akademik <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  placeholder="Contoh: Drs. H. Agus Supriyatna, M.Pd."
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
                />
              </div>

              {/* Role / Position */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Jabatan / Tugas Tambahan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.role}
                  onChange={(e) => setEditingItem({ ...editingItem, role: e.target.value })}
                  placeholder="Contoh: Wakil Kepala Sekolah Bidang Kurikulum / Guru Kelas VII-A"
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
                />
              </div>

              {/* Subject / Assignment */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Mata Pelajaran / Bidang Tugas <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.subject}
                  onChange={(e) => setEditingItem({ ...editingItem, subject: e.target.value })}
                  placeholder="Contoh: Ilmu Pengetahuan Alam (IPA) / Bahasa Indonesia / Komputer"
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
                />
              </div>

              {/* Education Qualification */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Kualifikasi Pendidikan Terakhir <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.education}
                  onChange={(e) => setEditingItem({ ...editingItem, education: e.target.value })}
                  placeholder="Contoh: S1 Pendidikan IPA - UPI Bandung"
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Menyimpan...' : 'Simpan Profil Guru'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full border border-slate-200 shadow-2xl p-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 mb-1">
              Hapus Profil Guru?
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Apakah Anda yakin ingin menghapus data pendidik{' '}
              <strong className="text-slate-900">{itemToDelete.name}</strong>? Tindakan ini akan menghapus guru dari halaman profil sekolah dan dewan guru.
            </p>

            <div className="flex items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex-1"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isSaving}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow transition-colors flex-1 flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isSaving ? 'Menghapus...' : 'Ya, Hapus'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
