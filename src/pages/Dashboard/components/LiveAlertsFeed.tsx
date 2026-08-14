import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader } from "@/components/ui/Card";
import { SeverityBadge, StatusBadge } from "@/components/ui/Badge";
import { mockAlerts } from "@/mocks/incidents";

export function LiveAlertsFeed() {
  const navigate = useNavigate();
  return (
    <Card className="flex flex-col">
      <CardHeader
        title="Live Alerts"
        icon={<Bell className="h-4 w-4" />}
        action={
          <button onClick={() => navigate("/live-threats")} className="text-xs font-medium text-brand-blue-light hover:underline">View All</button>
        }
      />
      <div className="scroll-thin max-h-[380px] overflow-y-auto px-2 pb-4">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="text-[10px] uppercase tracking-wide text-text-muted">
              <th className="px-3 py-1.5 font-medium">Time</th>
              <th className="px-3 py-1.5 font-medium">Severity</th>
              <th className="px-3 py-1.5 font-medium">Source</th>
              <th className="px-3 py-1.5 font-medium">Alert</th>
              <th className="px-3 py-1.5 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {mockAlerts.map((alert) => (
              <tr key={alert.id} className="group cursor-pointer text-xs hover:bg-white/[0.03]">
                <td className="whitespace-nowrap rounded-l-lg px-3 py-2.5 font-mono-data text-text-muted">
                  {alert.time}
                </td>
                <td className="px-3 py-2.5">
                  <SeverityBadge severity={alert.severity} />
                </td>
                <td className="px-3 py-2.5 text-text-secondary">{alert.source}</td>
                <td className="px-3 py-2.5 font-medium text-text-primary">{alert.message}</td>
                <td className="whitespace-nowrap rounded-r-lg px-3 py-2.5">
                  <StatusBadge status={alert.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
