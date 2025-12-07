import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server } from "socket.io";
import { siteConfig } from "./src/config/siteConfig";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const httpServer = createServer(async (req, res) => {
        try {
            const parsedUrl = parse(req.url!, true);
            await handle(req, res, parsedUrl);
        } catch (err) {
            console.error("Error occurred handling", req.url, err);
            res.statusCode = 500;
            res.end("internal server error");
        }
    });

    const io = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
        transports: ["websocket", "polling"],
    });

    io.on("connection", (socket) => {
        console.log(`Socket connected: ${socket.id}`);

        // Join a specific room (session)
        socket.on("join-room", (roomId, deviceId) => {
            socket.join(roomId);
            console.log(`Device ${deviceId} joined room ${roomId}`);
            // Notify others in room
            socket.to(roomId).emit("user-connected", deviceId);
        });

        // Handle signaling data (WebRTC offers/answers/candidates)
        socket.on("signal", (data) => {
            console.log(`Relaying signal from ${socket.id} to room ${data.room}`);
            socket.to(data.room).emit("signal", {
                signal: data.signal,
                senderId: data.senderId, // Pass sender ID so receiver knows who sent it
            });
        });

        socket.on("disconnect", () => {
            console.log(`Socket disconnected: ${socket.id}`);
        });
    });

    httpServer.listen(port, () => {
        console.log(`> Ready on http://${hostname}:${port} as ${siteConfig.name}`);
    });
});
