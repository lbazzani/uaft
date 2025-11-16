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
import ScrollAnimation from '../shared/ScrollAnimation';
import ServiceDemo from './ServiceDemo';
import PaymentDialog from '../dialogs/PaymentDialog';
import { useLanguage } from '@/contexts/LanguageContext';

// Services will be generated dynamically with translations

export default function ServicesSection() {
  const { t } = useLanguage();
  const [demoOpen, setDemoOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<'cloud' | 'ai' | 'security' | 'speed' | 'code' | 'deploy' | null>(null);

  const services = [
    {
      icon: <Cloud sx={{ fontSize: 60 }} />,
      title: t('services.cloud.title'),
      description: t('services.cloud.desc'),
      id: 'cloud' as const,
    },
    {
      icon: <SmartToy sx={{ fontSize: 60 }} />,
      title: t('services.ai.title'),
      description: t('services.ai.desc'),
      id: 'ai' as const,
    },
    {
      icon: <Security sx={{ fontSize: 60 }} />,
      title: t('services.security.title'),
      description: t('services.security.desc'),
      id: 'security' as const,
    },
    {
      icon: <Speed sx={{ fontSize: 60 }} />,
      title: t('services.speed.title'),
      description: t('services.speed.desc'),
      id: 'speed' as const,
    },
    {
      icon: <Code sx={{ fontSize: 60 }} />,
      title: t('services.code.title'),
      description: t('services.code.desc'),
      id: 'code' as const,
    },
    {
      icon: <Rocket sx={{ fontSize: 60 }} />,
      title: t('services.deploy.title'),
      description: t('services.deploy.desc'),
      id: 'deploy' as const,
    },
  ];

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
              {t('services.title')}
            </Typography>
            <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 10, fontWeight: 400 }}>
              {t('services.subtitle')}
            </Typography>
          </ScrollAnimation>

          <Grid container spacing={4} sx={{ alignItems: 'stretch' }}>
            {services.map((service, index) => (
              <Grid key={index} size={{ xs: 12, md: 4 }} sx={{ display: 'flex' }}>
                <ScrollAnimation delay={index * 0.1} style={{ display: 'flex', width: '100%' }}>
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
                      cursor: 'pointer',
                      position: 'relative',
                      '&:hover': {
                        borderColor: 'primary.main',
                      },
                    }}
                  >
                    <Chip
                      label={`✨ ${t('services.demo.badge')}`}
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        bgcolor: 'primary.main',
                        color: 'white',
                        fontWeight: 600,
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
