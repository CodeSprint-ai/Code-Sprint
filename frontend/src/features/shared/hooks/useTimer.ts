import { useState, useEffect, useRef } from 'react';

/**
 * Tracks active coding time on a problem.
 * Pauses when tab is hidden or after 30 minutes of inactivity.
 */
export function useTimer() {
    const startTimeRef = useRef<number>(Date.now());
    const accumulatedRef = useRef<number>(0);
    const isActiveRef = useRef<boolean>(true);
    const inactivityTimerRef = useRef<ReturnType<typeof setTimeout>>();

    const INACTIVITY_LIMIT_MS = 30 * 60 * 1000; // 30 minutes

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                accumulatedRef.current += Date.now() - startTimeRef.current;
                isActiveRef.current = false;
            } else {
                startTimeRef.current = Date.now();
                isActiveRef.current = true;
                resetInactivityTimer();
            }
        };

        const resetInactivityTimer = () => {
            clearTimeout(inactivityTimerRef.current);
            inactivityTimerRef.current = setTimeout(() => {
                accumulatedRef.current += Date.now() - startTimeRef.current;
                isActiveRef.current = false;
            }, INACTIVITY_LIMIT_MS);
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        resetInactivityTimer();

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            clearTimeout(inactivityTimerRef.current);
        };
    }, []);

    const getElapsedMs = (): number => {
        return isActiveRef.current
            ? accumulatedRef.current + (Date.now() - startTimeRef.current)
            : accumulatedRef.current;
    };

    return { getElapsedMs };
}
