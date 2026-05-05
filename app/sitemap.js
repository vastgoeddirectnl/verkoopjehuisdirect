export default function sitemap() {
  const baseUrl = "https://www.verkoopjehuisdirect.nl";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
   {
  url: `${baseUrl}/huis-verkopen-binnen-24-uur`,
  lastModified: new Date(),
  changeFrequency: "weekly",
  priority: 0.85,
},
    {
      url: `${baseUrl}/huis-snel-verkopen`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/woning-verkopen-zonder-makelaar`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
  ];
}
