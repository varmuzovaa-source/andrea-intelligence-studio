import { Check, X, Minus } from 'lucide-react';
import type { ColumnCheck, ColumnSpec } from '@/lib/csv-import';

/** Shows, column by column, what was found in a CSV and what is missing. */
export function ColumnReport({ spec, check }: { spec: ColumnSpec[]; check: ColumnCheck | null }) {
  return <ul className="column-report" aria-label="Kontrola sloupců">
    {spec.map(c => {
      const found = !!check && c.key in check.mapping;
      const state = !check ? 'optional' : found ? 'found' : c.required ? 'missing' : 'optional';
      return <li key={c.key} className={`column-${state}`}>
        {found ? <Check size={13} /> : check && c.required ? <X size={13} /> : <Minus size={13} />}
        <span>{c.label}</span>
        <small>{!check ? (c.required ? 'očekává se' : 'volitelné') : found ? 'nalezeno' : c.required ? 'chybí' : 'volitelné, nenalezeno'}</small>
      </li>;
    })}
  </ul>;
}
