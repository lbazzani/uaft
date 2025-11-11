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
import { useLanguage } from '@/contexts/LanguageContext';

export default function AboutSection() {
  const { t } = useLanguage();

  return (
    <Box id="about" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', py: { xs: 10, md: 15 }, backgroundColor: 'background.default' }}>
      <Container maxWidth="md">
        <ScrollAnimation>
          <Typography variant="h2" align="center" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
            {t('about.title')}
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 8, fontWeight: 400 }}>
            {t('about.subtitle')}
          </Typography>
        </ScrollAnimation>

        <ScrollAnimation delay={0.2}>
          <Paper elevation={4} sx={{ p: { xs: 4, md: 6 }, borderRadius: 4 }}>
            <Typography variant="h6" paragraph sx={{ fontWeight: 600, mb: 3 }}>
              {t('about.history.title')}
            </Typography>
            <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, fontSize: '1.1rem' }}>
              {t('about.history.p1')}
            </Typography>
            <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, fontSize: '1.1rem' }}>
              {t('about.history.p2')}
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, fontSize: '1.1rem' }}>
              {t('about.history.p3')}
            </Typography>

            <Divider sx={{ my: 4 }} />

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main', mb: 1 }}>
                    150+
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                    {t('about.stats.projects')}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main', mb: 1 }}>
                    98%
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                    {t('about.stats.satisfaction')}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main', mb: 1 }}>
                    10+
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                    {t('about.stats.experience')}
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
