"use server";

import { z } from 'zod';
import { annotateImage } from '@/ai/flows/annotate-image';
import { calculateKpis } from '@/ai/flows/calculate-kpis';
import { generateReport } from '@/ai/flows/generate-report';
import type { Defect } from '@/lib/types';

// Mock defect detection since we don't have a real model
const mockDetectDefects = (
  imageWidth: number,
  imageHeight: number
): Defect[] => {
  const defectTypes = [
    'Pitting',
    'Scratches',
    'Inclusion',
    'Patches',
    'Crazing',
  ];
  const detections: Defect[] = [];
  const numDefects = Math.floor(Math.random() * 8) + 3; // 3 to 10 defects

  for (let i = 0; i < numDefects; i++) {
    const width = (Math.random() * 0.15 + 0.05) * imageWidth; // 5% to 20% of image width
    const height = (Math.random() * 0.15 + 0.05) * imageHeight; // 5% to 20% of image height
    const xMin = Math.random() * (imageWidth - width);
    const yMin = Math.random() * (imageHeight - height);

    detections.push({
      label: defectTypes[Math.floor(Math.random() * defectTypes.length)],
      confidence: Math.random() * 0.2 + 0.79, // 0.79 to 0.99
      xMin,
      yMin,
      xMax: xMin + width,
      yMax: yMin + height,
    });
  }
  return detections;
};

const formSchema = z.object({
  imageDataUrl: z.string().refine((s) => s.startsWith('data:image'), {
    message: 'Invalid image data URL',
  }),
  width: z.coerce.number().int().positive(),
  height: z.coerce.number().int().positive(),
});

export async function processImage(
  prevState: any,
  formData: FormData
) {
  try {
    const validatedFields = formSchema.safeParse({
      imageDataUrl: formData.get('imageDataUrl'),
      width: formData.get('width'),
      height: formData.get('height'),
    });

    if (!validatedFields.success) {
      return { result: null, error: 'Invalid form data.' };
    }

    const { imageDataUrl, width, height } = validatedFields.data;
    
    // Step 1: Mock defect detection
    const detections = mockDetectDefects(width, height);

    // Step 2: Call AI flows in parallel for efficiency
    const [kpiResult, annotationResult] = await Promise.all([
      calculateKpis({
        defectDetections: detections,
        imageWidth: width,
        imageHeight: height,
      }),
      annotateImage({
        photoDataUri: imageDataUrl,
        detections: JSON.stringify(detections),
      }),
    ]);

    // Step 3: Use results to generate the final report
    const observations =
      'Automated analysis of the provided steel sheet image reveals several surface anomalies. The distribution and type of defects suggest a potential issue in the rolling or cooling process. High-confidence detections of scratches and pitting warrant immediate investigation to prevent further quality degradation.';
      
    const reportResult = await generateReport({
      defectData: kpiResult,
      observations,
      imageUrl: 'N/A - image provided in context',
    });
    
    return {
      result: {
        kpis: kpiResult,
        annotatedImage: annotationResult.annotatedImage,
        report: reportResult.report,
        detections: detections,
      },
      error: null
    };

  } catch (error) {
    console.error('Error processing image:', error);
    return {
      result: null,
      error: 'An unexpected error occurred during analysis. Please try again.',
    };
  }
}
