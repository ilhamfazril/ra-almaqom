// app/page.js
import React from 'react';
import SchoolAppClient from './components/SchoolAppClient';

/**
 * Halaman Utama Next.js App Router (Server-Side Component)
 * Merender struktur HTML semantik (header, main, section, h1, h2, article)
 * yang langsung terbaca oleh Googlebot saat merayap halaman.
 */
export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 
        Semantic SEO Static Markup (Googlebot Indexing Buffer)
        Bagian ini menjamin seluruh kata kunci:
        - "RA Al-Maqom" / "RA Al Maqom"
        - "Raudhatul Athfal Al-Maqom" / "Raudhatul Athfal Al Maqom"
        - "PPDB RA Al-Maqom" / "Pendaftaran Siswa Baru RA Al-Maqom"
        - "RA Al Maqom Cimahi" / "Raudhatul Athfal di Cimahi" / "Sekolah RA terbaik di Cimahi"
        terindeks 100% di server-side rendering (SSR).
      */}
      <header className="sr-only">
        <h1>RA Al-Maqom Cimahi | Sekolah Raudhatul Athfal Terbaik di Kota Cimahi</h1>
        <nav aria-label="Navigasi Aksesibilitas SEO">
          <ul>
            <li><a href="#profil">Profil RA Al-Maqom</a></li>
            <li><a href="#ppdb">PPDB Pendaftaran Siswa Baru RA Al-Maqom Cimahi</a></li>
            <li><a href="#kurikulum">Kurikulum & Program Unggulan</a></li>
            <li><a href="#fasilitas">Fasilitas RA Al-Maqom</a></li>
            <li><a href="#berita">Berita & Agenda Terkini</a></li>
          </ul>
        </nav>
      </header>

      {/* Semantic main container */}
      <main id="main-content" className="flex-grow">
        {/* Konten Interaktif Real-time Firebase Client App */}
        <SchoolAppClient />

        {/* 
          Semantic SEO Content Section (Tersedia bagi Search Engine & Screen Reader)
          Membantu Google memahami secara mendalam entitas sekolah di Cimahi
        */}
        <div className="sr-only" aria-hidden="false">
          <section id="profil">
            <h2>Tentang RA Al-Maqom Cimahi (Raudhatul Athfal Al Maqom)</h2>
            <p>
              RA Al-Maqom (Raudhatul Athfal Al Maqom) adalah lembaga pendidikan anak usia dini (PAUD / TK Islam) terkemuka di Kota Cimahi, Jawa Barat. Kami memadukan Kurikulum Merdeka PAUD dengan penanaman nilai-nilai Qurani, pembiasaan adab Islami harian, tahfidz juz 30, serta stimulasi motorik dan kognitif yang optimal.
            </p>
          </section>

          <section id="ppdb">
            <h2>PPDB Online RA Al-Maqom Cimahi - Pendaftaran Siswa Baru</h2>
            <p>
              Penerimaan Peserta Didik Baru (PPDB) RA Al-Maqom Kota Cimahi tahun ajaran baru telah resmi dibuka. Kami membuka pendaftaran untuk Kelompok Bermain (KB) dan Raudhatul Athfal (RA Kelompok A dan Kelompok B) dengan proses pendaftaran mudah dan cepat secara online.
            </p>
          </section>

          <section id="keunggulan">
            <h2>Mengapa Memilih RA Al-Maqom sebagai Sekolah RA Terbaik di Cimahi?</h2>
            <ul>
              <li>Pendidikan ramah anak dengan lingkungan islami yang asri dan aman di Cimahi.</li>
              <li>Guru dan tenaga pendidik berijazah linier, berdedikasi, penuh kasih sayang, dan tersertifikasi.</li>
              <li>Fasilitas belajar lengkap: ruang kelas tematik, area bermain luar dan dalam, perpustakaan anak, dan mushola.</li>
              <li>Biaya pendaftaran dan SPP terjangkau dengan mutu pembelajaran berkualitas tinggi.</li>
            </ul>
          </section>

          <section id="lokasi">
            <h2>Lokasi & Kontak Raudhatul Athfal Al-Maqom Cimahi</h2>
            <p>
              Berlokasi di Kota Cimahi, Jawa Barat. Informasi kontak, konsultasi pendaftaran siswa baru, dan layanan administrasi dapat diakses langsung melalui portal resmi ra-almaqom.sch.id.
            </p>
          </section>
        </div>
      </main>

      <footer className="sr-only">
        <p>Hak Cipta &copy; {new Date().getFullYear()} RA Al-Maqom Cimahi. Seluruh hak cipta dilindungi undang-undang.</p>
      </footer>
    </div>
  );
}
