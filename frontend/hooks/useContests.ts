import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { fetchContests, filtersToParams, ContestQueryParams } from '../services/contestApi';
import { ContestFilters, ContestsApiResponse, ContestTab } from '../types/contest';

const QUERY_KEY = 'contests';
const STALE_TIME = 5 * 60 * 1000; // 5 minutes

export function useContests(
    filters: ContestFilters,
    options?: Omit<UseQueryOptions<ContestsApiResponse>, 'queryKey' | 'queryFn'>
) {
    const params = filtersToParams(filters);

    return useQuery({
        queryKey: [QUERY_KEY, params],
        queryFn: () => fetchContests(params),
        staleTime: STALE_TIME,
        refetchOnWindowFocus: false,
        retry: 2,
        ...options,
    });
}

export function useOngoingContests(
    additionalFilters?: Partial<ContestFilters>,
    options?: Omit<UseQueryOptions<ContestsApiResponse>, 'queryKey' | 'queryFn'>
) {
    return useContests({ tab: 'ongoing', ...additionalFilters }, options);
}

export function useUpcomingContests(
    additionalFilters?: Partial<ContestFilters>,
    options?: Omit<UseQueryOptions<ContestsApiResponse>, 'queryKey' | 'queryFn'>
) {
    return useContests({ tab: 'upcoming', ...additionalFilters }, options);
}

export function useNext24hContests(
    additionalFilters?: Partial<ContestFilters>,
    options?: Omit<UseQueryOptions<ContestsApiResponse>, 'queryKey' | 'queryFn'>
) {
    return useContests({ tab: 'next24h', ...additionalFilters }, options);
}
