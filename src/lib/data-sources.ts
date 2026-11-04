/**
 * Registry of data connectors, modelled as pluggable modules.
 * Adding a connector means adding one entry here; the Datové zdroje page renders from this list.
 * Every connector is "disconnected" in the prototype: no OAuth, no API calls.
 */
import type { ColumnSpec } from './csv-import';
import { gscColumns } from './search-console';

export type ConnectorStatus = 'disconnected' | 'connected';

export type Connector = {
  id: string;
  name: string;
  description: string;
  symbol: string;
  status: ConnectorStatus;
  /** What a real connection would need later (shown as a hint only). */
  connectionNote: string;
  /** If present, a CSV export of this source can be checked and previewed. */
  csv?: { hint: string; columns: ColumnSpec[]; feedsApp: boolean };
};

const col = (key: string, label: string, required: boolean, ...aliases: string[]): ColumnSpec => ({ key, label, required, aliases });

export const connectors: Connector[] = [
  {
    id: 'search-console', name: 'Google Search Console', symbol: '⌕', status: 'disconnected',
    description: 'Organické vyhledávání, dotazy a stránky.',
    connectionNote: 'OAuth přes Google účet s přístupem k webu (později).',
    csv: { hint: 'Export „Dotazy“ nebo „Stránky“ z Výkonu ve Search Console.', columns: gscColumns, feedsApp: true },
  },
  {
    id: 'meta-ads', name: 'Meta Ads', symbol: '∞', status: 'disconnected',
    description: 'Kampaně, reklamní sestavy a kreativy.',
    connectionNote: 'Meta Marketing API, přístup k reklamnímu účtu (později).',
    csv: {
      hint: 'Export z Ads Manageru na úrovni kampaní.', feedsApp: false,
      columns: [
        col('campaign', 'Název kampaně', true, 'campaign name', 'nazev kampane', 'kampan'),
        col('spend', 'Vynaložená částka', true, 'amount spent', 'amount spent czk', 'vynalozena castka', 'vynaloz castka czk', 'naklady'),
        col('impressions', 'Zobrazení', true, 'impressions', 'zobrazeni'),
        col('clicks', 'Kliknutí', false, 'link clicks', 'clicks', 'kliknuti', 'kliknuti na odkaz'),
        col('results', 'Výsledky', false, 'results', 'vysledky'),
      ],
    },
  },
  {
    id: 'google-ads', name: 'Google Ads', symbol: 'G', status: 'disconnected',
    description: 'Vyhledávání, Shopping a Performance Max.',
    connectionNote: 'Google Ads API, developer token a přístup k účtu (později).',
    csv: {
      hint: 'Report kampaní z Google Ads.', feedsApp: false,
      columns: [
        col('campaign', 'Kampaň', true, 'campaign', 'kampan', 'nazev kampane'),
        col('cost', 'Náklady', true, 'cost', 'naklady', 'cena'),
        col('clicks', 'Kliknutí', true, 'clicks', 'kliknuti'),
        col('impressions', 'Zobrazení', true, 'impr', 'impressions', 'zobrazeni'),
        col('conversions', 'Konverze', false, 'conversions', 'konverze'),
        col('value', 'Hodnota konverzí', false, 'conv value', 'conversion value', 'hodnota konverzi'),
      ],
    },
  },
  {
    id: 'ga4', name: 'Google Analytics 4', symbol: '↗', status: 'disconnected',
    description: 'Návštěvnost, konverze a tržby.',
    connectionNote: 'GA4 Data API, přístup k vlastnosti (později).',
    csv: {
      hint: 'Export reportu Akvizice nebo Stránky a obrazovky.', feedsApp: false,
      columns: [
        col('source', 'Zdroj / médium nebo stránka', true, 'session source medium', 'session default channel group', 'page path', 'page path and screen class', 'zdroj medium', 'cesta stranky'),
        col('sessions', 'Relace', true, 'sessions', 'relace'),
        col('users', 'Uživatelé', false, 'users', 'total users', 'uzivatele', 'celkovy pocet uzivatelu'),
        col('conversions', 'Konverze', false, 'key events', 'conversions', 'konverze', 'klicove udalosti'),
        col('revenue', 'Tržby', false, 'total revenue', 'revenue', 'trzby', 'celkove trzby'),
      ],
    },
  },
  {
    id: 'youtube', name: 'YouTube', symbol: '▶', status: 'disconnected',
    description: 'Videa, zhlédnutí a doba sledování.',
    connectionNote: 'YouTube Analytics API (později).',
    csv: {
      hint: 'Export z YouTube Studia, tabulka videí.', feedsApp: false,
      columns: [
        col('video', 'Video', true, 'video title', 'content', 'nazev videa', 'obsah'),
        col('views', 'Zhlédnutí', true, 'views', 'zhlednuti'),
        col('watch', 'Doba sledování (hodiny)', false, 'watch time hours', 'watch time (hours)', 'doba sledovani hodiny'),
        col('subs', 'Noví odběratelé', false, 'subscribers', 'subscribers gained', 'odberatele', 'novi odberatele'),
      ],
    },
  },
  {
    id: 'email', name: 'E-mailing', symbol: '@', status: 'disconnected',
    description: 'Newslettery a automatizace.',
    connectionNote: 'Podle nástroje (např. ActiveCampaign, Klaviyo), API klíč (později).',
    csv: {
      hint: 'Export statistik kampaní z e-mailového nástroje.', feedsApp: false,
      columns: [
        col('campaign', 'Kampaň', true, 'campaign', 'campaign name', 'kampan', 'nazev kampane'),
        col('sent', 'Odesláno', true, 'sent', 'delivered', 'odeslano', 'doruceno'),
        col('opens', 'Otevření', false, 'opens', 'unique opens', 'otevreni'),
        col('clicks', 'Kliknutí', false, 'clicks', 'unique clicks', 'kliknuti'),
        col('unsub', 'Odhlášení', false, 'unsubscribes', 'unsubscribed', 'odhlaseni'),
      ],
    },
  },
  {
    id: 'ai', name: 'AI (Claude, GPT)', symbol: '✦', status: 'disconnected',
    description: 'Volitelný souhrn z agregovaných čísel. Ve výchozím stavu vypnuto.',
    connectionNote: 'API klíč poskytovatele, ukládá se mimo prohlížeč (později).',
  },
];
