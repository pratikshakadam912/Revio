import PDFParser from "pdf2json";
import type { PdfFragment, PdfPageLayout } from "./types";

type PdfJsonTextRun = {
  T?: string;
};

type PdfJsonText = {
  x?: number;
  y?: number;
  w?: number;
  R?: PdfJsonTextRun[];
};

type PdfJsonPage = {
  Width?: number;
  Height?: number;
  Texts?: PdfJsonText[];
};

type PdfJsonData = {
  Pages?: PdfJsonPage[];
};

function decodePdfText(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function cleanExtractedFragment(value: string): string {
  return value
    .replace(/\u00a0/g, " ")
    .replace(/\r/g, "")
    .replace(/\n/g, " ")
    .trim();
}

function extractRuns(item: PdfJsonText): string {
  if (!item.R?.length) {
    return "";
  }

  return item.R.map((run) => decodePdfText(run.T ?? "")).join("");
}

function convertPage(page: PdfJsonPage, pageNumber: number): PdfPageLayout {
  /*
   * pdf2json coordinates are normally expressed
   * using PDF units. We preserve the coordinates
   * instead of immediately flattening everything.
   */

  const fragments: PdfFragment[] = [];

  for (const item of page.Texts ?? []) {
    const text = cleanExtractedFragment(extractRuns(item));

    if (!text) {
      continue;
    }

    const x = typeof item.x === "number" ? item.x : 0;

    const y = typeof item.y === "number" ? item.y : 0;

    const width =
      typeof item.w === "number" ? item.w : Math.max(text.length * 4, 4);

    /*
     * pdf2json does not always provide a reliable
     * font height. Use a conservative estimate.
     */
    const height = 10;

    fragments.push({
      text,
      x,
      y,
      width,
      height,
      fontSize: height,
      page: pageNumber,
    });
  }

  return {
    page: pageNumber,
    width: typeof page.Width === "number" ? page.Width : 595,

    height: typeof page.Height === "number" ? page.Height : 842,

    fragments,
    lines: [],
    columns: [],
  };
}

export async function extractPdfLayout(
  buffer: Buffer,
): Promise<PdfPageLayout[]> {
  return new Promise((resolve, reject) => {
    const parser = new PDFParser();

    parser.on("pdfParser_dataError", (error: unknown) => {
      console.error("[Revio] PDF extraction error:", error);

      reject(error);
    });

    parser.on("pdfParser_dataReady", (data: PdfJsonData) => {
      try {
        const pages = (data.Pages ?? []).map((page, index) =>
          convertPage(page, index + 1),
        );

        console.log(`[Revio] Extracted ${pages.length} PDF page(s)`);

        pages.forEach((page) => {
          console.log(
            `[Revio] Page ${page.page}: ${page.fragments.length} text fragments`,
          );
        });

        resolve(pages);
      } catch (error) {
        reject(error);
      }
    });

    try {
      parser.parseBuffer(buffer);
    } catch (error) {
      reject(error);
    }
  });
}
