import { create } from 'zustand';

export interface FileTransfer {
    id: string;
    file: File;
    name: string;
    size: number;
    type: string;
    status: 'queued' | 'sending' | 'receiving' | 'completed' | 'error';
    progress: number; // 0 to 100
    speed: number; // bytes per second
    timeRemaining?: number; // seconds
    error?: string;
    chunksTransferred: number;
    totalChunks: number;
}

interface TransferState {
    transfers: FileTransfer[];
    totalSpeed: number; // Combined speed
    addTransfer: (transfer: FileTransfer) => void;
    updateTransfer: (id: string, data: Partial<FileTransfer>) => void;
    removeTransfer: (id: string) => void;
    resetTransfers: () => void;
}

export const useTransferStore = create<TransferState>((set) => ({
    transfers: [],
    totalSpeed: 0,
    addTransfer: (transfer) =>
        set((state) => ({ transfers: [...state.transfers, transfer] })),
    updateTransfer: (id, data) =>
        set((state) => ({
            transfers: state.transfers.map((t) =>
                t.id === id ? { ...t, ...data } : t
            ),
        })),
    removeTransfer: (id) =>
        set((state) => ({
            transfers: state.transfers.filter((t) => t.id !== id),
        })),
    resetTransfers: () => set({ transfers: [], totalSpeed: 0 }),
}));
