import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/utils/cn";

type Tone = "blue" | "purple" | "critical" | "success" | "warning" | "cyan";

const toneStyles: Record<Tone, { icon: string; ring: string }> = {
  blue: { icon: "bg-brand-blue/15 text-brand-blue-light", ring: "hover:shadow-glow" },
  purple: { icon: "bg-brand-purple/15 text-brand-purple-light", ring: "hover:shadow-glow-purple" },
  critical: { icon: "bg-severity-critical/15 text-severity-critical", ring: "hover:shadow-glow-critical" },
  success: { icon: "bg-status-success/15 text-status-success", ring: "hover:shadow-glow" },
  warning: { icon: "bg-severity-high/15 text-severity-high", ring: "hover:shadow-glow" },
  cyan: { icon: "bg-brand-cyan/15 text-brand-cyan", ring: "hover:shadow-glow" },
};

export function StatCard({
  label,
  value,
  suffix,
  delta,
  deltaLabel = "vs last 24h",
  icon: Icon,
  tone = "blue",
  goodDirection = "up",
}: {
  label: string;
  value: string | number;
  suffix?: string;
  delta?: number;
  deltaLabel?: string;
  icon: LucideIcon;
  tone?: Tone;
  goodDirection?: "up" | "down";
}) {
  const isUp = (delta ?? 0) >= 0;
  const isGood = isUp ? goodDirection === "up" : goodDirection === "down";
  const t = toneStyles[tone];

  return (
    <div className={cn("panel panel-hover group relative overflow-hidden p-4 transition-shadow", t.ring)}>
      <div className="flex items-start justify-between">
        <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg", t.icon)}>
          <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
        </div>
        {delta !== undefined && (
          <div
            className={cn(
              "flex items-center gap-0.5 text-xs font-medium",
              isGood ? "text-status-success" : "text-severity-critical"
            )}
          >
            {isUp ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            {Math.abs(delta)}%
          </div>
        )}
      </div>
      <div className="mt-3">
        <p className="text-xs font-medium uppercase tracking-wide text-text-muted">{label}</p>
        <p className="mt-1 font-display text-2xl font-bold text-text-primary">
          {value}
          {suffix && <span className="ml-0.5 text-base font-medium text-text-secondary">{suffix}</span>}
        </p>
        {delta !== undefined && <p className="mt-0.5 text-[11px] text-text-muted">{deltaLabel}</p>}
      </div>
    </div>
  );
}
