import { File as FileIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatBytes } from "@/lib/utils";
import { FileTransfer } from "@/store/useTransferStore";
import { Progress } from "@/components/ui/progress";

interface FileItemProps {
    transfer: FileTransfer;
    onRemove: (id: string) => void;
}

export function FileItem({ transfer, onRemove }: FileItemProps) {
    return (
        <div className="flex items-center gap-4 p-3 border rounded-lg bg-card shadow-sm">
            <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center shrink-0">
                <FileIcon className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium truncate max-w-[200px] sm:max-w-xs">{transfer.name}</p>
                    <span className="text-xs text-muted-foreground">{formatBytes(transfer.size)}</span>
                </div>

                {/* Progress or Actions */}
                {transfer.status === 'queued' ? (
                    <p className="text-xs text-muted-foreground">Gönderilmeye hazır</p>
                ) : (
                    <div className="w-full space-y-1">
                        <Progress value={transfer.progress} className="h-1" />
                        <div className="flex justify-between text-[10px] text-muted-foreground">
                            <span>{transfer.progress.toFixed(0)}%</span>
                            {transfer.speed > 0 && <span>{formatBytes(transfer.speed)}/s</span>}
                        </div>
                    </div>
                )}
            </div>

            {transfer.status === 'queued' && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => onRemove(transfer.id)}
                >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Kaldır</span>
                </Button>
            )}
        </div>
    );
}
