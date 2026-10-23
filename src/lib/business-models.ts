/**
 * Business model configuration for AVQIX.
 * Everything that differs between client types (wording, KPI set, hidden sections)
 * is read from here, so a new client type is a new entry, not new page logic.
 */
export type BusinessModel = 'ecommerce' | 'services' | 'hybrid' | 'b2b';

export type KpiCode =
  | 'revenue' | 'spend' | 'roas' | 'pno' | 'mer' | 'aov' | 'returning'
  | 'leads' | 'booked' | 'bookingRate' | 'costPerBooking' | 'responseTime' | 'capacity'
  | 'serviceRevenue' | 'shopRevenue' | 'shopRoas'
  | 'inquiries' | 'qualified' | 'pipeline' | 'won' | 'cycle';

export type ModelConfig = {
  label: string;
  vocab: { conversion: string; conversions: string; value: string; customer: string; goal: string };
  /** First four are shown as large tiles on Přehled, the rest as a secondary row. */
  kpis: KpiCode[];
  /** Navigation paths that make no sense for this model. */
  hiddenSections: string[];
};

export const modelConfigs: Record<BusinessModel, ModelConfig> = {
  ecommerce: {
    label: 'E-commerce',
    vocab: { conversion: 'objednávka', conversions: 'objednávky', value: 'tržby', customer: 'zákazník', goal: 'tržby s cílovým PNO' },
    kpis: ['revenue', 'spend', 'roas', 'pno', 'mer', 'aov', 'returning'],
    hiddenSections: [],
  },
  services: {
    label: 'Služby · lead generation',
    vocab: { conversion: 'objednaná konzultace', conversions: 'objednané konzultace', value: 'tržby ze služeb', customer: 'klient', goal: 'objednané termíny' },
    kpis: ['leads', 'booked', 'bookingRate', 'costPerBooking', 'responseTime', 'capacity'],
    hiddenSections: [],
  },
  hybrid: {
    label: 'Hybrid · služby + e-shop',
    vocab: { conversion: 'objednávka nebo konzultace', conversions: 'objednávky a konzultace', value: 'tržby služeb a e-shopu', customer: 'klient', goal: 'objednané termíny a tržby e-shopu' },
    kpis: ['leads', 'booked', 'costPerBooking', 'serviceRevenue', 'shopRevenue', 'shopRoas', 'capacity', 'returning'],
    hiddenSections: [],
  },
  b2b: {
    label: 'B2B',
    vocab: { conversion: 'kvalifikovaná příležitost', conversions: 'kvalifikované příležitosti', value: 'uzavřené zakázky', customer: 'firma', goal: 'pipeline a uzavřené zakázky' },
    kpis: ['inquiries', 'qualified', 'pipeline', 'won', 'cycle'],
    hiddenSections: [],
  },
};

export const modelLabels: Record<BusinessModel, string> = {
  ecommerce: modelConfigs.ecommerce.label,
  services: modelConfigs.services.label,
  hybrid: modelConfigs.hybrid.label,
  b2b: modelConfigs.b2b.label,
};
