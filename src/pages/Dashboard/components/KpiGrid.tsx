import { AlertTriangle, ShieldAlert, MonitorSmartphone, Zap, Target, Crosshair, Timer, Gauge } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { kpiData } from "@/mocks/system";

export function KpiGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8">
      <StatCard
        label="Total Threats"
        value={kpiData.totalThreats.value}
        delta={kpiData.totalThreats.delta}
        icon={AlertTriangle}
        tone="critical"
        goodDirection="down"
      />
      <StatCard
        label="Critical Threats"
        value={kpiData.criticalThreats.value}
        delta={kpiData.criticalThreats.delta}
        icon={ShieldAlert}
        tone="warning"
        goodDirection="down"
      />
      <StatCard
        label="Total Assets"
        value={kpiData.assets.total}
        delta={8.0}
        icon={MonitorSmartphone}
        tone="blue"
        goodDirection="up"
      />
      <StatCard
        label="Response Rate"
        value={kpiData.responseRate.value}
        suffix="%"
        delta={kpiData.responseRate.delta}
        icon={Zap}
        tone="success"
        goodDirection="up"
      />
      <StatCard
        label="Detection Rate"
        value={kpiData.detectionRate.value}
        suffix="%"
        delta={kpiData.detectionRate.delta}
        icon={Target}
        tone="cyan"
        goodDirection="up"
      />
      <StatCard
        label="MITRE Coverage"
        value={kpiData.mitreCoverage.value}
        suffix="%"
        delta={kpiData.mitreCoverage.delta}
        icon={Crosshair}
        tone="purple"
        goodDirection="up"
      />
      <StatCard
        label="Mean Time to Detect"
        value={kpiData.mttd.value}
        delta={kpiData.mttd.delta}
        icon={Timer}
        tone="blue"
        goodDirection="down"
      />
      <StatCard
        label="Mean Time to Respond"
        value={kpiData.mttr.value}
        delta={kpiData.mttr.delta}
        icon={Gauge}
        tone="purple"
        goodDirection="down"
      />
    </div>
  );
}
