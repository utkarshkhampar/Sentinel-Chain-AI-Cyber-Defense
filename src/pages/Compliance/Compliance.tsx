import { ClipboardCheck, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Feedback";
import { complianceFrameworks } from "@/mocks/organization";
import { cn } from "@/utils/cn";

const statusConfig = {
  compliant: { icon: CheckCircle2, label: "Compliant", tone: "text-status-success", bg: "bg-status-success/10 border-status-success/25" },
  partial: { icon: AlertTriangle, label: "Partial", tone: "text-severity-high", bg: "bg-severity-high/10 border-severity-high/25" },
  "non-compliant": { icon: XCircle, label: "Non-Compliant", tone: "text-severity-critical", bg: "bg-severity-critical/10 border-severity-critical/25" },
};

export function Compliance() {
  const avgScore = Math.round(complianceFrameworks.reduce((s, f) => s + f.score, 0) / complianceFrameworks.length);

  return (
    <div className="space-y-5 pb-8">
      <PageHeader title="Compliance" subtitle="Framework coverage across regulatory and industry standards" icon={ClipboardCheck} />

      <div className="panel flex items-center gap-5 p-5">
        <div className="relative flex h-20 w-20 shrink-0 items-center justify-center">
          <svg viewBox="0 0 80 80" className="h-20 w-20 -rotate-90">
            <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
            <circle
              cx="40" cy="40" r="34" fill="none" stroke="#10b981" strokeWidth="8" strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 34}
              strokeDashoffset={2 * Math.PI * 34 * (1 - avgScore / 100)}
            />
          </svg>
          <span className="absolute font-display text-xl font-bold text-text-primary">{avgScore}%</span>
        </div>
        <div>
          <p className="font-display text-base font-bold text-text-primary">Overall Compliance Posture</p>
          <p className="mt-1 text-sm text-text-secondary">
            Averaged across {complianceFrameworks.length} tracked frameworks. Two frameworks currently require
            attention to reach full compliance.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {complianceFrameworks.map((f) => {
          const cfg = statusConfig[f.status];
          return (
            <Card key={f.id}>
              <CardBody className="pt-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-display text-base font-bold text-text-primary">{f.name}</p>
                    <p className="text-xs text-text-muted">{f.fullName}</p>
                  </div>
                  <div className={cn("flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-medium", cfg.bg, cfg.tone)}>
                    <cfg.icon className="h-3 w-3" /> {cfg.label}
                  </div>
                </div>
                <div className="mt-4">
                  <div className="mb-1 flex justify-between text-xs text-text-secondary">
                    <span>{f.controlsPassed} / {f.controlsTotal} controls passed</span>
                    <span>{f.score}%</span>
                  </div>
                  <Progress value={f.score} tone={f.status === "compliant" ? "success" : f.status === "partial" ? "warning" : "critical"} />
                </div>
                <p className="mt-3 text-[11px] text-text-muted">Last audited {new Date(f.lastAudit).toLocaleDateString()}</p>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
