import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { QrCode, Activity, Dumbbell, PlayCircle } from 'lucide-react';

export default function EquipmentDirectory() {
  const [equipmentList, setEquipmentList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const { data } = await api.get('/equipment');
        setEquipmentList(data);
      } catch (err) {
        console.error('Failed to fetch equipment', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEquipment();
  }, []);

  return (
    <div className="min-h-screen bg-[#09090B] text-white pt-24 pb-20 px-6 selection:bg-accent selection:text-white">
      {/* Background Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-accent opacity-[0.02] blur-[150px] rounded-full pointer-events-none z-0"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-4 text-[rgba(255,255,255,0.9)]">
            Smart Equipment Directory
          </h1>
          <p className="text-[rgba(255,255,255,0.6)] text-lg md:text-xl max-w-2xl mx-auto">
            Scan the physical QR codes on our machines for instant AI-guided tutorials, or browse the directory below.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {equipmentList.map((eq) => (
              <Link 
                to={`/equipment/${eq._id}`} 
                key={eq._id}
                className="group bg-[#18181B] border border-white/5 hover:border-accent hover:shadow-[0_0_30px_rgba(255,107,0,0.1)] rounded-3xl p-6 transition-all duration-300 flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-black transition-colors">
                    {eq.category === 'Cardio' ? <Activity className="w-6 h-6" /> : <Dumbbell className="w-6 h-6" />}
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    eq.status === 'operational' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                  }`}>
                    {eq.status}
                  </div>
                </div>

                <h3 className="text-2xl font-bold mb-2 text-white/90">{eq.name}</h3>
                <p className="text-white/50 text-sm mb-6 flex-grow">{eq.description}</p>
                
                <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-auto">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-white/40 uppercase tracking-widest">Target</span>
                    <span className="text-sm font-medium text-white/80">{eq.targetMuscle}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-accent text-sm font-bold group-hover:translate-x-1 transition-transform">
                    View Tutorial <PlayCircle className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
