'use server';

/**
 * @fileOverview Generates a professional report summarizing steel sheet defect detection findings.
 *
 * - generateReport - A function that generates a defect detection report.
 * - GenerateReportInput - The input type for the generateReport function.
 * - GenerateReportOutput - The return type for the generateReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateReportInputSchema = z.object({
  defectData: z.object({
    totalDefects: z.number().describe('The total number of defects detected.'),
    defectDensity: z.number().describe('The defect density per unit area.'),
    mostCommonDefectType: z.string().describe('The most common type of defect.'),
    severityScore: z.number().describe('The overall severity score of the defects.'),
  }).describe('KPI data related to defect detection.'),
  observations: z.string().describe('Key observations from the defect detection analysis.'),
  imageUrl: z.string().describe('URL or data URI of the image analyzed for defects.')
});
export type GenerateReportInput = z.infer<typeof GenerateReportInputSchema>;

const GenerateReportOutputSchema = z.object({
  report: z.string().describe('The generated professional report.'),
});
export type GenerateReportOutput = z.infer<typeof GenerateReportOutputSchema>;

export async function generateReport(input: GenerateReportInput): Promise<GenerateReportOutput> {
  return generateReportFlow(input);
}

const generateReportPrompt = ai.definePrompt({
  name: 'generateReportPrompt',
  input: {schema: GenerateReportInputSchema},
  output: {schema: GenerateReportOutputSchema},
  prompt: `You are an expert in steel manufacturing quality control. Given the following defect detection data and observations, generate a professional report suitable for plant managers.

  Image URL: {{{imageUrl}}}

  ## Defect Data:
  - Total Defects: {{{defectData.totalDefects}}}
  - Defect Density: {{{defectData.defectDensity}}}
  - Most Common Defect Type: {{{defectData.mostCommonDefectType}}}
  - Severity Score: {{{defectData.severityScore}}}

  ## Observations:
  {{{observations}}}

  Structure the report as follows:

  1.  **Executive Summary:** A brief overview of the defect analysis.
  2.  **KPI Highlights:** Key performance indicators and their implications.
  3.  **Recommendations:** Actionable steps for addressing the identified defects.

  Use formal language and a professional tone.
  `,
});

const generateReportFlow = ai.defineFlow(
  {
    name: 'generateReportFlow',
    inputSchema: GenerateReportInputSchema,
    outputSchema: GenerateReportOutputSchema,
  },
  async input => {
    const {output} = await generateReportPrompt(input);
    return output!;
  }
);
