import {
  LayoutDashboard,
  Radar,
  ShieldAlert,
  Server,
  BrainCircuit,
  Globe2,
  Link2,
  FileText,
  BarChart3,
  ClipboardCheck,
  Users,
  UsersRound,
  History,
  Plug,
  KeyRound,
  Settings,
  LifeBuoy,
  BookOpen,
  Info,
  type LucideIcon,
} from "lucide-react";

// Central icon registry — keys must match the `icon` string used in
// src/constants/nav.ts so the Sidebar can resolve icons by name.
export const iconRegistry: Record<string, LucideIcon> = {
  LayoutDashboard,
  Radar,
  ShieldAlert,
  Server,
  BrainCircuit,
  Globe2,
  Link2,
  FileText,
  BarChart3,
  ClipboardCheck,
  Users,
  UsersRound,
  History,
  Plug,
  KeyRound,
  Settings,
  LifeBuoy,
  BookOpen,
  Info,
};

export function getIcon(name: string): LucideIcon {
  return iconRegistry[name] ?? Info;
}
