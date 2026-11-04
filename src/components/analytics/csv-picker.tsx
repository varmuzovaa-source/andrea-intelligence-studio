import { useRef, type ReactNode } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

/** File input that reads CSV files in the browser only. Nothing is uploaded anywhere. */
export function CsvPicker({ label, multiple = false, accept = '.csv,text/csv', icon, onText }: { label: string; multiple?: boolean; accept?: string; icon?: ReactNode; onText: (text: string, fileName: string) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const read = async (files: FileList | null) => {
    if (!files) return;
    for (const file of Array.from(files)) onText(await file.text(), file.name);
    if (input.current) input.current.value = '';
  };
  return <>
    <input ref={input} type="file" accept={accept} multiple={multiple} hidden onChange={e => void read(e.target.files)} />
    <Button variant="outline" size="sm" onClick={() => input.current?.click()}>{icon ?? <Upload />}{label}</Button>
  </>;
}
