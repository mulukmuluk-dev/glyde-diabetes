import { useState, useEffect } from 'react';
import { X, User, MapPin, Calendar, Activity, Check, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: any;
  onProfileUpdated: (updatedProfile: any) => void;
}

export default function ProfileSettingsModal({
  isOpen,
  onClose,
  profile,
  onProfileUpdated
}: ProfileSettingsModalProps) {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Laki-laki');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen && profile) {
      setName(profile.name || '');
      setLocation(profile.location || 'Indonesia');
      setAge(profile.age ? String(profile.age) : '');
      setGender(profile.gender || 'Laki-laki');
      setWeight(profile.weight ? String(profile.weight) : '');
      setHeight(profile.height ? String(profile.height) : '');
      setError('');
      setSuccess(false);
    }
  }, [isOpen, profile]);

  if (!isOpen) return null;

  // Real-time BMI calculation
  const weightNum = parseFloat(weight);
  const heightNum = parseFloat(height);
  let bmi = 0;
  let bmiCategory = '-';
  let bmiColor = 'text-slate-500 bg-slate-100';

  if (weightNum > 0 && heightNum > 0) {
    const heightM = heightNum / 100;
    bmi = parseFloat((weightNum / (heightM * heightM)).toFixed(1));
    if (bmi < 18.5) {
      bmiCategory = 'Berat Kurang';
      bmiColor = 'text-amber-700 bg-amber-50 border border-amber-200';
    } else if (bmi <= 24.9) {
      bmiCategory = 'Normal (Ideal)';
      bmiColor = 'text-emerald-700 bg-emerald-50 border border-emerald-200';
    } else if (bmi <= 29.9) {
      bmiCategory = 'Kelebihan Berat';
      bmiColor = 'text-orange-700 bg-orange-50 border border-orange-200';
    } else {
      bmiCategory = 'Obesitas';
      bmiColor = 'text-rose-700 bg-rose-50 border border-rose-200';
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Nama lengkap tidak boleh kosong.');
      return;
    }
    if (!age || parseInt(age) <= 0) {
      setError('Usia harus diisi dengan angka valid.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Sesi login tidak ditemukan. Silakan login ulang.');

      const cleanName = name.trim();
      const cleanLocation = location.trim() || 'Indonesia';
      const cleanAge = parseInt(age);
      const cleanWeight = weight ? parseFloat(weight) : (profile?.weight || 60);
      const cleanHeight = height ? parseFloat(height) : (profile?.height || 170);

      const basePayload = {
        name: cleanName,
        age: cleanAge,
        gender,
        weight: cleanWeight,
        height: cleanHeight,
      };

      // 1. Coba update table profiles termasuk kolom location
      const { error: dbError } = await supabase
        .from('profiles')
        .update({
          ...basePayload,
          location: cleanLocation
        })
        .eq('id', session.user.id);

      // 2. Jika kolom location belum ada di database Supabase (PGRST204), fallback update tanpa kolom location
      if (dbError) {
        if (dbError.message?.includes('location') || dbError.code === 'PGRST204') {
          console.warn('[GLYDE] Kolom location belum ditambahkan di Supabase profiles, update base data:', dbError.message);
          const { error: retryError } = await supabase
            .from('profiles')
            .update(basePayload)
            .eq('id', session.user.id);

          if (retryError) throw retryError;
        } else {
          throw dbError;
        }
      }

      // 3. Simpan juga ke Auth User Metadata agar lokasi & nama tersinkronisasi di Supabase Auth
      await supabase.auth.updateUser({
        data: {
          full_name: cleanName,
          name: cleanName,
          location: cleanLocation,
          age: cleanAge
        }
      });

      // 4. Simpan ke localStorage sebagai cache sinkronisasi cepat
      localStorage.setItem(`glyde_user_location_${session.user.id}`, cleanLocation);

      const updatedProfile = {
        ...profile,
        ...basePayload,
        location: cleanLocation
      };

      onProfileUpdated(updatedProfile);
      setSuccess(true);

      setTimeout(() => {
        onClose();
      }, 700);

    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Gagal menyimpan perubahan profil ke database.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[32px] sm:rounded-[36px] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[92vh] border border-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-blue-50/70 to-indigo-50/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-glyde-primary text-white flex items-center justify-center shadow-md shadow-blue-500/25">
              <User size={20} />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-800">Pengaturan Profil</h2>
              <p className="text-xs font-medium text-slate-500">Ubah nama, lokasi, dan umur Anda</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors shadow-sm"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-semibold flex items-center gap-2.5">
              <AlertCircle size={18} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl text-xs font-semibold flex items-center gap-2.5">
              <Check size={18} className="shrink-0" />
              <span>Profil berhasil diperbarui dan tersimpan di database!</span>
            </div>
          )}

          {/* Nama Lengkap */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Nama Lengkap
            </label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Delano Dave Javier"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-glyde-primary focus:bg-white focus:ring-2 focus:ring-blue-100 rounded-xl text-sm font-semibold text-slate-800 outline-none transition-all"
              />
            </div>
          </div>

          {/* Lokasi & Umur */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Lokasi */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Lokasi Domisili
              </label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Contoh: Jakarta, Indonesia"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-glyde-primary focus:bg-white focus:ring-2 focus:ring-blue-100 rounded-xl text-sm font-semibold text-slate-800 outline-none transition-all"
                />
              </div>
            </div>

            {/* Umur */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Umur (Tahun)
              </label>
              <div className="relative">
                <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="number"
                  min="5"
                  max="120"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Contoh: 28"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-glyde-primary focus:bg-white focus:ring-2 focus:ring-blue-100 rounded-xl text-sm font-semibold text-slate-800 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Jenis Kelamin */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Jenis Kelamin
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setGender('Laki-laki')}
                className={`py-2.5 px-4 rounded-xl text-xs font-bold border transition-all ${
                  gender === 'Laki-laki'
                    ? 'bg-blue-50 border-glyde-primary text-glyde-primary shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Laki-laki
              </button>
              <button
                type="button"
                onClick={() => setGender('Perempuan')}
                className={`py-2.5 px-4 rounded-xl text-xs font-bold border transition-all ${
                  gender === 'Perempuan'
                    ? 'bg-blue-50 border-glyde-primary text-glyde-primary shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Perempuan
              </button>
            </div>
          </div>

          {/* Berat & Tinggi Badan */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Berat (kg)
              </label>
              <input
                type="number"
                step="0.5"
                min="20"
                max="300"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="70"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-glyde-primary focus:bg-white focus:ring-2 focus:ring-blue-100 rounded-xl text-sm font-semibold text-slate-800 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Tinggi (cm)
              </label>
              <input
                type="number"
                step="1"
                min="50"
                max="250"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="175"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-glyde-primary focus:bg-white focus:ring-2 focus:ring-blue-100 rounded-xl text-sm font-semibold text-slate-800 outline-none transition-all"
              />
            </div>
          </div>

          {/* Live BMI Preview Badge */}
          {bmi > 0 && (
            <div className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between border border-slate-100">
              <div className="flex items-center gap-2">
                <Activity size={16} className="text-glyde-primary" />
                <span className="text-xs font-bold text-slate-700">Kalkulasi IMT:</span>
                <span className="text-xs font-black text-slate-900">{bmi} kg/m²</span>
              </div>
              <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full ${bmiColor}`}>
                {bmiCategory}
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-3 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 px-4 rounded-xl bg-glyde-primary hover:bg-blue-700 text-white text-xs font-bold shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Check size={16} />
                  <span>Simpan ke Database</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
