'use client';
import { useState, useEffect } from 'react';
import {
  Button,
  Box,
  Typography,
  Paper,
  LinearProgress,
  Chip,
  Stepper,
  Step,
  StepLabel,
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
  PlayArrow,
  CloudUpload,
  Analytics,
  Shield,
  Speed,
  TrendingUp,
  Warning,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from './Modal';
import { useLanguage } from '@/contexts/LanguageContext';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface FeatureDemoProps {
  open: boolean;
  onClose: () => void;
  feature: 'deploy' | 'ai' | 'security' | null;
  onOpenPricing?: () => void;
}

// Componente Gauge ironico
const IronicGauge = ({ value, label, subtitle }: { value: number; label: string; subtitle: string }) => {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', m: 2 }}>
      <Box sx={{ position: 'relative' }}>
        <CircularProgress
          variant="determinate"
          value={100}
          size={100}
          thickness={4}
          sx={{ color: '#E5E7EB' }}
        />
        <CircularProgress
          variant="determinate"
          value={value}
          size={100}
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
          }}
        >
          <Typography variant="h5" component="div" sx={{ fontWeight: 700 }}>
            {value}%
          </Typography>
        </Box>
      </Box>
      <Typography variant="body2" sx={{ mt: 1, fontWeight: 600, textAlign: 'center' }}>
        {label}
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', maxWidth: 100, fontSize: '0.65rem' }}>
        {subtitle}
      </Typography>
    </Box>
  );
};

// Componente terminale animato
const AnimatedTerminal = ({ lines }: { lines: string[] }) => {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < lines.length) {
      const timeout = setTimeout(() => {
        setDisplayedLines(prev => [...prev, lines[currentIndex]]);
        setCurrentIndex(prev => prev + 1);
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, lines]);

  return (
    <Paper
      sx={{
        backgroundColor: '#1a1a1a',
        color: '#00ff00',
        p: 3,
        fontFamily: 'monospace',
        minHeight: 300,
        maxHeight: 400,
        overflow: 'auto',
        position: 'relative',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, color: '#888' }}>
        <TerminalIcon sx={{ mr: 1, fontSize: 20 }} />
        <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
          uaft-terminal v2.0.99
        </Typography>
      </Box>
      {displayedLines.map((line, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Typography
            variant="body2"
            sx={{
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              mb: 0.5,
              color: line.includes('✓') ? '#00ff00' : line.includes('→') ? '#00bfff' : '#00ff00',
            }}
          >
            {line}
          </Typography>
        </motion.div>
      ))}
      {currentIndex < lines.length && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          style={{ color: '#00ff00' }}
        >
          ▊
        </motion.span>
      )}
    </Paper>
  );
};

// Demo Deploy
const DeployDemo = () => {
  const { t } = useLanguage();
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps = ['Build', 'Test', 'Deploy', 'Scale', 'Monitor'];

  const terminalLines = [
    '$ uaft deploy start',
    '→ Detecting project type...',
    '✓ Next.js 15 detected',
    '→ Installing dependencies...',
    '✓ Dependencies installed (2.3s)',
    '→ Running build...',
    '✓ Build complete (12.8s)',
    '→ Running tests...',
    '✓ All tests passed (3.2s)',
    '→ Deploying to production...',
    '✓ Deployed to https://your-app.uaft.io',
    '→ Configuring auto-scaling...',
    '✓ Auto-scaling configured (min: 2, max: 100)',
    '→ Setting up monitoring...',
    '✓ Monitoring active',
    '',
    '🚀 Deploy complete in 18.3 seconds!',
    '📊 Performance Score: 98/100',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });

      if (progress >= 20 && step < 1) setStep(1);
      if (progress >= 40 && step < 2) setStep(2);
      if (progress >= 60 && step < 3) setStep(3);
      if (progress >= 80 && step < 4) setStep(4);
    }, 100);

    return () => clearInterval(interval);
  }, [progress, step]);

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Stepper activeStep={step} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box sx={{ mt: 2 }}>
          <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
          <Typography variant="caption" sx={{ mt: 1, display: 'block', textAlign: 'center' }}>
            {t('demo.deploy.progress.percent', { progress })}
          </Typography>
        </Box>
      </Box>

      <AnimatedTerminal lines={terminalLines} />

      <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <CloudUpload sx={{ color: '#F97316', mr: 1 }} />
              <Typography variant="h6">Deploy Time</Typography>
            </Box>
            <Typography variant="h4" color="primary">18.3s</Typography>
            <Typography variant="caption" color="text.secondary">
              92% più veloce*
            </Typography>
            <Typography variant="caption" display="block" sx={{ fontSize: '0.6rem', mt: 0.5 }}>
              *del caffè del mattino
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Analytics sx={{ color: '#10B981', mr: 1 }} />
              <Typography variant="h6">Performance</Typography>
            </Box>
            <Typography variant="h4" color="success.main">98/100</Typography>
            <Typography variant="caption" color="text.secondary">
              I 2 punti persi?
            </Typography>
            <Typography variant="caption" display="block" sx={{ fontSize: '0.6rem', mt: 0.5 }}>
              Modestia.
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <TrendingUp sx={{ color: '#06B6D4', mr: 1 }} />
              <Typography variant="h6">Scalabilità</Typography>
            </Box>
            <Typography variant="h4" sx={{ color: '#06B6D4' }}>∞</Typography>
            <Typography variant="caption" color="text.secondary">
              Letteralmente infinito
            </Typography>
            <Typography variant="caption" display="block" sx={{ fontSize: '0.6rem', mt: 0.5 }}>
              Trust us bro.
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {progress === 100 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
            <IronicGauge value={98} label="Magia Applicata" subtitle="(alias tecnologia)" />
            <IronicGauge value={147} label="Buzzword Density" subtitle="Off the charts!" />
            <IronicGauge value={99} label="Hype Level" subtitle="MASSIMO!" />
          </Box>

          <Paper sx={{ p: 3, mt: 3, bgcolor: '#FFF7ED' }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <Speed sx={{ mr: 1, color: '#F97316' }} />
              {t('demo.security.comparison')}
            </Typography>
            <Line
              data={{
                labels: ['0s', '5s', '10s', '15s', '18s'],
                datasets: [
                  {
                    label: 'UAFT Deploy',
                    data: [0, 45, 78, 92, 98],
                    borderColor: '#F97316',
                    backgroundColor: 'rgba(249, 115, 22, 0.1)',
                    tension: 0.4,
                    borderWidth: 3,
                  },
                  {
                    label: 'Competitor Medio',
                    data: [0, 10, 25, 40, 55],
                    borderColor: '#9CA3AF',
                    backgroundColor: 'rgba(156, 163, 175, 0.1)',
                    tension: 0.4,
                    borderDash: [5, 5],
                  },
                  {
                    label: 'Deploy Manuale (no comment)',
                    data: [0, 5, 12, 20, 28],
                    borderColor: '#EF4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    tension: 0.4,
                    borderDash: [10, 5],
                  },
                ],
              }}
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
                    title: { display: true, text: 'Performance Score' },
                  },
                  x: {
                    title: { display: true, text: 'Tempo (secondi)' },
                  },
                },
              }}
            />
            <Alert severity="info" sx={{ mt: 2 }} icon={<Warning />}>
              <Typography variant="caption">
                *Disclaimer: Questi grafici sono stati generati da una AI addestrata su stackoverflow e troppo caffè.
                I risultati potrebbero variare. O no. Chi lo sa veramente? 🤷
              </Typography>
            </Alert>
          </Paper>
        </motion.div>
      )}
    </Box>
  );
};

// Demo AI
const AIDemo = () => {
  const [analysis, setAnalysis] = useState(0);
  const [predictions, setPredictions] = useState<Array<{ label: string; confidence: number; color: string }>>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnalysis((prev) => Math.min(prev + 1, 100));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (analysis === 100) {
      setPredictions([
        { label: 'Traffic Spike Detection', confidence: 97, color: '#F59E0B' },
        { label: 'Performance Optimization', confidence: 94, color: '#10B981' },
        { label: 'Cost Reduction', confidence: 89, color: '#3B82F6' },
        { label: 'Security Threat Prevention', confidence: 96, color: '#DC2626' },
      ]);
    }
  }, [analysis]);

  return (
    <Box>
      <Alert severity="info" icon={<SmartToy />} sx={{ mb: 3 }}>
        La nostra AI sta analizzando il tuo sistema in tempo reale...
      </Alert>

      <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <SmartToy sx={{ mr: 1 }} />
          Neural Network Analysis
        </Typography>
        <Box sx={{ mb: 1 }}>
          <LinearProgress
            variant="determinate"
            value={analysis}
            sx={{
              height: 10,
              borderRadius: 5,
              backgroundColor: 'rgba(255,255,255,0.3)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: 'white',
              }
            }}
          />
        </Box>
        <Typography variant="caption">
          Analizzando {analysis}% dei pattern...
        </Typography>
      </Paper>

      <AnimatePresence>
        {predictions.length > 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              🎯 Predizioni AI
            </Typography>
            {predictions.map((pred, index) => (
              <motion.div
                key={pred.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <Paper sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {pred.label}
                    </Typography>
                    <Chip
                      label={`${pred.confidence}% confident`}
                      size="small"
                      sx={{ bgcolor: pred.color, color: 'white' }}
                    />
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={pred.confidence}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: `${pred.color}20`,
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: pred.color,
                      }
                    }}
                  />
                </Paper>
              </motion.div>
            ))}
          </Box>
        )}
      </AnimatePresence>

      {analysis === 100 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <Alert severity="success" icon={<CheckCircle />} sx={{ mt: 3 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Analisi completata! L'AI ha identificato 4 opportunità di ottimizzazione.
            </Typography>
          </Alert>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
            <IronicGauge value={94} label="AI Confidence" subtitle="73% delle volte" />
            <IronicGauge value={127} label="Neural Density" subtitle="Molto neurale" />
            <IronicGauge value={89} label="Buzzword Score" subtitle="AI-powered!" />
          </Box>

          <Paper sx={{ p: 3, mt: 3, bgcolor: '#F0F9FF' }}>
            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <SmartToy sx={{ mr: 1, color: '#06B6D4' }} />
              🧠 Come Pensa la Nostra AI (Probabilmente)
            </Typography>
            <Box sx={{ maxWidth: 400, mx: 'auto' }}>
              <Doughnut
                data={{
                  labels: [
                    'Machine Learning Vero',
                    'If/Else Statements',
                    'Random Number Generator',
                    'Magia Nera',
                    'Stack Overflow',
                  ],
                  datasets: [
                    {
                      data: [35, 25, 15, 10, 15],
                      backgroundColor: [
                        '#10B981',
                        '#F59E0B',
                        '#3B82F6',
                        '#8B5CF6',
                        '#EF4444',
                      ],
                      borderWidth: 2,
                      borderColor: '#fff',
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          return `${context.label}: ${context.parsed}% (forse)`;
                        },
                      },
                    },
                  },
                }}
              />
            </Box>
            <Alert severity="warning" sx={{ mt: 3 }} icon={<Warning />}>
              <Typography variant="caption">
                Disclaimer: Questo grafico potrebbe essere accurato quanto un oroscopo.
                Ma hey, sembra professionale! 📊
              </Typography>
            </Alert>
          </Paper>
        </motion.div>
      )}
    </Box>
  );
};

// Demo Security
const SecurityDemo = () => {
  const { t } = useLanguage();
  const [scanning, setScanning] = useState(true);
  const [threats, setThreats] = useState(0);
  const [blocked, setBlocked] = useState(0);

  const securityMetrics = [
    { label: 'SQL Injection', status: 'blocked', severity: 'high' },
    { label: 'XSS Attack', status: 'blocked', severity: 'critical' },
    { label: 'CSRF Token', status: 'validated', severity: 'medium' },
    { label: 'Rate Limiting', status: 'active', severity: 'low' },
    { label: 'DDoS Protection', status: 'active', severity: 'high' },
    { label: 'Data Encryption', status: 'enabled', severity: 'critical' },
  ];

  useEffect(() => {
    const scanTimeout = setTimeout(() => {
      setScanning(false);
      setThreats(247);
      setBlocked(247);
    }, 3000);

    const threatInterval = setInterval(() => {
      setThreats(prev => prev + Math.floor(Math.random() * 3));
      setBlocked(prev => prev + Math.floor(Math.random() * 3));
    }, 2000);

    return () => {
      clearTimeout(scanTimeout);
      clearInterval(threatInterval);
    };
  }, []);

  return (
    <Box>
      {scanning ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <Shield sx={{ fontSize: 80, color: '#10B981' }} />
          </motion.div>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Scansione sistema di sicurezza...
          </Typography>
          <LinearProgress sx={{ mt: 2, maxWidth: 400, mx: 'auto' }} />
        </Box>
      ) : (
        <>
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Card sx={{ flex: 1, background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', color: 'white' }}>
              <CardContent>
                <Typography variant="h6">{t('demo.security.threats.detected')}</Typography>
                <Typography variant="h3" sx={{ fontWeight: 700, my: 1 }}>
                  {threats}
                </Typography>
                <Typography variant="caption">{t('demo.security.last24h')}</Typography>
              </CardContent>
            </Card>
            <Card sx={{ flex: 1, background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)', color: 'white' }}>
              <CardContent>
                <Typography variant="h6">{t('demo.security.blocked')}</Typography>
                <Typography variant="h3" sx={{ fontWeight: 700, my: 1 }}>
                  {blocked}
                </Typography>
                <Typography variant="caption">{t('demo.security.success')}</Typography>
              </CardContent>
            </Card>
          </Box>

          <Paper sx={{ p: 2, mb: 3, backgroundColor: '#ECFDF5', border: '2px solid #10B981' }}>
            <Typography variant="h6" sx={{ color: '#059669', mb: 1, display: 'flex', alignItems: 'center' }}>
              <CheckCircle sx={{ mr: 1 }} />
              {t('demo.security.protected')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('demo.security.protected.desc')}
            </Typography>
          </Paper>

          <Typography variant="h6" sx={{ mb: 2 }}>
            🛡️ Security Layers Active
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {securityMetrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Shield sx={{ color: '#10B981', mr: 2 }} />
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {metric.label}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip
                      label={metric.status.toUpperCase()}
                      size="small"
                      sx={{ bgcolor: '#ECFDF5', color: '#059669', fontWeight: 600 }}
                    />
                    <Chip
                      label={metric.severity}
                      size="small"
                      color={metric.severity === 'critical' ? 'error' : metric.severity === 'high' ? 'warning' : 'default'}
                    />
                  </Box>
                </Paper>
              </motion.div>
            ))}
          </Box>

          <Alert severity="success" icon={<Shield />} sx={{ mt: 3 }}>
            <Typography variant="body2">
              <strong>SOC 2 & GDPR Compliant</strong> - Certificazioni enterprise attive
            </Typography>
          </Alert>
        </>
      )}
    </Box>
  );
};

export default function FeatureDemo({ open, onClose, feature, onOpenPricing }: FeatureDemoProps) {
  const { t } = useLanguage();

  const getTitle = () => {
    switch (feature) {
      case 'deploy': return t('demo.title.deploy');
      case 'ai': return t('demo.title.ai');
      case 'security': return t('demo.title.security');
      default: return 'Demo';
    }
  };

  const handleStartNow = () => {
    onClose();
    if (onOpenPricing) {
      onOpenPricing();
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={getTitle()}
      maxWidth="md"
      actions={
        <>
          <Button onClick={onClose} variant="outlined" color="inherit">
            {t('demo.close')}
          </Button>
          <Button
            variant="contained"
            startIcon={<PlayArrow />}
            color="primary"
            onClick={handleStartNow}
          >
            Inizia Ora
          </Button>
        </>
      }
    >
      {feature === 'deploy' && <DeployDemo />}
      {feature === 'ai' && <AIDemo />}
      {feature === 'security' && <SecurityDemo />}
    </Modal>
  );
}
