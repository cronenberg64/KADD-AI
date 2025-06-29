import { config } from 'dotenv';
config();

import '@/ai/flows/generate-report.ts';
import '@/ai/flows/annotate-image.ts';
import '@/ai/flows/calculate-kpis.ts';