import { useState } from "react";
import { toast } from "sonner";
import { Plug } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Toggle } from "@/components/ui/Feedback";
import { integrations as initialIntegrations } from "@/mocks/organization";

export function Integrations() {
  const [integrations, setIntegrations] = useState(initialIntegrations);

  function toggleIntegration(id: string) {
    setIntegrations((prev) =>
      prev.map((i) => {
        if (i.id !== id) return i;
        const next = !i.connected;
        toast.success(next ? `${i.name} connected` : `${i.name} disconnected`);
        return { ...i, connected: next };
      })
    );
  }

  return (
    <div className="space-y-5 pb-8">
      <PageHeader
        title="Integrations"
        subtitle={`${integrations.filter((i) => i.connected).length} of ${integrations.length} integrations connected`}
        icon={Plug}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {integrations.map((integration) => (
          <div key={integration.id} className="panel panel-hover p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-surface font-display text-xs font-bold text-brand-blue-light">
                  {integration.logoInitials}
                </div>
                <div>
                  <p className="font-display text-sm font-bold text-text-primary">{integration.name}</p>
                  <p className="text-[11px] text-text-muted">{integration.category}</p>
                </div>
              </div>
              <Toggle checked={integration.connected} onChange={() => toggleIntegration(integration.id)} />
            </div>
            <p className="mt-3 text-xs leading-relaxed text-text-secondary">{integration.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
