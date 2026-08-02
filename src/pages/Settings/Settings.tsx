import { useState } from "react";
import { toast } from "sonner";
import { Settings as SettingsIcon, User, Shield, Bell, Palette, Globe, Key, Save } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { Tabs, type TabItem } from "@/components/ui/Tabs";
import { Toggle } from "@/components/ui/Feedback";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";

const tabs: TabItem[] = [
  { id: "general", label: "General", icon: <SettingsIcon className="h-3.5 w-3.5" /> },
  { id: "security", label: "Security", icon: <Shield className="h-3.5 w-3.5" /> },
  { id: "notifications", label: "Notifications", icon: <Bell className="h-3.5 w-3.5" /> },
  { id: "appearance", label: "Theme", icon: <Palette className="h-3.5 w-3.5" /> },
  { id: "language", label: "Language", icon: <Globe className="h-3.5 w-3.5" /> },
  { id: "api", label: "API", icon: <Key className="h-3.5 w-3.5" /> },
  { id: "account", label: "Account", icon: <User className="h-3.5 w-3.5" /> },
];

const accentColors = [
  { id: "blue-purple", label: "Blue / Purple", classes: "from-brand-blue to-brand-purple" },
  { id: "cyan-blue", label: "Cyan / Blue", classes: "from-brand-cyan to-brand-blue" },
  { id: "purple-pink", label: "Purple / Pink", classes: "from-brand-purple to-severity-critical" },
];

export function Settings() {
  const [active, setActive] = useState("general");
  const [notif, setNotif] = useState({ email: true, push: true, sms: false, criticalOnly: false });
  const [accent, setAccent] = useState("blue-purple");

  function save() {
    toast.success("Settings saved");
  }

  return (
    <div className="space-y-5 pb-8">
      <PageHeader title="Settings" subtitle="Manage platform configuration and preferences" icon={SettingsIcon} />

      <Card>
        <Tabs tabs={tabs} active={active} onChange={setActive} className="px-3" />
        <CardBody className="max-w-2xl space-y-5 pt-5">
          {active === "general" && (
            <>
              <Input label="Organization Name" defaultValue="Acme Corporation" />
              <Input label="SOC Timezone" defaultValue="Asia/Kolkata (UTC+5:30)" />
              <div className="flex items-center justify-between rounded-lg border border-border bg-surface/60 p-4">
                <Toggle checked label="Auto-refresh dashboards" description="Refresh live data every 30 seconds" onChange={() => {}} />
              </div>
              <Button onClick={save}><Save className="h-4 w-4" /> Save Changes</Button>
            </>
          )}

          {active === "security" && (
            <>
              <div className="rounded-lg border border-border bg-surface/60 p-4">
                <Toggle checked label="Require MFA for all users" description="Enforce two-factor authentication org-wide" onChange={() => {}} />
              </div>
              <div className="rounded-lg border border-border bg-surface/60 p-4">
                <Toggle checked label="Session timeout" description="Automatically log out inactive sessions after 30 minutes" onChange={() => {}} />
              </div>
              <div className="rounded-lg border border-border bg-surface/60 p-4">
                <Toggle label="IP allowlisting" description="Restrict console access to approved IP ranges" onChange={() => {}} />
              </div>
              <Button onClick={save}><Save className="h-4 w-4" /> Save Changes</Button>
            </>
          )}

          {active === "notifications" && (
            <>
              <div className="rounded-lg border border-border bg-surface/60 p-4">
                <Toggle checked={notif.email} onChange={(v) => setNotif({ ...notif, email: v })} label="Email notifications" description="Incident and report notifications via email" />
              </div>
              <div className="rounded-lg border border-border bg-surface/60 p-4">
                <Toggle checked={notif.push} onChange={(v) => setNotif({ ...notif, push: v })} label="Push notifications" description="Browser and mobile push alerts" />
              </div>
              <div className="rounded-lg border border-border bg-surface/60 p-4">
                <Toggle checked={notif.sms} onChange={(v) => setNotif({ ...notif, sms: v })} label="SMS notifications" description="Critical alerts only, via SMS" />
              </div>
              <div className="rounded-lg border border-border bg-surface/60 p-4">
                <Toggle checked={notif.criticalOnly} onChange={(v) => setNotif({ ...notif, criticalOnly: v })} label="Critical alerts only" description="Suppress medium/low severity notifications" />
              </div>
              <Button onClick={save}><Save className="h-4 w-4" /> Save Changes</Button>
            </>
          )}

          {active === "appearance" && (
            <>
              <p className="text-xs font-medium text-text-secondary">Accent Gradient</p>
              <div className="grid grid-cols-3 gap-3">
                {accentColors.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setAccent(c.id)}
                    className={cn(
                      "rounded-xl border p-3 transition-colors",
                      accent === c.id ? "border-brand-blue/50 bg-white/5" : "border-border hover:bg-white/[0.03]"
                    )}
                  >
                    <div className={cn("h-10 w-full rounded-lg bg-gradient-to-r", c.classes)} />
                    <p className="mt-2 text-[11px] text-text-secondary">{c.label}</p>
                  </button>
                ))}
              </div>
              <div className="rounded-lg border border-border bg-surface/60 p-4">
                <Toggle checked label="Dark mode" description="Sentinel Chain is optimized for dark mode SOC environments" onChange={() => {}} />
              </div>
              <Button onClick={save}><Save className="h-4 w-4" /> Save Changes</Button>
            </>
          )}

          {active === "language" && (
            <>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-text-secondary">Display Language</label>
                <select className="h-10 w-full rounded-lg border border-border bg-surface-raised px-3 text-sm text-text-primary focus:border-brand-blue/50 focus:outline-none focus:ring-2 focus:ring-brand-blue/20">
                  <option>English (US)</option>
                  <option>English (UK)</option>
                  <option>Hindi</option>
                  <option>Spanish</option>
                  <option>German</option>
                  <option>Japanese</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-text-secondary">Date Format</label>
                <select className="h-10 w-full rounded-lg border border-border bg-surface-raised px-3 text-sm text-text-primary focus:border-brand-blue/50 focus:outline-none focus:ring-2 focus:ring-brand-blue/20">
                  <option>DD/MM/YYYY</option>
                  <option>MM/DD/YYYY</option>
                  <option>YYYY-MM-DD</option>
                </select>
              </div>
              <Button onClick={save}><Save className="h-4 w-4" /> Save Changes</Button>
            </>
          )}

          {active === "api" && (
            <>
              <p className="text-sm text-text-secondary">
                Manage programmatic access from the dedicated <a href="/api-keys" className="text-brand-blue-light hover:underline">API Keys</a> page.
              </p>
              <div className="rounded-lg border border-border bg-surface/60 p-4">
                <Toggle checked label="Enable webhook delivery" description="Send incident events to configured webhook endpoints" onChange={() => {}} />
              </div>
              <Input label="Webhook URL" placeholder="https://yourapp.com/webhooks/sentinel-chain" />
              <Button onClick={save}><Save className="h-4 w-4" /> Save Changes</Button>
            </>
          )}

          {active === "account" && (
            <>
              <Input label="Full Name" defaultValue="SOC Analyst" />
              <Input label="Email" defaultValue="analyst@sentinelchain.io" type="email" />
              <Input label="Change Password" type="password" placeholder="New password" />
              <Button onClick={save}><Save className="h-4 w-4" /> Save Changes</Button>
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
