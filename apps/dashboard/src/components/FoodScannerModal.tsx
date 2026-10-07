import { useState, useEffect, useRef } from 'react';
import { Camera, X, CheckCircle2, RefreshCw, Zap, ShieldAlert } from 'lucide-react';
import ThoughtLine from './ThoughtLine';
import RefineFrame from './RefineFrame';
import { analyzeFoodImageWithGemini } from '../lib/geminiVision';
import type { FoodAnalysisResult } from '../lib/geminiVision';
import { supabase } from '../lib/supabase';

interface FoodScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanComplete?: () => void;
}

export default function FoodScannerModal({ isOpen, onClose, onScanComplete }: FoodScannerModalProps) {
  const [scanState, setScanState] = useState<'camera' | 'confirm' | 'thinking' | 'result'>('camera');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [refineStatus, setRefineStatus] = useState<'generating' | 'refining' | 'complete' | 'error'>('generating');

  // Thinking state
  const [thinkingSteps, setThinkingSteps] = useState<string[]>([]);
  const [isThinking, setIsThinking] = useState<boolean>(false);

  // Analysis Result & Errors
  const [analysisResult, setAnalysisResult] = useState<FoodAnalysisResult | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      setApiError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Gagal mengakses kamera:", err);
      setApiError("Kamera tidak dapat diakses atau izin ditolak.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  useEffect(() => {
    if (isOpen) {
      setScanState('camera');
      setCapturedImage(null);
      setAnalysisResult(null);
      setApiError(null);
      startCamera();
    } else {
      stopCamera();
    }
  }, [isOpen]);

  // Capture any photo taken by user
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setCapturedImage(dataUrl);
        setScanState('confirm');
        stopCamera();
      }
    }
  };

  // Progressive thinking steps logic
  const ALL_STEPS = [
    'Memeriksa integritas objek foto...',
    'Mengirimkan data foto ke Gemini Vision AI...',
    'Memverifikasi apakah objek adalah makanan/minuman valid...',
    'Mendeteksi komposisi gula & indeks glikemik...',
    'Menyiapkan rekomendasi medis penderita diabetes...'
  ];

  useEffect(() => {
    if (isThinking) {
      setThinkingSteps([ALL_STEPS[0]]);
      let currentStep = 0;
      
      const interval = setInterval(() => {
        currentStep++;
        if (currentStep < ALL_STEPS.length) {
          setThinkingSteps(prev => [...prev, ALL_STEPS[currentStep]]);
        } else {
          clearInterval(interval);
        }
      }, 1500); // add a new step every 1.5s
      
      return () => clearInterval(interval);
    }
  }, [isThinking]);

  // AI Verification & Processing on Process Button click
  const handleConfirmAndProcess = async () => {
    if (!capturedImage) return;

    setScanState('thinking');
    setIsThinking(true);
    setRefineStatus('generating');
    setApiError(null);
    setThinkingSteps([]); // Clear initially, useEffect will populate it

    try {
      setTimeout(() => setRefineStatus('refining'), 800);

      const result = await analyzeFoodImageWithGemini(capturedImage);
      
      // Validasi ketat: Jika objek bukan makanan/minuman, jangan tampilkan hasil nol & jangan simpan ke DB!
      const foodName = (result.food_name || '').toLowerCase();
      const isFoodInvalid = !result 
        || result.is_food === false 
        || foodName.includes('bukan makanan') 
        || foodName.includes('tidak terdeteksi')
        || foodName.includes('tidak teridentifikasi')
        || foodName.includes('tidak diketahui')
        || (result.calories === 0 && result.carbs_grams === 0 && result.protein_grams === 0);
      
      if (isFoodInvalid) {
        setIsThinking(false);
        setRefineStatus('error');
        setApiError("Foto ini tidak terdeteksi sebagai makanan atau minuman valid. Harap pastikan objek makanan/minuman terlihat jelas pada foto lalu ambil foto ulang.");
        setScanState('confirm');
        return;
      }

      setRefineStatus('complete');
      setAnalysisResult(result);
      setIsThinking(false);
      setScanState('result');

      // Simpan ke database Supabase HANYA jika valid terdeteksi sebagai makanan
      await saveScanToDatabase(result, capturedImage);

    } catch (err: any) {
      console.error("Analysis Failed:", err);
      setIsThinking(false);
      setRefineStatus('error');
      setApiError(err?.message || "Gagal memproses gambar dengan Gemini Vision API. Harap periksa koneksi internet.");
      setScanState('confirm');
    }
  };

  const saveScanToDatabase = async (result: FoodAnalysisResult, imageBase64: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const scanData = {
        user_id: session.user.id,
        image_url: imageBase64,
        food_name: result.food_name || 'Makanan Terdeteksi',
        food_type: result.food_type || 'Makanan',
        is_food: result.is_food ?? true,
        sugar_grams: result.sugar_grams || 0,
        glycemic_index: result.glycemic_index || 0,
        calories: result.calories || 0,
        carbs_grams: result.carbs_grams || 0,
        protein_grams: result.protein_grams || 0,
        fat_grams: result.fat_grams || 0,
        safety_level: result.safety_level || 'Waspada',
        recommendation: result.recommendation || '',
        portion_advice: result.portion_advice || '',
        spike_warning: result.spike_warning || '',
        ingredients: result.ingredients || [],
        detailed_analysis: result
      };

      const { error } = await supabase.from('food_scans').insert([scanData]);
      if (!error && onScanComplete) {
        onScanComplete();
      }
    } catch (err) {
      console.error("Error saving to database:", err);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setAnalysisResult(null);
    setApiError(null);
    setScanState('camera');
    startCamera();
  };

  const handleCloseModal = () => {
    stopCamera();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden relative border border-slate-100 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 shrink-0 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-blue-50 text-glyde-primary flex items-center justify-center">
              <Camera size={20} />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-800 text-base sm:text-lg leading-tight">Pemindai Makanan & Gula AI</h2>
              <p className="text-[11px] font-medium text-slate-400">Gemini Vision Multi-Model • Supabase Cloud DB</p>
            </div>
          </div>
          <button onClick={handleCloseModal} className="p-2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Warning / Error Banner */}
        {apiError && (
          <div className="bg-rose-50 border-b border-rose-200 px-5 py-3 flex items-start gap-3 shrink-0 animate-in slide-in-from-top duration-300">
            <ShieldAlert size={20} className="text-rose-600 shrink-0 mt-0.5" />
            <div className="text-xs text-rose-800 flex-1 font-medium leading-relaxed">
              <span className="font-bold block text-rose-900 mb-0.5">Peringatan Verifikasi Makanan:</span>
              {apiError}
            </div>
            <button onClick={() => setApiError(null)} className="text-rose-400 hover:text-rose-700">
              <X size={14} />
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto custom-scroll flex-1">

          {/* STEP 1: CAMERA PREVIEW (Clean view for capturing any photo) */}
          {scanState === 'camera' && (
            <div className="flex flex-col items-center">
              {/* Steady Camera Frame */}
              <div className="w-full aspect-[4/3] bg-slate-950 rounded-3xl relative overflow-hidden flex items-center justify-center border-4 border-glyde-primary/80 shadow-xl">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <canvas ref={canvasRef} className="hidden" />

                {/* Viewfinder Frame */}
                <div className="absolute inset-10 border-2 border-dashed border-white/40 rounded-2xl pointer-events-none flex items-center justify-center">
                  <div className="w-12 h-12 border-2 border-white/60 rounded-full flex items-center justify-center animate-ping opacity-25"></div>
                </div>

                {/* Bottom Helper Instruction */}
                <div className="absolute bottom-4 left-4 right-4 text-center z-10">
                  <span className="bg-slate-900/80 backdrop-blur-md text-slate-200 text-xs font-semibold px-4 py-2 rounded-full border border-white/10 shadow-lg inline-block">
                    Arahkan kamera ke makanan/minuman lalu tekan Ambil Foto
                  </span>
                </div>
              </div>

              {/* Action Capture Button */}
              <div className="w-full mt-5">
                <button 
                  onClick={capturePhoto}
                  className="w-full bg-glyde-primary hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer scale-100 hover:scale-[1.01]"
                >
                  <Camera size={18} />
                  <span>Ambil Foto Makanan</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: CONFIRM PHOTO */}
          {scanState === 'confirm' && capturedImage && (
            <div className="flex flex-col items-center animate-in zoom-in-95 duration-200">
              <div className="w-full aspect-[4/3] bg-slate-900 rounded-3xl relative overflow-hidden border-2 border-glyde-primary shadow-xl mb-4">
                <img src={capturedImage} alt="Captured food" className="w-full h-full object-cover" />
                <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md text-blue-300 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-blue-400/30">
                  <CheckCircle2 size={14} /> Foto Siap Diinkuisisi AI
                </div>
              </div>

              <div className="w-full bg-blue-50/70 border border-blue-100 rounded-2xl p-4 mb-5 text-xs text-slate-700">
                <span className="font-bold text-glyde-primary block mb-1">Konfirmasi Foto Makanan:</span>
                Tekan tombol di bawah untuk memverifikasi apakah foto merupakan makanan/minuman valid dan mengekstrak 10+ indikator nutrisi & gula darah.
              </div>

              <div className="flex gap-3 w-full">
                <button 
                  onClick={handleRetake}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 rounded-2xl transition-all flex items-center justify-center gap-1.5 text-xs sm:text-sm"
                >
                  <RefreshCw size={16} /> Foto Ulang
                </button>
                <button 
                  onClick={handleConfirmAndProcess}
                  className="flex-2 bg-glyde-primary hover:bg-blue-700 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-1.5 text-xs sm:text-sm"
                >
                  <Zap size={16} /> Proses & Analisis AI
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: THINKING ANIMATION & REFINEFRAME */}
          {scanState === 'thinking' && (
            <div className="flex flex-col items-center py-4 animate-in fade-in duration-300 space-y-5">
              <div className="w-full flex justify-center">
                <RefineFrame
                  status={refineStatus}
                  aspectRatio="4 / 3"
                  width={340}
                  radius={24}
                  background="#0f172a"
                  color="#38bdf8"
                  stageDuration={400}
                  sweep={true}
                  showStatus={true}
                  hideAfter={1200}
                >
                  {capturedImage && (
                    <img src={capturedImage} alt="Food scan frame" className="w-full h-full object-cover" />
                  )}
                </RefineFrame>
              </div>

              <div className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col items-center">
                <ThoughtLine
                  working={isThinking}
                  steps={thinkingSteps}
                  label="Sedang Verifikasi Objek & Menganalisis Makanan…"
                  doneLabel="Analisis Gemini Vision Selesai Dalam"
                  glyph="sparkle"
                  fontSize={15}
                  breathPeriod={1.6}
                  breathDepth={0.45}
                  settleDuration={350}
                  settleBlur={2}
                  collapsible={false}
                  collapseOnSettle={false}
                  showTimer={true}
                />
              </div>
            </div>
          )}

          {/* STEP 4: ANALYSIS RESULT */}
          {scanState === 'result' && analysisResult && (
            <div className="flex flex-col animate-in zoom-in-95 duration-300 space-y-4">
              <div className={`rounded-3xl p-5 border text-center relative overflow-hidden ${
                analysisResult.safety_level === 'Aman' ? 'bg-emerald-50 border-emerald-200 text-emerald-950' :
                analysisResult.safety_level === 'Bahaya' ? 'bg-rose-50 border-rose-200 text-rose-950' :
                'bg-amber-50 border-amber-200 text-amber-950'
              }`}>
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                    analysisResult.safety_level === 'Aman' ? 'bg-emerald-200 text-emerald-800' :
                    analysisResult.safety_level === 'Bahaya' ? 'bg-rose-200 text-rose-800' :
                    'bg-amber-200 text-amber-800'
                  }`}>
                    {analysisResult.food_type || 'Makanan'} • Level {analysisResult.safety_level}
                  </span>
                </div>
                
                <h3 className="font-extrabold text-xl sm:text-2xl text-slate-800">{analysisResult.food_name}</h3>
                
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="bg-white/80 rounded-2xl p-3 shadow-sm border border-black/5 text-center">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Estimasi Gula</span>
                    <span className="text-2xl font-black text-rose-600">{analysisResult.sugar_grams} <span className="text-xs font-semibold">gram</span></span>
                  </div>
                  <div className="bg-white/80 rounded-2xl p-3 shadow-sm border border-black/5 text-center">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Indeks Glikemik (GI)</span>
                    <span className="text-2xl font-black text-amber-600">{analysisResult.glycemic_index} <span className="text-xs font-semibold">/ 100</span></span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3 text-xs">
                <h4 className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px] border-b border-slate-100 pb-2">
                  10+ Rincian Informasi Nutrisi & Glukosa:
                </h4>

                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-slate-50 p-2 rounded-xl">
                    <span className="text-[10px] font-semibold text-slate-400 block">Kalori</span>
                    <span className="font-extrabold text-slate-800">{analysisResult.calories} kcal</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl">
                    <span className="text-[10px] font-semibold text-slate-400 block">Karbo</span>
                    <span className="font-extrabold text-slate-800">{analysisResult.carbs_grams}g</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl">
                    <span className="text-[10px] font-semibold text-slate-400 block">Protein</span>
                    <span className="font-extrabold text-slate-800">{analysisResult.protein_grams}g</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl">
                    <span className="text-[10px] font-semibold text-slate-400 block">Lemak</span>
                    <span className="font-extrabold text-slate-800">{analysisResult.fat_grams}g</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex justify-between items-start border-b border-slate-50 pb-1.5">
                    <span className="text-slate-500 font-medium">1. Peringatan Lonjakan Gula:</span>
                    <span className="font-bold text-rose-600 text-right max-w-[60%]">{analysisResult.spike_warning || 'Potensi lonjakan gula terpantau.'}</span>
                  </div>

                  <div className="flex justify-between items-start border-b border-slate-50 pb-1.5">
                    <span className="text-slate-500 font-medium">2. Batas Porsi Aman:</span>
                    <span className="font-bold text-slate-800 text-right max-w-[60%]">{analysisResult.portion_advice || 'Gunakan porsi sedang.'}</span>
                  </div>

                  <div className="flex justify-between items-start border-b border-slate-50 pb-1.5">
                    <span className="text-slate-500 font-medium">3. Kepadatan Nutrisi:</span>
                    <span className="font-bold text-blue-600">{analysisResult.nutritional_density || 'Sedang'}</span>
                  </div>

                  <div className="flex justify-between items-start border-b border-slate-50 pb-1.5">
                    <span className="text-slate-500 font-medium">4. Serat Pangan:</span>
                    <span className="font-bold text-emerald-600">{analysisResult.fiber_grams || 1.5} gram</span>
                  </div>

                  <div className="border-b border-slate-50 pb-1.5">
                    <span className="text-slate-500 font-medium block mb-1">5. Komposisi Terdeteksi:</span>
                    <div className="flex flex-wrap gap-1">
                      {(analysisResult.ingredients || ['Nasi', 'Lauk']).map((ing, idx) => (
                        <span key={idx} className="bg-blue-50 text-glyde-primary font-semibold text-[10px] px-2 py-0.5 rounded-md">
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-500 font-medium block mb-1">6. Rekomendasi Dokter & Diet:</span>
                    <p className="bg-slate-50 p-2.5 rounded-xl text-slate-700 font-medium leading-relaxed">
                      {analysisResult.recommendation}
                    </p>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleCloseModal}
                className="w-full bg-glyde-primary hover:bg-blue-700 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-blue-500/30 transition-all text-sm"
              >
                Tutup & Lihat Riwayat Foto
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
