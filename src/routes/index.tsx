import { createFileRoute } from '@tanstack/react-router';
import { OverviewPage } from '@/components/analytics/pages';
import { pageHead } from '@/lib/analytics-data';
export const Route = createFileRoute('/')({ head: () => pageHead('Přehled výkonu', 'AVQIX Intelligence Studio: z cílů klienta udělá konkrétní rady po kampaních (Google Ads, Meta, e-mail), s úkoly pro tým a reportem pro klienta.'), component: OverviewPage });
