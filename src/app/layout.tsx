import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MuhurZen | Kişiye Özel Bakır Mühür Bilekliği",
  description: "Kişiye özel hazırlanan bakır mühür bileklikleri. Geleneksel sembollerden ilham alan özel tasarım aksesuar.",
  openGraph: {
    title: "MuhurZen | Kişiye Özel Bakır Mühür Bilekliği",
    description: "Ad ve doğum bilgilerine göre kişisel anlam taşıyacak şekilde hazırlanan özel tasarım bakır aksesuar.",
    url: "https://muhurzen.com",
    siteName: "MuhurZen",
    images: [{ url: "/images/bileklik-1.jpg", width: 1200, height: 1200 }],
    locale: "tr_TR",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
