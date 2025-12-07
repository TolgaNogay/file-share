export const siteConfig = {
    name: "DosyaGönder",
    description: "Cihazlar arasında güvenli P2P dosya transferi. Sunucu yok, izleme yok.",
    domain: "dosyagonder.app",
    defaultDeviceNamePrefix: "Cihaz",
    themeColor: "#277964",
    allowLinkShare: true,
    allowQRCode: true,
    maxFileSizeMB: 4096, // 4GB
    chunkSizeMB: 4,      // 4MB
};

export type SiteConfig = typeof siteConfig;
