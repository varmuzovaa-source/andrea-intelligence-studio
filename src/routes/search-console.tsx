import { createFileRoute } from '@tanstack/react-router';
import { SearchConsolePage } from '@/components/analytics/search-console-page';
import { pageHead } from '@/lib/analytics-data';
export const Route = createFileRoute('/search-console')({ head: () => pageHead('Search Console', 'Import CSV, příležitosti v organice a doporučení.'), component: SearchConsolePage });
