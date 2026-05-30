import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://muhurzen.com";
  return ["", "/hakkimizda", "/iletisim", "/kvkk", "/gizlilik-politikasi", "/mesafeli-satis-sozlesmesi", "/iade-politikasi"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));
}
