import { useState } from 'react';
import { Camera } from 'lucide-react';
import RiskMappingModal from './components/RiskMappingModal';
import FoodScannerModal from './components/FoodScannerModal';
import NotificationModal from './components/NotificationModal';
import GamificationModal from './components/GamificationModal';
import ReportModal from './components/ReportModal';

function App() {
  const [activeDate, setActiveDate] = useState(22);
  const [isRiskModalOpen, setIsRiskModalOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isBadgeOpen, setIsBadgeOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  return (
    <main className="w-full h-full bg-glyde-lightBlue/90 backdrop-blur-md p-3 sm:p-5 lg:p-6 flex flex-col lg:flex-row gap-4 relative overflow-hidden" data-purpose="dashboard-container">
      {/* BEGIN: Left Sidebar Navigation */}
      <aside className="w-full lg:w-[86px] bg-glyde-sidebar rounded-[28px] py-6 px-3 flex lg:flex-col items-center justify-between shadow-lg shadow-blue-500/20 shrink-0 z-20" data-purpose="primary-sidebar">
        {/* Brand Logo Wordmark */}
        <div className="flex flex-col items-center gap-1">
          <a className="text-white font-extrabold text-xl tracking-tight leading-none text-center" href="#">
            GLYDE
          </a>
          <span className="w-1.5 h-1.5 bg-sky-300 rounded-full"></span>
        </div>

        {/* Center Nav Icons */}
        <nav aria-label="Main Navigation" className="flex lg:flex-col items-center justify-center gap-3 sm:gap-4 my-auto">
          {/* Active Dashboard Link */}
          <a className="w-12 h-12 bg-white/20 hover:bg-white/30 text-white rounded-2xl flex items-center justify-center transition-all shadow-inner" href="#" title="Dashboard">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
          </a>
          {/* Analytics (Wired to Risk Mapping) */}
          <a onClick={(e) => { e.preventDefault(); setIsRiskModalOpen(true); }} className="w-11 h-11 text-blue-200 hover:text-white hover:bg-white/10 rounded-2xl flex items-center justify-center transition-all cursor-pointer" title="Risiko & Analisis">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          {/* Notifications / Messages with Notification Badge */}
          <a onClick={(e) => { e.preventDefault(); setIsNotifOpen(true); }} className="w-11 h-11 text-blue-200 hover:text-white hover:bg-white/10 rounded-2xl flex items-center justify-center relative transition-all cursor-pointer" title="Peringatan Perilaku">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="absolute top-2 right-2 w-3.5 h-3.5 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-glyde-sidebar">3</span>
          </a>
          {/* Calendar Schedule */}
          <a onClick={(e) => { e.preventDefault(); setIsBadgeOpen(true); }} className="w-11 h-11 text-blue-200 hover:text-white hover:bg-white/10 rounded-2xl flex items-center justify-center transition-all cursor-pointer" title="Pencapaian & Lencana">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <rect height="18" rx="2" strokeLinecap="round" width="18" x="3" y="4" />
              <line strokeLinecap="round" x1="16" x2="16" y1="2" y2="6" />
              <line strokeLinecap="round" x1="8" x2="8" y1="2" y2="6" />
              <line strokeLinecap="round" x1="3" x2="21" y1="10" y2="10" />
              <circle cx="8" cy="14" fill="currentColor" r="1" />
              <circle cx="12" cy="14" fill="currentColor" r="1" />
              <circle cx="16" cy="14" fill="currentColor" r="1" />
            </svg>
          </a>
          {/* Medical Modules / Apps (Wired to Food Scanner) */}
          <a onClick={(e) => { e.preventDefault(); setIsScannerOpen(true); }} className="w-11 h-11 text-blue-200 hover:text-white hover:bg-white/10 rounded-2xl flex items-center justify-center transition-all cursor-pointer" title="Modul Diet & Gula (Scan Makanan)">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <rect height="7" rx="1.5" width="7" x="3" y="3" />
              <rect height="7" rx="1.5" width="7" x="14" y="3" />
              <rect height="7" rx="1.5" width="7" x="3" y="14" />
              <rect height="7" rx="1.5" width="7" x="14" y="14" />
            </svg>
          </a>
          {/* Info & Guidance */}
          <a onClick={(e) => { e.preventDefault(); setIsReportOpen(true); }} className="w-11 h-11 text-blue-200 hover:text-white hover:bg-white/10 rounded-2xl flex items-center justify-center transition-all cursor-pointer" title="Laporan Medis">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" />
              <line strokeLinecap="round" strokeWidth="3" x1="12" x2="12" y1="8" y2="8.01" />
              <path d="M11 12h1v4h1" strokeLinecap="round" />
            </svg>
          </a>
        </nav>

        {/* Bottom System/Logout Button */}
        <button className="w-11 h-11 text-blue-200 hover:text-white hover:bg-white/10 rounded-2xl flex items-center justify-center transition-all mt-auto" title="Keluar">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
            <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </aside>
      {/* END: Left Sidebar Navigation */}

      {/* BEGIN: Main Content Area */}
      <div className="flex-1 flex flex-col gap-4 overflow-y-auto custom-scroll pr-1">
        {/* Top Search & Quick Actions Bar */}
        <header className="flex items-center justify-between gap-4" data-purpose="top-header">
          {/* Search Input Pill */}
          <div className="relative flex-1 max-w-xl">
            <span className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-blue-500">
              <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="7" />
                <line strokeLinecap="round" x1="16.5" x2="21" y1="16.5" y2="21" />
              </svg>
            </span>
            <input className="w-full bg-white text-slate-600 text-xs sm:text-sm font-medium rounded-full py-2.5 sm:py-3 pl-5 pr-10 border-0 shadow-card-soft placeholder-slate-400 focus:ring-2 focus:ring-glyde-primary focus:outline-none" placeholder="Cari data, pasien, kebiasaan..." type="text" />
          </div>

          {/* Notification & Quick Settings Icons */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsScannerOpen(true)}
              className="bg-glyde-primary hover:bg-blue-700 text-white text-xs font-bold py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl shadow-card-soft transition-colors flex items-center gap-1.5"
            >
              <Camera size={16} />
              <span className="hidden sm:inline">Scan Makanan</span>
            </button>
            <button onClick={() => setIsNotifOpen(true)} className="w-10 h-10 sm:w-11 sm:h-11 bg-white rounded-2xl shadow-card-soft flex items-center justify-center text-slate-500 hover:text-glyde-primary transition-colors relative" title="Notifikasi Kebiasaan">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-amber-400 rounded-full"></span>
            </button>
            <button className="w-10 h-10 sm:w-11 sm:h-11 bg-white rounded-2xl shadow-card-soft flex items-center justify-center text-slate-500 hover:text-glyde-primary transition-colors" title="Pengaturan Preferensi">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
          </div>
        </header>

        {/* Dashboard Grid: Left (Hero + Metrics + Behavior Ring + Done) & Right (Profile + Calendar) */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 flex-1">
          {/* Left Column: Hero Banner + 3 Sparklines + 2 Bottom Cards (8 cols on XL) */}
          <div className="xl:col-span-8 flex flex-col gap-4">
            {/* BEGIN: Hero Welcome Banner */}
            <section className="relative bg-gradient-to-r from-[#2a55ea] via-[#2f63ee] to-[#3a75f4] rounded-[28px] px-6 sm:px-8 py-6 text-white overflow-hidden shadow-md" data-purpose="hero-banner">
              <div className="hero-glow absolute inset-0 pointer-events-none"></div>

              {/* Floating Micro Elements / Badges Background */}
              <div className="absolute right-48 top-4 opacity-70">
                <svg className="w-6 h-6 text-white/40" fill="currentColor" viewBox="0 0 24 24"><path d="M4.5 12.75l6 6 9-13.5" /></svg>
              </div>
              <div className="absolute right-72 bottom-5 opacity-60">
                <span className="inline-block w-3 h-3 rounded-full bg-blue-300"></span>
              </div>
              <div className="absolute right-12 top-6 bg-white/15 backdrop-blur-sm p-1.5 rounded-lg">
                <span className="text-[10px] font-semibold text-white/90">HbA1c ~ 5.4%</span>
              </div>

              {/* Content Area */}
              <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="max-w-md">
                  {/* Timestamp Pill */}
                  <div className="inline-flex items-center gap-1.5 bg-black/15 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-medium text-blue-100 tracking-wide mb-3.5">
                    <svg className="w-3.5 h-3.5 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect height="18" rx="2" strokeLinecap="round" width="18" x="3" y="4" />
                      <line strokeLinecap="round" x1="16" x2="16" y1="2" y2="6" />
                      <line strokeLinecap="round" x1="8" x2="8" y1="2" y2="6" />
                      <line strokeLinecap="round" x1="3" x2="21" y1="10" y2="10" />
                    </svg>
                    <span>24 Nov 2024 • 10:30 WIB</span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-1">
                    Selamat Pagi, dr. Nicholls!
                  </h1>
                  <p className="text-xs sm:text-sm text-blue-100/90 font-normal">
                    Evaluasi Risiko Perilaku & Metabolisme Pekan Ini
                  </p>
                </div>

                {/* Vector Doctor Illustration */}
                <div className="relative self-end sm:self-center shrink-0 w-36 sm:w-44 h-32 sm:h-36 flex items-end justify-center">
                  <svg className="w-full h-full drop-shadow-lg" fill="none" viewBox="0 0 160 140" xmlns="http://www.w3.org/2000/svg">
                    <path d="M40 140V105C40 96 46 88 55 86L70 82V96H90V82L105 86C114 88 120 96 120 105V140H40Z" fill="#F8FAFC" />
                    <path d="M70 82L80 96L90 82H70Z" fill="#3B82F6" />
                    <path d="M76 96H84V140H76V96Z" fill="#E2E8F0" />
                    <rect fill="#FBD5B5" height="18" rx="3" width="14" x="73" y="66" />
                    <ellipse cx="80" cy="52" fill="#FBD5B5" rx="18" ry="21" />
                    <path d="M62 48C62 36 70 30 80 30C90 30 98 36 98 48C98 43 95 38 88 38C82 38 80 41 75 41C70 41 65 42 62 48Z" fill="#1E293B" />
                    <circle cx="74" cy="51" fill="#334155" r="2" />
                    <circle cx="86" cy="51" fill="#334155" r="2" />
                    <path d="M76 58C78 61 82 61 84 58" stroke="#E28766" strokeLinecap="round" strokeWidth="1.8" />
                    <path d="M68 84C68 96 74 104 80 104C86 104 92 96 92 84" stroke="#64748B" strokeLinecap="round" strokeWidth="2.5" />
                    <circle cx="80" cy="107" fill="#94A3B8" r="4.5" stroke="#475569" strokeWidth="1.5" />
                    <rect fill="#FFFFFF" fillOpacity="0.25" height="18" rx="5" width="18" x="12" y="38" />
                    <path d="M21 43V51M17 47H25" stroke="#FFFFFF" strokeLinecap="round" strokeWidth="2.5" />
                    <rect fill="#FFFFFF" fillOpacity="0.3" height="19" rx="3" width="16" x="128" y="70" />
                    <path d="M144 75H147C148.5 75 149 76 149 78C149 80 148.5 81 147 81H144" stroke="#FFFFFF" strokeWidth="1.8" />
                  </svg>
                </div>
              </div>
            </section>
            {/* END: Hero Welcome Banner */}

            {/* BEGIN: Middle Metric Cards (3 Sparkline Cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" data-purpose="behavior-metric-cards">
              {/* Metric 1: Aktivitas Fisik */}
              <article className="bg-white rounded-[24px] p-4 sm:p-5 shadow-card-soft flex flex-col justify-between relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Aktivitas Fisik</span>
                  <button aria-label="Menu Opsi" className="text-slate-300 hover:text-slate-500">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><circle cx="5" cy="10" r="1.5" /><circle cx="10" cy="10" r="1.5" /><circle cx="15" cy="10" r="1.5" /></svg>
                  </button>
                </div>
                <div className="flex items-end justify-between gap-2 mt-1">
                  <div className="w-20 h-10 shrink-0">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 80 40">
                      <path d="M0,15 Q 15,5 25,28 T 50,22 T 80,35" fill="none" stroke="#f87171" strokeLinecap="round" strokeWidth="2.5" />
                      <circle cx="80" cy="35" fill="#f87171" r="3.5" />
                    </svg>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-slate-800 leading-none">40 <span className="text-xs font-semibold text-slate-400">menit</span></div>
                    <div className="text-[11px] text-slate-400 mt-1">rata-rata / hari</div>
                  </div>
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-50 flex items-center justify-between">
                  <span className="inline-flex items-center text-[10px] font-semibold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">
                    -15% vs target WHO
                  </span>
                  <span className="text-[10px] text-slate-400">Sedentari</span>
                </div>
              </article>

              {/* Metric 2: Konsumsi Gula / SSBs */}
              <article className="bg-white rounded-[24px] p-4 sm:p-5 shadow-card-soft flex flex-col justify-between relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Konsumsi Gula / SSBs</span>
                  <button aria-label="Menu Opsi" className="text-slate-300 hover:text-slate-500">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><circle cx="5" cy="10" r="1.5" /><circle cx="10" cy="10" r="1.5" /><circle cx="15" cy="10" r="1.5" /></svg>
                  </button>
                </div>
                <div className="flex items-end justify-between gap-2 mt-1">
                  <div className="w-20 h-10 shrink-0">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 80 40">
                      <path d="M0,35 Q 25,32 40,25 T 65,12 T 80,8" fill="none" stroke="#10b981" strokeLinecap="round" strokeWidth="2.5" />
                      <circle cx="80" cy="8" fill="#10b981" r="3.5" />
                    </svg>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-slate-800 leading-none">4x <span className="text-xs font-semibold text-slate-400">/ pekan</span></div>
                    <div className="text-[11px] text-slate-400 mt-1">minuman manis</div>
                  </div>
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-50 flex items-center justify-between">
                  <span className="inline-flex items-center text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    +12% batas aman
                  </span>
                  <span className="text-[10px] text-slate-400">Tinggi</span>
                </div>
              </article>

              {/* Metric 3: Skor Risiko Perilaku */}
              <article className="bg-white rounded-[24px] p-4 sm:p-5 shadow-card-soft flex flex-col justify-between relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Skor Risiko Perilaku</span>
                  <button aria-label="Menu Opsi" className="text-slate-300 hover:text-slate-500">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><circle cx="5" cy="10" r="1.5" /><circle cx="10" cy="10" r="1.5" /><circle cx="15" cy="10" r="1.5" /></svg>
                  </button>
                </div>
                <div className="flex items-end justify-between gap-2 mt-1">
                  <div className="w-20 h-10 shrink-0 flex items-center">
                    <div className="w-full relative">
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-glyde-primary h-full rounded-full" style={{ width: '58%' }}></div>
                      </div>
                      <div className="absolute -top-1 left-[58%] -translate-x-1/2 w-3.5 h-3.5 bg-glyde-primary ring-2 ring-white rounded-full shadow"></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-slate-800 leading-none">58 <span className="text-xs font-semibold text-slate-400">/ 100 pt</span></div>
                    <div className="text-[11px] text-slate-400 mt-1">indeks risiko</div>
                  </div>
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-50 flex items-center justify-between">
                  <span className="inline-flex items-center text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                    Kategori Sedang
                  </span>
                  <span className="text-[10px] text-slate-400">Perlu Pantau</span>
                </div>
              </article>
            </div>
            {/* END: Middle Metric Cards */}

            {/* BEGIN: Bottom Analytics (Ring Chart & Interventions Done) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card 1: Multi-colored Donut Behavior Ring */}
              <article className="bg-white rounded-[26px] p-5 sm:p-6 shadow-card-soft flex flex-col justify-between" data-purpose="behavior-donut-score">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Skor Risiko Perilaku</h3>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-blue-50 text-glyde-primary px-2.5 py-1 rounded-full cursor-pointer hover:bg-blue-100 transition-colors">
                    Hari Ini
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeWidth="2.5" /></svg>
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 my-auto py-2">
                  <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" fill="none" r="38" stroke="#f1f5f9" strokeWidth="8" />
                      <circle cx="50" cy="50" fill="none" r="38" stroke="#f43f5e" strokeDasharray="238.76" strokeDashoffset="150" strokeLinecap="round" strokeWidth="8.5" />
                      <circle className="opacity-90" cx="50" cy="50" fill="none" r="38" stroke="#fb923c" strokeDasharray="238.76" strokeDashoffset="190" strokeLinecap="round" strokeWidth="8.5" />
                      <circle cx="50" cy="50" fill="none" r="38" stroke="#4f46e5" strokeDasharray="238.76" strokeDashoffset="110" strokeLinecap="round" strokeWidth="8.5" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-2xl font-black text-slate-800 tracking-tight leading-none">58<span className="text-sm font-semibold">%</span></span>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-1">Tingkat Risiko</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2.5 text-xs flex-1 pl-2">
                    <div className="flex items-start justify-between border-b border-slate-50 pb-1.5">
                      <div>
                        <div className="font-extrabold text-slate-800 text-sm">25%</div>
                        <div className="text-[11px] text-slate-400">Minuman Gula (SSBs)</div>
                      </div>
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 mt-1"></span>
                    </div>
                    <div className="flex items-start justify-between border-b border-slate-50 pb-1.5">
                      <div>
                        <div className="font-extrabold text-slate-800 text-sm">20%</div>
                        <div className="text-[11px] text-slate-400">Aktivitas Rendah</div>
                      </div>
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400 mt-1"></span>
                    </div>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-extrabold text-slate-800 text-sm">13%</div>
                        <div className="text-[11px] text-slate-400">Pola Tidur & Stres</div>
                      </div>
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 mt-1"></span>
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-100 flex flex-col gap-2 mt-2">
                  <span className="flex items-center justify-between">
                    <span>Rekomendasi: Kurangi soda & perbanyak langkah</span>
                    <span className="font-semibold text-glyde-primary cursor-pointer hover:underline">Detail</span>
                  </span>
                  <button onClick={() => setIsRiskModalOpen(true)} className="w-full bg-blue-50 hover:bg-blue-100 text-glyde-primary font-bold py-2 rounded-lg transition-colors">
                    Asesmen Ulang Perilaku
                  </button>
                </p>
              </article>

              {/* Card 2: Rencana Intervensi Selesai */}
              <article className="bg-white rounded-[26px] p-5 sm:p-6 shadow-card-soft flex flex-col justify-between" data-purpose="intervention-plans-done">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Rencana Intervensi Selesai</h3>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-blue-50 text-glyde-primary px-2.5 py-1 rounded-full cursor-pointer hover:bg-blue-100 transition-colors">
                    Hari Ini
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeWidth="2.5" /></svg>
                  </span>
                </div>
                <div className="space-y-4 my-auto">
                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-600">Jalan Kaki 30 Menit</span>
                      <span className="text-indigo-600 font-bold">64%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-indigo-600 h-full rounded-full transition-all duration-500" style={{ width: '64%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-600">Air Mineral No-Sugar (2L)</span>
                      <span className="text-rose-400 font-bold">50%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-rose-400 h-full rounded-full transition-all duration-500" style={{ width: '50%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-600">Tidur Teratur (7-8 Jam)</span>
                      <span className="text-pink-500 font-bold">33%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-pink-500 h-full rounded-full transition-all duration-500" style={{ width: '33%' }}></div>
                    </div>
                  </div>
                </div>
                <button className="dashed-btn w-full mt-4 py-2.5 rounded-xl text-blue-600 font-semibold text-xs flex items-center justify-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeLinecap="round" /></svg>
                  <span>+ Tambah Rencana</span>
                </button>
              </article>
            </div>
          </div>
          {/* END: Left Column */}

          {/* BEGIN: Right Column (User Profile Card & My Calendar Schedule) */}
          <div className="xl:col-span-4 flex flex-col gap-4">
            {/* BEGIN: My Profile Card */}
            <section className="bg-white rounded-[26px] overflow-hidden shadow-card-soft" data-purpose="user-profile-card">
              <div className="bg-glyde-primary px-5 py-3.5 flex items-center justify-between text-white">
                <span className="text-xs font-extrabold tracking-wider uppercase">PROFIL SAYA</span>
                <button className="w-7 h-7 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors" title="Edit Profil">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 shrink-0">
                    <div className="w-16 h-16 rounded-full overflow-hidden ring-4 ring-blue-50 shadow-sm bg-slate-100 flex items-center justify-center">
                      <svg className="w-full h-full object-cover" viewBox="0 0 80 80">
                        <rect fill="#E2E8F0" height="80" width="80" />
                        <circle cx="40" cy="30" fill="#FBD5B5" r="16" />
                        <path d="M24 26C24 16 30 12 40 12C50 12 56 16 56 26C56 20 52 16 46 16C40 16 38 18 34 18C30 18 26 20 24 26Z" fill="#334155" />
                        <circle cx="35" cy="30" fill="#334155" r="1.5" />
                        <circle cx="45" cy="30" fill="#334155" r="1.5" />
                        <path d="M37 36C39 38 41 38 43 36" stroke="#E28766" strokeLinecap="round" strokeWidth="1.2" />
                        <path d="M16 80C16 62 25 54 40 54C55 54 64 62 64 80" fill="#2563EB" />
                        <path d="M32 54L40 68L48 54" fill="#FFFFFF" />
                        <path d="M33 58C33 66 36 71 40 71C44 71 47 66 47 58" stroke="#94A3B8" strokeLinecap="round" strokeWidth="1.8" />
                      </svg>
                    </div>
                    <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></span>
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-800 text-base leading-snug">dr. Alisha Nicholls</h2>
                    <div className="inline-flex items-center gap-1.5 mt-0.5">
                      <span className="text-[11px] font-semibold text-glyde-primary uppercase tracking-wide">PENGGUNA AKTIF</span>
                    </div>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <svg className="w-3 h-3 text-slate-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path clipRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" fillRule="evenodd" />
                      </svg>
                      <span>Bottrop, Germany</span>
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-slate-100 text-center">
                  <div className="bg-slate-50/70 p-2 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-medium">Tgl Lahir</span>
                    <span className="text-xs font-black text-slate-800 mt-0.5 block">17.07.86</span>
                  </div>
                  <div className="bg-slate-50/70 p-2 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-medium">Gol. Darah</span>
                    <span className="text-xs font-black text-slate-800 mt-0.5 block">A(II) Rh+</span>
                  </div>
                  <div className="bg-slate-50/70 p-2 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-medium">Status IMT</span>
                    <span className="text-xs font-black text-emerald-600 mt-0.5 block">Normal</span>
                  </div>
                </div>
              </div>
            </section>
            {/* END: My Profile Card */}

            {/* BEGIN: My Calendar Schedule Card */}
            <section className="bg-white rounded-[26px] overflow-hidden shadow-card-soft flex-1 flex flex-col justify-between" data-purpose="calendar-agenda-card">
              <div className="bg-glyde-primary px-5 py-3.5 flex items-center justify-between text-white">
                <span className="text-xs font-extrabold tracking-wider uppercase">KALENDER SAYA</span>
                <div className="relative inline-block">
                  <button className="bg-white/20 hover:bg-white/30 text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 transition-colors">
                    <span>November</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeWidth="2.5" /></svg>
                  </button>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div className="grid grid-cols-7 gap-1 text-center pb-3 border-b border-slate-100" data-purpose="week-day-selector">
                  {[21, 22, 23, 24, 25, 26, 27].map((date, idx) => {
                    const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
                    const isActive = activeDate === date;
                    return (
                      <div key={date} className="flex flex-col items-center cursor-pointer" onClick={() => setActiveDate(date)}>
                        <span className={`text-[10px] uppercase ${isActive ? 'font-bold text-glyde-primary' : 'font-semibold text-slate-400'}`}>
                          {days[idx]}
                        </span>
                        {isActive ? (
                          <span className="text-xs font-extrabold text-white bg-glyde-primary w-6 h-6 rounded-full flex items-center justify-center mt-0.5 shadow-sm shadow-blue-500/40">
                            {date}
                          </span>
                        ) : (
                          <span className="text-xs font-medium text-slate-600 mt-1">
                            {date}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between mt-3 mb-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">HARI INI, 22 NOV</span>
                  <button aria-label="Agenda options" className="text-slate-300 hover:text-slate-500">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><circle cx="5" cy="10" r="1.5" /><circle cx="10" cy="10" r="1.5" /><circle cx="15" cy="10" r="1.5" /></svg>
                  </button>
                </div>
                <div className="space-y-3 custom-scroll max-h-56 overflow-y-auto pr-1 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-semibold text-slate-400 w-14 shrink-0">08:00</span>
                    <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0"></span>
                    <p className="font-medium text-slate-700 truncate">Jalan Cepat 15 Menit Pagi</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-semibold text-slate-400 w-14 shrink-0">12:30</span>
                    <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>
                    <p className="font-medium text-slate-700 truncate">Scan Gula Makanan Siang</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-semibold text-slate-400 w-14 shrink-0">16:00</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                    <p className="font-medium text-slate-700 truncate">Target Air Putih 2L Tercapai</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-semibold text-slate-400 w-14 shrink-0">21:30</span>
                    <span className="w-2 h-2 rounded-full bg-rose-400 shrink-0"></span>
                    <p className="font-medium text-slate-700 truncate">Sleep Routine & No-Screen Time</p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">4 target aktif terdaftar</span>
                  <a className="font-bold text-glyde-primary hover:underline" href="#">Lihat Semua →</a>
                </div>
              </div>
            </section>
            {/* END: My Calendar Schedule Card */}
          </div>
        </div>
      </div>
      <RiskMappingModal isOpen={isRiskModalOpen} onClose={() => setIsRiskModalOpen(false)} />
      <FoodScannerModal isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} />
      <NotificationModal isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
      <GamificationModal isOpen={isBadgeOpen} onClose={() => setIsBadgeOpen(false)} />
      <ReportModal isOpen={isReportOpen} onClose={() => setIsReportOpen(false)} />
    </main>
  );
}

export default App;
