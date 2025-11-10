"use server";

import { extractTextFromDocument } from "@/ai/flows/extract-text-from-document";
import { preprocessExtractedText } from "@/ai/flows/preprocess-extracted-text";
import { recognizeNamedEntities } from "@/ai/flows/recognize-named-entities";
import { structureDataToJson } from "@/ai/flows/structure-data-to-json";

function findEntityValue(entities, ...keywords) {
  const entity = entities.find((e) =>
    keywords.some((keyword) => e.label.toLowerCase().includes(keyword))
  );
  return entity?.value;
}

export async function processDocument(dataUri) {
  try {
    if (!dataUri) {
      throw new Error("Document data URI is missing.");
    }

    // 1. OCR
    const ocrResult = await extractTextFromDocument({
      documentDataUri: dataUri,
    });
    if (!ocrResult?.extractedText) {
      throw new Error("OCR failed to extract text from the document.");
    }

    // 2. Preprocessing
    const preprocessResult = await preprocessExtractedText({
      extractedText: ocrResult.extractedText,
    });
    if (!preprocessResult?.preprocessedText) {
      throw new Error("Text preprocessing failed.");
    }

    // 3. NER
    const nerResult = await recognizeNamedEntities(
      preprocessResult.preprocessedText
    );
    if (!nerResult?.entities) {
      throw new Error("Named Entity Recognition failed to identify entities.");
    }

    // 4. JSON Structuring
    const { entities } = nerResult;

    const structureInput = {
      pattaHolderName: findEntityValue(entities, "patta holder", "name"),
      villageName: findEntityValue(entities, "village"),
      coordinates: findEntityValue(entities, "coordinates", "gps"),
      claimStatus: findEntityValue(entities, "claim status", "status"),
      otherInformation: findEntityValue(entities, "other"),
    };

    const structuredData = await structureDataToJson(structureInput);

    return { success: true, data: structuredData };
  } catch (error) {
    console.error("Document processing pipeline failed:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";
    return {
      success: false,
      error: `Failed to process document. ${errorMessage}`,
    };
  }
}
