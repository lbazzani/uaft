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
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
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
  Memory,
  Dns,
  Storage,
  Warning,
  Analytics,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated, config } from '@react-spring/web';
import { useLanguage } from '@/contexts/LanguageContext';
import Modal from './Modal';
import { Line, Bar, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

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
      <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)', color: 'white', position: 'relative', overflow: 'hidden', minHeight: 250 }}>
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
        <Grid size={{ xs: 6, md: 3 }}>
          <Card sx={{ background: 'linear-gradient(135deg, #F97316 0%, #FB923C 50%)' }}>
            <CardContent>
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>∞</Typography>
              <Typography variant="body2" sx={{ color: 'white', opacity: 0.9 }}>{t('demo.cloud.clouds')}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 50%)' }}>
            <CardContent>
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>999%</Typography>
              <Typography variant="body2" sx={{ color: 'white', opacity: 0.9 }}>{t('demo.cloud.cloudiness')}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Card sx={{ background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 50%)' }}>
            <CardContent>
              <Dns sx={{ color: 'white', fontSize: 30, mb: 1 }} />
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>24/7</Typography>
              <Typography variant="caption" sx={{ color: 'white', opacity: 0.9 }}>Uptime*</Typography>
              <Typography variant="caption" display="block" sx={{ color: 'white', opacity: 0.7, fontSize: '0.6rem' }}>*Anche di notte</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Card sx={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 50%)' }}>
            <CardContent>
              <Storage sx={{ color: 'white', fontSize: 30, mb: 1 }} />
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>∞ TB</Typography>
              <Typography variant="caption" sx={{ color: 'white', opacity: 0.9 }}>Storage</Typography>
              <Typography variant="caption" display="block" sx={{ color: 'white', opacity: 0.7, fontSize: '0.6rem' }}>Letteralmente</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {backupLevel === 100 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Paper sx={{ p: 3, mt: 3, bgcolor: '#FFF7ED' }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <Analytics sx={{ mr: 1, color: '#F97316' }} />
              📊 Cloud Performance in Tempo Reale (Forse)
            </Typography>
            <Line
              data={{
                labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'],
                datasets: [
                  {
                    label: 'Cloud Density',
                    data: [85, 92, 88, 95, 98, 94, 97],
                    borderColor: '#F97316',
                    backgroundColor: 'rgba(249, 115, 22, 0.1)',
                    tension: 0.4,
                    fill: true,
                  },
                  {
                    label: 'Cloudiness Level',
                    data: [90, 95, 93, 98, 99, 96, 99],
                    borderColor: '#06B6D4',
                    backgroundColor: 'rgba(6, 182, 212, 0.1)',
                    tension: 0.4,
                    fill: true,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top' },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100,
                    title: { display: true, text: 'Livello Cloud (%)' },
                  },
                },
              }}
            />
            <Alert severity="info" sx={{ mt: 2 }} icon={<Warning />}>
              <Typography variant="caption">
                *Questi dati sono generati in tempo reale da nuvole vere. Probabilmente. O forse da un random number generator. Chi può dirlo? ☁️
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

          <Paper sx={{ p: 3, mt: 3, background: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)', color: 'white' }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              {t('demo.ai.funfact.title')}
            </Typography>
            <Typography variant="body2">
              {t('demo.ai.funfact.desc')}
            </Typography>
          </Paper>

          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid size={{ xs: 6, md: 3 }}>
              <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <CardContent>
                  <Memory sx={{ color: 'white', fontSize: 30, mb: 1 }} />
                  <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>42</Typography>
                  <Typography variant="caption" sx={{ color: 'white', opacity: 0.9 }}>Neural Layers</Typography>
                  <Typography variant="caption" display="block" sx={{ color: 'white', opacity: 0.7, fontSize: '0.6rem' }}>La risposta a tutto</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <Card sx={{ background: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)' }}>
                <CardContent>
                  <SmartToy sx={{ color: 'white', fontSize: 30, mb: 1 }} />
                  <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>127%</Typography>
                  <Typography variant="caption" sx={{ color: 'white', opacity: 0.9 }}>AI Confidence</Typography>
                  <Typography variant="caption" display="block" sx={{ color: 'white', opacity: 0.7, fontSize: '0.6rem' }}>Più sicura di te</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <Card sx={{ background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)' }}>
                <CardContent>
                  <TrendingUp sx={{ color: 'white', fontSize: 30, mb: 1 }} />
                  <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>∞</Typography>
                  <Typography variant="caption" sx={{ color: 'white', opacity: 0.9 }}>Learning Rate</Typography>
                  <Typography variant="caption" display="block" sx={{ color: 'white', opacity: 0.7, fontSize: '0.6rem' }}>Sempre in beta</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <Card sx={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' }}>
                <CardContent>
                  <CheckCircle sx={{ color: 'white', fontSize: 30, mb: 1 }} />
                  <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>99.9%</Typography>
                  <Typography variant="caption" sx={{ color: 'white', opacity: 0.9 }}>Accuracy*</Typography>
                  <Typography variant="caption" display="block" sx={{ color: 'white', opacity: 0.7, fontSize: '0.6rem' }}>*Forse più, forse meno</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Paper sx={{ p: 3, mt: 3, bgcolor: '#F0F9FF' }}>
            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <SmartToy sx={{ mr: 1, color: '#667eea' }} />
              🧠 AI Capabilities Radar (Assolutamente Scientifico)
            </Typography>
            <Box sx={{ maxWidth: 500, mx: 'auto' }}>
              <Radar
                data={{
                  labels: ['Machine Learning', 'Deep Learning', 'Buzzword Usage', 'Hype Generation', 'Random Guessing', 'Pattern Recognition'],
                  datasets: [
                    {
                      label: 'UAFT AI',
                      data: [95, 88, 147, 125, 12, 92],
                      backgroundColor: 'rgba(102, 126, 234, 0.2)',
                      borderColor: '#667eea',
                      borderWidth: 2,
                      pointBackgroundColor: '#667eea',
                      pointBorderColor: '#fff',
                      pointHoverBackgroundColor: '#fff',
                      pointHoverBorderColor: '#667eea',
                    },
                    {
                      label: 'Competitor Average',
                      data: [60, 55, 80, 70, 45, 65],
                      backgroundColor: 'rgba(156, 163, 175, 0.2)',
                      borderColor: '#9CA3AF',
                      borderWidth: 2,
                      pointBackgroundColor: '#9CA3AF',
                      pointBorderColor: '#fff',
                      pointHoverBackgroundColor: '#fff',
                      pointHoverBorderColor: '#9CA3AF',
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'top' },
                  },
                  scales: {
                    r: {
                      beginAtZero: true,
                      max: 150,
                      ticks: {
                        stepSize: 30,
                      },
                    },
                  },
                }}
              />
            </Box>
            <Alert severity="warning" sx={{ mt: 3 }} icon={<Warning />}>
              <Typography variant="caption">
                Nota: Il nostro "Buzzword Usage" e "Hype Generation" sono off the charts!
                Questo è tecnicamente impossibile ma l'abbiamo fatto comunque. Perché siamo UAFT. 🚀
              </Typography>
            </Alert>
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

      {layers >= 100 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Paper sx={{ p: 3, mt: 3, bgcolor: '#ECFDF5' }}>
            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <Lock sx={{ mr: 1, color: '#059669' }} />
              🛡️ Security Layers Distribution (Molto Sicuro™)
            </Typography>
            <Bar
              data={{
                labels: ['Firewall', 'Encryption', 'Authentication', 'DDoS Protection', 'AI Threat Detection', 'Magic Shield'],
                datasets: [
                  {
                    label: 'Security Level',
                    data: [95, 98, 92, 99, 87, 147],
                    backgroundColor: [
                      'rgba(16, 185, 129, 0.8)',
                      'rgba(6, 182, 212, 0.8)',
                      'rgba(249, 115, 22, 0.8)',
                      'rgba(139, 92, 246, 0.8)',
                      'rgba(239, 68, 68, 0.8)',
                      'rgba(251, 191, 36, 0.8)',
                    ],
                    borderColor: [
                      '#10B981',
                      '#06B6D4',
                      '#F97316',
                      '#8B5CF6',
                      '#EF4444',
                      '#FBB F24',
                    ],
                    borderWidth: 2,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                  title: { display: false },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 150,
                    title: { display: true, text: 'Protection Level (%)' },
                  },
                },
              }}
            />
            <Alert severity="success" sx={{ mt: 3 }}>
              <Typography variant="caption">
                ✨ Come puoi vedere, il nostro "Magic Shield" supera il 100%. È tecnicamente impossibile,
                ma quando si tratta di sicurezza, noi di UAFT andiamo OLTRE i limiti della fisica. 🚀
              </Typography>
            </Alert>
          </Paper>
        </motion.div>
      )}
    </Box>
  );
};

// Demo Speed
const SpeedDemo = () => {
  const { t } = useLanguage();
  const [speed, setSpeed] = useState(0);
  const [loading, setLoading] = useState(0);
  const [particles, setParticles] = useState<number>(0);

  const springProps = useSpring({
    from: { number: 0 },
    to: { number: speed },
    config: config.molasses,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setSpeed(Math.floor(Math.random() * 900) + 100);
      setLoading(prev => (prev < 100 ? prev + 5 : 0));
      setParticles(prev => prev + Math.floor(Math.random() * 10000));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box>
      <Paper sx={{ p: 4, mb: 3, background: 'linear-gradient(135deg, #FA8BFF 0%, #2BD2FF 90%)', color: 'white', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Animated speed particles */}
        <Box sx={{ position: 'absolute', inset: 0, opacity: 0.1 }}>
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              style={{ position: 'absolute', left: '0%', top: `${20 * i}%` }}
              animate={{ left: '100%' }}
              transition={{ duration: 1 + i * 0.3, repeat: Infinity, ease: 'linear' }}
            >
              <FlashOn sx={{ fontSize: 30 }} />
            </motion.div>
          ))}
        </Box>

        <Box sx={{ position: 'relative', zIndex: 1 }}>
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
          <Chip
            label={`${particles.toLocaleString()} Speed Particles™ Generated`}
            sx={{ mt: 2, bgcolor: 'rgba(255,255,255,0.3)', color: 'white', fontWeight: 600 }}
          />
        </Box>
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
  const [cpuUsage, setCpuUsage] = useState(0);
  const [hackLevel, setHackLevel] = useState(0);

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

  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage(prev => Math.min(prev + Math.floor(Math.random() * 5), 99));
      setHackLevel(prev => Math.min(prev + 1, 100));
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {t('demo.code.generator')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip
            label={`CPU: ${cpuUsage}%`}
            size="small"
            sx={{ bgcolor: cpuUsage > 80 ? '#EF4444' : '#10B981', color: 'white', fontFamily: 'monospace' }}
          />
          <Chip
            label={`Hack Level: ${hackLevel}/100`}
            size="small"
            sx={{ bgcolor: '#667eea', color: 'white', fontFamily: 'monospace' }}
          />
        </Box>
      </Box>

      <Paper sx={{ p: 3, backgroundColor: '#1e1e1e', color: '#d4d4d4', fontFamily: 'monospace', minHeight: 300, mb: 3, position: 'relative', overflow: 'hidden' }}>
        {/* Matrix rain effect in background */}
        <Box sx={{ position: 'absolute', inset: 0, opacity: 0.03, pointerEvents: 'none' }}>
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              style={{ position: 'absolute', left: `${i * 10}%`, top: '-20px' }}
              animate={{ top: '100%' }}
              transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'linear' }}
            >
              <Typography sx={{ fontFamily: 'monospace', color: '#10B981', fontSize: '12px' }}>
                {Math.random().toString(36).substring(2, 15)}
              </Typography>
            </motion.div>
          ))}
        </Box>

        <Box sx={{ position: 'relative', zIndex: 1 }}>
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
        </Box>
      </Paper>

      <Grid container spacing={2}>
        <Grid size={{ xs: 6, md: 3 }}>
          <Paper sx={{ p: 2, textAlign: 'center', background: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)', color: 'white' }}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>{lines.length * 1000}+</Typography>
            <Typography variant="caption">{t('demo.code.lines')}</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Paper sx={{ p: 2, textAlign: 'center', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>0</Typography>
            <Typography variant="caption">{t('demo.code.bugs')}</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Paper sx={{ p: 2, textAlign: 'center', background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', color: 'white' }}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>42</Typography>
            <Typography variant="caption">Tests Passed*</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Paper sx={{ p: 2, textAlign: 'center', background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)', color: 'white' }}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>∞</Typography>
            <Typography variant="caption">Refactors Needed</Typography>
          </Paper>
        </Grid>
      </Grid>
      <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 1, fontStyle: 'italic', color: 'text.secondary' }}>
        {t('demo.code.disclaimer')} *I test? Li abbiamo scritti ma non li eseguiamo mai. 🤫
      </Typography>
    </Box>
  );
};

// Demo Deploy
const DeployDemo = () => {
  const { t } = useLanguage();
  const [deployed, setDeployed] = useState(false);
  const [progress, setProgress] = useState(0);
  const [deployTime, setDeployTime] = useState(0);
  const [serverCount, setServerCount] = useState(1);

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
        setDeployTime(prev => prev + 0.2);
        setServerCount(prev => Math.min(prev + Math.floor(Math.random() * 3), 147));
      }, 200);
      return () => clearInterval(interval);
    }
  }, [deployed]);

  return (
    <Box>
      <Paper sx={{ p: 4, textAlign: 'center', background: deployed ? 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' : 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)', color: 'white', mb: 3, position: 'relative', overflow: 'hidden' }}>
        {/* Rocket trail particles */}
        {!deployed && (
          <Box sx={{ position: 'absolute', inset: 0, opacity: 0.2 }}>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                style={{ position: 'absolute', left: '50%', bottom: '30%' }}
                animate={{
                  y: [0, -200],
                  x: [-20 + i * 5, -30 + i * 7],
                  opacity: [1, 0],
                  scale: [1, 0.3],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: 'easeOut',
                }}
              >
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#FFF', boxShadow: '0 0 10px #FFF' }} />
              </motion.div>
            ))}
          </Box>
        )}

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            animate={deployed ? { scale: [1, 1.2, 1], rotate: [0, 360] } : { y: [0, -10, 0] }}
            transition={deployed ? { duration: 0.5 } : { duration: 1, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Rocket sx={{ fontSize: 100 }} />
          </motion.div>
          <Typography variant="h4" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>
            {deployed ? t('demo.deploy.completed') : t('demo.deploy.inprogress')}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            {deployed ? t('demo.deploy.production') : t('demo.deploy.happening')}
          </Typography>
          {!deployed && (
            <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'center' }}>
              <Chip
                label={`⏱️ ${deployTime.toFixed(1)}s`}
                sx={{ bgcolor: 'rgba(255,255,255,0.3)', color: 'white', fontWeight: 600 }}
              />
              <Chip
                label={`🖥️ ${serverCount} Servers`}
                sx={{ bgcolor: 'rgba(255,255,255,0.3)', color: 'white', fontWeight: 600 }}
              />
            </Box>
          )}
        </Box>
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
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(90deg, #F97316 0%, #FB923C 50%, #38ef7d 100%)',
              },
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
            {[
              { label: t('demo.deploy.stat1'), icon: <CheckCircle sx={{ color: '#38ef7d', fontSize: 40 }} /> },
              { label: t('demo.deploy.stat2'), icon: <Rocket sx={{ color: '#F97316', fontSize: 40 }} /> },
              { label: t('demo.deploy.stat3'), icon: <Speed sx={{ color: '#06B6D4', fontSize: 40 }} /> },
            ].map((stat, index) => (
              <Grid key={stat.label} size={{ xs: 4 }}>
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: index * 0.1, type: 'spring' }}
                >
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    {stat.icon}
                    <Typography variant="body2" sx={{ mt: 1, fontWeight: 600 }}>{stat.label}</Typography>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          <Paper sx={{ p: 3, mt: 3, background: 'linear-gradient(135deg, #FFF7ED 0%, #FED7AA 100%)', border: '2px dashed #FA8BFF' }}>
            <Typography variant="body1" sx={{ fontWeight: 600, textAlign: 'center', mb: 1 }}>
              {t('demo.deploy.complete.msg', { time: deployTime.toFixed(1), servers: serverCount })}
            </Typography>
            <Typography variant="body2" sx={{ fontStyle: 'italic', textAlign: 'center', color: 'text.secondary' }}>
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

  const handleBuyService = () => {
    onClose();
    if (onOpenPayment) {
      onOpenPayment();
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
            onClick={handleBuyService}
            color="primary"
          >
            {t('demo.buy')}
          </Button>
        </>
      }
    >
      {service === 'cloud' && <CloudDemo />}
      {service === 'ai' && <AIDemo />}
      {service === 'security' && <SecurityDemo />}
      {service === 'speed' && <SpeedDemo />}
      {service === 'code' && <CodeDemo />}
      {service === 'deploy' && <DeployDemo />}
    </Modal>
  );
}
