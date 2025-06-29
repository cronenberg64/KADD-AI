// src/ai/flows/calculate-kpis.ts
'use server';

/**
 * @fileOverview Calculates key performance indicators (KPIs) from defect detection results.
 *
 * - calculateKpis - A function that calculates KPIs based on defect detection results.
 * - CalculateKpisInput - The input type for the calculateKpis function.
 * - CalculateKpisOutput - The return type for the calculateKpis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CalculateKpisInputSchema = z.object({
  defectDetections: z.array(
    z.object({
      label: z.string().describe('The label of the defect.'),
      confidence: z.number().describe('The confidence score of the defect detection.'),
      xMin: z.number().describe('The minimum x coordinate of the bounding box.'),
      yMin: z.number().describe('The minimum y coordinate of the bounding box.'),
      xMax: z.number().describe('The maximum x coordinate of the bounding box.'),
      yMax: z.number().describe('The maximum y coordinate of the bounding box.'),
    })
  ).describe('The list of defect detections.'),
  imageWidth: z.number().describe('The width of the image in pixels.'),
  imageHeight: z.number().describe('The height of the image in pixels.'),
});

export type CalculateKpisInput = z.infer<typeof CalculateKpisInputSchema>;

const CalculateKpisOutputSchema = z.object({
  totalDefects: z.number().describe('The total number of defects detected.'),
  defectDensity: z.number().describe('The defect density per area (defects per pixel).'),
  mostCommonDefectType: z.string().describe('The most common type of defect.'),
  severityScore: z.number().describe('A severity score based on bounding box size and confidence.'),
});

export type CalculateKpisOutput = z.infer<typeof CalculateKpisOutputSchema>;

export async function calculateKpis(input: CalculateKpisInput): Promise<CalculateKpisOutput> {
  return calculateKpisFlow(input);
}

const calculateKpisFlow = ai.defineFlow(
  {
    name: 'calculateKpisFlow',
    inputSchema: CalculateKpisInputSchema,
    outputSchema: CalculateKpisOutputSchema,
  },
  async input => {
    const {defectDetections, imageWidth, imageHeight} = input;

    const totalDefects = defectDetections.length;
    const imageArea = imageWidth * imageHeight;
    const defectDensity = totalDefects / imageArea;

    // Calculate most common defect type
    const defectTypeCounts: {[key: string]: number} = {};
    defectDetections.forEach(detection => {
      const label = detection.label;
      defectTypeCounts[label] = (defectTypeCounts[label] || 0) + 1;
    });

    let mostCommonDefectType = '';
    let maxCount = 0;
    for (const label in defectTypeCounts) {
      if (defectTypeCounts[label] > maxCount) {
        mostCommonDefectType = label;
        maxCount = defectTypeCounts[label];
      }
    }

    // Calculate severity score (example: average confidence * average bounding box area)
    let totalConfidence = 0;
    let totalArea = 0;
    defectDetections.forEach(detection => {
      totalConfidence += detection.confidence;
      totalArea += (detection.xMax - detection.xMin) * (detection.yMax - detection.yMin);
    });

    const averageConfidence = totalConfidence / totalDefects || 0; // Avoid NaN if no defects
    const averageArea = totalArea / totalDefects || 0; // Avoid NaN if no defects
    const severityScore = averageConfidence * averageArea;

    return {
      totalDefects,
      defectDensity,
      mostCommonDefectType,
      severityScore,
    };
  }
);
