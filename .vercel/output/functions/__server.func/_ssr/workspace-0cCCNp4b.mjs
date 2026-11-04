import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as Link, p as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { C as Earth, D as CircleQuestionMark, F as ArrowUpRight, M as Check, P as Bell, T as Command, d as PanelLeftOpen, f as PanelLeftClose, j as ChevronDown, m as Megaphone, n as Users, p as Menu, r as Sprout, s as Settings2, t as X, v as LayoutGrid, x as FileChartColumn } from "../_libs/lucide-react.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/workspace-0cCCNp4b.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
			destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
			outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
			secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-9 px-4 py-2",
			sm: "h-8 rounded-md px-3 text-xs",
			lg: "h-10 rounded-md px-8",
			icon: "h-9 w-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
var creative_skincare_default = "/assets/creative-skincare-DvQDimSR.jpg";
var creative_interior_default = "/assets/creative-interior-D-Yh2EAd.jpg";
var creative_sneaker_default = "/assets/creative-sneaker-D99CufF6.jpg";
var modelConfigs = {
	ecommerce: {
		label: "E-commerce",
		vocab: {
			conversion: "objednávka",
			conversions: "objednávky",
			value: "tržby",
			customer: "zákazník",
			goal: "tržby s cílovým PNO"
		},
		kpis: [
			"revenue",
			"spend",
			"roas",
			"pno",
			"mer",
			"aov",
			"returning"
		],
		hiddenSections: []
	},
	services: {
		label: "Služby · lead generation",
		vocab: {
			conversion: "objednaná konzultace",
			conversions: "objednané konzultace",
			value: "tržby ze služeb",
			customer: "klient",
			goal: "objednané termíny"
		},
		kpis: [
			"leads",
			"booked",
			"bookingRate",
			"costPerBooking",
			"responseTime",
			"capacity"
		],
		hiddenSections: []
	},
	hybrid: {
		label: "Hybrid · služby + e-shop",
		vocab: {
			conversion: "objednávka nebo konzultace",
			conversions: "objednávky a konzultace",
			value: "tržby služeb a e-shopu",
			customer: "klient",
			goal: "objednané termíny a tržby e-shopu"
		},
		kpis: [
			"leads",
			"booked",
			"costPerBooking",
			"serviceRevenue",
			"shopRevenue",
			"shopRoas",
			"capacity",
			"returning"
		],
		hiddenSections: []
	},
	b2b: {
		label: "B2B",
		vocab: {
			conversion: "kvalifikovaná příležitost",
			conversions: "kvalifikované příležitosti",
			value: "uzavřené zakázky",
			customer: "firma",
			goal: "pipeline a uzavřené zakázky"
		},
		kpis: [
			"inquiries",
			"qualified",
			"pipeline",
			"won",
			"cycle"
		],
		hiddenSections: []
	}
};
var modelLabels = {
	ecommerce: modelConfigs.ecommerce.label,
	services: modelConfigs.services.label,
	hybrid: modelConfigs.hybrid.label,
	b2b: modelConfigs.b2b.label
};
var demoClients = [
	{
		name: "Greenly Store",
		model: "ecommerce",
		monogram: "g.",
		isDemo: true
	},
	{
		name: "Klinika Aurea",
		model: "hybrid",
		monogram: "a.",
		isDemo: true
	},
	{
		name: "Fasada Pro",
		model: "b2b",
		monogram: "f.",
		isDemo: true
	},
	{
		name: "Studio Lumen",
		model: "services",
		monogram: "l.",
		isDemo: true
	}
];
var clients = demoClients.map((c) => c.name);
var clientModel = (client) => demoClients[client]?.model ?? "ecommerce";
var clientConfig = (client) => modelConfigs[clientModel(client)];
var creativeImages = [
	creative_skincare_default,
	creative_interior_default,
	creative_sneaker_default
];
var money = (value) => new Intl.NumberFormat("cs-CZ", { maximumFractionDigits: 0 }).format(value) + " Kč";
var number = (value) => new Intl.NumberFormat("cs-CZ", { maximumFractionDigits: 0 }).format(value);
function getAnalytics(client, period) {
	const factor = [
		1,
		.72,
		1.28,
		.46
	][client] ?? 1;
	const days = period === "7" ? 7 : period === "90" ? 90 : 30;
	const multiplier = factor * days / 30;
	const spend = Math.round(124680 * multiplier);
	const revenue = Math.round(605945 * multiplier * (1 + client * .07));
	const conversions = Math.round(1284 * multiplier);
	const chart = Array.from({ length: days }, (_, i) => ({
		date: new Date(Date.UTC(2026, 8, 30 - days + i + 1)).toLocaleDateString("cs-CZ", {
			day: "numeric",
			month: "numeric",
			timeZone: "UTC"
		}),
		revenue: Math.round((15e3 + Math.sin(i * .65) * 5500 + i % 7 * 1250 + i * 210) * factor),
		spend: Math.round((3300 + Math.cos(i * .4) * 900 + i * 45) * factor),
		previous: Math.round((13500 + Math.sin(i * .6) * 3600 + i * 160) * factor)
	}));
	const rawRevenue = chart.reduce((total, day) => total + day.revenue, 0);
	const rawSpend = chart.reduce((total, day) => total + day.spend, 0);
	chart.forEach((day) => {
		day.revenue = Math.round(day.revenue / rawRevenue * revenue);
		day.spend = Math.round(day.spend / rawSpend * spend);
		day.previous = Math.round(day.previous / rawRevenue * revenue / 1.186);
	});
	const rows = ([
		[
			"Podzimní kolekce · Sales",
			"Bestsellery · Advantage+",
			"Remarketing · 30 dní",
			"Brand · Vyhledávání",
			"Nová kolekce · PMax",
			"Newsletter · Září",
			"Prospecting · Video",
			"Brand · Shopping"
		],
		[
			"Konzultace zdarma · Leady",
			"Kosmetika · Sales",
			"Remarketing · Klinika",
			"Brand · Vyhledávání",
			"E-shop · PMax",
			"Newsletter · Péče",
			"Ošetření · Video",
			"Kosmetika · Shopping"
		],
		[
			"Zateplení fasád · Leady",
			"Developeři · LinkedIn",
			"Remarketing · Reference",
			"Brand · Vyhledávání",
			"Poptávky · PMax",
			"Newsletter · Projekty",
			"Realizace · Video",
			"Služby · Vyhledávání"
		],
		[
			"Ošetření pleti · Leady",
			"Rezervace online · Sales",
			"Remarketing · Salon",
			"Brand · Vyhledávání",
			"Ošetření · Vyhledávání",
			"Newsletter · Péče",
			"Proměny · Video",
			"Dárkové poukazy · Leady"
		]
	][client] ?? [
		"Podzimní kolekce · Sales",
		"Bestsellery · Advantage+",
		"Remarketing · 30 dní",
		"Brand · Vyhledávání",
		"Nová kolekce · PMax",
		"Newsletter · Září",
		"Prospecting · Video",
		"Brand · Shopping"
	]).map((name, i) => {
		const rowSpend = Math.round(([
			32450,
			28120,
			18760,
			12350,
			16480,
			2800,
			8500,
			5200
		][i] ?? 0) * multiplier);
		const roas = ([
			5.82,
			5.24,
			6.18,
			7.42,
			3.86,
			8.24,
			2.65,
			4.12
		][i] ?? 0) + client * .12;
		return {
			id: i,
			name,
			source: i === 5 ? "E-mail" : [
				3,
				4,
				7
			].includes(i) ? "Google Ads" : "Meta Ads",
			status: i === 6 ? "Pozastavená" : "Aktivní",
			spend: rowSpend,
			revenue: Math.round(rowSpend * roas),
			roas,
			ctr: ([
				2.84,
				3.12,
				4.28,
				6.12,
				1.85,
				5.42,
				1.24,
				2.62
			][i] ?? 0) + client * .15,
			cpc: 8.4 + i * 1.2,
			cpl: 85 + i * 12,
			conversions: Math.round(rowSpend * roas / 472),
			image: creativeImages[(i + client) % 3] ?? "/assets/creative-skincare-DvQDimSR.jpg"
		};
	});
	return {
		spend,
		revenue,
		conversions,
		visits: Math.round(48260 * multiplier),
		chart,
		rows,
		factor,
		multiplier
	};
}
function downloadCsv(filename, headers, rows) {
	const csv = "﻿" + [headers, ...rows].map((row) => row.map((v) => "\"" + String(v).replaceAll("\"", "\"\"") + "\"").join(";")).join("\r\n");
	const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
	const link = document.createElement("a");
	link.href = url;
	link.download = filename;
	link.click();
	URL.revokeObjectURL(url);
}
function pageHead(title, description) {
	return { meta: [
		{ title: `${title} — AVQIX` },
		{
			name: "description",
			content: description
		},
		{
			property: "og:title",
			content: `${title} — AVQIX`
		},
		{
			property: "og:description",
			content: description
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] };
}
var recoAreas = [
	{
		id: "keywords",
		name: "Klíčová slova"
	},
	{
		id: "google",
		name: "Google Ads"
	},
	{
		id: "meta",
		name: "Meta Ads"
	},
	{
		id: "crm",
		name: "Leady a CRM"
	}
];
function getKeywords(client, period) {
	const { multiplier } = getAnalytics(client, period);
	return [
		{
			word: (clients[client] ?? clients[0]).toLowerCase(),
			intent: "Navigační",
			difficulty: 12
		},
		{
			word: "přírodní produkty",
			intent: "Informační",
			difficulty: 48
		},
		{
			word: "nová kolekce",
			intent: "Komerční",
			difficulty: 36
		},
		{
			word: "udržitelný design",
			intent: "Informační",
			difficulty: 54
		},
		{
			word: "dárky online",
			intent: "Transakční",
			difficulty: 67
		}
	].map((k, i) => {
		const clicks = Math.round((1850 - i * 280) * multiplier);
		const impressions = Math.round((14850 - i * 1800) * multiplier);
		const position = 2.4 + i * 3.8;
		const ctr = clicks / impressions * 100;
		const opportunity = Math.round(Math.min(100, impressions / 150 / multiplier * (position > 4 ? 1.4 : .6) * (100 - k.difficulty) / 60));
		return {
			...k,
			clicks,
			impressions,
			position,
			ctr,
			change: i + 2,
			opportunity
		};
	});
}
function ecommerceRecommendations(client, period) {
	const data = getAnalytics(client, period);
	const kw = getKeywords(client, period);
	const name = clients[client] ?? clients[0];
	const r = data.rows;
	const best = [...r].sort((a, b) => b.roas - a.roas)[0];
	const worst = [...r].filter((x) => x.source === "Meta Ads").sort((a, b) => a.roas - b.roas)[0];
	const pmax = r[4];
	return [
		{
			id: "k1",
			area: "keywords",
			priority: "Vysoká",
			title: `Posunout „${kw[2].word}“ do TOP 3`,
			insight: `Pozice ${kw[2].position.toFixed(1).replace(".", ",")} při ${number(kw[2].impressions)} zobrazeních – CTR jen ${kw[2].ctr.toFixed(1).replace(".", ",")} %.`,
			action: "Rozšířit kategorii o 600+ slov, FAQ a interní odkazy z blogu.",
			recipient: "SEO specialista",
			audience: "Interní",
			impact: `+${number(kw[2].clicks * .6)} kliknutí`
		},
		{
			id: "k2",
			area: "keywords",
			priority: "Střední",
			title: `Nový článek na „${kw[3].word}“`,
			insight: `Informační dotaz s obtížností ${kw[3].difficulty}/100, zatím bez cílené stránky.`,
			action: "Připravit průvodce s odkazy na produkty a meta popisem.",
			recipient: "Copywriter",
			audience: "Interní",
			impact: "Nová organická návštěvnost"
		},
		{
			id: "k3",
			area: "keywords",
			priority: "Střední",
			title: `Doplnit „${kw[4].word}“ do PPC`,
			insight: `Transakční slovo na pozici ${kw[4].position.toFixed(1).replace(".", ",")} – organicky těžko dosažitelné.`,
			action: "Pokrýt slovo ve vyhledávací kampani, organiku řešit dlouhodobě.",
			recipient: "PPC specialista",
			audience: "Interní",
			impact: "Rychlejší obsazení poptávky"
		},
		{
			id: "k4",
			area: "keywords",
			priority: "Nízká",
			title: "Schválit obsahový plán na další měsíc",
			insight: `${name} roste v ${kw.length} sledovaných slovech.`,
			action: "Potvrdit témata článků a dodat fotografie produktů.",
			recipient: "Klient",
			audience: "Klient",
			impact: "Plynulé pokračování růstu"
		},
		{
			id: "g1",
			area: "google",
			priority: "Vysoká",
			title: "Navýšit rozpočet Brand · Vyhledávání",
			insight: `ROAS ${r[3].roas.toFixed(2).replace(".", ",")}× – kampaň je omezená rozpočtem.`,
			action: "Zvýšit denní rozpočet o 20 % a hlídat podíl zobrazení.",
			recipient: "PPC specialista",
			audience: "Interní",
			impact: `+${money(r[3].revenue * .18)} tržeb`
		},
		{
			id: "g2",
			area: "google",
			priority: "Vysoká",
			title: `Optimalizovat ${pmax.name}`,
			insight: `Nejnižší ROAS v Google Ads (${pmax.roas.toFixed(2).replace(".", ",")}×).`,
			action: "Vyloučit slabé produkty z feedu a doplnit nové assety.",
			recipient: "PPC specialista",
			audience: "Interní",
			impact: "Úspora až 15 % nákladů"
		},
		{
			id: "g3",
			area: "google",
			priority: "Střední",
			title: "Upravit produktový feed",
			insight: "Názvy produktů neobsahují hledané výrazy.",
			action: "Doplnit do názvů materiál, barvu a klíčová slova.",
			recipient: "E-commerce manažer klienta",
			audience: "Klient",
			impact: "Vyšší CTR v Shoppingu"
		},
		{
			id: "m1",
			area: "meta",
			priority: "Vysoká",
			title: `Přesunout rozpočet do ${best.source === "Meta Ads" ? best.name : r[2].name}`,
			insight: `Remarketing dosahuje ROAS ${r[2].roas.toFixed(2).replace(".", ",")}× oproti ${worst.roas.toFixed(2).replace(".", ",")}× u ${worst.name}.`,
			action: `Převést 20 % rozpočtu z kampaně ${worst.name}.`,
			recipient: "Performance specialista",
			audience: "Interní",
			impact: `+${money(worst.spend * .2 * (r[2].roas - worst.roas))} tržeb`
		},
		{
			id: "m2",
			area: "meta",
			priority: "Střední",
			title: "Obnovit kreativy v prospectingu",
			insight: `CTR ${worst.ctr.toFixed(2).replace(".", ",")} % – kreativy jsou unavené.`,
			action: "Připravit 3 nová videa 9:16 s produktem v prvních 3 s.",
			recipient: "Grafik / video tvůrce",
			audience: "Interní",
			impact: "Nižší CPC"
		},
		{
			id: "m3",
			area: "meta",
			priority: "Nízká",
			title: "Dodat nové produktové fotky",
			insight: "Nejlepší výkon mají reálné fotky z prostředí.",
			action: "Nafotit 10 lifestyle fotografií nové kolekce.",
			recipient: "Klient",
			audience: "Klient",
			impact: "Lepší výkon kreativ"
		}
	];
}
var dec = (v, d = 2) => v.toFixed(d).replace(".", ",");
/** All KPI values a demo client can show, computed from deterministic demo data. */
function kpiCatalog(client, period) {
	const data = getAnalytics(client, period);
	const m = data.multiplier;
	const model = clientModel(client);
	const shopShare = model === "hybrid" ? .36 : model === "ecommerce" ? 1 : 0;
	const leads = Math.round((model === "services" ? 260 : 412) * m);
	const booked = Math.round((model === "services" ? 118 : 168) * m);
	const leadSpend = data.spend * (model === "hybrid" ? .6 : 1);
	const serviceRevenue = Math.round(data.revenue * (1 - shopShare));
	const shopRevenue = Math.round(data.revenue * shopShare);
	const shopSpend = data.spend * (model === "hybrid" ? .4 : 1);
	const inquiries = Math.round(96 * m), qualified = Math.round(38 * m), won = Math.round(9 * m);
	const totalMarketing = data.spend * 1.18;
	return {
		revenue: {
			label: "Celkové tržby",
			value: money(data.revenue),
			change: "+18,6 %",
			note: "vs. předchozí období"
		},
		spend: {
			label: "Náklady na reklamu",
			value: money(data.spend),
			change: "+5,5 %",
			note: "vs. předchozí období",
			neutral: true
		},
		roas: {
			label: "ROAS",
			value: dec(data.revenue / data.spend) + "×",
			change: "+12,4 %",
			note: "vs. předchozí období",
			accent: true
		},
		pno: {
			label: "PNO",
			value: dec(data.spend / data.revenue * 100) + " %",
			change: "−2,28 %",
			note: "vs. předchozí období",
			down: true
		},
		mer: {
			label: "MER",
			value: dec(data.revenue / totalMarketing) + "×",
			change: "+4,1 %",
			note: "Tržby / všechny náklady na marketing"
		},
		aov: {
			label: "Průměrná objednávka",
			value: money(data.revenue / data.conversions),
			change: "+5,2 %",
			note: "AOV"
		},
		returning: {
			label: "Vracející se zákazníci",
			value: model === "hybrid" ? "31,4 %" : "27,8 %",
			change: "+1,6 %",
			note: "Podíl opakovaných nákupů"
		},
		leads: {
			label: "Leady",
			value: number(leads),
			change: "+14,2 %",
			note: "Formuláře a hovory"
		},
		booked: {
			label: "Objednané konzultace",
			value: number(booked),
			change: "+9,8 %",
			note: `${dec(booked / leads * 100, 1)} % z leadů`,
			accent: true
		},
		bookingRate: {
			label: "Podíl objednaných",
			value: dec(booked / leads * 100, 1) + " %",
			change: "−1,2 %",
			note: "Objednané / leady",
			down: true
		},
		costPerBooking: {
			label: "Cena za objednávku",
			value: money(leadSpend / booked),
			change: "−6,4 %",
			note: "Náklady na konzultaci",
			down: true
		},
		responseTime: {
			label: "Doba reakce na lead",
			value: model === "services" ? "3,4 h" : "2,1 h",
			change: "+0,8 h",
			note: "Medián do prvního kontaktu",
			neutral: true
		},
		capacity: {
			label: "Obsazenost kapacity",
			value: model === "services" ? "68 %" : "74 %",
			change: "+6 %",
			note: "Termíny na 3 týdny dopředu"
		},
		serviceRevenue: {
			label: "Tržby služeb",
			value: money(serviceRevenue),
			change: "+11,3 %",
			note: "Realizované zákroky"
		},
		shopRevenue: {
			label: "Tržby e-shopu",
			value: money(shopRevenue),
			change: "+16,9 %",
			note: "Kosmetika a poukazy"
		},
		shopRoas: {
			label: "ROAS e-shopu",
			value: dec(shopRevenue / shopSpend) + "×",
			change: "+8,2 %",
			note: "Tržby e-shopu / náklady"
		},
		inquiries: {
			label: "Poptávky",
			value: number(inquiries),
			change: "+12,5 %",
			note: "Formuláře a e-maily"
		},
		qualified: {
			label: "Kvalifikované příležitosti",
			value: number(qualified),
			change: "+8,1 %",
			note: `${dec(qualified / inquiries * 100, 1)} % z poptávek`,
			accent: true
		},
		pipeline: {
			label: "Hodnota pipeline",
			value: money(qualified * 412e3),
			change: "+21,4 %",
			note: "Otevřené nabídky"
		},
		won: {
			label: "Uzavřené zakázky",
			value: number(won),
			change: "+2",
			note: `Hodnota ${money(won * 386e3)}`
		},
		cycle: {
			label: "Délka obchodního cyklu",
			value: "47 dní",
			change: "−3 dny",
			note: "Od poptávky po podpis",
			down: true
		}
	};
}
/** KPI tiles for the selected client, in the order set by its business model config. */
function getModelKpis(client, period) {
	const catalog = kpiCatalog(client, period);
	return clientConfig(client).kpis.map((code) => ({
		code,
		...catalog[code]
	}));
}
var rec = (r) => r;
function servicesRecommendations(client, period, prefix = "s") {
	const k = kpiCatalog(client, period);
	return [
		rec({
			id: `${prefix}1`,
			area: "meta",
			priority: "Vysoká",
			confidence: "Střední",
			title: "Levné leady, které se neobjednávají",
			insight: `Leadů přibylo, ale podíl objednaných je ${k.bookingRate.value}. Kampaň optimalizuje na vyplněný formulář, ne na objednávku.`,
			action: "Optimalizovat na událost „objednáno“ a do formuláře přidat otázku na termín a zákrok.",
			recipient: "Performance specialista",
			audience: "Interní",
			impact: "Méně leadů, více objednávek"
		}),
		rec({
			id: `${prefix}2`,
			area: "crm",
			priority: "Vysoká",
			confidence: "Vysoká",
			title: "Nejdřív rychlost reakce, pak rozpočet",
			insight: `Medián reakce na lead je ${k.responseTime.value}. Leady, kterým se nikdo neozve do 2 hodin, se objednávají výrazně méně.`,
			action: "Nastavit upozornění pro recepci a pravidlo zavolat do 1 hodiny v pracovní době. Rozpočet zatím nenavyšovat.",
			recipient: "Vedoucí recepce klienta",
			audience: "Klient",
			impact: "Vyšší podíl objednaných bez dalších nákladů"
		}),
		rec({
			id: `${prefix}3`,
			area: "google",
			priority: "Střední",
			confidence: "Střední",
			title: "Volné termíny na 2 týdny dopředu",
			insight: `Obsazenost je ${k.capacity.value}. Volné termíny jsou hlavně v úterý a středu dopoledne.`,
			action: "Vyhledávací kampaň na nejžádanější službu a SMS vychladlým leadům s nabídkou konkrétních termínů.",
			recipient: "PPC specialista",
			audience: "Interní",
			impact: "Doplnění volných termínů"
		}),
		rec({
			id: `${prefix}4`,
			area: "crm",
			priority: "Střední",
			confidence: "Vysoká",
			title: "Připomenout opakovanou službu",
			insight: "Část klientů má podle intervalu služby nárok na další termín v příštích 14 dnech.",
			action: "Automatický e-mail a SMS s odkazem na rezervaci 14 dní před doporučeným termínem.",
			recipient: "CRM specialista",
			audience: "Interní",
			impact: "Opakované objednávky bez reklamy"
		}),
		rec({
			id: `${prefix}5`,
			area: "keywords",
			priority: "Nízká",
			confidence: "Nízká",
			title: "Stránky služeb pro dotazy s cenou",
			insight: "Lidé hledají služby spolu se slovem „cena“. Web na tyto dotazy nemá samostatné stránky.",
			action: "Doplnit ke každé hlavní službě stránku s orientační cenou, průběhem a FAQ.",
			recipient: "SEO specialista",
			audience: "Interní",
			impact: "Více organických poptávek"
		})
	];
}
function b2bRecommendations(client, period) {
	const k = kpiCatalog(client, period);
	return [
		rec({
			id: "b1",
			area: "meta",
			priority: "Vysoká",
			confidence: "Střední",
			title: "Poptávky bez kvalifikace",
			insight: `Kvalifikovaných je jen ${k.qualified.note}. Formulář propouští malé a nerelevantní zakázky.`,
			action: "Přidat do formuláře rozsah projektu a termín realizace, nekvalifikované poptávky vyřazovat z optimalizace.",
			recipient: "Performance specialista",
			audience: "Interní",
			impact: "Vyšší podíl kvalifikovaných poptávek"
		}),
		rec({
			id: "b2",
			area: "google",
			priority: "Střední",
			confidence: "Střední",
			title: "Dlouhý obchodní cyklus",
			insight: `Od poptávky po podpis uplyne ${k.cycle.value}. Rozhodovatelé mezitím porovnávají dodavatele.`,
			action: "Remarketing s referencemi a případovými studiemi pro firmy, které poslaly poptávku za posledních 60 dní.",
			recipient: "PPC specialista",
			audience: "Interní",
			impact: "Kratší cyklus, vyšší konverze nabídek"
		}),
		rec({
			id: "b3",
			area: "crm",
			priority: "Vysoká",
			confidence: "Nízká",
			title: "Kanál s poptávkami bez zakázek",
			insight: "Jeden kanál přináší hodně poptávek, ale v CRM u něj není žádná uzavřená zakázka. Může jít i o chybějící zdroj v CRM.",
			action: "Nejdřív ověřit, že obchodníci vyplňují zdroj poptávky. Pak teprve rozhodnout o rozpočtu kanálu.",
			recipient: "Obchodní ředitel klienta",
			audience: "Klient",
			impact: "Spolehlivé rozhodování o rozpočtu"
		})
	];
}
/** Recommendation scenarios differ by business model; e-commerce keeps the original set. */
function getRecommendations(client, period) {
	const model = clientModel(client);
	if (model === "services") return servicesRecommendations(client, period);
	if (model === "b2b") return b2bRecommendations(client, period);
	const shop = ecommerceRecommendations(client, period).map((r) => ({
		...r,
		confidence: r.confidence ?? (r.priority === "Vysoká" ? "Vysoká" : "Střední")
	}));
	if (model === "hybrid") return [
		...servicesRecommendations(client, period, "h").slice(0, 4),
		...shop.filter((r) => [
			"g2",
			"g3",
			"m2"
		].includes(r.id)),
		rec({
			id: "h9",
			area: "crm",
			priority: "Střední",
			confidence: "Střední",
			title: "Cross-sell kosmetiky klientům služeb",
			insight: "Většina klientů po zákroku v e-shopu nenakoupila doporučenou domácí péči.",
			action: "E-mail 3 dny po zákroku s péčí doporučenou k danému zákroku.",
			recipient: "CRM specialista",
			audience: "Interní",
			impact: "Vyšší tržby e-shopu a LTV klienta"
		})
	];
	const k = kpiCatalog(client, period);
	return [
		...shop,
		rec({
			id: "e1",
			area: "google",
			priority: "Střední",
			confidence: "Střední",
			title: "Hlídat MER, ne jen ROAS v reklamách",
			insight: `MER je ${k.mer.value}, zatímco ROAS v reklamních systémech ${k.roas.value}. Kanály si část tržeb připisují dvakrát.`,
			action: "O celkovém rozpočtu rozhodovat podle MER, o jednotlivých kanálech podle trendu.",
			recipient: "Andrea",
			audience: "Interní",
			impact: "Rozpočet podle skutečné návratnosti"
		}),
		rec({
			id: "e2",
			area: "crm",
			priority: "Střední",
			confidence: "Vysoká",
			title: "E-mail po prvním nákupu",
			insight: `Vracející se zákazníci tvoří ${k.returning.value}. Po prvním nákupu nepřichází žádná automatizace.`,
			action: "Série 3 e-mailů po prvním nákupu: péče o produkt, doporučení, sleva na druhý nákup.",
			recipient: "CRM specialista",
			audience: "Interní",
			impact: "Vyšší podíl opakovaných nákupů"
		}),
		rec({
			id: "e3",
			area: "meta",
			priority: "Nízká",
			confidence: "Střední",
			title: "Připravit Black Friday a Vánoce",
			insight: "Za 5 týdnů začíná nejsilnější sezóna roku a kreativy na ni zatím nejsou.",
			action: "Do 2 týdnů připravit kreativy a publika, rozpočet navyšovat postupně od začátku listopadu.",
			recipient: "Performance specialista",
			audience: "Interní",
			impact: "Plynulý náběh sezóny"
		})
	];
}
var WorkspaceContext = (0, import_react.createContext)({
	client: 0,
	period: "30",
	setClient: () => {},
	setPeriod: () => {},
	reco: {
		keywords: true,
		google: true,
		meta: true,
		crm: true
	},
	toggleReco: () => {}
});
var useWorkspace = () => (0, import_react.useContext)(WorkspaceContext);
var navigation = [
	{
		to: "/klienti",
		name: "Klienti",
		icon: Users
	},
	{
		to: "/",
		name: "Přehled",
		icon: LayoutGrid
	},
	{
		to: "/organika",
		name: "Organika & automatizace",
		icon: Sprout
	},
	{
		to: "/web",
		name: "Výkon webu",
		icon: Earth
	},
	{
		to: "/kampane",
		name: "Výkon kampaní",
		icon: Megaphone
	},
	{
		to: "/reporty",
		name: "Reporty",
		icon: FileChartColumn
	}
];
function Workspace({ children }) {
	const [client, setClient] = (0, import_react.useState)(0);
	const [period, setPeriod] = (0, import_react.useState)("30");
	const [reco, setReco] = (0, import_react.useState)({
		keywords: true,
		google: true,
		meta: true,
		crm: true
	});
	const toggleReco = (a) => setReco((r) => ({
		...r,
		[a]: !r[a]
	}));
	const [collapsed, setCollapsed] = (0, import_react.useState)(false);
	const [mobileOpen, setMobileOpen] = (0, import_react.useState)(false);
	const [notice, setNotice] = (0, import_react.useState)(false);
	const path = useRouterState({ select: (state) => state.location.pathname });
	const current = navigation.find((item) => item.to === path)?.name ?? (path === "/profil" ? "Uživatelský profil" : "Nastavení");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkspaceContext.Provider, {
		value: {
			client,
			period,
			setClient,
			setPeriod,
			reco,
			toggleReco
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `workspace ${collapsed ? "sidebar-collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`,
			children: [
				mobileOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "sidebar-scrim",
					onClick: () => setMobileOpen(false)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "workspace-sidebar",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "brand",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "brand-mark",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Command, { size: 22 })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "sidebar-label",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "AVQIX" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Marketing Intelligence" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									className: "mobile-close",
									variant: "ghost",
									size: "icon",
									"aria-label": "Zavřít navigaci",
									onClick: () => setMobileOpen(false),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "client-select",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "client-monogram",
									children: demoClients[client]?.monogram
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "sidebar-label",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "PRACOVNÍ PROSTOR" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										"aria-label": "Vybrat klienta",
										value: client,
										onChange: (e) => setClient(Number(e.target.value)),
										children: clients.map((name, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: i,
											children: name
										}, name))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, {
									className: "sidebar-label",
									size: 15
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "sidebar-nav-label sidebar-label",
							children: "WORKSPACE"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
							"aria-label": "Hlavní navigace",
							children: navigation.filter((item) => !clientConfig(client).hiddenSections.includes(item.to)).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								variant: "ghost",
								className: `nav-item ${path === item.to ? "active" : ""}`,
								title: item.name,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: item.to,
									onClick: () => setMobileOpen(false),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { size: 18 }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "sidebar-label",
											children: item.name
										}),
										path === item.to && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "nav-dot sidebar-label" })
									]
								})
							}, item.to))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "sidebar-bottom",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "workspace-note sidebar-label",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "status-dot" }),
										" Ukázkový pracovní prostor",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: clientConfig(client).label })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									variant: "ghost",
									className: `nav-item ${path === "/nastaveni" ? "active" : ""}`,
									title: "Nastavení",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/nastaveni",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings2, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "sidebar-label",
											children: "Nastavení"
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "ghost",
									className: "nav-item collapse-control",
									onClick: () => setCollapsed(!collapsed),
									title: collapsed ? "Rozbalit navigaci" : "Sbalit navigaci",
									"aria-label": collapsed ? "Rozbalit navigaci" : "Sbalit navigaci",
									children: [collapsed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelLeftOpen, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelLeftClose, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "sidebar-label",
										children: "Sbalit menu"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									variant: "ghost",
									className: "profile-button",
									title: "Uživatelský profil",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/profil",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "avatar",
												children: "AV"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "sidebar-label",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Andrea Varmužová" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Marketing manager" })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, {
												className: "sidebar-label",
												size: 15
											})
										]
									})
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "workspace-main",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
							className: "topbar",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "icon",
										className: "mobile-menu",
										"aria-label": "Otevřít navigaci",
										onClick: () => setMobileOpen(true),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, {})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Workspace"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "/"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: current })
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "topbar-right",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "demo-label",
										children: "Demo data"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											variant: "ghost",
											size: "icon",
											"aria-label": "Oznámení",
											onClick: () => setNotice(!notice),
											className: "notification-button",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {})]
										}), notice && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "notice-popover",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Oznámení" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { size: 16 }), " Ukázková data jsou připravena."] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Žádné externí účty nejsou připojené." })
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										asChild: true,
										variant: "ghost",
										size: "icon",
										title: "Zdroje dat",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/nastaveni",
											"aria-label": "Zdroje dat",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleQuestionMark, {})
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "avatar avatar-small",
										children: "AV"
									})
								]
							})]
						}),
						children,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
							className: "workspace-footer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"AVQIX ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "footer-divider",
									children: "/"
								}),
								" Marketing Intelligence"
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Ukázková data · září 2026 ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { size: 12 })] })]
						})
					]
				})
			]
		})
	});
}
//#endregion
export { downloadCsv as a, getModelKpis as c, money as d, number as f, useWorkspace as h, demoClients as i, getRecommendations as l, recoAreas as m, Workspace as n, getAnalytics as o, pageHead as p, clients as r, getKeywords as s, Button as t, modelLabels as u };
