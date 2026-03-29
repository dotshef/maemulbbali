import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://www.maemulbbali.site",
      lastModified: new Date(),
      priority: 1,
    },
  ];
}
