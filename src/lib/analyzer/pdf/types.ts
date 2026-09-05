export type PdfFragment = {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  fontName?: string;
  page: number;
};

export type PdfLine = {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  page: number;
  fragments: PdfFragment[];
};

export type PdfColumn = {
  x: number;
  width: number;
  lines: PdfLine[];
};

export type PdfPageLayout = {
  page: number;
  width: number;
  height: number;
  fragments: PdfFragment[];
  lines: PdfLine[];
  columns: PdfColumn[];
};
