import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { ArrowLeft, Play, Dumbbell, Activity, ShieldAlert } from 'lucide-react';

export default function EquipmentDetail() {
  const { id } = useParams();
  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const { data } = await api.get(`/equipment/${id}`);
        setEquipment(data);
      } catch (err) {
        setError('Equipment not found or offline.');
      } finally {
        setLoading(false);
      }
    };
    fetchEquipment();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !equipment) {
    return (
      <div className="min-h-screen bg-[#09090B] flex flex-col items-center justify-center text-center px-6">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-6" />
        <h1 className="text-3xl font-bold text-white mb-2">Machine Offline</h1>
        <p className="text-white/50 mb-8 max-w-md">{error}</p>
        <Link to="/equipment" className="text-accent hover:text-white transition-colors">← Return to Directory</Link>
      </div>
    );
  }

  // Robustly extract YouTube ID and convert to embed format
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }
    return url; // fallback
  };

  const embedUrl = getYouTubeEmbedUrl(equipment.youtubeUrl);

  return (
    <div className="min-h-screen bg-[#09090B] text-white pt-24 pb-20 px-6 selection:bg-accent selection:text-white">
      <div className="max-w-4xl mx-auto">
        
        <Link to="/equipment" className="inline-flex items-center gap-2 text-white/50 hover:text-accent transition-colors mb-10 text-sm font-medium uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4" /> Back to Directory
        </Link>

        <div className="bg-[#18181B] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl relative">
          
          {/* Machine Header */}
          <div className="p-8 md:p-12 border-b border-white/5 relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-accent">
                    {equipment.category === 'Cardio' ? <Activity className="w-5 h-5" /> : <Dumbbell className="w-5 h-5" />}
                  </div>
                  <span className="text-white/50 uppercase tracking-widest text-xs font-bold">{equipment.category}</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-display font-bold text-white/95">{equipment.name}</h1>
              </div>
              
              <div className="flex flex-col gap-2">
                <div className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-center ${
                  equipment.status === 'operational' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                }`}>
                  {equipment.status}
                </div>
              </div>
            </div>
            
            <p className="text-white/60 text-lg leading-relaxed max-w-2xl">{equipment.description}</p>
          </div>

          {/* Video Player Area */}
          <div className="aspect-video bg-black relative border-b border-white/5 group">
            {embedUrl ? (
              <iframe 
                src={embedUrl}
                title={`${equipment.name} Tutorial`}
                className="w-full h-full absolute inset-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-white/20">
                <Play className="w-16 h-16 mb-4 opacity-50" />
                <p>Tutorial video offline.</p>
              </div>
            )}
          </div>

          {/* Biomechanical Details */}
          <div className="p-8 md:p-12 bg-gradient-to-b from-[#18181B] to-[#09090B]">
            <h3 className="text-xl font-bold mb-6 text-white/90">Biomechanical Targets</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Primary Muscle</div>
                <div className="font-bold text-accent">{equipment.targetMuscle}</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Difficulty</div>
                <div className="font-bold text-white/90">Intermediate</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
