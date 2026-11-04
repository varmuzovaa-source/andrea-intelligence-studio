import { createFileRoute } from '@tanstack/react-router';
import { DataSourcesPage } from '@/components/analytics/data-sources-page';
import { pageHead } from '@/lib/analytics-data';
export const Route = createFileRoute('/datove-zdroje')({ head: () => pageHead('Datové zdroje', 'Konektory a import CSV s kontrolou sloupců.'), component: DataSourcesPage });
