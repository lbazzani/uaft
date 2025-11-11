'use client';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Divider,
} from '@mui/material';
import ScrollAnimation from './ScrollAnimation';

export default function AboutSection() {
  return (
    <Box id="about" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', py: { xs: 10, md: 15 }, backgroundColor: 'background.default' }}>
      <Container maxWidth="md">
        <ScrollAnimation>
          <Typography variant="h2" align="center" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
            Chi Siamo
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 8, fontWeight: 400 }}>
            Professionisti seri con un approccio non convenzionale
          </Typography>
        </ScrollAnimation>

        <ScrollAnimation delay={0.2}>
          <Paper elevation={4} sx={{ p: { xs: 4, md: 6 }, borderRadius: 4 }}>
            <Typography variant="h6" paragraph sx={{ fontWeight: 600, mb: 3 }}>
              La Nostra Storia
            </Typography>
            <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, fontSize: '1.1rem' }}>
              UAFT nasce dalla convinzione che la tecnologia enterprise non debba essere noiosa.
              Combiniamo competenze tecniche di alto livello con un approccio umano e accessibile.
            </Typography>
            <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, fontSize: '1.1rem' }}>
              Il nostro team è composto da professionisti certificati con esperienza in Fortune 500
              companies, startup innovative e tutto quello che sta nel mezzo. Prendiamo il lavoro
              seriamente, ma non noi stessi troppo seriamente.
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, fontSize: '1.1rem' }}>
              Risultato? Soluzioni tecnologiche robuste, scalabili e... perché no, anche divertenti da usare.
            </Typography>

            <Divider sx={{ my: 4 }} />

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main', mb: 1 }}>
                    150+
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                    Progetti Completati
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main', mb: 1 }}>
                    98%
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                    Client Satisfaction
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main', mb: 1 }}>
                    10+
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                    Anni Esperienza
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </ScrollAnimation>
      </Container>
    </Box>
  );
}
