import { createFileRoute } from '@tanstack/react-router';
import { SettingsPage } from '@/components/analytics/pages';
import { pageHead } from '@/lib/analytics-data';
export const Route = createFileRoute('/nastaveni')({ head: () => pageHead('Nastavení', 'Datové zdroje a nastavení pracovního prostoru AVQIX.'), component: SettingsPage });
