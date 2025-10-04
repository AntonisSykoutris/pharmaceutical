/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

let pdfjsLib: typeof import('pdfjs-dist') | null = null;

async function loadPdfJs() {
  if (typeof window !== 'undefined' && !pdfjsLib) {
    try {
      pdfjsLib = await import('pdfjs-dist');

      // Set up the worker using the correct path
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

      console.log('PDF.js loaded successfully');
    } catch (error) {
      console.error('Failed to load PDF.js:', error);
      throw new Error('PDF.js library failed to load');
    }
  }
}

export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    await loadPdfJs();
    if (!pdfjsLib) throw new Error('PDF.js failed to load');

    console.log(`Processing PDF: ${file.name} (${file.size} bytes)`);
    const arrayBuffer = await file.arrayBuffer();

    // Parse PDF
    const pdf = await pdfjsLib.getDocument({
      data: arrayBuffer,
      useWorkerFetch: false,
      isEvalSupported: false,
      useSystemFonts: true,
      verbosity: 0,
    }).promise;

    console.log(`PDF loaded successfully. Pages: ${pdf.numPages}`);

    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .filter((item: any) => item.str && item.str.trim())
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }

    const extractedText = fullText.trim();
    console.log(`Extracted text length: ${extractedText.length} characters`);

    if (!extractedText) {
      throw new Error('No text content found in PDF');
    }

    return extractedText;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error(
      `Failed to extract text from PDF: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

export async function extractTextFromMultiplePDFs(files: File[]): Promise<string[]> {
  const results: string[] = [];

  for (const file of files) {
    try {
      const text = await extractTextFromPDF(file);
      results.push(text);
    } catch (error) {
      console.error(`Failed to extract text from ${file.name}:`, error);
      results.push(''); // keep array size consistent
    }
  }

  return results;
}
