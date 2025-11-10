'use server';

/**
 * Extracts text from a document using OCR.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ExtractTextFromDocumentInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "The scanned FRA document as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});

const ExtractTextFromDocumentOutputSchema = z.object({
  extractedText: z.string().describe('The extracted text from the document.'),
});

export async function extractTextFromDocument(input) {
  return extractTextFromDocumentFlow(input);
}

const extractTextFromDocumentPrompt = ai.definePrompt({
  name: 'extractTextFromDocumentPrompt',
  input: { schema: ExtractTextFromDocumentInputSchema },
  output: { schema: ExtractTextFromDocumentOutputSchema },
  prompt: `Extract the text from the following document: {{media url=documentDataUri}}`,
});

const extractTextFromDocumentFlow = ai.defineFlow(
  {
    name: 'extractTextFromDocumentFlow',
    inputSchema: ExtractTextFromDocumentInputSchema,
    outputSchema: ExtractTextFromDocumentOutputSchema,
  },
  async (input) => {
    const { output } = await extractTextFromDocumentPrompt(input);
    return output; // removed the TS non-null (!) operator
  }
);
