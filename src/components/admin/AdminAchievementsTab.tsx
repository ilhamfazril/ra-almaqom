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
  Trophy, 
  Upload, 
  Award,
  Medal,
  Calendar,
  User
} from 'lucide-react';
import { AchievementItem } from '../../types';
import { compressImageForStorage } from '../../services/siteContentService';

interface AdminAchievementsTabProps {
  achievementsList: AchievementItem[];
  onSaveAchievements: (updated: AchievementItem[], meta?: { action?: 'create' | 'update' | 'delete'; title?: string }) => Promise<void>;
}

export const AdminAchievementsTab: React.FC<AdminAchievementsTabProps> = ({
  achievementsList,
  onSaveAchievements,
}) => {
  const [items, setItems] = useState<AchievementItem[]>(achievementsList);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('Semua');
  const [editingItem, setEditingItem] = useState<AchievementItem | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<AchievementItem | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  // Sync with Firestore real-time updates
  useEffect(() => {
    if (achievementsList) {
      setItems(achievementsList);
    }
  }, [achievementsList]);

  const levels = ['Semua', 'Kota', 'Provinsi', 'Nasional', 'Internasional'];

  const filtered = items.filter((ach) => {
    const matchesLevel = selectedLevel === 'Semua' || ach.level === selectedLevel;
    const matchesSearch =
      ach.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ach.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ach.event.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  const handleOpenAdd = () => {
    setEditingItem({
      id: `ach-${Date.now()}`,
      title: '',
      studentName: '',
      event: '',
      level: 'Kota',
      year: new Date().getFullYear().toString(),
      category: 'Akademik',
      image: '/images/slide2_upacara.jpg',
    });
    setIsCreatingNew(true);
  };

  const handleOpenEdit = (item: AchievementItem) => {
    setEditingItem(JSON.parse(JSON.stringify(item)));
    setIsCreatingNew(false);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    if (!editingItem.title.trim() || !editingItem.studentName.trim()) {
      alert('Judul prestasi dan nama siswa tidak boleh kosong.');
      return;
    }

    let updatedList: AchievementItem[];
    if (isCreatingNew) {
      updatedList = [editingItem, ...items];
    } else {
      updatedList = items.map((a) => (a.id === editingItem.id ? editingItem : a));
    }

    setItems(updatedList);
    const actionType = isCreatingNew ? 'create' : 'update';
    const itemTitle = `${editingItem.title} (${editingItem.studentName})`;
    setEditingItem(null);

    try {
      setIsSaving(true);
      await onSaveAchievements(updatedList, { action: actionType, title: itemTitle });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan prestasi siswa ke Firestore.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    const deletedTitle = itemToDelete.title;
    const updatedList = items.filter((a) => a.id !== itemToDelete.id);
    setItems(updatedList);
    setItemToDelete(null);

    try {
      setIsSaving(true);
      await onSaveAchievements(updatedList, { action: 'delete', title: deletedTitle });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      console.error(err);
      alert('Gagal menghapus prestasi siswa dari Firestore.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingItem) return;

    try {
      setUploadStatus('Mengompresi dan mengoptimalkan dokumentasi prestasi...');
      const optimized = await compressImageForStorage(file, 800, 500, 0.70);
      setEditingItem({ ...editingItem, image: optimized });
      setUploadStatus('✓ Foto berhasil dikompresi hemat (<60 KB).');
      setTimeout(() => setUploadStatus(null), 3500);
    } catch (err) {
      console.error(err);
      alert('Gagal memproses gambar. Gunakan format JPG/PNG.');
      setUploadStatus(null);
    }
  };

  const getLevelBadgeColor = (lvl: string) => {
    switch (lvl) {
      case 'Nasional':
      case 'Internasional':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Provinsi':
        return 'bg-purple-100 text-purple-900 border-purple-300';
      default:
        return 'bg-blue-100 text-blue-900 border-blue-300';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-emerald-700" />
            <span>Kelola Prestasi & Pencapaian Siswa ({items.length})</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Abadikan rekam jejak juara santri cilik RA Al-Maqom dalam perlombaan seni Islami, tahfidz, dan kreativitas.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Prestasi Siswa</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Data Prestasi Siswa berhasil diperbarui di Cloud Firestore secara Real-Time!</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari prestasi, nama peraih medali, atau nama kejuaraan..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {levels.map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => setSelectedLevel(lvl)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedLevel === lvl
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Items List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="relative h-36 w-full overflow-hidden bg-slate-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 left-2 flex gap-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-sm ${getLevelBadgeColor(item.level)}`}>
                    {item.level}
                  </span>
                  <span className="bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {item.year}
                  </span>
                </div>
              </div>

              <div className="p-3.5">
                <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">
                  {item.title}
                </h4>

                <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-semibold text-[11px]">
                    <User className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                    <span className="truncate">{item.studentName}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                    <Medal className="w-3 h-3 text-amber-500 flex-shrink-0" />
                    <span className="truncate">{item.event}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 pt-0 border-t border-slate-100 flex items-center justify-end gap-1.5 mt-2">
              <button
                type="button"
                onClick={() => handleOpenEdit(item)}
                className="p-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 rounded-lg inline-flex items-center gap-1 transition-colors"
                title="Edit Prestasi"
              >
                <Pencil className="w-3 h-3" />
                <span>Ubah</span>
              </button>
              <button
                type="button"
                onClick={() => setItemToDelete(item)}
                className="p-1.5 text-xs font-bold text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 rounded-lg inline-flex items-center gap-1 transition-colors"
                title="Hapus Prestasi"
              >
                <Trash2 className="w-3 h-3" />
                <span>Hapus</span>
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-400">
            <Trophy className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-semibold text-slate-600">
              Tidak ada catatan prestasi yang cocok.
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Gunakan kata kunci pencarian lain atau klik tombol "Tambah Prestasi Siswa".
            </p>
          </div>
        )}
      </div>

      {/* Edit / Create Modal Dialog */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h4 className="text-sm font-bold text-slate-900">
                {isCreatingNew ? 'Tambah Catatan Prestasi Siswa' : 'Ubah Data Prestasi Siswa'}
              </h4>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="p-6 overflow-y-auto space-y-4 flex-grow text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Gelar / Penghargaan Juara *
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  placeholder="Contoh: Juara 1 Kejuaraan Futsal Pelajar Kota Cimahi"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none font-semibold text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nama Siswa / Tim Peraih Juara *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.studentName}
                    onChange={(e) => setEditingItem({ ...editingItem, studentName: e.target.value })}
                    placeholder="Contoh: Muhammad Rizky & Tim Futsal"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nama Ajang / Event Perlombaan *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.event}
                    onChange={(e) => setEditingItem({ ...editingItem, event: e.target.value })}
                    placeholder="Piala Walikota Cimahi Cup"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Tingkat Kejuaraan
                  </label>
                  <select
                    value={editingItem.level}
                    onChange={(e) => setEditingItem({ ...editingItem, level: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                  >
                    <option value="Kota">Kota</option>
                    <option value="Provinsi">Provinsi</option>
                    <option value="Nasional">Nasional</option>
                    <option value="Internasional">Internasional</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Tahun Perolehan
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.year}
                    onChange={(e) => setEditingItem({ ...editingItem, year: e.target.value })}
                    placeholder="2026"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Kategori Bidang
                  </label>
                  <select
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                  >
                    <option value="Akademik">Akademik</option>
                    <option value="Olahraga">Olahraga</option>
                    <option value="Keagamaan">Keagamaan</option>
                    <option value="Seni & Budaya">Seni & Budaya</option>
                    <option value="Kesiswaan">Kesiswaan</option>
                    <option value="Teknologi">Teknologi</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Foto Dokumentasi Penyerahan Medali / Tropi
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingItem.image}
                    onChange={(e) => setEditingItem({ ...editingItem, image: e.target.value })}
                    placeholder="URL gambar atau /images/..."
                    className="flex-grow px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <label className="cursor-pointer px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg text-slate-700 font-bold inline-flex items-center gap-1 whitespace-nowrap">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Foto</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                {uploadStatus && (
                  <p className="text-[11px] text-emerald-700 mt-1">{uploadStatus}</p>
                )}
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-100 font-bold transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all"
                >
                  {isSaving ? 'Menyimpan...' : 'Simpan Prestasi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h4 className="text-base font-bold text-slate-900">
                Hapus Catatan Prestasi?
              </h4>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Apakah Anda yakin ingin menghapus data prestasi <strong>"{itemToDelete.title}"</strong> ({itemToDelete.studentName})?
              </p>
            </div>
            <div className="flex gap-3 justify-center pt-2">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isSaving}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow transition-all"
              >
                {isSaving ? 'Menghapus...' : 'Ya, Hapus Sekarang'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
