import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldHalf, ChevronsLeft } from "lucide-react";
import { navSections } from "@/constants/nav";
import { getIcon } from "@/constants/icons";
import { useUIStore } from "@/store/uiStore";
import { cn } from "@/utils/cn";
import { kpiData } from "@/mocks/system";

export function Sidebar() {
  const collapsed = useUIStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 76 : 264 }}
      transition={{ type: "spring", stiffness: 300, damping: 32 }}
      className="relative z-30 flex h-screen shrink-0 flex-col border-r border-border bg-surface"
    >
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-border px-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-blue to-brand-purple shadow-glow">
          <ShieldHalf className="h-5 w-5 text-white" strokeWidth={2.25} />
        </div>
        {!collapsed && (
          <div className="min-w-0 overflow-hidden">
            <p className="truncate font-display text-[15px] font-bold leading-tight tracking-tight text-text-primary">
              SENTINEL CHAIN
            </p>
            <p className="truncate text-[10px] font-medium uppercase tracking-wider text-text-muted">
              AI-Powered Cyber Defense
            </p>
          </div>
        )}
      </div>

      {/* Nav sections */}
      <nav className="scroll-thin flex-1 space-y-5 overflow-y-auto px-3 py-4">
        {navSections.map((section) => (
          <div key={section.title}>
            {!collapsed && (
              <p className="mb-1.5 px-2.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                {section.title}
              </p>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = getIcon(item.icon);
                return (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      end
                      title={collapsed ? item.label : undefined}
                      className={({ isActive }) =>
                        cn(
                          "group relative flex items-center gap-3 rounded-lg px-2.5 py-2 text-[13.5px] font-medium transition-colors duration-150",
                          isActive
                            ? "bg-brand-blue/12 text-white"
                            : "text-text-secondary hover:bg-white/5 hover:text-text-primary"
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <motion.span
                              layoutId="sidebar-active-bar"
                              className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-gradient-to-b from-brand-blue to-brand-purple"
                            />
                          )}
                          <Icon
                            className={cn(
                              "h-[18px] w-[18px] shrink-0 transition-transform duration-150 group-hover:scale-110",
                              isActive ? "text-brand-blue-light" : "text-text-muted group-hover:text-text-primary"
                            )}
                            strokeWidth={2}
                          />
                          {!collapsed && <span className="truncate">{item.label}</span>}
                          {!collapsed && item.badge && (
                            <span className="ml-auto rounded-full bg-severity-critical/20 px-1.5 py-0.5 text-[10px] font-semibold text-severity-critical">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Persistent system status widget */}
      <div className="shrink-0 border-t border-border p-3">
        {collapsed ? (
          <div className="flex justify-center" title="All Systems Operational">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-status-success opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-status-success" />
            </span>
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-surface-raised/60 p-3">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-status-success opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-status-success" />
              </span>
              <p className="text-xs font-semibold text-text-primary">All Systems Operational</p>
            </div>
            <div className="mt-2.5 space-y-1.5 text-[11px] text-text-muted">
              <div className="flex justify-between">
                <span>Uptime</span>
                <span className="font-mono-data text-text-secondary">{kpiData.uptime}%</span>
              </div>
              <div className="flex justify-between">
                <span>Active Nodes</span>
                <span className="font-mono-data text-text-secondary">12/12</span>
              </div>
              <div className="flex justify-between">
                <span>Last Updated</span>
                <span className="font-mono-data text-text-secondary">Just now</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer / collapse toggle */}
      <div className="shrink-0 border-t border-border p-3">
        <button
          onClick={toggleSidebar}
          className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-text-muted transition-colors hover:bg-white/5 hover:text-text-primary"
        >
          <ChevronsLeft className={cn("h-4 w-4 transition-transform duration-300", collapsed && "rotate-180")} />
          {!collapsed && <span>Collapse</span>}
        </button>
        {!collapsed && (
          <p className="mt-2 px-2.5 text-[10px] leading-relaxed text-text-muted">
            Sentinel Chain v1.0.0
            <br />© 2026 Sentinel Chain. All rights reserved.
          </p>
        )}
      </div>
    </motion.aside>
  );
}
