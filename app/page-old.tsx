'use client';
import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  IconButton,
  Chip,
  Paper,
  useTheme,
  useMediaQuery,
  Fade,
} from '@mui/material';
import {
  Cloud,
  Security,
  Speed,
  Code,
  SmartToy,
  Rocket,
  AttachMoney,
  CheckCircle,
  LinkedIn,
  Twitter,
  GitHub,
} from '@mui/icons-material';
import Link from 'next/link';
import Logo from '@/components/Logo';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [isCalculating, setIsCalculating] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const services = [
    {
      icon: <Cloud sx={{ fontSize: 60 }} />,
      title: 'Cloud as a Cloud',
      description: 'Il cloud è nuvoloso per definizione. Noi lo rendiamo ancora più nuvoloso. Con backup dei backup dei backup. Non si sa mai.',
    },
    {
      icon: <SmartToy sx={{ fontSize: 60 }} />,
      title: 'AI Artificialmente Intelligente',
      description: 'La nostra AI è così intelligente che a volte ci fa paura. Ma la paghiamo bene quindi va tutto bene.',
    },
    {
      icon: <Security sx={{ fontSize: 60 }} />,
      title: 'Sicurezza Esagerata',
      description: 'Crittografiamo tutto. TUTTO. Anche questo testo era crittografato ma lo abbiamo decriptato per te.',
    },
    {
      icon: <Speed sx={{ fontSize: 60 }} />,
      title: 'Velocità Supersonica',
      description: 'I nostri server sono così veloci che il futuro ci invidia. Consegniamo prima che tu ordini. Quasi.',
    },
    {
      icon: <Code sx={{ fontSize: 60 }} />,
      title: 'Codice Automagico',
      description: 'Il nostro codice si scrive da solo. Noi stiamo qui a guardare con orgoglio. E a bere caffè.',
    },
    {
      icon: <Rocket sx={{ fontSize: 60 }} />,
      title: 'Deploy Istantaneo',
      description: 'Deploy così veloci che rompiamo la barriera del suono. E spesso anche la produzione. Ma tranquillo, abbiamo rollback.',
    },
  ];

  const calculatePrice = async () => {
    setIsCalculating(true);
    setEstimatedPrice(null);
    setAiAnalysis('');

    try {
      // Chiama l'API ChatGPT per analisi
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: `Analizza questa richiesta di servizio e fornisci un preventivo: "${prompt}"`,
            },
          ],
          type: 'pricing',
        }),
      });

      const data = await response.json();

      // Algoritmo sofisticatissimo di pricing
      const basePrice = 99;
      const randomFactor = Math.random() * 900;
      const wordCount = prompt.split(' ').length;
      const complexity = prompt.includes('AI') || prompt.includes('blockchain') ? 2 : 1;
      const price = Math.round((basePrice + randomFactor + wordCount * 10) * complexity);

      setEstimatedPrice(price);
      if (data.message) {
        setAiAnalysis(data.message);
      }
    } catch (error) {
      console.error('Errore:', error);
      // Fallback al vecchio sistema
      const basePrice = 99;
      const randomFactor = Math.random() * 900;
      const wordCount = prompt.split(' ').length;
      const complexity = prompt.includes('AI') || prompt.includes('blockchain') ? 2 : 1;
      const price = Math.round((basePrice + randomFactor + wordCount * 10) * complexity);
      setEstimatedPrice(price);
      setAiAnalysis('L\'analisi AI non è disponibile al momento, ma il prezzo è comunque accurato al 99%! (O forse meno)');
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <>
      {/* Header */}
      <AppBar position="static" elevation={0} sx={{ backgroundColor: 'white', color: 'primary.main' }}>
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <Logo size={36} />
          </Box>
          <Button color="inherit" component={Link} href="#services">
            Servizi
          </Button>
          <Button color="inherit" component={Link} href="#about">
            Chi Siamo
          </Button>
          <Button color="inherit" component={Link} href="/privacy">
            Privacy
          </Button>
          <Button variant="contained" sx={{ ml: 2 }}>
            Contattaci
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #2c2c2c 0%, #4a4a4a 100%)',
          color: 'white',
          py: { xs: 8, md: 15 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Chip
                label="Il Futuro è Adesso (o quasi)"
                sx={{ mb: 3, backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
              />
              <Typography
                variant={isMobile ? 'h3' : 'h1'}
                component="h1"
                gutterBottom
                sx={{ fontWeight: 800 }}
              >
                Una Azienda che può Fare Tutto
              </Typography>
              <Typography variant="h5" sx={{ mb: 4, opacity: 0.95, fontWeight: 400 }}>
                Seriamente. Qualsiasi cosa. Dacci un prompt e la nostra AI (brevettata, forse)
                ti dirà quanto costa realizzare il tuo sogno tecnologico.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{ backgroundColor: 'white', color: 'primary.main', '&:hover': { backgroundColor: '#f5f5f5' } }}
                  href="#ai-pricing"
                >
                  Prova l'AI Pricing
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{ borderColor: 'white', color: 'white', '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.1)' } }}
                >
                  Guarda i Servizi
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: 4,
                  p: 4,
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  ⚡ Perché Scegliere UAFT?
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
                  {[
                    '99.99% di uptime (l\'altro 0.01% stavamo bevendo caffè)',
                    'Supporto 24/7 (tranne quando dormiamo)',
                    'Scalabilità infinita (o quasi, dipende dal budget)',
                    'Team di esperti certificati (da noi stessi)',
                  ].map((item, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircle />
                      <Typography>{item}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* AI Pricing Section */}
      <Box id="ai-pricing" sx={{ py: 10, backgroundColor: '#f5f5f5' }}>
        <Container maxWidth="md">
          <Typography variant="h2" align="center" gutterBottom sx={{ fontWeight: 700 }}>
            🤖 AI Pricing Engine
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 6 }}>
            Descrivi il servizio che vuoi, la nostra AI superintelligente calcolerà il prezzo.
            Probabilmente. O forse tira a caso. Chi lo sa?
          </Typography>

          <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              placeholder="Esempio: Voglio un'app che ordina pizza usando il pensiero, con blockchain e AI che prevede quando avrò fame..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              sx={{ mb: 3 }}
            />
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={calculatePrice}
              disabled={!prompt || isCalculating}
              startIcon={<AttachMoney />}
            >
              {isCalculating ? 'Calcolando con algoritmi complessi...' : 'Calcola il Prezzo'}
            </Button>

            {estimatedPrice !== null && (
              <Fade in={true}>
                <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box
                    sx={{
                      p: 3,
                      backgroundColor: 'primary.main',
                      color: 'white',
                      borderRadius: 2,
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="h4" gutterBottom>
                      💰 Prezzo Stimato
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 800 }}>
                      €{estimatedPrice}/mese
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 2, opacity: 0.9 }}>
                      *Prezzo calcolato da un algoritmo estremamente sofisticato (Math.random()).
                      Per un preventivo serio, contattaci. Ma dove sarebbe il divertimento?
                    </Typography>
                  </Box>

                  {aiAnalysis && (
                    <Box
                      sx={{
                        p: 3,
                        backgroundColor: 'white',
                        borderRadius: 2,
                        border: '2px solid',
                        borderColor: 'primary.main',
                      }}
                    >
                      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <SmartToy color="primary" /> Analisi AI
                      </Typography>
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                        {aiAnalysis}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Fade>
            )}
          </Paper>
        </Container>
      </Box>

      {/* Services Section */}
      <Box id="services" sx={{ py: 10 }}>
        <Container maxWidth="lg">
          <Typography variant="h2" align="center" gutterBottom sx={{ fontWeight: 700 }}>
            I Nostri Super Servizi
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 8 }}>
            Tutto as a Service. Perché nel 2025 se non è "as a Service" non vale niente.
          </Typography>

          <Grid container spacing={4}>
            {services.map((service, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  elevation={2}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 8,
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 4 }}>
                    <Box sx={{ color: 'primary.main', mb: 2 }}>
                      {service.icon}
                    </Box>
                    <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                      {service.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {service.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* About Section */}
      <Box id="about" sx={{ py: 10, backgroundColor: '#f5f5f5' }}>
        <Container maxWidth="md">
          <Typography variant="h2" align="center" gutterBottom sx={{ fontWeight: 700 }}>
            Chi Siamo
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 6 }}>
            Un team di professionisti seri. Serissimi. Ok, abbastanza seri.
          </Typography>

          <Paper elevation={3} sx={{ p: 5, borderRadius: 3 }}>
            <Typography variant="body1" paragraph>
              UAFT nasce nel 2025 (proprio oggi, in realtà) dall'idea rivoluzionaria che
              un'azienda possa fare tutto. Letteralmente tutto. Web development? ✅ Machine Learning? ✅
              Preparare il caffè? Beh, quello ancora no, ma ci stiamo lavorando.
            </Typography>
            <Typography variant="body1" paragraph>
              Il nostro team è composto da ninja del codice, maghi del cloud, sussurratori di database
              e un gatto che ogni tanto cammina sulla tastiera ma che in qualche modo scrive codice migliore
              di tutti noi.
            </Typography>
            <Typography variant="body1">
              La nostra missione? Rendere la tecnologia accessibile, potente e soprattutto divertente.
              Perché la vita è troppo breve per lavorare con tecnologie noiose.
            </Typography>
          </Paper>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: 10,
          background: 'linear-gradient(135deg, #2c2c2c 0%, #4a4a4a 100%)',
          color: 'white',
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h2" gutterBottom sx={{ fontWeight: 700 }}>
            Pronto a Fare Tutto?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.95 }}>
            Contattaci per trasformare le tue idee in realtà. O almeno per provarci.
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              backgroundColor: 'white',
              color: 'primary.main',
              px: 6,
              py: 2,
              fontSize: '1.2rem',
              '&:hover': { backgroundColor: '#f5f5f5' },
            }}
          >
            Inizia Ora
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 6, backgroundColor: '#1a1a1a', color: 'white' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Logo size={36} color="white" />
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Una Azienda che può Fare Tutto
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
                © 2025 UAFT. Tutti i diritti riservati. Forse.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Link Utili
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Link href="/privacy" style={{ color: 'white', opacity: 0.8 }}>
                  Privacy Policy
                </Link>
                <Link href="/terms" style={{ color: 'white', opacity: 0.8 }}>
                  Termini e Condizioni
                </Link>
                <Link href="#" style={{ color: 'white', opacity: 0.8 }}>
                  Cookie Policy
                </Link>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Seguici
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <IconButton sx={{ color: 'white' }}>
                  <LinkedIn />
                </IconButton>
                <IconButton sx={{ color: 'white' }}>
                  <Twitter />
                </IconButton>
                <IconButton sx={{ color: 'white' }}>
                  <GitHub />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
