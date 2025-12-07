import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { siteConfig } from "@/config/siteConfig";

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
                <Link href="/" className="mr-6 flex items-center space-x-2">
                    <span className="hidden font-bold sm:inline-block">
                        {siteConfig.name}
                    </span>
                </Link>
                <nav className="flex items-center space-x-6 text-sm font-medium">
                    <Link
                        href="/send"
                        className="transition-colors hover:text-foreground/80 text-foreground/60"
                    >
                        Gönder
                    </Link>
                    <Link
                        href="/receive"
                        className="transition-colors hover:text-foreground/80 text-foreground/60"
                    >
                        Al
                    </Link>
                    <Link
                        href="/devices"
                        className="transition-colors hover:text-foreground/80 text-foreground/60"
                    >
                        Cihazlar
                    </Link>
                </nav>
                <div className="ml-auto flex items-center space-x-2">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="https://github.com" target="_blank" rel="noreferrer">
                            <Github className="h-4 w-4" />
                            <span className="sr-only">GitHub</span>
                        </Link>
                    </Button>
                </div>
            </div>
        </header>
    );
}
