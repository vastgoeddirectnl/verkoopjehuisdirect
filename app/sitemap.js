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
  url: `${baseUrl}/huis-direct-verkopen`,
  lastModified: new Date(),
  changeFrequency: "weekly",
  priority: 0.86,
},
    {
      url: `${baseUrl}/huis-snel-verkopen`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
  url: `${baseUrl}/opknapwoning-verkopen`,
  lastModified: new Date(),
  changeFrequency: "weekly",
  priority: 0.82,
},
    {
  url: `${baseUrl}/huis-verkopen-binnen-1-week`,
  lastModified: new Date(),
  changeFrequency: "weekly",
  priority: 0.84,
},
{
  url: `${baseUrl}/huis-verkopen-groningen`,
  lastModified: new Date(),
  changeFrequency: "weekly",
  priority: 0.82,
},
    {
  url: `${baseUrl}/huis-verkopen-bij-erfenis`,
  lastModified: new Date(),
  changeFrequency: "weekly",
  priority: 0.82,
},
{
  url: `${baseUrl}/verhuurde-woning-verkopen`,
  lastModified: new Date(),
  changeFrequency: "weekly",
  priority: 0.82,
},
{
  url: `${baseUrl}/huis-verkopen-zonder-bezichtigingen`,
  lastModified: new Date(),
  changeFrequency: "weekly",
  priority: 0.82,
},
{
  url: `${baseUrl}/huis-verkopen-bij-scheiding`,
  lastModified: new Date(),
  changeFrequency: "weekly",
  priority: 0.82,
},
{
  url: `${baseUrl}/leegstaand-huis-verkopen`,
  lastModified: new Date(),
  changeFrequency: "weekly",
  priority: 0.82,
},
{
  url: `${baseUrl}/huis-verkopen-met-achterstallig-onderhoud`,
  lastModified: new Date(),
  changeFrequency: "weekly",
  priority: 0.82,
},
{
  url: `${baseUrl}/huis-verkopen-aan-opkoper`,
  lastModified: new Date(),
  changeFrequency: "weekly",
  priority: 0.82,
}, 
{
  url: `${baseUrl}/huis-verkopen-groningen`,
  lastModified: new Date(),
  changeFrequency: "weekly",
  priority: 0.78,
},
{
  url: `${baseUrl}/woning-verkopen-friesland`,
  lastModified: new Date(),
  changeFrequency: "weekly",
  priority: 0.78,
},
{
  url: `${baseUrl}/woning-verkopen-drenthe`,
  lastModified: new Date(),
  changeFrequency: "weekly",
  priority: 0.78,
},
{
  url: `${baseUrl}/woning-verkopen-overijssel`,
  lastModified: new Date(),
  changeFrequency: "weekly",
  priority: 0.78,
},  
    {
      url: `${baseUrl}/woning-verkopen-zonder-makelaar`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
  ];
}
