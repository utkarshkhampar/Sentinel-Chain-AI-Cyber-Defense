import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { KeyRound, Plus, Copy, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { apiKeys as initialKeys } from "@/mocks/organization";

export function ApiKeys() {
  const [keys, setKeys] = useState(initialKeys);
  const [createOpen, setCreateOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");

  function createKey(e: FormEvent) {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    const newKey = {
      id: `key-${keys.length + 1}`,
      name: newKeyName,
      keyPreview: `sk_live_${Math.random().toString(36).slice(2, 6)}...${Math.random().toString(36).slice(2, 6)}`,
      scopes: ["events:write"],
      createdAt: new Date().toISOString().slice(0, 10),
      lastUsed: "\u2014",
      status: "active" as const,
    };
    setKeys([newKey, ...keys]);
    setNewKeyName("");
    setCreateOpen(false);
    toast.success("API key created", { description: "Copy it now \u2014 you won't be able to see the full key again." });
  }

  function revokeKey(id: string) {
    setKeys((prev) => prev.map((k) => (k.id === id ? { ...k, status: "revoked" as const } : k)));
    toast.success("API key revoked");
  }

  function copyKey(preview: string) {
    navigator.clipboard?.writeText(preview);
    toast.success("Copied to clipboard");
  }

  return (
    <div className="space-y-5 pb-8">
      <PageHeader
        title="API Keys"
        subtitle="Manage programmatic access to the Sentinel Chain API"
        icon={KeyRound}
        actions={
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus className="h-3.5 w-3.5" /> Generate Key
          </Button>
        }
      />

      <div className="panel overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border text-[10px] uppercase tracking-wide text-text-muted">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Key</th>
              <th className="px-4 py-3 font-medium">Scopes</th>
              <th className="px-4 py-3 font-medium">Last Used</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {keys.map((k) => (
              <tr key={k.id} className="border-b border-border/50 text-xs last:border-0 hover:bg-white/[0.02]">
                <td className="px-4 py-3 font-medium text-text-primary">{k.name}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono-data text-text-secondary">{k.keyPreview}</span>
                    <button onClick={() => copyKey(k.keyPreview)} className="text-text-muted hover:text-text-primary">
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {k.scopes.map((s) => (
                      <Badge key={s} variant="outline">{s}</Badge>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-text-muted">{k.lastUsed === "\u2014" ? "\u2014" : new Date(k.lastUsed).toLocaleString()}</td>
                <td className="px-4 py-3">
                  <Badge variant={k.status === "active" ? "success" : "danger"}>{k.status}</Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  {k.status === "active" && (
                    <button onClick={() => revokeKey(k.id)} className="text-text-muted hover:text-severity-critical">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Generate a new API key" size="sm">
        <form onSubmit={createKey} className="space-y-4">
          <Input label="Key name" placeholder="e.g. Production Ingestion Key" value={newKeyName} onChange={(e) => setNewKeyName(e.target.value)} required />
          <Button type="submit" className="w-full">Generate Key</Button>
        </form>
      </Modal>
    </div>
  );
}
