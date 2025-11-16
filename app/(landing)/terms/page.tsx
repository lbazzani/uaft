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

export default function TermsPage() {
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
          {language === 'it' ? 'Termini e Condizioni' : 'Terms and Conditions'}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
          {language === 'it' ? 'Ultimo aggiornamento: 11 Novembre 2025' : 'Last updated: November 11, 2025'}
        </Typography>

        {language === 'it' ? (
          // VERSIONE ITALIANA
          <>

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
        </>
        ) : (
          // VERSIONE INGLESE
          <>
        <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            1. Acceptance of Terms
          </Typography>
          <Typography variant="body1" paragraph>
            Welcome to the Terms and Conditions of UAFT. If you're reading this,
            you're already more diligent than 99% of Internet users. Congratulations!
          </Typography>
          <Typography variant="body1">
            By using our site, you automatically accept these terms.
            If you don't accept them, you should probably close this page.
            But come on, don't be shy, we're nice people.
          </Typography>
        </Paper>

        <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            2. Service Description
          </Typography>
          <Typography variant="body1" paragraph>
            UAFT is a platform that provides IT services "as a Service".
            What does that mean? Basically, we can do everything. Or almost.
            Or at least we try.
          </Typography>
          <Typography variant="body1">
            Our AI pricing calculator uses a very sophisticated algorithm
            (Math.random() multiplied by various factors) to estimate service costs.
            The prices provided are purely indicative and probably completely made up.
          </Typography>
        </Paper>

        <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            3. Acceptable Use
          </Typography>
          <Typography variant="body1" paragraph>
            You agree to use our site responsibly. This means:
          </Typography>
          <Box component="ul" sx={{ pl: 3 }}>
            <li>
              <Typography variant="body1" paragraph>
                Don't try to hack the site (but if you succeed, send us your CV)
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                Don't use the AI calculator for illegal or immoral purposes
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                Don't spam or flood
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                Don't expect the prices generated by the AI to be accurate to the cent
              </Typography>
            </li>
          </Box>
        </Paper>

        <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            4. Intellectual Property
          </Typography>
          <Typography variant="body1" paragraph>
            All site content (text, images, code, terrible jokes)
            are the property of UAFT or their respective owners.
          </Typography>
          <Typography variant="body1">
            You can use the site for personal purposes, but you cannot copy,
            modify, distribute or sell our content without permission.
            Unless they're really good. In that case, at least give us credit.
          </Typography>
        </Paper>

        <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            5. Limitation of Liability
          </Typography>
          <Typography variant="body1" paragraph>
            UAFT provides the service "as is". We do our best
            to keep the site running, but we cannot guarantee:
          </Typography>
          <Box component="ul" sx={{ pl: 3 }}>
            <li>
              <Typography variant="body1" paragraph>
                That the site will always be available (servers need sleep too)
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                That the prices generated by the AI are accurate (spoiler: they're not)
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                That the site is bug-free (if it were, we'd be the first in history)
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                That our jokes are funny (humor is subjective)
              </Typography>
            </li>
          </Box>
          <Typography variant="body1" sx={{ mt: 2 }}>
            In any case, our liability is limited to the amount you paid
            to use the site. Which, at the moment, is zero. Math!
          </Typography>
        </Paper>

        <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            6. AI Disclaimer
          </Typography>
          <Typography variant="body1" paragraph>
            Our "AI Pricing Engine" is not a real artificial intelligence.
            It's more of a "random number generator with pretensions".
            Don't base important business decisions on its results.
          </Typography>
          <Typography variant="body1">
            If you want a real quote, contact us directly.
            Or at least, contact us when we've implemented the contact form.
            It's on the roadmap. Right after "making coffee".
          </Typography>
        </Paper>

        <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            7. Changes to Terms
          </Typography>
          <Typography variant="body1" paragraph>
            We reserve the right to modify these terms at any time.
            We will notify you of substantial changes through a notice on the site.
          </Typography>
          <Typography variant="body1">
            If you continue to use the site after the changes, it means you accept them.
            If you don't accept them, you can always leave. But why would you? We're awesome!
          </Typography>
        </Paper>

        <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            8. Applicable Law
          </Typography>
          <Typography variant="body1" paragraph>
            These terms are governed by Italian law.
            Any dispute will be resolved by the competent court of Internet City.
          </Typography>
          <Typography variant="body1">
            But come on, we're all adults here. If there's a problem, let's talk about it like civilized people.
            Maybe over coffee. Or pizza. We don't discriminate.
          </Typography>
        </Paper>

        <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            9. Severability
          </Typography>
          <Typography variant="body1" paragraph>
            If any part of these terms is declared invalid or unenforceable,
            the other parts remain in effect.
          </Typography>
          <Typography variant="body1">
            It's like when you remove pineapple from pizza: the pizza is still good.
            (Yes, we just took a position on the pineapple-on-pizza debate.
            Come at us.)
          </Typography>
        </Paper>

        <Paper elevation={2} sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            10. Contact
          </Typography>
          <Typography variant="body1" paragraph>
            For questions about these terms, contact us at:
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Email:</strong> legal@uaft.example.com
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Phone:</strong> +39 123 456 7890
          </Typography>
          <Typography variant="body1" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
            (These contacts are made up. When we're a real company,
            we promise to put real contacts. Pinky promise.)
          </Typography>
        </Paper>

        <Box sx={{ mt: 6, p: 4, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            📝 Final Note
          </Typography>
          <Typography variant="body1">
            If you made it this far, you're a hero. Seriously.
            Very few people actually read the Terms and Conditions.
            You're officially in the most diligent 1% club of the Internet.
            We're sending you a virtual badge. 🏆
          </Typography>
        </Box>
        </>
        )}
      </Container>
    </>
  );
}
