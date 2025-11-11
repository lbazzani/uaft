import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'UAFT - Una Azienda che può Fare Tutto',
    short_name: 'UAFT',
    description: 'Servizi IT innovativi con un tocco ironico ma professionale',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#F97316',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
