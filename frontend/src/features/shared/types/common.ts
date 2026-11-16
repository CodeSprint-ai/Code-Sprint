export interface ApiResponse<T> {
    data: T;
    message?: string;
    meta?: Record<string, unknown>;
    statusCode?: number;
}
