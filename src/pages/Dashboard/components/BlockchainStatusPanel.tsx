import { Link2, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { blockchainRecords } from "@/mocks/system";

const stats = [
  { label: "Evidence Records", value: "1,245" },
  { label: "Verified Records", value: "1,245" },
  { label: "Integrity Status", value: "100%" },
  { label: "Latest Block", value: `#${blockchainRecords[0].blockNumber}` },
];

export function BlockchainStatusPanel() {
  const navigate = useNavigate();
  return (
    <Card>
      <CardHeader
        title="Blockchain Evidence Status"
        icon={<Link2 className="h-4 w-4" />}
        action={<button onClick={() => navigate("/blockchain-evidence")} className="text-xs font-medium text-brand-blue-light hover:underline">View Ledger</button>}
      />
      <CardBody>
        <div className="mb-4 flex items-center gap-3 rounded-lg border border-status-success/25 bg-status-success/10 p-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-status-success/15">
            <CheckCircle2 className="h-5 w-5 text-status-success" />
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary">Network Connected</p>
            <p className="text-xs text-status-success">Consensus Healthy \u00b7 4/4 peers</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {stats.map((s) => (
            <div key={s.label} className="rounded-lg border border-border bg-surface/60 p-2.5">
              <p className="text-[10px] uppercase tracking-wide text-text-muted">{s.label}</p>
              <p className="mt-0.5 font-mono-data text-sm font-semibold text-text-primary">{s.value}</p>
            </div>
          ))}
        </div>

        <p className="mt-3 text-center text-[11px] text-text-muted">
          Last updated {new Date(blockchainRecords[0].timestamp).toLocaleTimeString()}
        </p>
      </CardBody>
    </Card>
  );
}
