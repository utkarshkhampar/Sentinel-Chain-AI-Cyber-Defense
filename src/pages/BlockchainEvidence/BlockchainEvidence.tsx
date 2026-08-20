import { useNavigate } from "react-router-dom";
import { Link2, CheckCircle2, Blocks, Search } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { blockchainRecords } from "@/mocks/system";

export function BlockchainEvidence() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filtered = blockchainRecords.filter(
    (r) => search === "" || r.id.toLowerCase().includes(search.toLowerCase()) || r.txHash.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5 pb-8">
      <PageHeader title="Blockchain Evidence" subtitle="Hyperledger Fabric evidence ledger explorer" icon={Link2} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card><CardBody className="flex items-center gap-3 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-status-success/15 text-status-success"><CheckCircle2 className="h-5 w-5" /></div>
          <div><p className="text-xs text-text-muted">Verified Records</p><p className="font-display text-xl font-bold text-text-primary">1,245</p></div>
        </CardBody></Card>
        <Card><CardBody className="flex items-center gap-3 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-blue/15 text-brand-blue-light"><Blocks className="h-5 w-5" /></div>
          <div><p className="text-xs text-text-muted">Latest Block</p><p className="font-display text-xl font-bold text-text-primary">#{blockchainRecords[0].blockNumber}</p></div>
        </CardBody></Card>
        <Card><CardBody className="flex items-center gap-3 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-purple/15 text-brand-purple-light"><Link2 className="h-5 w-5" /></div>
          <div><p className="text-xs text-text-muted">Network Peers</p><p className="font-display text-xl font-bold text-text-primary">4 / 4 Healthy</p></div>
        </CardBody></Card>
      </div>

      <Card>
        <CardHeader
          title="Evidence Records"
          action={
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by ID or hash..."
                className="h-8 w-48 rounded-lg border border-border bg-surface pl-8 pr-2 text-xs text-text-primary placeholder:text-text-muted focus:border-brand-blue/50 focus:outline-none"
              />
            </div>
          }
        />
        <div className="overflow-x-auto px-2 pb-4">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr className="text-[10px] uppercase tracking-wide text-text-muted">
                <th className="px-3 py-2 font-medium">Evidence ID</th>
                <th className="px-3 py-2 font-medium">Block #</th>
                <th className="px-3 py-2 font-medium">Tx Hash</th>
                <th className="px-3 py-2 font-medium">Incident</th>
                <th className="px-3 py-2 font-medium">Validator</th>
                <th className="px-3 py-2 font-medium">Timestamp</th>
                <th className="px-3 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr
                  key={r.id}
                  onClick={() => navigate(`/blockchain-evidence/${r.id}`)}
                  className="cursor-pointer rounded-lg text-xs hover:bg-white/[0.03]"
                >
                  <td className="px-3 py-2.5 font-mono-data text-brand-blue-light">{r.id}</td>
                  <td className="px-3 py-2.5 font-mono-data text-text-secondary">#{r.blockNumber}</td>
                  <td className="px-3 py-2.5 font-mono-data text-text-secondary">{r.txHash}</td>
                  <td className="px-3 py-2.5 text-text-primary">{r.incidentId}</td>
                  <td className="px-3 py-2.5 text-text-secondary">{r.validator}</td>
                  <td className="px-3 py-2.5 text-text-muted">{new Date(r.timestamp).toLocaleString()}</td>
                  <td className="px-3 py-2.5">
                    {r.verified ? (
                      <span className="flex items-center gap-1 text-status-success"><CheckCircle2 className="h-3.5 w-3.5" /> Verified</span>
                    ) : (
                      <span className="text-text-muted">Pending</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
