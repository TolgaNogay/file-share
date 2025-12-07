import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Send, Download, ShieldCheck, Zap, Wifi } from "lucide-react";

export default function Home() {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <main className="flex-1 flex items-center justify-center">
        <div className="container flex max-w-4xl flex-col items-center gap-6 text-center px-4">
          {/* Badge */}
          <div className="rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            Güvenli • Yerel • Hızlı
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
            Dosyalarını <span className="text-primary">sihirli bir şekilde</span> paylaş
          </h1>

          {/* Subtitle */}
          <p className="max-w-xl text-lg text-muted-foreground">
            Cihazlar arasında anında dosya transferi.
            Boyut limiti yok, sunucu yok. Doğrudan yerel ağ üzerinden.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button asChild size="lg" className="h-14 px-10 text-lg rounded-full shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
              <Link href="/send">
                <Send className="mr-2 h-5 w-5" /> Dosya Gönder
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-14 px-10 text-lg rounded-full border-2 transition-all hover:scale-105 active:scale-95">
              <Link href="/receive">
                <Download className="mr-2 h-5 w-5" /> Dosya Al
              </Link>
            </Button>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 pt-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5 bg-muted/50 px-3 py-1.5 rounded-full">
              <Zap className="w-4 h-4 text-primary" />
              WebRTC P2P
            </div>
            <div className="flex items-center gap-1.5 bg-muted/50 px-3 py-1.5 rounded-full">
              <Wifi className="w-4 h-4 text-primary" />
              Yerel Keşif
            </div>
            <div className="flex items-center gap-1.5 bg-muted/50 px-3 py-1.5 rounded-full">
              <ShieldCheck className="w-4 h-4 text-primary" />
              Şifreleme
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
