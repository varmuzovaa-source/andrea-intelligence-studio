import { createFileRoute } from '@tanstack/react-router';

/**
 * Local-only endpoint behind the "Aktualizovat z Fachmana" button.
 * It runs scripts/most_fachman.py (which only reads from Google Ads / Meta through Fachman).
 * Disabled unless AVQIX_LOCAL=1 (set by start.sh), so the public Vercel deploy never exposes it.
 * Also refuses requests that do not come from localhost.
 */
const LOCAL = ['localhost', '127.0.0.1', '[::1]'];
const allowed = (request: Request) => {
  if (process.env['AVQIX_LOCAL'] !== '1') return false;
  const origin = request.headers.get('origin');
  return LOCAL.includes(new URL(request.url).hostname) && (!origin || LOCAL.includes(new URL(origin).hostname));
};
const json = (body: unknown, status = 200) => Response.json(body, { status });

export const Route = createFileRoute('/api/most')({
  server: {
    handlers: {
      GET: async ({ request }) => (allowed(request) ? json({ available: true }) : json({ available: false }, 404)),
      POST: async ({ request }) => {
        if (!allowed(request)) return json({ error: 'Není dostupné.' }, 404);
        const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
        const slug = String(body['slug'] ?? ''), google = String(body['google'] ?? ''), meta = String(body['meta'] ?? ''), days = Number(body['days']);
        if (!/^[a-z0-9-]{1,60}$/.test(slug)) return json({ error: 'Neplatné jméno složky klienta.' }, 400);
        if (google && !/^\d{3}-?\d{3}-?\d{4}$/.test(google)) return json({ error: 'Google Ads ID má mít 10 číslic, např. 123-456-7890.' }, 400);
        if (meta && !/^act_\d{5,}$/.test(meta)) return json({ error: 'Meta ID má tvar act_123456.' }, 400);
        if (!google && !meta) return json({ error: 'Doplňte aspoň jedno ID účtu.' }, 400);
        if (![7, 30, 90].includes(days)) return json({ error: 'Období musí být 7, 30 nebo 90 dní.' }, 400);

        const { execFile } = await import('node:child_process');
        const { readFile } = await import('node:fs/promises');
        const { resolve, sep } = await import('node:path');
        const root = process.cwd();
        const args = ['scripts/most_fachman.py', slug, '--dny', String(days), ...(google ? ['--google', google] : []), ...(meta ? ['--meta', meta] : [])];
        const run = await new Promise<{ code: number; out: string; err: string }>(res => {
          execFile('python3', args, { cwd: root, timeout: 180_000, maxBuffer: 20 * 1024 * 1024 }, (error, out, err) => res({ code: error ? 1 : 0, out, err: err || (error?.message ?? '') }));
        });
        if (run.code !== 0) return json({ error: (run.err || run.out).trim().slice(-600) || 'Stažení selhalo.' }, 500);
        const dir = resolve(root, 'data-most') + sep;
        const files: { name: string; text: string }[] = [];
        for (const m of run.out.matchAll(/^SOUBOR: (.+)$/gm)) {
          const path = resolve(m[1]!.trim());
          if (path.startsWith(dir)) files.push({ name: path.slice(dir.length), text: await readFile(path, 'utf8') });
        }
        return json({ files });
      },
    },
  },
});
