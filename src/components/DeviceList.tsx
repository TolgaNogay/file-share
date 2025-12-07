"use client";

import { useDeviceStore } from "@/store/useDeviceStore";
import { DeviceCard } from "./DeviceCard";
import { Loader2 } from "lucide-react";

export function DeviceList() {
    const { myDevice, knownPeers } = useDeviceStore();

    const handleConnect = (device: any) => {
        // In a real P2P scenario, clicking could initiate a handshake.
        // For now we just log, or maybe navigate to /send?
        console.log("Connect to", device);
        // Router push to send/transfer flow? 
        // Or just select as target.
    };

    if (!myDevice) return null;

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Show My Device First */}
            <DeviceCard device={myDevice} isMe />

            {/* Show Peers */}
            {knownPeers.map((peer) => (
                <DeviceCard
                    key={peer.id}
                    device={peer}
                    onConnect={handleConnect}
                />
            ))}

            {knownPeers.length === 0 && (
                <div className="col-span-full py-12 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-xl">
                    <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary/50" />
                    <p>Yerel ağda cihazlar aranıyor...</p>
                    <p className="text-sm opacity-70">Başka bir cihazda bu uygulamayı açın.</p>
                </div>
            )}
        </div>
    );
}
