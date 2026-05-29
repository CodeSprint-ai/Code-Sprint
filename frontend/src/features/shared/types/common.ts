export interface ApiResponse<T> {
    data: T;
    message?: string;
    meta?: any;
    statusCode?: number;
}
