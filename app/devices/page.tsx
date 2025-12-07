import { DeviceList } from "@/components/DeviceList";

export default function DevicesPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <main className="container py-8 md:py-12">
                <div className="mb-8 space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Keşfedilen Cihazlar</h1>
                    <p className="text-muted-foreground">
                        Yerel ağınızda bulunan cihazlar.
                    </p>
                </div>
                <DeviceList />
            </main>
        </div>
    );
}
