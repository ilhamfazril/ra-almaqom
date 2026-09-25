import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  ChevronRight,
  Filter,
  User
} from 'lucide-react';
import { NEWS_LIST } from '../data/schoolData';
import { NewsItem } from '../types';

interface NewsSectionProps {
  onSelectArticle: (article: NewsItem) => void;
  newsData?: NewsItem[];
}

export const NewsSection: React.FC<NewsSectionProps> = ({ onSelectArticle, newsData }) => {
  const [activeCategory, setActiveCategory] = useState<string>('Semua');

  const categories = ['Semua', 'Berita', 'Prestasi', 'Pengumuman', 'Agenda'];

  const allNews = (newsData && newsData.length > 0) ? newsData : NEWS_LIST;

  const filteredNews = activeCategory === 'Semua'
    ? allNews
    : allNews.filter((n) => n.category === activeCategory);

  const featuredNews = allNews.find((n) => n.featured) || allNews[0];

  return (
    <section id="berita" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Berita, Prestasi & <span className="text-emerald-700">Agenda Sekolah</span>
            </h2>
            <p className="mt-2 text-slate-600 text-sm sm:text-base max-w-xl">
              Informasi terpercaya seputar kegiatan santri, agenda madrasah, serta program RA Al-Maqom.
            </p>
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeCategory === cat
                    ? 'bg-emerald-700 text-white shadow-md'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Featured News Hero Card (when on 'Semua' or 'Berita') */}
        {activeCategory === 'Semua' && (
          <div className="mb-12 bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-200 grid grid-cols-1 lg:grid-cols-12 group">
            <div className="lg:col-span-7 relative h-64 sm:h-80 lg:h-auto overflow-hidden">
              <img
                src={featuredNews.image}
                alt={featuredNews.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 bg-emerald-700 text-amber-300 text-xs font-bold px-3 py-1 rounded-full shadow">
                Sorotan Utama
              </div>
            </div>

            <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                  <span className="font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {featuredNews.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{featuredNews.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{featuredNews.readTime}</span>
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                  {featuredNews.title}
                </h3>

                <p className="mt-3 text-slate-600 text-sm leading-relaxed line-clamp-3">
                  {featuredNews.excerpt}
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{featuredNews.author}</span>
                </div>

                <button
                  onClick={() => onSelectArticle(featuredNews)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
                >
                  <span>Baca Selengkapnya</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Regular News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((news) => (
            <div
              key={news.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group cursor-pointer"
              onClick={() => onSelectArticle(news)}
            >
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={news.image}
                  alt={news.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                  {news.category}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 mb-2">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{news.date}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{news.readTime}</span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
                    {news.title}
                  </h3>

                  <p className="mt-2 text-slate-600 text-xs leading-relaxed line-clamp-2">
                    {news.excerpt}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 text-[11px] truncate max-w-[160px]">{news.author}</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Baca</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
