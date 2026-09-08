import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { ArrowRight, Lock, Mail, User } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await register(name, email, password);
      toast.success('Profile created successfully. Welcome to VM Fitness.');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-48px)] flex items-center justify-center bg-[#09090B] px-6 py-20 relative overflow-hidden selection:bg-accent selection:text-white">
      {/* Cinematic subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent opacity-[0.03] blur-[120px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-md bg-[#18181B] border border-white/5 rounded-3xl p-8 md:p-10 shadow-2xl relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-display font-bold text-white tracking-tight mb-2">Request Access</h1>
          <p className="text-white/40 text-sm tracking-wide">Create your profile to join the VM Fitness ecosystem.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-medium text-white/50 uppercase tracking-widest ml-1">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/30">
                <User className="w-5 h-5" />
              </div>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#27272A] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-accent transition-colors placeholder:text-white/20"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-white/50 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/30">
                <Mail className="w-5 h-5" />
              </div>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#27272A] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-accent transition-colors placeholder:text-white/20"
                placeholder="athlete@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-white/50 uppercase tracking-widest ml-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/30">
                <Lock className="w-5 h-5" />
              </div>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#27272A] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-accent transition-colors placeholder:text-white/20"
                placeholder="••••••••"
                minLength="6"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full relative group overflow-hidden rounded-xl mt-4"
          >
            {/* Hover Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-accent to-yellow-500 opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center justify-center gap-2 py-4 text-white font-bold tracking-wide">
              {isLoading ? 'Creating Profile...' : 'Create Profile'}
              {!isLoading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </div>
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-white/40 text-sm">
            Already have an access profile?{' '}
            <Link to="/login" className="text-accent hover:text-yellow-500 font-medium transition-colors">
              Initialize Session
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
