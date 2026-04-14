import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://franchise.dovision.kr";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    "",
    "/brand",
    "/program",
    "/success",
    "/franchise",
    "/simulator",
    "/faq",
    "/notice",
    "/contact",
  ];

  return staticPages.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/franchise" ? 0.9 : 0.7,
  }));
}
