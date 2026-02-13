import fs from 'fs/promises';
import { PDFParse } from 'pdf-parse';

/**
 * @desc Extracts text from a PDF file and returns it as a string
 * @param {string} filePath - The path to the PDF file
 * @returns {Promise<{text: string, numPages: number, info: object}>}
 * @throws {Error} - If there is an error parsing the PDF file
 */

export const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const parser = new PDFParse(new Uint8Array(dataBuffer));
    const data = await parser.getText();

    return { text: data.text, numPages: data.numpages, info: data.info };
  } catch (err) {
    console.error(`Error parsing PDF file: ${err.message}`);
    throw new Error(`Error parsing PDF file: ${err.message}`);
  }
};
