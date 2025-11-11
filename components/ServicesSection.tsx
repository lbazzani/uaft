'use client';
import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import {
  Cloud,
  Security,
  Speed,
  Code,
  SmartToy,
  Rocket,
} from '@mui/icons-material';
import ScrollAnimation from './ScrollAnimation';
import ServiceDemo from './ServiceDemo';
import PaymentDialog from './PaymentDialog';

const services = [
  {
    icon: <Cloud sx={{ fontSize: 60 }} />,
    title: 'Cloud as a Cloud',
    description: 'Il cloud è nuvoloso per definizione. Noi lo rendiamo ancora più nuvoloso. Con backup dei backup dei backup. Non si sa mai.',
    id: 'cloud' as const,
  },
  {
    icon: <SmartToy sx={{ fontSize: 60 }} />,
    title: 'AI Artificialmente Intelligente',
    description: 'La nostra AI è così intelligente che a volte ci fa paura. Ma la paghiamo bene quindi va tutto bene.',
    id: 'ai' as const,
  },
  {
    icon: <Security sx={{ fontSize: 60 }} />,
    title: 'Sicurezza Esagerata',
    description: 'Crittografiamo tutto. TUTTO. Anche questo testo era crittografato ma lo abbiamo decriptato per te.',
    id: 'security' as const,
  },
  {
    icon: <Speed sx={{ fontSize: 60 }} />,
    title: 'Velocità Supersonica',
    description: 'I nostri server sono così veloci che il futuro ci invidia. Consegniamo prima che tu ordini. Quasi.',
    id: 'speed' as const,
  },
  {
    icon: <Code sx={{ fontSize: 60 }} />,
    title: 'Codice Automagico',
    description: 'Il nostro codice si scrive da solo. Noi stiamo qui a guardare con orgoglio. E a bere caffè.',
    id: 'code' as const,
  },
  {
    icon: <Rocket sx={{ fontSize: 60 }} />,
    title: 'Deploy Istantaneo',
    description: 'Deploy così veloci che rompiamo la barriera del suono. E spesso anche la produzione. Ma tranquillo, abbiamo rollback.',
    id: 'deploy' as const,
  },
];

export default function ServicesSection() {
  const [demoOpen, setDemoOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<'cloud' | 'ai' | 'security' | 'speed' | 'code' | 'deploy' | null>(null);

  const handleServiceClick = (serviceId: typeof selectedService) => {
    setSelectedService(serviceId);
    setDemoOpen(true);
  };

  return (
    <>
      <ServiceDemo
        open={demoOpen}
        onClose={() => setDemoOpen(false)}
        service={selectedService}
        onOpenPayment={() => setPaymentOpen(true)}
      />
      <PaymentDialog
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        selectedService={selectedService}
      />
      <Box id="services" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', py: { xs: 10, md: 15 }, backgroundColor: 'white' }}>
        <Container maxWidth="lg">
          <ScrollAnimation>
            <Typography variant="h2" align="center" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
              I Nostri Servizi
            </Typography>
            <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 10, fontWeight: 400 }}>
              Soluzioni enterprise per ogni esigenza. Anche quelle che non sapevi di avere.
            </Typography>
          </ScrollAnimation>

          <Grid container spacing={4}>
            {services.map((service, index) => (
              <Grid key={index} size={{ xs: 12, md: 4 }}>
                <ScrollAnimation delay={index * 0.1}>
                  <Card
                    elevation={0}
                    onClick={() => handleServiceClick(service.id)}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 3,
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      position: 'relative',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
                        borderColor: 'primary.main',
                      },
                    }}
                  >
                    <Chip
                      label="✨ Vedi Demo"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        bgcolor: 'primary.main',
                        color: 'white',
                        fontWeight: 600,
                        animation: 'pulse 2s ease-in-out infinite',
                        '@keyframes pulse': {
                          '0%, 100%': { transform: 'scale(1)' },
                          '50%': { transform: 'scale(1.05)' },
                        },
                      }}
                    />
                    <CardContent sx={{ flexGrow: 1, p: 4 }}>
                      <Box sx={{ color: 'primary.main', mb: 3, textAlign: 'center' }}>
                        {service.icon}
                      </Box>
                      <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600, textAlign: 'center', mb: 2 }}>
                        {service.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', lineHeight: 1.7 }}>
                        {service.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </ScrollAnimation>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </>
  );
}
