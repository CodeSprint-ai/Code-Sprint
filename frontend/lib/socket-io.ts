import { io, Socket } from 'socket.io-client';
import { useMemo } from 'react';


let socket: Socket | null = null;


export default function useSocket() {
    const s = useMemo(() => {
        if (!socket) {
            socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000/ws', {
                transports: ['websocket'],
                autoConnect: true,
                withCredentials: true,
            });


            // optionally authenticate using token if needed
            // socket.emit('auth', { token: '...' });
        }
        return socket;
    }, []);


    return s;
}