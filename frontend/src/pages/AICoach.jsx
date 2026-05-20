import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { 
  Send, MessageSquare, ShieldCheck, Zap, Sparkles, Droplets,
  ChevronRight, Brain, Terminal, Dumbbell
} from 'lucide-react';

const AICoach = () => {
  const { user } = useSelector((state) => state.auth);
  
  const [messages, setMessages] = useState([
    { 
      sender: 'coach', 
      text: `Hello ${user?.username || 'Champion'}! 🚀 I am **AURA**, your BiteAI Personal Health Coach. I have calibrated your biometrics profile. What health, nutrition, or workout protocols shall we optimize today?`,
      time: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [typing, setTyping] = useState(false);
  
  const chatEndRef = useRef(null);

  const QUICK_PROMPTS = [
    { text: 'Protocol Fat Loss (Deficit tips)', icon: Zap },
    { text: 'List High-Protein fuel capsules', icon: Sparkles },
    { text: 'Counter Emotional Eating stress', icon: Brain },
    { text: 'Hydration metrics requirement', icon: Droplets }
  ];

  // Auto scroll to chat end
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const handleSendMessage = async (customText = '') => {
    const textToSend = customText || inputText;
    if (!textToSend.trim()) return;

    // Append user message
    const userMsg = { sender: 'user', text: textToSend, time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setTyping(true);

    // Simulated coaching latency
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      const res = await axios.post('/api/coach/chat', { message: textToSend });
      if (res.data.success) {
        setMessages(prev => [...prev, {
          sender: 'coach',
          text: res.data.reply,
          time: new Date()
        }]);
      }
    } catch (error) {
      console.error('Coaching Core offline:', error);
      setMessages(prev => [...prev, {
        sender: 'coach',
        text: '❌ **Telemetry Link Error**. Neural connection failed. Reconnecting biometric uplink...',
        time: new Date()
      }]);
    } finally {
      setTyping(false);
    }
  };

  const formatText = (text) => {
    // Process simple markdown structures (bold, bullet points, numbers)
    return text.split('\n').map((line, idx) => {
      let formattedLine = line;
      // Bold matches **text**
      const boldRegex = /\*\*(.*?)\*\*/g;
      formattedLine = formattedLine.replace(boldRegex, '<strong class="text-emerald-400 font-extrabold">$1</strong>');
      
      if (line.trim().startsWith('-')) {
        return (
          <li key={idx} className="ml-4 list-disc text-sm text-gray-300 py-0.5 leading-relaxed" dangerouslySetInnerHTML={{ __html: formattedLine.replace('-', '').trim() }} />
        );
      }
      if (/^\d+\./.test(line.trim())) {
        const itemContent = line.replace(/^\d+\./, '').trim();
        return (
          <li key={idx} className="ml-4 list-decimal text-sm text-gray-300 py-0.5 leading-relaxed" dangerouslySetInnerHTML={{ __html: itemContent }} />
        );
      }
      return (
        <p key={idx} className="text-sm text-gray-300 py-1 leading-relaxed" dangerouslySetInnerHTML={{ __html: formattedLine }} />
      );
    });
  };

  return (
    <div className="flex-1 p-6 flex flex-col h-[calc(100vh-73px)] overflow-hidden pb-24 lg:pb-6">
      
      {/* Title Header */}
      <div className="shrink-0 mb-4 flex items-center justify-between border-b border-white/5 pb-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-0.5">
            Aura Coach: <span className="text-emerald-400 text-neon-emerald">AI Medical Uplink</span>
          </h1>
          <p className="text-sm text-gray-400 leading-relaxed font-semibold">
            Fully conversational bio-hacking recommendations engine.
          </p>
        </div>

        {/* Status Bubble */}
        <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></div>
          <span className="text-[10px] text-emerald-400 font-black uppercase tracking-widest">Neural Link Syncing</span>
        </div>
      </div>

      {/* Main Grid splits Chat Console and Bio metrics summary */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 overflow-hidden">
        
        {/* Chat Interface Console (Left Column) */}
        <div className="lg:col-span-3 glass-panel rounded-3xl p-4 flex flex-col justify-between overflow-hidden relative">
          
          {/* Scrollable messages area */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4">
            {messages.map((msg, i) => (
              <div 
                key={i} 
                className={`flex gap-3 max-w-[85%] ${
                  msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                {/* Profile bubble */}
                <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-black shadow-md ${
                  msg.sender === 'user' 
                    ? 'bg-gradient-to-tr from-emerald-500 to-cyan-500 text-black' 
                    : 'bg-white/5 text-emerald-400 border border-white/10'
                }`}>
                  {msg.sender === 'user' ? user?.username?.[0]?.toUpperCase() || 'U' : 'A'}
                </div>

                {/* Message Box */}
                <div className={`p-4 rounded-2xl border ${
                  msg.sender === 'user'
                    ? 'bg-emerald-500/10 border-emerald-500/20 rounded-tr-none'
                    : 'bg-white/5 border-white/5 rounded-tl-none'
                }`}>
                  {formatText(msg.text)}
                  <span className="block text-[8px] text-gray-500 font-bold uppercase tracking-wider mt-2.5">
                    {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}

            {/* Simulated Typing Bubble */}
            {typing && (
              <div className="flex gap-3 max-w-[85%] mr-auto">
                <div className="w-8 h-8 rounded-xl bg-white/5 text-emerald-400 border border-white/10 flex items-center justify-center text-xs font-black shrink-0">
                  A
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 rounded-tl-none flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Prompt capsules & text area */}
          <div className="shrink-0 space-y-4">
            
            {/* Quick Prompts list */}
            {messages.length === 1 && (
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 pl-1">Interactive Diagnostic Prompts</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {QUICK_PROMPTS.map((qp, idx) => {
                    const Icon = qp.icon;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(qp.text)}
                        className="p-3 text-left rounded-2xl bg-white/5 border border-white/5 hover:border-emerald-500/30 hover:bg-emerald-500/10 text-xs font-bold text-gray-300 hover:text-emerald-400 transition-all cursor-pointer flex items-center gap-2"
                      >
                        <Icon size={14} className="stroke-[2.2] shrink-0" />
                        <span>{qp.text}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Messaging Input */}
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
              className="flex gap-2"
            >
              <input
                type="text"
                placeholder="Submit query to Aura Coach console..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 px-4 py-3 glass-input text-sm text-white"
                disabled={typing}
              />
              <button
                type="submit"
                disabled={typing || !inputText.trim()}
                className="p-3.5 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 hover:scale-105 text-black font-extrabold cursor-pointer transition-all disabled:opacity-40"
              >
                <Send size={16} />
              </button>
            </form>
          </div>

        </div>

        {/* AI Health Guidelines Panel (Right Column) */}
        <div className="hidden lg:flex flex-col gap-6">
          
          <div className="glass-panel p-6 rounded-3xl relative overflow-hidden flex-1">
            <div className="flex items-center gap-2 mb-4">
              <Terminal className="text-cyan-400" size={18} />
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Coaching Telemetry</h3>
            </div>

            <div className="space-y-4">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Daily Calorie Target</p>
                <p className="text-lg font-black text-white mt-0.5">{user?.dailyCalorieGoal || 2000} kcal</p>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Hydration Benchmark</p>
                <p className="text-lg font-black text-white mt-0.5">3.5 Liters</p>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Nutrient Intake Balance</p>
                <div className="space-y-2 mt-2">
                  <div className="flex justify-between text-[10px] text-gray-400 font-medium">
                    <span>Protein</span>
                    <span>{user?.proteinGoal || 130}g</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1">
                    <div className="bg-cyan-400 h-full w-[60%] rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-tr from-emerald-500/5 to-cyan-500/5 border border-emerald-500/10">
                <div className="flex items-center gap-2 mb-2 text-emerald-400 font-bold text-xs uppercase">
                  <ShieldCheck size={14} /> Neural Guard active
                </div>
                <p className="text-[10px] text-gray-400 leading-normal font-semibold">
                  Aura AI is optimized for cellular bio-hacking, physical performance training, and cortisol level management.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default AICoach;
