import type { PdfFragment, PdfLine } from "./types";

function verticalDistance(a: PdfFragment, b: PdfFragment): number {
  const centerA = a.y + a.height / 2;
  const centerB = b.y + b.height / 2;

  return Math.abs(centerA - centerB);
}

function sameVisualLine(a: PdfFragment, b: PdfFragment): boolean {
  const height = Math.max(a.height, b.height, 8);

  return verticalDistance(a, b) <= height * 0.55;
}

function averageCharacterWidth(fragment: PdfFragment): number {
  const length = fragment.text.length;

  if (!length) return 5;

  return Math.max(2.5, Math.min(14, fragment.width / length));
}

function shouldAddSpace(previous: PdfFragment, current: PdfFragment): boolean {
  const previousEnd = previous.x + previous.width;

  const gap = current.x - previousEnd;

  if (gap <= 0.5) {
    return false;
  }

  const charWidth = Math.max(
    averageCharacterWidth(previous),
    averageCharacterWidth(current),
  );

  /*
   * Small gaps inside words are usually PDF
   * positioning artifacts.
   *
   * Larger gaps usually represent actual spaces.
   */
  if (gap < charWidth * 0.28) {
    return false;
  }

  return true;
}

function reconstructText(fragments: PdfFragment[]): string {
  if (!fragments.length) {
    return "";
  }

  const sorted = [...fragments].sort((a, b) => a.x - b.x);

  let result = sorted[0].text;

  for (let i = 1; i < sorted.length; i++) {
    const previous = sorted[i - 1];
    const current = sorted[i];

    if (shouldAddSpace(previous, current)) {
      result += " ";
    }

    result += current.text;
  }

  return result.replace(/[ \t]+/g, " ").trim();
}

export function buildVisualLines(fragments: PdfFragment[]): PdfLine[] {
  const sorted = [...fragments].sort((a, b) => {
    if (Math.abs(a.y - b.y) < 4) {
      return a.x - b.x;
    }

    return a.y - b.y;
  });

  const groups: PdfFragment[][] = [];

  for (const fragment of sorted) {
    let target: PdfFragment[] | undefined;

    for (const group of groups) {
      const reference = group[0];

      if (sameVisualLine(reference, fragment)) {
        target = group;
        break;
      }
    }

    if (target) {
      target.push(fragment);
    } else {
      groups.push([fragment]);
    }
  }

  return groups
    .map((group) => {
      const ordered = [...group].sort((a, b) => a.x - b.x);

      const left = Math.min(...ordered.map((item) => item.x));

      const right = Math.max(...ordered.map((item) => item.x + item.width));

      const top = Math.min(...ordered.map((item) => item.y));

      const bottom = Math.max(...ordered.map((item) => item.y + item.height));

      return {
        text: reconstructText(ordered),
        x: left,
        y: top,
        width: right - left,
        height: bottom - top,
        page: ordered[0].page,
        fragments: ordered,
      };
    })
    .filter((line) => line.text.trim())
    .sort((a, b) => {
      if (Math.abs(a.y - b.y) < 4) {
        return a.x - b.x;
      }

      return a.y - b.y;
    });
}
