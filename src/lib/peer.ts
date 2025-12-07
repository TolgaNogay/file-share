import SimplePeer, { Instance } from "simple-peer";

// Helper to create a peer connection
// We just wrap SimplePeer construction to enforce types/options
export const createPeer = (
    initiator: boolean,
    stream?: MediaStream
): Instance => {
    const peer = new SimplePeer({
        initiator,
        trickle: false, // For simplicity in local network, trickle false often works better/faster for initial handshake, though true is more robust for NATs.
        // In local network specific apps like LocalSend, mDNS usually handles discovery, but here we use socket signaling.
        // We will use standard ICE servers (Google's public STUN) + local candidates.
        config: {
            iceServers: [
                { urls: "stun:stun.l.google.com:19302" },
                { urls: "stun:global.stun.twilio.com:3478" },
            ],
        },
        stream,
    });

    return peer;
};
