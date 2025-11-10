"use server";

/**
 * Preprocesses extracted OCR text by cleaning and normalizing it.
 */

import { ai } from "@/ai/genkit";
import { z } from "genkit";

const PreprocessExtractedTextInputSchema = z.object({
  extractedText: z
    .string()
    .describe("The raw text extracted from the document via OCR."),
});

const PreprocessExtractedTextOutputSchema = z.object({
  preprocessedText: z
    .string()
    .describe("The cleaned and normalized text after preprocessing."),
});

export async function preprocessExtractedText(input) {
  return preprocessExtractedTextFlow(input);
}

const prompt = ai.definePrompt({
  name: "preprocessExtractedTextPrompt",
  input: { schema: PreprocessExtractedTextInputSchema },
  output: { schema: PreprocessExtractedTextOutputSchema },
  prompt: `You are a text preprocessing expert. Your task is to clean and normalize the given OCR output.

  Apply the following steps:
  1. Correct any OCR errors.
  2. Remove any noise or irrelevant characters.
  3. Standardize spacing and punctuation.

  Here is the raw OCR output:
  """{{{extractedText}}}"""

  Return the cleaned and normalized text.
  `,
});

const preprocessExtractedTextFlow = ai.defineFlow(
  {
    name: "preprocessExtractedTextFlow",
    inputSchema: PreprocessExtractedTextInputSchema,
    outputSchema: PreprocessExtractedTextOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output; // removed TypeScript's non-null assertion (!)
  }
);
