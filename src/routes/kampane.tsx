import { createFileRoute } from '@tanstack/react-router';
import { CampaignsPage } from '@/components/analytics/pages';
import { pageHead } from '@/lib/analytics-data';
export const Route = createFileRoute('/kampane')({ head: () => pageHead('Výkon kampaní', 'Porovnání kampaní a kreativ v ANDREA AI OS. Náklady, CTR, CPC, CPL a ROAS.'), component: CampaignsPage });
