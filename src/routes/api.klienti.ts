import { createFileRoute } from '@tanstack/react-router';
import { nameFromSlug, parsePpcMd } from '@/lib/ppc-md';

/**
 * Local-only: lists client folders (AGENTURA/klienti/*) and reads account IDs, type and KPI lines
 * from <klient>/ppc/ppc.md when present. Off unless AVQIX_LOCAL=1 and the request comes from localhost.
 * Never reads .env or anything under clients/.secret.
 */
const LOCAL = ['localhost', '127.0.0.1', '[::1]'];
const allowed = (request: Request) => {
  if (process.env['AVQIX_LOCAL'] !== '1') return false;
  const origin = request.headers.get('origin');
  return LOCAL.includes(new URL(request.url).hostname) && (!origin || LOCAL.includes(new URL(origin).hostname));
};

export const Route = createFileRoute('/api/klienti')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        if (!allowed(request)) return Response.json({ available: false }, { status: 404 });
        const { readdir, readFile } = await import('node:fs/promises');
        const { homedir } = await import('node:os');
        const { join } = await import('node:path');
        const dir = process.env['AVQIX_KLIENTI_DIR'] || join(homedir(), 'AGENTURA', 'klienti');
        let entries: { name: string; isDirectory: () => boolean }[] = [];
        try { entries = await readdir(dir, { withFileTypes: true }); } catch { return Response.json({ available: true, folder: dir, clients: [] }); }
        const clients = [];
        for (const e of entries.filter(x => x.isDirectory() && /^[a-z0-9-]+$/.test(x.name)).sort((a, b) => a.name.localeCompare(b.name))) {
          let info = {};
          try { info = parsePpcMd(await readFile(join(dir, e.name, 'ppc', 'ppc.md'), 'utf8')); } catch { /* no ppc.md yet */ }
          clients.push({ slug: e.name, name: nameFromSlug(e.name), ...info });
        }
        return Response.json({ available: true, folder: dir, clients });
      },
    },
  },
});
