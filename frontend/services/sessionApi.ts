// Session management API services
import api from './api';

// ==================== TYPES ====================

export interface Session {
    id: string;
    device: string;
    browser: string;
    os: string;
    ipAddress: string;
    location: string | null;
    isCurrent: boolean;
    createdAt: string;
    lastActiveAt: string;
}

export interface SessionsResponse {
    data: Session[];
    message: string;
    success: boolean;
}

export interface RevokeSessionResponse {
    data: { revoked: boolean };
    message: string;
    success: boolean;
}

export interface RevokeAllSessionsResponse {
    data: { sessionsRevoked: number };
    message: string;
    success: boolean;
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
    revokeOtherSessions?: boolean;
}

export interface ChangePasswordResponse {
    data: { message: string; sessionsRevoked?: number };
    message: string;
    success: boolean;
}

export interface AddPasswordRequest {
    newPassword: string;
}

// ==================== SESSION MANAGEMENT ====================

/**
 * Get all active sessions for the current user.
 */
export async function fetchSessions(): Promise<Session[]> {
    const response = await api.get<SessionsResponse>('/auth/sessions');
    return response.data.data;
}

/**
 * Revoke a specific session by ID.
 */
export async function revokeSession(sessionId: string): Promise<boolean> {
    const response = await api.delete<RevokeSessionResponse>(`/auth/sessions/${sessionId}`);
    return response.data.data.revoked;
}

/**
 * Revoke all sessions except the current one.
 */
export async function revokeAllSessions(): Promise<number> {
    const response = await api.post<RevokeAllSessionsResponse>('/auth/sessions/revoke-all');
    return response.data.data.sessionsRevoked;
}

/**
 * Logout from all devices (including current).
 */
export async function logoutAllDevices(): Promise<number> {
    const response = await api.post<RevokeAllSessionsResponse>('/auth/logout-all');
    return response.data.data.sessionsRevoked;
}

// ==================== PASSWORD MANAGEMENT ====================

/**
 * Change password for authenticated user.
 */
export async function changePassword(data: ChangePasswordRequest): Promise<{ message: string; sessionsRevoked?: number }> {
    const response = await api.post<ChangePasswordResponse>('/auth/change-password', data);
    return response.data.data;
}

/**
 * Add password to OAuth-only account.
 */
export async function addPassword(data: AddPasswordRequest): Promise<{ message: string }> {
    const response = await api.post<{ data: { message: string } }>('/auth/add-password', data);
    return response.data.data;
}

// ==================== DEVICE INFO HELPERS ====================

/**
 * Get a friendly device icon name based on device type.
 */
export function getDeviceIcon(device: string): string {
    const d = device?.toLowerCase() || '';
    if (d.includes('mobile')) return '📱';
    if (d.includes('tablet')) return '📱';
    return '💻';
}

/**
 * Get a friendly browser icon based on browser name.
 */
export function getBrowserIcon(browser: string): string {
    const b = browser?.toLowerCase() || '';
    if (b.includes('chrome')) return '🌐';
    if (b.includes('firefox')) return '🦊';
    if (b.includes('safari')) return '🧭';
    if (b.includes('edge')) return '📘';
    return '🌐';
}

/**
 * Format a date as relative time (e.g., "2 hours ago").
 */
export function formatRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

    return date.toLocaleDateString();
}
