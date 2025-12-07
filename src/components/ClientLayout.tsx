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
            // Request existing peers
            socket.emit("request-peers");
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

        function onPeerRequest(requesterSocketId: string) {
            // Someone is asking for our device info
            socket.emit("peer-response", requesterSocketId, myDevice);
        }

        function onPeerLeft(socketId: string) {
            console.log("Peer left:", socketId);
            // Note: We'd need to track socketId -> deviceId mapping for proper removal
            // For now, peers will just stay in list until refresh
        }

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        socket.on("peer-announce", onPeerAnnounce);
        socket.on("peer-request", onPeerRequest);
        socket.on("peer-left", onPeerLeft);

        // Initial connection might happen before listener
        if (socket.connected) onConnect();

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("peer-announce", onPeerAnnounce);
            socket.off("peer-request", onPeerRequest);
            socket.off("peer-left", onPeerLeft);
            // disconnectSocket(); // Keep persistent? usually yes.
        };
    }, [setMyDevice, setConnected, addPeer]);

    return <>{children}</>;
}
