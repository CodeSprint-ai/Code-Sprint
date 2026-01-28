import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Flame, Target, Zap, Crown, Award, Star } from 'lucide-react';

interface LeaderboardRowProps {
  rank: number;
  name: string;
  xp: string;
  avatarColor: string;
  delay: number;
  isUser?: boolean;
}

const LeaderboardRow: React.FC<LeaderboardRowProps> = ({ rank, name, xp, avatarColor, delay, isUser }) => (
  <motion.div 
    initial={{ opacity: 0, x: 20 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.5 }}
    className={`flex items-center gap-4 p-3 rounded-xl border mb-3 transition-colors ${
      isUser 
        ? 'bg-brand-green/10 border-brand-green/30' 
        : 'bg-white/5 border-white/5 hover:bg-white/10'
    }`}
  >
    <div className={`font-bold w-6 text-center ${
      rank === 1 ? 'text-yellow-400' : 
      rank === 2 ? 'text-gray-300' : 
      rank === 3 ? 'text-amber-600' : 'text-gray-500'
    }`}>
      {rank}
    </div>
    <div className={`w-8 h-8 rounded-full ${avatarColor} flex items-center justify-center text-white font-bold text-xs shadow-inner`}>
      {name.charAt(0)}
    </div>
    <div className="flex-1">
        <div className={`text-sm font-medium ${isUser ? 'text-white' : 'text-gray-200'}`}>
            {name} {isUser && <span className="text-[10px] bg-brand-green text-black px-1.5 py-0.5 rounded ml-2 font-bold">YOU</span>}
        </div>
    </div>
    <div className="text-xs font-mono text-brand-green/80 font-bold">{xp} XP</div>
  </motion.div>
);

const Badge = ({ icon: Icon, color, bg, label, delay, x, y }: { icon: any, color: string, bg: string, label: string, delay: number, x: string, y: string }) => (
    <motion.div
        initial={{ scale: 0, opacity: 0, y: 20 }}
        whileInView={{ scale: 1, opacity: 1, y: 0 }}
        whileHover={{ scale: 1.1, y: -5 }}
        transition={{ delay, type: "spring", stiffness: 200, damping: 15 }}
        className={`absolute ${x} ${y} p-3 rounded-2xl ${bg} border border-white/10 backdrop-blur-md shadow-2xl z-20 flex items-center gap-3 cursor-pointer group`}
    >
        <div className={`${color} p-2 rounded-full bg-white/10`}>
            <Icon size={20} />
        </div>
        <div className="hidden sm:block pr-2">
            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-0.5">Unlocked</p>
            <p className="text-sm font-bold text-white whitespace-nowrap">{label}</p>
        </div>
    </motion.div>
)

const Gamification: React.FC = () => {
    return (
        <section className="py-24 relative overflow-hidden">
             {/* Background Effects */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-orange/5 rounded-full blur-[100px] pointer-events-none" />
             
             <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center relative z-10">
                
                {/* Left Content */}
                <div className="order-2 lg:order-1">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-xs font-bold uppercase tracking-wider mb-6">
                            <Trophy size={14} />
                            GAMIFIED MASTERY
                        </div>
                        
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                            Make Coding <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-brand-orange">Addictive.</span>
                        </h2>
                        
                        <p className="text-gray-400 text-lg mb-10 leading-relaxed max-w-lg">
                            Replace doom-scrolling with code-shipping. Maintain your streak, climb the global leaderboards, and earn badges that prove your mastery.
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                            <motion.div 
                                whileHover={{ y: -5 }}
                                className="p-5 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10"
                            >
                                <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-500 mb-4">
                                    <Flame size={24} />
                                </div>
                                <h3 className="text-white font-bold text-lg mb-1">Daily Streaks</h3>
                                <p className="text-sm text-gray-400">Build a habit that sticks.</p>
                            </motion.div>
                            
                            <motion.div 
                                whileHover={{ y: -5 }}
                                className="p-5 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10"
                            >
                                <div className="w-12 h-12 rounded-lg bg-yellow-500/20 flex items-center justify-center text-yellow-500 mb-4">
                                    <Award size={24} />
                                </div>
                                <h3 className="text-white font-bold text-lg mb-1">Skill Badges</h3>
                                <p className="text-sm text-gray-400">Show off your specialized mastery.</p>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>

                {/* Right Visuals */}
                <div className="relative order-1 lg:order-2 flex justify-center lg:block">
                    {/* Main Card - Leaderboard */}
                    <div className="relative bg-[#121214] rounded-3xl border border-white/10 p-6 shadow-2xl z-10 w-full max-w-md backdrop-blur-xl">
                        {/* Card Header */}
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                            <div>
                                <h3 className="text-white font-bold flex items-center gap-2 text-lg">
                                    <Crown size={20} className="text-yellow-500" />
                                    Global League
                                </h3>
                                <p className="text-xs text-gray-500 mt-1">Season 4 ends in 2 days</p>
                            </div>
                            <div className="px-2 py-1 bg-brand-green/10 rounded text-xs text-brand-green font-mono font-bold">
                                DIV 1
                            </div>
                        </div>
                        
                        <LeaderboardRow rank={1} name="Sarah Jenkins" xp="12,450" avatarColor="bg-purple-500" delay={0.1} />
                        <LeaderboardRow rank={2} name="Alex Chen" xp="11,200" avatarColor="bg-blue-500" delay={0.2} />
                        <LeaderboardRow rank={3} name="Mike Ross" xp="10,890" avatarColor="bg-pink-500" delay={0.3} />
                        
                        {/* Divider with label */}
                        <div className="relative py-4">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/5"></div>
                            </div>
                            <div className="relative flex justify-center">
                                <span className="bg-[#121214] px-2 text-[10px] text-gray-500 uppercase tracking-widest">Your Rank</span>
                            </div>
                        </div>

                        <LeaderboardRow rank={42} name="You" xp="8,450" avatarColor="bg-brand-green" delay={0.4} isUser />
                        
                        {/* CTA within card */}
                        <button className="w-full mt-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-semibold transition-colors border border-white/5 flex items-center justify-center gap-2 group">
                            View Full Standings
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    {/* Floating Badges */}
                    <Badge 
                        icon={Flame} 
                        color="text-orange-500" 
                        bg="bg-[#18181B]" 
                        label="30 Day Streak" 
                        delay={0.6} 
                        x="-top-12" 
                        y="-right-4 md:-right-12" 
                    />
                    <Badge 
                        icon={Zap} 
                        color="text-blue-400" 
                        bg="bg-[#18181B]" 
                        label="Speed Demon" 
                        delay={0.8} 
                        x="top-1/2" 
                        y="-left-8 md:-left-16" 
                    />
                    <Badge 
                        icon={Target} 
                        color="text-brand-green" 
                        bg="bg-[#18181B]" 
                        label="Bug Hunter" 
                        delay={1.0} 
                        x="-bottom-8" 
                        y="right-0 md:-right-8" 
                    />
                </div>
             </div>
        </section>
    )
}

// Simple arrow component locally since we are inside the file
const ArrowRight = ({ size, className }: { size: number, className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M5 12h14"></path>
        <path d="m12 5 7 7-7 7"></path>
    </svg>
);

export default Gamification;