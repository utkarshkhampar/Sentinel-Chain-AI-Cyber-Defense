import { useState } from "react";
import { Globe2, ShieldAlert, Bug, Crosshair, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Tabs, type TabItem } from "@/components/ui/Tabs";
import { Badge } from "@/components/ui/Badge";
import { iocFeed, cveDatabase, mitreMatrix, malwareFeed, trendingThreats } from "@/mocks/threatIntel";
import { cn } from "@/utils/cn";

const tabs: TabItem[] = [
  { id: "ioc", label: "IOC Feed", icon: <ShieldAlert className="h-3.5 w-3.5" />, badge: iocFeed.length },
  { id: "cve", label: "CVE Database", icon: <Bug className="h-3.5 w-3.5" />, badge: cveDatabase.length },
  { id: "mitre", label: "MITRE ATT&CK", icon: <Crosshair className="h-3.5 w-3.5" /> },
  { id: "malware", label: "Malware Feed", icon: <Globe2 className="h-3.5 w-3.5" /> },
];

const severityTone: Record<string, string> = {
  critical: "danger",
  high: "warning",
  medium: "default",
  low: "outline",
};

export function ThreatIntelligence() {
  const [active, setActive] = useState("ioc");

  return (
    <div className="space-y-5 pb-8">
      <PageHeader title="Threat Intelligence" subtitle="Aggregated IOC, CVE, and MITRE ATT&CK intelligence feeds" icon={Globe2} />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <Tabs tabs={tabs} active={active} onChange={setActive} className="px-3" />
            <CardBody className="pt-5">
              {active === "ioc" && (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[560px] border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b border-border text-[10px] uppercase tracking-wide text-text-muted">
                        <th className="px-3 py-2 font-medium">Type</th>
                        <th className="px-3 py-2 font-medium">Value</th>
                        <th className="px-3 py-2 font-medium">Level</th>
                        <th className="px-3 py-2 font-medium">Source</th>
                      </tr>
                    </thead>
                    <tbody>
                      {iocFeed.map((ioc) => (
                        <tr key={ioc.id} className="border-b border-border/50 last:border-0">
                          <td className="px-3 py-2.5"><Badge variant="outline">{ioc.type}</Badge></td>
                          <td className="px-3 py-2.5 font-mono-data text-xs text-text-primary">{ioc.value}</td>
                          <td className="px-3 py-2.5"><Badge variant={severityTone[ioc.threatLevel] as any}>{ioc.threatLevel}</Badge></td>
                          <td className="px-3 py-2.5 text-xs text-text-muted">{ioc.source}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {active === "cve" && (
                <div className="space-y-3">
                  {cveDatabase.map((cve) => (
                    <div key={cve.id} className="rounded-lg border border-border bg-surface/60 p-3.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-mono-data text-xs text-brand-blue-light">{cve.id}</span>
                        <div className="flex items-center gap-2">
                          {cve.exploitAvailable && <Badge variant="danger">Exploit Available</Badge>}
                          <Badge variant={severityTone[cve.severity] as any}>CVSS {cve.cvssScore}</Badge>
                        </div>
                      </div>
                      <p className="mt-1.5 text-sm font-medium text-text-primary">{cve.title}</p>
                      <p className="text-xs text-text-muted">Affects: {cve.affectedProduct}</p>
                    </div>
                  ))}
                </div>
              )}

              {active === "mitre" && (
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                  {mitreMatrix.map((t) => (
                    <div key={t.id} className="rounded-lg border border-border bg-surface/60 p-3">
                      <p className="font-mono-data text-[10px] text-text-muted">{t.id}</p>
                      <p className="mt-0.5 text-xs font-semibold text-text-primary">{t.name}</p>
                      <p className="mt-1 text-[10px] text-text-muted">{t.tactic}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[10px] text-text-muted">Detections</span>
                        <span className="font-mono-data text-xs text-brand-blue-light">{t.detections}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {active === "malware" && (
                <div className="space-y-2.5">
                  {malwareFeed.map((m) => (
                    <div key={m.name} className="flex items-center justify-between rounded-lg border border-border bg-surface/60 p-3">
                      <div>
                        <p className="text-sm font-medium text-text-primary">{m.name}</p>
                        <p className="text-xs text-text-muted">{m.family}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono-data text-xs text-text-secondary">{m.detections} detections</span>
                        <Badge variant={severityTone[m.severity] as any}>{m.severity}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader title="Trending Threats" icon={<TrendingUp className="h-4 w-4" />} />
            <CardBody>
              <ul className="space-y-3">
                {trendingThreats.map((t) => (
                  <li key={t.name} className="flex items-start justify-between gap-3 border-b border-border/60 pb-3 last:border-0 last:pb-0">
                    <p className="text-xs leading-relaxed text-text-secondary">{t.name}</p>
                    <span className="shrink-0 text-xs font-semibold text-severity-critical">{t.change}</span>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
