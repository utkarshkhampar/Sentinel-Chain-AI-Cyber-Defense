import { Fragment } from "react";
import { BarChart3 } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar as RadarPlot } from "recharts";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { threatTimeline, attackTypeFrequency, geoThreatPoints } from "@/mocks/threats";

const tooltipStyle = { background: "#111a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 };

const riskByDept = [
  { subject: "Finance", risk: 82 },
  { subject: "Engineering", risk: 58 },
  { subject: "Sales", risk: 34 },
  { subject: "HR", risk: 21 },
  { subject: "Legal", risk: 45 },
  { subject: "IT Ops", risk: 63 },
];

const weekdayHeat = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => ({
  day,
  hours: Array.from({ length: 12 }, () => Math.floor(Math.random() * 100)),
}));

export function Analytics() {
  return (
    <div className="space-y-5 pb-8">
      <PageHeader title="Analytics" subtitle="Deep analytical views across threats, risk, and geography" icon={BarChart3} />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader title="Threat & Incident Trend" />
          <CardBody>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={threatTimeline}>
                  <defs>
                    <linearGradient id="a1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="time" tick={{ fill: "#5b6b85", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#5b6b85", fontSize: 11 }} axisLine={false} tickLine={false} width={28} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey="threats" stroke="#3b82f6" fill="url(#a1)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Attack Frequency by Type" />
          <CardBody>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attackTypeFrequency} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.05)" horizontal={false} />
                  <XAxis type="number" tick={{ fill: "#5b6b85", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="type" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} width={100} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]} fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Risk Distribution by Department" />
          <CardBody>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={riskByDept}>
                  <PolarGrid stroke="rgba(255,255,255,0.08)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <RadarPlot dataKey="risk" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.25} />
                  <Tooltip contentStyle={tooltipStyle} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Country-Wise Attack Origin" />
          <CardBody>
            <ul className="space-y-3">
              {geoThreatPoints.map((p) => (
                <li key={p.country} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-text-primary">{p.country}</p>
                    <p className="text-xs text-text-muted">{p.label}</p>
                  </div>
                  <span
                    className={`rounded-md border px-2 py-0.5 text-[11px] font-semibold capitalize ${
                      p.severity === "critical"
                        ? "border-severity-critical/30 bg-severity-critical/10 text-severity-critical"
                        : p.severity === "high"
                        ? "border-severity-high/30 bg-severity-high/10 text-severity-high"
                        : p.severity === "medium"
                        ? "border-severity-medium/30 bg-severity-medium/10 text-severity-medium"
                        : "border-severity-low/30 bg-severity-low/10 text-severity-low"
                    }`}
                  >
                    {p.severity}
                  </span>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader title="Weekly Activity Heatmap" subtitle="Threat volume by day and hour block" />
        <CardBody>
          <div className="scroll-thin overflow-x-auto">
            <div className="grid min-w-[640px] grid-cols-[50px_repeat(12,1fr)] gap-1">
              <div />
              {Array.from({ length: 12 }, (_, i) => (
                <div key={i} className="text-center text-[9px] text-text-muted">
                  {i * 2}h
                </div>
              ))}
              {weekdayHeat.map((row) => (
                <Fragment key={row.day}>
                  <div className="flex items-center text-[10px] text-text-muted">
                    {row.day}
                  </div>
                  {row.hours.map((v, i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-sm"
                      style={{ backgroundColor: `rgba(59,130,246,${Math.max(0.06, v / 130)})` }}
                      title={`${v} events`}
                    />
                  ))}
                </Fragment>
              ))}
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
