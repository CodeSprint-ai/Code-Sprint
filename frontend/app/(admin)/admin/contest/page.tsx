'use client';

import { useState, useMemo } from 'react';
import { LayoutGrid, List, RefreshCw, AlertTriangle } from 'lucide-react';
import { ContestCard } from '@/components/contests/ContestCard';
import { ContestTable } from '@/components/contests/ContestTable';
import { ContestTabs } from '@/components/contests/ContestTabs';
import { ContestFiltersPanel } from '@/components/contests/ContestFilters';
import { useContests, useOngoingContests, useUpcomingContests, useNext24hContests } from '@/hooks/useContests';
import { Contest, ContestFilters, ContestTab } from '@/types/contest';
import { cn } from '@/lib/utils';

type ViewMode = 'cards' | 'table';

export default function ContestPage() {
  const [activeTab, setActiveTab] = useState<ContestTab>('upcoming');
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [filters, setFilters] = useState<ContestFilters>({ tab: activeTab });

  // Update filters when tab changes
  const handleTabChange = (tab: ContestTab) => {
    setActiveTab(tab);
    setFilters(prev => ({ ...prev, tab }));
  };

  const handleFiltersChange = (newFilters: ContestFilters) => {
    setFilters(newFilters);
  };

  // Fetch data for active tab
  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
    refetch
  } = useContests(filters);

  // Fetch counts for tabs (lightweight queries)
  const { data: ongoingData } = useOngoingContests({ limit: 1 });
  const { data: next24hData } = useNext24hContests({ limit: 1 });
  const { data: upcomingData } = useUpcomingContests({ limit: 1 });

  const tabCounts = useMemo(() => ({
    ongoing: ongoingData?.meta?.total ?? 0,
    next24h: next24hData?.meta?.total ?? 0,
    upcoming: upcomingData?.meta?.total ?? 0,
  }), [ongoingData, next24hData, upcomingData]);

  const contests = data?.data ?? [];
  const meta = data?.meta;

  const handleRemindMe = (contest: Contest) => {
    // Store reminder in localStorage
    const reminders = JSON.parse(localStorage.getItem('contestReminders') || '[]');
    if (!reminders.includes(contest.id)) {
      reminders.push(contest.id);
      localStorage.setItem('contestReminders', JSON.stringify(reminders));
    }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-zinc-950">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">
                Programming Contests
              </h1>
              <p className="text-zinc-400 text-sm mt-0.5">
                Discover and track coding competitions worldwide
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* View toggle */}
              <div className="flex items-center rounded-lg bg-zinc-800/50 border border-zinc-700 p-1">
                <button
                  onClick={() => setViewMode('cards')}
                  className={cn(
                    'p-2 rounded-md transition-colors',
                    viewMode === 'cards'
                      ? 'bg-zinc-700 text-white'
                      : 'text-zinc-400 hover:text-white'
                  )}
                  title="Card view"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={cn(
                    'p-2 rounded-md transition-colors',
                    viewMode === 'table'
                      ? 'bg-zinc-700 text-white'
                      : 'text-zinc-400 hover:text-white'
                  )}
                  title="Table view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Refresh */}
              <button
                onClick={() => refetch()}
                disabled={isFetching}
                className={cn(
                  'p-2 rounded-lg transition-colors',
                  'bg-zinc-800/50 border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-700/50',
                  isFetching && 'animate-spin'
                )}
                title="Refresh"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 px-6 py-4 overflow-y-auto">
        {/* Tabs */}
        <div className="mb-4">
          <ContestTabs
            activeTab={activeTab}
            onTabChange={handleTabChange}
            counts={tabCounts}
          />
        </div>

        {/* Filters */}
        <div className="mb-4">
          <ContestFiltersPanel
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />
        </div>

        {/* Meta info */}
        {meta && (
          <div className="flex items-center justify-between mb-4 text-sm text-zinc-500">
            <span>
              {meta.total} contest{meta.total !== 1 ? 's' : ''} found
              {meta.source && meta.source !== 'error' && (
                <span className="ml-2 text-xs">
                  via {meta.source}
                  {meta.cached && ` (cached ${meta.cacheAge}s ago)`}
                </span>
              )}
            </span>
          </div>
        )}

        {/* Error state */}
        {isError && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Failed to load contests</h3>
            <p className="text-zinc-400 max-w-md mb-4">
              {data?.error || (error as any)?.message || 'Something went wrong. Please try again.'}
            </p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-12 h-12 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin mb-4" />
            <p className="text-zinc-400">Loading contests...</p>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !isError && contests.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
              <LayoutGrid className="w-8 h-8 text-zinc-600" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No contests found</h3>
            <p className="text-zinc-400 max-w-md">
              {activeTab === 'ongoing'
                ? "There are no live contests right now. Check back later!"
                : activeTab === 'next24h'
                  ? "No contests starting in the next 24 hours."
                  : "No upcoming contests match your filters."}
            </p>
          </div>
        )}

        {/* Content */}
        {!isLoading && !isError && contests.length > 0 && (
          viewMode === 'cards' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {contests.map((contest) => (
                <ContestCard
                  key={contest.id}
                  contest={contest}
                  onRemindMe={handleRemindMe}
                />
              ))}
            </div>
          ) : (
            <ContestTable
              contests={contests}
              onRemindMe={handleRemindMe}
            />
          )
        )}
      </div>
    </div>
  );
}