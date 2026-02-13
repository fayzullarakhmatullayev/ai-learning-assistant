import path from 'path';
import { fileURLToPath } from 'url';

// ES6 module __dirname alternative
const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);
