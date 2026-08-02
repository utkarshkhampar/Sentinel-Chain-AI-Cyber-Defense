import { Trophy } from "lucide-react";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { analystPerformance } from "@/mocks/system";

export function AnalystPerformancePanel() {
  return (
    <Card>
      <CardHeader title="Analyst Performance" icon={<Trophy className="h-4 w-4" />} subtitle="Incidents resolved this week" />
      <CardBody>
        <ul className="space-y-3.5">
          {analystPerformance.map((analyst) => (
            <li key={analyst.name}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="font-medium text-text-primary">{analyst.name}</span>
                <span className="text-text-muted">
                  {analyst.resolved} resolved \u00b7 avg {analyst.avgResponse}
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-blue to-brand-purple"
                  style={{ width: `${analyst.score}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </CardBody>
    </Card>
  );
}
