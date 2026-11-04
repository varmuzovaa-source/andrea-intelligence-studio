/**
 * Generic, browser-safe CSV helpers: parsing, header matching and column checks.
 * Nothing here touches the network; files are read in the browser only.
 */

export type ColumnSpec = {
  key: string;
  label: string;
  required: boolean;
  /** Lower-cased, diacritics-free header names that map to this column. */
  aliases: string[];
};

export type ColumnCheck = {
  ok: boolean;
  /** column key -> index in the CSV header row */
  mapping: Record<string, number>;
  missing: ColumnSpec[];
  /** Headers in the file that matched no known column. */
  ignored: string[];
};

export const normalizeHeader = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9%]+/g, ' ')
    .trim();

/** Picks the delimiter that appears most often in the first line (outside quotes). */
export function detectDelimiter(text: string): string {
  const firstLine = text.replace(/^\uFEFF/, '').split(/\r?\n/, 1)[0] ?? '';
  const counts = new Map<string, number>();
  let inQuotes = false;
  for (const ch of firstLine) {
    if (ch === '"') inQuotes = !inQuotes;
    else if (!inQuotes && (ch === ',' || ch === ';' || ch === '\t')) counts.set(ch, (counts.get(ch) ?? 0) + 1);
  }
  let best = ',';
  let max = 0;
  for (const [ch, n] of counts) if (n > max) { best = ch; max = n; }
  return best;
}

export function parseCsv(text: string): string[][] {
  const input = text.replace(/^\uFEFF/, '');
  const delimiter = detectDelimiter(input);
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let inQuotes = false;
  for (let i = 0; i < input.length; i++) {
    const ch = input[i]!;
    if (inQuotes) {
      if (ch === '"') {
        if (input[i + 1] === '"') { cell += '"'; i++; } else inQuotes = false;
      } else cell += ch;
    } else if (ch === '"') inQuotes = true;
    else if (ch === delimiter) { row.push(cell); cell = ''; }
    else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && input[i + 1] === '\n') i++;
      row.push(cell); cell = '';
      if (row.some(c => c.trim() !== '')) rows.push(row);
      row = [];
    } else cell += ch;
  }
  row.push(cell);
  if (row.some(c => c.trim() !== '')) rows.push(row);
  return rows;
}

/** Parses "1 234,5", "1,234.5", "3,2 %", "12%" into a number. Returns NaN when unreadable. */
export function parseNumber(raw: string | undefined): number {
  if (raw == null) return NaN;
  let s = raw.replace(/[\s\u00a0%]/g, '');
  if (s === '' || s === '-' || s === '—') return NaN;
  const lastComma = s.lastIndexOf(',');
  const lastDot = s.lastIndexOf('.');
  if (lastComma > -1 && lastDot > -1) {
    // the later separator is the decimal one
    s = lastComma > lastDot ? s.replaceAll('.', '').replace(',', '.') : s.replaceAll(',', '');
  } else if (lastComma > -1) {
    s = s.replace(',', '.');
  }
  return Number(s);
}

export function checkColumns(headers: string[], spec: ColumnSpec[]): ColumnCheck {
  const normalized = headers.map(normalizeHeader);
  const mapping: Record<string, number> = {};
  const used = new Set<number>();
  for (const col of spec) {
    const idx = normalized.findIndex((h, i) => !used.has(i) && col.aliases.includes(h));
    if (idx > -1) { mapping[col.key] = idx; used.add(idx); }
  }
  return {
    ok: spec.every(c => !c.required || c.key in mapping),
    mapping,
    missing: spec.filter(c => c.required && !(c.key in mapping)),
    ignored: headers.filter((_, i) => !used.has(i) && headers[i]!.trim() !== ''),
  };
}
