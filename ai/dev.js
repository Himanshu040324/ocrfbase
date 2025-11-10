import { config } from 'dotenv';
config();

import '@/ai/flows/recognize-named-entities';
import '@/ai/flows/extract-text-from-document';
import '@/ai/flows/preprocess-extracted-text';
import '@/ai/flows/structure-data-to-json';
