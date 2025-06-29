import type { CalculateKpisOutput } from '@/ai/flows/calculate-kpis';

export type KpiData = CalculateKpisOutput;

export type Defect = {
  label: string;
  confidence: number;
  xMin: number;
  yMin: number;
  xMax: number;
  yMax: number;
};

export type ReportHistoryItem = {
  id: string;
  date: string;
  severity: number;
  title: string;
  totalDefects: number;
};

export type AnalysisResult = {
  kpis: KpiData;
  annotatedImage: string;
  report: string;
  detections: Defect[];
};
