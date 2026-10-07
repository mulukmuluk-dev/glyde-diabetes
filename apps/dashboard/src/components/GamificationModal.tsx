import { X, Award, Flame, Target, Star } from 'lucide-react';


export default function GamificationModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  if (!isOpen) return null;

  const badges = [
    {
      title: '7-Day Sugar Free',
      desc: 'Berhasil menghindari minuman manis selama seminggu',
      icon: <Award size={32} className="text-amber-500" />,
      color: 'bg-amber-100',
      unlocked: true,
    },
    {
      title: '10k Steps Master',
      desc: 'Mencapai target langkah harian 5x berturut-turut',
      icon: <Flame size={32} className="text-rose-500" />,
      color: 'bg-rose-100',
      unlocked: true,
    },
    {
      title: 'Sleep Champion',
      desc: 'Tidur minimal 7 jam selama sebulan penuh',
      icon: <Star size={32} className="text-indigo-500" />,
      color: 'bg-indigo-100',
      unlocked: false,
    },
    {
      title: 'Consistency Pro',
      desc: 'Memenuhi semua jadwal target mingguan',
      icon: <Target size={32} className="text-emerald-500" />,
      color: 'bg-emerald-100',
      unlocked: false,
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden relative flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2">
            <Award size={20} className="text-slate-700" />
            <h2 className="font-extrabold text-slate-800 text-lg">Pencapaian & Lencana</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 bg-slate-50 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto custom-scroll flex-1">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white mb-6 shadow-lg shadow-blue-500/20 text-center">
            <p className="text-blue-100 text-sm font-medium mb-1">Total Poin GLYDE</p>
            <h3 className="text-4xl font-black mb-2">1,250</h3>
            <p className="text-xs text-blue-200">Kumpulkan lebih banyak poin dengan menyelesaikan Rencana Intervensi harian!</p>
          </div>

          <h4 className="font-bold text-slate-700 mb-4 text-sm uppercase tracking-wider">Koleksi Lencana Anda</h4>
          
          <div className="grid grid-cols-2 gap-4">
            {badges.map((badge, idx) => (
              <div key={idx} className={`p-4 rounded-2xl border-2 transition-all ${badge.unlocked ? 'border-transparent bg-slate-50 hover:shadow-md' : 'border-slate-100 opacity-60 grayscale'}`}>
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 ${badge.color}`}>
                  {badge.icon}
                </div>
                <h5 className="font-bold text-slate-800 text-sm mb-1">{badge.title}</h5>
                <p className="text-[10px] text-slate-500 leading-relaxed">{badge.desc}</p>
                {!badge.unlocked && <span className="mt-2 inline-block text-[9px] font-bold text-slate-400 bg-slate-200 px-2 py-0.5 rounded-full uppercase">Terkunci</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
