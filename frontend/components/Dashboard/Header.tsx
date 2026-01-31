"use client";

import React from "react";
import { LogOut, Bell, Zap } from "lucide-react";
import { Button } from "../ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/authStore";
import { useSidebar } from "@/components/ui/sidebar";
import { Menu } from "lucide-react";

const Header = () => {
  const { logout } = useAuth();
  const { user } = useAuthStore();
  const { toggleSidebar } = useSidebar();

  return (
    <header
      className="
        sticky top-0 z-10
        w-full
        h-20
        px-8
        flex items-center justify-between
        border-b border-white/5
        bg-black/60 backdrop-blur-md
        shadow-[0_4px_30px_rgba(0,0,0,0.5)]
      "
    >
      {/* Left: Sidebar Toggle */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="
            relative flex items-center justify-center
            w-10 h-10
            rounded-xl
            bg-white/5
            border border-white/10
            text-zinc-400
            hover:text-green-400
            hover:bg-green-500/10
            hover:border-green-500/30
            hover:shadow-[0_0_15px_rgba(34,197,94,0.3)]
            transition-all duration-300
            group
          "
        >
          <Menu className="w-5 h-5 transition-transform group-hover:scale-110" />
        </button>
      </div>

      {/* Right: Stats & Actions */}
      <div className="flex items-center gap-8">
        {/* Stats (hidden on mobile) */}
        <div className="hidden md:flex items-center gap-6">
          {/* Day Streak */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 hover:border-green-500/30 transition-colors cursor-default">
            <Zap className="w-4 h-4 text-green-500 fill-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
            <div>
              <div className="text-xs font-bold text-white leading-none">12</div>
              <div className="text-[10px] text-zinc-500 font-medium">Day Streak</div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-white/10" />

        {/* User Actions */}
        <div className="flex items-center gap-4">
          {/* Notification Bell */}
          <button className="relative text-zinc-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full border-2 border-black shadow-[0_0_8px_#22c55e]" />
          </button>

          {/* User Avatar */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-green-500/50 to-zinc-800 p-[1px] shadow-[0_0_10px_rgba(34,197,94,0.3)]">
              <div className="w-full h-full rounded-full overflow-hidden border-2 border-black bg-zinc-800 flex items-center justify-center">
                {user?.name ? (
                  <span className="text-sm font-bold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <span className="text-sm font-bold text-white">?</span>
                )}
              </div>
            </div>
          </div>

          {/* Logout Button */}
          {/* <Button
            onClick={async () => await logout()}
            className="
              bg-white/10
              text-white
              border border-white/20
              hover:bg-red-500/20
              hover:border-red-500/30
              transition-all
              duration-300
              flex items-center gap-2
              text-xs font-bold
            "
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </Button> */}
        </div>
      </div>
    </header>
  );
};

export default Header;
