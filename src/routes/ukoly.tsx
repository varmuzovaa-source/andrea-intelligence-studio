import { createFileRoute } from '@tanstack/react-router';
import { TasksPage } from '@/components/analytics/tasks-page';
import { pageHead } from '@/lib/analytics-data';
export const Route = createFileRoute('/ukoly')({ head: () => pageHead('Úkoly týmu', 'Předaná doporučení, kdo je řeší a v jakém jsou stavu.'), component: TasksPage });
