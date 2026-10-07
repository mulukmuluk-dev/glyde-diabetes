import { X, Bell, AlertCircle, TrendingUp, HeartPulse } from 'lucide-react';


export default function NotificationModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  if (!isOpen) return null;

  const notifications = [
    {
      id: 1,
      type: 'warning',
      icon: <AlertCircle size={20} className="text-amber-500" />,
      title: 'Move Challenge: Sedentari Terlalu Lama!',
      message: 'dr. Nicholls, Anda sudah duduk selama 3 jam berturut-turut. Ayo berdiri dan lakukan peregangan selama 5 menit.',
      time: '10 menit yang lalu',
      bg: 'bg-amber-50',
    },
    {
      id: 2,
      type: 'success',
      icon: <TrendingUp size={20} className="text-emerald-500" />,
      title: 'Progress Skor Membaik',
      message: 'Hebat! Skor risiko perilaku Anda turun 5 poin minggu ini karena Anda berhasil menekan konsumsi gula harian.',
      time: '2 jam yang lalu',
      bg: 'bg-emerald-50',
    },
    {
      id: 3,
      type: 'info',
      icon: <HeartPulse size={20} className="text-blue-500" />,
      title: 'Jadwal Sleep Routine',
      message: 'Jangan lupa, target tidur Anda malam ini adalah 7.5 jam. Kurangi screen time mulai dari sekarang.',
      time: 'Kemarin, 20:00',
      bg: 'bg-blue-50',
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden relative flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2">
            <Bell size={20} className="text-slate-700" />
            <h2 className="font-extrabold text-slate-800 text-lg">Smart Notifications</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 bg-slate-50 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-5 overflow-y-auto custom-scroll flex-1 space-y-4">
          {notifications.map(notif => (
            <div key={notif.id} className={`${notif.bg} rounded-2xl p-4 border border-white/50 shadow-sm`}>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0 bg-white p-2 rounded-xl shadow-sm">
                  {notif.icon}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm mb-1">{notif.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed mb-2">{notif.message}</p>
                  <span className="text-[10px] font-semibold text-slate-400">{notif.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
