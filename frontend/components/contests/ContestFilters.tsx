'use client';

import { useState } from 'react';
import { Search, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { ContestFilters, POPULAR_PLATFORMS } from '../../types/contest';
import { cn } from '../../lib/utils';

interface ContestFiltersProps {
    filters: ContestFilters;
    onFiltersChange: (filters: ContestFilters) => void;
}

export function ContestFiltersPanel({ filters, onFiltersChange }: ContestFiltersProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [searchValue, setSearchValue] = useState(filters.search || '');

    const handleSearchChange = (value: string) => {
        setSearchValue(value);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onFiltersChange({ ...filters, search: searchValue || undefined });
    };

    const handlePlatformToggle = (platformId: string) => {
        const currentPlatforms = filters.platforms || [];
        const newPlatforms = currentPlatforms.includes(platformId)
            ? currentPlatforms.filter(p => p !== platformId)
            : [...currentPlatforms, platformId];

        onFiltersChange({
            ...filters,
            platforms: newPlatforms.length > 0 ? newPlatforms : undefined
        });
    };

    const handleOrderByChange = (orderBy: 'start' | 'duration' | '-start' | '-duration') => {
        onFiltersChange({ ...filters, orderBy });
    };

    const clearFilters = () => {
        setSearchValue('');
        onFiltersChange({ ...filters, search: undefined, platforms: undefined, orderBy: undefined });
    };

    const hasActiveFilters = !!filters.search || (filters.platforms && filters.platforms.length > 0) || !!filters.orderBy;

    return (
        <div className="space-y-3">
            {/* Search bar */}
            <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                    type="text"
                    placeholder="Search contests..."
                    value={searchValue}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className={cn(
                        'w-full pl-10 pr-4 py-2.5 rounded-lg text-sm',
                        'bg-zinc-800/50 border border-zinc-700 text-white placeholder-zinc-500',
                        'focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20',
                        'transition-all'
                    )}
                />
                {searchValue && (
                    <button
                        type="button"
                        onClick={() => {
                            setSearchValue('');
                            onFiltersChange({ ...filters, search: undefined });
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </form>

            {/* Filter toggle */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={cn(
                        'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all',
                        'text-zinc-400 hover:text-white hover:bg-zinc-800/50',
                        isExpanded && 'bg-zinc-800/50 text-white'
                    )}
                >
                    <Filter className="w-4 h-4" />
                    <span>Filters</span>
                    {hasActiveFilters && (
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 text-xs">
                            {(filters.platforms?.length || 0) + (filters.search ? 1 : 0) + (filters.orderBy ? 1 : 0)}
                        </span>
                    )}
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                        Clear all
                    </button>
                )}
            </div>

            {/* Expanded filters */}
            {isExpanded && (
                <div className="space-y-4 p-4 rounded-lg bg-zinc-800/30 border border-zinc-700/50">
                    {/* Platforms */}
                    <div>
                        <h4 className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">Platforms</h4>
                        <div className="flex flex-wrap gap-2">
                            {POPULAR_PLATFORMS.map((platform) => {
                                const isSelected = filters.platforms?.includes(platform.id);
                                return (
                                    <button
                                        key={platform.id}
                                        onClick={() => handlePlatformToggle(platform.id)}
                                        className={cn(
                                            'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                                            'border',
                                            isSelected
                                                ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400'
                                                : 'bg-zinc-800/50 border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300'
                                        )}
                                    >
                                        {platform.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Sort */}
                    <div>
                        <h4 className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">Sort By</h4>
                        <div className="flex flex-wrap gap-2">
                            {[
                                { id: 'start', label: 'Start Time ↑' },
                                { id: '-start', label: 'Start Time ↓' },
                                { id: 'duration', label: 'Duration ↑' },
                                { id: '-duration', label: 'Duration ↓' },
                            ].map((option) => {
                                const isSelected = filters.orderBy === option.id;
                                return (
                                    <button
                                        key={option.id}
                                        onClick={() => handleOrderByChange(option.id as any)}
                                        className={cn(
                                            'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                                            'border',
                                            isSelected
                                                ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400'
                                                : 'bg-zinc-800/50 border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300'
                                        )}
                                    >
                                        {option.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
