import { useState, useEffect } from 'react';
import { Camera, X, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';


interface FoodScanItem {
  id: string;
  user_id: string;
  image_url: string;
  food_name: string;
  food_type: string;
  is_food: boolean;
  sugar_grams: number;
  glycemic_index: number;
  calories: number;
  carbs_grams: number;
  protein_grams: number;
  fat_grams: number;
  safety_level: 'Aman' | 'Waspada' | 'Bahaya';
  recommendation: string;
  portion_advice: string;
  spike_warning: string;
  ingredients: string[];
  detailed_analysis: any;
  created_at: string;
}

export default function FoodHistoryModal({ isOpen, onClose, onOpenScanner }: { isOpen: boolean; onClose: () => void; onOpenScanner: () => void }) {
  const [scans, setScans] = useState<FoodScanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedScan, setSelectedScan] = useState<FoodScanItem | null>(null);

  const fetchScans = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('food_scans')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setScans(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchScans();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-2xl overflow-hidden relative border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 shrink-0 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-blue-50 text-glyde-primary flex items-center justify-center">
              <Camera size={20} />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-800 text-base sm:text-lg leading-tight">Riwayat Foto Makanan & Nutrisi</h2>
              <p className="text-[11px] font-medium text-slate-400">Database cloud Supabase • Terintegrasi AI</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => { onClose(); onOpenScanner(); }}
              className="bg-glyde-primary hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-colors shadow-sm"
            >
              + Scan Makanan Baru
            </button>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto custom-scroll flex-1">
          {loading ? (
            <div className="py-12 text-center text-slate-400 text-xs font-medium">Memuat Riwayat Foto Makanan dari Supabase...</div>
          ) : scans.length === 0 ? (
            <div className="py-16 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-blue-50 text-glyde-primary rounded-2xl flex items-center justify-center mb-3">
                <Camera size={32} />
              </div>
              <h3 className="font-extrabold text-slate-800 text-base mb-1">Belum Ada Riwayat Foto Makanan</h3>
              <p className="text-slate-400 text-xs max-w-xs mb-4">Pindai makanan Anda untuk mulai menyimpan riwayat nutrisi & gula darah ke database.</p>
              <button onClick={() => { onClose(); onOpenScanner(); }} className="bg-glyde-primary hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl">
                Scan Makanan Sekarang
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {scans.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => setSelectedScan(item)}
                  className="bg-slate-50 hover:bg-blue-50/50 border border-slate-200/80 hover:border-blue-300 rounded-2xl p-3.5 transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div className="flex gap-3">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-200">
                      <img src={item.image_url} alt={item.food_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full inline-block mb-1 ${
                        item.safety_level === 'Aman' ? 'bg-emerald-100 text-emerald-800' :
                        item.safety_level === 'Bahaya' ? 'bg-rose-100 text-rose-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        Level {item.safety_level}
                      </span>
                      <h4 className="font-bold text-slate-800 text-xs sm:text-sm truncate">{item.food_name}</h4>
                      <p className="text-[10px] text-slate-400 truncate">{item.food_type}</p>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <span className="font-extrabold text-rose-600">{item.sugar_grams}g <span className="text-[9px] font-normal text-slate-400">gula</span></span>
                      <span className="font-extrabold text-amber-600">GI {item.glycemic_index}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Calendar size={10} />
                      {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Selected Scan Detail Drawer/Modal */}
      {selectedScan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden relative border border-slate-100 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 shrink-0">
              <h3 className="font-extrabold text-slate-800 text-base">Detail Riwayat Foto</h3>
              <button onClick={() => setSelectedScan(null)} className="p-2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full">
                <X size={16} />
              </button>
            </div>

            <div className="p-5 overflow-y-auto custom-scroll space-y-4">
              <div className="w-full aspect-[4/3] bg-slate-900 rounded-2xl overflow-hidden border border-slate-200">
                <img src={selectedScan.image_url} alt={selectedScan.food_name} className="w-full h-full object-cover" />
              </div>

              <div className="text-center">
                <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                  selectedScan.safety_level === 'Aman' ? 'bg-emerald-100 text-emerald-800' :
                  selectedScan.safety_level === 'Bahaya' ? 'bg-rose-100 text-rose-800' :
                  'bg-amber-100 text-amber-800'
                }`}>
                  Status: {selectedScan.safety_level}
                </span>
                <h4 className="font-extrabold text-lg text-slate-800 mt-2">{selectedScan.food_name}</h4>
                <p className="text-xs text-slate-400">{selectedScan.food_type}</p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 space-y-2.5 text-xs">
                <div className="grid grid-cols-4 gap-2 text-center pb-2 border-b border-slate-200">
                  <div><span className="text-[10px] text-slate-400 block">Gula</span><span className="font-extrabold text-rose-600">{selectedScan.sugar_grams}g</span></div>
                  <div><span className="text-[10px] text-slate-400 block">GI</span><span className="font-extrabold text-amber-600">{selectedScan.glycemic_index}</span></div>
                  <div><span className="text-[10px] text-slate-400 block">Kalori</span><span className="font-extrabold text-slate-700">{selectedScan.calories}</span></div>
                  <div><span className="text-[10px] text-slate-400 block">Karbo</span><span className="font-extrabold text-slate-700">{selectedScan.carbs_grams}g</span></div>
                </div>

                <div className="space-y-1.5 pt-1">
                  <p><strong className="text-slate-700">1. Peringatan Lonjakan Gula:</strong> {selectedScan.spike_warning}</p>
                  <p><strong className="text-slate-700">2. Batas Porsi Disarankan:</strong> {selectedScan.portion_advice}</p>
                  <p><strong className="text-slate-700">3. Komposisi:</strong> {Array.isArray(selectedScan.ingredients) ? selectedScan.ingredients.join(', ') : 'Tercatat'}</p>
                  <p><strong className="text-slate-700">4. Rekomendasi Diet:</strong> {selectedScan.recommendation}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
