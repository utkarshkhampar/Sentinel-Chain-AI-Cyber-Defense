import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Link2, CheckCircle2, Loader2, FileSignature, Blocks } from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/Feedback";
import { blockchainRecords } from "@/mocks/system";
import { mockIncidents } from "@/mocks/incidents";

export function EvidenceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<"match" | null>(null);

  const record = blockchainRecords.find((r) => r.id === id);
  const incident = mockIncidents.find((i) => i.id === record?.incidentId);

  if (!record) {
    return (
      <div className="panel">
        <EmptyState
          icon={Link2}
          title="Evidence record not found"
          description={`No record matches ID "${id}".`}
          action={<Button variant="secondary" onClick={() => navigate("/blockchain-evidence")}>Back to Evidence</Button>}
        />
      </div>
    );
  }

  function runVerification() {
    setVerifying(true);
    setVerifyResult(null);
    setTimeout(() => {
      setVerifying(false);
      setVerifyResult("match");
      toast.success("Integrity verified", { description: "Recomputed hash matches the ledger-anchored value." });
    }, 1400);
  }

  return (
    <div className="space-y-5 pb-8">
      <button onClick={() => navigate("/blockchain-evidence")} className="flex items-center gap-1.5 text-sm font-medium text-text-muted hover:text-text-primary">
        <ArrowLeft className="h-4 w-4" /> Back to Evidence
      </button>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Card>
            <CardHeader title="Evidence Record" icon={<Link2 className="h-4 w-4" />} subtitle={record.id} />
            <CardBody className="space-y-3 text-sm">
              {[
                { label: "Block Number", value: `#${record.blockNumber}`, mono: true },
                { label: "Transaction Hash", value: record.txHash, mono: true },
                { label: "Incident", value: record.incidentId },
                { label: "Validator", value: record.validator },
                { label: "Timestamp", value: new Date(record.timestamp).toLocaleString() },
                { label: "Digital Signature", value: record.digitalSignature, mono: true },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between border-b border-border/60 py-2 last:border-0">
                  <span className="text-text-muted">{row.label}</span>
                  <span className={`text-text-primary ${row.mono ? "font-mono-data text-xs" : ""}`}>{row.value}</span>
                </div>
              ))}
            </CardBody>
          </Card>

          {incident && (
            <Card>
              <CardHeader title="Linked Incident" />
              <CardBody>
                <div
                  onClick={() => navigate(`/incidents/${incident.id}`)}
                  className="cursor-pointer rounded-lg border border-border bg-surface/60 p-3.5 hover:bg-white/[0.03]"
                >
                  <p className="font-mono-data text-xs text-brand-blue-light">{incident.id}</p>
                  <p className="mt-0.5 text-sm font-medium text-text-primary">{incident.title}</p>
                  <p className="mt-1 text-xs text-text-muted">{incident.description.slice(0, 140)}...</p>
                </div>
              </CardBody>
            </Card>
          )}

          <Card>
            <CardHeader title="Chain of Custody" icon={<FileSignature className="h-4 w-4" />} />
            <CardBody>
              <ul className="space-y-3 border-l border-border pl-5">
                <li className="relative text-sm">
                  <span className="absolute -left-[25px] top-1 h-2.5 w-2.5 rounded-full bg-brand-blue" />
                  <p className="text-text-primary">Evidence hash computed and submitted for endorsement</p>
                  <p className="text-xs text-text-muted">{new Date(record.timestamp).toLocaleString()}</p>
                </li>
                <li className="relative text-sm">
                  <span className="absolute -left-[25px] top-1 h-2.5 w-2.5 rounded-full bg-brand-purple" />
                  <p className="text-text-primary">Endorsed by {record.validator} and counterpart organization peer</p>
                </li>
                <li className="relative text-sm">
                  <span className="absolute -left-[25px] top-1 h-2.5 w-2.5 rounded-full bg-status-success" />
                  <p className="text-text-primary">Committed to block #{record.blockNumber}</p>
                </li>
              </ul>
            </CardBody>
          </Card>
        </div>

        <div className="space-y-5">
          <Card>
            <CardHeader title="Verify Integrity" icon={<Blocks className="h-4 w-4" />} />
            <CardBody>
              <p className="text-xs text-text-secondary">
                Recompute the hash of the stored evidence artefact and compare it against the value anchored on the
                ledger.
              </p>
              <Button onClick={runVerification} disabled={verifying} className="mt-4 w-full">
                {verifying ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                {verifying ? "Verifying..." : "Run Verification"}
              </Button>
              {verifyResult === "match" && (
                <div className="mt-4 flex items-center gap-2 rounded-lg border border-status-success/25 bg-status-success/10 p-3 text-sm text-status-success">
                  <CheckCircle2 className="h-4 w-4" /> Hash matches \u2014 evidence is intact.
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
