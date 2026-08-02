import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Server, Search, Plus, Laptop, Smartphone, Cloud, ShieldHalf, Database, Container, Network as NetworkIcon, Boxes } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/Feedback";
import { mockAssets } from "@/mocks/incidents";
import type { AssetStatus, AssetType } from "@/types";
import { cn } from "@/utils/cn";

const typeIcons: Record<AssetType, any> = {
  server: Server,
  laptop: Laptop,
  mobile: Smartphone,
  cloud: Cloud,
  firewall: ShieldHalf,
  switch: NetworkIcon,
  database: Database,
  container: Container,
  kubernetes: Boxes,
};

const statusTone: Record<AssetStatus, string> = {
  healthy: "success",
  "at-risk": "warning",
  compromised: "danger",
  offline: "default",
};

const typeFilters: (AssetType | "all")[] = ["all", "server", "laptop", "mobile", "cloud", "firewall", "switch", "database", "container", "kubernetes"];

export function Assets() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<AssetType | "all">("all");

  const filtered = useMemo(() => {
    return mockAssets.filter((a) => {
      const matchesSearch = search === "" || a.name.toLowerCase().includes(search.toLowerCase()) || a.ipAddress.includes(search);
      const matchesType = typeFilter === "all" || a.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [search, typeFilter]);

  return (
    <div className="space-y-5 pb-8">
      <PageHeader
        title="Assets"
        subtitle={`${mockAssets.length} monitored assets across your environment`}
        icon={Server}
        actions={
          <Button size="sm">
            <Plus className="h-3.5 w-3.5" /> Register Asset
          </Button>
        }
      />

      <div className="panel flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search assets by name or IP..."
            className="h-9 w-full rounded-lg border border-border bg-surface pl-9 pr-3 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-blue/50 focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
          />
        </div>
        <div className="scroll-thin flex items-center gap-1.5 overflow-x-auto">
          {typeFilters.map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={cn(
                "shrink-0 rounded-md border px-2.5 py-1 text-[11px] font-medium capitalize transition-colors",
                typeFilter === t ? "border-brand-blue/40 bg-brand-blue/15 text-brand-blue-light" : "border-border text-text-muted hover:text-text-secondary"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="panel">
          <EmptyState icon={Server} title="No assets found" description="Try a different search term or type filter." />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((asset) => {
            const Icon = typeIcons[asset.type];
            return (
              <button
                key={asset.id}
                onClick={() => navigate(`/assets/${asset.id}`)}
                className="panel panel-hover flex flex-col p-4 text-left"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface text-brand-blue-light">
                    <Icon className="h-5 w-5" />
                  </div>
                  <Badge variant={statusTone[asset.status] as any}>{asset.status}</Badge>
                </div>
                <p className="mt-3 font-display text-sm font-bold text-text-primary">{asset.name}</p>
                <p className="font-mono-data text-xs text-text-muted">{asset.ipAddress}</p>
                <div className="mt-3 space-y-1 text-xs text-text-secondary">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Owner</span>
                    <span>{asset.owner}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Location</span>
                    <span>{asset.location}</span>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="mb-1 flex justify-between text-[10px] text-text-muted">
                    <span>Risk Score</span>
                    <span>{asset.riskScore}/100</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        asset.riskScore >= 70 ? "bg-severity-critical" : asset.riskScore >= 40 ? "bg-severity-high" : "bg-status-success"
                      )}
                      style={{ width: `${asset.riskScore}%` }}
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
