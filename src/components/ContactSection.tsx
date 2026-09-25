import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { SCHOOL_INFO, FAQ_LIST } from '../data/schoolData';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Pertanyaan Umum',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'Pertanyaan Umum',
        message: ''
      });
    }, 4000);
  };

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  return (
    <section id="kontak" className="py-16 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider mb-3">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>Pusat Informasi & Konsultasi</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Hubungi <span className="text-emerald-700">RA Al-Maqom</span>
          </h2>
          <p className="mt-3 text-slate-600 text-base sm:text-lg">
            Kami siap melayani pertanyaan seputar penerimaan peserta didik baru (PPDB), kurikulum, fasilitas, atau kunjungan sekolah.
          </p>
        </div>

        {/* Contact Info & Map Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          
          {/* Contact Details */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-3">
                Informasi Kontak Resmi
              </h3>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Alamat Sekolah:</div>
                  <p className="text-xs sm:text-sm text-slate-600 mt-0.5 leading-relaxed">
                    {SCHOOL_INFO.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Telepon Sekolah:</div>
                  <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                    {SCHOOL_INFO.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Email Korespondensi:</div>
                  <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                    {SCHOOL_INFO.email}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Jam Operasional Layanan:</div>
                  <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                    {SCHOOL_INFO.operationalHours}
                  </p>
                </div>
              </div>
            </div>

            {/* Official Interactive Google Maps Card */}
            <div className="bg-slate-900 text-white rounded-3xl shadow-xl overflow-hidden border border-slate-800 flex flex-col">
              <div className="p-5 sm:p-6 pb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-amber-400 text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    Lokasi Kampus RA Al-Maqom
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-300 bg-emerald-950 border border-emerald-700/60 px-2.5 py-0.5 rounded-full">
                    Cimahi Utara
                  </span>
                </div>
                <h4 className="text-base sm:text-lg font-bold text-white leading-snug">
                  Cibabat, Cimahi Utara — Kota Cimahi
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed mt-1">
                  Jl. Pesantren VI No. 225, RT 06/RW 15, Kel. Cibabat, Kec. Cimahi Utara, Kota Cimahi (Komplek Masjid & Yayasan Al-Maqom).
                </p>
              </div>

              {/* Embedded Interactive Google Map */}
              <div className="relative w-full h-56 sm:h-64 bg-slate-800">
                <iframe
                  title="Peta Lokasi Resmi RA Al-Maqom Cimahi"
                  src="https://maps.google.com/maps?q=Jl.+Pesantren+VI+No.225,+Cibabat,+Kec.+Cimahi+Utara,+Kota+Cimahi,+Jawa+Barat+40513&t=&z=16&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full grayscale-[10%] contrast-105"
                />
              </div>

              {/* Action Button */}
              <div className="p-4 sm:p-5 bg-slate-950/90 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                <div className="text-[11px] text-slate-400">
                  Navigasi instan via Google Maps & Waze
                </div>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent('RA Al-Maqom Jl. Pesantren VI No.225 Cibabat Cimahi Utara')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-all shadow-sm shrink-0"
                >
                  <span>Buka Petunjuk Arah</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Message Form */}
          <div className="lg:col-span-7">
            <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <MessageSquare className="w-5 h-5 text-emerald-700" />
                <h3 className="text-lg font-bold text-slate-900">
                  Kirim Pesan / Pertanyaan Langsung
                </h3>
              </div>

              {isSubmitted ? (
                <div className="p-8 text-center bg-emerald-50 border border-emerald-300 rounded-2xl animate-in fade-in">
                  <div className="w-12 h-12 rounded-full bg-emerald-600 text-white mx-auto flex items-center justify-center mb-3">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900">Pesan Anda Berhasil Terkirim!</h4>
                  <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                    Tim Tata Usaha & Humas RA Al-Maqom akan menindaklanjuti pesan Anda melalui email atau telepon dalam waktu 1x24 jam kerja.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Nama Lengkap *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Contoh: Budi Santoso"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Email Aktif *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="nama@email.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Nomor WhatsApp / Telepon
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="08123456789"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Topik Pesan
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-slate-700"
                      >
                        <option value="Pertanyaan Umum">Pertanyaan Umum</option>
                        <option value="Informasi PPDB">Informasi PPDB 2027/2028</option>
                        <option value="Kurikulum & Pembelajaran">Kurikulum & Pembelajaran</option>
                        <option value="Kunjungan Studi Banding">Kunjungan Studi Banding</option>
                        <option value="Lainnya">Lainnya</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Pesan atau Pertanyaan *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tuliskan pertanyaan atau kebutuhan konsultasi Anda secara lengkap..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Kirim Pesan Sekarang</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <div className="max-w-4xl mx-auto pt-10 border-t border-slate-200">
          <div className="flex items-center gap-2 justify-center mb-8">
            <HelpCircle className="w-5 h-5 text-emerald-700" />
            <h3 className="text-xl font-bold text-slate-900">Pertanyaan yang Sering Diajukan (FAQ)</h3>
          </div>

          <div className="space-y-3">
            {FAQ_LIST.map((faq, idx) => (
              <div
                key={idx}
                className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-semibold text-slate-800 text-xs sm:text-sm hover:text-emerald-700"
                >
                  <span className="flex-1">{faq.question}</span>
                  {openFaqIndex === idx ? (
                    <ChevronUp className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  )}
                </button>
                {openFaqIndex === idx && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-200/60 pt-3 bg-white">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
