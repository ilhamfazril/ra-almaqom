import React from 'react';
import { GraduationCap, Award, BookOpen, Sparkles, User, Sliders } from 'lucide-react';
import { TEACHERS_LIST } from '../data/schoolData';
import { TeacherStaff } from '../types';

interface TeachersSectionProps {
  teachersData?: TeacherStaff[];
  isAdmin?: boolean;
  onOpenAdminDashboard?: () => void;
}

export const TeachersSection: React.FC<TeachersSectionProps> = ({
  teachersData,
  isAdmin,
  onOpenAdminDashboard,
}) => {
  const teachers = (Array.isArray(teachersData) && teachersData.length > 0)
    ? teachersData
    : TEACHERS_LIST;

  return (
    <section id="guru-staf" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider mb-3">
            <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
            <span>Pendidik Berdedikasi</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Pimpinan & Tenaga <span className="text-emerald-700">Pendidik Unggulan</span>
          </h2>
          <p className="mt-3 text-slate-600 text-base sm:text-lg">
            Tenaga pendidik profesional berkualifikasi pendidikan anak usia dini & sarjana, berdedikasi mendidik dengan ketulusan dan penuh kasih sayang di RA Al-Maqom.
          </p>

          {isAdmin && onOpenAdminDashboard && (
            <div className="mt-4">
              <button
                type="button"
                onClick={onOpenAdminDashboard}
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow transition-all hover:scale-105"
              >
                <Sliders className="w-4 h-4 text-amber-300" />
                <span>Kelola Profil Guru (Tambah / Edit / Hapus)</span>
              </button>
            </div>
          )}
        </div>

        {/* Teachers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teachers.map((teacher) => (
            <div
              key={teacher.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-lg transition-all text-center flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-64 w-full overflow-hidden bg-gradient-to-br from-emerald-900 via-slate-900 to-slate-950 flex flex-col items-center justify-center">
                  {teacher.image && (teacher.image.startsWith('data:image/') || teacher.image.includes('principal_real.jpg')) ? (
                    <img
                      src={teacher.image}
                      alt={teacher.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-6 text-center select-none">
                      <div className="w-20 h-20 rounded-full bg-emerald-700/60 border-2 border-emerald-400/40 flex items-center justify-center text-white shadow-inner mb-3 group-hover:scale-105 transition-transform">
                        <GraduationCap className="w-10 h-10 text-amber-300" />
                      </div>
                      <div className="text-[11px] font-semibold text-emerald-200 uppercase tracking-wider">
                        Tenaga Pendidik
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        RA Al-Maqom
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                  <span className="absolute bottom-3 inset-x-3 text-amber-300 font-bold text-xs bg-slate-950/70 backdrop-blur-xs py-1 px-2 rounded-lg truncate border border-slate-800/60 shadow-sm">
                    {teacher.role}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug">
                    {teacher.name}
                  </h3>
                  <p className="text-xs text-emerald-700 font-semibold mt-1.5 line-clamp-2">
                    {teacher.subject}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
                  {teacher.education}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Training stats */}
        <div className="mt-12 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-around gap-6 text-center">
          <div>
            <div className="text-2xl font-black text-emerald-700">100%</div>
            <div className="text-xs text-slate-500 mt-0.5">Sertifikasi Pendidik Profesional</div>
          </div>
          <div className="hidden sm:block w-px h-10 bg-slate-200" />
          <div>
            <div className="text-2xl font-black text-emerald-700">S1 & S2</div>
            <div className="text-xs text-slate-500 mt-0.5">Kualifikasi Akademik Perguruan Tinggi</div>
          </div>
          <div className="hidden sm:block w-px h-10 bg-slate-200" />
          <div>
            <div className="text-2xl font-black text-emerald-700">1 : 16</div>
            <div className="text-xs text-slate-500 mt-0.5">Rasio Ideal Guru : Siswa</div>
          </div>
        </div>

      </div>
    </section>
  );
};
