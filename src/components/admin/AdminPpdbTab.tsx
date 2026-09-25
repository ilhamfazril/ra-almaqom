import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  GraduationCap, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Trash2, 
  Download, 
  RefreshCw,
  Eye,
  AlertCircle,
  Check,
  X,
  MessageCircle,
  Mail
} from 'lucide-react';
import { 
  PPDBRegistrationRecord, 
  subscribeToPpdbRegistrations, 
  updatePpdbRegistrationStatus, 
  deletePpdbRegistration 
} from '../../services/siteContentService';

export const AdminPpdbTab: React.FC = () => {
  const [registrations, setRegistrations] = useState<PPDBRegistrationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('Semua');
  const [trackFilter, setTrackFilter] = useState<string>('Semua');
  const [selectedItem, setSelectedItem] = useState<PPDBRegistrationRecord | null>(null);
  const [itemToDelete, setItemToDelete] = useState<PPDBRegistrationRecord | null>(null);
  const [itemToAccept, setItemToAccept] = useState<PPDBRegistrationRecord | null>(null);
  const [itemToReject, setItemToReject] = useState<PPDBRegistrationRecord | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Subscribe in real-time to Firestore PPDB collection
  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToPpdbRegistrations((data) => {
      setRegistrations(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const getWhatsAppUrl = (phone: string, candidateName: string, regCode: string) => {
    let clean = (phone || '').replace(/\D/g, '');
    if (clean.startsWith('0')) {
      clean = '62' + clean.slice(1);
    } else if (!clean.startsWith('62')) {
      clean = '62' + clean;
    }
    const msg = encodeURIComponent(
      `Halo Bapak/Ibu orang tua dari ananda *${candidateName}* (Kode Registrasi: ${regCode}), kami dari Panitia PPDB RA Al-Maqom ingin mengonfirmasi terkait pendaftaran santri baru TP 2027/2028.`
    );
    return `https://wa.me/${clean}?text=${msg}`;
  };

  const handleStatusChange = async (docId: string, newStatus: 'Menunggu' | 'Diterima' | 'Ditolak') => {
    try {
      setIsUpdating(true);
      await updatePpdbRegistrationStatus(docId, newStatus);
      showToast(`Status pendaftaran berhasil diperbarui menjadi "${newStatus}" (Permanen).`);
      if (selectedItem && selectedItem.id === docId) {
        setSelectedItem({ ...selectedItem, status: newStatus });
      }
      setItemToAccept(null);
      setItemToReject(null);
    } catch (err) {
      console.error(err);
      alert('Gagal memperbarui status di Firebase.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete || !itemToDelete.id) return;
    try {
      setIsUpdating(true);
      await deletePpdbRegistration(itemToDelete.id);
      showToast('Data pendaftaran berhasil dihapus.');
      setItemToDelete(null);
      if (selectedItem?.id === itemToDelete.id) {
        setSelectedItem(null);
      }
    } catch (err) {
      console.error(err);
      alert('Gagal menghapus data dari Firebase.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleExportCSV = () => {
    if (registrations.length === 0) {
      alert('Belum ada data pendaftar untuk diekspor.');
      return;
    }

    const headers = [
      'No',
      'Waktu Daftar',
      'Kode Registrasi',
      'Nama Calon Siswa',
      'Asal Sekolah',
      'NISN',
      'Jenis Kelamin',
      'Nama Orang Tua',
      'No HP WhatsApp',
      'Email',
      'Jalur Pendaftaran',
      'Status Pendaftaran',
      'Catatan'
    ];

    // Export follows the same chronological order (oldest first, newest at the bottom)
    const sortedForExport = [...registrations].sort(
      (a, b) => (Number(a.createdAt) || 0) - (Number(b.createdAt) || 0)
    );

    const rows = sortedForExport.map((r, idx) => [
      `"${idx + 1}"`,
      `"${new Date(r.createdAt).toLocaleString('id-ID')}"`,
      `"${r.registrationCode}"`,
      `"${r.candidateName}"`,
      `"${r.originSchool}"`,
      `"${r.nisn || '-'}"`,
      `"${r.gender}"`,
      `"${r.parentName}"`,
      `"${r.parentPhone}"`,
      `"${r.parentEmail || '-'}"`,
      `"${r.selectedTrack}"`,
      `"${r.status}"`,
      `"${(r.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ppdb_2027_2028_ra_almaqom_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // Filter and ensure strict chronological ordering: oldest at top, newest at the bottom
  const filteredRegistrations = useMemo(() => {
    const list = registrations.filter((r) => {
      const matchSearch = 
        r.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.registrationCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.originSchool.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.parentPhone.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchStatus = statusFilter === 'Semua' || r.status === statusFilter;
      const matchTrack = trackFilter === 'Semua' || r.selectedTrack === trackFilter;

      return matchSearch && matchStatus && matchTrack;
    });

    // Urutan: yang paling baru maka yang paling bawah (Ascending by createdAt)
    return list.sort((a, b) => (Number(a.createdAt) || 0) - (Number(b.createdAt) || 0));
  }, [registrations, searchQuery, statusFilter, trackFilter]);

  // Status counters
  const totalCount = registrations.length;
  const waitingCount = registrations.filter((r) => r.status === 'Menunggu').length;
  const acceptedCount = registrations.filter((r) => r.status === 'Diterima').length;
  const rejectedCount = registrations.filter((r) => r.status === 'Ditolak').length;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs sm:text-sm font-medium flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{notification}</span>
          </div>
        </div>
      )}

      {/* Header Info Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">
              Pendaftaran PPDB Online (2027/2028)
            </h2>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Firebase Real-Time
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Daftar calon siswa/santri pendaftar PPDB online RA Al-Maqom. Data diurutkan secara kronologis dengan pendaftaran terbaru di posisi paling bawah.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-medium shadow-sm transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor CSV</span>
          </button>
        </div>
      </div>

      {/* Stats Summary Cards (Menunggu, Diterima, Ditolak) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-medium">Total Pendaftar</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">{totalCount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/40 shadow-sm">
          <span className="text-xs text-amber-700 font-medium">Status: Menunggu</span>
          <p className="text-2xl font-bold text-amber-600 mt-1">{waitingCount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 shadow-sm">
          <span className="text-xs text-emerald-700 font-medium">Status: Diterima</span>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{acceptedCount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-rose-200 bg-rose-50/40 shadow-sm">
          <span className="text-xs text-rose-700 font-medium">Status: Ditolak</span>
          <p className="text-2xl font-bold text-rose-600 mt-1">{rejectedCount}</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama, asal SD, no HP, kode..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700 font-medium"
          >
            <option value="Semua">Semua Status</option>
            <option value="Menunggu">Menunggu</option>
            <option value="Diterima">Diterima</option>
            <option value="Ditolak">Ditolak</option>
          </select>

          <select
            value={trackFilter}
            onChange={(e) => setTrackFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700 font-medium"
          >
            <option value="Semua">Semua Jalur</option>
            <option value="Jalur Prestasi">Jalur Prestasi</option>
            <option value="Jalur Reguler & Afirmasi">Jalur Reguler & Afirmasi</option>
            <option value="Jalur Prestasi (PPSB)">Jalur Prestasi (Lama)</option>
            <option value="Jalur Tes Seleksi Mandiri">Jalur Tes Seleksi</option>
          </select>
        </div>
      </div>

      {/* Registrations List Table with No. and Action Buttons (Terima, Tolak, Hapus) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 text-sm flex flex-col items-center justify-center gap-2">
            <RefreshCw className="w-6 h-6 animate-spin text-emerald-600" />
            <span>Memuat data pendaftar dari Firebase Firestore...</span>
          </div>
        ) : filteredRegistrations.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            <GraduationCap className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="font-semibold text-slate-700">Tidak ada pendaftaran ditemukan</p>
            <p className="text-xs text-slate-400 mt-1">
              {searchQuery || statusFilter !== 'Semua' || trackFilter !== 'Semua' 
                ? 'Coba sesuaikan filter atau kata kunci pencarian Anda.' 
                : 'Pendaftaran yang masuk melalui formulir PPDB online akan otomatis muncul di sini secara real-time.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                  <th className="py-3 px-3 text-center w-12">No.</th>
                  <th className="py-3 px-3 min-w-[130px]">Waktu Daftar</th>
                  <th className="py-3 px-3 min-w-[170px]">Calon Siswa</th>
                  <th className="py-3 px-3 text-center min-w-[90px]">L / P</th>
                  <th className="py-3 px-3 min-w-[140px]">Asal SD/MI</th>
                  <th className="py-3 px-3 min-w-[130px]">Jalur</th>
                  <th className="py-3 px-3 min-w-[190px]">Kontak & WhatsApp</th>
                  <th className="py-3 px-3 min-w-[160px]">Email</th>
                  <th className="py-3 px-3 text-center min-w-[110px]">Status</th>
                  <th className="py-3 px-3 text-center min-w-[210px]">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRegistrations.map((item, index) => {
                  const regDate = item.createdAt 
                    ? new Date(item.createdAt).toLocaleString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : '-';

                  return (
                    <tr key={item.id || index} className="hover:bg-slate-50/80 transition">
                      {/* 1. Kolom No. */}
                      <td className="py-3 px-3 text-center font-bold text-slate-500">
                        {index + 1}
                      </td>

                      {/* 2. Kolom Waktu Pendaftaran */}
                      <td className="py-3 px-3 text-slate-600 text-xs">
                        <div className="flex items-center gap-1.5 font-medium text-slate-700">
                          <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <span>{regDate}</span>
                        </div>
                      </td>

                      {/* 3. Calon Siswa */}
                      <td className="py-3 px-3">
                        <div 
                          onClick={() => setSelectedItem(item)}
                          className="font-bold text-slate-900 hover:text-emerald-700 cursor-pointer flex items-center gap-1.5"
                          title="Klik untuk melihat preview detail"
                        >
                          <span>{item.candidateName}</span>
                          <Eye className="w-3.5 h-3.5 text-slate-400 hover:text-emerald-600" />
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">{item.registrationCode}</div>
                      </td>

                      {/* 4. Jenis Kelamin (L/P) */}
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-bold ${
                          item.gender === 'Perempuan'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}>
                          {item.gender === 'Perempuan' ? 'Perempuan (P)' : 'Laki-laki (L)'}
                        </span>
                      </td>

                      {/* 5. Asal Sekolah */}
                      <td className="py-3 px-3 text-slate-700">
                        {item.originSchool}
                      </td>

                      {/* 6. Jalur */}
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-md text-[11px] bg-slate-100 text-slate-700 font-medium">
                          {item.selectedTrack}
                        </span>
                      </td>

                      {/* 7. Kontak Ortu & Tombol Chat WhatsApp */}
                      <td className="py-3 px-3">
                        <div className="text-slate-800 font-semibold">{item.parentName}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-slate-600 font-mono">{item.parentPhone}</span>
                          <a
                            href={getWhatsAppUrl(item.parentPhone, item.candidateName, item.registrationCode)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold shadow-xs transition hover:scale-105 active:scale-95 cursor-pointer"
                            title={`Chat WhatsApp langsung ke ${item.parentPhone}`}
                          >
                            <MessageCircle className="w-3 h-3" />
                            <span>Chat WA</span>
                          </a>
                        </div>
                      </td>

                      {/* 8. Email */}
                      <td className="py-3 px-3">
                        {item.parentEmail ? (
                          <a
                            href={`mailto:${item.parentEmail}`}
                            className="inline-flex items-center gap-1 text-xs text-slate-700 hover:text-emerald-700 hover:underline font-medium break-all"
                            title={`Kirim email ke ${item.parentEmail}`}
                          >
                            <Mail className="w-3 h-3 text-slate-400 flex-shrink-0" />
                            <span>{item.parentEmail}</span>
                          </a>
                        ) : (
                          <span className="text-xs text-slate-400 italic">-</span>
                        )}
                      </td>

                      {/* 9. Status Pendaftaran */}
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                          item.status === 'Diterima'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : item.status === 'Ditolak'
                            ? 'bg-rose-100 text-rose-800 border border-rose-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}>
                          {item.status === 'Diterima' && <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />}
                          {item.status === 'Ditolak' && <XCircle className="w-3.5 h-3.5 mr-1 text-rose-600" />}
                          {item.status === 'Menunggu' && <Clock className="w-3.5 h-3.5 mr-1 text-amber-600" />}
                          <span>{item.status}</span>
                        </span>
                      </td>

                      {/* 10. Tombol Aksi (1x Klik Permanen Terima/Tolak, Hapus Tetap Aktif) */}
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5 flex-wrap">
                          {item.status === 'Menunggu' ? (
                            <>
                              {/* Tombol Terima (1x klik -> permanen) */}
                              <button
                                type="button"
                                disabled={isUpdating}
                                onClick={() => setItemToAccept(item)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-xs cursor-pointer"
                                title="Terima pendaftar ini (Permanen)"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Terima</span>
                              </button>

                              {/* Tombol Tolak (1x klik -> permanen) */}
                              <button
                                type="button"
                                disabled={isUpdating}
                                onClick={() => setItemToReject(item)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white transition shadow-xs cursor-pointer"
                                title="Tolak pendaftar ini (Permanen)"
                              >
                                <X className="w-3.5 h-3.5" />
                                <span>Tolak</span>
                              </button>
                            </>
                          ) : item.status === 'Diterima' ? (
                            <span
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs"
                              title="Status pendaftaran telah Diterima secara permanen"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Diterima (Permanen)</span>
                            </span>
                          ) : (
                            <span
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300 shadow-2xs"
                              title="Status pendaftaran telah Ditolak secara permanen"
                            >
                              <XCircle className="w-3.5 h-3.5 text-rose-600" />
                              <span>Ditolak (Permanen)</span>
                            </span>
                          )}

                          {/* Tombol Hapus (Tetap Dipertahankan) */}
                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() => setItemToDelete(item)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-200 hover:border-rose-600 transition shadow-xs cursor-pointer"
                            title="Hapus data pendaftaran ini dari database"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Hapus</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Preview Modal: ONLY displays information, NO status modification here */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="bg-emerald-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <GraduationCap className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-bold text-sm sm:text-base">Informasi Detail Pendaftar PPDB</h3>
                  <p className="text-[11px] text-emerald-200">RA Al-Maqom — TP 2027/2028</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs sm:text-sm max-h-[75vh] overflow-y-auto">
              {/* Header Box with Status Info (Display Only) */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-semibold">Kode Registrasi</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    selectedItem.status === 'Diterima'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : selectedItem.status === 'Ditolak'
                      ? 'bg-rose-100 text-rose-800 border border-rose-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}>
                    {selectedItem.status}
                  </span>
                </div>
                <div className="font-mono font-black text-lg text-emerald-900">
                  {selectedItem.registrationCode}
                </div>
                <div className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Waktu Pendaftaran: {new Date(selectedItem.createdAt).toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* Information Grid */}
              <div className="grid grid-cols-2 gap-3.5 pt-1">
                <div>
                  <span className="text-xs text-slate-500 font-medium">Nama Calon Siswa</span>
                  <p className="font-bold text-slate-900 text-sm">{selectedItem.candidateName}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-medium">Jenis Kelamin</span>
                  <p className="font-semibold text-slate-800">{selectedItem.gender}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-medium">Asal SD/MI</span>
                  <p className="font-semibold text-slate-800">{selectedItem.originSchool}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-medium">NISN</span>
                  <p className="font-semibold text-slate-800">{selectedItem.nisn || '-'}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-medium">Nama Orang Tua / Wali</span>
                  <p className="font-semibold text-slate-800">{selectedItem.parentName}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-medium">WhatsApp Orang Tua</span>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="font-semibold text-slate-800 font-mono">{selectedItem.parentPhone}</p>
                    <a
                      href={getWhatsAppUrl(selectedItem.parentPhone, selectedItem.candidateName, selectedItem.registrationCode)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition hover:scale-105 active:scale-95 cursor-pointer"
                      title="Buka Chat WhatsApp"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Chat WA</span>
                    </a>
                  </div>
                </div>
                <div className="col-span-2">
                  <span className="text-xs text-slate-500 font-medium">Alamat Email</span>
                  <p className="font-semibold text-slate-800">{selectedItem.parentEmail || '-'}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-xs text-slate-500 font-medium">Jalur Pendaftaran</span>
                  <p className="font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 mt-1 inline-block">
                    {selectedItem.selectedTrack}
                  </p>
                </div>
              </div>

              {selectedItem.notes && (
                <div>
                  <span className="text-xs text-slate-500 font-medium">Catatan / Keterangan</span>
                  <p className="text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 mt-1 leading-relaxed">
                    {selectedItem.notes}
                  </p>
                </div>
              )}

              {/* Note that status is managed via action buttons on the table */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span>Status pendaftaran diubah langsung melalui tombol aksi (Terima / Tolak) pada tabel.</span>
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Accept Confirmation Modal */}
      {itemToAccept && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-3 text-emerald-600 mb-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Terima Pendaftar Ini?</h3>
            </div>
            <p className="text-xs text-slate-600 mb-5 leading-relaxed">
              Apakah Anda yakin ingin menerima calon siswa atas nama{' '}
              <strong className="text-slate-900">{itemToAccept.candidateName}</strong> ({itemToAccept.registrationCode}) pada jalur{' '}
              <strong className="text-emerald-700">{itemToAccept.selectedTrack}</strong>?
              <br />
              <span className="inline-block mt-2 font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                ⚠️ Aksi ini bersifat permanen (1× klik). Status Diterima tidak dapat diubah kembali.
              </span>
            </p>
            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setItemToAccept(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isUpdating}
                onClick={() => itemToAccept.id && handleStatusChange(itemToAccept.id, 'Diterima')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Ya, Terima</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Confirmation Modal */}
      {itemToReject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-3 text-amber-600 mb-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                <XCircle className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Tolak Pendaftar Ini?</h3>
            </div>
            <p className="text-xs text-slate-600 mb-5 leading-relaxed">
              Apakah Anda yakin ingin menolak pendaftaran calon siswa atas nama{' '}
              <strong className="text-slate-900">{itemToReject.candidateName}</strong> ({itemToReject.registrationCode})?
              <br />
              <span className="inline-block mt-2 font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                ⚠️ Aksi ini bersifat permanen (1× klik). Status Ditolak tidak dapat diubah kembali.
              </span>
            </p>
            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setItemToReject(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isUpdating}
                onClick={() => itemToReject.id && handleStatusChange(itemToReject.id, 'Ditolak')}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <X className="w-4 h-4" />
                <span>Ya, Tolak</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-5 h-5 text-rose-600" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Hapus Data Pendaftar?</h3>
            </div>
            <p className="text-xs text-slate-600 mb-5 leading-relaxed">
              Apakah Anda yakin ingin menghapus data pendaftaran atas nama{' '}
              <strong className="text-slate-900">{itemToDelete.candidateName}</strong> ({itemToDelete.registrationCode})? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isUpdating}
                onClick={handleDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Ya, Hapus Data</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
