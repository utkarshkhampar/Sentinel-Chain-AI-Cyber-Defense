import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft, Clock, FileText, MessageSquare, Crosshair, BrainCircuit, Link2,
  CheckCircle2, Image as ImageIcon, Send,
} from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { SeverityBadge, StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Tabs, type TabItem } from "@/components/ui/Tabs";
import { Textarea } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/Feedback";
import { mockIncidents } from "@/mocks/incidents";
import { blockchainRecords } from "@/mocks/system";

const tabs: TabItem[] = [
  { id: "timeline", label: "Timeline", icon: <Clock className="h-3.5 w-3.5" /> },
  { id: "evidence", label: "Evidence", icon: <ImageIcon className="h-3.5 w-3.5" /> },
  { id: "logs", label: "Logs", icon: <FileText className="h-3.5 w-3.5" /> },
  { id: "notes", label: "Analyst Notes", icon: <MessageSquare className="h-3.5 w-3.5" /> },
  { id: "mitre", label: "MITRE Mapping", icon: <Crosshair className="h-3.5 w-3.5" /> },
];

export function IncidentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("timeline");
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState<{ author: string; text: string; time: string }[]>([
    { author: "Riya Singh", text: "Confirmed with endpoint agent logs. Proceeding with isolation.", time: "2m ago" },
  ]);

  const incident = mockIncidents.find((i) => i.id === id);
  const evidence = blockchainRecords.find((r) => r.id === incident?.evidenceRecordId);

  if (!incident) {
    return (
      <div className="panel">
        <EmptyState
          icon={FileText}
          title="Incident not found"
          description={`No incident matches ID "${id}".`}
          action={
            <Button variant="secondary" onClick={() => navigate("/incidents")}>
              Back to Incidents
            </Button>
          }
        />
      </div>
    );
  }

  function addNote() {
    if (!note.trim()) return;
    setNotes((n) => [{ author: "You", text: note, time: "just now" }, ...n]);
    setNote("");
    toast.success("Note added");
  }

  return (
    <div className="space-y-5 pb-8">
      <button
        onClick={() => navigate("/incidents")}
        className="flex items-center gap-1.5 text-sm font-medium text-text-muted hover:text-text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Incidents
      </button>

      <div className="panel p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono-data text-xs text-text-muted">{incident.id}</span>
              <SeverityBadge severity={incident.severity} />
              <StatusBadge status={incident.status} />
              {incident.blockchainVerified && (
                <span className="flex items-center gap-1 rounded-md border border-status-success/30 bg-status-success/10 px-2 py-0.5 text-[11px] font-medium text-status-success">
                  <CheckCircle2 className="h-3 w-3" /> Blockchain Verified
                </span>
              )}
            </div>
            <h1 className="mt-2 font-display text-xl font-bold text-text-primary">{incident.title}</h1>
            <p className="mt-1 text-sm text-text-secondary">
              Assigned to <span className="text-text-primary">{incident.assignedTo}</span> \u00b7 Affects{" "}
              {incident.affectedAssets.join(", ")}
            </p>
          </div>
          <div className="flex gap-2">
            <select className="h-9 rounded-lg border border-border-strong bg-surface-raised px-3 text-xs text-text-secondary focus:outline-none">
              <option>{incident.status}</option>
              <option>investigating</option>
              <option>contained</option>
              <option>closed</option>
            </select>
            <Button size="sm" onClick={() => toast.success("Incident updated")}>
              Save Changes
            </Button>
          </div>
        </div>

        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-text-secondary">{incident.description}</p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} className="px-3" />
            <CardBody className="pt-5">
              {activeTab === "timeline" && (
                <ul className="space-y-4 border-l border-border pl-5">
                  {[
                    { label: "Incident created from AI-flagged alert", time: incident.createdAt, tone: "bg-severity-critical" },
                    { label: `Assigned to ${incident.assignedTo}`, time: incident.createdAt, tone: "bg-brand-blue" },
                    { label: "Evidence bundle captured and hashed", time: incident.updatedAt, tone: "bg-brand-purple" },
                    incident.blockchainVerified
                      ? { label: "Evidence anchored to Hyperledger Fabric ledger", time: incident.updatedAt, tone: "bg-status-success" }
                      : null,
                    { label: `Status: ${incident.status}`, time: incident.updatedAt, tone: "bg-text-muted" },
                  ]
                    .filter(Boolean)
                    .map((event, i) => (
                      <li key={i} className="relative">
                        <span className={`absolute -left-[25px] top-1 h-2.5 w-2.5 rounded-full ${event!.tone}`} />
                        <p className="text-sm text-text-primary">{event!.label}</p>
                        <p className="text-xs text-text-muted">{new Date(event!.time).toLocaleString()}</p>
                      </li>
                    ))}
                </ul>
              )}

              {activeTab === "evidence" && (
                <div className="space-y-3">
                  <div className="flex aspect-video w-full items-center justify-center rounded-lg border border-dashed border-border-strong bg-surface/50 text-xs text-text-muted">
                    <ImageIcon className="mr-2 h-4 w-4" /> Screenshot capture placeholder
                  </div>
                  {evidence ? (
                    <div className="rounded-lg border border-border bg-surface/60 p-3 text-xs">
                      <div className="flex justify-between py-1">
                        <span className="text-text-muted">Evidence ID</span>
                        <span className="font-mono-data text-text-primary">{evidence.id}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-text-muted">Transaction Hash</span>
                        <span className="font-mono-data text-text-primary">{evidence.txHash}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-text-muted">Block Number</span>
                        <span className="font-mono-data text-text-primary">#{evidence.blockNumber}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-text-muted">No evidence has been anchored to the ledger yet.</p>
                  )}
                </div>
              )}

              {activeTab === "logs" && (
                <pre className="scroll-thin max-h-72 overflow-auto rounded-lg border border-border bg-[#060a14] p-4 font-mono-data text-[11px] leading-relaxed text-text-secondary">
{`[${incident.createdAt}] source=${incident.affectedAssets[0]} event=alert_triggered severity=${incident.severity}
[${incident.createdAt}] engine=ai-ensemble action=score result=flagged confidence=high
[${incident.updatedAt}] actor=${incident.assignedTo} action=incident_created id=${incident.id}
[${incident.updatedAt}] actor=system action=evidence_hash_computed status=ok`}
                </pre>
              )}

              {activeTab === "notes" && (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add an analyst note..." rows={2} className="flex-1" />
                    <Button onClick={addNote} size="icon">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <ul className="space-y-3">
                    {notes.map((n, i) => (
                      <li key={i} className="rounded-lg border border-border bg-surface/60 p-3">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-text-primary">{n.author}</p>
                          <p className="text-[10px] text-text-muted">{n.time}</p>
                        </div>
                        <p className="mt-1 text-sm text-text-secondary">{n.text}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === "mitre" && (
                <ul className="space-y-2">
                  {incident.mitreTechniques.map((t) => (
                    <li key={t} className="flex items-center gap-2 rounded-lg border border-border bg-surface/60 p-3 text-sm text-text-secondary">
                      <Crosshair className="h-4 w-4 text-brand-blue-light" />
                      {t}
                    </li>
                  ))}
                </ul>
              )}
            </CardBody>
          </Card>
        </div>

        <div className="space-y-5">
          <Card>
            <CardHeader title="AI Recommendation" icon={<BrainCircuit className="h-4 w-4" />} />
            <CardBody>
              <p className="text-sm leading-relaxed text-text-secondary">{incident.aiRecommendation}</p>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Blockchain Verification" icon={<Link2 className="h-4 w-4" />} />
            <CardBody>
              {incident.blockchainVerified && evidence ? (
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 rounded-lg border border-status-success/25 bg-status-success/10 p-2.5 text-status-success">
                    <CheckCircle2 className="h-4 w-4" /> Verified on ledger
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-text-muted">Validator</span>
                    <span className="text-text-primary">{evidence.validator}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-text-muted">Anchored</span>
                    <span className="text-text-primary">{new Date(evidence.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-text-muted">This incident has not yet been anchored to the evidence ledger.</p>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
