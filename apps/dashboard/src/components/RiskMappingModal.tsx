import React, { useState } from 'react';
import { X, Activity, Droplets, Moon, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function RiskMappingModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else {
      setIsCompleted(true);
      setTimeout(() => {
        onClose();
        setTimeout(() => {
          setStep(1);
          setIsCompleted(false);
        }, 500);
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden relative flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 shrink-0">
          <div>
            <h2 className="font-extrabold text-slate-800 text-lg">Pemetaan Risiko Perilaku</h2>
            {!isCompleted && (
              <p className="text-xs font-medium text-slate-400 mt-0.5">Langkah {step} dari 3</p>
            )}
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 bg-slate-50 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Progress Bar */}
        {!isCompleted && (
          <div className="w-full bg-slate-100 h-1 shrink-0">
            <div className="bg-glyde-primary h-full transition-all duration-300" style={{ width: `${(step / 3) * 100}%` }}></div>
          </div>
        )}

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scroll flex-1">
          {isCompleted ? (
            <div className="flex flex-col items-center justify-center py-10 text-center animate-in zoom-in duration-300">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-5">
                <CheckCircle2 size={40} />
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-2">Asesmen Selesai!</h3>
              <p className="text-sm text-slate-500 max-w-xs">
                Sistem Rule-Based GLYDE telah memproses profil Anda dan memperbarui Skor Risiko serta rekomendasi tantangan.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {step === 1 && (
                <div className="animate-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-blue-50 text-glyde-primary rounded-xl"><Activity size={24} /></div>
                    <h3 className="text-lg font-bold text-slate-700">Aktivitas Fisik & Gerak</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <label className="block">
                      <span className="text-sm font-semibold text-slate-700 mb-2 block">Berapa hari dalam seminggu Anda berolahraga (min. 30 menit)?</span>
                      <select className="w-full bg-slate-50 border-transparent focus:border-glyde-primary focus:ring-2 focus:ring-blue-100 rounded-xl p-3 text-sm font-medium">
                        <option>Tidak pernah</option>
                        <option>1-2 hari</option>
                        <option>3-4 hari</option>
                        <option>5 hari atau lebih</option>
                      </select>
                    </label>

                    <label className="block">
                      <span className="text-sm font-semibold text-slate-700 mb-2 block">Rata-rata waktu duduk Anda dalam sehari?</span>
                      <select className="w-full bg-slate-50 border-transparent focus:border-glyde-primary focus:ring-2 focus:ring-blue-100 rounded-xl p-3 text-sm font-medium">
                        <option>Lebih dari 8 jam</option>
                        <option>4 - 8 jam</option>
                        <option>Kurang dari 4 jam</option>
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
                      <span className="text-sm font-semibold text-slate-700 mb-2 block">Seberapa sering mengonsumsi Minuman Berpemanis (Boba, Kopi Manis, Soda)?</span>
                      <select className="w-full bg-slate-50 border-transparent focus:border-glyde-primary focus:ring-2 focus:ring-blue-100 rounded-xl p-3 text-sm font-medium">
                        <option>Setiap hari (&gt; 1 kali)</option>
                        <option>Setiap hari (1 kali)</option>
                        <option>3-4 kali seminggu</option>
                        <option>Jarang (1 kali seminggu atau kurang)</option>
                      </select>
                    </label>

                    <label className="block">
                      <span className="text-sm font-semibold text-slate-700 mb-2 block">Seberapa sering makan makanan manis (Kue, Coklat, Dessert)?</span>
                      <select className="w-full bg-slate-50 border-transparent focus:border-glyde-primary focus:ring-2 focus:ring-blue-100 rounded-xl p-3 text-sm font-medium">
                        <option>Setiap hari</option>
                        <option>Beberapa kali seminggu</option>
                        <option>Sangat jarang</option>
                      </select>
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
                      <select className="w-full bg-slate-50 border-transparent focus:border-glyde-primary focus:ring-2 focus:ring-blue-100 rounded-xl p-3 text-sm font-medium">
                        <option>Kurang dari 5 jam</option>
                        <option>5 - 6 jam</option>
                        <option>7 - 8 jam</option>
                        <option>Lebih dari 8 jam</option>
                      </select>
                    </label>

                    <label className="block">
                      <span className="text-sm font-semibold text-slate-700 mb-2 block">Apakah ada riwayat keluarga inti (Orangtua/Saudara Kandung) dengan Diabetes?</span>
                      <div className="flex gap-4">
                        <label className="flex-1 flex items-center gap-2 p-3 border border-slate-200 rounded-xl bg-slate-50 cursor-pointer">
                          <input type="radio" name="family_history" className="text-glyde-primary focus:ring-glyde-primary" />
                          <span className="text-sm font-medium">Ya, Ada</span>
                        </label>
                        <label className="flex-1 flex items-center gap-2 p-3 border border-slate-200 rounded-xl bg-slate-50 cursor-pointer">
                          <input type="radio" name="family_history" className="text-glyde-primary focus:ring-glyde-primary" />
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
              className="w-full bg-glyde-primary hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
            >
              <span>{step < 3 ? 'Lanjut ke Bagian Berikutnya' : 'Hitung Skor Risiko'}</span>
              {step < 3 && <ArrowRight size={18} />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
