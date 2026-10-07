import { useState, useEffect } from 'react';
import { Camera, MoreVertical, X, Plus } from 'lucide-react';
import { supabase } from './lib/supabase';
import { normalizeInterventionTitle } from './lib/aiService';
import RiskMappingModal from './components/RiskMappingModal';
import FoodScannerModal from './components/FoodScannerModal';
import FoodHistoryModal from './components/FoodHistoryModal';
import NotificationModal from './components/NotificationModal';
import GamificationModal from './components/GamificationModal';
import OnboardingProfileModal from './components/OnboardingProfileModal';
import ReportModal from './components/ReportModal';

function Dashboard() {
  const [activeDate, setActiveDate] = useState(22);
  const [isRiskModalOpen, setIsRiskModalOpen] = useState(false);

  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [, setHistoryRefreshKey] = useState(0);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const [isBadgeOpen, setIsBadgeOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [assessment, setAssessment] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(true);

  
  const [newPlan, setNewPlan] = useState('');
  const [customPlans, setCustomPlans] = useState<any[]>([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        // Fetch profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError || !profileData) {
          setIsProfileModalOpen(true);
          setLoadingData(false);
          return;
        }
        setProfile(profileData);

        // Fetch latest assessment
        const { data: assessmentData, error: assessmentError } = await supabase
          .from('assessments')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (assessmentError || !assessmentData) {
          setIsRiskModalOpen(true);
        } else {
          setAssessment(assessmentData);
        }
        
        // Fetch custom plans
        const { data: plansData } = await supabase
          .from('custom_interventions')
          .select('*')
          .eq('user_id', session.user.id);
        
        if (plansData) {
          setCustomPlans(plansData);
        }

      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoadingData(false);
      }
    };
    
    fetchData();
  }, []);

  const handleAddPlan = async () => {
    if (!newPlan.trim()) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      
      const finalTitle = await normalizeInterventionTitle(newPlan);

      const plan = { user_id: session.user.id, title: finalTitle, completed: false };
      const { data, error } = await supabase.from('custom_interventions').insert([plan]).select().single();
      
      if (!error && data) {
        setCustomPlans([...customPlans, data]);
        setNewPlan('');
      }
    } catch (err) { 
      console.error(err); 
    }
  };

  if (loadingData) return <div className="flex h-screen items-center justify-center">Memuat Dashboard...</div>;

  const riskScore = assessment?.risk_score || 58;

  
  const riskColor = riskScore >= 70 ? 'bg-rose-500' : riskScore >= 40 ? 'bg-amber-500' : 'bg-emerald-500';
  const riskText = riskScore >= 70 ? 'text-rose-600' : riskScore >= 40 ? 'text-amber-600' : 'text-emerald-600';
  const riskBg = riskScore >= 70 ? 'bg-rose-50' : riskScore >= 40 ? 'bg-amber-50' : 'bg-emerald-50';
  const riskLabel = riskScore >= 70 ? 'Kategori Tinggi' : riskScore >= 40 ? 'Kategori Sedang' : 'Kategori Rendah';

  const breakdownSugar = Math.round(riskScore * 0.43);
  const breakdownActivity = Math.round(riskScore * 0.35);
  const breakdownSleep = riskScore - breakdownSugar - breakdownActivity;
  
  const mainRecommendation = assessment?.interventions?.[0]?.title || 'Kurangi soda & perbanyak langkah';
  return (
    <div className="w-full h-screen overflow-hidden flex items-center justify-center p-2 sm:p-4 lg:p-8 relative">
      <main className="w-full max-w-[1380px] h-full bg-glyde-lightBlue/90 backdrop-blur-md p-3 sm:p-5 lg:p-6 flex flex-col lg:flex-row gap-4 relative overflow-hidden rounded-[28px] lg:rounded-[38px] shadow-lg border border-white/50 z-10" data-purpose="dashboard-container">
      
      {/* Massive Overlay Watermark */}
      <div className="fixed inset-0 pointer-events-none flex flex-col items-center justify-center z-[100] overflow-hidden opacity-40">
        <div className="flex flex-col items-center justify-center -rotate-[35deg]">
          <h1 className="text-[5rem] sm:text-[7rem] lg:text-[10rem] font-black text-slate-800/50 whitespace-nowrap leading-none drop-shadow-md">
            Z & H For Ever
          </h1>
          <h2 className="text-[3rem] sm:text-[4rem] lg:text-[6rem] font-extrabold text-slate-800/50 whitespace-nowrap mt-2 drop-shadow-md">
            Rp138.000
          </h2>
        </div>
      </div>

      {/* BEGIN: Left Sidebar Navigation */}
      <aside className="w-full lg:w-[86px] bg-glyde-sidebar rounded-[24px] lg:rounded-[28px] py-4 px-6 lg:py-6 lg:px-3 flex lg:flex-col items-center justify-between shadow-lg shadow-blue-500/20 shrink-0 z-20" data-purpose="primary-sidebar">
        {/* Brand Logo Wordmark */}
        <div className="flex flex-row lg:flex-col items-center gap-1">
          <a className="text-white font-extrabold text-2xl lg:text-xl tracking-tight leading-none text-center" href="#">
            GLYDE
          </a>
          <span className="w-1.5 h-1.5 bg-sky-300 rounded-full hidden lg:block"></span>
        </div>

        {/* Mobile Menu Button (3 dots) */}
        <button 
          className="lg:hidden text-white p-2 hover:bg-white/10 rounded-xl transition-colors"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <MoreVertical size={24} />
        </button>

        {/* Center Nav Icons (Desktop) */}
        <nav aria-label="Main Navigation" className="hidden lg:flex flex-col items-center justify-center gap-4 my-auto">
          {/* Active Dashboard Link */}
          <a className="w-12 h-12 bg-white/20 hover:bg-white/30 text-white rounded-2xl flex items-center justify-center transition-all shadow-inner" href="#" title="Dashboard">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
          </a>
          {/* Analytics (Wired to Food Scan History Gallery) */}
          <a onClick={(e) => { e.preventDefault(); setIsHistoryModalOpen(true); }} className="w-11 h-11 text-blue-200 hover:text-white hover:bg-white/10 rounded-2xl flex items-center justify-center transition-all cursor-pointer" title="Riwayat Foto Makanan & Analisis">
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

        {/* Bottom System/Logout Button (Desktop) */}
        <button 
          onClick={async () => { await supabase.auth.signOut(); window.location.href = '/'; }}
          className="hidden lg:flex w-11 h-11 text-blue-200 hover:text-white hover:bg-white/10 rounded-2xl items-center justify-center transition-all mt-auto" 
          title="Keluar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
            <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </aside>
      {/* END: Left Sidebar Navigation */}

      {/* Mobile Drawer Navigation */}
      <div className={`fixed inset-0 z-50 lg:hidden ${isMobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        {/* Backdrop Fade */}
        <div 
          className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsMobileMenuOpen(false)}
        />
        
        {/* Slide-in Drawer */}
        <div className={`absolute top-0 right-0 bottom-0 w-64 bg-glyde-sidebar shadow-2xl p-6 flex flex-col transition-transform duration-300 ease-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex items-center justify-between text-white mb-10">
            <span className="font-extrabold text-xl tracking-tight">Menu</span>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
              <X size={24} />
            </button>
          </div>
          
          <nav className="flex flex-col gap-2">
            <a href="#" className="flex items-center gap-4 text-white bg-white/20 p-4 rounded-2xl">
              <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg>
              <span className="font-bold text-sm">Dashboard</span>
            </a>
            <a onClick={(e) => { e.preventDefault(); setIsMobileMenuOpen(false); setIsHistoryModalOpen(true); }} className="flex items-center gap-4 text-blue-200 hover:text-white hover:bg-white/10 p-4 rounded-2xl transition-all cursor-pointer">
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <span className="font-bold text-sm">Riwayat Foto Makanan</span>
            </a>


            <a onClick={(e) => { e.preventDefault(); setIsMobileMenuOpen(false); setIsNotifOpen(true); }} className="flex items-center gap-4 text-blue-200 hover:text-white hover:bg-white/10 p-4 rounded-2xl transition-all cursor-pointer">
              <div className="relative shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full"></span>
              </div>
              <span className="font-bold text-sm">Peringatan</span>
            </a>
            <a onClick={(e) => { e.preventDefault(); setIsMobileMenuOpen(false); setIsBadgeOpen(true); }} className="flex items-center gap-4 text-blue-200 hover:text-white hover:bg-white/10 p-4 rounded-2xl transition-all cursor-pointer">
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><rect height="18" rx="2" strokeLinecap="round" width="18" x="3" y="4" /><line strokeLinecap="round" x1="16" x2="16" y1="2" y2="6" /><line strokeLinecap="round" x1="8" x2="8" y1="2" y2="6" /><line strokeLinecap="round" x1="3" x2="21" y1="10" y2="10" /><circle cx="8" cy="14" fill="currentColor" r="1" /><circle cx="12" cy="14" fill="currentColor" r="1" /><circle cx="16" cy="14" fill="currentColor" r="1" /></svg>
              <span className="font-bold text-sm">Pencapaian</span>
            </a>
            <a onClick={(e) => { e.preventDefault(); setIsMobileMenuOpen(false); setIsScannerOpen(true); }} className="flex items-center gap-4 text-blue-200 hover:text-white hover:bg-white/10 p-4 rounded-2xl transition-all cursor-pointer">
              <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24"><rect height="7" rx="1.5" width="7" x="3" y="3" /><rect height="7" rx="1.5" width="7" x="14" y="3" /><rect height="7" rx="1.5" width="7" x="3" y="14" /><rect height="7" rx="1.5" width="7" x="14" y="14" /></svg>
              <span className="font-bold text-sm">Food Scanner</span>
            </a>
            <a onClick={(e) => { e.preventDefault(); setIsMobileMenuOpen(false); setIsReportOpen(true); }} className="flex items-center gap-4 text-blue-200 hover:text-white hover:bg-white/10 p-4 rounded-2xl transition-all cursor-pointer">
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><line strokeLinecap="round" strokeWidth="3" x1="12" x2="12" y1="8" y2="8.01" /><path d="M11 12h1v4h1" strokeLinecap="round" /></svg>
              <span className="font-bold text-sm">Laporan Medis</span>
            </a>
          </nav>
          
          <button 
            onClick={async () => { await supabase.auth.signOut(); window.location.href = '/'; }}
            className="flex items-center gap-4 text-blue-200 hover:text-white hover:bg-white/10 p-4 rounded-2xl transition-all mt-auto"
          >
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <span className="font-bold text-sm">Keluar</span>
          </button>
        </div>
      </div>

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
            <input className="w-full bg-white text-slate-600 text-xs sm:text-sm font-medium rounded-full py-2.5 sm:py-3 pl-5 pr-10 border-2 border-transparent shadow-card-soft placeholder-slate-400 focus:border-glyde-primary focus:outline-none" placeholder="Cari data, pasien, kebiasaan..." type="text" />
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
                    Halo, {profile?.name?.split(' ')[0] || 'Pengguna'}!
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
                      <path d="M0,25 C10,25 15,10 25,10 C35,10 40,35 50,35 C60,35 65,15 75,15" fill="none" stroke="#f43f5e" strokeLinecap="round" strokeWidth="2.5" />
                      <circle cx="75" cy="15" fill="#f43f5e" r="3.5" />
                    </svg>
                  </div>
                  <div className="text-right">
                    <div className="text-base sm:text-lg font-black text-slate-800 leading-tight">{assessment?.physical_activity || '-'}</div>
                    <div className="text-[11px] text-slate-400 mt-1">Frekuensi</div>
                  </div>
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-50 flex items-center justify-between">
                  <span className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full ${assessment?.physical_activity === 'Tidak pernah' ? 'text-rose-500 bg-rose-50' : 'text-emerald-600 bg-emerald-50'}`}>
                    {assessment?.physical_activity === 'Tidak pernah' ? 'Sangat Kurang' : 'Tercatat'}
                  </span>
                  <span className="text-[10px] text-slate-400">Gaya Hidup</span>
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
                    <div className="text-base sm:text-lg font-black text-slate-800 leading-tight" title={assessment?.sugar_intake}>{assessment?.sugar_intake || '-'}</div>
                    <div className="text-[11px] text-slate-400 mt-1">minuman manis</div>
                  </div>
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-50 flex items-center justify-between">
                  <span className="inline-flex items-center text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {assessment?.sugar_intake?.includes('>') ? 'Berlebih' : 'Tercatat'}
                  </span>
                  <span className="text-[10px] text-slate-400">Pantau</span>
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
                        <div className={`${riskColor} h-full rounded-full transition-all duration-1000`} style={{ width: `${riskScore}%` }}></div>
                      </div>
                      <div className={`absolute -top-1 -translate-x-1/2 w-3.5 h-3.5 ${riskColor} ring-2 ring-white rounded-full shadow transition-all duration-1000`} style={{ left: `${riskScore}%` }}></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-slate-800 leading-none">{riskScore} <span className="text-xs font-semibold text-slate-400">/ 100 pt</span></div>
                    <div className="text-[11px] text-slate-400 mt-1">indeks risiko</div>
                  </div>
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-50 flex items-center justify-between">
                  <span className={`inline-flex items-center text-[10px] font-semibold ${riskText} ${riskBg} px-2 py-0.5 rounded-full`}>
                    {riskLabel}
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
                  <select className="bg-blue-50 text-glyde-primary border-none rounded-full px-2.5 py-1 text-[11px] font-semibold cursor-pointer outline-none">
                    <option>Hari Ini</option>
                    <option>7 Hari Terakhir</option>
                    <option>30 Hari Terakhir</option>
                  </select>
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
                      <span className="text-2xl font-black text-slate-800 tracking-tight leading-none">{riskScore}<span className="text-sm font-semibold">%</span></span>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-1">Tingkat Risiko</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2.5 text-xs flex-1 pl-2">
                    <div className="flex items-start justify-between border-b border-slate-50 pb-1.5">
                      <div>
                        <div className="font-extrabold text-slate-800 text-sm">{breakdownSugar}%</div>
                        <div className="text-[11px] text-slate-400">Minuman Gula (SSBs)</div>
                      </div>
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 mt-1"></span>
                    </div>
                    <div className="flex items-start justify-between border-b border-slate-50 pb-1.5">
                      <div>
                        <div className="font-extrabold text-slate-800 text-sm">{breakdownActivity}%</div>
                        <div className="text-[11px] text-slate-400">Aktivitas Rendah</div>
                      </div>
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400 mt-1"></span>
                    </div>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-extrabold text-slate-800 text-sm">{breakdownSleep}%</div>
                        <div className="text-[11px] text-slate-400">Pola Tidur & Stres</div>
                      </div>
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 mt-1"></span>
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-100 flex flex-col gap-2 mt-2">
                  <span className="flex items-center justify-between">
                    <span className="truncate pr-2">Rekomendasi: {mainRecommendation}</span>
                    <span className="font-semibold text-glyde-primary cursor-pointer hover:underline shrink-0">Detail</span>
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
                  <select className="bg-blue-50 text-glyde-primary border-none rounded-full px-2.5 py-1 text-[11px] font-semibold cursor-pointer outline-none">
                    <option>Hari Ini</option>
                    <option>7 Hari Terakhir</option>
                    <option>30 Hari Terakhir</option>
                  </select>
                </div>
                <div className="space-y-4 my-auto flex-1 mt-4">
                  {assessment?.interventions ? (
                    assessment.interventions.map((inv: any, idx: number) => (
                      <div key={idx}>
                        <div className="flex items-center justify-between text-xs font-semibold mb-1">
                          <span className="text-slate-600">{inv.title}</span>
                          <span className="text-indigo-600 font-bold">{inv.completed ? '100%' : '0%'}</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-4">
                          <div className={`h-full rounded-full transition-all duration-500 ${inv.completed ? 'w-full bg-emerald-500' : 'w-[5%] bg-indigo-600'}`}></div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-xs text-slate-400 py-4">Belum ada intervensi.</div>
                  )}

                  {/* Custom Plans */}
                  {customPlans.map((plan: any) => (
                    <div key={plan.id}>
                      <div className="flex items-center justify-between text-xs font-semibold mb-1">
                        <span className="text-slate-600">{plan.title}</span>
                        <span className="text-emerald-600 font-bold">Custom</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-4">
                        <div className={`h-full rounded-full transition-all duration-500 ${plan.completed ? 'w-full bg-emerald-500' : 'w-[0%] bg-emerald-500'}`}></div>
                      </div>
                    </div>
                  ))}

                  <div className="mt-4 flex gap-2 w-full">
                    <input 
                      type="text" 
                      value={newPlan}
                      onChange={(e) => setNewPlan(e.target.value)}
                      placeholder="Tambah kustom..." 
                      className="flex-1 bg-slate-50 border border-dashed border-blue-200 rounded-lg p-2 text-xs font-bold text-blue-500 outline-none focus:border-blue-400"
                    />
                    <button onClick={handleAddPlan} className="bg-glyde-primary hover:bg-blue-700 text-white p-2 rounded-lg shadow-sm shadow-blue-500/30 flex items-center justify-center shrink-0">
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
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
                    <h2 className="font-bold text-slate-800 text-base leading-snug">{profile?.name || 'Pengguna'}</h2>
                    <div className="inline-flex items-center gap-1.5 mt-0.5">
                      <span className="text-[11px] font-semibold text-glyde-primary uppercase tracking-wide">PENGGUNA AKTIF</span>
                    </div>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <svg className="w-3 h-3 text-slate-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path clipRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" fillRule="evenodd" />
                      </svg>
                      <span>Indonesia</span>
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-slate-100 text-center">
                  <div className="bg-slate-50/70 p-2 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-medium">Usia</span>
                    <span className="text-xs font-black text-slate-800 mt-0.5 block">{profile?.age ? profile.age + ' thn' : '-'}</span>
                  </div>
                  <div className="bg-slate-50/70 p-2 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-medium">Gender</span>
                    <span className="text-xs font-black text-slate-800 mt-0.5 block">{profile?.gender || '-'}</span>
                  </div>
                  <div className="bg-slate-50/70 p-2 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-medium">Status IMT</span>
                    <span className="text-xs font-black text-emerald-600 mt-0.5 block">
                      {profile?.weight && profile?.height ? (
                        (profile.weight / Math.pow(profile.height / 100, 2)) < 18.5 ? 'Kurang' :
                        (profile.weight / Math.pow(profile.height / 100, 2)) < 24.9 ? 'Normal' : 'Berlebih'
                      ) : '-'}
                    </span>
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
                  {(() => {
                    const combined = [
                      ...(assessment?.interventions || []),
                      ...customPlans
                    ];
                    
                    if (combined.length === 0) {
                      return <div className="text-slate-400 py-4 text-center">Belum ada agenda jadwal hari ini.</div>;
                    }
                    
                    const colors = ['bg-indigo-500', 'bg-blue-500', 'bg-emerald-500', 'bg-rose-400', 'bg-amber-400', 'bg-purple-500'];
                    
                    return combined.map((plan: any, idx: number) => {
                      const hour = 8 + (idx * 3);
                      const timeStr = `${hour < 10 ? '0'+hour : hour}:00`;
                      const color = colors[idx % colors.length];
                      
                      return (
                        <div key={idx} className="flex items-center gap-3">
                          <span className="text-[11px] font-semibold text-slate-400 w-14 shrink-0">{timeStr}</span>
                          <span className={`w-2 h-2 rounded-full ${color} shrink-0`}></span>
                          <p className="font-medium text-slate-700 truncate">{plan.title}</p>
                        </div>
                      );
                    });
                  })()}
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">{(assessment?.interventions?.length || 0) + customPlans.length} target aktif terdaftar</span>
                  <a className="font-bold text-glyde-primary hover:underline" href="#">Lihat Semua →</a>
                </div>
              </div>
            </section>
            {/* END: My Calendar Schedule Card */}

          </div>
        </div>
      </div>
      </main>

      <OnboardingProfileModal isOpen={isProfileModalOpen} onComplete={() => { setIsProfileModalOpen(false); window.location.reload(); }} />
      <RiskMappingModal isOpen={isRiskModalOpen} onClose={() => setIsRiskModalOpen(false)} onComplete={() => { setIsRiskModalOpen(false); window.location.reload(); }} />
      <FoodScannerModal 
        isOpen={isScannerOpen} 
        onClose={() => setIsScannerOpen(false)} 
        onScanComplete={() => { setHistoryRefreshKey(prev => prev + 1); }}
      />

      <FoodHistoryModal 
        isOpen={isHistoryModalOpen} 
        onClose={() => setIsHistoryModalOpen(false)} 
        onOpenScanner={() => { setIsHistoryModalOpen(false); setIsScannerOpen(true); }}
      />
      <NotificationModal isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />

      <GamificationModal isOpen={isBadgeOpen} onClose={() => setIsBadgeOpen(false)} />
      <ReportModal isOpen={isReportOpen} onClose={() => setIsReportOpen(false)} />
    </div>
  );
}

export default Dashboard;
