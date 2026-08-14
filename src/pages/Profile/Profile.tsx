import { toast } from "sonner";
import { UserCircle, Mail, Shield, Clock, Save, Camera } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/authStore";
import { socTeam } from "@/mocks/organization";

export function Profile() {
  const user = useAuthStore((s) => s.user);
  const stats = socTeam[0];

  return (
    <div className="space-y-5 pb-8">
      <PageHeader title="Profile" subtitle="Your account details and activity" icon={UserCircle} />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardBody className="flex flex-col items-center pt-8 text-center">
              <div className="relative">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-brand-blue to-brand-purple font-display text-2xl font-bold text-white shadow-glow">
                  {user?.avatarInitials ?? "SA"}
                </div>
                <button className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface-raised text-text-secondary hover:text-text-primary">
                  <Camera className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="mt-4 font-display text-lg font-bold text-text-primary">{user?.name ?? "SOC Analyst"}</p>
              <p className="text-sm text-text-muted">{user?.role ?? "Administrator"}</p>
              <div className="mt-5 grid w-full grid-cols-2 gap-3">
                <div className="rounded-lg border border-border bg-surface/60 p-3">
                  <p className="font-display text-lg font-bold text-text-primary">{stats.incidentsResolved}</p>
                  <p className="text-[10px] text-text-muted">Resolved</p>
                </div>
                <div className="rounded-lg border border-border bg-surface/60 p-3">
                  <p className="font-display text-lg font-bold text-text-primary">{stats.avgResponseTime}</p>
                  <p className="text-[10px] text-text-muted">Avg Response</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="space-y-5 lg:col-span-2">
          <Card>
            <CardHeader title="Personal Information" />
            <CardBody className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input label="Full Name" defaultValue={user?.name ?? "SOC Analyst"} />
                <Input label="Email" icon={Mail} defaultValue={user?.email ?? "analyst@sentinelchain.io"} type="email" />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input label="Role" icon={Shield} defaultValue={user?.role ?? "Administrator"} disabled />
                <Input label="Timezone" icon={Clock} defaultValue="Asia/Kolkata (UTC+5:30)" />
              </div>
              <Button onClick={() => toast.success("Profile updated")}>
                <Save className="h-4 w-4" /> Save Changes
              </Button>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Recent Activity" />
            <CardBody>
              <ul className="space-y-3 border-l border-border pl-5">
                {[
                  "Approved automated response for INC-1024",
                  "Updated incident status for INC-1025",
                  "Generated weekly SOC performance report",
                  "Reviewed 12 AI-flagged alerts",
                ].map((activity, i) => (
                  <li key={i} className="relative text-sm text-text-secondary">
                    <span className="absolute -left-[25px] top-1.5 h-2 w-2 rounded-full bg-brand-blue" />
                    {activity}
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
