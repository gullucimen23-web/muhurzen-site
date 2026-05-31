import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://mühürzen.com"),
  title: "MühürZen | Kişiye Özel Bakır Mühür Bilekliği",
  description:
    "Kişiye özel hazırlanan bakır mühür bileklikleri. Geleneksel sembollerden ilham alan özel tasarım aksesuar.",
  openGraph: {
    title: "MühürZen | Kişiye Özel Bakır Mühür Bilekliği",
    description:
      "Ad ve doğum bilgilerine göre kişisel anlam taşıyacak şekilde hazırlanan özel tasarım bakır aksesuar.",
    url: "https://mühürzen.com",
    siteName: "MühürZen",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MühürZen kişiye özel bakır mühür bilekliği",
      },
    ],
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MühürZen | Kişiye Özel Bakır Mühür Bilekliği",
    description: "Kişiye özel hazırlanan bakır mühür bileklikleri.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr">
      <body>
        {children}
        <Script
  src="https://www.googletagmanager.com/gtag/js?id=G-MHL4JKNG6T"
  strategy="afterInteractive"
/>

<Script
  id="ga-script"
  strategy="afterInteractive"
  dangerouslySetInnerHTML={{
    __html: `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-MHL4JKNG6T');
    `,
  }}
/>
        <Script id="tawk-live-chat" strategy="afterInteractive">
          {`
            var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
            (function(){
              var s1=document.createElement("script"),
              s0=document.getElementsByTagName("script")[0];
              s1.async=true;
              s1.src='https://embed.tawk.to/6a1b8aae8440161c2d3897bd/1jptpbf2p';
              s1.charset='UTF-8';
              s1.setAttribute('crossorigin','*');
              s0.parentNode.insertBefore(s1,s0);
            })();
          `}
        </Script>
      </body>
    </html>
  );
}
