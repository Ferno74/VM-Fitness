import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Shield, Plus, QrCode, Download, X } from 'lucide-react';

export default function AdminPortal() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [equipmentList, setEquipmentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeQr, setActiveQr] = useState(null); // { name, url }

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Strength',
    description: '',
    youtubeUrl: '',
    targetMuscle: '',
    status: 'operational'
  });

  useEffect(() => {
    if (authLoading) return; // Wait for auth check to complete
    
    // Basic frontend guard
    if (!user || user.role !== 'admin') {
      toast.error('Unauthorized access. Admin clearance required.', { id: 'admin-guard' });
      navigate('/');
      return;
    }

    const fetchEquipment = async () => {
      try {
        const { data } = await api.get('/equipment');
        setEquipmentList(data);
      } catch (err) {
        toast.error('Failed to load equipment data.');
      } finally {
        setLoading(false);
      }
    };
    fetchEquipment();
  }, [user, navigate, authLoading]);

  const handleGenerateQr = async (eq) => {
    try {
      const { data } = await api.get(`/equipment/${eq._id}/qr`);
      setActiveQr({ name: eq.name, url: data.qrDataUrl });
    } catch (err) {
      toast.error('Failed to generate QR code.');
    }
  };

  const handleAddEquipment = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/equipment', formData);
      setEquipmentList([...equipmentList, data]);
      toast.success('Equipment registered to database.');
      setFormData({ name: '', category: 'Strength', description: '', youtubeUrl: '', targetMuscle: '', status: 'operational' });
    } catch (err) {
      toast.error('Failed to add equipment.');
    }
  };

  if (authLoading) return <div className="min-h-screen bg-[#09090B] flex items-center justify-center"><div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div></div>;
  if (!user || user.role !== 'admin') return null;

  return (
    <div className="min-h-screen bg-[#09090B] text-white pt-24 pb-20 px-6 selection:bg-accent selection:text-white relative">
      
      {/* Background Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-red-500 opacity-[0.02] blur-[150px] rounded-full pointer-events-none z-0"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        <div className="flex items-center gap-4 mb-12 border-b border-white/10 pb-6">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl md:text-5xl font-display font-bold tracking-tight mb-1 text-white/90">
              Admin Control Room
            </h1>
            <p className="text-sm text-red-500/80 uppercase tracking-widest font-bold">Level 4 Authorization</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Equipment List & QR Generation */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold mb-6 text-white/90 flex items-center gap-2">
              <QrCode className="w-5 h-5 text-accent" /> Fleet Management & QR Generation
            </h2>
            
            <div className="bg-[#18181B] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
              {loading ? (
                <div className="p-10 text-center text-white/50">Loading fleet data...</div>
              ) : (
                <div className="divide-y divide-white/5">
                  {equipmentList.map(eq => (
                    <div key={eq._id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/5 transition-colors">
                      <div>
                        <h3 className="font-bold text-white/90">{eq.name}</h3>
                        <p className="text-sm text-white/40">{eq.category} • {eq.targetMuscle}</p>
                      </div>
                      <button 
                        onClick={() => handleGenerateQr(eq)}
                        className="px-4 py-2 bg-white/5 hover:bg-accent hover:text-black border border-white/10 rounded-lg text-sm font-bold transition-colors flex items-center gap-2"
                      >
                        <QrCode className="w-4 h-4" /> Generate Tag
                      </button>
                    </div>
                  ))}
                  {equipmentList.length === 0 && (
                    <div className="p-10 text-center text-white/50">No equipment found. Add some below.</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Add New Equipment Form */}
          <div>
            <h2 className="text-xl font-bold mb-6 text-white/90 flex items-center gap-2">
              <Plus className="w-5 h-5 text-green-500" /> Register Machine
            </h2>
            <div className="bg-[#18181B] border border-white/5 rounded-3xl p-6 shadow-2xl">
              <form onSubmit={handleAddEquipment} className="space-y-4">
                
                <div>
                  <label className="text-xs text-white/40 uppercase tracking-widest mb-1 block">Machine Name</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-[#27272A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-accent outline-none" placeholder="e.g. Preacher Curl Bench" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-white/40 uppercase tracking-widest mb-1 block">Category</label>
                    <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-[#27272A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-accent outline-none">
                      <option>Strength</option>
                      <option>Cardio</option>
                      <option>Recovery</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-white/40 uppercase tracking-widest mb-1 block">Target Muscle</label>
                    <input type="text" value={formData.targetMuscle} onChange={e => setFormData({...formData, targetMuscle: e.target.value})} className="w-full bg-[#27272A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-accent outline-none" placeholder="e.g. Biceps" />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-white/40 uppercase tracking-widest mb-1 block">YouTube Tutorial URL</label>
                  <input type="url" required value={formData.youtubeUrl} onChange={e => setFormData({...formData, youtubeUrl: e.target.value})} className="w-full bg-[#27272A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-accent outline-none" placeholder="https://youtube.com/watch?v=..." />
                </div>

                <div>
                  <label className="text-xs text-white/40 uppercase tracking-widest mb-1 block">Description</label>
                  <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-[#27272A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-accent outline-none h-24 resize-none" placeholder="Biomechanical details..." />
                </div>

                <button type="submit" className="w-full py-3 bg-green-500/10 text-green-500 border border-green-500/20 hover:bg-green-500 hover:text-black rounded-xl font-bold transition-colors">
                  Add to Fleet
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>

      {/* QR Code Modal */}
      {activeQr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#18181B] border border-white/10 rounded-3xl p-8 max-w-sm w-full relative">
            <button onClick={() => setActiveQr(null)} className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
            
            <div className="text-center mb-6">
              <h3 className="text-2xl font-display font-bold mb-1">{activeQr.name}</h3>
              <p className="text-sm text-white/50">Print this and attach to the machine.</p>
            </div>

            <div className="bg-white p-4 rounded-2xl mb-6">
              <img src={activeQr.url} alt="QR Code" className="w-full h-auto" />
            </div>

            <a 
              href={activeQr.url} 
              download={`${activeQr.name.replace(/\s+/g, '_')}_QR.png`}
              className="w-full flex items-center justify-center gap-2 py-4 bg-accent text-black rounded-xl font-bold hover:opacity-90 transition-opacity"
            >
              <Download className="w-5 h-5" /> Download PNG
            </a>
          </div>
        </div>
      )}

    </div>
  );
}
