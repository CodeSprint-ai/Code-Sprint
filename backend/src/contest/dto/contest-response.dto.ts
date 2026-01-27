export interface ContestResponseDto {
    id: number;
    event: string;
    host: string;
    href: string;
    start: string;
    end: string;
    duration: number; // seconds
    status: 'ongoing' | 'upcoming';
    platform: {
        name: string;
        icon: string;
        url: string;
    };
}

export interface ContestsApiResponse {
    success: boolean;
    data: ContestResponseDto[];
    meta: {
        total: number;
        cached: boolean;
        cacheAge?: number;
        source: 'clist' | 'kontests' | 'cache';
    };
    error?: string;
}
