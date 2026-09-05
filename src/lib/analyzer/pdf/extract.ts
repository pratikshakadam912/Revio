import PDFParser from "pdf2json";

import type { PdfFragment, PdfLine, PdfColumn, PdfPageLayout } from "./types";

type PdfJsonTextRun = {
  T?: string;
  TS?: Array<number | string>;
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

type MutableFragment = PdfFragment & {
  centerX: number;
  centerY: number;
};

const DEFAULT_PAGE_WIDTH = 595;
const DEFAULT_PAGE_HEIGHT = 842;

const Y_TOLERANCE = 2.5;

function decodePdfText(value: string): string {
  if (!value) {
    return "";
  }

  let decoded = value;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const next = decodeURIComponent(decoded);

      if (next === decoded) {
        break;
      }

      decoded = next;
    } catch {
      break;
    }
  }

  return decoded;
}

function cleanText(value: string): string {
  return value
    .replace(/\u00a0/g, " ")
    .replace(/\u200b/g, "")
    .replace(/\u200c/g, "")
    .replace(/\u200d/g, "")
    .replace(/\ufeff/g, "")
    .replace(/\r/g, " ")
    .replace(/\n/g, " ")
    .replace(/[ \t]+/g, " ")
    .trim();
}

function getRunFontSize(run: PdfJsonTextRun): number {
  if (!Array.isArray(run.TS)) {
    return 10;
  }

  const values = run.TS.map((value) => {
    if (typeof value === "number") {
      return value;
    }

    const parsed = Number(value);

    return Number.isFinite(parsed) ? parsed : 0;
  }).filter((value) => value > 0);

  if (values.length === 0) {
    return 10;
  }

  const possibleSize = values[values.length - 1];

  return possibleSize > 0 && possibleSize < 100 ? possibleSize : 10;
}

function extractRuns(item: PdfJsonText): {
  text: string;
  fontSize: number;
} {
  if (!item.R?.length) {
    return {
      text: "",
      fontSize: 10,
    };
  }

  const texts: string[] = [];
  const fontSizes: number[] = [];

  for (const run of item.R) {
    const text = cleanText(decodePdfText(run.T ?? ""));

    if (text) {
      texts.push(text);
    }

    const fontSize = getRunFontSize(run);

    if (fontSize > 0) {
      fontSizes.push(fontSize);
    }
  }

  const fontSize =
    fontSizes.length > 0
      ? fontSizes.reduce((sum, value) => sum + value, 0) / fontSizes.length
      : 10;

  return {
    text: texts.join(""),
    fontSize,
  };
}

function estimateHeight(fontSize: number): number {
  if (!Number.isFinite(fontSize) || fontSize <= 0) {
    return 10;
  }

  return Math.max(6, Math.min(fontSize * 1.35, 32));
}

function createFragment(
  item: PdfJsonText,
  pageNumber: number,
): MutableFragment | null {
  const extracted = extractRuns(item);

  if (!extracted.text) {
    return null;
  }

  const x = typeof item.x === "number" && Number.isFinite(item.x) ? item.x : 0;

  const y = typeof item.y === "number" && Number.isFinite(item.y) ? item.y : 0;

  const width =
    typeof item.w === "number" && Number.isFinite(item.w) && item.w > 0
      ? item.w
      : Math.max(extracted.text.length * extracted.fontSize * 0.5, 4);

  const height = estimateHeight(extracted.fontSize);

  return {
    text: extracted.text,
    x,
    y,
    width,
    height,
    fontSize: extracted.fontSize,
    page: pageNumber,
    centerX: x + width / 2,
    centerY: y + height / 2,
  };
}

function sameVisualLine(
  first: MutableFragment,
  second: MutableFragment,
): boolean {
  const tolerance = Math.max(
    Y_TOLERANCE,
    Math.min(first.height, second.height) * 0.45,
  );

  return Math.abs(first.centerY - second.centerY) <= tolerance;
}

function buildLines(fragments: MutableFragment[]): PdfLine[] {
  const sorted = [...fragments].sort((a, b) => {
    if (Math.abs(a.centerY - b.centerY) > Y_TOLERANCE) {
      return a.centerY - b.centerY;
    }

    return a.x - b.x;
  });

  const lines: PdfLine[] = [];

  for (const fragment of sorted) {
    let line: PdfLine | undefined;

    for (const candidate of lines) {
      const reference = candidate.fragments[0];

      if (!reference) {
        continue;
      }

      const referenceFragment = reference as MutableFragment;

      if (sameVisualLine(referenceFragment, fragment)) {
        line = candidate;
        break;
      }
    }

    if (!line) {
      line = {
        y: fragment.y,
        text: "",
        x: fragment.x,
        width: fragment.width,
        height: fragment.height,
        page: fragment.page,
        fragments: [],
      };

      lines.push(line);
    }

    line.fragments.push(fragment);

    line.fragments.sort((a, b) => a.x - b.x);

    line.y =
      line.fragments.reduce((sum, current) => sum + current.y, 0) /
      line.fragments.length;

    line.x = Math.min(...line.fragments.map((current) => current.x));

    const right = Math.max(
      ...line.fragments.map((current) => current.x + current.width),
    );

    const bottom = Math.max(
      ...line.fragments.map((current) => current.y + current.height),
    );

    const top = Math.min(...line.fragments.map((current) => current.y));

    line.width = right - line.x;
    line.height = bottom - top;

    line.text = joinFragments(line.fragments as MutableFragment[]);
  }

  return lines.sort((a, b) => {
    if (Math.abs(a.y - b.y) < 4) {
      return a.x - b.x;
    }

    return a.y - b.y;
  });
}

function joinFragments(fragments: MutableFragment[]): string {
  if (fragments.length === 0) {
    return "";
  }

  let result = fragments[0].text;

  for (let index = 1; index < fragments.length; index += 1) {
    const previous = fragments[index - 1];

    const current = fragments[index];

    const previousRight = previous.x + previous.width;

    const gap = current.x - previousRight;

    const averageFontSize = (previous.fontSize + current.fontSize) / 2;

    const expectedCharacterWidth = Math.max(averageFontSize * 0.28, 2);

    const needsSpace =
      gap > expectedCharacterWidth &&
      !/^[,.;:!?%)\]}]/.test(current.text) &&
      !/[([{/$-]$/.test(previous.text);

    if (needsSpace) {
      result += " ";
    }

    result += current.text;
  }

  return result.replace(/[ \t]+/g, " ").trim();
}

function detectColumns(lines: PdfLine[], pageWidth: number): PdfColumn[] {
  if (lines.length < 4) {
    return [
      {
        x: 0,
        width: pageWidth,
        lines,
      },
    ];
  }

  const candidates: number[] = [];

  for (let x = pageWidth * 0.3; x <= pageWidth * 0.7; x += 5) {
    let crossing = 0;
    let leftCount = 0;
    let rightCount = 0;

    for (const line of lines) {
      const left = line.x;
      const right = line.x + line.width;

      if (right <= x) {
        leftCount += 1;
      } else if (left >= x) {
        rightCount += 1;
      } else {
        crossing += 1;
      }
    }

    if (leftCount >= 3 && rightCount >= 3 && crossing <= lines.length * 0.25) {
      candidates.push(x);
    }
  }

  if (candidates.length === 0) {
    return [
      {
        x: 0,
        width: pageWidth,
        lines,
      },
    ];
  }

  const splitX = candidates[Math.floor(candidates.length / 2)];

  const left = lines.filter((line) => line.x + line.width <= splitX + 5);

  const right = lines.filter((line) => line.x >= splitX - 5);

  if (
    left.length < 3 ||
    right.length < 3 ||
    left.length + right.length < lines.length * 0.65
  ) {
    return [
      {
        x: 0,
        width: pageWidth,
        lines,
      },
    ];
  }

  return [
    {
      x: 0,
      width: splitX,
      lines: [...left].sort((a, b) => a.y - b.y),
    },
    {
      x: splitX,
      width: pageWidth - splitX,
      lines: [...right].sort((a, b) => a.y - b.y),
    },
  ];
}

function convertPage(page: PdfJsonPage, pageNumber: number): PdfPageLayout {
  const fragments = (page.Texts ?? [])
    .map((item) => createFragment(item, pageNumber))
    .filter((fragment): fragment is MutableFragment => fragment !== null);

  const lines = buildLines(fragments);

  const columns = detectColumns(lines, page.Width ?? DEFAULT_PAGE_WIDTH);

  const cleanFragments: PdfFragment[] = fragments.map(
    ({ centerX, centerY, ...fragment }) => fragment,
  );

  return {
    page: pageNumber,
    width: page.Width ?? DEFAULT_PAGE_WIDTH,
    height: page.Height ?? DEFAULT_PAGE_HEIGHT,
    fragments: cleanFragments,
    lines,
    columns,
  };
}

export async function extractPdfLayout(
  buffer: Buffer,
): Promise<PdfPageLayout[]> {
  if (!buffer || buffer.length === 0) {
    throw new Error("PDF buffer is empty.");
  }

  if (buffer.subarray(0, 5).toString("ascii") !== "%PDF-") {
    throw new Error("Invalid PDF file.");
  }

  return new Promise((resolve, reject) => {
    const parser = new PDFParser();

    let settled = false;

    const finishReject = (error: unknown) => {
      if (settled) {
        return;
      }

      settled = true;

      reject(error instanceof Error ? error : new Error(String(error)));
    };

    const finishResolve = (pages: PdfPageLayout[]) => {
      if (settled) {
        return;
      }

      settled = true;
      resolve(pages);
    };

    parser.on("pdfParser_dataError", (error: unknown) => {
      console.error("[Revio] PDF extraction failed.");

      finishReject(error);
    });

    parser.on("pdfParser_dataReady", (data: unknown) => {
      try {
        const pdfData = data as PdfJsonData;

        const pages = (pdfData.Pages ?? []).map((page, index) =>
          convertPage(page, index + 1),
        );

        if (pages.length === 0) {
          throw new Error("The PDF contains no readable pages.");
        }

        const fragmentCount = pages.reduce(
          (total, page) => total + page.fragments.length,
          0,
        );

        const lineCount = pages.reduce(
          (total, page) => total + page.lines.length,
          0,
        );

        console.log(
          `[Revio] PDF: ${pages.length} page(s), ${fragmentCount} fragments, ${lineCount} reconstructed lines.`,
        );

        finishResolve(pages);
      } catch (error) {
        finishReject(error);
      }
    });

    try {
      parser.parseBuffer(buffer);
    } catch (error) {
      finishReject(error);
    }
  });
}

export function layoutToText(pages: PdfPageLayout[]): string {
  const output: string[] = [];

  for (const page of pages) {
    output.push(`--- PAGE ${page.page} ---`);

    if (page.columns.length > 1) {
      for (const column of page.columns) {
        for (const line of column.lines) {
          const text = line.text.trim();

          if (text) {
            output.push(text);
          }
        }

        output.push("");
      }
    } else {
      for (const line of page.lines) {
        const text = line.text.trim();

        if (text) {
          output.push(text);
        }
      }
    }

    output.push("");
  }

  return output
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
