import type { PdfColumn, PdfLine, PdfPageLayout } from "./types";

function horizontalOverlap(a: PdfLine, b: PdfLine): number {
  const aLeft = a.x;
  const aRight = a.x + a.width;

  const bLeft = b.x;
  const bRight = b.x + b.width;

  const overlap = Math.min(aRight, bRight) - Math.max(aLeft, bLeft);

  return Math.max(0, overlap);
}

function gapBetween(a: PdfLine, b: PdfLine): number {
  const aRight = a.x + a.width;

  return Math.max(0, b.x - aRight);
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

  const sorted = [...lines].sort((a, b) => a.x - b.x);

  const columns: PdfLine[][] = [];

  for (const line of sorted) {
    let bestColumn: PdfLine[] | undefined;

    let bestScore = Infinity;

    for (const column of columns) {
      const representative = column[0];

      const distance = Math.abs(line.x - representative.x);

      const overlap = horizontalOverlap(line, representative);

      const score = distance - overlap * 0.5;

      if (distance < 45 && score < bestScore) {
        bestScore = score;
        bestColumn = column;
      }
    }

    if (bestColumn) {
      bestColumn.push(line);
    } else {
      columns.push([line]);
    }
  }

  const result: PdfColumn[] = columns
    .map((column) => {
      const left = Math.min(...column.map((line) => line.x));

      const right = Math.max(...column.map((line) => line.x + line.width));

      return {
        x: left,
        width: right - left,
        lines: column.sort((a, b) => a.y - b.y),
      };
    })
    .filter((column) => column.lines.length >= 2)
    .sort((a, b) => a.x - b.x);

  /*
   * If column detection created too many
   * tiny groups, fall back to one reading flow.
   */
  if (result.length > 3 || result.every((column) => column.lines.length < 3)) {
    return [
      {
        x: 0,
        width: pageWidth,
        lines: [...lines].sort((a, b) => a.y - b.y),
      },
    ];
  }

  return result;
}

function looksLikeTwoColumnPage(
  columns: PdfColumn[],
  pageWidth: number,
): boolean {
  if (columns.length !== 2) {
    return false;
  }

  const [left, right] = columns;

  const gap = right.x - (left.x + left.width);

  const ratio = (left.width + right.width + gap) / pageWidth;

  return gap > 15 && ratio > 0.65;
}

export function buildReadingOrder(page: PdfPageLayout): PdfPageLayout {
  const columns = detectColumns(page.lines, page.width);

  if (looksLikeTwoColumnPage(columns, page.width)) {
    /*
     * For genuine two-column resumes,
     * read the dominant/main column first,
     * then the side column.
     *
     * The semantic parser will still identify
     * sections independently.
     */
    const ordered = [...columns[0].lines, ...columns[1].lines];

    return {
      ...page,
      columns,
      lines: ordered,
    };
  }

  return {
    ...page,
    columns,
    lines: [...page.lines].sort((a, b) => a.y - b.y),
  };
}

export function flattenPages(pages: PdfPageLayout[]): PdfLine[] {
  return pages.flatMap((page) => page.lines);
}
