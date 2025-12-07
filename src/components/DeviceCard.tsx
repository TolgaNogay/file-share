import { Device } from "@/store/useDeviceStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Laptop, Smartphone, Tablet } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeviceCardProps {
    device: Device;
    isMe?: boolean;
    onConnect?: (device: Device) => void;
    className?: string;
}

export function DeviceCard({ device, isMe, onConnect, className }: DeviceCardProps) {
    const Icon = device.type === 'mobile' ? Smartphone : device.type === 'tablet' ? Tablet : Laptop;

    return (
        <Card
            className={cn("transition-all hover:shadow-md cursor-pointer border-2",
                isMe ? "border-primary/20 bg-primary/5" : "hover:border-primary/50",
                className
            )}
            onClick={() => !isMe && onConnect?.(device)}
        >
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <Avatar className="h-10 w-10 border">
                    <AvatarFallback className="bg-background">
                        <Icon className="h-5 w-5 text-foreground/70" />
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                        {device.name}
                        {isMe && <Badge variant="secondary" className="text-xs">Sen</Badge>}
                    </CardTitle>
                    <span className="text-xs text-muted-foreground">
                        {device.ip || device.os} • {device.browser}
                    </span>
                </div>
            </CardHeader>
            <CardContent className="pb-4">
                {/* Signal Strength or Status could go here */}
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    Çevrimiçi
                </div>
            </CardContent>
        </Card>
    );
}
