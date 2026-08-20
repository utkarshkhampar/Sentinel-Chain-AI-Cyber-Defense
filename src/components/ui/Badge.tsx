import type { ReactNode } from "react";
import { cn } from "@/utils/cn";
import type { IncidentStatus, Severity } from "@/types";

const severityStyles: Record<Severity, string> = {
  critical: "bg-severity-critical/15 text-severity-critical border-severity-critical/30",
  high: "bg-severity-high/15 text-severity-high border-severity-high/30",
  medium: "bg-severity-medium/15 text-severity-medium border-severity-medium/30",
  low: "bg-severity-low/15 text-severity-low border-severity-low/30",
};

export function SeverityBadge({ severity, className }: { severity: Severity; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
        severityStyles[severity],
        className
      )}
    >
      {severity}
    </span>
  );
}

const statusStyles: Record<IncidentStatus, string> = {
  open: "bg-severity-critical/15 text-severity-critical border-severity-critical/30",
  investigating: "bg-severity-high/15 text-severity-high border-severity-high/30",
  monitoring: "bg-brand-blue/15 text-brand-blue-light border-brand-blue/30",
  contained: "bg-brand-purple/15 text-brand-purple-light border-brand-purple/30",
  closed: "bg-status-success/15 text-status-success border-status-success/30",
};

const statusLabels: Record<IncidentStatus, string> = {
  open: "Open",
  investigating: "Investigating",
  monitoring: "Monitoring",
  contained: "Contained",
  closed: "Closed",
};

export function StatusBadge({ status, className }: { status: IncidentStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap",
        statusStyles[status],
        className
      )}
    >
      {statusLabels[status]}
    </span>
  );
}

export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "outline";
  className?: string;
}) {
  const variants: Record<string, string> = {
    default: "bg-white/5 text-text-secondary border-white/10",
    success: "bg-status-success/15 text-status-success border-status-success/30",
    warning: "bg-status-warning/15 text-status-warning border-status-warning/30",
    danger: "bg-status-danger/15 text-status-danger border-status-danger/30",
    outline: "bg-transparent text-text-secondary border-border-strong",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
