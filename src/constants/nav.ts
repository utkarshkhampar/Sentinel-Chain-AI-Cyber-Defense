import type { NavItem } from "@/types";

export interface NavEntry extends NavItem {
  implemented: boolean;
  badge?: string;
}

export const navSections: { title: string; items: NavEntry[] }[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", path: "/dashboard", icon: "LayoutDashboard", implemented: true },
      { label: "Live Threats", path: "/live-threats", icon: "Radar", implemented: true, badge: "8" },
      { label: "Incidents", path: "/incidents", icon: "ShieldAlert", implemented: true },
    ],
  },
  {
    title: "Assets & Intelligence",
    items: [
      { label: "Assets", path: "/assets", icon: "Server", implemented: true },
      { label: "AI Analysis", path: "/ai-analysis", icon: "BrainCircuit", implemented: true },
      { label: "Threat Intelligence", path: "/threat-intelligence", icon: "Globe2", implemented: true },
      { label: "Blockchain Evidence", path: "/blockchain-evidence", icon: "Link2", implemented: true },
    ],
  },
  {
    title: "Reporting",
    items: [
      { label: "Reports", path: "/reports", icon: "FileText", implemented: true },
      { label: "Analytics", path: "/analytics", icon: "BarChart3", implemented: true },
      { label: "Compliance", path: "/compliance", icon: "ClipboardCheck", implemented: true },
    ],
  },
  {
    title: "Organization",
    items: [
      { label: "Users", path: "/users", icon: "Users", implemented: true },
      { label: "SOC Team", path: "/soc-team", icon: "UsersRound", implemented: true },
      { label: "Audit Logs", path: "/audit-logs", icon: "History", implemented: true },
    ],
  },
  {
    title: "Platform",
    items: [
      { label: "Integrations", path: "/integrations", icon: "Plug", implemented: true },
      { label: "API Keys", path: "/api-keys", icon: "KeyRound", implemented: true },
      { label: "Settings", path: "/settings", icon: "Settings", implemented: true },
    ],
  },
  {
    title: "Support",
    items: [
      { label: "Help Center", path: "/help", icon: "LifeBuoy", implemented: true },
      { label: "Documentation", path: "/docs", icon: "BookOpen", implemented: true },
      { label: "About", path: "/about", icon: "Info", implemented: true },
    ],
  },
];

export const flatNavItems: NavEntry[] = navSections.flatMap((s) => s.items);
