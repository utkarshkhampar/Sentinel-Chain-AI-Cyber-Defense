import { BrainCircuit, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { kpiData } from "@/mocks/system";

const topReasons = [
  "Impossible travel: login from two countries within 15 minutes",
  "Large file download: 5.2 GB of sensitive data",
  "Multiple failed login attempts: 25 attempts in 5 minutes",
  "Access to sensitive server: Finance-Server-01",
];

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function AiThreatAnalysisPanel() {
  const navigate = useNavigate();
  const score = kpiData.threatScore.value;
  const offset = CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE;

  return (
    <Card>
      <CardHeader title="AI Threat Analysis" icon={<BrainCircuit className="h-4 w-4" />} />
      <CardBody>
        <div className="flex items-center gap-5">
          <div className="relative flex h-32 w-32 shrink-0 items-center justify-center">
            <svg viewBox="0 0 120 120" className="h-32 w-32 -rotate-90">
              <circle cx="60" cy="60" r={RADIUS} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
              <circle
                cx="60"
                cy="60"
                r={RADIUS}
                fill="none"
                stroke="url(#threatGradient)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={offset}
              />
              <defs>
                <linearGradient id="threatGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#f97316" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="font-display text-3xl font-bold text-text-primary">{score}%</span>
              <span className="text-[11px] font-semibold uppercase tracking-wide text-severity-critical">
                {kpiData.threatScore.label}
              </span>
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-text-muted">Top Reasons</p>
            <ul className="space-y-2">
              {topReasons.map((reason, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs leading-snug text-text-secondary">
                  <ArrowRight className="mt-0.5 h-3 w-3 shrink-0 text-brand-blue-light" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <button onClick={() => navigate("/ai-analysis")} className="mt-4 w-full rounded-lg border border-border-strong py-2 text-xs font-medium text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary">
          View Full Analysis
        </button>
      </CardBody>
    </Card>
  );
}
