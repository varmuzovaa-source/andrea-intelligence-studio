import { createFileRoute } from '@tanstack/react-router';
import { GoalsPage } from '@/components/analytics/goals-page';
import { pageHead } from '@/lib/analytics-data';
export const Route = createFileRoute('/cile')({ head: () => pageHead('Cíle a rady', 'Cíle klienta, jak daleko k nim jsme a co udělat u konkrétní kampaně.'), component: GoalsPage });
