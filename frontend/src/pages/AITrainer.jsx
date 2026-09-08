import { useState, useRef, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Send, Sparkles, User, Bot, Loader2 } from 'lucide-react';

export default function AITrainer() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // In Phase 1, we built the POST /api/ai/chat endpoint
      const { data } = await api.post('/ai/chat', { prompt: input });
      
      const aiMessage = { role: 'ai', content: data.response };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Neural link failed. Please try again.');
      // Remove the user message if it failed, or show error in chat
      setMessages((prev) => [...prev, { role: 'ai', content: 'Error: Connection to the Gemini engine was lost. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    "Design a hyper-trophy focused push day.",
    "Analyze the biomechanics of a perfect squat.",
    "I have 30 minutes. Give me an intense HIIT protocol.",
    "What should I eat post-workout for optimal recovery?"
  ];

  if (!user) return null; // Prevent flicker while redirecting

  return (
    <div className="h-screen pt-[48px] flex flex-col bg-[#09090B] text-white selection:bg-accent selection:text-white">
      
      {/* Header */}
      <div className="flex-none px-6 py-4 border-b border-white/10 bg-[#18181B] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent border border-accent/20 shadow-[0_0_15px_rgba(255,107,0,0.2)]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl text-white tracking-wide">Gemini AI Engine</h1>
            <p className="text-xs text-white/40 uppercase tracking-widest">Biomechanics & Strategy</p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-grow overflow-y-auto px-6 py-8 custom-scrollbar relative">
        {/* Subtle background glow */}
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent opacity-[0.02] blur-[150px] rounded-full pointer-events-none z-0"></div>

        <div className="max-w-3xl mx-auto space-y-8 relative z-10">
          
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center pt-20">
              <Sparkles className="w-16 h-16 text-white/10 mb-6" />
              <h2 className="text-3xl font-display font-bold text-white/90 mb-4">Initialize Training Protocol</h2>
              <p className="text-white/50 max-w-md mx-auto mb-10 leading-relaxed">
                Your personal intelligent coach is online. Ask for tailored workouts, form correction, or nutritional strategies.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                {quickPrompts.map((prompt, idx) => (
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

          {isLoading && (
            <div className="flex gap-4 justify-start">
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0 mt-1 border border-accent/20">
                <Bot className="w-4 h-4" />
              </div>
              <div className="max-w-[85%] rounded-2xl rounded-tl-sm p-5 bg-[#18181B] border border-white/5 flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-accent animate-spin" />
                <span className="text-white/50 text-sm">Processing biomechanics...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="flex-none p-6 bg-[#09090B] border-t border-white/5 relative z-20">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask the AI Engine..."
              className="w-full bg-[#18181B] border border-white/10 focus:border-accent rounded-full py-4 pl-6 pr-16 text-white placeholder:text-white/30 outline-none transition-colors shadow-2xl"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-accent text-black flex items-center justify-center hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              <Send className="w-4 h-4 ml-1" />
            </button>
          </form>
          <p className="text-center text-white/20 text-[10px] uppercase tracking-widest mt-4">
            Gemini AI can make mistakes. Verify critical protocols.
          </p>
        </div>
      </div>
    </div>
  );
}
