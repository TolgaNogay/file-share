import { create } from 'zustand';

interface SessionState {
    isConnected: boolean;
    socketId: string | null;
    roomId: string | null;
    setConnected: (connected: boolean, socketId?: string) => void;
    setRoomId: (roomId: string | null) => void;
}

export const useSessionStore = create<SessionState>((set) => ({
    isConnected: false,
    socketId: null,
    roomId: null,
    setConnected: (isConnected, socketId) =>
        set({ isConnected, socketId: socketId || null }),
    setRoomId: (roomId) => set({ roomId }),
}));
