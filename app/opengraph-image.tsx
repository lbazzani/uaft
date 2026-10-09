import { ImageResponse } from 'next/og';

// Anteprima social: la stessa promessa del sito, con l'asterisco che la smentisce
export const alt = 'UAFT* — Una Azienda che può Fare Tutto*';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const NAVY = '#0B1F33';
const CORALLO = '#FF6B35';
const CHIARO = '#F3EFE8';

// asterisco a sei punte fatto di tre barre ruotate: niente font esterni da scaricare
function Asterisco({ lato }: { lato: number }) {
  const spessore = Math.round(lato * 0.2);
  const barra = (gradi: number) => (
    <div
      style={{
        position: 'absolute',
        left: (lato - spessore) / 2,
        top: 0,
        width: spessore,
        height: lato,
        borderRadius: spessore / 3,
        background: CORALLO,
        transform: `rotate(${gradi}deg)`,
      }}
    />
  );
  return (
    <div style={{ position: 'relative', width: lato, height: lato, display: 'flex' }}>
      {barra(0)}
      {barra(60)}
      {barra(-60)}
    </div>
  );
}

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: NAVY,
          color: CHIARO,
          padding: '72px 80px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          <div style={{ fontSize: 168, fontWeight: 800, letterSpacing: 6, lineHeight: 1 }}>UAFT</div>
          <div style={{ display: 'flex', marginLeft: 14, marginTop: 6 }}>
            <Asterisco lato={64} />
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 60, fontWeight: 700, lineHeight: 1.1, display: 'flex' }}>
            Una Azienda che può Fare Tutto
            <span style={{ color: CORALLO }}>*</span>
          </div>
          <div
            style={{
              marginTop: 28,
              paddingTop: 22,
              borderTop: '1px solid rgba(243,239,232,0.16)',
              fontSize: 32,
              fontStyle: 'italic',
              color: 'rgba(243,239,232,0.7)',
              display: 'flex',
            }}
          >
            <span style={{ color: CORALLO, marginRight: 8 }}>*</span>Quasi.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
