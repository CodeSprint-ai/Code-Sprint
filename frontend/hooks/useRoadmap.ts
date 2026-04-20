import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { RoadmapData } from '@/types/roadmap';

/**
 * Fetch the user's personalized roadmap from the backend.
 * Auto-refreshes every 5 minutes.
 */
export function useRoadmap(userUuid: string | undefined) {
    const query = useQuery<RoadmapData>({
        queryKey: ['roadmap', userUuid],
        queryFn: async () => {
            const response = await api.get<RoadmapData>(`/roadmap/${userUuid}`);
            return response.data;
        },
        enabled: !!userUuid,
        refetchInterval: 5 * 60 * 1000, // refresh every 5 min
        staleTime: 2 * 60 * 1000,       // consider data stale after 2 min
    });

    return {
        roadmap: query.data,
        loading: query.isLoading,
        error: query.error,
        refetch: query.refetch,
    };
}
