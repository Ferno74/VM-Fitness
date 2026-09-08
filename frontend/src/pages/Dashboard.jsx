import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { CreditCard, Activity, Sparkles, LogOut, User as UserIcon, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    toast.success('Session terminated successfully.');
    navigate('/');
  };

  // Helper to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isActive = user.membershipStatus === 'active';
  const planName = user.membershipType ? user.membershipType.charAt(0).toUpperCase() + user.membershipType.slice(1) : 'None';

  return (
    <div className="min-h-screen bg-[#09090B] text-white pt-24 pb-20 px-6 selection:bg-accent selection:text-white">
      {/* Background Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent opacity-[0.02] blur-[150px] rounded-full pointer-events-none z-0"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/10 pb-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-[#18181B] border border-white/10 flex items-center justify-center text-accent shadow-[0_0_20px_rgba(255,107,0,0.1)]">
              <UserIcon className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-display font-bold tracking-tight mb-2 text-white/90">
                Welcome, {user.name}
              </h1>
              <div className="flex items-center gap-2 text-sm text-white/50">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                Verified Athlete Profile
              </div>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-white/40 hover:text-red-500 transition-colors text-sm font-medium uppercase tracking-widest"
          >
            <LogOut className="w-4 h-4" /> Terminate Session
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Main Status Card (Spans 2 columns) */}
          <div className="md:col-span-2 bg-[#18181B] border border-white/5 rounded-3xl p-8 md:p-10 shadow-xl flex flex-col justify-between relative overflow-hidden">
            {isActive && (
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent opacity-5 blur-[80px] rounded-full pointer-events-none"></div>
            )}
            
            <div>
              <div className="text-[10px] uppercase tracking-widest text-white/40 mb-2">Current Protocol</div>
              <h2 className="text-4xl font-display font-bold text-white/90 mb-6">
                {isActive ? `${planName} Tier` : 'No Active Plan'}
              </h2>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <div className="text-xs text-white/40 uppercase tracking-widest mb-1">Status</div>
                  <div className={`font-bold flex items-center gap-2 ${isActive ? 'text-green-500' : 'text-red-500'}`}>
                    <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                    {isActive ? 'ACTIVE' : 'INACTIVE'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-white/40 uppercase tracking-widest mb-1">Valid Until</div>
                  <div className="font-bold text-white/80">{formatDate(user.membershipExpiry)}</div>
                </div>
              </div>
            </div>

            {!isActive ? (
              <Link to="/plans" className="inline-flex items-center justify-center gap-2 w-full md:w-auto px-8 py-4 bg-gradient-to-r from-accent to-yellow-500 text-black font-bold rounded-xl hover:opacity-90 transition-opacity">
                <CreditCard className="w-5 h-5" /> Initialize Subscription
              </Link>
            ) : (
              <Link to="/plans" className="inline-flex items-center justify-center gap-2 w-full md:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-colors">
                Upgrade Protocol
              </Link>
            )}
          </div>

          {/* Quick Actions / Stats */}
          <div className="flex flex-col gap-6">
            <Link to="/ai-trainer" className="bg-[#18181B] border border-white/5 hover:border-accent/50 rounded-3xl p-6 flex items-start gap-4 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white/90 mb-1">AI Engine</h3>
                <p className="text-xs text-white/50 leading-relaxed">Consult Gemini for biomechanics & nutrition.</p>
              </div>
            </Link>

            <Link to="/equipment" className="bg-[#18181B] border border-white/5 hover:border-accent/50 rounded-3xl p-6 flex items-start gap-4 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white/70 shrink-0 group-hover:scale-110 transition-transform">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white/90 mb-1">Equipment</h3>
                <p className="text-xs text-white/50 leading-relaxed">Browse smart machines and tutorials.</p>
              </div>
            </Link>
            
            <div className="bg-[#18181B] border border-white/5 rounded-3xl p-6 flex-grow flex items-center justify-center text-center">
              <div>
                <div className="text-3xl font-display font-bold text-white/20 mb-1">0</div>
                <div className="text-[10px] uppercase tracking-widest text-white/40">Sessions Logged</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
