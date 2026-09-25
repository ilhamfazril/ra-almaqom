import {
  NewsItem,
  ProgramUnggulan,
  FacilityItem,
  ExtracurricularItem,
  AchievementItem,
  TeacherStaff,
  TestimonialItem,
  FaqItem
} from '../types';
import { PERSISTED_USER_CONTENT } from './persistedSchoolContent';

export const SCHOOL_INFO = {
  name: 'RA Al-Maqom',
  subName: 'Yayasan Al-Maqom — Raudhatul Athfal',
  npsn: '69739423',
  akreditasi: 'Terakreditasi BAP-S/M',
  iso: 'Kurikulum Merdeka PAUD / RA',
  motto: 'CERIA, ISLAMI, CERDAS, BERAKHLAKUL KARIMAH',
  tagline: 'Membentuk Generasi Qur’ani Usia Dini yang Mandiri, Kreatif, dan Berakhlak Mulia',
  address: 'Jl. Pesantren VI No. 225, RT 06/RW 15, Cibabat, Kec. Cimahi Utara, Kota Cimahi, Jawa Barat 40513',
  district: 'Cibabat, Cimahi Utara',
  city: 'Kota Cimahi',
  province: 'Jawa Barat',
  mapsUrl: 'https://maps.google.com/?q=RA+Al-Maqom+Jl.+Pesantren+VI+No.225+Cibabat+Cimahi+Utara',
  mapsEmbedUrl: 'https://maps.google.com/maps?q=Jl.+Pesantren+VI+No.225,+Cibabat,+Kec.+Cimahi+Utara,+Kota+Cimahi,+Jawa+Barat+40513&t=&z=16&ie=UTF8&iwloc=&output=embed',
  phone: '(022) 665-8910',
  fax: '(022) 665-8910',
  email: 'ra.almaqom@gmail.com',
  website: 'https://ra-almaqom.sch.id',
  operationalHours: 'Senin - Jumat: 07.30 - 11.30 WIB',
  socialMedia: {
    instagram: 'https://instagram.com/ra.almaqom',
    youtube: 'https://youtube.com/@ra.almaqom',
    facebook: 'https://facebook.com/ra.almaqom',
  },
  stats: {
    students: '120+',
    teachers: '12',
    extracurriculars: '8',
    achievementsPerYear: '15+',
    accreditationScore: 'Terakreditasi',
    alumniSuccess: '100%'
  },
  vision: 'Terwujudnya generasi usia dini yang beriman dan bertakwa kepada Allah SWT, berakhlak mulia, cerdas, kreatif, mandiri, dan cinta Al-Qur’an di bawah naungan Yayasan Al-Maqom.',
  missions: [
    'Menanamkan nilai-nilai keimanan dan ketakwaan melalui pembiasaan doa harian, sholat dhuha cilik, dan tahfidz juz 30.',
    'Menyelenggarakan proses pembelajaran aktif, kreatif, dan menyenangkan dengan pendekatan "Bermain Sambil Belajar" berlandaskan Kurikulum Merdeka PAUD/RA.',
    'Mengembangkan kemandirian, motorik halus dan kasar, serta kemampuan bersosialisasi anak dalam lingkungan yang ramah anak dan penuh kasih sayang.',
    'Menggali dan menstimulasi potensi minat, bakat seni, kecerdasan majemuk, serta rasa ingin tahu anak sejak usia dini.',
    'Membangun kemitraan yang harmonis dan bersinergi antara sekolah, orang tua, dan masyarakat dalam pengasuhan serta pendidikan anak usia dini.'
  ]
};

export const PRINCIPAL_INFO = {
  name: PERSISTED_USER_CONTENT.principal?.name || 'Hj. Siti Maesaroh, S.Pd.I.',
  role: PERSISTED_USER_CONTENT.principal?.role || 'Kepala RA Al-Maqom',
  photo: PERSISTED_USER_CONTENT.principal?.photo || '/images/principal_real.jpg',
  quote: PERSISTED_USER_CONTENT.principal?.quote || '"Di RA Al-Maqom, kami mendidik buah hati tercinta dengan ketulusan hati dan kasih sayang, menumbuhkan fitrah kebaikan, kecintaan pada Al-Qur’an, serta keceriaan masa kanak-kanak yang bermakna."',
  welcomeMessage: [
    'Assalamu’alaikum Warahmatullahi Wabarakatuh, Salam Sejahtera untuk seluruh Ayah, Bunda, dan Sahabat RA Al-Maqom.',
    'Selamat datang di situs resmi Raudhatul Athfal (RA) Al-Maqom. Sebagai lembaga pendidikan anak usia dini berciri khas Islam di bawah naungan Yayasan Al-Maqom dan Kementerian Agama, kami berkomitmen mendampingi masa emas (golden age) putra-putri tercinta dengan penuh ketulusan, kesabaran, dan kasih sayang.',
    'Melalui perpaduan Kurikulum Merdeka PAUD dan nilai-nilai Islami, anak-anak diajak bermain sambil belajar, mengenal huruf hijaiyah, menghafal surat-surat pendek, melatih adab sopan santun, serta mengasah motorik dan kreativitas melalui beragam aktivitas sentra yang menyenangkan.',
    'Mari bersama-sama kita pupuk kebersamaan dan sinergi antara madrasah, keluarga, dan masyarakat demi mengantarkan buah hati kita tumbuh menjadi anak yang ceria, cerdas, mandiri, dan berakhlakul karimah.'
  ]
};

const DEFAULT_PROGRAMS_RAW: ProgramUnggulan[] = [
  {
    id: 'tahfidz',
    title: 'Tahfidz Al-Qur’an Cilik & Doa Keseharian',
    badge: 'Cinta Qur’ani',
    shortDesc: 'Pengenalan dan hafalan surat pendek Juz 30, doa harian, serta hadits pilihan dengan metode talaqqi yang riang gembira.',
    fullDesc: 'Program pembiasaan cinta Al-Qur’an sejak dini di RA Al-Maqom menggunakan metode talaqqi dan irama murottal yang mudah diikuti anak. Santri dibimbing menghafal surat-surat pendek juz 30 (An-Naas hingga Ad-Dhuha), doa sebelum dan sesudah kegiatan, serta hadits-hadits pendek akhlak karimah.',
    icon: 'BookOpen',
    image: '/images/slide2_upacara.jpg',
    highlights: ['Metode Talaqqi & Murottal Ceria', 'Hafalan Surat Pendek Juz 30', 'Doa Keseharian & Hadits Adab', 'Wisuda Tahfidz Cilik Tahunan']
  },
  {
    id: 'karakter',
    title: 'Pembiasaan Karakter & Sholat Dhuha Cilik',
    badge: 'Karakter Mulia',
    shortDesc: 'Latihan wudhu mandiri, praktik sholat dhuha berjamaah, serta penanaman adab 5S (Senyum, Salam, Sapa, Sopan, Santun).',
    fullDesc: 'Pendidikan karakter Islami ditanamkan secara konsisten melalui praktik sholat dhuha bersama di musala sekolah, bimbingan adab makan dan minum sesuai sunnah, infak Jumat berkah untuk melatih empati, serta pembiasaan saling menyayangi sesama teman.',
    icon: 'Heart',
    image: '/images/slide2_upacara.jpg',
    highlights: ['Praktik Wudhu Mandiri & Sholat Dhuha', 'Pembiasaan Adab 5S Santun', 'Infak & Sedekah Jumat Berkah', 'Peringatan Hari Besar Islam (PHBI)']
  },
  {
    id: 'motorik',
    title: 'Sentra Kreativitas, Seni & Stimulasi Motorik',
    badge: 'Kreatif & Terampil',
    shortDesc: 'Stimulasi motorik halus dan kasar melalui kegiatan melukis, kolase, playdough, origami, serta permainan edukatif sentra.',
    fullDesc: 'Setiap ruang kelas dan sentra di RA Al-Maqom dirancang khusus untuk merangsang koordinasi mata dan tangan, kelenturan jemari tangan untuk persiapan menulis, serta ketangkasan fisik anak melalui aneka media sensori dan permainan edukatif berkualitas.',
    icon: 'Sparkles',
    image: '/images/slide1_gedung.jpg',
    highlights: ['Sentra Bahan Alam & Main Peran', 'Kreasi Kolase, Finger Painting & Origami', 'Senam Irama Ceria Anak Usia Dini', 'Pameran Karya Seni Santri Cilik']
  },
  {
    id: 'literasi',
    title: 'Literasi Dini, Fonik & Iqro Berjenjang',
    badge: 'Literasi & Numerasi',
    shortDesc: 'Mengenalkan huruf alfabet, angka, dan hijaiyah secara interaktif melalui dongeng bergambar dan metode bermain yang seru.',
    fullDesc: 'Mempersiapkan kematangan anak menuju jenjang sekolah dasar (SD/MI) tanpa paksaan belajar yang membebani. Menggunakan buku cerita bergambar, flashcard huruf, lagu fonik, serta bimbingan membaca Iqro secara personal satu per satu.',
    icon: 'Monitor',
    image: '/images/slide3_lab_komputer.jpg',
    highlights: ['Bimbingan Iqro Personal 1-on-1', 'Pojok Baca Dongeng Bergambar', 'Pengenalan Angka & Logika Dasar', 'Kesiapan Transisi PAUD ke SD yang Menyenangkan']
  },
  {
    id: 'outing',
    title: 'Outing Class Edukatif & Manasik Haji Cilik',
    badge: 'Pengalaman Nyata',
    shortDesc: 'Eksplorasi luar kelas melalui kegiatan manasik haji anak, berkebun, pengenalan profesi, dan kunjungan ramah lingkungan.',
    fullDesc: 'Memberikan pengalaman belajar nyata di luar dinding kelas. Anak-anak diajak merasakan serunya mengenakan pakaian ihram dan tawaf dalam peragaan manasik haji cilik, belajar bercocok tanam, serta berinteraksi dengan profesi pemadam kebakaran, dokter, dan petani.',
    icon: 'Compass',
    image: '/images/slide4_lapangan.jpg',
    highlights: ['Peragaan Manasik Haji Anak Setiap Tahun', 'Kunjungan Edukasi Profesi & Wisata Edukatif', 'Edukasi Lingkungan & Menanam Tanaman', 'Melatih Kemandirian di Luar Rumah']
  },
  {
    id: 'seni',
    title: 'Pengembangan Minat Seni, Drumband & Gerak Lagu',
    badge: 'Bakat & Percaya Diri',
    shortDesc: 'Wadah mengasah rasa percaya diri melalui drumband cilik, seni tari Islami, serta panggung pentas seni ceria.',
    fullDesc: 'Santri RA Al-Maqom diajak melatih keberanian tampil di depan umum, kepekaan ritme musik, serta kerja sama tim melalui penampilan drumband cilik dan tari kreasi anak yang senantiasa memeriahkan pentas seni akhir tahun ajaran.',
    icon: 'Trophy',
    image: '/images/slide4_lapangan.jpg',
    highlights: ['Grup Drumband Cilik Al-Maqom', 'Tari Kreasi Tradisional & Islami', 'Pentas Seni Akhirussanah Ceria', 'Melatih Keberanian & Kepercayaan Diri']
  }
];

export const PROGRAMS_UNGGULAN: ProgramUnggulan[] = (Array.isArray(PERSISTED_USER_CONTENT.programs) && PERSISTED_USER_CONTENT.programs.length > 0)
  ? (PERSISTED_USER_CONTENT.programs as ProgramUnggulan[])
  : DEFAULT_PROGRAMS_RAW;

const DEFAULT_NEWS_RAW: NewsItem[] = [
  {
    id: 'news-1',
    title: 'Keceriaan Praktik Manasik Haji Cilik Santri RA Al-Maqom Penuh Khidmat',
    slug: 'manasik-haji-cilik-santri-ra-almaqom',
    category: 'Berita',
    date: '10 September 2025',
    author: 'Tim Humas RA Al-Maqom',
    readTime: '3 menit',
    featured: true,
    image: '/images/slide2_upacara.jpg',
    excerpt: 'Santriwan dan santriwati RA Al-Maqom mengenakan pakaian ihram putih mengikuti peragaan manasik haji cilik dengan penuh antusiasme dan keceriaan.',
    content: [
      'RA Al-Maqom sukses menggelar kegiatan peragaan Manasik Haji Cilik tahunan. Mengenakan pakaian serba putih layaknya jamaah haji di tanah suci, anak-anak diajak mempraktikkan rukun Islam kelima dengan panduan para bunda guru.',
      'Didampingi orang tua yang turut menyaksikan dari tepi area, santri cilik dengan riang melafalkan kalimat Talbiyah "Labbaikallahumma Labbaik", melaksanakan tawaf mengelilingi replika Ka’bah, sa’i antara bukit Shafa dan Marwah, serta melontar jumrah dengan batu kerikil mainan.',
      'Kepala RA Al-Maqom menyampaikan bahwa kegiatan ini bertujuan menanamkan kecintaan pada Baitullah dan rukun Islam sejak usia dini dalam suasana yang edukatif, ramah anak, dan membekas di hati.'
    ]
  },
  {
    id: 'news-2',
    title: 'Peringatan Hari Guru & Apresiasi Bunda Guru Berdedikasi di RA Al-Maqom',
    slug: 'peringatan-hari-guru-ra-almaqom',
    category: 'Agenda',
    date: '25 November 2025',
    author: 'Komite Orang Tua RA Al-Maqom',
    readTime: '3 menit',
    featured: true,
    image: '/images/slide1_gedung.jpg',
    excerpt: 'Ungkapan kasih sayang dan terima kasih dari para santri cilik dan paguyuban orang tua kepada bunda-bunda guru RA Al-Maqom yang senantiasa sabar mendidik.',
    content: [
      'Peringatan Hari Guru di RA Al-Maqom berlangsung hangat dan penuh haru. Anak-anak memberikan bunga dan kartu ucapan buatan tangan sendiri kepada bunda guru sebagai bentuk rasa terima kasih.',
      'Para orang tua murid yang tergabung dalam Komite Paguyuban RA Al-Maqom turut mengapresiasi kesabaran luar biasa dewan guru dalam membimbing anak-anak usia dini hingga pandai berdoa, mandiri, dan berakhlak santun.',
      'Acara ditutup dengan doa bersama untuk keberkahan para pendidik dan kemajuan madrasah tercinta.'
    ]
  },
  {
    id: 'news-3',
    title: 'Informasi Penerimaan Peserta Didik Baru (PPDB) RA Al-Maqom Tahun Pelajaran 2027/2028',
    slug: 'ppdb-ra-almaqom-2027-2028',
    category: 'Pengumuman',
    date: '15 Januari 2027',
    author: 'Panitia PPDB RA Al-Maqom',
    readTime: '4 menit',
    featured: true,
    image: '/images/slide4_lapangan.jpg',
    excerpt: 'Pendaftaran peserta didik baru RA Al-Maqom telah resmi dibuka untuk Kelompok Bermain (KB), RA Kelompok A (4-5 tahun), dan RA Kelompok B (5-6 tahun).',
    content: [
      'Panitia Penerimaan Peserta Didik Baru (PPDB) RA Al-Maqom mengumumkan pembukaan pendaftaran murid baru untuk Tahun Pelajaran 2027/2028 bagi anak usia 3 hingga 6 tahun.',
      'RA Al-Maqom menawarkan lingkungan belajar yang aman, nyaman, ber-AC, arena bermain outdoor ramah anak, bimbingan tahfidz cilik, serta tenaga pendidik yang ramah dan tersertifikasi.',
      'Pendaftaran dapat dilakukan secara langsung di sekretariat RA Al-Maqom atau secara praktis melalui formulir online di website resmi ini. Kuota kelas terbatas demi menjaga kualitas rasio pendampingan anak.'
    ]
  },
  {
    id: 'news-4',
    title: 'Santri RA Al-Maqom Raih Juara Lomba Mewarnai & Tahfidz Cilik Tingkat Kecamatan',
    slug: 'juara-lomba-mewarnai-tahfidz-cilik',
    category: 'Prestasi',
    date: '02 September 2025',
    author: 'Bunda Pembina Seni & Qur’an',
    readTime: '3 menit',
    featured: false,
    image: '/images/slide2_upacara.jpg',
    excerpt: 'Prestasi membanggakan ditorehkan santri RA Al-Maqom dalam ajang Gebyar Kreativitas Anak Usia Dini dengan menyabet piala kejuaraan mewarnai dan tahfidz.',
    content: [
      'Santri RA Al-Maqom berhasil meraih juara dalam perlombaan Gebyar Kreativitas PAUD/RA. Ananda berhasil menunjukkan perpaduan warna yang cerah dan rapi serta hafalan surat An-Naas hingga Al-Ikhlas yang fasih.',
      'Prestasi ini menjadi pendorong semangat bagi seluruh santri bahwa belajar di RA Al-Maqom mengasah keberanian tampil dan percaya diri sejak usia dini.'
    ]
  },
  {
    id: 'news-5',
    title: 'Gelar Karya P5P2RA: Pameran Kreasi Daur Ulang & Kreasi Makanan Sehat Santri',
    slug: 'gelar-karya-p5p2ra-kreasi-santri',
    category: 'Berita',
    date: '20 Agustus 2025',
    author: 'Tim Fasilitator Kurikulum',
    readTime: '3 menit',
    featured: false,
    image: '/images/slide1_gedung.jpg',
    excerpt: 'Pameran karya Projek Penguatan Profil Pelajar Pancasila & Rahmatan Lil Alamin (P5P2RA) menampilkan hasil karya unik santri cilik bersama orang tua.',
    content: [
      'Halaman sekolah RA Al-Maqom disulap menjadi arena pameran karya seni edukatif. Anak-anak memamerkan mainan dari kardus bekas, celengan botol plastik, serta kreasi puding buah sehat.',
      'Kegiatan ini menumbuhkan rasa syukur, kepedulian terhadap kebersihan lingkungan, serta melatih daya cipta anak sejak dini.'
    ]
  },
  {
    id: 'news-6',
    title: 'Kegiatan Parenting & Buka Puasa Bersama Keluarga Besar RA Al-Maqom',
    slug: 'parenting-buka-puasa-bersama-keluarga-ra-almaqom',
    category: 'Berita',
    date: '05 Agustus 2025',
    author: 'Pengurus Yayasan Al-Maqom',
    readTime: '3 menit',
    featured: false,
    image: '/images/slide3_lab_komputer.jpg',
    excerpt: 'Mempererat tali silaturahmi antara yayasan, bunda guru, dan orang tua santri melalui seminar pengasuhan anak positif dan buka bersama.',
    content: [
      'Sebagai wujud sinergi pengasuhan, RA Al-Maqom menggelar temu parenting berkala menghadirkan narasumber praktisi psikologi anak, dilanjutkan santunan berkah dan berbuka puasa bersama.',
      'Kebersamaan ini memperkuat komitmen bahwa pendidikan karakter anak yang sukses bermula dari keselarasan antara rumah dan sekolah.'
    ]
  }
];

export const NEWS_LIST: NewsItem[] = (Array.isArray(PERSISTED_USER_CONTENT.news) && PERSISTED_USER_CONTENT.news.length > 0)
  ? (PERSISTED_USER_CONTENT.news as NewsItem[])
  : DEFAULT_NEWS_RAW;

export const PSB_INFO = {
  academicYear: '2027 / 2028',
  status: 'Pendaftaran Dibuka',
  batches: [
    {
      name: 'Gelombang I (Pendaftaran Awal & Diskon Infaq)',
      desc: 'Bagi calon santri Kelompok Bermain (KB), RA Kelompok A, dan Kelompok B dengan potongan biaya seragam.',
      startDate: '1 Januari 2027',
      endDate: '30 April 2027',
      announcementDate: 'Mei 2027',
      status: 'Aktif',
      color: 'emerald'
    },
    {
      name: 'Gelombang II (Jalur Reguler & Pindahan)',
      desc: 'Pendaftaran reguler dan calon santri pindahan selama kuota rombongan belajar masih tersedia.',
      startDate: '1 Mei 2027',
      endDate: '15 Juli 2027',
      announcementDate: 'Juli 2027',
      status: 'Segera Dibuka',
      color: 'amber'
    }
  ],
  requirements: [
    'Usia calon santri: Kelompok Bermain (3-4 tahun), Kelompok A (4-5 tahun), Kelompok B (5-6 tahun).',
    'Fotokopi Akta Kelahiran calon santri (2 lembar).',
    'Fotokopi Kartu Keluarga (KK) calon santri (2 lembar).',
    'Fotokopi KTP kedua orang tua/wali (1 lembar).',
    'Pas foto berwarna terbaru anak ukuran 3x4 (3 lembar).',
    'Fotokopi buku KIA/catatan imunisasi anak (jika ada).',
    'Mengisi formulir pendaftaran resmi yang disediakan panitia.'
  ],
  steps: [
    {
      step: 1,
      title: 'Pendaftaran Online / Datang ke Sekolah',
      desc: 'Mengisi formulir pendaftaran awal di situs resmi ini atau hadir langsung ke kantor sekretariat RA Al-Maqom.'
    },
    {
      step: 2,
      title: 'Penyerahan Berkas & Observasi Cilik',
      desc: 'Menyerahkan fotokopi akta kelahiran dan KK, dilanjutkan sesi interaksi ceria ramah anak bersama bunda guru.'
    },
    {
      step: 3,
      title: 'Wawancara & Silaturahmi Orang Tua',
      desc: 'Sesi ramah tamah bersama kepala sekolah mengenai kebiasaan anak, riwayat kesehatan, dan komitmen bersama.'
    },
    {
      step: 4,
      title: 'Penetapan & Pengumuman Penerimaan',
      desc: 'Menerima surat keterangan tanda penerimaan peserta didik baru dari panitia PPDB RA Al-Maqom.'
    },
    {
      step: 5,
      title: 'Daftar Ulang & Pengukuran Baju Seragam',
      desc: 'Penyelesaian administrasi pendaftaran dan pengambilan paket seragam serta perlengkapan belajar anak.'
    },
    {
      step: 6,
      title: 'Masa Pengenalan Lingkungan Sekolah (MPLS) Ceria',
      desc: 'Mengikuti hari-hari pertama orientasi sekolah yang ceria, bermain bersama teman baru dan bunda guru.'
    }
  ]
};

const DEFAULT_FACILITIES_RAW: FacilityItem[] = [
  {
    id: 'fac-1',
    name: 'Ruang Kelas Tematik Ber-AC & Ramah Anak',
    category: 'Akademik',
    description: 'Ruang kelas bersih, berpendingin udara, dilengkapi karpet empuk, meja kursi warna-warni ergonomis anak, dan aneka poster edukasi Islami.',
    image: '/images/slide1_gedung.jpg',
    features: ['Pendingin Udara (AC) Nyaman', 'Alat Permainan Edukatif (APE)', 'Karpet Bersih & Meja Bundar Ceria', 'Pojok Kreasi Hasil Karya Anak']
  },
  {
    id: 'fac-2',
    name: 'Taman Bermain Outdoor (Playground) Aman & Seru',
    category: 'Olahraga',
    description: 'Area bermain luar ruangan dengan rumput sintetis lembut, perosotan, ayunan, mangkok putar, dan jembatan titian untuk melatih motorik kasar anak.',
    image: '/images/slide4_lapangan.jpg',
    features: ['Rumput Sintetis Lembut & Aman', 'Perosotan, Ayunan & Jungkat-jungkit', 'Pagar Pengaman Keliling', 'Diawasi Langsung oleh Bunda Guru']
  },
  {
    id: 'fac-3',
    name: 'Pojok Baca & Perpustakaan Cerita Bergambar',
    category: 'Akademik',
    description: 'Koleksi buku dongeng Islami bergambar, kisah teladan 25 nabi, fabel budi pekerti, serta buku pengenalan huruf hijaiyah dan alfabet.',
    image: '/images/slide3_lab_komputer.jpg',
    features: ['Ratusan Buku Cerita & Fabel Bergambar', 'Bantal Baca Empuk & Nyaman', 'Audio Visual Dongeng Edukatif', 'Menumbuhkan Gemar Membaca Sejak Dini']
  },
  {
    id: 'fac-4',
    name: 'Musala Cilik & Tempat Wudhu Ramah Anak',
    category: 'Penunjang',
    description: 'Sarana ibadah yang bersih dan asri khusus ukuran anak-anak, dilengkapi kran wudhu pendek mandiri, sajadah lembut, dan mukena/sarung cilik.',
    image: '/images/slide2_upacara.jpg',
    features: ['Kran Wudhu Rendah Khusus Anak', 'Karpet Sajadah Bersih & Wangi', 'Alat Peraga Praktik Sholat', 'Pembiasaan Sholat Dhuha Cilik Harian']
  },
  {
    id: 'fac-5',
    name: 'Sentra Balok, Bermain Peran & Bahan Alam',
    category: 'Seni & Budaya',
    description: 'Ruang sentra tematik yang mengasah imajinasi anak dengan aneka balok kayu warna, miniatur profesi (dokter, koki, insinyur), serta media sensori.',
    image: '/images/slide1_gedung.jpg',
    features: ['Balok Kayu Edukatif Aneka Bentuk', 'Kostum & Peralatan Main Peran', 'Media Sensori Playdough & Pasir Kinetik', 'Melatih Kerja Sama Antar Santri']
  },
  {
    id: 'fac-6',
    name: 'Halaman Upacara, Senam Irama & Olahraga Cilik',
    category: 'Olahraga',
    description: 'Halaman luas berlantai aman untuk apel pagi, senam ceria anak sholeh, latihan drumband cilik, dan permainan tradisional nusantara.',
    image: '/images/slide4_lapangan.jpg',
    features: ['Area Senam Ceria Bersama Setiap Pagi', 'Peralatan Drumband & Olahraga Ringan', 'Udara Terbuka Segar', 'Lingkungan Bersih Bebas Asap Rokok']
  },
  {
    id: 'fac-7',
    name: 'Ruang UKS & Konsultasi Perkembangan Anak',
    category: 'Penunjang',
    description: 'Ruangan nyaman untuk penanganan pertama santri yang kurang sehat, dilengkapi alat ukur tinggi badan, timbangan berat badan, dan kotak P3K lengkap.',
    image: '/images/slide1_gedung.jpg',
    features: ['Tempat Tidur Istirahat Anak Nyaman', 'Pemeriksaan Kesehatan Anak Berkala', 'Timbangan & Pengukur Tinggi Badan', 'Koordinasi Cepat Bersama Orang Tua']
  },
  {
    id: 'fac-8',
    name: 'Area Cuci Tangan Higienis & Toilet Ramah Anak',
    category: 'Penunjang',
    description: 'Fasilitas sanitasi bersih dengan kloset mini ukuran anak-anak dan wastafel rendah dengan sabun pencuci tangan untuk membiasakan hidup bersih.',
    image: '/images/slide4_lapangan.jpg',
    features: ['Kloset & Wastafel Ukuran Khusus Anak', 'Sabun Cuci Tangan Antiseptik', 'Toilet Training Terbimbing', 'Selalu Bersih & Kering']
  }
];

export const FACILITIES_LIST: FacilityItem[] = (Array.isArray(PERSISTED_USER_CONTENT.facilities) && PERSISTED_USER_CONTENT.facilities.length > 0)
  ? (PERSISTED_USER_CONTENT.facilities as FacilityItem[])
  : DEFAULT_FACILITIES_RAW;

const DEFAULT_EXTRACURRICULARS_RAW: ExtracurricularItem[] = [
  {
    id: 'ekskul-1',
    name: 'Tahfidz & Iqro Cilik',
    category: 'Bahasa & Keorganisasian',
    description: 'Bimbingan intensif membaca buku Iqro dan hafalan surat-surat pendek Al-Qur’an serta doa harian secara riang gembira.',
    schedule: 'Selasa & Kamis, 10.30 - 11.30 WIB',
    iconName: 'BookOpen',
    achievements: 'Juara Lomba Tahfidz Cilik Tingkat Kota'
  },
  {
    id: 'ekskul-2',
    name: 'Drumband Cilik Gema Al-Maqom',
    category: 'Seni & Budaya',
    description: 'Latihan memegang stik drum, ketukan nada perkusi, senar, dan terompet mainan yang melatih kekompakan serta disiplin irama.',
    schedule: 'Rabu, 10.30 - 11.30 WIB',
    iconName: 'Music',
    achievements: 'Penampil Terbaik Parade Anak Usia Dini'
  },
  {
    id: 'ekskul-3',
    name: 'Seni Tari Islami & Gerak Lagu',
    category: 'Seni & Budaya',
    description: 'Mempelajari gerakan tari kreasi anak bernuansa Islami, lagu-lagu shalawat ceria, dan kelenturan gerak tubuh yang santun.',
    schedule: 'Senin, 10.30 - 11.30 WIB',
    iconName: 'Sparkles',
    achievements: 'Juara 1 Tari Kreasi Anak Festival PAUD'
  },
  {
    id: 'ekskul-4',
    name: 'Menggambar, Mewarnai & Kolase Kreatif',
    category: 'Seni & Budaya',
    description: 'Eksplorasi gradasi krayon, teknik melukis dengan spons, kolase biji-bijian, serta membentuk objek imajinatif anak.',
    schedule: 'Jumat, 09.30 - 10.30 WIB',
    iconName: 'Award',
    achievements: 'Juara Mewarnai Kategori TK/RA Tingkat Kota'
  },
  {
    id: 'ekskul-5',
    name: 'Pencak Silat Cilik & Bela Diri Karakter',
    category: 'Olahraga',
    description: 'Gerakan dasar silat anak nusantara untuk melatih keseimbangan fisik, ketahanan tubuh, serta penanaman sikap ksatria dan santun.',
    schedule: 'Sabtu, 08.00 - 09.00 WIB',
    iconName: 'Shield',
    achievements: 'Apresiasi Penampilan Jurus Tunggal Cilik'
  },
  {
    id: 'ekskul-6',
    name: 'Angklung & Musik Tradisional Cilik',
    category: 'Seni & Budaya',
    description: 'Mengenal nada bambu angklung Sunda Jawa Barat, memainkan lagu-lagu anak nusantara, dan melatih kerja sama harmoni.',
    schedule: 'Kamis, 10.30 - 11.30 WIB',
    iconName: 'Music',
    achievements: 'Grup Angklung Favorit Pentas Budaya Cilik'
  },
  {
    id: 'ekskul-7',
    name: 'Da’i Cilik & Latihan Percaya Diri (Pildacil)',
    category: 'Bahasa & Keorganisasian',
    description: 'Melatih anak berani berbicara di depan teman, melafalkan shalawat, salam, dan cerita hikmah nabi dengan ceria.',
    schedule: 'Rabu, 10.30 - 11.30 WIB',
    iconName: 'Mic',
    achievements: 'Juara Harapan Pildacil Tingkat Kota'
  },
  {
    id: 'ekskul-8',
    name: 'English & Arabic for Kids (Fun Storytelling)',
    category: 'Bahasa & Keorganisasian',
    description: 'Mengenal kosa kata bahasa Inggris dan Arab dasar seputar nama hewan, warna, anggota tubuh, dan angka melalui lagu ceria.',
    schedule: 'Senin, 10.30 - 11.30 WIB',
    iconName: 'Globe',
    achievements: 'Pentas Storytelling Bahasa Bilingual Cilik'
  }
];

export const EXTRACURRICULAR_LIST: ExtracurricularItem[] = (Array.isArray(PERSISTED_USER_CONTENT.extracurriculars) && PERSISTED_USER_CONTENT.extracurriculars.length > 0)
  ? (PERSISTED_USER_CONTENT.extracurriculars as ExtracurricularItem[])
  : DEFAULT_EXTRACURRICULARS_RAW;

const DEFAULT_ACHIEVEMENTS_RAW: AchievementItem[] = [
  {
    id: 'ach-1',
    title: 'Juara 1 Lomba Tahfidz Al-Qur’an Cilik Juz 30',
    studentName: 'Aisyah Putri Azzahra',
    event: 'Gebyar Kreativitas Santri RA Tingkat Kota',
    level: 'Kota',
    year: '2025',
    category: 'Keagamaan',
    image: '/images/slide2_upacara.jpg'
  },
  {
    id: 'ach-2',
    title: 'Juara 1 Lomba Mewarnai Kategori Anak Usia Dini',
    studentName: 'Muhammad Rayyan Al-Ghifari',
    event: 'Festival Seni & Kreativitas Anak Muslim',
    level: 'Kota',
    year: '2025',
    category: 'Seni & Budaya',
    image: '/images/slide4_lapangan.jpg'
  },
  {
    id: 'ach-3',
    title: 'Juara Umum Parade Drumband Cilik Kategori TK/RA',
    studentName: 'Grup Drumband Cilik Gema Al-Maqom',
    event: 'Lomba Drumband Pelajar Usia Dini Se-Jawa Barat',
    level: 'Provinsi',
    year: '2024',
    category: 'Seni & Budaya',
    image: '/images/slide2_upacara.jpg'
  },
  {
    id: 'ach-4',
    title: 'Juara 2 Tari Kreasi Nusantara Islami Anak',
    studentName: 'Sanggar Tari Cilik RA Al-Maqom',
    event: 'Pekan Seni & Budaya Santri Cilik',
    level: 'Kota',
    year: '2024',
    category: 'Seni & Budaya',
    image: '/images/slide2_upacara.jpg'
  }
];

export const ACHIEVEMENTS_LIST: AchievementItem[] = (Array.isArray(PERSISTED_USER_CONTENT.achievements) && PERSISTED_USER_CONTENT.achievements.length > 0)
  ? (PERSISTED_USER_CONTENT.achievements as AchievementItem[])
  : DEFAULT_ACHIEVEMENTS_RAW;

export const TEACHERS_LIST: TeacherStaff[] = [
  {
    id: 't-1',
    name: PERSISTED_USER_CONTENT.principal?.name || 'Hj. Siti Maesaroh, S.Pd.I.',
    role: 'Kepala RA Al-Maqom',
    subject: 'Manajemen Pendidikan & Pembina Utama PAUD/RA',
    education: 'S1 Pendidikan Islam Anak Usia Dini (PIAUD)',
    image: PERSISTED_USER_CONTENT.principal?.photo || '/images/principal_real.jpg'
  },
  {
    id: 't-2',
    name: 'Bunda Nurul Hidayati, S.Pd.',
    role: 'Wali Kelas Kelompok B (Persiapan SD)',
    subject: 'Literasi Dini, Fonik & Numerasi Cilik',
    education: 'S1 PG-PAUD',
    image: ''
  },
  {
    id: 't-3',
    name: 'Bunda Fatimah Az-Zahra, S.Pd.I.',
    role: 'Wali Kelas Kelompok A & Pembina Tahfidz',
    subject: 'Tahfidz Juz 30 & Pembiasaan Karakter Islami',
    education: 'S1 Pendidikan Agama Islam',
    image: ''
  },
  {
    id: 't-4',
    name: 'Bunda Rina Marlina, S.Pd.',
    role: 'Wali Kelas Kelompok Bermain (KB) & Sentra Seni',
    subject: 'Stimulasi Motorik, Sentra Balok & Mewarnai',
    education: 'S1 PG-PAUD',
    image: ''
  }
];

export const TESTIMONIALS_LIST: TestimonialItem[] = [
  {
    id: 'testi-1',
    quote: 'Alhamdulillah, menyekolahkan anak di RA Al-Maqom adalah keputusan terbaik kami. Bunda-bunda gurunya sangat telaten, sabar, dan penuh kasih sayang. Anak saya sekarang sudah lancar hafalan surat pendek dan mandiri membaca doa harian.',
    author: 'Bunda Aisyah & Bpk. Mulyadi',
    role: 'Orang Tua Santri Kelompok B',
    relation: 'Wali Murid Angkatan 2024/2025',
    image: ''
  },
  {
    id: 'testi-2',
    quote: 'Fasilitas di RA Al-Maqom sangat ramah anak dan bersih. Anak saya yang tadinya pemalu, kini jadi sangat ceria, percaya diri, dan selalu antusias berangkat sekolah setiap pagi karena pembelajarannya banyak bermain sambil belajar yang bermakna.',
    author: 'Ibu Ratna Dewi',
    role: 'Orang Tua Santri Kelompok A',
    relation: 'Wali Murid Angkatan 2025',
    image: ''
  },
  {
    id: 'testi-3',
    quote: 'Fondasi adab, sopan santun, dan cinta Al-Qur’an yang ditanamkan di RA Al-Maqom sangat terasa ketika anak kami melanjutkan ke jenjang SD/MI. Mereka terbiasa sholat dhuha dan santun kepada orang tua serta guru.',
    author: 'Bpk. Hendra Gunawan, S.T.',
    role: 'Alumni Paguyuban Orang Tua Santri',
    relation: 'Orang Tua Alumni RA Al-Maqom',
    image: ''
  }
];

export const FAQ_LIST: FaqItem[] = [
  {
    question: 'Berapa batasan usia masuk santri di RA Al-Maqom?',
    answer: 'RA Al-Maqom membuka 3 jenjang kelompok: Kelompok Bermain / Playgroup (usia 3-4 tahun), RA Kelompok A (usia 4-5 tahun), dan RA Kelompok B (usia 5-6 tahun). Perhitungan usia dihitung per bulan Juli tahun ajaran baru berjalan.',
    category: 'PPDB'
  },
  {
    question: 'Kurikulum apa yang diterapkan di RA Al-Maqom?',
    answer: 'RA Al-Maqom menerapkan Kurikulum Merdeka PAUD/RA yang diperkaya dengan Kurikulum Kemenag dan kurikulum khas Al-Maqom: Tahfidz cilik juz 30, pembiasaan sholat dhuha, doa harian, adab sopan santun 5S, serta stimulasi kecerdasan majemuk.',
    category: 'Akademik'
  },
  {
    question: 'Bagaimana jam masuk dan kepulangan santri di RA Al-Maqom?',
    answer: 'Pembelajaran berlangsung hari Senin hingga Jumat. Untuk Kelompok Bermain (KB) pukul 08.00 - 10.30 WIB, sedangkan untuk Kelompok A dan B pukul 07.30 - 11.30 WIB.',
    category: 'Umum'
  },
  {
    question: 'Bagaimana keamanan dan fasilitas bermain di RA Al-Maqom?',
    answer: 'Sekolah memiliki area bermain luar ruangan (playground) berpagar aman dengan rumput sintetis, ruang kelas tematik ber-AC, musala cilik, serta pengawasan ketat oleh bunda-bunda guru selama jam pembelajaran berlangsung.',
    category: 'Fasilitas'
  },
  {
    question: 'Bagaimana cara mendaftar dan apakah ada kemudahan biaya?',
    answer: 'Pendaftaran dapat dilakukan secara online melalui website ini atau langsung hadir di kantor sekretariat RA Al-Maqom. Kami menyediakan skema biaya pendidikan terjangkau serta keringanan infaq bagi keluarga yang membutuhkan.',
    category: 'PPDB'
  }
];
