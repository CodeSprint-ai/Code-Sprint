import React from 'react';
import { Bell, Zap } from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  user: User;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  return (
    <header className="sticky top-0 z-10 h-20 px-8 flex items-center justify-end border-b border-white/5 bg-black/60 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      
      <div className="flex items-center gap-8">
        {/* Stats */}
        <div className="hidden md:flex items-center gap-6">
             <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 hover:border-green-500/30 transition-colors cursor-default">
                <Zap className="w-4 h-4 text-green-500 fill-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                <div>
                    <div className="text-xs font-bold text-white leading-none">12</div>
                    <div className="text-[10px] text-zinc-500 font-medium">Day Streak</div>
                </div>
             </div>
        </div>

        <div className="h-6 w-px bg-white/10"></div>

        {/* User Actions */}
        <div className="flex items-center gap-4">
            <button className="relative text-zinc-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full border-2 border-black shadow-[0_0_8px_#22c55e]"></span>
            </button>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-green-500/50 to-zinc-800 p-[1px] shadow-[0_0_10px_rgba(34,197,94,0.3)]">
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-black">
                    <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="w-full h-full object-cover"
                    />
                </div>
              </div>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;