import type { ReportHistoryItem } from './types';

export const reportHistory: ReportHistoryItem[] = [
  {
    id: 'rep-001',
    date: '2024-07-21',
    severity: 8.5,
    title: 'Coil #A5-341 Analysis',
    totalDefects: 15,
  },
  {
    id: 'rep-002',
    date: '2024-07-20',
    severity: 4.2,
    title: 'Sample #C4-098 Inspection',
    totalDefects: 6,
  },
  {
    id: 'rep-003',
    date: '2024-07-20',
    severity: 6.1,
    title: 'Batch #B2-211 QA Check',
    totalDefects: 9,
  },
  {
    id: 'rep-004',
    date: '2024-07-19',
    severity: 2.3,
    title: 'Coil #A5-340 Post-Process',
    totalDefects: 4,
  },
  {
    id: 'rep-005',
    date: '2024-07-18',
    severity: 9.7,
    title: 'Emergency Sample #X1-001',
    totalDefects: 22,
  },
];
