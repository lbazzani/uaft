'use client';
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Paper,
  LinearProgress,
  Chip,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Alert,
} from '@mui/material';
import {
  Close,
  CheckCircle,
  Rocket,
  SmartToy,
  Security,
  Terminal as TerminalIcon,
  PlayArrow,
  CloudUpload,
  Analytics,
  Shield,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface FeatureDemoProps {
  open: boolean;
  onClose: () => void;
  feature: 'deploy' | 'ai' | 'security' | null;
}

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
            {progress}% completato
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
              92% più veloce della media
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
              Lighthouse Score
            </Typography>
          </CardContent>
        </Card>
      </Box>
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
        </motion.div>
      )}
    </Box>
  );
};

// Demo Security
const SecurityDemo = () => {
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
                <Typography variant="h6">Minacce Rilevate</Typography>
                <Typography variant="h3" sx={{ fontWeight: 700, my: 1 }}>
                  {threats}
                </Typography>
                <Typography variant="caption">Nelle ultime 24h</Typography>
              </CardContent>
            </Card>
            <Card sx={{ flex: 1, background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)', color: 'white' }}>
              <CardContent>
                <Typography variant="h6">Attacchi Bloccati</Typography>
                <Typography variant="h3" sx={{ fontWeight: 700, my: 1 }}>
                  {blocked}
                </Typography>
                <Typography variant="caption">100% successo</Typography>
              </CardContent>
            </Card>
          </Box>

          <Paper sx={{ p: 2, mb: 3, backgroundColor: '#ECFDF5', border: '2px solid #10B981' }}>
            <Typography variant="h6" sx={{ color: '#059669', mb: 1, display: 'flex', alignItems: 'center' }}>
              <CheckCircle sx={{ mr: 1 }} />
              Sistema Protetto
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tutti i controlli di sicurezza sono attivi e funzionanti correttamente.
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

export default function FeatureDemo({ open, onClose, feature }: FeatureDemoProps) {
  const getTitle = () => {
    switch (feature) {
      case 'deploy': return '🚀 Deploy Istantaneo - Live Demo';
      case 'ai': return '🤖 AI-Powered - Live Demo';
      case 'security': return '🛡️ Security First - Live Demo';
      default: return 'Demo';
    }
  };

  const getIcon = () => {
    switch (feature) {
      case 'deploy': return <Rocket sx={{ color: '#F97316' }} />;
      case 'ai': return <SmartToy sx={{ color: '#06B6D4' }} />;
      case 'security': return <Security sx={{ color: '#10B981' }} />;
      default: return null;
    }
  };

  const getColor = () => {
    switch (feature) {
      case 'deploy': return '#F97316';
      case 'ai': return '#06B6D4';
      case 'security': return '#10B981';
      default: return '#FF6B35';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          maxHeight: '90vh',
        },
      }}
    >
      <DialogTitle
        sx={{
          background: `linear-gradient(135deg, ${getColor()} 0%, ${getColor()}dd 100%)`,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {getIcon()}
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {getTitle()}
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 4, backgroundColor: '#FAFBFC' }}>
        {feature === 'deploy' && <DeployDemo />}
        {feature === 'ai' && <AIDemo />}
        {feature === 'security' && <SecurityDemo />}
      </DialogContent>

      <DialogActions sx={{ p: 3, backgroundColor: 'white', borderTop: '1px solid #E5E7EB' }}>
        <Button onClick={onClose} variant="outlined">
          Chiudi Demo
        </Button>
        <Button
          variant="contained"
          startIcon={<PlayArrow />}
          sx={{
            backgroundColor: getColor(),
            '&:hover': {
              backgroundColor: `${getColor()}dd`,
            }
          }}
        >
          Inizia Ora
        </Button>
      </DialogActions>
    </Dialog>
  );
}
