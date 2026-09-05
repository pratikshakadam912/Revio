import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import type { PdfFragment, PdfPageLayout } from "./types";

type PdfTextItem = {
  str: string;
  transform: number[];
  width: number;
  height: number;
  fontName?: string;
};

function getFontSize(item: PdfTextItem): number {
  const transform = item.transform;

  if (!transform || transform.length < 6) {
    return item.height || 10;
  }

  const a = Math.abs(transform[0] ?? 0);
  const b = Math.abs(transform[1] ?? 0);

  const size = Math.sqrt(a * a + b * b);

  return size || item.height || 10;
}

function getPosition(item: PdfTextItem, pageHeight: number) {
  const transform = item.transform;

  const x = transform[4] ?? 0;
  const pdfY = transform[5] ?? 0;

  const fontSize = getFontSize(item);

  /*
   * PDF coordinates start from bottom-left.
   * We convert them to top-left coordinates.
   */
  const y = pageHeight - pdfY - fontSize;

  return {
    x,
    y,
  };
}

export async function extractPdfLayout(
  buffer: Buffer,
): Promise<PdfPageLayout[]> {
  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(buffer),
    disableWorker: true,
    useSystemFonts: true,
  });

  const pdf = await loadingTask.promise;

  const pages: PdfPageLayout[] = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
    const page = await pdf.getPage(pageNumber);

    const viewport = page.getViewport({
      scale: 1,
    });

    const content = await page.getTextContent();

    const fragments: PdfFragment[] = [];

    for (const rawItem of content.items) {
      const item = rawItem as unknown as PdfTextItem;

      if (!item.str || !item.str.trim()) {
        continue;
      }

      const { x, y } = getPosition(item, viewport.height);

      fragments.push({
        text: item.str,
        x,
        y,
        width: item.width || 0,
        height: item.height || getFontSize(item),
        fontSize: getFontSize(item),
        fontName: item.fontName,
        page: pageNumber,
      });
    }

    pages.push({
      page: pageNumber,
      width: viewport.width,
      height: viewport.height,
      fragments,
      lines: [],
      columns: [],
    });
  }

  return pages;
}
