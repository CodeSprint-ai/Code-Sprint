import { useState, useEffect, useCallback } from 'react';

interface CountdownResult {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
    totalSeconds: number;
    formatted: string;
    shortFormatted: string;
}

export function useCountdown(targetDate: string | Date): CountdownResult {
    const calculateTimeLeft = useCallback((): CountdownResult => {
        const target = new Date(targetDate).getTime();
        const now = Date.now();
        const difference = target - now;

        if (difference <= 0) {
            return {
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0,
                isExpired: true,
                totalSeconds: 0,
                formatted: 'Started',
                shortFormatted: 'Live',
            };
        }

        const totalSeconds = Math.floor(difference / 1000);
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        // Format helpers
        const pad = (n: number) => n.toString().padStart(2, '0');

        let formatted: string;
        let shortFormatted: string;

        if (days > 0) {
            formatted = `${days}d ${hours}h ${pad(minutes)}m`;
            shortFormatted = `${days}d ${hours}h`;
        } else if (hours > 0) {
            formatted = `${hours}h ${pad(minutes)}m ${pad(seconds)}s`;
            shortFormatted = `${hours}h ${pad(minutes)}m`;
        } else {
            formatted = `${pad(minutes)}m ${pad(seconds)}s`;
            shortFormatted = `${minutes}m ${seconds}s`;
        }

        return {
            days,
            hours,
            minutes,
            seconds,
            isExpired: false,
            totalSeconds,
            formatted,
            shortFormatted,
        };
    }, [targetDate]);

    const [timeLeft, setTimeLeft] = useState<CountdownResult>(calculateTimeLeft);

    useEffect(() => {
        // Update immediately
        setTimeLeft(calculateTimeLeft());

        // Update every second
        const timer = setInterval(() => {
            const result = calculateTimeLeft();
            setTimeLeft(result);

            // Clear interval if expired
            if (result.isExpired) {
                clearInterval(timer);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [calculateTimeLeft]);

    return timeLeft;
}

// Calculate duration in human-readable format
export function formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 24) {
        const days = Math.floor(hours / 24);
        const remainingHours = hours % 24;
        return `${days}d ${remainingHours}h`;
    }

    if (hours > 0) {
        return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }

    return `${minutes}m`;
}
