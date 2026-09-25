import React from 'react';
import { X, Calendar, Clock, User, Share2, Tag, ArrowLeft } from 'lucide-react';
import { NewsItem } from '../types';

interface NewsDetailModalProps {
  article: NewsItem | null;
  onClose: () => void;
}

export const NewsDetailModal: React.FC<NewsDetailModalProps> = ({ article, onClose }) => {
  if (!article) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 relative max-h-[90vh] flex flex-col">
        
        {/* Top bar */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
            <span className="bg-emerald-100 px-2.5 py-0.5 rounded-full">{article.category}</span>
            <span>RA Al-Maqom</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* Header info */}
          <div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              {article.title}
            </h2>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-1.5 font-medium text-slate-700">
                <User className="w-3.5 h-3.5 text-emerald-600" />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{article.date}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Waktu Baca: {article.readTime}</span>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="rounded-2xl overflow-hidden shadow-md max-h-96 w-full">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Lead Excerpt */}
          <p className="text-sm sm:text-base font-semibold text-slate-700 leading-relaxed bg-emerald-50/70 p-4 rounded-xl border-l-4 border-emerald-600">
            {article.excerpt}
          </p>

          {/* Paragraphs */}
          <div className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed">
            {article.content.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>

          {/* Footer of modal */}
          <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Tag className="w-3.5 h-3.5 text-emerald-600" />
              <span>Kategori: {article.category} • Info Resmi RA Al-Maqom</span>
            </div>

            <button
              onClick={onClose}
              className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-colors"
            >
              Tutup Berita
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
