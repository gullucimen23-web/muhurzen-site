import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://mühürzen.com"),
  title: "MühürZen | Kişiye Özel Bakır Mühür Bilekliği",
  description:
    "Kişiye özel hazırlanan bakır mühür bileklikleri. Süleyman Mührü sembolü ve geleneksel motiflerden ilham alan özel tasarım bakır aksesuar.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "MühürZen | Kişiye Özel Bakır Mühür Bilekliği",
    description:
      "Ad, tarih ve özel sembollerle kişisel anlam taşıyacak şekilde hazırlanan özel tasarım bakır aksesuar.",
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
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;
            n.push=n;
            n.loaded=!0;
            n.version='2.0';
            n.queue=[];
            t=b.createElement(e);
            t.async=!0;
            t.src=v;
            s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s);
            }(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');

            fbq('init', '1807355850237399');
            fbq('track', 'PageView');
          `}
        </Script>

        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1807355850237399&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </body>
    </html>
  );
}
