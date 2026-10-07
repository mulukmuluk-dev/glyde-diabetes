import { useState, useEffect } from 'react';
import { X, ArrowRight, Activity, Droplets, Moon, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { calculateRiskScore, type AssessmentInput } from '../lib/aiService';

interface AssessmentState extends AssessmentInput {}


export default function RiskMappingModal({ isOpen, onClose, onComplete }: { isOpen: boolean, onClose: () => void, onComplete?: () => void }) {
  const [step, setStep] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [data, setData] = useState<AssessmentState>({
    activity: '1-2 kali',
    sitting: '4 - 8 jam',
    sugar: '3-4 kali seminggu',
    food: 'Kombinasi (sesekali sayur/buah)',
    sleep: '7 - 8 jam',
    familyHistory: 'Tidak Ada'
  });

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setIsCompleted(false);
      setError('');
    }
  }, [isOpen]);

  const calculateScoreWithAI = async () => {
    try {
      const aiResponse = await calculateRiskScore(data);
      return aiResponse;
    } catch (err: any) {
      console.error("AI Error:", err);
      throw new Error(`Koneksi ke AI Gagal: ${err.message || 'Respons tidak valid.'}`);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const { score, interventions } = await calculateScoreWithAI();
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Anda belum login!");

      const { error: dbError } = await supabase.from('assessments').insert([{
        user_id: session.user.id,
        physical_activity: data.activity,
        sitting_time: data.sitting,
        sugar_intake: data.sugar,
        sleep_pattern: data.sleep,
        risk_score: score,
        interventions: interventions
      }]);

      if (dbError) throw dbError;

      setIsCompleted(true);
      if (onComplete) onComplete();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Gagal menyimpan penilaian. Pastikan Anda sudah menjalankan script SQL di Supabase.');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-[32px] sm:rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100 shrink-0">
          <div>
            <h2 className="font-extrabold text-slate-800 text-lg sm:text-xl">Pemetaan Risiko Perilaku</h2>
            {!isCompleted && <p className="text-sm font-medium text-slate-400">Langkah {step} dari 3</p>}
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 bg-slate-50 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Progress Bar */}
        {!isCompleted && (
          <div className="w-full bg-slate-100 h-1.5 shrink-0">
            <div 
              className="bg-glyde-primary h-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        )}

        {/* Content Area - Scrollable */}
        <div className="p-5 sm:p-8 overflow-y-auto custom-scroll">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 text-rose-600 text-sm font-bold rounded-xl">
              {error}
            </div>
          )}

          {isCompleted ? (
            <div className="flex flex-col items-center justify-center text-center py-8 animate-in zoom-in duration-500">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <CheckCircle2 size={40} className="text-emerald-500" />
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-2">Analisis Selesai!</h3>
              <p className="text-slate-500 font-medium mb-8 max-w-sm">Skor perilaku Anda telah dihitung dan rencana intervensi personal sudah disiapkan di dashboard utama.</p>
              
              <button 
                onClick={onClose}
                className="w-full bg-glyde-primary hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all"
              >
                Lihat Hasil di Dashboard
              </button>
            </div>
          ) : (
            <div className="min-h-[250px]">
              {step === 1 && (
                <div className="animate-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-blue-50 text-blue-500 rounded-xl"><Activity size={24} /></div>
                    <h3 className="text-lg font-bold text-slate-700">Aktivitas Fisik & Gerak</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <label className="block">
                      <span className="text-sm font-semibold text-slate-700 mb-2 block">Berapa hari dalam seminggu Anda berolahraga (min. 30 menit)?</span>
                      <select value={data.activity} onChange={e => setData({...data, activity: e.target.value})} className="w-full bg-slate-50 border-transparent focus:border-glyde-primary focus:ring-2 focus:ring-blue-100 rounded-xl p-3 text-sm font-medium">
                        <option>Tidak pernah</option>
                        <option>1-2 kali</option>
                        <option>3-4 kali</option>
                        <option>Lebih dari 4 kali</option>
                      </select>
                    </label>

                    <label className="block">
                      <span className="text-sm font-semibold text-slate-700 mb-2 block">Rata-rata waktu duduk Anda dalam sehari?</span>
                      <select value={data.sitting} onChange={e => setData({...data, sitting: e.target.value})} className="w-full bg-slate-50 border-transparent focus:border-glyde-primary focus:ring-2 focus:ring-blue-100 rounded-xl p-3 text-sm font-medium">
                        <option>Kurang dari 4 jam</option>
                        <option>4 - 8 jam</option>
                        <option>Lebih dari 8 jam</option>
                      </select>
                    </label>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="animate-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-rose-50 text-rose-500 rounded-xl"><Droplets size={24} /></div>
                    <h3 className="text-lg font-bold text-slate-700">Konsumsi Gula & Makanan</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <label className="block">
                      <span className="text-sm font-semibold text-slate-700 mb-2 block">Seberapa sering mengonsumsi Minuman Berpemanis?</span>
                      <select value={data.sugar} onChange={e => setData({...data, sugar: e.target.value})} className="w-full bg-slate-50 border-transparent focus:border-glyde-primary focus:ring-2 focus:ring-blue-100 rounded-xl p-3 text-sm font-medium">
                        <option>Setiap hari (&gt; 1 kali)</option>
                        <option>Setiap hari (1 kali)</option>
                        <option>3-4 kali seminggu</option>
                        <option>Jarang (1 kali seminggu atau kurang)</option>
                      </select>
                    </label>

                    <label className="block">
                      <span className="text-sm font-semibold text-slate-700 mb-2 block">Kecenderungan pola makan Anda?</span>
                      <select value={data.food} onChange={e => setData({...data, food: e.target.value})} className="w-full bg-slate-50 border-transparent focus:border-glyde-primary focus:ring-2 focus:ring-blue-100 rounded-xl p-3 text-sm font-medium">
                        <option>Banyak gorengan / Makanan cepat saji</option>
                        <option>Kombinasi (sesekali sayur/buah)</option>
                        <option>Sehat (rutin serat & rendah proses)</option>
                      </select>
                    </label>

                    <label className="block">
                      <span className="text-sm font-semibold text-slate-700 mb-2 block">Ceritakan pengalaman/kebiasaan spesifik Anda terkait gula (opsional):</span>
                      <textarea 
                        value={data.sugarExperience || ''} 
                        onChange={e => setData({...data, sugarExperience: e.target.value})} 
                        className="w-full bg-slate-50 border-transparent focus:border-glyde-primary focus:ring-2 focus:ring-blue-100 rounded-xl p-3 text-sm font-medium resize-none h-20"
                        placeholder="Contoh: Saya sering minum es kopi susu kekinian setiap sore..."
                      ></textarea>
                    </label>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="animate-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-indigo-50 text-indigo-500 rounded-xl"><Moon size={24} /></div>
                    <h3 className="text-lg font-bold text-slate-700">Pola Tidur & Keturunan</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <label className="block">
                      <span className="text-sm font-semibold text-slate-700 mb-2 block">Rata-rata durasi tidur malam Anda?</span>
                      <select value={data.sleep} onChange={e => setData({...data, sleep: e.target.value})} className="w-full bg-slate-50 border-transparent focus:border-glyde-primary focus:ring-2 focus:ring-blue-100 rounded-xl p-3 text-sm font-medium">
                        <option>Kurang dari 5 jam</option>
                        <option>5 - 6 jam</option>
                        <option>7 - 8 jam</option>
                        <option>Lebih dari 8 jam</option>
                      </select>
                    </label>

                    <label className="block">
                      <span className="text-sm font-semibold text-slate-700 mb-2 block">Apakah ada riwayat keluarga inti dengan Diabetes?</span>
                      <div className="flex gap-4">
                        <label className="flex-1 flex items-center gap-2 p-3 border border-slate-200 rounded-xl bg-slate-50 cursor-pointer">
                          <input type="radio" checked={data.familyHistory === 'Ya, Ada'} onChange={() => setData({...data, familyHistory: 'Ya, Ada'})} name="family_history" className="text-glyde-primary focus:ring-glyde-primary" />
                          <span className="text-sm font-medium">Ya, Ada</span>
                        </label>
                        <label className="flex-1 flex items-center gap-2 p-3 border border-slate-200 rounded-xl bg-slate-50 cursor-pointer">
                          <input type="radio" checked={data.familyHistory === 'Tidak Ada'} onChange={() => setData({...data, familyHistory: 'Tidak Ada'})} name="family_history" className="text-glyde-primary focus:ring-glyde-primary" />
                          <span className="text-sm font-medium">Tidak Ada</span>
                        </label>
                      </div>
                    </label>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {!isCompleted && (
          <div className="p-5 border-t border-slate-100 shrink-0">
            <button 
              onClick={handleNext}
              disabled={loading}
              className="w-full bg-glyde-primary hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{loading ? 'Memproses...' : step < 3 ? 'Lanjut ke Bagian Berikutnya' : 'Hitung Skor Risiko'}</span>
              {!loading && step < 3 && <ArrowRight size={18} />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
