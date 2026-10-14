import { createFileRoute } from '@tanstack/react-router';
import { WebPage } from '@/components/analytics/pages';
import { pageHead } from '@/lib/analytics-data';
export const Route = createFileRoute('/web')({ head: () => pageHead('Výkon webu', 'Návštěvnost, konverzní poměr a cesta k nákupu v ANDREA AI OS.'), component: WebPage });
