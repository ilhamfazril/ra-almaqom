import { jsPDF } from 'jspdf';
import { SCHOOL_INFO, PSB_INFO } from '../data/schoolData';

export function downloadPpdbGuidePdf(): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Header Banner
  doc.setFillColor(6, 78, 59); // Emerald 900
  doc.rect(0, 0, pageWidth, 38, 'F');

  // School Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('YAYASAN PENDIDIKAN ISLAM AL-MAQOM', pageWidth / 2, 11, { align: 'center' });

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('RAUDHATUL ATHFAL (RA) AL-MAQOM', pageWidth / 2, 19, { align: 'center' });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`NPSN: ${SCHOOL_INFO.npsn} | Akreditasi: ${SCHOOL_INFO.akreditasi} | Kurikulum Merdeka PAUD & Kemenag`, pageWidth / 2, 26, { align: 'center' });
  doc.text(SCHOOL_INFO.address, pageWidth / 2, 32, { align: 'center' });

  // Document Title
  doc.setFillColor(245, 158, 11); // Amber 500
  doc.rect(0, 38, pageWidth, 1.5, 'F');

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`PANDUAN & PEDOMAN RESMI PPDB ${PSB_INFO.academicYear}`, pageWidth / 2, 49, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(71, 85, 105);
  doc.text(`Penerimaan Peserta Didik Baru Tahun Ajaran ${PSB_INFO.academicYear}`, pageWidth / 2, 55, { align: 'center' });

  let currentY = 65;

  // Section 1: Jalur Pendaftaran
  doc.setFillColor(241, 245, 249);
  doc.rect(14, currentY - 5, pageWidth - 28, 8, 'F');
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(6, 78, 59);
  doc.text(`A. JALUR & JADWAL GELOMBANG PPDB ${PSB_INFO.academicYear}`, 16, currentY);

  currentY += 8;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);

  doc.setFont('helvetica', 'bold');
  doc.text('1. Gelombang I (Pendaftaran Awal & Diskon Infaq Seragam)', 18, currentY);
  doc.setFont('helvetica', 'normal');
  doc.text('   - Periode Pendaftaran : 1 Januari 2027 s/d 30 April 2027', 18, currentY + 5);
  doc.text('   - Pengumuman Seleksi   : Mei 2027', 18, currentY + 10);
  doc.text('   - Ketentuan           : Calon santri KB (3-4 th), RA-A (4-5 th), RA-B (5-6 th).', 18, currentY + 15);

  currentY += 23;
  doc.setFont('helvetica', 'bold');
  doc.text('2. Gelombang II (Jalur Reguler & Calon Santri Pindahan)', 18, currentY);
  doc.setFont('helvetica', 'normal');
  doc.text('   - Periode Pendaftaran : 1 Mei 2027 s/d 15 Juli 2027', 18, currentY + 5);
  doc.text('   - Pengumuman Seleksi   : Juli 2027', 18, currentY + 10);
  doc.text('   - Ketentuan           : Selama kuota rombongan belajar santri masih tersedia.', 18, currentY + 15);

  currentY += 25;

  // Section 2: Syarat Dokumen
  doc.setFillColor(241, 245, 249);
  doc.rect(14, currentY - 5, pageWidth - 28, 8, 'F');
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(6, 78, 59);
  doc.text('B. DOKUMEN PERSYARATAN WAJIB', 16, currentY);

  currentY += 8;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);

  const requirements = [
    'Usia calon santri: Kelompok Bermain (3-4 tahun), Kelompok A (4-5 tahun), Kelompok B (5-6 tahun).',
    'Fotokopi Akta Kelahiran calon santri (2 lembar).',
    'Fotokopi Kartu Keluarga (KK) calon santri (2 lembar).',
    'Fotokopi KTP kedua orang tua/wali santri (1 lembar).',
    'Pas foto berwarna terbaru ukuran 3x4 (3 lembar).',
    'Fotokopi buku KIA/catatan imunisasi anak (jika ada).',
    'Mengisi formulir pra-pendaftaran resmi yang disediakan panitia.'
  ];

  requirements.forEach((req, idx) => {
    doc.text(`${idx + 1}.  ${req}`, 18, currentY);
    currentY += 6;
  });

  currentY += 4;

  // Section 3: Alur Pendaftaran
  doc.setFillColor(241, 245, 249);
  doc.rect(14, currentY - 5, pageWidth - 28, 8, 'F');
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(6, 78, 59);
  doc.text('C. ALUR 6 LANGKAH PENDAFTARAN SANTRI BARU', 16, currentY);

  currentY += 8;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);

  const steps = [
    'Langkah 1: Mengisi formulir pendaftaran secara online di situs resmi atau hadir langsung.',
    'Langkah 2: Penyerahan berkas fotokopi akta & KK di loket sekretariat RA Al-Maqom.',
    'Langkah 3: Observasi interaksi ramah anak & silaturahmi ramah tamah orang tua.',
    'Langkah 4: Penetapan hasil penerimaan dan penyerahan surat keputusan kelulusan.',
    'Langkah 5: Penyelesaian daftar ulang dan pengukuran seragam santri cilik.',
    'Langkah 6: Mengikuti kegiatan Masa Pengenalan Lingkungan Sekolah (MPLS) Ceria.'
  ];

  steps.forEach((st) => {
    doc.text(st, 18, currentY);
    currentY += 6;
  });

  currentY += 4;

  // Section 4: Kontak & Sekretariat
  doc.setFillColor(236, 253, 245);
  doc.rect(14, currentY - 3, pageWidth - 28, 25, 'F');
  doc.rect(14, currentY - 3, pageWidth - 28, 25, 'S');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(6, 78, 59);
  doc.text('SEKRETARIAT PANITIA PPDB RA AL-MAQOM', 18, currentY + 3);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(`Alamat       : ${SCHOOL_INFO.name}, ${SCHOOL_INFO.address}`, 18, currentY + 8);
  doc.text(`Waktu Layanan: ${SCHOOL_INFO.operationalHours}`, 18, currentY + 13);
  doc.text(`Telepon / WA : ${SCHOOL_INFO.phone} / Panitia PPDB Online`, 18, currentY + 18);

  // Footer Note
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(`* Dokumen ini diterbitkan resmi oleh Panitia PPDB ${SCHOOL_INFO.name} Tahun Ajaran ${PSB_INFO.academicYear}.`, pageWidth / 2, 288, { align: 'center' });

  // Trigger real download
  doc.save('Pedoman_PPDB_RA_Al-Maqom.pdf');
}
