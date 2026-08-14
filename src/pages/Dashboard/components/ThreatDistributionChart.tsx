import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { PieChart as PieIcon } from "lucide-react";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { threatDistribution } from "@/mocks/threats";

const total = threatDistribution.reduce((sum, d) => sum + d.value, 0);

export function ThreatDistributionChart() {
  return (
    <Card>
      <CardHeader
        title="Threat Distribution"
        icon={<PieIcon className="h-4 w-4" />}
        action={
          <select className="rounded-md border border-border-strong bg-surface-raised px-2 py-1 text-xs text-text-secondary focus:outline-none">
            <option>Last 24 Hours</option>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
          </select>
        }
      />
      <CardBody>
        <div className="relative mx-auto h-52 w-52">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={threatDistribution}
                dataKey="value"
                nameKey="name"
                innerRadius={62}
                outerRadius={88}
                paddingAngle={3}
                stroke="none"
              >
                {threatDistribution.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "#111a2e",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                itemStyle={{ color: "#e6ebf5" }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-2xl font-bold text-text-primary">{total}</span>
            <span className="text-[11px] text-text-muted">Total</span>
          </div>
        </div>

        <ul className="mt-4 space-y-2">
          {threatDistribution.map((d) => (
            <li key={d.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-text-secondary">{d.name}</span>
              </div>
              <span className="font-mono-data text-text-primary">
                {d.value} ({((d.value / total) * 100).toFixed(1)}%)
              </span>
            </li>
          ))}
        </ul>
      </CardBody>
    </Card>
  );
}
