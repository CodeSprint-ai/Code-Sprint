// Session management React hooks
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    fetchSessions,
    revokeSession,
    revokeAllSessions,
    logoutAllDevices,
    changePassword,
    addPassword,
    Session,
    ChangePasswordRequest,
    AddPasswordRequest,
} from '../services/sessionApi';
import { useAuthStore } from '../store/authStore';
import { useRouter } from 'next/navigation';

/**
 * Hook for managing user sessions.
 */
export function useSessions() {
    const queryClient = useQueryClient();

    // Fetch all sessions
    const sessionsQuery = useQuery({
        queryKey: ['sessions'],
        queryFn: fetchSessions,
        staleTime: 30000, // 30 seconds
    });

    // Revoke a specific session
    const revokeSessionMutation = useMutation({
        mutationFn: revokeSession,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sessions'] });
        },
    });

    // Revoke all other sessions
    const revokeAllMutation = useMutation({
        mutationFn: revokeAllSessions,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sessions'] });
        },
    });

    return {
        sessions: sessionsQuery.data || [],
        isLoading: sessionsQuery.isLoading,
        isError: sessionsQuery.isError,
        error: sessionsQuery.error,
        refetch: sessionsQuery.refetch,
        revokeSession: revokeSessionMutation.mutateAsync,
        revokeAllSessions: revokeAllMutation.mutateAsync,
        isRevoking: revokeSessionMutation.isPending || revokeAllMutation.isPending,
    };
}

/**
 * Hook for logout from all devices.
 */
export function useLogoutAllDevices() {
    const { clearAuth } = useAuthStore();
    const router = useRouter();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: logoutAllDevices,
        onSuccess: () => {
            clearAuth();
            queryClient.clear();
            router.replace('/');
        },
    });

    return {
        logoutAll: mutation.mutateAsync,
        isLoggingOut: mutation.isPending,
        error: mutation.error,
    };
}

/**
 * Hook for password management.
 */
export function usePasswordManagement() {
    const changePasswordMutation = useMutation({
        mutationFn: changePassword,
    });

    const addPasswordMutation = useMutation({
        mutationFn: addPassword,
    });

    return {
        changePassword: changePasswordMutation.mutateAsync,
        addPassword: addPasswordMutation.mutateAsync,
        isChanging: changePasswordMutation.isPending,
        isAdding: addPasswordMutation.isPending,
        changeError: changePasswordMutation.error,
        addError: addPasswordMutation.error,
    };
}
