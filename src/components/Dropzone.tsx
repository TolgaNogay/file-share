"use client";

import { useState, useCallback } from "react";
import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

interface DropzoneProps {
    onFilesDropped: (files: File[]) => void;
    className?: string;
}

export function Dropzone({ onFilesDropped, className }: DropzoneProps) {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragging(false);
            const files = Array.from(e.dataTransfer.files);
            if (files.length > 0) {
                onFilesDropped(files);
            }
        },
        [onFilesDropped]
    );

    const handleFileInput = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const files = e.target.files ? Array.from(e.target.files) : [];
            if (files.length > 0) {
                onFilesDropped(files);
            }
        },
        [onFilesDropped]
    );

    return (
        <div
            className={cn(
                "relative flex flex-col items-center justify-center w-full min-h-[300px] border-2 border-dashed rounded-xl transition-colors cursor-pointer",
                isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
                className
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <label htmlFor="file-upload" className="flex flex-col items-center cursor-pointer w-full h-full justify-center p-8">
                <div className={cn("p-4 rounded-full bg-muted mb-4 transition-transform", isDragging && "scale-110")}>
                    <UploadCloud className="w-10 h-10 text-muted-foreground" />
                </div>
                <p className="text-xl font-medium mb-2">
                    Dosyaları buraya sürükle & bırak
                </p>
                <p className="text-sm text-muted-foreground mb-6">
                    veya tıklayarak seçin
                </p>
                {/* Hidden Input */}
                <input
                    id="file-upload"
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileInput}
                />
            </label>
        </div>
    );
}
