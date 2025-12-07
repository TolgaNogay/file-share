"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Download, WifiOff } from "lucide-react";
import { useSessionStore } from "@/store/useSessionStore";
import { useTransferStore } from "@/store/useTransferStore";
import { useTransferEngine } from "@/hooks/useTransferEngine";
import { getSocket } from "@/lib/socket";
import { FileItem } from "@/components/FileItem";
import { generateDeviceId } from "@/lib/utils";

export default function ReceivePage() {
    const searchParams = useSearchParams();
    const sessionParam = searchParams.get("session");
    const { setRoomId, roomId } = useSessionStore();
    const { transfers, removeTransfer } = useTransferStore();

    // Initialize Engine
    const { connectionStatus } = useTransferEngine("receiver");
    const [hasJoined, setHasJoined] = useState(false);

    useEffect(() => {
        if (sessionParam && !hasJoined) {
            setRoomId(sessionParam);
            const socket = getSocket();
            const myId = generateDeviceId();

            socket.emit("join-room", sessionParam, myId);
            setHasJoined(true);
            console.log("Joined room:", sessionParam);
        }
    }, [sessionParam, setRoomId, hasJoined]);

    const handleDownload = (id: string) => {
        const transfer = transfers.find(t => t.id === id);
        if (transfer && transfer.status === 'completed' && transfer.file) {
            // Logic to download blob
            // Since we stored Blob in `transfer.file` (hacky typing in store but works for runtime)
            const url = URL.createObjectURL(transfer.file as unknown as Blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = transfer.name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    };

    const handleDownloadAll = () => {
        transfers.filter(t => t.status === 'completed').forEach(t => handleDownload(t.id));
    };

    const completedCount = transfers.filter(t => t.status === 'completed').length;

    return (
        <div className="flex min-h-screen flex-col">
            <main className="container py-8 max-w-3xl">
                <h1 className="text-3xl font-bold mb-6">Dosya Al</h1>

                {!sessionParam && (
                    <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                            <p>Aktif oturum bulunamadı.</p>
                            <p className="text-sm">Almaya başlamak için bir QR kod tarayın veya paylaşım linki kullanın.</p>
                        </CardContent>
                    </Card>
                )}

                {sessionParam && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-sm font-medium">
                                Durum:
                                <span className={connectionStatus === 'connected' ? 'text-green-600' : 'text-amber-500'}>
                                    {connectionStatus === 'connected' ? 'Bağlandı' : connectionStatus === 'connecting' ? 'Bağlanıyor' : connectionStatus}
                                </span>
                            </div>
                        </div>

                        {connectionStatus === 'connecting' && (
                            <div className="flex flex-col items-center py-12">
                                <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                                <p className="text-lg font-medium">Gönderene bağlanılıyor...</p>
                            </div>
                        )}

                        {transfers.length > 0 && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-semibold">Gelen Dosyalar</h2>
                                    {completedCount > 0 && (
                                        <Button onClick={handleDownloadAll} size="sm">
                                            <Download className="mr-2 h-4 w-4" /> Tümünü İndir
                                        </Button>
                                    )}
                                </div>
                                <div className="grid gap-2">
                                    {transfers.map(t => (
                                        <div key={t.id} onClick={() => t.status === 'completed' && handleDownload(t.id)} className={t.status === 'completed' ? 'cursor-pointer' : ''}>
                                            <FileItem transfer={t} onRemove={removeTransfer} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
