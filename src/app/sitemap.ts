import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://muhurzen.com";
  return ["", "/hakkimizda", "/kvkk", "/gizlilik-politikasi", "/mesafeli-satis-sozlesmesi", "/iade-politikasi", "/iletisim"].map((url) => ({ url: `${base}${url}`, lastModified: new Date() }));
}
