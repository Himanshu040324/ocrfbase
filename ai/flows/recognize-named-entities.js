'use server';

/**
 * This file defines a Genkit flow for recognizing named entities in FRA documents.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const RecognizeNamedEntitiesInputSchema = z
  .string()
  .describe('The preprocessed text from the FRA document.');

const RecognizeNamedEntitiesOutputSchema = z.object({
  entities: z
    .array(
      z.object({
        label: z
          .string()
          .describe('The type of entity (e.g., patta holder name, village name).'),
        value: z.string().describe('The extracted entity value.'),
      })
    )
    .describe('The extracted named entities from the document.'),
});

export async function recognizeNamedEntities(input) {
  return recognizeNamedEntitiesFlow(input);
}

const recognizeNamedEntitiesPrompt = ai.definePrompt({
  name: 'recognizeNamedEntitiesPrompt',
  input: { schema: RecognizeNamedEntitiesInputSchema },
  output: { schema: RecognizeNamedEntitiesOutputSchema },
  prompt: `You are an expert Named Entity Recognition (NER) system for Forest Rights Act (FRA) documents.
  Your task is to identify and extract key entities from the given text and label them appropriately.
  The entities you should extract include: patta holder names, village names, coordinates, claim statuses.
  Return the extracted entities in JSON format.

  Text: {{{$input}}}
  `,
});

const recognizeNamedEntitiesFlow = ai.defineFlow(
  {
    name: 'recognizeNamedEntitiesFlow',
    inputSchema: RecognizeNamedEntitiesInputSchema,
    outputSchema: RecognizeNamedEntitiesOutputSchema,
  },
  async (input) => {
    const { output } = await recognizeNamedEntitiesPrompt(input);
    return output; // removed TS non-null operator
  }
);
