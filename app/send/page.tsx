"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { QRCodeSVG } from "qrcode.react";
import { Dropzone } from "@/components/Dropzone";
import { FileItem } from "@/components/FileItem";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTransferStore, FileTransfer } from "@/store/useTransferStore";
import { siteConfig } from "@/config/siteConfig";
import { Link, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTransferEngine } from "@/hooks/useTransferEngine";
import { useSessionStore } from "@/store/useSessionStore";
import { getSocket } from "@/lib/socket";
import { generateDeviceId } from "@/lib/utils";

export default function SendPage() {
    const { transfers, addTransfer, removeTransfer } = useTransferStore();
    const { setRoomId, roomId } = useSessionStore();
    const [showShareDialog, setShowShareDialog] = useState(false);
    const [shareLink, setShareLink] = useState("");
    const { toast } = useToast();
    const [copied, setCopied] = useState(false);

    // Init Engine
    useTransferEngine('sender');

    const handleFilesDropped = (files: File[]) => {
        files.forEach(file => {
            const newTransfer: FileTransfer = {
                id: uuidv4(),
                file,
                name: file.name,
                size: file.size,
                type: file.type,
                status: 'queued',
                progress: 0,
                speed: 0,
                chunksTransferred: 0,
                totalChunks: 0
            };
            addTransfer(newTransfer);
        });
    };

    const generateLink = () => {
        if (transfers.length === 0) return;

        // Create Session
        const sessionId = uuidv4();
        const myId = generateDeviceId();

        setRoomId(sessionId);
        getSocket().emit("join-room", sessionId, myId);

        const link = `${window.location.origin}/receive?session=${sessionId}`;
        setShareLink(link);
        setShowShareDialog(true);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareLink);
        setCopied(true);
        toast({ description: "Link panoya kopyalandı" });
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex min-h-screen flex-col">
            <main className="container py-8 max-w-3xl">
                <h1 className="text-3xl font-bold mb-6">Dosya Gönder</h1>

                <Dropzone onFilesDropped={handleFilesDropped} className="mb-8" />

                {transfers.length > 0 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold">Seçili Dosyalar ({transfers.length})</h2>
                            <Button onClick={generateLink} size="lg" className="rounded-full px-8">
                                Dosyaları Paylaş
                            </Button>
                        </div>
                        <div className="grid gap-2">
                            {transfers.map(t => (
                                <FileItem key={t.id} transfer={t} onRemove={removeTransfer} />
                            ))}
                        </div>
                    </div>
                )}

                <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Dosyaları Paylaş</DialogTitle>
                            <DialogDescription>
                                Bu linki veya QR kodu alıcıyla paylaşın.
                            </DialogDescription>
                        </DialogHeader>

                        <Tabs defaultValue="link" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="link">Link</TabsTrigger>
                                <TabsTrigger value="qr">QR Kod</TabsTrigger>
                            </TabsList>
                            <TabsContent value="link" className="mt-4 space-y-4">
                                <div className="flex items-center space-x-2">
                                    <div className="grid flex-1 gap-2">
                                        <div className="flex items-center justify-between border rounded-md px-3 py-2 bg-muted/50 text-sm break-all">
                                            {shareLink}
                                        </div>
                                    </div>
                                    <Button size="icon" onClick={copyToClipboard}>
                                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </TabsContent>
                            <TabsContent value="qr" className="mt-4 flex justify-center py-4">
                                <div className="p-4 bg-white rounded-xl shadow-inner">
                                    <QRCodeSVG value={shareLink} size={200} />
                                </div>
                            </TabsContent>
                        </Tabs>
                    </DialogContent>
                </Dialog>

            </main>
        </div>
    );
}
