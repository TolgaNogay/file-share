# MagicSend 🚀

LocalSend-like secure P2P file transfer application for the web.
Built with Next.js 14, TypeScript, ShadCN/UI, and Socket.io.

## Features

- **Local Discovery**: Automatically find devices on the same network (served by same node server).
- **P2P Transfer**: WebRTC-based file transfer. Files go directly device-to-device.
- **Secure**: No files stored on server.
- **Cross-Platform**: Works on any device with a browser.
- **PWA Support**: Installable as an app.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI**: TailwindCSS + ShadCN/UI + Framer Motion
- **State**: Zustand
- **Signaling**: Custom Node.js Server + Socket.io
- **P2P**: WebRTC (Simple-Peer)

## Getting Started

### Prerequisites

- Node.js 18+
- NPM

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the App (Development)

This project uses a custom server for Socket.io. You must run the custom dev script:

```bash
npm run dev
```

> This runs `ts-node server.ts`.
> Open [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
npm start
```

## Deployment

Since this app relies on a custom Node.js server for WebSocket signaling, **you cannot deploy to Vercel standardly** (which is Serverless).
You must use a platform that supports Node.js servers, such as:
- **Render** (Web Service)
- **Railway**
- **DigitalOcean App Platform**
- **VPS** (Docker/PM2)

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```
