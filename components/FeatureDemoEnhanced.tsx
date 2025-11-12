'use client';
import { useState, useEffect } from 'react';
import {
  Button,
  Box,
  Typography,
  Paper,
  LinearProgress,
  Chip,
  Card,
  CardContent,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  CheckCircle,
  Rocket,
  SmartToy,
  Security,
  Terminal as TerminalIcon,
  CloudUpload,
  Analytics,
  Shield,
  Speed,
  TrendingUp,
  Warning,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from './Modal';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { useLanguage } from '@/contexts/LanguageContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface FeatureDemoProps {
  open: boolean;
  onClose: () => void;
  feature: 'deploy' | 'ai' | 'security' | null;
}

// Componente Gauge ironico
const IronicGauge = ({ value, label, subtitle }: { value: number; label: string; subtitle: string }) => {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{ position: 'relative' }}>
        <CircularProgress
          variant="determinate"
          value={100}
          size={120}
          thickness={4}
          sx={{ color: '#E5E7EB' }}
        />
        <CircularProgress
          variant="determinate"
          value={value}
          size={120}
          thickness={4}
          sx={{
            color: value > 90 ? '#10B981' : value > 70 ? '#F59E0B' : '#EF4444',
            position: 'absolute',
            left: 0,
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            },
          }}
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
            {value}%
          </Typography>
        </Box>
      </Box>
      <Typography variant="body2" sx={{ mt: 1, fontWeight: 600 }}>
        {label}
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', maxWidth: 120 }}>
        {subtitle}
      </Typography>
    </Box>
  );
};

// Demo Deploy Arricchito
const DeployDemoEnhanced = () => {
  const { t } = useLanguage();
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [showStats, setShowStats] = useState(false);
  const [deployTime, setDeployTime] = useState(0);

  const steps = [
    { label: t('featuredemo.deploy.step1'), time: 0.3 },
    { label: t('featuredemo.deploy.step2'), time: 1.2 },
    { label: t('featuredemo.deploy.step3'), time: 0.8 },
    { label: t('featuredemo.deploy.step4'), time: 0.5 },
    { label: t('featuredemo.deploy.step5'), time: 0.2 },
  ];

  useEffect(() => {
    if (progress < 100) {
      const timer = setTimeout(() => {
        setProgress(prev => Math.min(prev + 1, 100));
        setDeployTime(prev => prev + 0.18);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setShowStats(true);
    }
  }, [progress]);

  useEffect(() => {
    const stepIndex = Math.floor((progress / 100) * steps.length);
    setCurrentStep(Math.min(stepIndex, steps.length - 1));
  }, [progress]);

  // Grafico performance over time (ironico)
  const performanceData = {
    labels: ['0s', '5s', '10s', '15s', '18s'],
    datasets: [
      {
        label: t('featuredemo.deploy.chart.label1'),
        data: [0, 45, 78, 92, 98],
        borderColor: '#F97316',
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        tension: 0.4,
      },
      {
        label: t('featuredemo.deploy.chart.label2'),
        data: [0, 10, 25, 40, 55],
        borderColor: '#9CA3AF',
        backgroundColor: 'rgba(156, 163, 175, 0.1)',
        tension: 0.4,
        borderDash: [5, 5],
      },
    ],
  };

  return (
    <Box>
      {!showStats ? (
        <>
          <Alert severity="info" icon={<Rocket />} sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {t('featuredemo.deploy.alert', { time: (18 - deployTime).toFixed(1) })}
            </Typography>
          </Alert>

          <Paper
            sx={{
              p: 3,
              mb: 3,
              background: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)',
              color: 'white',
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>{steps[currentStep].label}</span>
              <Chip label={`${deployTime.toFixed(1)}s`} sx={{ bgcolor: 'rgba(255,255,255,0.3)', color: 'white', fontWeight: 700 }} />
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 12,
                borderRadius: 6,
                backgroundColor: 'rgba(255,255,255,0.3)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: 'white',
                  borderRadius: 6,
                },
              }}
            />
            <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
              {t('featuredemo.deploy.progress', { progress })}
            </Typography>
          </Paper>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <IronicGauge value={Math.min(progress, 98)} label={t('featuredemo.deploy.gauge1.label')} subtitle={t('featuredemo.deploy.gauge1.subtitle')} />
            <IronicGauge value={Math.min(progress * 0.9, 95)} label={t('featuredemo.deploy.gauge2.label')} subtitle={t('featuredemo.deploy.gauge2.subtitle')} />
            <IronicGauge value={Math.min(progress * 1.1, 99)} label={t('featuredemo.deploy.gauge3.label')} subtitle={t('featuredemo.deploy.gauge3.subtitle')} />
          </Box>
        </>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Alert severity="success" icon={<CheckCircle />} sx={{ mb: 3 }}>
            <Typography variant="body1" sx={{ fontWeight: 700 }}>
              {t('featuredemo.deploy.success', { time: deployTime.toFixed(1) })}
            </Typography>
            <Typography variant="body2">
              {t('featuredemo.deploy.success.desc')}
            </Typography>
          </Alert>

          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            <Card sx={{ flex: 1, minWidth: 150 }}>
              <CardContent>
                <CloudUpload sx={{ color: '#F97316', fontSize: 40, mb: 1 }} />
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {deployTime.toFixed(1)}s
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {t('featuredemo.deploy.stat1.label')}
                </Typography>
                <Typography variant="caption" display="block" sx={{ fontSize: '0.6rem', mt: 0.5 }}>
                  {t('featuredemo.deploy.stat1.note')}
                </Typography>
              </CardContent>
            </Card>
            <Card sx={{ flex: 1, minWidth: 150 }}>
              <CardContent>
                <Speed sx={{ color: '#10B981', fontSize: 40, mb: 1 }} />
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  98/100
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {t('featuredemo.deploy.stat2.label')}
                </Typography>
                <Typography variant="caption" display="block" sx={{ fontSize: '0.6rem', mt: 0.5 }}>
                  {t('featuredemo.deploy.stat2.note')}
                </Typography>
              </CardContent>
            </Card>
            <Card sx={{ flex: 1, minWidth: 150 }}>
              <CardContent>
                <TrendingUp sx={{ color: '#06B6D4', fontSize: 40, mb: 1 }} />
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  ∞
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {t('featuredemo.deploy.stat3.label')}
                </Typography>
                <Typography variant="caption" display="block" sx={{ fontSize: '0.6rem', mt: 0.5 }}>
                  {t('featuredemo.deploy.stat3.note')}
                </Typography>
              </CardContent>
            </Card>
          </Box>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {t('featuredemo.deploy.chart.title')}
            </Typography>
            <Line
              data={performanceData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: false },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100,
                  },
                },
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', textAlign: 'center' }}>
              {t('featuredemo.deploy.chart.note')}
            </Typography>
          </Paper>
        </motion.div>
      )}
    </Box>
  );
};

export default function FeatureDemoEnhanced({ open, onClose, feature }: FeatureDemoProps) {
  const { t } = useLanguage();

  const getTitle = () => {
    switch (feature) {
      case 'deploy':
        return t('featuredemo.deploy.title');
      case 'ai':
        return t('featuredemo.ai.title');
      case 'security':
        return t('featuredemo.security.title');
      default:
        return 'Demo';
    }
  };

  const getSubtitle = () => {
    switch (feature) {
      case 'deploy':
        return t('featuredemo.deploy.subtitle');
      case 'ai':
        return t('featuredemo.ai.subtitle');
      case 'security':
        return t('featuredemo.security.subtitle');
      default:
        return '';
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={getTitle()}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {getSubtitle()}
      </Typography>

      {feature === 'deploy' && <DeployDemoEnhanced />}
      {feature === 'ai' && (
        <Typography>{t('featuredemo.ai.comingsoon')}</Typography>
      )}
      {feature === 'security' && (
        <Typography>{t('featuredemo.security.comingsoon')}</Typography>
      )}
    </Modal>
  );
}
