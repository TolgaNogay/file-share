import { create } from 'zustand';

export interface Device {
    id: string;
    name: string;
    type: 'mobile' | 'desktop' | 'tablet';
    browser: string;
    os: string;
    ip?: string; // Hidden from UI, used internally if needed
    lastSeen: number;
}

interface DeviceState {
    myDevice: Device | null;
    knownPeers: Device[];
    setMyDevice: (device: Device) => void;
    addPeer: (device: Device) => void;
    removePeer: (deviceId: string) => void;
    updatePeer: (deviceId: string, data: Partial<Device>) => void;
}

export const useDeviceStore = create<DeviceState>((set) => ({
    myDevice: null,
    knownPeers: [],
    setMyDevice: (device) => set({ myDevice: device }),
    addPeer: (device) =>
        set((state) => {
            if (state.knownPeers.find((p) => p.id === device.id)) return state;
            return { knownPeers: [...state.knownPeers, device] };
        }),
    removePeer: (deviceId) =>
        set((state) => ({
            knownPeers: state.knownPeers.filter((p) => p.id !== deviceId),
        })),
    updatePeer: (deviceId, data) =>
        set((state) => ({
            knownPeers: state.knownPeers.map((p) =>
                p.id === deviceId ? { ...p, ...data } : p
            ),
        })),
}));
