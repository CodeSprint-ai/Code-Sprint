import React from 'react';
import { LayoutDashboard, FileCode, ListTodo, Trophy, User, Zap, LogOut, Terminal, Sparkles } from 'lucide-react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const menuItems = [
    { id: ViewState.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: ViewState.SPRINT, label: 'Sprint Mode', icon: Zap },
    { id: ViewState.PROBLEMS, label: 'Problems', icon: ListTodo },
    { id: ViewState.SUBMISSIONS, label: 'Submissions', icon: FileCode },
    { id: ViewState.CONTEST, label: 'Contest', icon: Trophy },
    { id: ViewState.PROFILE, label: 'Profile', icon: User },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-black/80 backdrop-blur-xl border-r border-white/5 flex flex-col z-20 shadow-[5px_0_30px_-5px_rgba(0,0,0,0.8)]">
      {/* Brand */}
      <div className="h-24 flex items-center px-8 relative overflow-hidden">
        {/* Glow behind logo */}
        <div className="absolute top-1/2 left-8 w-10 h-10 bg-green-500/40 blur-[30px] rounded-full pointer-events-none"></div>
        
        <div className="flex items-center gap-3 group cursor-pointer relative z-10">
          <div className="relative flex items-center justify-center w-10 h-10 bg-black border border-green-500/30 rounded-xl shadow-[0_0_15px_rgba(34,197,94,0.3)] group-hover:shadow-[0_0_25px_rgba(34,197,94,0.6)] transition-all duration-300">
            <Terminal className="text-green-400 w-5 h-5 drop-shadow-[0_0_5px_rgba(34,197,94,0.8)]" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-black rounded-full flex items-center justify-center border border-green-500/30">
                 <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_5px_#4ade80]"></div>
            </div>
          </div>
          <div>
            <span className="block text-lg font-bold tracking-tight text-white leading-none drop-shadow-md">
              CodeSprint
            </span>
            <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest bg-green-500/10 px-1.5 py-0.5 rounded mt-1 inline-block border border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]">
              AI Powered
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2 py-6">
        <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-6 px-4 font-mono">
          Main Menu
        </div>
        {menuItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm rounded-xl transition-all duration-300 group relative overflow-hidden border ${
                isActive 
                  ? 'bg-green-500/10 text-white border-green-500/40 shadow-[0_0_20px_-5px_rgba(34,197,94,0.3)]' 
                  : 'text-zinc-500 border-transparent hover:text-zinc-200 hover:bg-white/[0.03] hover:border-white/5'
              }`}
            >
              {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500 shadow-[0_0_10px_#22c55e]"></div>
              )}
              <item.icon className={`w-[18px] h-[18px] transition-all duration-300 ${isActive ? 'text-green-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
              <span className={`font-medium relative z-10 ${isActive ? 'text-shadow-sm' : ''}`}>{item.label}</span>
              
              {isActive && (
                 <Sparkles className="w-3 h-3 text-green-400 absolute right-3 opacity-80 animate-pulse drop-shadow-[0_0_5px_rgba(34,197,94,1)]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-6">
        <div className="bg-gradient-to-br from-zinc-900 to-black rounded-xl p-4 border border-white/10 mb-4 group hover:border-green-500/30 transition-all cursor-pointer relative overflow-hidden shadow-lg">
             <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
             {/* Shine line */}
             <div className="absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-10 group-hover:animate-shine" />

             <h4 className="text-xs font-bold text-white mb-1 relative z-10 drop-shadow-md">Pro Plan</h4>
             <p className="text-[10px] text-zinc-500 mb-3 relative z-10">Unlock advanced AI analysis</p>
             <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden shadow-inner">
                 <div className="w-3/4 h-full bg-green-500 shadow-[0_0_10px_#22c55e]"></div>
             </div>
        </div>
        <button className="w-full flex items-center gap-3 px-4 py-3 text-zinc-500 hover:text-red-400 transition-colors text-xs font-bold hover:bg-red-950/20 rounded-xl group border border-transparent hover:border-red-500/20 hover:shadow-[0_0_15px_-5px_rgba(239,68,68,0.3)]">
          <LogOut className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          <span>Terminate Session</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;