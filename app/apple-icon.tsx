import { ImageResponse } from 'next/og';

// Lo stesso disegno di app/icon.svg in PNG 180×180: è l'icona di iOS (Next aggiunge il link
// apple-touch-icon) e il logo del JSON-LD della home, per cui Google vuole almeno 112×112 px.
// Quadrato pieno, senza angoli tondi: su iOS li arrotonda il sistema.
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

const NAVY = '#0B1F33';
const CORALLO = '#FF6B35';

// le proporzioni di icon.svg (lato 100): bracci 14×68 con raggio 4, ruotati di 60° attorno al centro
const SCALA = size.width / 100;
const BRACCIO = { largo: 14 * SCALA, alto: 68 * SCALA, raggio: 4 * SCALA };

function Braccio({ gradi }: { gradi: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: (size.width - BRACCIO.largo) / 2,
        top: (size.height - BRACCIO.alto) / 2,
        width: BRACCIO.largo,
        height: BRACCIO.alto,
        borderRadius: BRACCIO.raggio,
        background: CORALLO,
        transform: `rotate(${gradi}deg)`,
      }}
    />
  );
}

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', position: 'relative', background: NAVY }}>
        <Braccio gradi={0} />
        <Braccio gradi={60} />
        <Braccio gradi={-60} />
      </div>
    ),
    size,
  );
}
