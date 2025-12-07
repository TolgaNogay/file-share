import { io, Socket } from "socket.io-client";
import { siteConfig } from "@/config/siteConfig";

let socket: Socket | null = null;

export const getSocket = (): Socket => {
    if (!socket) {
        socket = io({
            path: "/socket.io",
            transports: ["websocket", "polling"],
            autoConnect: true,
            reconnectionAttempts: 5,
        });
    }
    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};
