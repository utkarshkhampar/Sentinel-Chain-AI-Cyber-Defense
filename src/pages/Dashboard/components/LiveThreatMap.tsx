import { useState } from "react";
import { Radar, Plus, Minus, ChevronDown } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { geoThreatPoints } from "@/mocks/threats";
import { cn } from "@/utils/cn";
import type { Severity } from "@/types";

// Rough equirectangular-projection percentage coordinates, precomputed from
// each point's lat/lng in mocks/threats.ts, used purely for a stylized
// (not geographically precise) map visualization.
const positions: Record<string, { x: number; y: number }> = {
  "United States": { x: 24, y: 34 },
  Germany: { x: 51, y: 24 },
  India: { x: 68, y: 44 },
  Netherlands: { x: 50, y: 22 },
  Brazil: { x: 36, y: 66 },
  Russia: { x: 60, y: 18 },
  Singapore: { x: 76, y: 52 },
};

const severityDot: Record<Severity, string> = {
  critical: "bg-severity-critical shadow-[0_0_12px_2px_rgba(239,68,68,0.7)]",
  high: "bg-severity-high shadow-[0_0_12px_2px_rgba(249,115,22,0.6)]",
  medium: "bg-severity-medium shadow-[0_0_10px_2px_rgba(234,179,8,0.5)]",
  low: "bg-severity-low shadow-[0_0_10px_2px_rgba(59,130,246,0.5)]",
};

const legend: { label: string; severity: Severity }[] = [
  { label: "Critical", severity: "critical" },
  { label: "High", severity: "high" },
  { label: "Medium", severity: "medium" },
  { label: "Low", severity: "low" },
];

export function LiveThreatMap() {
  const [activePoint, setActivePoint] = useState<string | null>(null);

  return (
    <Card className="flex flex-col">
      <CardHeader
        title="Live Threat Map"
        icon={<Radar className="h-4 w-4" />}
        action={
          <button className="flex items-center gap-1 rounded-md border border-border-strong px-2 py-1 text-xs text-text-secondary hover:bg-white/5">
            Worldwide <ChevronDown className="h-3 w-3" />
          </button>
        }
      />
      <div className="relative mx-5 mb-5 aspect-[2/1] overflow-hidden rounded-lg border border-border bg-[#060a14]">
        {/* Ambient grid + radial glow backdrop */}
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-40" />
        <div className="absolute inset-0 bg-radial-fade" />

        {/* Connection arcs between a few active points */}
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 50" preserveAspectRatio="none">
          <defs>
            <linearGradient id="arc-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d={`M ${positions["Russia"].x} ${positions["Russia"].y / 2} Q 45 5 ${positions["United States"].x} ${positions["United States"].y / 2}`}
            fill="none"
            stroke="url(#arc-gradient)"
            strokeWidth="0.3"
            strokeDasharray="1.5 1.5"
          />
          <path
            d={`M ${positions["India"].x} ${positions["India"].y / 2} Q 55 10 ${positions["Brazil"].x} ${positions["Brazil"].y / 2}`}
            fill="none"
            stroke="url(#arc-gradient)"
            strokeWidth="0.3"
            strokeDasharray="1.5 1.5"
          />
        </svg>

        {/* Threat markers */}
        {geoThreatPoints.map((point) => {
          const pos = positions[point.country] ?? { x: 50, y: 50 };
          return (
            <button
              key={point.country + point.city}
              onMouseEnter={() => setActivePoint(point.country)}
              onMouseLeave={() => setActivePoint(null)}
              className="group absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            >
              <span className="relative flex h-2.5 w-2.5">
                <span
                  className={cn(
                    "absolute inline-flex h-full w-full animate-ping rounded-full opacity-60",
                    severityDot[point.severity]
                  )}
                />
                <span className={cn("relative inline-flex h-2.5 w-2.5 rounded-full", severityDot[point.severity])} />
              </span>

              <div
                className={cn(
                  "pointer-events-none absolute left-1/2 top-4 z-10 w-max -translate-x-1/2 rounded-md border border-border bg-surface-raised px-2 py-1 text-left opacity-0 shadow-card transition-opacity",
                  activePoint === point.country && "opacity-100"
                )}
              >
                <p className="text-[11px] font-semibold text-text-primary">{point.country}</p>
                <p className="text-[10px] text-text-muted">
                  {point.city} \u00b7 {point.label}
                </p>
              </div>

              <span className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 whitespace-nowrap text-[10px] font-medium text-text-muted group-hover:text-text-secondary">
                {point.country}
              </span>
            </button>
          );
        })}

        {/* Zoom controls */}
        <div className="absolute right-3 top-3 flex flex-col overflow-hidden rounded-md border border-border-strong bg-surface-raised/90">
          <button className="flex h-7 w-7 items-center justify-center text-text-secondary hover:bg-white/5">
            <Plus className="h-3.5 w-3.5" />
          </button>
          <div className="h-px bg-border" />
          <button className="flex h-7 w-7 items-center justify-center text-text-secondary hover:bg-white/5">
            <Minus className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Legend */}
        <div className="absolute bottom-3 left-3 flex flex-col gap-1 rounded-md border border-border-strong bg-surface-raised/90 px-2.5 py-2">
          {legend.map((l) => (
            <div key={l.severity} className="flex items-center gap-1.5 text-[10px] text-text-secondary">
              <span className={cn("h-1.5 w-1.5 rounded-full", severityDot[l.severity])} />
              {l.label}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
