import { createFileRoute } from '@tanstack/react-router';
import { ProfilePage } from '@/components/analytics/pages';
import { pageHead } from '@/lib/analytics-data';
export const Route = createFileRoute('/profil')({ head: () => pageHead('Uživatelský profil', 'Uživatelský profil pracovního prostoru ANDREA AI OS.'), component: ProfilePage });
