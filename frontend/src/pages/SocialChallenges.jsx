import React, { useState } from 'react';
import { 
  Trophy, Flame, Users, CheckCircle2, ShieldCheck, Sparkles,
  Award, ShieldAlert, Heart, Calendar
} from 'lucide-react';

const SocialChallenges = () => {
  
  // Daily community quests progress state
  const [quests, setQuests] = useState([
    { id: 1, name: 'Caloric Lock Protocol', desc: 'Log and maintain today\'s net calorie balance within 100 kcal of your profile target.', reward: '250 XP', progress: 80, completed: false },
    { id: 2, name: 'AI Scanner Pioneer', desc: 'Scan and analyze at least one meal log utilizing AI Vision scanner.', reward: '150 XP', progress: 100, completed: true },
    { id: 3, name: 'Active Depletion Blast', desc: 'Record active workout session resulting in 300+ kcal burnt.', reward: '200 XP', progress: 40, completed: false },
  ]);

  const [leaderboard, setLeaderboard] = useState([
    { rank: 1, name: 'Aether_Hack_99', streak: 42, score: '4,850 XP', active: true },
    { rank: 2, name: 'Vibe_Metabolic', streak: 28, score: '3,920 XP', active: false },
    { rank: 3, name: 'NeonFitnessPilot', streak: 19, score: '3,100 XP', active: false },
    { rank: 4, name: 'CyberTrack99 (You)', streak: 12, score: '2,680 XP', active: true },
    { rank: 5, name: 'AlphaDietitian', streak: 8, score: '1,950 XP', active: false },
  ]);

  const [achievements, setAchievements] = useState([
    { name: 'Streak Pioneer', desc: 'Maintain an active calorie logging streak of 3+ consecutive days.', unlocked: true, icon: Flame, color: 'text-orange-500 bg-orange-500/10 border-orange-500/20' },
    { name: 'AI Visionary', desc: 'Capture or classify your first meal utilizing the AI Image classification model.', unlocked: true, icon: Sparkles, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    { name: 'Macro Strategist', desc: 'Achieve perfect match results matching protein requirements exactly.', unlocked: false, icon: Award, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
  ]);

  const handleClaimQuest = (id) => {
    setQuests(prev => prev.map(q => {
      if (q.id === id) {
        return { ...q, progress: 100, completed: true };
      }
      return q;
    }));
  };

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto min-h-screen pb-24 lg:pb-6">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-1">
          Social Protocols: <span className="text-emerald-400 text-neon-emerald">Health Challenges</span>
        </h1>
        <p className="text-sm text-gray-400 leading-relaxed font-semibold">
          Compete in community nutrition protocols, lock daily quests, and level up your metabolic tier.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Daily Quests ledger (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="text-emerald-400" size={18} />
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Community Quests</h3>
            </div>

            <div className="space-y-4">
              {quests.map((quest) => (
                <div key={quest.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3 hover:border-white/10 transition-all">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-extrabold text-white">{quest.name}</h4>
                      <p className="text-[11px] text-gray-400 leading-relaxed font-semibold mt-1">{quest.desc}</p>
                    </div>
                    <span className="text-[9px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-extrabold shrink-0">
                      Reward: {quest.reward}
                    </span>
                  </div>

                  {/* Progress slide */}
                  <div className="flex items-center gap-4">
                    <div className="flex-1 bg-white/10 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${quest.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-[10px] text-gray-400 font-black tracking-wider w-8 text-right">{quest.progress}%</span>
                  </div>

                  <div className="flex justify-end mt-2">
                    {quest.completed ? (
                      <span className="text-[10px] text-emerald-400 font-black tracking-wider uppercase flex items-center gap-1">
                        <CheckCircle2 size={12} /> Sync Complete
                      </span>
                    ) : (
                      <button
                        onClick={() => handleClaimQuest(quest.id)}
                        className="p-1 px-3 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/30 hover:bg-emerald-500/10 text-[10px] font-bold uppercase text-gray-300 hover:text-emerald-400 transition-all cursor-pointer"
                      >
                        Manually Claim
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gamified active badges achievements */}
          <div className="glass-panel p-6 rounded-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Award className="text-cyan-400" size={18} />
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Biometric Milestones</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {achievements.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className={`p-4 rounded-2xl border flex flex-col items-center text-center justify-between min-h-[160px] relative transition-all ${
                    item.unlocked 
                      ? 'bg-white/5 border-white/5' 
                      : 'bg-black/20 border-white/5 opacity-50'
                  }`}>
                    {/* Unlocked neon light */}
                    {item.unlocked && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>}
                    
                    <div className={`p-3 rounded-2xl ${item.color} mb-2`}>
                      <Icon size={20} className="stroke-[2.2]" />
                    </div>

                    <div>
                      <h4 className="text-xs font-extrabold text-white">{item.name}</h4>
                      <p className="text-[9px] text-gray-400 leading-normal font-semibold mt-1">{item.desc}</p>
                    </div>

                    <span className={`text-[8px] font-extrabold tracking-widest uppercase mt-3.5 px-2 py-0.5 rounded-full ${
                      item.unlocked ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-gray-500'
                    }`}>
                      {item.unlocked ? 'Unlocked' : 'Encrypted'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Global Competitions leaderboard (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 rounded-3xl min-h-[460px] flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <Trophy className="text-cyan-400" size={18} />
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Global Sector Leaderboard</h3>
            </div>

            {/* List members */}
            <div className="flex-1 space-y-3.5 overflow-y-auto">
              {leaderboard.map((userObj) => (
                <div 
                  key={userObj.rank} 
                  className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                    userObj.name.includes('(You)')
                      ? 'bg-gradient-to-tr from-emerald-500/10 to-cyan-500/10 border-emerald-500/30 glow-emerald'
                      : 'bg-white/5 border-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Rank */}
                    <span className={`w-6 text-xs font-black text-center ${
                      userObj.rank === 1 ? 'text-amber-400' : userObj.rank === 2 ? 'text-slate-300' : userObj.rank === 3 ? 'text-amber-600' : 'text-gray-400'
                    }`}>
                      #{userObj.rank}
                    </span>
                    
                    {/* Name */}
                    <div>
                      <h4 className="text-xs font-extrabold text-white">{userObj.name}</h4>
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-0.5 flex items-center gap-1">
                        <Flame size={10} className="text-orange-500" /> {userObj.streak} Days active
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-black text-white">{userObj.score}</span>
                </div>
              ))}
            </div>

            {/* Shield protection details */}
            <div className="mt-6 p-4 rounded-2xl bg-gradient-to-tr from-cyan-500/5 to-emerald-500/5 border border-cyan-500/10 flex items-start gap-2.5">
              <ShieldCheck className="text-cyan-400 shrink-0 mt-0.5" size={14} />
              <p className="text-[9px] text-gray-500 leading-normal font-semibold">
                XP targets are compiled from daily calorie log entries, barcode decrypts, dynamic exercise active burn rates, and active consecutive streak counts. Compete ethically.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default SocialChallenges;
