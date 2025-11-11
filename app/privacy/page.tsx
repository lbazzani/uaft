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

export default function PrivacyPage() {
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
          Privacy Policy
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
          Ultimo aggiornamento: 11 Novembre 2024
        </Typography>

        <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            1. Introduzione
          </Typography>
          <Typography variant="body1" paragraph>
            Benvenuto nella Privacy Policy di UAFT (Una Azienda che può Fare Tutto).
            Ci teniamo alla tua privacy quasi quanto teniamo al caffè della mattina.
            Forse anche di più. Forse.
          </Typography>
          <Typography variant="body1">
            Questa policy spiega quali dati raccogliamo, perché li raccogliamo,
            e cosa facciamo con essi. Spoiler: niente di losco, promesso.
          </Typography>
        </Paper>

        <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            2. Dati che Raccogliamo
          </Typography>
          <Typography variant="body1" paragraph>
            Raccogliamo solo i dati strettamente necessari per offrirti i nostri servizi:
          </Typography>
          <Box component="ul" sx={{ pl: 3 }}>
            <li>
              <Typography variant="body1" paragraph>
                <strong>Cookie tecnici:</strong> Per far funzionare il sito. Tipo ricordare
                che hai accettato questa policy (meta, vero?).
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                <strong>Dati di navigazione:</strong> Indirizzo IP, browser, sistema operativo.
                Roba standard che ogni sito raccoglie.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                <strong>Prompt AI:</strong> Se usi il nostro calcolatore di prezzi AI, memorizziamo
                temporaneamente il testo per elaborarlo. Poi lo dimentichiamo più velocemente
                di quando dimentichi dove hai messo le chiavi.
              </Typography>
            </li>
          </Box>
        </Paper>

        <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            3. Come Usiamo i Tuoi Dati
          </Typography>
          <Typography variant="body1" paragraph>
            I tuoi dati vengono utilizzati per:
          </Typography>
          <Box component="ul" sx={{ pl: 3 }}>
            <li>
              <Typography variant="body1" paragraph>
                Fornire e migliorare i nostri servizi
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                Comunicare con te (solo se ci contatti tu per primo)
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                Analizzare l'utilizzo del sito per renderlo migliore
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                Non inviarti spam. Mai. Lo odiamo anche noi.
              </Typography>
            </li>
          </Box>
        </Paper>

        <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            4. Condivisione dei Dati
          </Typography>
          <Typography variant="body1" paragraph>
            Non vendiamo i tuoi dati. MAI. Neanche se qualcuno ci offre un sacco di soldi.
            Ok, forse dipende da quanto è "un sacco", ma comunque non lo faremmo. Probabilmente.
          </Typography>
          <Typography variant="body1">
            Potremmo condividere i tuoi dati solo con:
          </Typography>
          <Box component="ul" sx={{ pl: 3 }}>
            <li>
              <Typography variant="body1" paragraph>
                Fornitori di servizi che ci aiutano a gestire il sito (tipo hosting)
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                Autorità legali, se la legge ci obbliga (speriamo mai)
              </Typography>
            </li>
          </Box>
        </Paper>

        <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            5. I Tuoi Diritti
          </Typography>
          <Typography variant="body1" paragraph>
            Hai il diritto di:
          </Typography>
          <Box component="ul" sx={{ pl: 3 }}>
            <li>
              <Typography variant="body1" paragraph>
                Accedere ai tuoi dati personali
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                Richiedere la correzione di dati errati
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                Richiedere la cancellazione dei tuoi dati
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                Opporti al trattamento dei tuoi dati
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                Richiedere la portabilità dei dati
              </Typography>
            </li>
          </Box>
        </Paper>

        <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            6. Sicurezza
          </Typography>
          <Typography variant="body1" paragraph>
            Proteggiamo i tuoi dati con misure di sicurezza all'avanguardia.
            Firewall, crittografia, autenticazione a più fattori, e un cane da guardia digitale
            molto cattivo (si chiama Docker).
          </Typography>
          <Typography variant="body1">
            Tuttavia, nessun sistema è sicuro al 100%. Se qualcuno hackera la NASA,
            probabilmente può hackerare chiunque. Ma noi facciamo del nostro meglio.
          </Typography>
        </Paper>

        <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            7. Cookie
          </Typography>
          <Typography variant="body1" paragraph>
            Usiamo cookie tecnici essenziali per il funzionamento del sito.
            Non usiamo cookie di profilazione o pubblicità di terze parti.
            I nostri cookie sono come i cookie della nonna: fatti in casa e senza ingredienti strani.
          </Typography>
          <Typography variant="body1">
            Puoi gestire le preferenze dei cookie nelle impostazioni del tuo browser,
            ma sappi che disabilitarli potrebbe rendere il sito meno funzionale.
          </Typography>
        </Paper>

        <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            8. Modifiche a Questa Policy
          </Typography>
          <Typography variant="body1" paragraph>
            Potremmo aggiornare questa policy di tanto in tanto.
            Ti avviseremo di eventuali modifiche sostanziali tramite un avviso sul sito
            o via email (se ce l'hai data).
          </Typography>
          <Typography variant="body1">
            Data dell'ultimo aggiornamento: quella scritta in alto. La leggi, vero?
          </Typography>
        </Paper>

        <Paper elevation={2} sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            9. Contatti
          </Typography>
          <Typography variant="body1" paragraph>
            Per qualsiasi domanda su questa Privacy Policy, contattaci a:
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Email:</strong> privacy@uaft.example.com
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Indirizzo:</strong> Via del Cloud 42, 00100 Internet City
          </Typography>
          <Typography variant="body1" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
            (Ok, questi sono dati fittizi. Ma se vuoi contattarci davvero,
            usa il form sul sito. Quando lo faremo. Presto. Forse.)
          </Typography>
        </Paper>
      </Container>
    </>
  );
}
