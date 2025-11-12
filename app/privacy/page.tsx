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
import { useLanguage } from '@/contexts/LanguageContext';

export default function PrivacyPage() {
  const { language } = useLanguage();
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
            {language === 'it' ? 'Torna alla Home' : 'Back to Home'}
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h2" gutterBottom sx={{ fontWeight: 700 }}>
          Privacy Policy
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
          {language === 'it' ? 'Ultimo aggiornamento: 11 Novembre 2025' : 'Last updated: November 11, 2025'}
        </Typography>

        {language === 'it' ? (
          // VERSIONE ITALIANA
          <>

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
        </>
        ) : (
          // VERSIONE INGLESE
          <>
        <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            1. Introduction
          </Typography>
          <Typography variant="body1" paragraph>
            Welcome to the Privacy Policy of UAFT (A Company That Can Do Everything).
            We care about your privacy almost as much as we care about our morning coffee.
            Maybe even more. Maybe.
          </Typography>
          <Typography variant="body1">
            This policy explains what data we collect, why we collect it,
            and what we do with it. Spoiler: nothing shady, we promise.
          </Typography>
        </Paper>

        <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            2. Data We Collect
          </Typography>
          <Typography variant="body1" paragraph>
            We only collect data strictly necessary to provide our services:
          </Typography>
          <Box component="ul" sx={{ pl: 3 }}>
            <li>
              <Typography variant="body1" paragraph>
                <strong>Technical cookies:</strong> To make the site work. Like remembering
                that you accepted this policy (meta, right?).
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                <strong>Navigation data:</strong> IP address, browser, operating system.
                Standard stuff that every site collects.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                <strong>AI prompts:</strong> If you use our AI pricing calculator, we temporarily store
                the text to process it. Then we forget it faster than you forget where you put your keys.
              </Typography>
            </li>
          </Box>
        </Paper>

        <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            3. How We Use Your Data
          </Typography>
          <Typography variant="body1" paragraph>
            Your data is used to:
          </Typography>
          <Box component="ul" sx={{ pl: 3 }}>
            <li>
              <Typography variant="body1" paragraph>
                Provide and improve our services
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                Communicate with you (only if you contact us first)
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                Analyze site usage to make it better
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                Not send you spam. Ever. We hate it too.
              </Typography>
            </li>
          </Box>
        </Paper>

        <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            4. Data Sharing
          </Typography>
          <Typography variant="body1" paragraph>
            We don't sell your data. EVER. Not even if someone offers us a lot of money.
            Ok, maybe it depends on how much "a lot" is, but we still wouldn't do it. Probably.
          </Typography>
          <Typography variant="body1">
            We might only share your data with:
          </Typography>
          <Box component="ul" sx={{ pl: 3 }}>
            <li>
              <Typography variant="body1" paragraph>
                Service providers who help us manage the site (like hosting)
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                Legal authorities, if the law requires us to (hopefully never)
              </Typography>
            </li>
          </Box>
        </Paper>

        <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            5. Your Rights
          </Typography>
          <Typography variant="body1" paragraph>
            You have the right to:
          </Typography>
          <Box component="ul" sx={{ pl: 3 }}>
            <li>
              <Typography variant="body1" paragraph>
                Access your personal data
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                Request correction of incorrect data
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                Request deletion of your data
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                Object to data processing
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                Request data portability
              </Typography>
            </li>
          </Box>
        </Paper>

        <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            6. Security
          </Typography>
          <Typography variant="body1" paragraph>
            We protect your data with state-of-the-art security measures.
            Firewalls, encryption, multi-factor authentication, and a very mean digital guard dog
            (his name is Docker).
          </Typography>
          <Typography variant="body1">
            However, no system is 100% secure. If someone hacks NASA,
            they can probably hack anyone. But we do our best.
          </Typography>
        </Paper>

        <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            7. Cookies
          </Typography>
          <Typography variant="body1" paragraph>
            We use essential technical cookies for the site to function.
            We don't use profiling or third-party advertising cookies.
            Our cookies are like grandma's cookies: homemade and without weird ingredients.
          </Typography>
          <Typography variant="body1">
            You can manage cookie preferences in your browser settings,
            but know that disabling them might make the site less functional.
          </Typography>
        </Paper>

        <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            8. Changes to This Policy
          </Typography>
          <Typography variant="body1" paragraph>
            We may update this policy from time to time.
            We'll notify you of any substantial changes through a notice on the site
            or via email (if you gave it to us).
          </Typography>
          <Typography variant="body1">
            Date of last update: the one written at the top. You read it, right?
          </Typography>
        </Paper>

        <Paper elevation={2} sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            9. Contact
          </Typography>
          <Typography variant="body1" paragraph>
            For any questions about this Privacy Policy, contact us at:
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Email:</strong> privacy@uaft.example.com
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Address:</strong> Cloud Street 42, 00100 Internet City
          </Typography>
          <Typography variant="body1" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
            (Ok, these are fictitious data. But if you really want to contact us,
            use the form on the site. When we make it. Soon. Maybe.)
          </Typography>
        </Paper>
        </>
        )}
      </Container>
    </>
  );
}
