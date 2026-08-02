import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Users as UsersIcon, Plus, Search, ShieldCheck, ShieldOff } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { systemUsers } from "@/mocks/organization";
import { formatRelativeTime } from "@/utils/format";

const statusVariant: Record<string, any> = { active: "success", suspended: "danger", invited: "warning" };

export function Users() {
  const [search, setSearch] = useState("");
  const [inviteOpen, setInviteOpen] = useState(false);

  const filtered = systemUsers.filter(
    (u) => search === "" || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  function sendInvite(e: FormEvent) {
    e.preventDefault();
    toast.success("Invite sent", { description: "The user will receive an email to join Sentinel Chain." });
    setInviteOpen(false);
  }

  return (
    <div className="space-y-5 pb-8">
      <PageHeader
        title="Users"
        subtitle={`${systemUsers.length} users across your organization`}
        icon={UsersIcon}
        actions={
          <Button size="sm" onClick={() => setInviteOpen(true)}>
            <Plus className="h-3.5 w-3.5" /> Invite User
          </Button>
        }
      />

      <div className="panel p-3">
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="h-9 w-full rounded-lg border border-border bg-surface pl-9 pr-3 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-blue/50 focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
          />
        </div>
      </div>

      <div className="panel overflow-x-auto">
        <table className="w-full min-w-[680px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border text-[10px] uppercase tracking-wide text-text-muted">
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">MFA</th>
              <th className="px-4 py-3 font-medium">Last Active</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-b border-border/50 last:border-0 hover:bg-white/[0.02]">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-blue to-brand-purple text-[11px] font-bold text-white">
                      {u.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-medium text-text-primary">{u.name}</p>
                      <p className="text-xs text-text-muted">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3"><Badge variant="outline">{u.role}</Badge></td>
                <td className="px-4 py-3"><Badge variant={statusVariant[u.status]}>{u.status}</Badge></td>
                <td className="px-4 py-3">
                  {u.mfaEnabled ? (
                    <span className="flex items-center gap-1 text-xs text-status-success"><ShieldCheck className="h-3.5 w-3.5" /> Enabled</span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-text-muted"><ShieldOff className="h-3.5 w-3.5" /> Disabled</span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-text-muted">{u.lastActive === "\u2014" ? "\u2014" : formatRelativeTime(u.lastActive)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={inviteOpen} onClose={() => setInviteOpen(false)} title="Invite a new user" size="sm">
        <form onSubmit={sendInvite} className="space-y-4">
          <Input label="Full name" placeholder="Jordan Ellis" required />
          <Input label="Work email" type="email" placeholder="jordan@company.com" required />
          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-secondary">Role</label>
            <select className="h-10 w-full rounded-lg border border-border bg-surface-raised px-3 text-sm text-text-primary focus:border-brand-blue/50 focus:outline-none focus:ring-2 focus:ring-brand-blue/20">
              <option>Analyst</option>
              <option>Administrator</option>
              <option>Auditor</option>
              <option>Read-Only</option>
            </select>
          </div>
          <Button type="submit" className="w-full">Send Invite</Button>
        </form>
      </Modal>
    </div>
  );
}
