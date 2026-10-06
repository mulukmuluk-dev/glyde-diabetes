import React, { useState, useEffect } from 'react';
import { Camera, X, ScanLine, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function FoodScannerModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'result'>('idle');

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setScanState('idle');
    }
  }, [isOpen]);

  const handleScan = () => {
    setScanState('scanning');
    // Simulate API delay
    setTimeout(() => {
      setScanState('result');
    }, 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden relative">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h2 className="font-extrabold text-slate-800 text-lg">Pemindai Nutrisi & Gula</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 bg-slate-50 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {scanState === 'idle' && (
            <div className="flex flex-col items-center">
              <div className="w-full aspect-square bg-slate-100 rounded-3xl mb-6 relative overflow-hidden flex items-center justify-center border-2 border-dashed border-slate-300">
                <div className="text-center">
                  <Camera size={48} className="mx-auto text-slate-300 mb-2" />
                  <p className="text-slate-400 text-sm font-medium">Arahkan kamera ke makanan/minuman</p>
                </div>
              </div>
              <button 
                onClick={handleScan}
                className="w-full bg-glyde-primary hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
              >
                <Camera size={20} />
                <span>Ambil Foto & Analisis</span>
              </button>
            </div>
          )}

          {scanState === 'scanning' && (
            <div className="flex flex-col items-center py-12">
              <div className="relative w-32 h-32 mb-6">
                <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-glyde-primary rounded-full border-t-transparent animate-spin"></div>
                <ScanLine className="absolute inset-0 m-auto text-glyde-primary animate-pulse" size={40} />
              </div>
              <h3 className="font-bold text-slate-700 text-lg">Menganalisis Komposisi...</h3>
              <p className="text-slate-400 text-sm mt-1">Mengestimasi kadar gula dari gambar</p>
            </div>
          )}

          {scanState === 'result' && (
            <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
              <div className="w-full bg-rose-50 rounded-3xl p-6 border border-rose-100 mb-6 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-rose-400 to-rose-500"></div>
                <AlertTriangle className="mx-auto text-rose-500 mb-3" size={36} />
                <h3 className="font-black text-slate-800 text-xl mb-1">Boba Milk Tea (Estimasi)</h3>
                
                <div className="flex justify-center items-end gap-1 my-4">
                  <span className="text-5xl font-black text-rose-600 leading-none">38</span>
                  <span className="text-lg font-bold text-rose-500 mb-1">gram</span>
                </div>
                
                <p className="text-xs font-semibold text-rose-600 bg-rose-100/50 inline-block px-3 py-1.5 rounded-full">
                  Kadar Gula Sangat Tinggi!
                </p>
              </div>

              <div className="w-full space-y-3 mb-6">
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                  <span className="text-sm font-medium text-slate-600">Batas Harian Anda</span>
                  <span className="text-sm font-bold text-slate-800">50 gram</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                  <span className="text-sm font-medium text-slate-600">Sisa Kuota Gula</span>
                  <span className="text-sm font-bold text-rose-600">12 gram</span>
                </div>
              </div>

              <div className="flex gap-3 w-full">
                <button onClick={() => setScanState('idle')} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3.5 rounded-xl transition-all">
                  Scan Ulang
                </button>
                <button onClick={onClose} className="flex-1 bg-glyde-primary hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/30 transition-all">
                  Catat & Simpan
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
