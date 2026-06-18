import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://YOUR-VERCEL-URL.vercel.app",
      lastModified: new Date(),
    },
  ];
}