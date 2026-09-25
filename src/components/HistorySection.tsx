import React from 'react';
import { History, Award, CheckCircle2 } from 'lucide-react';
import { SCHOOL_INFO } from '../data/schoolData';

export const HistorySection: React.FC = () => {
  const milestones = [
    {
      year: 'Pendirian Awal',
      title: 'Kiprah Pengabdian Yayasan Al-Maqom untuk Generasi Usia Dini',
      desc: 'Bermula dari komitmen para pendidik dan tokoh masyarakat muslim di bawah naungan Yayasan Al-Maqom untuk menyediakan pendidikan Raudhatul Athfal (RA) bernuansa Islami, berkualitas, dan penuh kasih sayang bagi tunas bangsa.'
    },
    {
      year: 'Pengembangan Sarana',
      title: 'Pembangunan Gedung & Arena Bermain Ramah Anak',
      desc: 'Pengembangan bertahap fasilitas sarana pembelajaran tematik ber-AC, musala cilik untuk sholat dhuha, taman bermain outdoor (playground) berumput sintetis yang aman, serta pojok literasi bergambar.'
    },
    {
      year: 'Program Unggulan',
      title: 'Penguatan Tahfidz Cilik & Metode Bermain Sambil Belajar',
      desc: 'Penerapan metode talaqqi interaktif untuk hafalan juz 30, doa keseharian, adab sopan santun 5S, serta kegiatan ekstrakurikuler drumband cilik, seni tari Islami, dan melukis kreatif.'
    },
    {
      year: 'Masa Kini',
      title: 'Implementasi Kurikulum Merdeka PAUD & Profil Pelajar Pancasila',
      desc: 'Mengintegrasikan Kurikulum Merdeka PAUD/RA dengan penguatan P5P2RA (Profil Pelajar Rahmatan Lil Alamin), stimulasi kecerdasan majemuk, serta kemitraan parenting aktif bersama orang tua.'
    }
  ];

  return (
    <section id="sejarah" className="py-16 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider mb-3">
            <History className="w-3.5 h-3.5 text-emerald-600" />
            <span>Kilas Sejarah</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Perjalanan Sejarah <span className="text-emerald-700">{SCHOOL_INFO.name}</span>
          </h2>
          <p className="mt-3 text-slate-600 text-base sm:text-lg">
            Dedikasi mengabdi membina tunas bangsa yang beriman, cerdas, mandiri, dan berakhlakul karimah di bawah naungan Yayasan Al-Maqom.
          </p>
        </div>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto">
          <div className="relative border-l-2 border-emerald-500/40 ml-4 sm:ml-8 pl-6 sm:pl-8 space-y-10">
            {milestones.map((m, idx) => (
              <div key={idx} className="relative group">
                {/* Dot */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-1 w-6 h-6 rounded-full bg-emerald-700 border-4 border-white shadow flex items-center justify-center text-white text-[10px] font-bold">
                  {idx + 1}
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm group-hover:border-emerald-400 group-hover:bg-emerald-50/40 transition-all">
                  <span className="text-xs font-black text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                    {m.year}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-2.5">
                    {m.title}
                  </h3>
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                    {m.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
