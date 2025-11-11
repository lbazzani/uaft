'use client';
import {
  Box,
  Container,
  Typography,
  Paper,
  AppBar,
  Toolbar,
  Button,
} from '@mui/material';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <>
      <AppBar position="static" elevation={0} sx={{ backgroundColor: 'white', color: 'primary.main' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
            <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              🚀 UAFT
            </Link>
          </Typography>
          <Button color="inherit" component={Link} href="/">
            Torna alla Home
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h2" gutterBottom sx={{ fontWeight: 700 }}>
          Termini e Condizioni
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
          Ultimo aggiornamento: 11 Novembre 2024
        </Typography>

        <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            1. Accettazione dei Termini
          </Typography>
          <Typography variant="body1" paragraph>
            Benvenuto nei Termini e Condizioni di UAFT. Se stai leggendo questo,
            sei già più diligente del 99% degli utenti di Internet. Complimenti!
          </Typography>
          <Typography variant="body1">
            Utilizzando il nostro sito, accetti automaticamente questi termini.
            Se non li accetti, probabilmente dovresti chiudere questa pagina.
            Ma dai, non essere timido, siamo gente simpatica.
          </Typography>
        </Paper>

        <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            2. Descrizione del Servizio
          </Typography>
          <Typography variant="body1" paragraph>
            UAFT è una piattaforma che fornisce servizi IT "as a Service".
            Cosa significa? Fondamentalmente, possiamo fare tutto. O quasi.
            O almeno ci proviamo.
          </Typography>
          <Typography variant="body1">
            Il nostro calcolatore di prezzi AI utilizza un algoritmo sofisticatissimo
            (Math.random() moltiplicato per vari fattori) per stimare il costo dei servizi.
            I prezzi forniti sono puramente indicativi e probabilmente completamente inventati.
          </Typography>
        </Paper>

        <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            3. Uso Accettabile
          </Typography>
          <Typography variant="body1" paragraph>
            Ti impegni a utilizzare il nostro sito in modo responsabile. Questo significa:
          </Typography>
          <Box component="ul" sx={{ pl: 3 }}>
            <li>
              <Typography variant="body1" paragraph>
                Non cercare di hackerare il sito (ma se ci riesci, mandaci il CV)
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                Non usare il calcolatore AI per scopi illegali o immorali
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                Non fare spam o flooding
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                Non pretendere che i prezzi generati dall'AI siano accurati al centesimo
              </Typography>
            </li>
          </Box>
        </Paper>

        <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            4. Proprietà Intellettuale
          </Typography>
          <Typography variant="body1" paragraph>
            Tutti i contenuti del sito (testi, immagini, codice, battute pessime)
            sono di proprietà di UAFT o dei rispettivi proprietari.
          </Typography>
          <Typography variant="body1">
            Puoi usare il sito per scopi personali, ma non puoi copiare,
            modificare, distribuire o vendere i nostri contenuti senza permesso.
            A meno che non siano davvero belli. In quel caso, almeno citaci.
          </Typography>
        </Paper>

        <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            5. Limitazione di Responsabilità
          </Typography>
          <Typography variant="body1" paragraph>
            UAFT fornisce il servizio "così com'è". Facciamo del nostro meglio
            per mantenere il sito funzionante, ma non possiamo garantire:
          </Typography>
          <Box component="ul" sx={{ pl: 3 }}>
            <li>
              <Typography variant="body1" paragraph>
                Che il sito sarà sempre disponibile (i server hanno bisogno di dormire anche loro)
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                Che i prezzi generati dall'AI siano accurati (spoiler: non lo sono)
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                Che il sito sia privo di bug (se lo fosse, saremmo i primi nella storia)
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                Che le nostre battute siano divertenti (lo humor è soggettivo)
              </Typography>
            </li>
          </Box>
          <Typography variant="body1" sx={{ mt: 2 }}>
            In ogni caso, la nostra responsabilità è limitata all'importo che hai pagato
            per usare il sito. Che, al momento, è zero. Matematica!
          </Typography>
        </Paper>

        <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            6. Disclaimer sull'AI
          </Typography>
          <Typography variant="body1" paragraph>
            Il nostro "AI Pricing Engine" non è una vera intelligenza artificiale.
            È più un "generatore di numeri casuali con pretese".
            Non basare decisioni di business importanti sui suoi risultati.
          </Typography>
          <Typography variant="body1">
            Se vuoi un preventivo vero, contattaci direttamente.
            O almeno, contattaci quando avremo implementato il form di contatto.
            È nella roadmap. Subito dopo "fare il caffè".
          </Typography>
        </Paper>

        <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            7. Modifiche ai Termini
          </Typography>
          <Typography variant="body1" paragraph>
            Ci riserviamo il diritto di modificare questi termini in qualsiasi momento.
            Ti avviseremo di modifiche sostanziali tramite un avviso sul sito.
          </Typography>
          <Typography variant="body1">
            Se continui a usare il sito dopo le modifiche, significa che le accetti.
            Se non le accetti, puoi sempre andartene. Ma perché dovresti? Siamo fantastici!
          </Typography>
        </Paper>

        <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            8. Legge Applicabile
          </Typography>
          <Typography variant="body1" paragraph>
            Questi termini sono regolati dalla legge italiana.
            Qualsiasi controversia sarà risolta dal foro competente di Internet City.
          </Typography>
          <Typography variant="body1">
            Ma dai, siamo tutti adulti qui. Se c'è un problema, parliamone come persone civili.
            Magari davanti a un caffè. O una pizza. Noi non discriminiamo.
          </Typography>
        </Paper>

        <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            9. Severabilità
          </Typography>
          <Typography variant="body1" paragraph>
            Se una parte di questi termini viene dichiarata invalida o inapplicabile,
            le altre parti rimangono in vigore.
          </Typography>
          <Typography variant="body1">
            È come quando togli l'ananas dalla pizza: la pizza rimane comunque buona.
            (Sì, abbiamo appena preso una posizione sul dibattito pineapple-on-pizza.
            Affrontateci.)
          </Typography>
        </Paper>

        <Paper elevation={2} sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            10. Contatti
          </Typography>
          <Typography variant="body1" paragraph>
            Per domande su questi termini, contattaci a:
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Email:</strong> legal@uaft.example.com
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Telefono:</strong> +39 123 456 7890
          </Typography>
          <Typography variant="body1" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
            (Questi contatti sono inventati. Quando saremo una vera azienda,
            promesso che metteremo contatti veri. Pinky promise.)
          </Typography>
        </Paper>

        <Box sx={{ mt: 6, p: 4, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            📝 Nota Finale
          </Typography>
          <Typography variant="body1">
            Se sei arrivato fino a qui, sei un eroe. Seriamente.
            Pochissime persone leggono veramente i Termini e Condizioni.
            Sei ufficialmente nel club dell'1% più diligente di Internet.
            Ti mandiamo un badge virtuale. 🏆
          </Typography>
        </Box>
      </Container>
    </>
  );
}
