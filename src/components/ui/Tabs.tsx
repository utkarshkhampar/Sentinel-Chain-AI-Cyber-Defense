import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

export interface TabItem {
  id: string;
  label: string;
  icon?: ReactNode;
  badge?: string | number;
}

export function Tabs({
  tabs,
  active,
  onChange,
  className,
}: {
  tabs: TabItem[];
  active: string;
  onChange: (id: string) => void;
  className?: string;
}) {
  return (
    <div className={cn("scroll-thin flex items-center gap-1 overflow-x-auto border-b border-border", className)}>
      {tabs.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative flex shrink-0 items-center gap-1.5 whitespace-nowrap px-3.5 py-2.5 text-sm font-medium transition-colors",
              isActive ? "text-text-primary" : "text-text-muted hover:text-text-secondary"
            )}
          >
            {tab.icon}
            {tab.label}
            {tab.badge !== undefined && (
              <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold text-text-secondary">
                {tab.badge}
              </span>
            )}
            {isActive && (
              <motion.span
                layoutId="tab-underline"
                className="absolute inset-x-0 -bottom-px h-[2px] rounded-full bg-gradient-to-r from-brand-blue to-brand-purple"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
