import { createFileRoute } from '@tanstack/react-router';
import { ReportsPage } from '@/components/analytics/pages';
import { pageHead } from '@/lib/analytics-data';
export const Route = createFileRoute('/reporty')({ head: () => pageHead('Reporty', 'Marketingové reporty a export výsledků v ANDREA AI OS.'), component: ReportsPage });
