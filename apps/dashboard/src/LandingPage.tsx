import { ArrowRight, Users, Activity, ShieldCheck, HeartPulse, CheckCircle2, TrendingDown, Target, Camera } from 'lucide-react';

import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-glyde-subtleBg font-sans text-slate-800">
      {/* Navbar */}
      <nav className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-glyde-primary rounded-xl flex items-center justify-center">
            <HeartPulse size={20} className="text-white" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-slate-800">GLYDE</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
          <a href="#" className="hover:text-glyde-primary transition-colors">Fitur</a>
          <a href="#" className="hover:text-glyde-primary transition-colors">Manfaat</a>
          <a href="#" className="hover:text-glyde-primary transition-colors">Testimoni</a>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-sm font-bold text-slate-600 hover:text-glyde-primary transition-colors hidden sm:block">
            Masuk
          </Link>
          <Link to="/dashboard" className="bg-glyde-primary hover:bg-blue-700 text-white text-sm font-bold py-2.5 px-5 rounded-full shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2">
            <span>Dashboard</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </nav>

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 pb-24 space-y-6">
        
        {/* Hero Section Bento */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Main Hero Card */}
          <div className="md:col-span-12 bg-glyde-sidebar rounded-[32px] md:rounded-[40px] p-6 md:p-16 text-white relative overflow-hidden shadow-xl shadow-blue-500/10">
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold mb-6">
                Manajemen Diabetes Cerdas
              </div>
              <h1 className="text-4xl md:text-6xl font-black leading-[1.1] mb-6 tracking-tight">
                Ubah kebiasaan, <br className="hidden md:block"/>turunkan risiko dengan Rule-Based System
              </h1>
              <p className="text-blue-100 text-lg mb-8 max-w-lg font-medium leading-relaxed">
                GLYDE memetakan risiko perilaku harian Anda melalui skor terukur dan memberikan rencana intervensi personal. Tanpa tebakan, murni berbasis data medis.
              </p>
              <Link to="/dashboard" className="inline-flex items-center gap-2 bg-white text-glyde-sidebar hover:bg-blue-50 font-bold text-lg py-4 px-8 rounded-full shadow-xl transition-transform hover:scale-105">
                Mulai Pemetaan Risiko
                <div className="w-8 h-8 rounded-full bg-glyde-lightBlue flex items-center justify-center">
                  <ArrowRight size={18} className="text-glyde-sidebar" />
                </div>
              </Link>
            </div>
            {/* Abstract Decorative Elements mimicking the reference */}
            <div className="absolute right-0 top-0 bottom-0 w-1/3 hidden lg:flex items-center justify-center opacity-80 pointer-events-none">
              <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-2xl">
                <circle cx="200" cy="200" r="150" fill="#2f5eed" opacity="0.5" />
                <path d="M100 200 C100 100, 300 100, 300 200 C300 300, 100 300, 100 200" fill="none" stroke="#fff" strokeWidth="10" strokeDasharray="20 20" className="animate-spin-slow" style={{animationDuration: '20s'}} />
                <rect x="150" y="150" width="100" height="100" rx="30" fill="#fff" transform="rotate(45 200 200)" />
              </svg>
            </div>
          </div>

          {/* Three Metric Cards below hero */}
          <div className="md:col-span-5 bg-glyde-lightBlue rounded-[32px] p-8 shadow-sm flex flex-col justify-center">
            <h3 className="text-3xl font-black text-glyde-sidebar mb-2">1,500+</h3>
            <p className="text-sm font-semibold text-slate-500">
              Pasien dipantau secara aktif melalui sistem intervensi.
            </p>
            <div className="mt-4 w-10 h-10 rounded-full bg-white flex items-center justify-center text-glyde-primary shadow-sm">
              <Users size={20} />
            </div>
          </div>
          <div className="md:col-span-4 bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 flex flex-col justify-center">
            <h3 className="text-3xl font-black text-slate-800 mb-2">800+</h3>
            <p className="text-sm font-semibold text-slate-500">
              Menu makanan berhasil diestimasi kadar gulanya.
            </p>
          </div>
          <div className="md:col-span-3 bg-glyde-accentTeal rounded-[32px] p-8 shadow-sm text-white flex flex-col justify-center">
            <h3 className="text-3xl font-black mb-2">5 Tahun</h3>
            <p className="text-sm font-medium text-emerald-50">
              Riset medis untuk membentuk rule-based scoring.
            </p>
            <div className="mt-4 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shadow-inner">
              <ShieldCheck size={20} />
            </div>
          </div>
        </div>

        {/* Section 2: Audience Cards */}
        <div className="mt-20">
          <div className="mb-10 max-w-2xl">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight leading-tight mb-4">
              GLYDE dirancang khusus untuk pencegahan berkelanjutan.
            </h2>
            <p className="text-slate-500 font-medium">Baik Anda seorang pasien yang ingin mengubah gaya hidup, maupun tenaga medis yang memonitor progresi pasien.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="bg-glyde-lightBlue rounded-[32px] md:rounded-[40px] p-6 md:p-10 flex flex-col justify-between group hover:shadow-xl transition-shadow border border-blue-50">
              <div>
                <h3 className="text-2xl font-black text-glyde-sidebar mb-6">Untuk Pasien & Individu</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={20} className="text-glyde-primary shrink-0 mt-0.5" />
                    <span className="text-slate-600 font-medium text-sm">Pahami skor risiko Anda lewat asesmen 3 langkah.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={20} className="text-glyde-primary shrink-0 mt-0.5" />
                    <span className="text-slate-600 font-medium text-sm">Scan makanan Anda untuk mengetahui batas gula seketika.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={20} className="text-glyde-primary shrink-0 mt-0.5" />
                    <span className="text-slate-600 font-medium text-sm">Dapatkan jadwal target (tidur, gerak, minum) harian.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={20} className="text-glyde-primary shrink-0 mt-0.5" />
                    <span className="text-slate-600 font-medium text-sm">Kumpulkan lencana (badges) untuk motivasi konsistensi.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-12 w-full h-40 bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-50/50"></div>
                <TrendingDown size={60} className="text-glyde-primary opacity-20 absolute -right-4 -bottom-4" />
                <div className="text-center z-10">
                  <span className="block text-3xl font-black text-glyde-primary mb-1">58/100</span>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Skor Risiko Moderat</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-100 rounded-[32px] md:rounded-[40px] p-6 md:p-10 flex flex-col justify-between group hover:shadow-xl transition-shadow">
              <div>
                <h3 className="text-2xl font-black text-slate-800 mb-6">Untuk Tenaga Medis & Dokter</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={20} className="text-slate-500 shrink-0 mt-0.5" />
                    <span className="text-slate-600 font-medium text-sm">Monitor adherence (kepatuhan) pasien pada intervensi.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={20} className="text-slate-500 shrink-0 mt-0.5" />
                    <span className="text-slate-600 font-medium text-sm">Data ringkasan ekspor PDF untuk rekam medis terpadu.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={20} className="text-slate-500 shrink-0 mt-0.5" />
                    <span className="text-slate-600 font-medium text-sm">Atur threshold (batas) risiko berbasis Rule-Based spesifik.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-12 w-full h-40 bg-white rounded-3xl p-5 shadow-sm border border-slate-200 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-slate-50/50"></div>
                <Activity size={60} className="text-slate-300 opacity-20 absolute -left-4 -top-4" />
                <div className="text-center z-10 flex gap-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center"><Activity size={20} className="text-indigo-600" /></div>
                  <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center"><HeartPulse size={20} className="text-rose-600" /></div>
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center"><CheckCircle2 size={20} className="text-emerald-600" /></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Features Grid */}
        <div className="mt-20">
          <div className="flex items-end justify-between mb-8">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight max-w-xl">
              Pendekatan terpadu untuk membentuk gaya hidup baru.
            </h2>
            <div className="hidden md:flex gap-2">
              <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">Gamification</span>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full">Rule-Based</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 bg-white border border-slate-200 p-8 rounded-[32px] shadow-sm">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-glyde-primary">
                <Target size={24} />
              </div>
              <h4 className="text-lg font-bold text-slate-800 mb-2">Intervensi Akurat</h4>
              <p className="text-sm text-slate-500 font-medium">Bukan sekadar saran umum. Jika Anda kurang gerak, Anda mendapat 'Move Challenge'. Jika gula tinggi, Anda mendapat 'Sugar Cut'.</p>
            </div>
            <div className="md:col-span-2 bg-white border border-slate-200 p-8 rounded-[32px] shadow-sm flex flex-col md:flex-row gap-6 items-center">
              <div className="flex-1">
                <h4 className="text-lg font-bold text-slate-800 mb-2">Food Scanner</h4>
                <p className="text-sm text-slate-500 font-medium">Arahkan kamera ke makanan Anda, dan sistem akan mengestimasi kandungan gulanya secara instan.</p>
              </div>
              <div className="w-24 h-24 bg-slate-100 rounded-2xl shrink-0 border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400">
                <Camera size={32} />
              </div>
            </div>
            
            <div className="bg-glyde-lightBlue p-8 rounded-[32px] border border-blue-100">
              <h4 className="font-bold text-glyde-primary mb-2">Smart Notif</h4>
              <p className="text-xs text-slate-600 font-medium">Pengingat tepat waktu sebelum Anda melewatkan jadwal sehat Anda.</p>
            </div>
            <div className="bg-white border border-slate-200 p-8 rounded-[32px]">
              <h4 className="font-bold text-slate-800 mb-2">PDF Report</h4>
              <p className="text-xs text-slate-500 font-medium">Ekspor laporan 1-klik untuk bahan diskusi dengan dokter.</p>
            </div>
            <div className="md:col-span-2 bg-glyde-accentTeal p-6 md:p-8 rounded-[32px] text-white flex items-center justify-between shadow-md">
              <div className="pr-4">
                <h4 className="text-lg md:text-xl font-bold mb-2">Siap untuk memulai?</h4>
                <p className="text-xs md:text-sm text-emerald-50 max-w-xs">Akses dashboard sekarang untuk mapping risiko perdana Anda.</p>
              </div>
              <Link to="/dashboard" className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-emerald-500 hover:scale-110 transition-transform shadow-lg">
                <ArrowRight size={24} />
              </Link>
            </div>
          </div>
        </div>

        {/* Section 4: Final CTA */}
        <div className="mt-20 bg-glyde-primary rounded-[32px] md:rounded-[40px] p-8 md:p-16 text-center relative overflow-hidden shadow-2xl shadow-blue-500/20">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-5xl font-black text-white mb-6 tracking-tight leading-tight">
              Kendalikan Risiko Anda Hari Ini Juga.
            </h2>
            <p className="text-blue-100 font-medium mb-10 text-lg">
              Bergabung bersama ribuan pasien lainnya dalam perjalanan membangun kebiasaan yang lebih sehat dengan GLYDE.
            </p>
            <Link to="/dashboard" className="inline-flex items-center gap-3 bg-white hover:bg-slate-50 text-glyde-primary font-bold text-xl py-5 px-10 rounded-full shadow-xl transition-all hover:scale-105">
              <span>Buka Dashboard GLYDE</span>
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>

      </main>
      
      {/* Simple Footer */}
      <footer className="w-full border-t border-slate-200 py-8 text-center text-slate-500 text-sm font-medium">
        <p>&copy; 2026 GLYDE - Behavior Risk Dashboard. Built for preventative health.</p>
      </footer>
    </div>
  );
}
