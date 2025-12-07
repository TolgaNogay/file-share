import { useEffect, useRef, useState } from "react";
import { useTransferStore } from "@/store/useTransferStore";
import { useSessionStore } from "@/store/useSessionStore";
import { createPeer } from "@/lib/peer";
import { getSocket } from "@/lib/socket";
import { Instance } from "simple-peer";

// Protocol constants
const CHUNK_SIZE = 16 * 1024; // 16KB safe chunk size for WebRTC

export function useTransferEngine(role: 'sender' | 'receiver') {
    const { updateTransfer, addTransfer } = useTransferStore();
    const { roomId } = useSessionStore();
    const peerRef = useRef<Instance | null>(null);
    const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'failed'>('disconnected');

    // Buffer for receiving files
    const receiveBufferRef = useRef<Uint8Array[]>([]);
    const receivedSizeRef = useRef(0);

    const socket = getSocket();

    // Initialize Peer when room/session is ready
    useEffect(() => {
        if (!roomId) return;

        // Sender initiates connection when a receiver joins the room
        const initPeer = (initiator: boolean, targetSocketId?: string) => {
            console.log(`Initializing peer. Initiator: ${initiator}`);
            setConnectionStatus('connecting');

            const peer = createPeer(initiator);
            peerRef.current = peer;

            peer.on("signal", (data: any) => {
                socket.emit("signal", {
                    signal: data,
                    room: roomId,
                    target: targetSocketId
                });
            });

            peer.on("connect", () => {
                console.log("Peer Connected!");
                setConnectionStatus('connected');
                if (role === 'sender') {
                    startSending();
                }
            });

            peer.on("data", (data: Uint8Array) => {
                handleData(data);
            });

            peer.on("error", (err: Error) => {
                console.error("Peer error:", err);
                setConnectionStatus('failed');
            });

            peer.on("close", () => {
                setConnectionStatus('disconnected');
            });
        };

        if (role === 'sender') {
            socket.on("user-connected", (userId: string) => {
                console.log("User connected, starting peer as initiator");
                initPeer(true, userId);
            });

            socket.on("signal", (data: any) => {
                if (peerRef.current && !peerRef.current.destroyed) {
                    peerRef.current.signal(data.signal);
                }
            });

        } else {
            socket.on("signal", (data: any) => {
                console.log("Received signal from sender");
                if (!peerRef.current) {
                    initPeer(false, data.senderId);
                }
                if (peerRef.current && !peerRef.current.destroyed) {
                    peerRef.current.signal(data.signal);
                }
            });
        }

        return () => {
            socket.off("user-connected");
            socket.off("signal");
            if (peerRef.current) peerRef.current.destroy();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomId, role]);

    // Sending Logic
    const startSending = async () => {
        const filesToSend = useTransferStore.getState().transfers.filter((t: any) => t.status === 'queued');

        for (const transfer of filesToSend) {
            if (!peerRef.current) break;

            updateTransfer(transfer.id, { status: 'sending', progress: 0 });

            const metadata = JSON.stringify({
                type: 'metadata',
                id: transfer.id,
                name: transfer.name,
                size: transfer.size,
                mime: transfer.type
            });
            peerRef.current.send(metadata);

            const file = transfer.file;
            await sendFile(transfer.id, file);

            updateTransfer(transfer.id, { status: 'completed', progress: 100 });
        }
    };

    const sendFile = async (transferId: string, file: File) => {
        let offset = 0;
        let chunkIdx = 0;

        while (offset < file.size && peerRef.current?.connected) {
            const chunk = file.slice(offset, offset + CHUNK_SIZE);
            const buffer = await chunk.arrayBuffer();

            try {
                peerRef.current.send(new Uint8Array(buffer));
            } catch (_e) {
                await new Promise(r => setTimeout(r, 10));
                peerRef.current?.send(new Uint8Array(buffer));
            }

            offset += CHUNK_SIZE;
            chunkIdx++;

            const progress = Math.min(100, (offset / file.size) * 100);
            updateTransfer(transferId, { progress });

            if (chunkIdx % 100 === 0) await new Promise(r => setTimeout(r, 0));
        }

        console.log(`File ${file.name} sent`);
    };

    // Receiving Logic
    const handleData = (data: Uint8Array) => {
        try {
            const text = new TextDecoder().decode(data);
            if (text.startsWith('{"type":"metadata"')) {
                const meta = JSON.parse(text);
                console.log("Received Metadata:", meta);
                receiveBufferRef.current = [];
                receivedSizeRef.current = 0;

                addTransfer({
                    id: meta.id,
                    file: null as any,
                    name: meta.name,
                    size: meta.size,
                    type: meta.mime,
                    status: 'receiving',
                    progress: 0,
                    speed: 0,
                    chunksTransferred: 0,
                    totalChunks: 0
                });
                return;
            }
        } catch (_e) {
            // Not json, binary data
        }

        const activeTransfer = useTransferStore.getState().transfers.find((t: any) => t.status === 'receiving');
        if (!activeTransfer) return;

        receiveBufferRef.current.push(data);
        receivedSizeRef.current += data.byteLength;

        const progress = Math.min(100, (receivedSizeRef.current / activeTransfer.size) * 100);
        updateTransfer(activeTransfer.id, { progress });

        if (receivedSizeRef.current >= activeTransfer.size) {
            const blob = new Blob(receiveBufferRef.current as BlobPart[], { type: activeTransfer.type });
            updateTransfer(activeTransfer.id, { status: 'completed', progress: 100, file: blob as any });

            receiveBufferRef.current = [];
            receivedSizeRef.current = 0;
        }
    };

    return { connectionStatus };
}
