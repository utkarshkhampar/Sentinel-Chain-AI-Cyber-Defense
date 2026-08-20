import { useState } from "react";
import { BrainCircuit, TrendingUp, Activity, Gauge, Users, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { Tabs, type TabItem } from "@/components/ui/Tabs";
import { Progress } from "@/components/ui/Feedback";
import { aiPredictions, uebaRiskScores } from "@/mocks/organization";
import { cn } from "@/utils/cn";

const tabs: TabItem[] = [
  { id: "prediction", label: "Threat Prediction", icon: <TrendingUp className="h-3.5 w-3.5" /> },
  { id: "behavior", label: "Behavior Analysis", icon: <Activity className="h-3.5 w-3.5" /> },
  { id: "anomaly", label: "Anomaly Detection", icon: <Sparkles className="h-3.5 w-3.5" /> },
  { id: "risk", label: "Risk Scoring", icon: <Gauge className="h-3.5 w-3.5" /> },
  { id: "ueba", label: "UEBA", icon: <Users className="h-3.5 w-3.5" /> },
];

export function AIAnalysis() {
  const [active, setActive] = useState("prediction");

  return (
    <div className="space-y-5 pb-8">
      <PageHeader title="AI Analysis" subtitle="Explainable, model-driven analysis across every monitored asset" icon={BrainCircuit} />

      <Card>
        <Tabs tabs={tabs} active={active} onChange={setActive} className="px-3" />
        <CardBody className="pt-5">
          {(active === "prediction" || active === "anomaly") && (
            <div className="space-y-4">
              {aiPredictions.map((p) => (
                <div key={p.id} className="rounded-xl border border-border bg-surface/60 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-xs font-medium text-brand-blue-light">{p.model}</p>
                      <p className="font-display text-sm font-bold text-text-primary">{p.verdict}</p>
                      <p className="text-xs text-text-muted">Target: {p.target}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-2xl font-bold text-text-primary">{p.confidence}%</p>
                      <p className="text-[10px] text-text-muted">confidence</p>
                    </div>
                  </div>
                  <div className="mt-3 space-y-2">
                    {p.topFeatures.map((f) => (
                      <div key={f.feature}>
                        <div className="flex justify-between text-[11px] text-text-secondary">
                          <span>{f.feature}</span>
                          <span>{Math.round(f.weight * 100)}%</span>
                        </div>
                        <Progress value={f.weight * 100} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {active === "behavior" && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                { asset: "Laptop-01", baseline: "Normal working-hours activity, US-based logins", deviation: "Executed unsigned binary at 04:45 local time from temp directory", severity: "critical" },
                { asset: "Server-02", baseline: "SSH access from 3 known internal IPs only", deviation: "400+ auth attempts from unfamiliar external IP within 8 minutes", severity: "high" },
                { asset: "Finance-Server-01", baseline: "Single-region access pattern for user mchen", deviation: "Two logins 6 minutes apart from geographically incompatible locations", severity: "critical" },
                { asset: "Cloud-01", baseline: "Outbound transfers typically under 200MB", deviation: "5.2GB transfer to unfamiliar destination endpoint", severity: "medium" },
              ].map((b) => (
                <div key={b.asset} className="rounded-xl border border-border bg-surface/60 p-4">
                  <p className="font-display text-sm font-bold text-text-primary">{b.asset}</p>
                  <div className="mt-2 space-y-2 text-xs">
                    <p><span className="text-text-muted">Baseline: </span><span className="text-text-secondary">{b.baseline}</span></p>
                    <p><span className="text-text-muted">Deviation: </span><span className="text-text-primary">{b.deviation}</span></p>
                  </div>
                  <span
                    className={cn(
                      "mt-3 inline-block rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase",
                      b.severity === "critical" && "border-severity-critical/30 bg-severity-critical/10 text-severity-critical",
                      b.severity === "high" && "border-severity-high/30 bg-severity-high/10 text-severity-high",
                      b.severity === "medium" && "border-severity-medium/30 bg-severity-medium/10 text-severity-medium"
                    )}
                  >
                    {b.severity} deviation
                  </span>
                </div>
              ))}
            </div>
          )}

          {active === "risk" && (
            <div className="space-y-3">
              {[
                { entity: "Finance-Server-01", score: 88 },
                { entity: "Laptop-01", score: 92 },
                { entity: "Server-02", score: 74 },
                { entity: "DB-Server", score: 68 },
                { entity: "Cloud-01", score: 61 },
                { entity: "K8s-Cluster-Prod", score: 18 },
              ].map((r) => (
                <div key={r.entity} className="flex items-center gap-4">
                  <span className="w-40 shrink-0 truncate text-sm text-text-primary">{r.entity}</span>
                  <Progress value={r.score} tone={r.score >= 70 ? "critical" : r.score >= 40 ? "warning" : "success"} />
                  <span className="w-10 shrink-0 text-right font-mono-data text-xs text-text-secondary">{r.score}</span>
                </div>
              ))}
            </div>
          )}

          {active === "ueba" && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-[10px] uppercase tracking-wide text-text-muted">
                    <th className="px-3 py-2 font-medium">User</th>
                    <th className="px-3 py-2 font-medium">Department</th>
                    <th className="px-3 py-2 font-medium">Risk Score</th>
                    <th className="px-3 py-2 font-medium">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {uebaRiskScores.map((u) => (
                    <tr key={u.user} className="border-b border-border/50 last:border-0">
                      <td className="px-3 py-2.5 font-mono-data text-text-primary">{u.user}</td>
                      <td className="px-3 py-2.5 text-text-secondary">{u.department}</td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          <Progress value={u.riskScore} tone={u.riskScore >= 70 ? "critical" : u.riskScore >= 40 ? "warning" : "success"} />
                          <span className="text-xs text-text-secondary">{u.riskScore}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-xs capitalize text-text-muted">{u.trend}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
