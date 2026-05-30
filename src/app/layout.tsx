import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MuhurZen | Kişiye Özel Bakır Mühür Bilekliği",
  description: "Kişiye özel hazırlanan bakır mühür bilekliği. Geleneksel sembollerden ilham alan özel tasarım aksesuar.",
  openGraph: {
    title: "MuhurZen | Kişiye Özel Bakır Mühür Bilekliği",
    description: "Geleneksel sembollerden ilham alan, kişisel kullanım ve hediye amaçlı özel tasarım bakır bileklik.",
    images: ["/images/bileklik-1.jpg"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
