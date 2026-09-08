import { useState, useRef, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Send, Sparkles, User, Bot, Loader2, Dumbbell, Lock } from 'lucide-react';

export default function AITrainer() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Tabs: 'chat' | 'planner'
  const [activeTab, setActiveTab] = useState('chat');
  
  // Chat State
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Planner State
  const [isPlannerLoading, setIsPlannerLoading] = useState(false);
  const [planResult, setPlanResult] = useState(null);
  const [formData, setFormData] = useState({
    age: 25,
    height: 175,
    weight: 70,
    gender: 'male',
    goal: 'build_muscle',
    fitnessLevel: 'intermediate',
    daysPerWeek: 4,
    workoutDuration: 60,
    equipmentAvailable: 'full_gym'
  });

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    if (activeTab === 'chat') scrollToBottom();
  }, [messages, isChatLoading, activeTab]);

  const handleChatSend = async (e) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsChatLoading(true);

    try {
      const { data } = await api.post('/ai/chat', { prompt: input });
      setMessages((prev) => [...prev, { role: 'ai', content: data.response }]);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Neural link failed. Please try again.');
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleGeneratePlan = async (e) => {
    e.preventDefault();
    setIsPlannerLoading(true);
    setPlanResult(null);

    try {
      const { data } = await api.post('/ai/plan', formData);
      setPlanResult(data);
      toast.success("Protocol Generated Successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate plan.');
    } finally {
      setIsPlannerLoading(false);
    }
  };

  if (!user) return null;

  const isPremium = user.role === 'admin' || user.membershipStatus === 'active';

  return (
    <div className="h-screen pt-[48px] flex flex-col bg-[#09090B] text-white selection:bg-accent selection:text-white">
      
      {/* Header */}
      <div className="flex-none px-6 py-4 border-b border-white/10 bg-[#18181B] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent border border-accent/20 shadow-[0_0_15px_rgba(255,107,0,0.2)]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl text-white tracking-wide">Gemini AI Engine</h1>
            <p className="text-xs text-white/40 uppercase tracking-widest">Biomechanics & Strategy</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-[#09090B] rounded-full p-1 border border-white/10 w-full md:w-auto justify-center">
          <button 
            onClick={() => setActiveTab('chat')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'chat' ? 'bg-[#18181B] text-white shadow-md border border-white/5' : 'text-white/50 hover:text-white/80'}`}
          >
            Chat Assistant
          </button>
          <button 
            onClick={() => setActiveTab('planner')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'planner' ? 'bg-[#18181B] text-white shadow-md border border-white/5' : 'text-white/50 hover:text-white/80'}`}
          >
            <Dumbbell className="w-4 h-4" />
            Plan Generator
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow overflow-y-auto px-6 py-8 custom-scrollbar relative">
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent opacity-[0.02] blur-[150px] rounded-full pointer-events-none z-0"></div>

        <div className="max-w-3xl mx-auto relative z-10 h-full flex flex-col">
          
          {/* TAB 1: CHAT */}
          {activeTab === 'chat' && (
            <div className="space-y-8 flex-grow">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center pt-20">
                  <Sparkles className="w-16 h-16 text-white/10 mb-6" />
                  <h2 className="text-3xl font-display font-bold text-white/90 mb-4">Initialize Training Protocol</h2>
                  <p className="text-white/50 max-w-md mx-auto mb-10 leading-relaxed">
                    Your personal intelligent coach is online. Ask for tailored workouts, form correction, or nutritional strategies.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    {["Design a push day.", "Analyze a squat.", "Give me a HIIT protocol.", "Optimal post-workout nutrition?"].map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => setInput(prompt)}
                        className="p-4 rounded-2xl bg-[#18181B] border border-white/5 hover:border-accent/50 hover:bg-white/5 transition-all text-left group"
                      >
                        <p className="text-white/70 text-sm group-hover:text-white transition-colors">{prompt}</p>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'ai' && (
                      <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0 mt-1 border border-accent/20">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}
                    <div 
                      className={`max-w-[85%] rounded-2xl p-5 leading-relaxed text-sm shadow-xl ${
                        msg.role === 'user' 
                          ? 'bg-gradient-to-br from-[#3F3F46] to-[#27272A] border border-white/10 text-white/90 rounded-tr-sm' 
                          : 'bg-[#18181B] border border-white/5 text-white/80 rounded-tl-sm'
                      }`}
                      style={{ whiteSpace: 'pre-wrap' }}
                    >
                      {msg.content}
                    </div>
                    {msg.role === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 shrink-0 mt-1">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                ))
              )}

              {isChatLoading && (
                <div className="flex gap-4 justify-start">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0 mt-1 border border-accent/20"><Bot className="w-4 h-4" /></div>
                  <div className="max-w-[85%] rounded-2xl rounded-tl-sm p-5 bg-[#18181B] border border-white/5 flex items-center gap-3">
                    <Loader2 className="w-5 h-5 text-accent animate-spin" />
                    <span className="text-white/50 text-sm">Processing biomechanics...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* TAB 2: PLANNER */}
          {activeTab === 'planner' && (
            <div className="flex-grow pb-10">
              {!isPremium ? (
                <div className="h-full flex flex-col items-center justify-center text-center pt-20">
                  <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center text-accent mb-6 border border-accent/20">
                    <Lock className="w-10 h-10" />
                  </div>
                  <h2 className="text-3xl font-display font-bold text-white/90 mb-4">Premium Protocol Locked</h2>
                  <p className="text-white/50 max-w-md mx-auto mb-8 leading-relaxed">
                    The 4-Week AI Plan Generator is exclusively available to active VM Fitness premium members.
                  </p>
                  <Link to="/plans" className="px-8 py-3 bg-accent text-black font-bold rounded-full hover:bg-accent-hover transition-colors">
                    Upgrade to Premium
                  </Link>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="text-center">
                    <h2 className="text-2xl font-display font-bold mb-2">4-Week AI Protocol Generator</h2>
                    <p className="text-white/50 text-sm">Enter your exact metrics and let Gemini engineer your perfect 4-week split.</p>
                  </div>

                  <form onSubmit={handleGeneratePlan} className="bg-[#18181B] p-6 rounded-2xl border border-white/5 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-xs text-white/50 uppercase tracking-wider">Goal</label>
                      <select 
                        value={formData.goal} onChange={e => setFormData({...formData, goal: e.target.value})}
                        className="w-full bg-[#09090B] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-accent"
                      >
                        <option value="lose_fat">Lose Fat</option>
                        <option value="build_muscle">Build Muscle</option>
                        <option value="improve_endurance">Improve Endurance</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs text-white/50 uppercase tracking-wider">Fitness Level</label>
                      <select 
                        value={formData.fitnessLevel} onChange={e => setFormData({...formData, fitnessLevel: e.target.value})}
                        className="w-full bg-[#09090B] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-accent"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>

                    <div className="flex gap-4">
                      <div className="space-y-1 w-1/2">
                        <label className="text-xs text-white/50 uppercase tracking-wider">Age</label>
                        <input type="number" min="1" max="100" required value={formData.age} onChange={e => setFormData({...formData, age: Number(e.target.value)})} className="w-full bg-[#09090B] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-accent" />
                      </div>
                      <div className="space-y-1 w-1/2">
                        <label className="text-xs text-white/50 uppercase tracking-wider">Weight (kg)</label>
                        <input type="number" min="1" max="300" required value={formData.weight} onChange={e => setFormData({...formData, weight: Number(e.target.value)})} className="w-full bg-[#09090B] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-accent" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs text-white/50 uppercase tracking-wider">Days Per Week</label>
                      <input type="number" min="1" max="7" required value={formData.daysPerWeek} onChange={e => setFormData({...formData, daysPerWeek: Number(e.target.value)})} className="w-full bg-[#09090B] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-accent" />
                    </div>

                    <div className="md:col-span-2 pt-4 border-t border-white/5">
                      <button 
                        type="submit" 
                        disabled={isPlannerLoading}
                        className="w-full bg-accent text-black font-bold py-4 rounded-xl flex justify-center items-center gap-2 hover:opacity-90 disabled:opacity-50 transition-opacity"
                      >
                        {isPlannerLoading ? <><Loader2 className="w-5 h-5 animate-spin"/> Processing...</> : <><Sparkles className="w-5 h-5"/> Generate My Protocol</>}
                      </button>
                    </div>
                  </form>

                  {/* Plan Result */}
                  {planResult && (
                    <div className="bg-[#18181B] border border-accent/20 rounded-2xl p-6 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      
                      <div className="space-y-4">
                        <h3 className="text-xl font-display font-bold text-accent border-b border-accent/20 pb-2">Dietary Strategy</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {Object.entries(planResult.dietPlan || {}).map(([meal, food]) => (
                            <div key={meal} className="bg-[#09090B] p-4 rounded-xl border border-white/5">
                              <p className="text-xs text-white/40 uppercase tracking-widest mb-1">{meal}</p>
                              <p className="text-sm text-white/90">{food}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-6">
                        <h3 className="text-xl font-display font-bold text-accent border-b border-accent/20 pb-2">Weekly Protocol</h3>
                        {planResult.weeks?.map((week, idx) => (
                          <div key={idx} className="bg-[#09090B] p-5 rounded-xl border border-white/5 space-y-4">
                            <div className="flex justify-between items-end">
                              <h4 className="font-bold text-lg text-white">Week {week.week}</h4>
                              <span className="text-xs text-white/50 bg-white/5 px-3 py-1 rounded-full">{week.focus}</span>
                            </div>
                            <div className="space-y-3">
                              {week.schedule?.map((day, dIdx) => (
                                <div key={dIdx} className="flex gap-4 border-t border-white/5 pt-3">
                                  <div className="w-20 shrink-0 text-sm font-medium text-white/70">{day.day}</div>
                                  <div className="flex-grow">
                                    <p className="text-sm font-bold text-white/90 mb-1">{day.workout} <span className="text-xs text-white/30 font-normal ml-2">({day.duration})</span></p>
                                    <ul className="text-sm text-white/50 list-disc pl-4 space-y-1">
                                      {day.exercises?.map((ex, eIdx) => <li key={eIdx}>{ex}</li>)}
                                    </ul>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                    </div>
                  )}

                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Input Area (Only for chat) */}
      {activeTab === 'chat' && (
        <div className="flex-none p-6 bg-[#09090B] border-t border-white/5 relative z-20">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleChatSend} className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask the AI Engine..."
                className="w-full bg-[#18181B] border border-white/10 focus:border-accent rounded-full py-4 pl-6 pr-16 text-white placeholder:text-white/30 outline-none transition-colors shadow-2xl"
                disabled={isChatLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isChatLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-accent text-black flex items-center justify-center hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              >
                <Send className="w-4 h-4 ml-1" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
