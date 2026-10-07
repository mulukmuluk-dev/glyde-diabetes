import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { User, AlertCircle } from 'lucide-react';


interface ProfileData {
  name: string;
  age: string;
  gender: string;
  weight: string;
  height: string;
}

export default function OnboardingProfileModal({ isOpen, onComplete }: { isOpen: boolean, onComplete: () => void }) {
  const [data, setData] = useState<ProfileData>({
    name: '',
    age: '',
    gender: 'Laki-laki',
    weight: '',
    height: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.name || !data.age || !data.weight || !data.height) {
      setError('Semua data wajib diisi!');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Sesi tidak ditemukan");

      const { error: dbError } = await supabase.from('profiles').insert([
        {
          id: session.user.id,
          name: data.name,
          age: parseInt(data.age),
          gender: data.gender,
          weight: parseFloat(data.weight),
          height: parseFloat(data.height)
        }
      ]);

      if (dbError) throw dbError;
      
      onComplete(); // Success
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Gagal menyimpan data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden relative animate-in slide-in-from-bottom-8 duration-500">
        
        <div className="p-6 md:p-8">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-glyde-primary">
            <User size={32} />
          </div>
          
          <h2 className="text-2xl font-black text-slate-800 mb-2">Selamat Datang di GLYDE!</h2>
          <p className="text-slate-500 text-sm font-medium mb-8">Sebelum memulai pemetaan risiko, lengkapi profil dasar Anda agar sistem dapat memberikan analisis yang akurat.</p>
          
          {error && (
            <div className="mb-6 p-4 bg-rose-50 text-rose-600 text-sm font-bold rounded-xl flex items-center gap-2">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Nama Lengkap</label>
              <input 
                type="text" 
                value={data.name}
                onChange={e => setData({...data, name: e.target.value})}
                className="w-full bg-slate-50 border-transparent focus:border-glyde-primary focus:ring-2 focus:ring-blue-100 rounded-xl p-3 text-sm font-medium outline-none transition-all"
                placeholder="Cth: Nicholas Saputra"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Usia</label>
                <input 
                  type="number" 
                  value={data.age}
                  onChange={e => setData({...data, age: e.target.value})}
                  className="w-full bg-slate-50 border-transparent focus:border-glyde-primary focus:ring-2 focus:ring-blue-100 rounded-xl p-3 text-sm font-medium outline-none transition-all"
                  placeholder="Cth: 28"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Jenis Kelamin</label>
                <select 
                  value={data.gender}
                  onChange={e => setData({...data, gender: e.target.value})}
                  className="w-full bg-slate-50 border-transparent focus:border-glyde-primary focus:ring-2 focus:ring-blue-100 rounded-xl p-3 text-sm font-medium outline-none transition-all"
                >
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Berat Badan (kg)</label>
                <input 
                  type="number" 
                  value={data.weight}
                  onChange={e => setData({...data, weight: e.target.value})}
                  className="w-full bg-slate-50 border-transparent focus:border-glyde-primary focus:ring-2 focus:ring-blue-100 rounded-xl p-3 text-sm font-medium outline-none transition-all"
                  placeholder="Cth: 75"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Tinggi Badan (cm)</label>
                <input 
                  type="number" 
                  value={data.height}
                  onChange={e => setData({...data, height: e.target.value})}
                  className="w-full bg-slate-50 border-transparent focus:border-glyde-primary focus:ring-2 focus:ring-blue-100 rounded-xl p-3 text-sm font-medium outline-none transition-all"
                  placeholder="Cth: 175"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full mt-6 bg-glyde-primary hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{loading ? 'Menyimpan...' : 'Simpan Profil & Lanjutkan'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
