import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Plans from './pages/Plans';
import AITrainer from './pages/AITrainer';
import EquipmentDirectory from './pages/EquipmentDirectory';
import EquipmentDetail from './pages/EquipmentDetail';
import Dashboard from './pages/Dashboard';
import AdminPortal from './pages/AdminPortal';

function App() {
  const [scrolled, setScrolled] = useState(false);
  const { user } = useContext(AuthContext); // Access user state for navbar

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#09090B] text-white flex flex-col font-sans">
        
        {/* Apple-style ultra-slim glassmorphism Navbar */}
        <nav 
          className={`fixed w-full top-0 z-50 transition-all duration-300 flex justify-between items-center px-6 md:px-12 h-[48px] ${
            scrolled ? 'bg-[#09090B]/80 backdrop-blur-md border-b border-white/10' : 'bg-transparent border-b border-transparent'
          }`}
        >
          <Link to="/" className="flex items-center gap-2">
            <span className="text-accent font-bold tracking-wider text-sm">VM</span>
            <span className="text-white tracking-widest text-sm">FITNESS</span>
          </Link>

          <div className="hidden md:flex gap-8 items-center text-[13px] text-white/60">
            <Link to="/" className="hover:text-white/90 transition-opacity hover:border-b hover:border-accent pb-[1px]">Overview</Link>
            <Link to="/plans" className="hover:text-white/90 transition-opacity hover:border-b hover:border-accent pb-[1px]">Memberships</Link>
            <Link to="/ai-trainer" className="hover:text-white/90 transition-opacity hover:border-b hover:border-accent pb-[1px]">AI Engine</Link>
            <Link to="/equipment" className="hover:text-white/90 transition-opacity hover:border-b hover:border-accent pb-[1px]">Equipment</Link>
            {user && user.role === 'admin' && (
              <Link to="/admin" className="text-red-500 hover:text-red-400 font-bold transition-opacity hover:border-b hover:border-red-500 pb-[1px]">Control Room</Link>
            )}
          </div>

          <div className="flex items-center">
            {user ? (
              <Link to="/dashboard" className="px-5 py-1.5 rounded-full border border-accent text-accent hover:bg-accent hover:text-black transition-colors text-xs font-bold tracking-wider uppercase">
                Dashboard
              </Link>
            ) : (
              <Link to="/login" className="px-5 py-1.5 rounded-full border border-white/20 text-white hover:bg-white hover:text-black transition-colors text-xs font-bold tracking-wider uppercase">
                Member Login
              </Link>
            )}
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-grow flex flex-col">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/plans" element={<Plans />} />
            <Route path="/ai-trainer" element={<AITrainer />} />
            <Route path="/equipment" element={<EquipmentDirectory />} />
            <Route path="/equipment/:id" element={<EquipmentDetail />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<AdminPortal />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
