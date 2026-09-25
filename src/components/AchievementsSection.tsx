import React from 'react';
import { 
  Trophy, 
  Award, 
  Sparkles, 
  Star, 
  Medal, 
  ExternalLink 
} from 'lucide-react';
import { ACHIEVEMENTS_LIST } from '../data/schoolData';
import { AchievementItem } from '../types';

interface AchievementsSectionProps {
  achievementsData?: AchievementItem[];
}

export const AchievementsSection: React.FC<AchievementsSectionProps> = ({ achievementsData }) => {
  const achievements = (achievementsData && achievementsData.length > 0)
    ? achievementsData
    : ACHIEVEMENTS_LIST;

  return (
    <section id="prestasi" className="py-16 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Prestasi & <span className="text-emerald-700">Pencapaian Siswa</span>
          </h2>
          <p className="mt-3 text-slate-600 text-base sm:text-lg">
            Apresiasi perjuangan dan dedikasi santri cilik RA Al-Maqom dalam berbagai ajang festival anak shaleh, tahfidz, seni, dan kreativitas.
          </p>
        </div>

        {/* Achievement Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              <div className="relative h-44 w-full overflow-hidden">
                <img
                  src={ach.image}
                  alt={ach.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                
                {/* Level badge */}
                <div className={`absolute top-3 left-3 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow ${
                  ach.level === 'Internasional' 
                    ? 'bg-amber-400 text-slate-950' 
                    : 'bg-emerald-600 text-white'
                }`}>
                  Tingkat {ach.level}
                </div>

                <span className="absolute bottom-2.5 right-3 text-white text-xs font-bold bg-black/50 px-2 py-0.5 rounded">
                  {ach.year}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider mb-1">
                    {ach.category}
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors line-clamp-2">
                    {ach.title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-600 font-semibold">
                    {ach.studentName}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                    {ach.event}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1 text-[11px] text-amber-600 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>Prestasi Santri RA Al-Maqom</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Callout box */}
        <div className="mt-12 bg-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold flex-shrink-0">
              <Medal className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm sm:text-base font-bold text-white">
                Program Pembinaan Talenta Khusus & Klinik Prestasi
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Sekolah memfasilitasi pendampingan guru pembina olimpiade serta dispensasi kompetisi nasional dan internasional.
              </p>
            </div>
          </div>
          <div className="flex-shrink-0">
            <span className="text-amber-400 font-extrabold text-sm border border-amber-400/40 px-4 py-2 rounded-xl bg-amber-400/10">
              65+ Medali Tiap Tahun
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
