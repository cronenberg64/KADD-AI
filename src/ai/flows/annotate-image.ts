'use server';

/**
 * @fileOverview Annotates a steel sheet image with bounding boxes and defect labels.
 *
 * - annotateImage - A function that accepts an image and returns an annotated image.
 * - AnnotateImageInput - The input type for the annotateImage function.
 * - AnnotateImageOutput - The return type for the annotateImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnnotateImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a steel sheet, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  detections: z.string().describe('JSON string containing defect detections with bounding boxes, labels, and confidence scores.'),
});
export type AnnotateImageInput = z.infer<typeof AnnotateImageInputSchema>;

const AnnotateImageOutputSchema = z.object({
  annotatedImage: z.string().describe('The annotated image with bounding boxes and defect labels, as a data URI.'),
});
export type AnnotateImageOutput = z.infer<typeof AnnotateImageOutputSchema>;

export async function annotateImage(input: AnnotateImageInput): Promise<AnnotateImageOutput> {
  return annotateImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'annotateImagePrompt',
  input: {schema: AnnotateImageInputSchema},
  output: {schema: AnnotateImageOutputSchema},
  prompt: `You are an expert image annotator for a steel factory.

You are provided a steel sheet image and a set of defect detections, including bounding boxes, labels, and confidence scores.

Your task is to generate an annotated image that visually highlights these defects using bounding boxes and labels.

Input Image: {{media url=photoDataUri}}

Defect Detections (JSON format): {{{detections}}}

Output:
Create the annotated image showing the defect detections. Return the entire image as a data URI.
`, config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const annotateImageFlow = ai.defineFlow(
  {
    name: 'annotateImageFlow',
    inputSchema: AnnotateImageInputSchema,
    outputSchema: AnnotateImageOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',

      prompt: [
        {media: {url: input.photoDataUri}},
        {
          text: `Here are the bounding box detections: ${input.detections}.  Draw bounding boxes around the defects in the image.`,
        },
      ],

      config: {
        responseModalities: ['TEXT', 'IMAGE'], // MUST provide both TEXT and IMAGE, IMAGE only won't work
      },
    });

    return {annotatedImage: media.url!};
  }
);
