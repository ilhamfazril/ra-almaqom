import React, { useState } from 'react';
import { 
  Users2, 
  Sparkles, 
  Calendar, 
  Trophy, 
  Cpu, 
  Microscope, 
  Activity, 
  Flame, 
  Music, 
  Mic, 
  Globe2, 
  HeartPulse, 
  Award, 
  Camera, 
  Shield, 
  Headphones
} from 'lucide-react';
import { EXTRACURRICULAR_LIST } from '../data/schoolData';
import { ExtracurricularItem } from '../types';

interface ExtracurricularSectionProps {
  extracurricularsData?: ExtracurricularItem[];
}

export const ExtracurricularSection: React.FC<ExtracurricularSectionProps> = ({ extracurricularsData }) => {
  const [activeCategory, setActiveCategory] = useState<string>('Semua');

  const categories = [
    'Semua',
    'Sains & Teknologi',
    'Olahraga',
    'Seni & Budaya',
    'Bahasa & Keorganisasian'
  ];

  const allItems = (extracurricularsData && extracurricularsData.length > 0)
    ? extracurricularsData
    : EXTRACURRICULAR_LIST;

  const filteredItems = activeCategory === 'Semua'
    ? allItems
    : allItems.filter((item) => item.category === activeCategory);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu': return <Cpu className="w-5 h-5 text-blue-600" />;
      case 'Microscope': return <Microscope className="w-5 h-5 text-emerald-600" />;
      case 'Activity': return <Activity className="w-5 h-5 text-orange-600" />;
      case 'Flame': return <Flame className="w-5 h-5 text-red-600" />;
      case 'Music': return <Music className="w-5 h-5 text-purple-600" />;
      case 'Mic': return <Mic className="w-5 h-5 text-pink-600" />;
      case 'Globe2': return <Globe2 className="w-5 h-5 text-teal-600" />;
      case 'HeartPulse': return <HeartPulse className="w-5 h-5 text-rose-600" />;
      case 'Award': return <Award className="w-5 h-5 text-amber-600" />;
      case 'Camera': return <Camera className="w-5 h-5 text-indigo-600" />;
      case 'Shield': return <Shield className="w-5 h-5 text-yellow-600" />;
      case 'Headphones': return <Headphones className="w-5 h-5 text-cyan-600" />;
      default: return <Sparkles className="w-5 h-5 text-emerald-600" />;
    }
  };

  return (
    <section id="kesiswaan" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            28+ Pilihan <span className="text-emerald-700">Ekstrakurikuler Aktif</span>
          </h2>
          <p className="mt-3 text-slate-600 text-base sm:text-lg">
            Menumbuhkan potensi non-akademik, kepemimpinan, sportivitas, serta kreativitas seni melalui pembinaan terstruktur oleh instruktur profesional.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeCategory === cat
                  ? 'bg-emerald-700 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-200/80 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg hover:border-emerald-400 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-emerald-50 flex items-center justify-center transition-colors">
                    {getIcon(item.iconName)}
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                    {item.category}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {item.name}
                </h3>

                <p className="mt-2 text-slate-600 text-xs leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className="truncate">{item.schedule}</span>
                </div>

                <div className="flex items-start gap-1.5 text-[11px] text-emerald-800 bg-emerald-50/80 p-2 rounded-lg border border-emerald-100 font-medium">
                  <Trophy className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span className="line-clamp-1">{item.achievements}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Parenting & Komite Callout */}
        <div className="mt-14 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xl shadow flex-shrink-0">
              RA
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-bold text-slate-900">
                Komite Parenting & Paguyuban Orang Tua RA Al-Maqom
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Wadah kolaborasi harmonis antara guru dan orang tua murid dalam mendampingi tumbuh kembang, stimulasi motorik, dan pembiasaan adab Islami ananda.
              </p>
            </div>
          </div>
          <div className="flex-shrink-0">
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-4 py-2 rounded-xl">
              Sinergi Keluarga & Madrasah
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
