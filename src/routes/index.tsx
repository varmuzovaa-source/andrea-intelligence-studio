import { createFileRoute } from '@tanstack/react-router';
import { OverviewPage } from '@/components/analytics/pages';
import { pageHead } from '@/lib/analytics-data';
export const Route = createFileRoute('/')({ head: () => pageHead('Přehled výkonu', 'Marketingový přehled ANDREA AI OS. Tržby, ROAS, PNO, výsledky kampaní a kreativ na jednom místě.'), component: OverviewPage });
