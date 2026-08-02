import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { threatTimeline } from "@/mocks/threats";

export function ThreatTimelineChart() {
  return (
    <Card>
      <CardHeader title="Threat Timeline" icon={<TrendingUp className="h-4 w-4" />} subtitle="Threats & incidents over the last 24 hours" />
      <CardBody>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={threatTimeline} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="threatsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="incidentsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="time" tick={{ fill: "#5b6b85", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#5b6b85", fontSize: 11 }} axisLine={false} tickLine={false} width={28} />
              <Tooltip
                contentStyle={{
                  background: "#111a2e",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                labelStyle={{ color: "#94a3b8" }}
              />
              <Area type="monotone" dataKey="threats" name="Threats" stroke="#3b82f6" strokeWidth={2} fill="url(#threatsGradient)" />
              <Area type="monotone" dataKey="incidents" name="Incidents" stroke="#8b5cf6" strokeWidth={2} fill="url(#incidentsGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardBody>
    </Card>
  );
}
