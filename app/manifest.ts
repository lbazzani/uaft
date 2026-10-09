import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'UAFT - Una Azienda che può Fare Tutto',
    short_name: 'UAFT',
    description: 'Servizi IT innovativi con un tocco ironico ma professionale',
    start_url: '/',
    display: 'standalone',
    background_color: '#F7F4EF',
    theme_color: '#0B1F33',
    // le PNG 192/512 non esistono in public/: si usa l'icona vettoriale di app/icon.svg
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
