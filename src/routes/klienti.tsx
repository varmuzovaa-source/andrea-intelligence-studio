import { createFileRoute } from '@tanstack/react-router';
import { ClientsPage } from '@/components/analytics/pages';
import { pageHead } from '@/lib/analytics-data';
export const Route = createFileRoute('/klienti')({ head: () => pageHead('Klienti', 'Přehled demo klientů AVQIX podle obchodního modelu: e-commerce, hybrid a B2B.'), component: ClientsPage });
