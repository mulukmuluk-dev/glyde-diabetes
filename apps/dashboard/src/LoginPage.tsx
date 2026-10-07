import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { HeartPulse } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/dashboard');
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        navigate('/dashboard');
      }
    });


    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      if (error) throw error;
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-glyde-subtleBg flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-[32px] p-8 md:p-10 shadow-xl shadow-blue-500/10 text-center border border-blue-50">
        <div className="w-16 h-16 bg-glyde-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30">
          <HeartPulse size={32} className="text-white" />
        </div>
        <h1 className="text-3xl font-black text-slate-800 mb-3 tracking-tight">Masuk ke GLYDE</h1>
        <p className="text-slate-500 font-medium mb-10 text-sm">Masuk untuk melanjutkan perjalanan sehat Anda dan memantau pemetaan risiko.</p>
        
        <button 
          onClick={handleGoogleLogin} 
          disabled={loading}
          className="w-full bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 font-bold py-3.5 px-6 rounded-2xl shadow-sm flex items-center justify-center gap-3 transition-all disabled:opacity-50"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6" alt="Google" />
          <span>{loading ? 'Memproses...' : 'Lanjutkan dengan Google'}</span>
        </button>

        <p className="mt-8 text-xs font-medium text-slate-400">
          Dengan masuk, Anda menyetujui Ketentuan Layanan dan Kebijakan Privasi kami.
        </p>
      </div>
    </div>
  );
}
