"use client";

import { useEffect } from "react";
import { useDeviceStore } from "@/store/useDeviceStore";
import { useSessionStore } from "@/store/useSessionStore";
import { generateDeviceId, generateDeviceName } from "@/lib/utils";
import { getSocket, disconnectSocket } from "@/lib/socket";

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { setMyDevice, addPeer, removePeer } = useDeviceStore();
    const { setConnected } = useSessionStore();

    useEffect(() => {
        // 1. Initialize Identity
        const id = generateDeviceId();
        const name = generateDeviceName();

        // Detect OS/Browser simple check
        const ua = navigator.userAgent;
        let type: 'mobile' | 'desktop' | 'tablet' = 'desktop';
        if (/Mobi|Android/i.test(ua)) type = 'mobile';

        const myDevice = {
            id,
            name,
            type,
            browser: 'Unknown', // Could parse more detailing
            os: 'Unknown',
            lastSeen: Date.now()
        };

        setMyDevice(myDevice);

        // 2. Connect Socket
        const socket = getSocket();

        function onConnect() {
            console.log("Connected to server");
            setConnected(true, socket.id);

            // Announce self
            socket.emit("announce", myDevice);
        }

        function onDisconnect() {
            console.log("Disconnected");
            setConnected(false);
        }

        function onPeerAnnounce(peerDevice: any) {
            if (peerDevice.id === id) return; // Ignore self
            console.log("Peer Discovered:", peerDevice);
            addPeer(peerDevice);
        }

        // We need server to implement 'announce' broadcast. 
        // Currently server.ts only has 'join-room' and 'signal'. we should update server.ts later to support global discovery if we want /devices to work globally or use a 'reset' room.
        // For now let's assume we join a global 'lobby' for discovery.

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        socket.on("peer-announce", onPeerAnnounce);

        // Initial connection might happen before listener
        if (socket.connected) onConnect();

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("peer-announce", onPeerAnnounce);
            // disconnectSocket(); // Keep persistent? usually yes.
        };
    }, [setMyDevice, setConnected, addPeer]);

    return <>{children}</>;
}
