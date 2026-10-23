import { createFileRoute } from '@tanstack/react-router';
import { OrganicPage } from '@/components/analytics/pages';
import { pageHead } from '@/lib/analytics-data';
export const Route = createFileRoute('/organika')({ head: () => pageHead('Organika & automatizace', 'Organická návštěvnost, SEO a e-mailové automatizace v AVQIX.'), component: OrganicPage });
