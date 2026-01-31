import api from './api';
import {
    PublicProfile,
    PrivateProfile,
    UserStats,
    Badge,
    SavedProblem,
    UserPreferences,
    SocialLinks,
} from '../types/profile';
import { ApiResponse } from '../types/common';

// ============== Public Profile APIs ==============

export const getPublicProfile = async (username: string): Promise<PublicProfile> => {
    const { data } = await api.get<ApiResponse<PublicProfile>>(`/profile/${username}`);
    return data.data;
};

export const getPublicStats = async (username: string): Promise<UserStats> => {
    const { data } = await api.get<ApiResponse<UserStats>>(`/profile/${username}/stats`);
    return data.data;
};

export const getPublicBadges = async (username: string): Promise<Badge[]> => {
    const { data } = await api.get<ApiResponse<Badge[]>>(`/profile/${username}/badges`);
    return data.data;
};

// ============== Private Profile APIs ==============

export const getMyProfile = async (): Promise<PrivateProfile> => {
    const { data } = await api.get<ApiResponse<PrivateProfile>>('/profile/me');
    return data.data;
};

export const updateMyProfile = async (profileData: {
    username?: string;
    name?: string;
    avatarUrl?: string;
    bio?: string;
    country?: string;
    socialLinks?: SocialLinks;
}): Promise<{ message: string; username: string }> => {
    const { data } = await api.patch<ApiResponse<{ message: string; username: string }>>('/profile/me', profileData);
    return data.data;
};

export const getMyStats = async (): Promise<UserStats> => {
    const { data } = await api.get<ApiResponse<UserStats>>('/profile/me/stats');
    return data.data;
};

export const recalculateMyStats = async (): Promise<{
    message: string;
    totalSolved: number;
    currentStreak: number;
    maxStreak: number;
}> => {
    const { data } = await api.post<ApiResponse<{
        message: string;
        totalSolved: number;
        currentStreak: number;
        maxStreak: number;
    }>>('/profile/me/stats/recalculate');
    return data.data;
};

export const getMySettings = async (): Promise<UserPreferences> => {
    const { data } = await api.get<ApiResponse<UserPreferences>>('/profile/me/settings');
    return data.data;
};

export const updateMySettings = async (settings: Partial<UserPreferences>): Promise<{ message: string }> => {
    const { data } = await api.patch<ApiResponse<{ message: string }>>('/profile/me/settings', settings);
    return data.data;
};

export const uploadProfileImage = async (file: File): Promise<{ avatarUrl: string; message: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post<ApiResponse<{ avatarUrl: string; message: string }>>('/profile/me/avatar', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return data.data;
};

export const getMyBadges = async (): Promise<Badge[]> => {
    const { data } = await api.get<ApiResponse<Badge[]>>('/profile/me/badges');
    return data.data;
};

// ============== Saved Problems APIs ==============

export const getMySavedProblems = async (): Promise<SavedProblem[]> => {
    const { data } = await api.get<ApiResponse<SavedProblem[]>>('/profile/me/saved-problems');
    return data.data;
};

export const saveProblem = async (problemUuid: string, notes?: string): Promise<{ uuid: string }> => {
    const { data } = await api.post<ApiResponse<{ uuid: string }>>('/profile/me/saved-problems', { problemUuid, notes });
    return data.data;
};

export const updateSavedProblem = async (savedProblemUuid: string, notes?: string): Promise<void> => {
    await api.patch(`/profile/me/saved-problems/${savedProblemUuid}`, { notes });
};

export const removeSavedProblem = async (savedProblemUuid: string): Promise<void> => {
    await api.delete(`/profile/me/saved-problems/${savedProblemUuid}`);
};

// Export all as a namespace for convenience
export const profileApi = {
    getPublicProfile,
    getPublicStats,
    getPublicBadges,
    getMyProfile,
    updateMyProfile,
    uploadProfileImage,
    getMyStats,
    recalculateMyStats,
    getMySettings,
    updateMySettings,
    getMyBadges,
    getMySavedProblems,
    saveProblem,
    updateSavedProblem,
    removeSavedProblem,
};


export default profileApi;
