import { UsersRound, Mail, Clock, Award } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { socTeam } from "@/mocks/organization";

const shiftTone: Record<string, string> = {
  Day: "border-brand-blue/30 bg-brand-blue/10 text-brand-blue-light",
  Night: "border-brand-purple/30 bg-brand-purple/10 text-brand-purple-light",
  Rotating: "border-severity-medium/30 bg-severity-medium/10 text-severity-medium",
};

export function SOCTeam() {
  return (
    <div className="space-y-5 pb-8">
      <PageHeader title="SOC Team" subtitle="Analyst roster, shifts, and performance" icon={UsersRound} />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {socTeam.map((member) => (
          <div key={member.id} className="panel panel-hover p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-brand-blue to-brand-purple text-sm font-bold text-white shadow-glow">
                  {member.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="font-display text-sm font-bold text-text-primary">{member.name}</p>
                  <p className="text-xs text-text-muted">{member.title}</p>
                </div>
              </div>
              <span className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold ${shiftTone[member.shift]}`}>{member.shift}</span>
            </div>

            <div className="mt-4 flex items-center gap-1.5 text-xs text-text-muted">
              <Mail className="h-3.5 w-3.5" /> {member.email}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-lg border border-border bg-surface/60 p-2.5 text-center">
                <p className="flex items-center justify-center gap-1 text-[10px] text-text-muted"><Award className="h-3 w-3" /> Resolved</p>
                <p className="mt-0.5 font-display text-lg font-bold text-text-primary">{member.incidentsResolved}</p>
              </div>
              <div className="rounded-lg border border-border bg-surface/60 p-2.5 text-center">
                <p className="flex items-center justify-center gap-1 text-[10px] text-text-muted"><Clock className="h-3 w-3" /> Avg Response</p>
                <p className="mt-0.5 font-display text-lg font-bold text-text-primary">{member.avgResponseTime}</p>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <Badge variant={member.status === "active" ? "success" : "warning"}>{member.status}</Badge>
              <Badge variant="outline">{member.role}</Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
