import React, { useState } from 'react';
import { X, FileText, Download, CheckCircle2 } from 'lucide-react';

export default function ReportModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [downloading, setDownloading] = useState(false);
  const [done, setDone] = useState(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDone(true);
      setTimeout(() => {
        setDone(false);
      }, 3000);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden relative flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2">
            <FileText size={20} className="text-slate-700" />
            <h2 className="font-extrabold text-slate-800 text-lg">Laporan Medis (PDF)</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 bg-slate-50 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto custom-scroll flex-1">
          <p className="text-sm text-slate-500 mb-6 text-center">Unduh rangkuman profil risiko perilaku Anda untuk didiskusikan dengan dokter Anda.</p>
          
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-6 relative overflow-hidden">
            {/* Fake PDF Preview */}
            <div className="absolute -right-10 -top-10 text-slate-200 opacity-50">
              <FileText size={150} />
            </div>
            
            <div className="relative z-10 space-y-4">
              <div className="border-b border-slate-200 pb-3">
                <h3 className="font-bold text-slate-800 uppercase text-xs tracking-wider">GLYDE Health Report</h3>
                <p className="text-[10px] text-slate-400">Date: 24 Nov 2024</p>
              </div>
              
              <div>
                <p className="text-xs font-semibold text-slate-600">Patient: <span className="font-bold text-slate-800">dr. Alisha Nicholls</span></p>
                <p className="text-xs font-semibold text-slate-600">Behavioral Risk Score: <span className="font-bold text-amber-600">58/100 (Moderate)</span></p>
              </div>
              
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-600 mb-1">Top Risk Factors:</p>
                <ul className="text-[10px] text-slate-500 list-disc pl-4 space-y-1">
                  <li>High intake of sugar-sweetened beverages (4x/week)</li>
                  <li>Low physical activity (Sedentary lifestyle)</li>
                </ul>
              </div>
            </div>
          </div>
          
          <button 
            onClick={handleDownload}
            disabled={downloading || done}
            className={`w-full font-bold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 ${
              done 
                ? 'bg-emerald-500 text-white shadow-emerald-500/30' 
                : 'bg-glyde-primary hover:bg-blue-700 text-white shadow-blue-500/30'
            }`}
          >
            {downloading ? (
              <span className="animate-pulse">Menyiapkan Dokumen...</span>
            ) : done ? (
              <>
                <CheckCircle2 size={18} />
                <span>Berhasil Diunduh!</span>
              </>
            ) : (
              <>
                <Download size={18} />
                <span>Unduh PDF Sekarang</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
