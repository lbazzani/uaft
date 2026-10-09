import { MetadataRoute } from 'next';

// Niente lastModified: con new Date() valeva la data della build, cioè «tutto cambiato» a ogni
// deploy, e Google smette di fidarsi di una data che cambia sempre.
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://uaft.it';

  return [
    {
      url: baseUrl,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/privacy`,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];
}
