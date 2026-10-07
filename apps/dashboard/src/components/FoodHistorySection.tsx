import { useState, useEffect } from 'react';
import { Camera, ChevronRight, X } from 'lucide-react';
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

export default function FoodHistorySection({ onOpenScanner }: { onOpenScanner: () => void }) {
  const [scans, setScans] = useState<FoodScanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedScan, setSelectedScan] = useState<FoodScanItem | null>(null);

  const fetchFoodScans = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('food_scans')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Gagal mengambil riwayat scan dari Supabase:", error);
      } else if (data) {
        setScans(data);
      }
    } catch (err) {
      console.error("Error fetching food scans:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoodScans();
  }, []);

  return (
    <section className="bg-white rounded-[26px] overflow-hidden shadow-card-soft flex-1 flex flex-col justify-between" data-purpose="food-history-section">
      {/* Header */}
      <div className="bg-glyde-primary px-5 py-3.5 flex items-center justify-between text-white">
        <div className="flex items-center gap-2">
          <Camera size={16} />
          <span className="text-xs font-extrabold tracking-wider uppercase">RIWAYAT FOTO & ANALISIS MOKANAN</span>
        </div>
        <button 
          onClick={onOpenScanner}
          className="bg-white/20 hover:bg-white/30 text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 transition-colors"
        >
          <span>+ Scan Baru</span>
        </button>
      </div>

      {/* Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between overflow-hidden">
        {loading ? (
          <div className="py-10 text-center text-slate-400 text-xs font-medium">
            Memuat Riwayat dari Database Supabase...
          </div>
        ) : scans.length === 0 ? (
          <div className="py-12 px-4 text-center flex flex-col items-center justify-center my-auto">
            <div className="w-14 h-14 bg-blue-50 text-glyde-primary rounded-2xl flex items-center justify-center mb-3">
              <Camera size={28} />
            </div>
            <h3 className="font-extrabold text-slate-800 text-sm mb-1">Belum Ada Riwayat Foto Makanan</h3>
            <p className="text-slate-400 text-xs max-w-xs mb-4">
              Pindai foto makanan atau minuman Anda untuk melihat estimasi kadar gula, GI, dan rekomendasi kesehatan.
            </p>
            <button 
              onClick={onOpenScanner}
              className="bg-glyde-primary hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md transition-colors"
            >
              Mulai Pindai Foto Pertama
            </button>
          </div>
        ) : (
          <div className="space-y-3 custom-scroll max-h-[380px] overflow-y-auto pr-1 text-xs flex-1">
            {scans.map((item) => (
              <div 
                key={item.id}
                onClick={() => setSelectedScan(item)}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-blue-50/50 border border-slate-100 hover:border-blue-200 transition-all cursor-pointer group"
              >
                {/* Photo Thumbnail + Info */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-200">
                    <img src={item.image_url} alt={item.food_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs sm:text-sm line-clamp-1">{item.food_name}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        item.safety_level === 'Aman' ? 'bg-emerald-100 text-emerald-700' :
                        item.safety_level === 'Bahaya' ? 'bg-rose-100 text-rose-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {item.safety_level}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sugar & GI badge */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-extrabold text-slate-800 text-xs">
                      {item.sugar_grams} <span className="text-[10px] text-slate-400 font-normal">g gula</span>
                    </div>
                    <div className="text-[10px] text-amber-600 font-semibold">
                      GI {item.glycemic_index}
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-glyde-primary transition-colors" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Summary */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
          <span className="text-slate-400">{scans.length} foto makanan tersimpan di Supabase DB</span>
          <button onClick={fetchFoodScans} className="font-bold text-glyde-primary hover:underline">
            Refresh Data ↺
          </button>
        </div>
      </div>

      {/* Detail Modal for Selected Scan */}
      {selectedScan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden relative border border-slate-100 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 shrink-0">
              <h3 className="font-extrabold text-slate-800 text-base">Detail Analisis Makanan</h3>
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

              {/* 10+ Informations Detail List */}
              <div className="bg-slate-50 rounded-2xl p-4 space-y-2.5 text-xs">
                <div className="grid grid-cols-4 gap-2 text-center pb-2 border-b border-slate-200">
                  <div><span className="text-[10px] text-slate-400 block">Gula</span><span className="font-extrabold text-rose-600">{selectedScan.sugar_grams}g</span></div>
                  <div><span className="text-[10px] text-slate-400 block">GI</span><span className="font-extrabold text-amber-600">{selectedScan.glycemic_index}</span></div>
                  <div><span className="text-[10px] text-slate-400 block">Kalori</span><span className="font-extrabold text-slate-700">{selectedScan.calories}</span></div>
                  <div><span className="text-[10px] text-slate-400 block">Karbo</span><span className="font-extrabold text-slate-700">{selectedScan.carbs_grams}g</span></div>
                </div>

                <div className="space-y-1.5 pt-1">
                  <p><strong className="text-slate-700">1. Protein:</strong> {selectedScan.protein_grams}g | <strong className="text-slate-700">Lemak:</strong> {selectedScan.fat_grams}g</p>
                  <p><strong className="text-slate-700">2. Peringatan Lonjakan Gula:</strong> {selectedScan.spike_warning}</p>
                  <p><strong className="text-slate-700">3. Batas Porsi Disarankan:</strong> {selectedScan.portion_advice}</p>
                  <p><strong className="text-slate-700">4. Komposisi:</strong> {Array.isArray(selectedScan.ingredients) ? selectedScan.ingredients.join(', ') : 'Tercatat'}</p>
                  <p><strong className="text-slate-700">5. Rekomendasi Kesehatan:</strong> {selectedScan.recommendation}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
