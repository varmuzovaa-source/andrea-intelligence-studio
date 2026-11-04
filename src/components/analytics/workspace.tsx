import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import { LayoutGrid, Users, Sprout, Globe2, Megaphone, FileChartColumn, Settings2, Search, Database, ListChecks, Target, PanelLeftClose, PanelLeftOpen, ChevronDown, ArrowUpRight, Bell, Check, X, Menu, Command, CircleHelp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { clients, clientMonogram, isCustomClient, clientConfig, type RecoArea } from '@/lib/analytics-data';
import { clientsStore, useCustomClients } from '@/lib/clients-store';
type RecoState = Record<RecoArea, boolean>;

const WorkspaceContext = createContext<{ client: number; period: string; setClient: (v: number) => void; setPeriod: (v: string) => void; reco: RecoState; toggleReco: (a: RecoArea) => void }>({ client: 0, period: '30', setClient: () => {}, setPeriod: () => {}, reco: { keywords: true, google: true, meta: true, crm: true }, toggleReco: () => {} });
export const useWorkspace = () => useContext(WorkspaceContext);
const navigation = [
  { to: '/klienti', name: 'Klienti', icon: Users },
  { to: '/', name: 'Přehled', icon: LayoutGrid },
  { to: '/organika', name: 'Organika & automatizace', icon: Sprout },
  { to: '/web', name: 'Výkon webu', icon: Globe2 },
  { to: '/kampane', name: 'Výkon kampaní', icon: Megaphone },
  { to: '/cile', name: 'Cíle a rady', icon: Target },
  { to: '/search-console', name: 'Search Console', icon: Search },
  { to: '/ukoly', name: 'Úkoly týmu', icon: ListChecks },
  { to: '/reporty', name: 'Reporty', icon: FileChartColumn },
  { to: '/datove-zdroje', name: 'Datové zdroje', icon: Database },
] as const;
/** Pages that only know the demo data. For clients the user added they are replaced by a short notice. */
const demoOnly: string[] = ['/', '/organika', '/web', '/kampane', '/reporty'];
export function Workspace({ children }: { children: ReactNode }) {
  const [client, setClient] = useState(0);
  useCustomClients();
  useEffect(() => { clientsStore.hydrate(); }, []);
  const [period, setPeriod] = useState('30');
  const [reco, setReco] = useState<RecoState>({ keywords: true, google: true, meta: true, crm: true });
  const toggleReco = (a: RecoArea) => setReco(r => ({ ...r, [a]: !r[a] }));
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notice, setNotice] = useState(false);
  const path = useRouterState({ select: state => state.location.pathname });
  const current = navigation.find(item => item.to === path)?.name ?? (path === '/profil' ? 'Uživatelský profil' : 'Nastavení');
  return <WorkspaceContext.Provider value={{ client, period, setClient, setPeriod, reco, toggleReco }}>
    <div className={`workspace ${collapsed ? 'sidebar-collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
      {mobileOpen && <div className="sidebar-scrim" onClick={() => setMobileOpen(false)} />}
      <aside className="workspace-sidebar">
        <div className="brand"><span className="brand-mark"><Command size={22} /></span><div className="sidebar-label"><strong>AVQIX</strong><small>Marketing Intelligence</small></div><Button className="mobile-close" variant="ghost" size="icon" aria-label="Zavřít navigaci" onClick={() => setMobileOpen(false)}><X /></Button></div>
        <div className="client-select"><span className="client-monogram">{clientMonogram(client)}</span><div className="sidebar-label"><small>PRACOVNÍ PROSTOR</small><select aria-label="Vybrat klienta" value={client} onChange={e => setClient(Number(e.target.value))}>{clients.map((name, i) => <option key={name} value={i}>{name}</option>)}</select></div><ChevronDown className="sidebar-label" size={15} /></div>
        <div className="sidebar-nav-label sidebar-label">WORKSPACE</div>
        <nav aria-label="Hlavní navigace">{navigation.filter(item => !clientConfig(client).hiddenSections.includes(item.to) && !(isCustomClient(client) && demoOnly.includes(item.to))).map(item => <Button key={item.to} asChild variant="ghost" className={`nav-item ${path === item.to ? 'active' : ''}`} title={item.name}><Link to={item.to} onClick={() => setMobileOpen(false)}><item.icon size={18} /><span className="sidebar-label">{item.name}</span>{path === item.to && <span className="nav-dot sidebar-label" />}</Link></Button>)}</nav>
        <div className="sidebar-bottom"><div className="workspace-note sidebar-label"><span className="status-dot" /> Ukázkový pracovní prostor<small>{clientConfig(client).label}</small></div><Button asChild variant="ghost" className={`nav-item ${path === '/nastaveni' ? 'active' : ''}`} title="Nastavení"><Link to="/nastaveni"><Settings2 /><span className="sidebar-label">Nastavení</span></Link></Button><Button variant="ghost" className="nav-item collapse-control" onClick={() => setCollapsed(!collapsed)} title={collapsed ? 'Rozbalit navigaci' : 'Sbalit navigaci'} aria-label={collapsed ? 'Rozbalit navigaci' : 'Sbalit navigaci'}>{collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}<span className="sidebar-label">Sbalit menu</span></Button><Button asChild variant="ghost" className="profile-button" title="Uživatelský profil"><Link to="/profil"><span className="avatar">AV</span><span className="sidebar-label"><strong>Andrea Varmužová</strong><small>Marketing manager</small></span><ChevronDown className="sidebar-label" size={15} /></Link></Button></div>
      </aside>
      <div className="workspace-main"><header className="topbar"><div className="flex items-center gap-3"><Button variant="ghost" size="icon" className="mobile-menu" aria-label="Otevřít navigaci" onClick={() => setMobileOpen(true)}><Menu /></Button><span className="text-muted-foreground">Workspace</span><span className="text-muted-foreground">/</span><span>{current}</span></div><div className="topbar-right"><span className="demo-label">Demo data</span><div className="relative"><Button variant="ghost" size="icon" aria-label="Oznámení" onClick={() => setNotice(!notice)} className="notification-button"><Bell /><span /></Button>{notice && <div className="notice-popover"><strong>Oznámení</strong><p><Check size={16} /> Ukázková data jsou připravena.</p><small>Žádné externí účty nejsou připojené.</small></div>}</div><Button asChild variant="ghost" size="icon" title="Zdroje dat"><Link to="/nastaveni" aria-label="Zdroje dat"><CircleHelp /></Link></Button><span className="avatar avatar-small">AV</span></div></header>{isCustomClient(client) && demoOnly.includes(path) ? <DemoOnlyNotice name={clients[client] ?? ''} /> : children}<footer className="workspace-footer"><span>AVQIX <span className="footer-divider">/</span> Marketing Intelligence</span><span>Ukázková data · září 2026 <ArrowUpRight size={12} /></span></footer></div>
    </div>
  </WorkspaceContext.Provider>;
}

function DemoOnlyNotice({ name }: { name: string }) {
  return <main className="page-content"><div className="info-banner"><CircleHelp size={18} /><span>Tenhle přehled zatím umí jen ukázková data. Pro klienta {name} použijte Cíle a rady, Úkoly týmu a Search Console.</span><Button asChild variant="outline" size="sm"><Link to="/cile">Otevřít Cíle a rady</Link></Button></div></main>;
}
