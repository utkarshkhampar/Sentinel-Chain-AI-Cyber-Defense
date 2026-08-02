import { toast } from "sonner";
import { ShieldAlert, MapPin, Cpu, Clock, Crosshair, CheckCircle2, XCircle } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { SeverityBadge, StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { ThreatEvent } from "@/types";

export function ThreatDetailModal({ threat, onClose }: { threat: ThreatEvent | null; onClose: () => void }) {
  if (!threat) return null;

  return (
    <Modal
      open={!!threat}
      onClose={onClose}
      title={threat.title}
      subtitle={`${threat.id} \u00b7 Detected ${new Date(threat.detectedAt).toLocaleString()}`}
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={() => { toast.success("Marked as false positive"); onClose(); }}>
            <XCircle className="h-4 w-4" /> Mark False Positive
          </Button>
          <Button onClick={() => { toast.success("Escalated to incident", { description: "A new incident record has been created." }); onClose(); }}>
            <CheckCircle2 className="h-4 w-4" /> Escalate to Incident
          </Button>
        </>
      }
    >
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <SeverityBadge severity={threat.severity} />
        <StatusBadge status={threat.status} />
        <span className="rounded-md border border-border-strong px-2 py-0.5 text-[11px] font-medium text-text-secondary">
          {threat.attackType}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {[
          { icon: Cpu, label: "Source", value: threat.source },
          { icon: MapPin, label: "Source IP", value: threat.sourceIp, mono: true },
          { icon: ShieldAlert, label: "Target Asset", value: threat.targetAsset },
          { icon: MapPin, label: "Country", value: threat.country },
          { icon: Crosshair, label: "MITRE Technique", value: threat.mitreTechnique },
          { icon: Clock, label: "AI Confidence", value: `${threat.aiConfidence}%` },
        ].map((field) => (
          <div key={field.label} className="rounded-lg border border-border bg-surface/60 p-3">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-text-muted">
              <field.icon className="h-3 w-3" /> {field.label}
            </div>
            <p className={`mt-1 text-sm font-medium text-text-primary ${field.mono ? "font-mono-data" : ""}`}>
              {field.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-lg border border-brand-blue/25 bg-brand-blue/5 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-blue-light">AI Analysis Summary</p>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary">
          This event was flagged with {threat.aiConfidence}% confidence based on behavioral deviation from baseline
          activity for {threat.targetAsset}. The pattern is consistent with known {threat.attackType.toLowerCase()}{" "}
          techniques mapped to {threat.mitreTechnique}. Recommend {threat.severity === "critical" || threat.severity === "high" ? "immediate analyst review and containment" : "continued monitoring"}.
        </p>
      </div>

      <div className="mt-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">Threat History</p>
        <ul className="space-y-2 border-l border-border pl-4">
          <li className="relative text-xs text-text-secondary">
            <span className="absolute -left-[19px] top-1 h-2 w-2 rounded-full bg-brand-blue" />
            Event detected and scored by AI engine \u2014 {new Date(threat.detectedAt).toLocaleTimeString()}
          </li>
          <li className="relative text-xs text-text-secondary">
            <span className="absolute -left-[19px] top-1 h-2 w-2 rounded-full bg-text-muted" />
            Correlated with {Math.floor(Math.random() * 3) + 1} related events on the same asset
          </li>
          <li className="relative text-xs text-text-secondary">
            <span className="absolute -left-[19px] top-1 h-2 w-2 rounded-full bg-text-muted" />
            Awaiting analyst triage
          </li>
        </ul>
      </div>
    </Modal>
  );
}
