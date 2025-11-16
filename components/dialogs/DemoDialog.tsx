'use client';
import { useState, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Paper,
  Chip,
  LinearProgress,
  Divider,
} from '@mui/material';
import {
  Close,
  TrendingDown,
  Warning,
  CheckCircle,
  Error,
  Timeline,
} from '@mui/icons-material';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';

interface DemoDialogProps {
  open: boolean;
  onClose: () => void;
}

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: '🤔 Stai Pensando di Non Comprare?' },
    position: { x: 250, y: 0 },
    style: {
      background: '#FF6B35',
      color: 'white',
      border: '3px solid #E8552E',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: 'bold',
      padding: '16px',
    },
  },
  {
    id: '2',
    data: { label: '⏳ Attendi 6-8 mesi per sviluppo interno' },
    position: { x: 100, y: 100 },
    style: {
      background: '#FFF7ED',
      border: '2px solid #FDBA74',
      borderRadius: '10px',
      padding: '12px',
    },
  },
  {
    id: '3',
    data: { label: '💸 Budget supera del 300%' },
    position: { x: 400, y: 100 },
    style: {
      background: '#FFF7ED',
      border: '2px solid #FDBA74',
      borderRadius: '10px',
      padding: '12px',
    },
  },
  {
    id: '4',
    data: { label: '🐛 Bug critici in produzione' },
    position: { x: 50, y: 220 },
    style: {
      background: '#FEE2E2',
      border: '2px solid #FCA5A5',
      borderRadius: '10px',
      padding: '12px',
    },
  },
  {
    id: '5',
    data: { label: '😰 Team stressato' },
    position: { x: 200, y: 220 },
    style: {
      background: '#FEE2E2',
      border: '2px solid #FCA5A5',
      borderRadius: '10px',
      padding: '12px',
    },
  },
  {
    id: '6',
    data: { label: '📉 Competitor ti sorpassa' },
    position: { x: 350, y: 220 },
    style: {
      background: '#FEE2E2',
      border: '2px solid #FCA5A5',
      borderRadius: '10px',
      padding: '12px',
    },
  },
  {
    id: '7',
    data: { label: '💰 Costi di manutenzione esplodono' },
    position: { x: 500, y: 220 },
    style: {
      background: '#FEE2E2',
      border: '2px solid #FCA5A5',
      borderRadius: '10px',
      padding: '12px',
    },
  },
  {
    id: '8',
    type: 'output',
    data: { label: '🆘 Chiamata Urgente a UAFT (+200% prezzo)' },
    position: { x: 200, y: 340 },
    style: {
      background: '#DC2626',
      color: 'white',
      border: '3px solid #991B1B',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: 'bold',
      padding: '16px',
    },
  },
  {
    id: '9',
    type: 'output',
    data: { label: '✅ OPPURE: Compra Ora e Risparmia Tutto Questo!' },
    position: { x: 180, y: 460 },
    style: {
      background: '#10B981',
      color: 'white',
      border: '3px solid #059669',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: 'bold',
      padding: '20px',
    },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#F97316', strokeWidth: 3 } },
  { id: 'e1-3', source: '1', target: '3', animated: true, style: { stroke: '#F97316', strokeWidth: 3 } },
  { id: 'e2-4', source: '2', target: '4', animated: true, style: { stroke: '#DC2626', strokeWidth: 2 } },
  { id: 'e2-5', source: '2', target: '5', animated: true, style: { stroke: '#DC2626', strokeWidth: 2 } },
  { id: 'e3-6', source: '3', target: '6', animated: true, style: { stroke: '#DC2626', strokeWidth: 2 } },
  { id: 'e3-7', source: '3', target: '7', animated: true, style: { stroke: '#DC2626', strokeWidth: 2 } },
  { id: 'e4-8', source: '4', target: '8', animated: true, style: { stroke: '#DC2626', strokeWidth: 2 } },
  { id: 'e5-8', source: '5', target: '8', animated: true, style: { stroke: '#DC2626', strokeWidth: 2 } },
  { id: 'e6-8', source: '6', target: '8', animated: true, style: { stroke: '#DC2626', strokeWidth: 2 } },
  { id: 'e7-8', source: '7', target: '8', animated: true, style: { stroke: '#DC2626', strokeWidth: 2 } },
  { id: 'e8-9', source: '8', target: '9', animated: true, style: { stroke: '#10B981', strokeWidth: 4 } },
];

const FUNNY_STATS = [
  { label: 'Probabilità di pentimento', value: 99.9, color: '#DC2626', icon: <TrendingDown /> },
  { label: 'Rischio "Te l\'avevo detto"', value: 100, color: '#F59E0B', icon: <Warning /> },
  { label: 'Chance di successo senza UAFT', value: 12, color: '#3B82F6', icon: <Timeline /> },
  { label: 'Livello FOMO attuale', value: 87, color: '#F97316', icon: <Error /> },
];

export default function DemoDialog({ open, onClose }: DemoDialogProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [analysisStep, setAnalysisStep] = useState(0);

  const handleOpen = useCallback(() => {
    // Animazione progressiva dell'analisi
    setAnalysisStep(0);
    const timer = setInterval(() => {
      setAnalysisStep((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  }, []);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      onTransitionEnter={handleOpen}
      PaperProps={{
        sx: {
          borderRadius: 4,
          minHeight: '80vh',
        },
      }}
    >
      <DialogTitle
        sx={{
          background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C5A 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 3,
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
            🚀 Analisi Predittiva UAFT™
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.95 }}>
            Sistema avanzato di valutazione del rimpianto futuro
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3, backgroundColor: '#FAFBFC' }}>
        {/* Barra di Progresso Analisi */}
        <Paper elevation={2} sx={{ p: 2, mb: 3, backgroundColor: 'white' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Analisi del tuo percorso senza UAFT in corso...
            </Typography>
            <Chip
              label={`${analysisStep}%`}
              size="small"
              color={analysisStep === 100 ? 'success' : 'warning'}
            />
          </Box>
          <LinearProgress
            variant="determinate"
            value={analysisStep}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: '#E5E7EB',
              '& .MuiLinearProgress-bar': {
                backgroundColor: analysisStep === 100 ? '#10B981' : '#F97316',
                borderRadius: 4,
              },
            }}
          />
        </Paper>

        {/* Statistiche Ironiche */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mb: 3 }}>
          {FUNNY_STATS.map((stat, index) => (
            <Paper
              key={index}
              elevation={3}
              sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                backgroundColor: 'white',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                },
              }}
            >
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: `${stat.color}20`,
                  color: stat.color,
                }}
              >
                {stat.icon}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  {stat.label}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: stat.color }}>
                  {stat.value}%
                </Typography>
              </Box>
            </Paper>
          ))}
        </Box>

        <Divider sx={{ my: 3 }}>
          <Chip label="Diagramma del Disastro Evitabile™" sx={{ fontWeight: 600 }} />
        </Divider>

        {/* Flowchart */}
        <Paper
          elevation={4}
          sx={{
            height: 600,
            backgroundColor: 'white',
            borderRadius: 3,
            overflow: 'hidden',
            border: '2px solid #E5E7EB',
          }}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            fitView
            attributionPosition="bottom-right"
          >
            <Background color="#F3F4F6" gap={16} />
            <Controls />
            <MiniMap
              nodeColor={(node) => {
                if (node.type === 'input') return '#FF6B35';
                if (node.type === 'output') return '#10B981';
                return '#FDBA74';
              }}
            />
          </ReactFlow>
        </Paper>

        {/* Messaggio Finale */}
        <Paper
          elevation={3}
          sx={{
            mt: 3,
            p: 3,
            backgroundColor: '#FFF7ED',
            border: '2px solid #FF6B35',
            borderRadius: 3,
          }}
        >
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'start' }}>
            <CheckCircle sx={{ color: '#10B981', fontSize: 32, flexShrink: 0 }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1A1D29', mb: 1 }}>
                💡 Insight Professionale
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                Secondo le nostre analisi predittive avanzate (e un pizzico di sano sarcasmo),
                il 94.7% dei clienti che vedono questo diagramma finiscono per acquistare i nostri servizi.
                Non per la paura, ma perché in realtà facciamo un ottimo lavoro.
                <strong> Il diagramma è solo un bonus divertente.</strong>
              </Typography>
              <Typography
                variant="body2"
                sx={{ mt: 2, fontStyle: 'italic', color: 'text.secondary', opacity: 0.8 }}
              >
                * Statistiche basate su simulazioni computerizzate altamente sofisticate (Excel con formule casuali)
              </Typography>
            </Box>
          </Box>
        </Paper>
      </DialogContent>

      <DialogActions sx={{ p: 3, backgroundColor: 'white', borderTop: '1px solid #E5E7EB' }}>
        <Button
          onClick={onClose}
          sx={{
            color: 'text.secondary',
            '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' },
          }}
        >
          Rischio comunque
        </Button>
        <Button
          variant="contained"
          size="large"
          sx={{
            backgroundColor: '#FF6B35',
            color: 'white',
            px: 4,
            fontWeight: 600,
            '&:hover': {
              backgroundColor: '#E8552E',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 24px rgba(255,107,53,0.4)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          Ok, Voglio la Demo (Scelta Saggia)
        </Button>
      </DialogActions>
    </Dialog>
  );
}
