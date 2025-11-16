'use client';
import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Chip,
  LinearProgress,
  Tooltip,
  Fade,
  Grow,
} from '@mui/material';
import {
  Person,
  SmartToy,
  TrendingUp,
  Lightbulb,
  Code,
  Coffee,
  BugReport,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import ScrollAnimation from '../shared/ScrollAnimation';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AboutSection() {
  const { t } = useLanguage();

  // Animated stats for team
  const [humanIdeas, setHumanIdeas] = useState(3);
  const [aiCode, setAiCode] = useState(2847);
  const [coffee, setCoffee] = useState(7);
  const [bugs, setBugs] = useState(42);

  // Hoverable stats with random values
  const [hoveredStat, setHoveredStat] = useState<string | null>(null);
  const [randomRevenue, setRandomRevenue] = useState(147);
  const [randomClients, setRandomClients] = useState(0);
  const [randomSatisfaction, setRandomSatisfaction] = useState(101);

  // Roadmap metrics that change on hover
  const [roadmapHovered, setRoadmapHovered] = useState<string | null>(null);
  const [q1Values, setQ1Values] = useState({ clients: 0, revenue: 0, hope: 147 });
  const [q2Values, setQ2Values] = useState({ clients: 2, revenue: 5000, optimism: 178 });
  const [q3Values, setQ3Values] = useState({ clients: 47, revenue: 2.5, credibility: 73 });
  const [q4Values, setQ4Values] = useState({ clients: 10000, valuation: 1.5, reality: 12 });

  useEffect(() => {
    const interval = setInterval(() => {
      // Animate team stats
      setHumanIdeas(prev => Math.floor(Math.random() * 5) + 1);
      setAiCode(prev => prev + Math.floor(Math.random() * 500) + 100);
      setCoffee(prev => prev + (Math.random() > 0.7 ? 1 : 0));
      setBugs(prev => prev + Math.floor(Math.random() * 3) - 1);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleStatHover = (stat: string) => {
    setHoveredStat(stat);
    setRandomRevenue(Math.floor(Math.random() * 900) + 100);
    setRandomClients(Math.floor(Math.random() * 5));
    setRandomSatisfaction(Math.floor(Math.random() * 50) + 75);
  };

  const handleRoadmapHover = (quarter: string) => {
    setRoadmapHovered(quarter);
    if (quarter === 'q1') {
      setQ1Values({
        clients: Math.floor(Math.random() * 3),
        revenue: Math.floor(Math.random() * 100),
        hope: Math.floor(Math.random() * 50) + 100,
      });
    } else if (quarter === 'q2') {
      setQ2Values({
        clients: Math.floor(Math.random() * 10) + 1,
        revenue: Math.floor(Math.random() * 10000) + 1000,
        optimism: Math.floor(Math.random() * 100) + 100,
      });
    } else if (quarter === 'q3') {
      setQ3Values({
        clients: Math.floor(Math.random() * 100) + 10,
        revenue: Math.random() * 5 + 0.5,
        credibility: Math.floor(Math.random() * 80) + 20,
      });
    } else if (quarter === 'q4') {
      setQ4Values({
        clients: Math.floor(Math.random() * 50000) + 5000,
        valuation: Math.random() * 10 + 0.1,
        reality: Math.floor(Math.random() * 30) + 5,
      });
    }
  };

  return (
    <Box id="about" sx={{ minHeight: '100vh', py: { xs: 10, md: 15 }, backgroundColor: '#FAFBFC' }}>
      <Container maxWidth="lg">
        {/* Header */}
        <ScrollAnimation>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Chip
              label={t('about.badge')}
              sx={{
                mb: 2,
                backgroundColor: '#FFF7ED',
                color: '#F97316',
                fontWeight: 600,
                fontSize: '0.875rem',
                border: '1px solid #FED7AA',
              }}
            />
            <Typography variant="h2" sx={{ fontWeight: 700, mb: 2, fontSize: { xs: '2rem', md: '2.75rem' } }}>
              {t('about.title')}
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400, maxWidth: '700px', mx: 'auto' }}>
              {t('about.subtitle')}
            </Typography>
          </Box>
        </ScrollAnimation>

        {/* Origin Story */}
        <ScrollAnimation delay={0.1}>
          <Paper elevation={0} sx={{ p: { xs: 4, md: 5 }, mb: 6, borderRadius: 3, border: '1px solid #E5E7EB' }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
              {t('about.origin.title')}
            </Typography>
            <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, fontSize: '1.05rem', color: 'text.secondary' }}>
              {t('about.origin.p1')}
            </Typography>
            <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, fontSize: '1.05rem', color: 'text.secondary' }}>
              {t('about.origin.p2')}
            </Typography>
            <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, fontSize: '1.05rem', color: 'text.secondary' }}>
              {t('about.origin.p3')}
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', mt: 3, fontStyle: 'italic', color: 'text.disabled' }}>
              {t('about.origin.disclaimer')}
            </Typography>
          </Paper>
        </ScrollAnimation>

        {/* Team Section */}
        <ScrollAnimation delay={0.2}>
          <Box sx={{ mb: 6 }}>
            <Typography variant="h4" align="center" sx={{ fontWeight: 700, mb: 1 }}>
              {t('about.team.title')}
            </Typography>
            <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
              {t('about.team.subtitle')}
            </Typography>

            <Grid container spacing={3}>
              {/* Human */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    height: '100%',
                    borderRadius: 3,
                    border: '2px solid #E5E7EB',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      borderColor: '#F97316',
                      boxShadow: '0 8px 24px rgba(249, 115, 22, 0.15)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {/* Thinking animation */}
                  <Box sx={{ position: 'absolute', top: 20, right: 20, opacity: 0.6 }}>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Lightbulb sx={{ fontSize: 40, color: '#F97316' }} />
                    </motion.div>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: 2,
                        backgroundColor: '#FFF7ED',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Person sx={{ fontSize: 36, color: '#F97316' }} />
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {t('about.team.human.title')}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {t('about.team.human.role')}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography variant="body2" sx={{ mb: 3, lineHeight: 1.7, color: 'text.secondary' }}>
                    {t('about.team.human.desc', { years: '25' })}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip
                      icon={<Lightbulb sx={{ fontSize: 16 }} />}
                      label={`${humanIdeas} ${t('about.team.stats.ideas')}`}
                      size="small"
                      sx={{ backgroundColor: '#FFF7ED', color: '#EA580C', fontWeight: 600 }}
                    />
                    <Chip
                      icon={<Coffee sx={{ fontSize: 16 }} />}
                      label={`${coffee} ${t('about.team.stats.coffee')}`}
                      size="small"
                      sx={{ backgroundColor: '#F0FDF4', color: '#16A34A', fontWeight: 600 }}
                    />
                  </Box>

                  <Typography variant="caption" sx={{ display: 'block', mt: 2, fontStyle: 'italic', color: 'text.disabled' }}>
                    {t('about.team.human.thinking')}
                  </Typography>
                </Paper>
              </Grid>

              {/* AI Agents */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    height: '100%',
                    borderRadius: 3,
                    border: '2px solid #E5E7EB',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      borderColor: '#3B82F6',
                      boxShadow: '0 8px 24px rgba(59, 130, 246, 0.15)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {/* Code particles flying */}
                  <Box sx={{ position: 'absolute', inset: 0, opacity: 0.05, pointerEvents: 'none' }}>
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        style={{ position: 'absolute', left: '10%', top: `${i * 15}%` }}
                        animate={{ left: '90%', opacity: [0, 1, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                      >
                        <Code sx={{ fontSize: 20, color: '#3B82F6' }} />
                      </motion.div>
                    ))}
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, position: 'relative', zIndex: 1 }}>
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: 2,
                        backgroundColor: '#EFF6FF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <SmartToy sx={{ fontSize: 36, color: '#3B82F6' }} />
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {t('about.team.ai.title')}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {t('about.team.ai.role')}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography variant="body2" sx={{ mb: 3, lineHeight: 1.7, color: 'text.secondary', position: 'relative', zIndex: 1 }}>
                    {t('about.team.ai.desc')}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
                    <Chip
                      icon={<Code sx={{ fontSize: 16 }} />}
                      label={`${aiCode.toLocaleString()} ${t('about.team.stats.code')}`}
                      size="small"
                      sx={{ backgroundColor: '#EFF6FF', color: '#2563EB', fontWeight: 600 }}
                    />
                    <Chip
                      icon={<BugReport sx={{ fontSize: 16 }} />}
                      label={`${bugs} ${t('about.team.stats.bugs')}`}
                      size="small"
                      sx={{ backgroundColor: '#FEF2F2', color: '#DC2626', fontWeight: 600 }}
                    />
                  </Box>

                  <Typography variant="caption" sx={{ display: 'block', mt: 2, fontStyle: 'italic', color: 'text.disabled', position: 'relative', zIndex: 1 }}>
                    {t('about.team.ai.coding')}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </ScrollAnimation>

        {/* Roadmap */}
        <ScrollAnimation delay={0.3}>
          <Box sx={{ mb: 6 }}>
            <Typography variant="h4" align="center" sx={{ fontWeight: 700, mb: 1 }}>
              {t('about.roadmap.title')}
            </Typography>
            <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
              {t('about.roadmap.subtitle')}
            </Typography>

            <Grid container spacing={3}>
              {/* Q1 */}
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Grow in timeout={500}>
                  <Paper
                    elevation={0}
                    onMouseEnter={() => handleRoadmapHover('q1')}
                    onMouseLeave={() => setRoadmapHovered(null)}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      border: '2px solid #E5E7EB',
                      backgroundColor: roadmapHovered === 'q1' ? '#FFFBEB' : 'white',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: '#FCD34D',
                        transform: 'translateY(-4px)',
                      },
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, fontSize: '0.95rem' }}>
                      {t('about.roadmap.q1.title')}
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        {t('about.roadmap.q1.metric1', { value: q1Values.clients })}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t('about.roadmap.q1.metric2', { value: q1Values.revenue })}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t('about.roadmap.q1.metric3', { value: q1Values.hope })}
                      </Typography>
                    </Box>
                  </Paper>
                </Grow>
              </Grid>

              {/* Q2 */}
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Grow in timeout={700}>
                  <Paper
                    elevation={0}
                    onMouseEnter={() => handleRoadmapHover('q2')}
                    onMouseLeave={() => setRoadmapHovered(null)}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      border: '2px solid #E5E7EB',
                      backgroundColor: roadmapHovered === 'q2' ? '#FFF7ED' : 'white',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: '#FB923C',
                        transform: 'translateY(-4px)',
                      },
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, fontSize: '0.95rem' }}>
                      {t('about.roadmap.q2.title')}
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        {t('about.roadmap.q2.metric1', { value: q2Values.clients })}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t('about.roadmap.q2.metric2', { value: q2Values.revenue })}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t('about.roadmap.q2.metric3', { value: q2Values.optimism })}
                      </Typography>
                    </Box>
                  </Paper>
                </Grow>
              </Grid>

              {/* Q3 */}
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Grow in timeout={900}>
                  <Paper
                    elevation={0}
                    onMouseEnter={() => handleRoadmapHover('q3')}
                    onMouseLeave={() => setRoadmapHovered(null)}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      border: '2px solid #E5E7EB',
                      backgroundColor: roadmapHovered === 'q3' ? '#EFF6FF' : 'white',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: '#60A5FA',
                        transform: 'translateY(-4px)',
                      },
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, fontSize: '0.95rem' }}>
                      {t('about.roadmap.q3.title')}
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        {t('about.roadmap.q3.metric1', { value: q3Values.clients })}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t('about.roadmap.q3.metric2', { value: q3Values.revenue.toFixed(1) })}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t('about.roadmap.q3.metric3', { value: q3Values.credibility })}
                      </Typography>
                    </Box>
                  </Paper>
                </Grow>
              </Grid>

              {/* Q4 */}
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Grow in timeout={1100}>
                  <Paper
                    elevation={0}
                    onMouseEnter={() => handleRoadmapHover('q4')}
                    onMouseLeave={() => setRoadmapHovered(null)}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      border: '2px solid #E5E7EB',
                      backgroundColor: roadmapHovered === 'q4' ? '#F0FDF4' : 'white',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: '#34D399',
                        transform: 'translateY(-4px)',
                      },
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, fontSize: '0.95rem' }}>
                      {t('about.roadmap.q4.title')}
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        {t('about.roadmap.q4.metric1', { value: q4Values.clients.toLocaleString() })}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t('about.roadmap.q4.metric2', { value: q4Values.valuation.toFixed(1) })}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t('about.roadmap.q4.metric3', { value: q4Values.reality })}
                      </Typography>
                    </Box>
                  </Paper>
                </Grow>
              </Grid>
            </Grid>

            <Typography variant="caption" sx={{ display: 'block', mt: 3, textAlign: 'center', fontStyle: 'italic', color: 'text.disabled' }}>
              {t('about.roadmap.note')}
            </Typography>
          </Box>
        </ScrollAnimation>

        {/* Company Stats */}
        <ScrollAnimation delay={0.4}>
          <Paper elevation={0} sx={{ p: { xs: 4, md: 5 }, borderRadius: 3, border: '1px solid #E5E7EB', backgroundColor: 'white' }}>
            <Typography variant="h5" align="center" sx={{ fontWeight: 700, mb: 1 }}>
              {t('about.stats.title')}
            </Typography>
            <Typography variant="caption" align="center" sx={{ display: 'block', mb: 4, color: 'text.disabled', fontStyle: 'italic' }}>
              {t('about.stats.disclaimer')}
            </Typography>

            <Grid container spacing={3}>
              <Grid size={{ xs: 6, md: 2 }}>
                <Tooltip title={t('about.stats.founded.alt')} arrow>
                  <Box
                    sx={{ textAlign: 'center', cursor: 'pointer', p: 2, borderRadius: 2, '&:hover': { backgroundColor: '#FAFBFC' }, transition: 'all 0.2s' }}
                    onMouseEnter={() => handleStatHover('founded')}
                    onMouseLeave={() => setHoveredStat(null)}
                  >
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#F97316', mb: 0.5 }}>
                      {hoveredStat === 'founded' ? '2025?' : t('about.stats.founded.value')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      {t('about.stats.founded')}
                    </Typography>
                  </Box>
                </Tooltip>
              </Grid>

              <Grid size={{ xs: 6, md: 2 }}>
                <Tooltip title={t('about.stats.team.alt')} arrow>
                  <Box
                    sx={{ textAlign: 'center', cursor: 'pointer', p: 2, borderRadius: 2, '&:hover': { backgroundColor: '#FAFBFC' }, transition: 'all 0.2s' }}
                    onMouseEnter={() => handleStatHover('team')}
                    onMouseLeave={() => setHoveredStat(null)}
                  >
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#3B82F6', mb: 0.5 }}>
                      {hoveredStat === 'team' ? '1+AI' : t('about.stats.team.value')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      {t('about.stats.team')}
                    </Typography>
                  </Box>
                </Tooltip>
              </Grid>

              <Grid size={{ xs: 6, md: 2 }}>
                <Tooltip title={t('about.stats.offices.alt')} arrow>
                  <Box
                    sx={{ textAlign: 'center', cursor: 'pointer', p: 2, borderRadius: 2, '&:hover': { backgroundColor: '#FAFBFC' }, transition: 'all 0.2s' }}
                    onMouseEnter={() => handleStatHover('offices')}
                    onMouseLeave={() => setHoveredStat(null)}
                  >
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#10B981', mb: 0.5 }}>
                      {hoveredStat === 'offices' ? '🏠' : t('about.stats.offices.value')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      {t('about.stats.offices')}
                    </Typography>
                  </Box>
                </Tooltip>
              </Grid>

              <Grid size={{ xs: 6, md: 2 }}>
                <Tooltip title={t('about.stats.revenue.alt')} arrow>
                  <Box
                    sx={{ textAlign: 'center', cursor: 'pointer', p: 2, borderRadius: 2, '&:hover': { backgroundColor: '#FAFBFC' }, transition: 'all 0.2s' }}
                    onMouseEnter={() => handleStatHover('revenue')}
                    onMouseLeave={() => setHoveredStat(null)}
                  >
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#8B5CF6', mb: 0.5 }}>
                      {t('about.stats.revenue.value', { value: randomRevenue })}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      {t('about.stats.revenue')}
                    </Typography>
                  </Box>
                </Tooltip>
              </Grid>

              <Grid size={{ xs: 6, md: 2 }}>
                <Tooltip title={t('about.stats.clients.alt')} arrow>
                  <Box
                    sx={{ textAlign: 'center', cursor: 'pointer', p: 2, borderRadius: 2, '&:hover': { backgroundColor: '#FAFBFC' }, transition: 'all 0.2s' }}
                    onMouseEnter={() => handleStatHover('clients')}
                    onMouseLeave={() => setHoveredStat(null)}
                  >
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#EC4899', mb: 0.5 }}>
                      {t('about.stats.clients.value', { value: randomClients })}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      {t('about.stats.clients')}
                    </Typography>
                  </Box>
                </Tooltip>
              </Grid>

              <Grid size={{ xs: 6, md: 2 }}>
                <Tooltip title={t('about.stats.satisfaction.alt')} arrow>
                  <Box
                    sx={{ textAlign: 'center', cursor: 'pointer', p: 2, borderRadius: 2, '&:hover': { backgroundColor: '#FAFBFC' }, transition: 'all 0.2s' }}
                    onMouseEnter={() => handleStatHover('satisfaction')}
                    onMouseLeave={() => setHoveredStat(null)}
                  >
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#F59E0B', mb: 0.5 }}>
                      {t('about.stats.satisfaction.value', { value: randomSatisfaction })}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      {t('about.stats.satisfaction')}
                    </Typography>
                  </Box>
                </Tooltip>
              </Grid>
            </Grid>
          </Paper>
        </ScrollAnimation>
      </Container>
    </Box>
  );
}
