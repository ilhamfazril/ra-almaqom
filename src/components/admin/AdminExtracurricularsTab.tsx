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
  Activity, 
  Clock, 
  Trophy,
  Shield,
  Music,
  Flame,
  Globe2,
  Users
} from 'lucide-react';
import { ExtracurricularItem } from '../../types';

interface AdminExtracurricularsTabProps {
  extracurricularsList: ExtracurricularItem[];
  onSaveExtracurriculars: (updated: ExtracurricularItem[], meta?: { action?: 'create' | 'update' | 'delete'; title?: string }) => Promise<void>;
}

export const AdminExtracurricularsTab: React.FC<AdminExtracurricularsTabProps> = ({
  extracurricularsList,
  onSaveExtracurriculars,
}) => {
  const [items, setItems] = useState<ExtracurricularItem[]>(extracurricularsList);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [editingItem, setEditingItem] = useState<ExtracurricularItem | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ExtracurricularItem | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync with Firestore real-time updates
  useEffect(() => {
    if (extracurricularsList) {
      setItems(extracurricularsList);
    }
  }, [extracurricularsList]);

  const categories = [
    'Semua',
    'Sains & Teknologi',
    'Olahraga',
    'Seni & Budaya',
    'Bahasa & Keorganisasian'
  ];

  const filtered = items.filter((item) => {
    const matchesCategory = selectedCategory === 'Semua' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.achievements.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenAdd = () => {
    setEditingItem({
      id: `ekskul-${Date.now()}`,
      name: '',
      category: 'Olahraga',
      schedule: 'Sabtu, 08.00 - 11.00 WIB',
      achievements: 'Aktif Berprestasi & Pembinaan Karakter',
      description: '',
      icon: 'Activity',
    });
    setIsCreatingNew(true);
  };

  const handleOpenEdit = (item: ExtracurricularItem) => {
    setEditingItem(JSON.parse(JSON.stringify(item)));
    setIsCreatingNew(false);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    if (!editingItem.name.trim()) {
      alert('Nama ekstrakurikuler tidak boleh kosong.');
      return;
    }

    let updatedList: ExtracurricularItem[];
    if (isCreatingNew) {
      updatedList = [editingItem, ...items];
    } else {
      updatedList = items.map((ekskul) => (ekskul.id === editingItem.id ? editingItem : ekskul));
    }

    setItems(updatedList);
    const actionType = isCreatingNew ? 'create' : 'update';
    const itemTitle = editingItem.name;
    setEditingItem(null);

    try {
      setIsSaving(true);
      await onSaveExtracurriculars(updatedList, { action: actionType, title: itemTitle });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan ekstrakurikuler ke Firestore.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    const deletedTitle = itemToDelete.name;
    const updatedList = items.filter((item) => item.id !== itemToDelete.id);
    setItems(updatedList);
    setItemToDelete(null);

    try {
      setIsSaving(true);
      await onSaveExtracurriculars(updatedList, { action: 'delete', title: deletedTitle });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      console.error(err);
      alert('Gagal menghapus ekstrakurikuler dari Firestore.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-700" />
            <span>Kelola Ekstrakurikuler ({items.length})</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola cabang ekstrakurikuler, jadwal latihan mingguan, dan pencapaian prestasi siswa.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Ekstrakurikuler</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Data Ekstrakurikuler berhasil diperbarui di Cloud Firestore secara Real-Time!</span>
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
            placeholder="Cari ekstrakurikuler berdasarkan nama, jadwal, atau pencapaian..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Items List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                  {item.category}
                </span>
                <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                  {item.icon}
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                {item.name}
              </h4>
              <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                {item.description}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-1.5 text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span className="truncate">{item.schedule}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-amber-800 font-medium">
                  <Trophy className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                  <span className="truncate">{item.achievements}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => handleOpenEdit(item)}
                className="p-2 text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 rounded-lg inline-flex items-center gap-1 transition-colors"
                title="Edit Ekskul"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Ubah</span>
              </button>
              <button
                type="button"
                onClick={() => setItemToDelete(item)}
                className="p-2 text-xs font-bold text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 rounded-lg inline-flex items-center gap-1 transition-colors"
                title="Hapus Ekskul"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus</span>
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-400">
            <Activity className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-semibold text-slate-600">
              Tidak ada ekstrakurikuler yang cocok.
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Gunakan kata kunci pencarian lain atau klik tombol "Tambah Ekstrakurikuler".
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
                {isCreatingNew ? 'Tambah Ekstrakurikuler Baru' : 'Ubah Data Ekstrakurikuler'}
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
                  Nama Ekstrakurikuler *
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  placeholder="Contoh: Drumband Cilik & Seni Tari Islami RA Al-Maqom"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none font-semibold text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Kategori Bidang
                  </label>
                  <select
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                  >
                    <option value="Sains & Teknologi">Sains & Teknologi</option>
                    <option value="Olahraga">Olahraga</option>
                    <option value="Seni & Budaya">Seni & Budaya</option>
                    <option value="Bahasa & Keorganisasian">Bahasa & Keorganisasian</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Ikon Visual
                  </label>
                  <select
                    value={editingItem.icon}
                    onChange={(e) => setEditingItem({ ...editingItem, icon: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                  >
                    <option value="Shield">Shield (Pramuka / Disiplin)</option>
                    <option value="Activity">Activity (Olahraga / Futsal)</option>
                    <option value="Music">Music (Seni & Tari)</option>
                    <option value="Flame">Flame (Semangat Juara)</option>
                    <option value="Globe2">Globe (Bahasa & Rohis)</option>
                    <option value="Users">Users (Organisasi / OSIS)</option>
                    <option value="Trophy">Trophy (Paskibra / Lomba)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Jadwal Latihan Rutin
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.schedule}
                  onChange={(e) => setEditingItem({ ...editingItem, schedule: e.target.value })}
                  placeholder="Contoh: Jumat & Sabtu, 14.30 - 17.00 WIB"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Pencapaian / Prestasi Utama
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.achievements}
                  onChange={(e) => setEditingItem({ ...editingItem, achievements: e.target.value })}
                  placeholder="Contoh: Juara 1 Tingkat Kota & Juara Harapan Provinsi"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Deskripsi Ekstrakurikuler *
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  placeholder="Jelaskan tujuan, pembinaan minat bakat, dan kegiatan ekskul..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
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
                  {isSaving ? 'Menyimpan...' : 'Simpan Ekstrakurikuler'}
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
                Hapus Ekstrakurikuler?
              </h4>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Apakah Anda yakin ingin menghapus ekstrakurikuler <strong>"{itemToDelete.name}"</strong>?
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
