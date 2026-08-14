import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Server, ShieldAlert, Clock, Tag, MapPin, User as UserIcon } from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge, SeverityBadge, StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/Feedback";
import { mockAssets, mockIncidents } from "@/mocks/incidents";
import { mockThreats } from "@/mocks/threats";

export function AssetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const asset = mockAssets.find((a) => a.id === id);

  if (!asset) {
    return (
      <div className="panel">
        <EmptyState
          icon={Server}
          title="Asset not found"
          description={`No asset matches ID "${id}".`}
          action={
            <Button variant="secondary" onClick={() => navigate("/assets")}>
              Back to Assets
            </Button>
          }
        />
      </div>
    );
  }

  const relatedThreats = mockThreats.filter((t) => t.targetAsset === asset.name);
  const relatedIncidents = mockIncidents.filter((i) => i.affectedAssets.includes(asset.name));

  return (
    <div className="space-y-5 pb-8">
      <button onClick={() => navigate("/assets")} className="flex items-center gap-1.5 text-sm font-medium text-text-muted hover:text-text-primary">
        <ArrowLeft className="h-4 w-4" /> Back to Assets
      </button>

      <div className="panel p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-surface text-brand-blue-light">
              <Server className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-xl font-bold text-text-primary">{asset.name}</h1>
                <Badge variant={asset.status === "healthy" ? "success" : asset.status === "compromised" ? "danger" : "warning"}>
                  {asset.status}
                </Badge>
              </div>
              <p className="mt-1 font-mono-data text-xs text-text-muted">{asset.id} \u00b7 {asset.ipAddress}</p>
            </div>
          </div>
          <Button size="sm" variant="danger">
            <ShieldAlert className="h-3.5 w-3.5" /> Isolate Asset
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Card>
            <CardHeader title="Threat Activity" icon={<ShieldAlert className="h-4 w-4" />} />
            <CardBody>
              {relatedThreats.length === 0 ? (
                <p className="text-sm text-text-muted">No recent threats detected against this asset.</p>
              ) : (
                <ul className="space-y-2.5">
                  {relatedThreats.map((t) => (
                    <li key={t.id} className="flex items-center justify-between rounded-lg border border-border bg-surface/60 p-3">
                      <div>
                        <p className="text-sm font-medium text-text-primary">{t.title}</p>
                        <p className="text-xs text-text-muted">{new Date(t.detectedAt).toLocaleString()}</p>
                      </div>
                      <SeverityBadge severity={t.severity} />
                    </li>
                  ))}
                </ul>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Related Incidents" icon={<Clock className="h-4 w-4" />} />
            <CardBody>
              {relatedIncidents.length === 0 ? (
                <p className="text-sm text-text-muted">No incidents linked to this asset.</p>
              ) : (
                <ul className="space-y-2.5">
                  {relatedIncidents.map((inc) => (
                    <li
                      key={inc.id}
                      onClick={() => navigate(`/incidents/${inc.id}`)}
                      className="flex cursor-pointer items-center justify-between rounded-lg border border-border bg-surface/60 p-3 hover:bg-white/[0.04]"
                    >
                      <div>
                        <p className="font-mono-data text-xs text-brand-blue-light">{inc.id}</p>
                        <p className="text-sm font-medium text-text-primary">{inc.title}</p>
                      </div>
                      <StatusBadge status={inc.status} />
                    </li>
                  ))}
                </ul>
              )}
            </CardBody>
          </Card>
        </div>

        <div className="space-y-5">
          <Card>
            <CardHeader title="Asset Details" />
            <CardBody className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-text-muted"><UserIcon className="h-3.5 w-3.5" /> Owner</span>
                <span className="text-text-primary">{asset.owner}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-text-muted"><MapPin className="h-3.5 w-3.5" /> Location</span>
                <span className="text-text-primary">{asset.location}</span>
              </div>
              {asset.os && (
                <div className="flex items-center justify-between">
                  <span className="text-text-muted">Operating System</span>
                  <span className="text-text-primary">{asset.os}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-text-muted">Last Seen</span>
                <span className="text-text-primary">{new Date(asset.lastSeen).toLocaleString()}</span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <Tag className="h-3.5 w-3.5 text-text-muted" />
                {asset.tags.map((tag) => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Risk Score" />
            <CardBody>
              <div className="flex items-center gap-4">
                <div className="relative flex h-20 w-20 items-center justify-center">
                  <svg viewBox="0 0 80 80" className="h-20 w-20 -rotate-90">
                    <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                    <circle
                      cx="40" cy="40" r="34" fill="none"
                      stroke={asset.riskScore >= 70 ? "#ef4444" : asset.riskScore >= 40 ? "#f97316" : "#10b981"}
                      strokeWidth="8" strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 34}
                      strokeDashoffset={2 * Math.PI * 34 * (1 - asset.riskScore / 100)}
                    />
                  </svg>
                  <span className="absolute font-display text-lg font-bold text-text-primary">{asset.riskScore}</span>
                </div>
                <p className="text-xs text-text-secondary">
                  {asset.riskScore >= 70
                    ? "High risk \u2014 recommend immediate review."
                    : asset.riskScore >= 40
                    ? "Elevated risk \u2014 monitor closely."
                    : "Low risk \u2014 operating within normal parameters."}
                </p>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
