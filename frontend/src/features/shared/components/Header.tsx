"use client";

import React, { useEffect, useState } from "react";
import { LogOut, Bell, Zap, User, Mail, Shield } from "lucide-react";
import { Button } from "../ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/authStore";
import { useSidebar } from "@/components/ui/sidebar";
import { Menu } from "lucide-react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { getDashboardStats } from "@/services/dashboardApi";
import { ThemeToggle } from "@/components/ThemeToggle";

const Header = () => {
  const { logout } = useAuth();
  const { user } = useAuthStore();
  const { toggleSidebar } = useSidebar();
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const fetchStreak = async () => {
      if (user) {
        const stats = await getDashboardStats();
        setStreak(stats.currentStreak);
      }
    };
    fetchStreak();
  }, [user]);

  return (
    <header
      className="
        sticky top-0 z-10
        w-full
        h-16 sm:h-20
        px-3 sm:px-8
        flex items-center justify-between
        border-b dark:border-white/5 border-zinc-200
        dark:bg-black/60 bg-white/80 backdrop-blur-md
        dark:shadow-[0_4px_30px_rgba(0,0,0,0.5)] shadow-sm
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
            dark:bg-white/5 bg-zinc-100
            border dark:border-white/10 border-zinc-200
            dark:text-zinc-400 text-zinc-600
            hover:text-green-400
            dark:hover:bg-green-500/10 hover:bg-green-50
            dark:hover:border-green-500/30 hover:border-green-300
            hover:shadow-[0_0_15px_rgba(34,197,94,0.3)]
            transition-all duration-300
            group
          "
        >
          <Menu className="w-5 h-5 transition-transform group-hover:scale-110" />
        </button>
      </div>

      {/* Right: Stats & Actions */}
      <div className="flex items-center gap-3 sm:gap-8">
        {/* Stats (hidden on mobile) */}
        <div className="hidden md:flex items-center gap-6">
          {/* Day Streak */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full dark:bg-white/5 bg-zinc-100 border dark:border-white/5 border-zinc-200 dark:hover:border-green-500/30 hover:border-green-300 transition-colors cursor-default">
            <Zap className="w-4 h-4 text-green-500 fill-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
            <div>
              <div className="text-xs font-bold dark:text-white text-zinc-800 leading-none">{streak}</div>
              <div className="text-[10px] dark:text-zinc-500 text-zinc-500 font-medium">Day Streak</div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-6 w-px dark:bg-white/10 bg-zinc-200" />

        {/* User Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notification Bell */}
          {/* <button className="relative dark:text-zinc-400 text-zinc-500 dark:hover:text-white hover:text-zinc-800 transition-colors p-2 dark:hover:bg-white/5 hover:bg-zinc-100 rounded-full">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full border-2 dark:border-black border-white shadow-[0_0_8px_#22c55e]" />
          </button> */}

          {/* User Avatar with Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 cursor-pointer focus:outline-none">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-green-500/50 to-zinc-800 p-[1px] shadow-[0_0_10px_rgba(34,197,94,0.3)] hover:shadow-[0_0_20px_rgba(34,197,94,0.5)] transition-shadow">
                  <div className="w-full h-full rounded-full overflow-hidden border-2 dark:border-black border-white dark:bg-zinc-800 bg-zinc-200 flex items-center justify-center relative">
                    {user?.avatarUrl ? (
                      <Image
                        src={user.avatarUrl}
                        alt={user.name || 'Profile'}
                        fill
                        sizes="36px"
                        className="object-cover"
                        onError={(e) => {
                          // Fallback to initials if image fails to load
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : null}
                    <span className={`text-sm font-bold dark:text-white text-zinc-700 ${user?.avatarUrl ? 'hidden' : ''}`}>
                      {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
                    </span>
                  </div>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-72 dark:bg-zinc-900/95 bg-white backdrop-blur-xl border dark:border-white/10 border-zinc-200 shadow-[0_8px_32px_rgba(0,0,0,0.15)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] rounded-xl p-2"
            >
              {/* User Info Section */}
              <div className="px-3 py-4 mb-2">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-green-500/50 to-zinc-800 p-[2px] shadow-[0_0_15px_rgba(34,197,94,0.4)]">
                    <div className="w-full h-full rounded-full overflow-hidden border-2 dark:border-black border-white dark:bg-zinc-800 bg-zinc-200 flex items-center justify-center relative">
                      {user?.avatarUrl ? (
                        <Image
                          src={user.avatarUrl}
                          alt={user.name || 'Profile'}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      ) : null}
                      <span className={`text-lg font-bold dark:text-white text-zinc-700 ${user?.avatarUrl ? 'hidden' : ''}`}>
                        {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-semibold dark:text-white text-zinc-900 truncate">
                      {user?.name || 'Guest User'}
                    </p>
                    <p className="text-xs dark:text-zinc-400 text-zinc-500 truncate">
                      {user?.email || 'No email'}
                    </p>
                  </div>
                </div>
              </div>

              <DropdownMenuSeparator className="dark:bg-white/10 bg-zinc-200" />

              {/* User Details */}
              <div className="py-2">
                <DropdownMenuLabel className="px-3 py-2 text-xs font-medium dark:text-zinc-500 text-zinc-400 uppercase tracking-wider">
                  Account Info
                </DropdownMenuLabel>

                <div className="px-3 py-2 flex items-center gap-3 dark:text-zinc-300 text-zinc-700">
                  <User className="w-4 h-4 text-green-500" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs dark:text-zinc-500 text-zinc-400">Name</p>
                    <p className="text-sm dark:text-white text-zinc-900 truncate">{user?.name || 'Not set'}</p>
                  </div>
                </div>

                <div className="px-3 py-2 flex items-center gap-3 dark:text-zinc-300 text-zinc-700">
                  <Mail className="w-4 h-4 text-green-500" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs dark:text-zinc-500 text-zinc-400">Email</p>
                    <p className="text-sm dark:text-white text-zinc-900 truncate">{user?.email || 'Not set'}</p>
                  </div>
                </div>

                <div className="px-3 py-2 flex items-center gap-3 dark:text-zinc-300 text-zinc-700">
                  <Shield className="w-4 h-4 text-green-500" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs dark:text-zinc-500 text-zinc-400">Role</p>
                    <p className="text-sm dark:text-white text-zinc-900 capitalize">{user?.role || 'User'}</p>
                  </div>
                </div>
              </div>

              <DropdownMenuSeparator className="dark:bg-white/10 bg-zinc-200" />

              {/* Actions */}
              <div className="py-2">
                <Link href="/profile">
                  <DropdownMenuItem className="px-3 py-2.5 cursor-pointer rounded-lg dark:hover:bg-white/5 hover:bg-zinc-100 dark:text-zinc-300 text-zinc-700 dark:hover:text-white hover:text-zinc-900 transition-colors">
                    <User className="w-4 h-4 mr-3" />
                    View Profile
                  </DropdownMenuItem>
                </Link>

                <DropdownMenuItem
                  onClick={async () => await logout()}
                  className="px-3 py-2.5 cursor-pointer rounded-lg hover:bg-red-500/10 dark:text-zinc-300 text-zinc-700 hover:text-red-400 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Logout
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
