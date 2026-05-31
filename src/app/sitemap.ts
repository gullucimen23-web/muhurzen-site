import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://mühürzen.com";

  return [
    "",
    "/hakkimizda",
    "/iletisim",
    "/kvkk",
    "/gizlilik-politikasi",
    "/mesafeli-satis-sozlesmesi",
    "/iade-politikasi",

    "/bakir-bileklik-bakimi",
    "/bakir-bileklik-faydalari",
    "/bakir-bileklik-ne-ise-yarar",
    "/bakir-muhur-bilekligi",
    "/isim-yazili-bakir-bileklik",
    "/kisiye-ozel-bakir-bileklik",

    "/suleyman-muhru",
    "/suleyman-muhru-anlami",
    "/suleyman-muhru-bileklik",
    "/bakir-suleyman-muhru-bileklik",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));
}
