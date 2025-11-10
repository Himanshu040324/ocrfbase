"use server";

/**
 * This file defines a Genkit flow that structures extracted entities
 * into a predefined JSON schema for FRA documents.
 */

import { ai } from "@/ai/genkit";
import { z } from "genkit";

// Input schema for extracted entities
const StructureDataToJsonInputSchema = z.object({
  pattaHolderName: z
    .string()
    .optional()
    .describe("The name of the patta holder."),
  villageName: z.string().optional().describe("The name of the village."),
  coordinates: z.string().optional().describe("The coordinates of the land."),
  claimStatus: z.string().optional().describe("The status of the claim."),
  otherInformation: z
    .string()
    .optional()
    .describe("Any other relevant information."),
});

// Output schema for structured JSON
const StructureDataToJsonOutputSchema = z.object({
  pattaHolderName: z
    .string()
    .nullable()
    .describe("The name of the patta holder."),
  villageName: z.string().nullable().describe("The name of the village."),
  coordinates: z.string().nullable().describe("The coordinates of the land."),
  claimStatus: z.string().nullable().describe("The status of the claim."),
  additionalNotes: z
    .string()
    .nullable()
    .describe("Additional notes or inferred information."),
});

// Main function
export async function structureDataToJson(input) {
  return structureDataToJsonFlow(input);
}

// Prompt definition
const structureDataToJsonPrompt = ai.definePrompt({
  name: "structureDataToJsonPrompt",
  input: { schema: StructureDataToJsonInputSchema },
  output: { schema: StructureDataToJsonOutputSchema },
  prompt: `You are an expert in structuring data extracted from Forest Rights Act (FRA) documents.

Based on the extracted entities provided, map the data into the following JSON schema.
Infer missing information or resolve conflicts.
If a field cannot be inferred, set it to null.

Extracted Entities:
Patta Holder Name: {{{pattaHolderName}}}
Village Name: {{{villageName}}}
Coordinates: {{{coordinates}}}
Claim Status: {{{claimStatus}}}
Other Information: {{{otherInformation}}}

JSON Schema:
{{json schema=StructureDataToJsonOutputSchema}}

Return the structured JSON data. Ensure all fields follow the schema.
`,
});

// Flow definition
const structureDataToJsonFlow = ai.defineFlow(
  {
    name: "structureDataToJsonFlow",
    inputSchema: StructureDataToJsonInputSchema,
    outputSchema: StructureDataToJsonOutputSchema,
  },
  async (input) => {
    const { output } = await structureDataToJsonPrompt(input);
    return output; // ✅ no TS non-null operator
  }
);
