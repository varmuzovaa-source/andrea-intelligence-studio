import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as Link, x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { A as ChevronLeft, C as Earth, E as Columns3, F as ArrowUpRight, I as ArrowDownUp, L as ArrowDownRight, M as Check, N as CalendarDays, O as CircleAlert, S as EyeOff, _ as Lightbulb, a as SlidersHorizontal, b as Image, c as Send, g as Link2, h as Mail, i as Sparkles, j as ChevronDown, k as ChevronRight, l as Search, n as Users, o as ShieldCheck, t as X, u as RefreshCw, w as Download, x as FileChartColumn, y as Info } from "../_libs/lucide-react.mjs";
import { a as downloadCsv, c as getModelKpis, d as money, f as number, h as useWorkspace, i as demoClients, l as getRecommendations, m as recoAreas, o as getAnalytics, r as clients, s as getKeywords, t as Button, u as modelLabels } from "./workspace-0cCCNp4b.mjs";
import { a as Area, c as ResponsiveContainer, i as XAxis, l as Tooltip, n as LineChart, o as Line, r as YAxis, s as CartesianGrid, t as ComposedChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pages-B4NgfI8o.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PageHeader({ title, description }) {
	const { client, period, setPeriod } = useWorkspace();
	const [syncing, setSyncing] = (0, import_react.useState)(false);
	const [syncTime, setSyncTime] = (0, import_react.useState)("09:12");
	const exportAll = () => {
		const data = getAnalytics(client, period);
		downloadCsv("avqix-marketing-prehled.csv", [
			"Klient",
			"Období (dní)",
			"Tržby (Kč)",
			"Náklady (Kč)",
			"Konverze",
			"ROAS"
		], [[
			clients[client] ?? clients[0],
			period,
			data.revenue,
			data.spend,
			data.conversions,
			(data.revenue / data.spend).toFixed(2)
		]]);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "page-heading",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "eyebrow",
				children: ["MARKETING INTELLIGENCE ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "demo-label",
					children: "Demo data"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", { children: [title, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "heading-dot",
				children: "."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: description })
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "page-actions",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "period-select",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { size: 16 }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						"aria-label": "Období",
						value: period,
						onChange: (e) => setPeriod(e.target.value),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "7",
								children: "24.–30. září 2026"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "30",
								children: "1.–30. září 2026"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "90",
								children: "1. července–30. září 2026"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { size: 14 })
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				onClick: exportAll,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {}), " Exportovat"]
			})]
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "context-line",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "status-dot" }),
			clients[client],
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "context-divider" }),
			"Srovnání s předchozím obdobím"
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			variant: "ghost",
			size: "sm",
			disabled: syncing,
			onClick: () => {
				setSyncing(true);
				setTimeout(() => {
					setSyncing(false);
					setSyncTime((/* @__PURE__ */ new Date()).toLocaleTimeString("cs-CZ", {
						hour: "2-digit",
						minute: "2-digit"
					}));
				}, 700);
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: syncing ? "animate-spin" : "" }), syncing ? "Obnovuji ukázku…" : `Ukázka obnovena v ${syncTime}`]
		})]
	})] });
}
function SectionHeading({ title, subtitle, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "section-heading",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: title }), subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: subtitle })] }), action]
	});
}
function Metrics({ mode = "overview" }) {
	const { client, period } = useWorkspace();
	const data = getAnalytics(client, period);
	const items = mode === "organic" ? [
		{
			label: "Organická návštěvnost",
			value: number(data.visits * .38),
			change: "+18,6 %",
			note: "Google Search Console"
		},
		{
			label: "Pozice klíčových slov",
			value: "12,4",
			change: "−3,2",
			note: "Průměrná pozice",
			down: true
		},
		{
			label: "Tržby z automatizací",
			value: money(data.revenue * .12),
			change: "+24,8 %",
			note: "E-mailové automatizace",
			accent: true
		},
		{
			label: "Míra otevření",
			value: "42,8 %",
			change: "+6,2 %",
			note: "E-mail marketing"
		}
	] : mode === "web" ? [
		{
			label: "Návštěvy webu",
			value: number(data.visits),
			change: "+16,8 %",
			note: "Google Analytics 4"
		},
		{
			label: "Konverzní poměr",
			value: "2,66 %",
			change: "+0,32 %",
			note: "Nákupy / návštěvy",
			accent: true
		},
		{
			label: "Celkové konverze",
			value: number(data.conversions),
			change: "+18,6 %",
			note: "Google Analytics 4"
		},
		{
			label: "Průměrná objednávka",
			value: money(data.revenue / data.conversions),
			change: "+5,2 %",
			note: "Hodnota objednávky"
		}
	] : getModelKpis(client, period);
	const tiles = items.slice(0, 4), extra = items.slice(4);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "metrics-grid",
		children: tiles.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
			className: `metric-card ${item.accent ? "metric-accent" : ""}`,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "metric-label",
					children: [item.label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						title: item.label === "ROAS" ? "Tržby dělené náklady na reklamu" : item.label === "PNO" ? "Podíl nákladů na obratu" : item.note,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { size: 14 })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "metric-value",
					children: item.value
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "metric-bottom",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: `metric-change ${"neutral" in item && item.neutral ? "neutral" : ""}`,
						children: [
							item.down ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDownRight, { size: 14 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { size: 14 }),
							" ",
							item.change
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: item.note })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "sparkline",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LineChart, {
								data: data.chart.slice(-12),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
									isAnimationActive: false,
									type: "monotone",
									dataKey: i === 1 ? "spend" : "revenue",
									stroke: item.accent ? "var(--foreground)" : "var(--spark)",
									strokeWidth: 1.8,
									dot: false
								})
							})
						})
					})]
				})
			]
		}, item.label))
	}), extra.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
		className: "metrics-extra",
		children: extra.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: item.label }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
				className: "tabular-nums",
				children: item.value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
				item.change,
				" · ",
				item.note
			] })
		] }, item.label))
	})] });
}
function PerformanceChart({ organic = false, web = false }) {
	const { client, period } = useWorkspace();
	const data = getAnalytics(client, period);
	const [metric, setMetric] = (0, import_react.useState)("revenue");
	const [compare, setCompare] = (0, import_react.useState)(true);
	const countMode = organic || web;
	const chartData = countMode ? data.chart.map((day) => ({
		...day,
		revenue: Math.round(day.revenue / data.revenue * data.visits * (organic ? .38 : 1)),
		spend: Math.round(day.spend / data.spend * data.conversions * (organic ? .38 : 1)),
		previous: Math.round(day.previous / data.revenue * (metric === "revenue" ? data.visits : data.conversions) * (organic ? .38 : 1))
	})) : data.chart.map((day) => ({
		...day,
		previous: metric === "spend" ? Math.round(day.spend / 1.055) : day.previous
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "chart-panel",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
				title: organic ? "Organická návštěvnost" : web ? "Návštěvnost & konverze" : "Vývoj výkonu",
				subtitle: organic ? "Návštěvy z neplaceného vyhledávání" : "Každý den o krok blíž k lepším výsledkům.",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "segmented",
					children: ["revenue", "spend"].map((value) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "sm",
						className: metric === value ? "selected" : "",
						onClick: () => setMetric(value),
						children: value === "revenue" ? organic || web ? "Návštěvy" : "Tržby" : organic || web ? "Konverze" : "Náklady"
					}, value))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "chart-summary",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: organic || web ? number((metric === "revenue" ? data.visits : data.conversions) * (organic ? .38 : 1)) : money(metric === "revenue" ? data.revenue : data.spend) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "positive",
						children: "↗ +18,6 %"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "chart-legend",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "legend-lime" }), "Aktuální období"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: compare,
								onChange: (e) => setCompare(e.target.checked)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "legend-gray" }),
							"Předchozí období"
						] })]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "performance-chart",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ComposedChart, {
						data: chartData,
						margin: {
							top: 15,
							right: 12,
							bottom: 0,
							left: -22
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								stroke: "var(--border)",
								vertical: false,
								strokeDasharray: "3 5"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "date",
								tick: {
									fill: "var(--muted-foreground)",
									fontSize: 11
								},
								axisLine: false,
								tickLine: false,
								minTickGap: 45,
								dy: 10
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								tick: {
									fill: "var(--muted-foreground)",
									fontSize: 11
								},
								axisLine: false,
								tickLine: false,
								tickFormatter: (v) => v >= 1e3 ? `${Math.round(v / 1e3)} tis.` : number(v)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
								contentStyle: {
									background: "var(--card)",
									border: "1px solid var(--border)",
									borderRadius: 6,
									fontSize: 12
								},
								formatter: (value) => organic || web ? number(value) : money(value),
								labelStyle: { color: "var(--foreground)" }
							}),
							compare && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								name: "Předchozí období",
								type: "monotone",
								dataKey: "previous",
								stroke: "var(--chart-gray)",
								strokeDasharray: "5 5",
								strokeWidth: 1.5,
								dot: false,
								isAnimationActive: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
								name: metric === "revenue" ? countMode ? "Návštěvy" : "Aktuální tržby" : countMode ? "Konverze" : "Náklady",
								type: "monotone",
								dataKey: metric,
								stroke: "var(--chart-lime)",
								fill: "var(--chart-lime)",
								fillOpacity: .07,
								strokeWidth: 2.5,
								isAnimationActive: false
							})
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "chart-footnote",
				children: [
					"Zdroj: ",
					organic ? "Google Search Console" : web ? "Google Analytics 4" : "Meta Ads, Google Ads, Google Analytics 4",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Ukázková data" })
				]
			})
		]
	});
}
function ChannelChart() {
	const { client, period } = useWorkspace();
	const data = getAnalytics(client, period);
	const channels = [
		{
			name: "Meta Ads",
			amount: data.revenue * .48,
			percent: 48,
			style: "channel-lime",
			symbol: "∞"
		},
		{
			name: "Google Ads",
			amount: data.revenue * .34,
			percent: 34,
			style: "channel-dark",
			symbol: "G"
		},
		{
			name: "Organické vyhledávání",
			amount: data.revenue * .12,
			percent: 12,
			style: "channel-sage",
			symbol: "↗"
		},
		{
			name: "E-mail & ostatní",
			amount: data.revenue * .06,
			percent: 6,
			style: "channel-gray",
			symbol: "@"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "channel-panel",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
				title: "Tržby podle kanálu",
				subtitle: "Kde vzniká vaše hodnota"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "channel-total",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "CELKOVÉ TRŽBY" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: money(data.revenue) })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "channel-stacked",
				children: channels.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: c.style,
					style: { flex: c.percent },
					title: `${c.name}: ${c.percent} %`
				}, c.name))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "channel-list",
				children: channels.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "channel-row",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `channel-symbol ${c.style}`,
							children: c.symbol
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: c.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [c.percent, " % z celkových tržeb"] })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: money(c.amount) })
					]
				}, c.name))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "chart-footnote",
				children: "Atribuce: poslední kliknutí"
			})
		]
	});
}
function Funnel() {
	const { client, period } = useWorkspace();
	const data = getAnalytics(client, period);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "channel-panel",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
				title: "Konverzní cesta",
				subtitle: "Od první návštěvy k objednávce"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "funnel",
				children: [
					{
						label: "Návštěvy",
						value: data.visits,
						width: 100
					},
					{
						label: "Zobrazení produktu",
						value: data.visits * .62,
						width: 80
					},
					{
						label: "Přidání do košíku",
						value: data.visits * .12,
						width: 58
					},
					{
						label: "Zahájení objednávky",
						value: data.visits * .06,
						width: 40
					},
					{
						label: "Nákup",
						value: data.conversions,
						width: 25
					}
				].map((step, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-between text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: step.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: number(step.value) })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `funnel-bar ${i === 4 ? "final" : ""}`,
					style: { width: `${step.width}%` }
				})] }, step.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "chart-footnote",
				children: "Zdroj: Google Analytics 4 · ukázka"
			})
		]
	});
}
var columnDefs = [
	{
		key: "spend",
		label: "Náklady"
	},
	{
		key: "revenue",
		label: "Tržby"
	},
	{
		key: "conversions",
		label: "Konverze"
	},
	{
		key: "ctr",
		label: "CTR"
	},
	{
		key: "roas",
		label: "ROAS"
	}
];
function CampaignTable({ compact = false }) {
	const { client, period } = useWorkspace();
	const { rows } = getAnalytics(client, period);
	const [query, setQuery] = (0, import_react.useState)("");
	const [source, setSource] = (0, import_react.useState)("Všechny kanály");
	const [status, setStatus] = (0, import_react.useState)("Všechny stavy");
	const [showFilters, setShowFilters] = (0, import_react.useState)(false);
	const [showColumns, setShowColumns] = (0, import_react.useState)(false);
	const [columns, setColumns] = (0, import_react.useState)(columnDefs.map((c) => c.key));
	const [sort, setSort] = (0, import_react.useState)("spend");
	const [asc, setAsc] = (0, import_react.useState)(false);
	const [page, setPage] = (0, import_react.useState)(0);
	const filtered = (0, import_react.useMemo)(() => rows.filter((r) => r.name.toLowerCase().includes(query.toLowerCase()) && (source === "Všechny kanály" || r.source === source) && (status === "Všechny stavy" || r.status === status)).sort((a, b) => {
		const first = a[sort], second = b[sort];
		return (typeof first === "number" && typeof second === "number" ? first - second : String(first).localeCompare(String(second))) * (asc ? 1 : -1);
	}), [
		rows,
		query,
		source,
		status,
		sort,
		asc
	]);
	const pages = Math.max(1, Math.ceil(filtered.length / 5));
	const currentPage = Math.min(page, pages - 1);
	const displayed = filtered.slice(currentPage * 5, currentPage * 5 + 5);
	const changeSort = (key) => {
		if (sort === key) setAsc(!asc);
		else {
			setSort(key);
			setAsc(false);
		}
	};
	const format = (row, key) => key === "spend" || key === "revenue" ? money(row[key]) : key === "conversions" ? number(row[key]) : row[key].toFixed(2).replace(".", ",") + (key === "roas" ? "×" : " %");
	const exportRows = () => downloadCsv("andrea-kampane.csv", [
		"Kampaň",
		"Kanál",
		...columnDefs.filter((c) => columns.includes(c.key)).map((c) => c.label)
	], filtered.map((r) => [
		r.name,
		r.source,
		...columnDefs.filter((c) => columns.includes(c.key)).map((c) => r[c.key])
	]));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "table-section",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
				title: compact ? "Nejvýkonnější kampaně" : "Přehled kampaní",
				subtitle: compact ? "Výsledky, které stojí za pozornost" : "Všechny kampaně na jednom místě",
				action: compact ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "ghost",
					size: "sm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/kampane",
						children: ["Všechny kampaně", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, {})]
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					size: "sm",
					onClick: exportRows,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {}), "Export CSV"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "table-toolbar",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "search-input",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { size: 16 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						"aria-label": "Hledat kampaně",
						placeholder: "Hledat kampaň…",
						value: query,
						onChange: (e) => {
							setQuery(e.target.value);
							setPage(0);
						}
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							className: "toolbar-select",
							"aria-label": "Kanál kampaní",
							value: source,
							onChange: (e) => {
								setSource(e.target.value);
								setPage(0);
							},
							children: [
								"Všechny kanály",
								"Meta Ads",
								"Google Ads",
								"E-mail"
							].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: s }, s))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							"aria-expanded": showFilters,
							onClick: () => setShowFilters(!showFilters),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, {}), "Filtry"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "icon",
								"aria-label": "Viditelnost sloupců",
								onClick: () => setShowColumns(!showColumns),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Columns3, {})
							}), showColumns && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "columns-menu",
								children: columnDefs.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: columns.includes(c.key),
									onChange: () => setColumns(columns.includes(c.key) ? columns.filter((k) => k !== c.key) : [...columns, c.key])
								}), c.label] }, c.key))
							})]
						})
					]
				})]
			}),
			showFilters && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "filter-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Stav kampaně ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					"aria-label": "Stav kampaně",
					value: status,
					onChange: (e) => {
						setStatus(e.target.value);
						setPage(0);
					},
					children: [
						"Všechny stavy",
						"Aktivní",
						"Pozastavená"
					].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: s }, s))
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "sm",
					onClick: () => {
						setSource("Všechny kanály");
						setStatus("Všechny stavy");
						setQuery("");
					},
					children: "Vymazat filtry"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "table-scroll",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "ghost",
						size: "sm",
						onClick: () => changeSort("name"),
						children: ["Kampaň", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDownUp, { size: 12 })]
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Stav" }),
					columnDefs.filter((c) => columns.includes(c.key)).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "numeric",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "ghost",
							size: "sm",
							onClick: () => changeSort(c.key),
							children: [c.label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDownUp, { size: 12 })]
						})
					}, c.key))
				] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: displayed.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "campaign-name",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `source-icon ${row.source === "Meta Ads" ? "meta" : ""}`,
							children: row.source === "Meta Ads" ? "∞" : row.source === "E-mail" ? "@" : "G"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: row.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: row.source })] })]
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: `table-status ${row.status === "Aktivní" ? "live" : ""}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}), row.status]
					}) }),
					columnDefs.filter((c) => columns.includes(c.key)).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: `numeric ${c.key === "roas" ? "roas-cell" : ""}`,
						children: format(row, c.key)
					}, c.key))
				] }, row.id)) })] }), !displayed.length && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "empty-state",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { size: 24 }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Žádné odpovídající kampaně" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Zkuste jiný název nebo kanál." })
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "table-pagination",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					filtered.length ? currentPage * 5 + 1 : 0,
					"–",
					Math.min((currentPage + 1) * 5, filtered.length),
					" z ",
					filtered.length,
					" kampaní"
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"Strana ",
						currentPage + 1,
						" z ",
						pages
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "icon",
						"aria-label": "Předchozí strana",
						disabled: currentPage === 0,
						onClick: () => setPage(currentPage - 1),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "icon",
						"aria-label": "Další strana",
						disabled: currentPage === pages - 1,
						onClick: () => setPage(currentPage + 1),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {})
					})
				] })]
			})
		]
	});
}
function Creatives({ full = false }) {
	const { client, period } = useWorkspace();
	const { rows } = getAnalytics(client, period);
	const [sort, setSort] = (0, import_react.useState)("roas");
	const [selected, setSelected] = (0, import_react.useState)([]);
	const [comparing, setComparing] = (0, import_react.useState)(false);
	const creatives = rows.filter((r) => r.source === "Meta Ads").sort((a, b) => sort === "ctr" ? b.ctr - a.ctr : sort === "spend" ? b.spend - a.spend : b.roas - a.roas);
	const shown = comparing ? creatives.filter((r) => selected.includes(r.id)) : creatives.slice(0, full ? 4 : 3);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "creative-section",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
			title: "Kreativy, které fungují",
			subtitle: "Nejlepší vizuály. Měřitelné výsledky.",
			action: full ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					"aria-label": "Řazení kreativ",
					className: "toolbar-select",
					value: sort,
					onChange: (e) => setSort(e.target.value),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "roas",
							children: "Nejvyšší ROAS"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "ctr",
							children: "Nejvyšší CTR"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "spend",
							children: "Nejvyšší náklady"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					size: "sm",
					disabled: selected.length < 2 && !comparing,
					onClick: () => setComparing(!comparing),
					children: [comparing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, {}), comparing ? "Zrušit porovnání" : `Porovnat (${selected.length})`]
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				variant: "ghost",
				size: "sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/kampane",
					children: ["Zobrazit kreativy", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, {})]
				})
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `creative-grid ${full ? "full" : ""}`,
			children: shown.map((row, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "creative-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "creative-image",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: row.image,
							alt: `Reklamní kreativa – ${row.name}`,
							loading: "lazy",
							width: 768,
							height: 768
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "creative-format",
							children: "Obrázek · 1:1"
						}),
						full ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: selected.includes(row.id) ? "default" : "secondary",
							size: "icon",
							className: "creative-select",
							"aria-label": `Vybrat ${row.name}`,
							onClick: () => setSelected(selected.includes(row.id) ? selected.filter((id) => id !== row.id) : [...selected, row.id]),
							children: selected.includes(row.id) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "select-square" })
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "creative-rank",
							children: ["0", index + 1]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "creative-info",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "creative-title",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: row.name.split(" · ")[0] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "↗" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: ["Meta Ads · ", row.name] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "creative-metrics",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "ROAS" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [row.roas.toFixed(2).replace(".", ","), "×"] })] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "CTR" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [row.ctr.toFixed(2).replace(".", ","), " %"] })] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Náklady" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: money(row.spend) })] })
							]
						}),
						full && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "creative-extra",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["CPC ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: money(row.cpc) })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["CPL ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: money(row.cpl) })] })]
						})
					]
				})]
			}, row.id))
		})]
	});
}
function RecoToggles() {
	const { reco, toggleReco } = useWorkspace();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "reco-toggles",
		role: "group",
		"aria-label": "Kde zobrazit doporučení",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Zobrazit doporučení:" }), recoAreas.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			size: "sm",
			variant: "outline",
			"aria-pressed": reco[a.id],
			className: reco[a.id] ? "active" : "",
			onClick: () => toggleReco(a.id),
			children: [reco[a.id] && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {}), a.name]
		}, a.id))]
	});
}
function Recommendations({ areas, title = "Doporučení" }) {
	const { client, period, reco, toggleReco } = useWorkspace();
	const [sent, setSent] = (0, import_react.useState)([]);
	const visible = areas.filter((a) => reco[a]);
	const items = getRecommendations(client, period).filter((r) => visible.includes(r.area));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "reco-section",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
				title,
				subtitle: "Automatická analýza ukázkových dat · komu co předat",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecoToggles, {})
			}),
			items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "info-banner",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { size: 18 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Doporučení jsou pro tuto sekci skrytá. Zapněte je tlačítky výše." })]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "reco-grid",
				children: items.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "reco-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "reco-top",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `reco-priority p-${r.priority === "Vysoká" ? "high" : r.priority === "Střední" ? "mid" : "low"}`,
								children: r.priority
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [recoAreas.find((a) => a.id === r.area)?.name, r.confidence ? ` · jistota ${r.confidence.toLowerCase()}` : ""] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lightbulb, { size: 15 }), r.title] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: r.insight }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "reco-action",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Co udělat:" }),
								" ",
								r.action
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "reco-foot",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "PŘEDAT" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: r.recipient }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "reco-audience",
									children: [
										r.audience === "Klient" ? "Pro klienta" : "Interní tým",
										" · ",
										r.impact
									]
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: sent.includes(r.id) ? "ghost" : "outline",
								disabled: sent.includes(r.id),
								onClick: () => setSent([...sent, r.id]),
								children: sent.includes(r.id) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {}), "Předáno"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, {}), "Předat"] })
							})]
						})
					]
				}, r.id))
			}),
			areas.length === 1 && reco[areas[0]] && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "ghost",
				size: "sm",
				className: "reco-hide",
				onClick: () => toggleReco(areas[0]),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, {}), "Skrýt zde"]
			})
		]
	});
}
function OverviewPage() {
	const { client } = useWorkspace();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "page-content",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Přehled výkonu",
				description: "Váš marketing v souvislostech. Všechno důležité na jednom místě."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metrics, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "insight-strip",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "insight-icon",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { size: 17 })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Za čísly je příležitost." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						clients[client],
						": remarketing dosahuje ROAS ",
						(6.18 + client * .12).toFixed(2).replace(".", ","),
						"×. Zvažte přesun části rozpočtu z prospectingu."
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "ghost",
						size: "sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/kampane",
							children: ["Prozkoumat", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, {})]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "charts-grid",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PerformanceChart, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChannelChart, {})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CampaignTable, { compact: true }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Recommendations, {
				areas: [
					"keywords",
					"google",
					"meta",
					"crm"
				],
				title: "Doporučení napříč kanály"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Creatives, {})
		]
	});
}
function OrganicPage() {
	const { client, period } = useWorkspace();
	const data = getAnalytics(client, period);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "page-content",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Organika & automatizace",
				description: "Dlouhodobý růst, který nestojí na reklamním rozpočtu."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metrics, { mode: "organic" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "charts-grid",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PerformanceChart, { organic: true }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "channel-panel",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
							title: "E-mailové automatizace",
							subtitle: "Výkon jednotlivých scénářů"
						}),
						[
							"Uvítací série",
							"Opuštěný košík",
							"Po nákupu",
							"Reaktivace zákazníků"
						].map((name, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "automation-row",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "automation-icon",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { size: 18 })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: name }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [number((480 - i * 84) * data.multiplier), " doručených e-mailů"] })] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: money(data.revenue * (.05 - i * .009)) })
							]
						}, name)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "chart-footnote",
							children: "Zdroj: ukázkový e-mail marketing"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "table-section",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
					title: "Analýza klíčových slov",
					subtitle: "Viditelnost, záměr hledání a potenciál růstu"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "table-scroll",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Klíčové slovo" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Záměr" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "numeric",
							children: "Kliknutí"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "numeric",
							children: "Zobrazení"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "numeric",
							children: "CTR"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "numeric",
							children: "Pozice"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "numeric",
							children: "Obtížnost"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Potenciál" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "numeric",
							children: "Změna"
						})
					] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: getKeywords(client, period).map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: k.word }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: k.intent }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "numeric",
							children: number(k.clicks)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "numeric",
							children: number(k.impressions)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "numeric",
							children: [k.ctr.toFixed(1).replace(".", ","), " %"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "numeric",
							children: k.position.toFixed(1).replace(".", ",")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "numeric",
							children: [k.difficulty, "/100"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "opportunity",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { style: { width: `${k.opportunity}%` } }) }), k.opportunity]
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "numeric positive",
							children: ["↗ ", k.change]
						})
					] }, k.word)) })] })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Recommendations, {
				areas: ["keywords"],
				title: "Doporučení ke klíčovým slovům"
			})
		]
	});
}
function WebPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "page-content",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Výkon webu",
				description: "Pochopte návštěvníky. Proměňte návštěvy v zákazníky."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metrics, { mode: "web" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "charts-grid",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PerformanceChart, { web: true }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, {})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CampaignTable, { compact: true })
		]
	});
}
function CampaignsPage() {
	const [tab, setTab] = (0, import_react.useState)("campaigns");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "page-content",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Výkon kampaní",
				description: "Od investice k výsledku. Každá kampaň pod kontrolou."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metrics, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "page-tabs",
				role: "tablist",
				"aria-label": "Pohled na kampaně",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					role: "tab",
					"aria-selected": tab === "campaigns",
					variant: "ghost",
					className: tab === "campaigns" ? "active" : "",
					onClick: () => setTab("campaigns"),
					children: "Kampaně"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					role: "tab",
					"aria-selected": tab === "creatives",
					variant: "ghost",
					className: tab === "creatives" ? "active" : "",
					onClick: () => setTab("creatives"),
					children: "Kreativní výkon"
				})]
			}),
			tab === "campaigns" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CampaignTable, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Recommendations, {
					areas: ["google", "meta"],
					title: "Doporučení pro Google Ads a Meta Ads"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "charts-grid",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PerformanceChart, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChannelChart, {})]
				})
			] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Creatives, { full: true }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CampaignTable, {})] })
		]
	});
}
function ReportsPage() {
	const { client, period, reco } = useWorkspace();
	const data = getAnalytics(client, period);
	const [created, setCreated] = (0, import_react.useState)([]);
	const name = clients[client] ?? clients[0];
	const exportReport = (file, audience) => {
		const recs = getRecommendations(client, period).filter((r) => reco[r.area] && (audience === "firma" || r.audience === "Klient" || r.priority === "Vysoká"));
		const head = [
			["Klient", name],
			["Období (dní)", period],
			["Tržby (Kč)", data.revenue],
			["Náklady (Kč)", data.spend],
			["ROAS", (data.revenue / data.spend).toFixed(2)],
			["Konverze", data.conversions],
			[],
			audience === "firma" ? [
				"Oblast",
				"Priorita",
				"Doporučení",
				"Zjištění",
				"Co udělat",
				"Předat",
				"Pro",
				"Dopad"
			] : [
				"Oblast",
				"Doporučení",
				"Co uděláme / co potřebujeme",
				"Očekávaný přínos"
			]
		];
		const rows = recs.map((r) => {
			const area = r.area === "keywords" ? "Klíčová slova" : r.area === "google" ? "Google Ads" : "Meta Ads";
			return audience === "firma" ? [
				area,
				r.priority,
				r.title,
				r.insight,
				r.action,
				r.recipient,
				r.audience,
				r.impact
			] : [
				area,
				r.title,
				r.audience === "Klient" ? `Prosíme: ${r.action}` : r.action,
				r.impact
			];
		});
		downloadCsv(`${file}.csv`, ["AVQIX", audience === "firma" ? "Interní report pro firmu" : "Report pro klienta"], [...head, ...rows]);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "page-content",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Reporty",
				description: "Jasná čísla. Srozumitelné závěry. Připravené ke sdílení."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
				title: "Vytvořit report",
				subtitle: `${name} · vyberte, pro koho report je a která doporučení obsahuje`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecoToggles, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "reports-grid",
				children: [{
					id: "firma",
					title: "Report pro firmu",
					desc: "Interní report: všechna doporučení, priority a komu je předat."
				}, {
					id: "klient",
					title: "Report pro klienta",
					desc: "Srozumitelné výsledky, hlavní kroky a co potřebujeme od klienta."
				}].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "report-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileChartColumn, { size: 28 }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: t.id === "firma" ? "INTERNÍ" : "PRO KLIENTA" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: t.title }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t.desc }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							name,
							" · posledních ",
							period,
							" dní"
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: created.includes(t.id) ? "Report stažen" : "Ukázková data" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							onClick: () => {
								exportReport(`${t.id === "firma" ? "report-firma" : "report-klient"}-${name}`, t.id);
								setCreated([...created, t.id]);
							},
							children: [created.includes(t.id) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {}), "Stáhnout CSV"]
						})] })
					]
				}, t.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, { title: "Archiv reportů" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "reports-grid",
				children: [
					"Měsíční přehled · září 2026",
					"Výkon kampaní · září 2026",
					"Kreativní výkon · září 2026"
				].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "report-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileChartColumn, { size: 28 }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "MARKETINGOVÝ REPORT" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: n }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							name,
							" · posledních ",
							period,
							" dní"
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Ukázková data" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => exportReport(n, "klient"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {}), "CSV"]
						})] })
					]
				}, n))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "info-banner",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { size: 18 }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Reporty obsahují ukázková data. Pro skutečné reporty nejprve připojte datové zdroje." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "ghost",
						size: "sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/nastaveni",
							children: ["Zdroje dat", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, {})]
						})
					})
				]
			})
		]
	});
}
function SettingsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "page-content",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Nastavení",
				description: "Pracovní prostor a vaše datové zdroje."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
				title: "Datové zdroje",
				subtitle: "Přehled propojení"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "info-banner",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { size: 18 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Pracujete s ukázkovými daty. Připojení skutečných účtů zatím není nastavené." })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "integration-list",
				children: [
					{
						name: "Meta Ads",
						desc: "Kampaně, reklamní sestavy a kreativy",
						symbol: "∞"
					},
					{
						name: "Google Ads",
						desc: "Vyhledávání, Shopping a Performance Max",
						symbol: "G"
					},
					{
						name: "Google Analytics 4",
						desc: "Návštěvnost, konverze a tržby",
						symbol: "↗"
					},
					{
						name: "Google Search Console",
						desc: "Organické vyhledávání a klíčová slova",
						symbol: "⌕"
					},
					{
						name: "E-mail marketing",
						desc: "Newslettery a automatizace",
						symbol: "@"
					}
				].map((source) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "integration-row",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "integration-symbol",
							children: source.symbol
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: source.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: source.desc })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "integration-state",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, { size: 14 }), "Nepřipojeno"]
						})
					]
				}, source.name))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "settings-section",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
					title: "Doporučení",
					subtitle: "Vyberte sekce, kde chcete doporučení vidět"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecoToggles, {})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "settings-section",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, { title: "Pracovní prostor" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "settings-detail",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Earth, { size: 18 }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Jazyk a formát dat" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Čeština · CZK · Europe/Prague" })] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "settings-detail",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { size: 18 }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Ukázkový režim" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Bez připojení k externím účtům a bez ukládání osobních údajů." })] })]
					})
				]
			})
		]
	});
}
function ProfilePage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "page-content",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Uživatelský profil",
			description: "Váš prostor v AVQIX."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "profile-section",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "avatar profile-avatar",
				children: "AV"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Andrea Varmužová" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Marketing manager" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Ukázkový profil · přihlášení není nastavené" })
			] })]
		})]
	});
}
function ClientsPage() {
	const { client, period, setClient } = useWorkspace();
	const navigate = useNavigate();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "page-content",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Klienti",
			description: "Všichni klienti a jejich obchodní modely na jednom místě."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "reports-grid",
			children: demoClients.map((c, i) => {
				const kpis = getModelKpis(i, period).slice(0, 2);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "report-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { size: 28 }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: modelLabels[c.model].toUpperCase() }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: c.name }),
						kpis.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "tabular-nums",
							children: [
								k.label,
								": ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: k.value })
							]
						}, k.label)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: i === client ? "Vybraný klient" : "Demo data" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							onClick: () => {
								setClient(i);
								navigate({ to: "/" });
							},
							children: ["Otevřít", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, {})]
						})] })
					]
				}, c.name);
			})
		})]
	});
}
//#endregion
export { ProfilePage as a, WebPage as c, OverviewPage as i, ClientsPage as n, ReportsPage as o, OrganicPage as r, SettingsPage as s, CampaignsPage as t };
