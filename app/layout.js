// app/layout.js
import './globals.css';

/**
 * Metadata Server-Side Next.js App Router
 * Dioptimalkan khusus agar RA Al-Maqom meraih peringkat #1 di Google Search Engine
 * Target: RA Al-Maqom Cimahi, PPDB RA Al-Maqom, Raudhatul Athfal di Cimahi
 */
export const metadata = {
  metadataBase: new URL('https://ra-almaqom.sch.id'),
  title: {
    default: 'RA Al-Maqom Cimahi | Raudhatul Athfal Unggulan & Berkarakter Qurani',
    template: '%s | RA Al-Maqom Cimahi',
  },
  description:
    'Website resmi RA Al-Maqom (Raudhatul Athfal Al Maqom) Cimahi. Lembaga pendidikan prasekolah Islam terbaik di Kota Cimahi dengan kurikulum holistik integratif, pembiasaan adab Islami, tahfidz anak usia dini, dan informasi PPDB online terbaru.',
  keywords: [
    // 1. Nama Sekolah & Variasi
    'RA Al-Maqom',
    'RA Al Maqom',
    'Raudhatul Athfal Al-Maqom',
    'Raudhatul Athfal Al Maqom',
    'TK Al-Maqom Cimahi',
    'TK Islam Al Maqom',
    'Yayasan RA Al-Maqom',

    // 2. Fitur Sekolah & Layanan
    'PPDB RA Al-Maqom',
    'Pendaftaran Siswa Baru RA Al-Maqom',
    'Pendaftaran RA Al Maqom Cimahi',
    'Biaya Masuk RA Al Maqom',
    'Syarat Masuk RA Al Maqom Cimahi',
    'Berita RA Al-Maqom',
    'Prestasi Siswa RA Al Maqom',
    'Kurikulum RA Al Maqom',
    'Kegiatan Ekstrakurikuler RA Al-Maqom',

    // 3. Lokasi / Wilayah & Reputasi
    'RA Al Maqom Cimahi',
    'Raudhatul Athfal di Cimahi',
    'Sekolah RA terbaik di Cimahi',
    'TK Islam terbaik di Cimahi',
    'PAUD unggulan di Cimahi',
    'Pendidikan Anak Usia Dini Cimahi',
    'Raudhatul Athfal Cimahi Jawa Barat'
  ],
  authors: [{ name: 'RA Al-Maqom Cimahi', url: 'https://ra-almaqom.sch.id' }],
  creator: 'RA Al-Maqom Cimahi',
  publisher: 'RA Al-Maqom Cimahi',
  applicationName: 'Portal Resmi RA Al-Maqom',
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  alternates: {
    canonical: 'https://ra-almaqom.sch.id',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // Open Graph untuk tampilan memukau saat dibagikan ke WhatsApp, FB, Instagram
  openGraph: {
    title: 'RA Al-Maqom Cimahi - Raudhatul Athfal Berakhlak Qurani & Berprestasi',
    description:
      'Pendaftaran Siswa Baru (PPDB Online) RA Al-Maqom Cimahi telah dibuka! Kenali profil sekolah, guru berdedikasi, fasilitas edukatif, dan kurikulum islami anak usia dini.',
    url: 'https://ra-almaqom.sch.id',
    siteName: 'RA Al-Maqom Cimahi',
    locale: 'id_ID',
    type: 'website',
    images: [
      {
        url: 'https://ra-almaqom.sch.id/images/og-ra-almaqom.jpg',
        width: 1200,
        height: 630,
        alt: 'Profil Sekolah & PPDB Online RA Al-Maqom Cimahi',
      },
    ],
  },
  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'RA Al-Maqom Cimahi | Sekolah Raudhatul Athfal Unggulan',
    description:
      'Pusat informasi profil, program unggulan, dan PPDB Online RA Al-Maqom Kota Cimahi.',
    images: ['https://ra-almaqom.sch.id/images/og-ra-almaqom.jpg'],
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  category: 'education',
};

// Objek Schema.org JSON-LD Resmi untuk Google Rich Snippet
const structuredSchoolData = {
  '@context': 'https://schema.org',
  '@type': 'Preschool',
  name: 'RA Al-Maqom',
  alternateName: [
    'RA Al Maqom',
    'Raudhatul Athfal Al-Maqom',
    'Raudhatul Athfal Al Maqom Cimahi',
    'TK Al-Maqom Cimahi'
  ],
  url: 'https://ra-almaqom.sch.id',
  logo: 'https://ra-almaqom.sch.id/images/logo-almaqom.svg',
  image: 'https://ra-almaqom.sch.id/images/og-ra-almaqom.jpg',
  description:
    'Lembaga Pendidikan Raudhatul Athfal (RA) Al-Maqom Cimahi menyelenggarakan pendidikan anak usia dini berkarakter Islami, tahfidz Al-Quran, dan kurikulum merdeka PAUD.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Cimahi',
    addressRegion: 'Jawa Barat',
    addressCountry: 'ID',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '-6.8722',
    longitude: '107.5422',
  },
  priceRange: 'Terjangkau',
  educationalCredentialAwarded: 'Sertifikat Raudhatul Athfal',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className="scroll-smooth">
      <head>
        {/* Google Structured Data / Rich Snippets */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredSchoolData) }}
        />
      </head>
      <body className="bg-slate-50 text-slate-800 antialiased font-sans selection:bg-emerald-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
