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
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import {
  Close,
  Cloud,
  SmartToy,
  Security,
  Speed,
  Code,
  Rocket,
  CheckCircle,
  TrendingUp,
  CloudQueue,
  Lock,
  FlashOn,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated, config } from '@react-spring/web';
import { useLanguage } from '@/contexts/LanguageContext';

interface ServiceDemoProps {
  open: boolean;
  onClose: () => void;
  service: 'cloud' | 'ai' | 'security' | 'speed' | 'code' | 'deploy' | null;
  onOpenPayment?: () => void;
}

// Demo Cloud
const CloudDemo = () => {
  const { t } = useLanguage();
  const [clouds, setClouds] = useState<number[]>([]);
  const [backupLevel, setBackupLevel] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setClouds(prev => {
        const newClouds = [...prev, Date.now()];
        return newClouds.slice(-20); // Keep only last 20
      });
    }, 300);

    const backupInterval = setInterval(() => {
      setBackupLevel(prev => (prev < 100 ? prev + 1 : 100));
    }, 50);

    return () => {
      clearInterval(interval);
      clearInterval(backupInterval);
    };
  }, []);

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', position: 'relative', overflow: 'hidden', minHeight: 250 }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
          {t('demo.cloud.intensifier')}
        </Typography>
        <Typography variant="body2" sx={{ mb: 3, opacity: 0.9 }}>
          {t('demo.cloud.tagline')}
        </Typography>

        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' }}>
          {clouds.map((id, index) => (
            <motion.div
              key={id}
              initial={{ x: -100, y: Math.random() * 200, opacity: 0 }}
              animate={{ x: 500, opacity: [0, 1, 1, 0] }}
              transition={{ duration: 5, ease: 'linear' }}
              style={{ position: 'absolute' }}
            >
              <CloudQueue sx={{ fontSize: 40 + Math.random() * 20, color: 'rgba(255,255,255,0.3)' }} />
            </motion.div>
          ))}
        </Box>

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>
            {t('demo.cloud.backup')}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={backupLevel}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: 'rgba(255,255,255,0.3)',
              '& .MuiLinearProgress-bar': { backgroundColor: 'white' }
            }}
          />
          <Typography variant="h6" sx={{ mt: 1 }}>
            {backupLevel}% - {backupLevel < 50 ? t('demo.cloud.inprogress') : backupLevel < 100 ? t('demo.cloud.backup2') : t('demo.cloud.backup3')}
          </Typography>
        </Box>
      </Paper>

      <Grid container spacing={2}>
        <Grid size={{ xs: 6 }}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%)' }}>
            <CardContent>
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>∞</Typography>
              <Typography variant="body2" sx={{ color: 'white', opacity: 0.9 }}>{t('demo.cloud.clouds')}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 50%)' }}>
            <CardContent>
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>999%</Typography>
              <Typography variant="body2" sx={{ color: 'white', opacity: 0.9 }}>{t('demo.cloud.cloudiness')}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

// Demo AI
const AIDemo = () => {
  const { t } = useLanguage();
  const [thinking, setThinking] = useState(true);
  const [predictions, setPredictions] = useState<Array<{ text: string; confidence: number }>>([]);

  useEffect(() => {
    setTimeout(() => {
      setThinking(false);
      setPredictions([
        { text: t('demo.ai.pred1'), confidence: 99.8 },
        { text: t('demo.ai.pred2'), confidence: 94.2 },
        { text: t('demo.ai.pred3'), confidence: 100 },
        { text: t('demo.ai.pred4'), confidence: 87.5 },
      ]);
    }, 3000);
  }, [t]);

  return (
    <Box>
      {thinking ? (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <SmartToy sx={{ fontSize: 100, color: '#667eea' }} />
          </motion.div>
          <Typography variant="h6" sx={{ mt: 3 }}>
            {t('demo.ai.thinking')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('demo.ai.coffee')}
          </Typography>
        </Box>
      ) : (
        <Box>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
            {t('demo.ai.predictions')}
          </Typography>

          {predictions.map((pred, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <Paper sx={{ p: 3, mb: 2, borderLeft: '4px solid #667eea' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {pred.text}
                  </Typography>
                  <Chip
                    label={`${pred.confidence}%`}
                    color="primary"
                    size="small"
                  />
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={pred.confidence}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: 'rgba(102, 126, 234, 0.2)',
                  }}
                />
              </Paper>
            </motion.div>
          ))}

          <Paper sx={{ p: 3, mt: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              {t('demo.ai.funfact.title')}
            </Typography>
            <Typography variant="body2">
              {t('demo.ai.funfact.desc')}
            </Typography>
          </Paper>
        </Box>
      )}
    </Box>
  );
};

// Demo Security
const SecurityDemo = () => {
  const { t } = useLanguage();
  const [threats, setThreats] = useState(0);
  const [blocked, setBlocked] = useState(0);
  const [layers, setLayers] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setThreats(prev => prev + Math.floor(Math.random() * 5) + 1);
      setBlocked(prev => prev + Math.floor(Math.random() * 5) + 1);
      setLayers(prev => Math.min(prev + 1, 128));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', color: 'white' }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 700, display: 'flex', alignItems: 'center' }}>
          <Lock sx={{ mr: 1 }} />
          {t('demo.security.system')}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9, mb: 3 }}>
          {t('demo.security.tagline')}
        </Typography>

        <Grid container spacing={2}>
          <Grid size={{ xs: 4 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>{threats}</Typography>
              <Typography variant="caption">{t('demo.security.threats.detected')}</Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 4 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>{blocked}</Typography>
              <Typography variant="caption">{t('demo.security.blocked')}</Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 4 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>{layers}</Typography>
              <Typography variant="caption">{t('demo.security.layers')}</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {[
          t('demo.security.feature1'),
          t('demo.security.feature2'),
          t('demo.security.feature3'),
          t('demo.security.feature4')
        ].map((feature, index) => (
          <motion.div
            key={feature}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CheckCircle sx={{ color: '#38ef7d', mr: 2 }} />
                <Typography variant="body1" sx={{ fontWeight: 500 }}>{feature}</Typography>
              </Box>
              <Chip label={t('demo.security.active')} size="small" sx={{ bgcolor: '#ECFDF5', color: '#059669', fontWeight: 600 }} />
            </Paper>
          </motion.div>
        ))}
      </Box>
    </Box>
  );
};

// Demo Speed
const SpeedDemo = () => {
  const { t } = useLanguage();
  const [speed, setSpeed] = useState(0);
  const [loading, setLoading] = useState(0);

  const springProps = useSpring({
    from: { number: 0 },
    to: { number: speed },
    config: config.molasses,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setSpeed(Math.floor(Math.random() * 900) + 100);
      setLoading(prev => (prev < 100 ? prev + 5 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box>
      <Paper sx={{ p: 4, mb: 3, background: 'linear-gradient(135deg, #FA8BFF 0%, #2BD2FF 90%)', color: 'white', textAlign: 'center' }}>
        <FlashOn sx={{ fontSize: 80, mb: 2 }} />
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
          <animated.span>
            {springProps.number.to(n => `${n.toFixed(0)}`)}
          </animated.span>
          <Typography component="span" variant="h4"> ms</Typography>
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          {t('demo.speed.response')}
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mt: 1 }}>
          {t('demo.speed.fast')}
        </Typography>
      </Paper>

      <Grid container spacing={2}>
        {[
          { label: t('demo.speed.requests'), value: '∞', icon: <TrendingUp /> },
          { label: t('demo.speed.latency'), value: '-5ms', icon: <Speed /> },
          { label: t('demo.speed.uptime'), value: '101%', icon: <CheckCircle /> },
        ].map((stat, index) => (
          <Grid key={stat.label} size={{ xs: 4 }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1, type: 'spring' }}
            >
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Box sx={{ color: '#FA8BFF', mb: 1 }}>{stat.icon}</Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>{stat.value}</Typography>
                  <Typography variant="caption" color="text.secondary">{stat.label}</Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ p: 2, mt: 3, backgroundColor: '#FFF7ED', border: '2px solid #FA8BFF' }}>
        <Typography variant="body2" sx={{ fontStyle: 'italic', textAlign: 'center' }}>
          {t('demo.speed.note')}
        </Typography>
      </Paper>
    </Box>
  );
};

// Demo Code
const CodeDemo = () => {
  const { t } = useLanguage();
  const [lines, setLines] = useState<string[]>([]);
  const [linesCount, setLinesCount] = useState(0);

  const codeLines = [
    'function makeItWork() {',
    '  // TODO: Implement actual logic',
    '  return "✨ Automagically works ✨";',
    '}',
    '',
    'const coffee = await brew();',
    'if (!coffee) {',
    '  throw new Error("Cannot code without coffee");',
    '}',
    '',
    '// AI writes the rest...',
    'console.log("Ship it! 🚀");',
  ];

  useEffect(() => {
    if (linesCount < codeLines.length) {
      const timeout = setTimeout(() => {
        setLines(prev => [...prev, codeLines[linesCount]]);
        setLinesCount(prev => prev + 1);
      }, 400);
      return () => clearTimeout(timeout);
    }
  }, [linesCount]);

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
        {t('demo.code.generator')}
      </Typography>

      <Paper sx={{ p: 3, backgroundColor: '#1e1e1e', color: '#d4d4d4', fontFamily: 'monospace', minHeight: 300, mb: 3 }}>
        {lines.map((line, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Typography
              variant="body2"
              sx={{
                fontFamily: 'monospace',
                color: line.includes('//') ? '#6A9955' : line.includes('function') ? '#DCDCAA' : '#CE9178',
                mb: 0.5,
              }}
            >
              {line || '\u00A0'}
            </Typography>
          </motion.div>
        ))}
        {linesCount < codeLines.length && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            style={{ color: '#d4d4d4' }}
          >
            ▊
          </motion.span>
        )}
      </Paper>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Paper sx={{ flex: 1, p: 2, textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>{lines.length * 1000}+</Typography>
          <Typography variant="caption">{t('demo.code.lines')}</Typography>
        </Paper>
        <Paper sx={{ flex: 1, p: 2, textAlign: 'center', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>0</Typography>
          <Typography variant="caption">{t('demo.code.bugs')}</Typography>
        </Paper>
      </Box>
      <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 1, fontStyle: 'italic', color: 'text.secondary' }}>
        {t('demo.code.disclaimer')}
      </Typography>
    </Box>
  );
};

// Demo Deploy
const DeployDemo = () => {
  const { t } = useLanguage();
  const [deployed, setDeployed] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!deployed) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setDeployed(true);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
      return () => clearInterval(interval);
    }
  }, [deployed]);

  return (
    <Box>
      <Paper sx={{ p: 4, textAlign: 'center', background: deployed ? 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', mb: 3 }}>
        <motion.div
          animate={deployed ? { scale: [1, 1.2, 1], rotate: [0, 360] } : {}}
          transition={{ duration: 0.5 }}
        >
          <Rocket sx={{ fontSize: 100 }} />
        </motion.div>
        <Typography variant="h4" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>
          {deployed ? t('demo.deploy.completed') : t('demo.deploy.inprogress')}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          {deployed ? t('demo.deploy.production') : t('demo.deploy.happening')}
        </Typography>
      </Paper>

      {!deployed && (
        <Box sx={{ mb: 3 }}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 12,
              borderRadius: 6,
              backgroundColor: 'rgba(102, 126, 234, 0.2)',
            }}
          />
          <Typography variant="caption" sx={{ mt: 1, display: 'block', textAlign: 'center' }}>
            {progress}% - {progress < 50 ? t('demo.deploy.building') : progress < 80 ? t('demo.deploy.testing') : t('demo.deploy.deploying')}
          </Typography>
        </Box>
      )}

      {deployed && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Grid container spacing={2}>
            {[t('demo.deploy.stat1'), t('demo.deploy.stat2'), t('demo.deploy.stat3')].map((stat, index) => (
              <Grid key={stat} size={{ xs: 4 }}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <CheckCircle sx={{ color: '#38ef7d', fontSize: 40 }} />
                  <Typography variant="body2" sx={{ mt: 1, fontWeight: 600 }}>{stat}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Paper sx={{ p: 2, mt: 3, backgroundColor: '#FFF7ED', border: '2px dashed #FA8BFF' }}>
            <Typography variant="body2" sx={{ fontStyle: 'italic', textAlign: 'center' }}>
              {t('demo.deploy.warning')}
            </Typography>
          </Paper>
        </motion.div>
      )}
    </Box>
  );
};

export default function ServiceDemo({ open, onClose, service, onOpenPayment }: ServiceDemoProps) {
  const { t } = useLanguage();

  const getTitle = () => {
    const titles = {
      cloud: t('demo.cloud.title'),
      ai: t('demo.ai.title'),
      security: t('demo.security.title'),
      speed: t('demo.speed.title'),
      code: t('demo.code.title'),
      deploy: t('demo.deploy.title'),
    };
    return service ? titles[service] : 'Demo';
  };

  const getColor = () => {
    const colors = {
      cloud: '#667eea',
      ai: '#764ba2',
      security: '#11998e',
      speed: '#FA8BFF',
      code: '#f093fb',
      deploy: '#38ef7d',
    };
    return service ? colors[service] : '#FF6B35';
  };

  const handleBuyService = () => {
    onClose();
    if (onOpenPayment) {
      onOpenPayment();
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
        <Box sx={{ fontWeight: 700, fontSize: '1.5rem' }}>
          {getTitle()}
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 4, backgroundColor: '#FAFBFC' }}>
        {service === 'cloud' && <CloudDemo />}
        {service === 'ai' && <AIDemo />}
        {service === 'security' && <SecurityDemo />}
        {service === 'speed' && <SpeedDemo />}
        {service === 'code' && <CodeDemo />}
        {service === 'deploy' && <DeployDemo />}
      </DialogContent>

      <DialogActions sx={{ p: 3, backgroundColor: 'white', borderTop: '1px solid #E5E7EB' }}>
        <Button onClick={onClose} variant="outlined">
          {t('demo.close')}
        </Button>
        <Button
          variant="contained"
          onClick={handleBuyService}
          sx={{
            backgroundColor: getColor(),
            '&:hover': {
              backgroundColor: `${getColor()}dd`,
            }
          }}
        >
          {t('demo.buy')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
