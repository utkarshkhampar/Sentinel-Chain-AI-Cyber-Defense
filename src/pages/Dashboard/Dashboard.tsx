import { motion } from "framer-motion";
import { RefreshCcw, Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { KpiGrid } from "@/pages/Dashboard/components/KpiGrid";
import { LiveThreatMap } from "@/pages/Dashboard/components/LiveThreatMap";
import { LiveAlertsFeed } from "@/pages/Dashboard/components/LiveAlertsFeed";
import { AiThreatAnalysisPanel } from "@/pages/Dashboard/components/AiThreatAnalysisPanel";
import { AssetRelationshipGraph } from "@/pages/Dashboard/components/AssetRelationshipGraph";
import { BlockchainStatusPanel } from "@/pages/Dashboard/components/BlockchainStatusPanel";
import { RecentIncidentsTable } from "@/pages/Dashboard/components/RecentIncidentsTable";
import { ThreatDistributionChart } from "@/pages/Dashboard/components/ThreatDistributionChart";
import { ThreatTimelineChart } from "@/pages/Dashboard/components/ThreatTimelineChart";
import { AnalystPerformancePanel } from "@/pages/Dashboard/components/AnalystPerformancePanel";

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export function Dashboard() {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.05 } } }}
      className="space-y-5 pb-8"
    >
      {/* Page header */}
      <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">Security Overview</h1>
          <p className="mt-0.5 text-sm text-text-secondary">
            Real-time posture across every monitored asset and evidence record.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => toast.success("Dashboard refreshed")}>
            <RefreshCcw className="h-3.5 w-3.5" /> Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast.success("Export started", { description: "Your report will download shortly." })}>
            <Download className="h-3.5 w-3.5" /> Export
          </Button>
        </div>
      </motion.div>

      <motion.div variants={fadeUp}>
        <KpiGrid />
      </motion.div>

      {/* Map + Live Alerts */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <LiveThreatMap />
        </div>
        <LiveAlertsFeed />
      </motion.div>

      {/* AI Analysis + Asset Graph + Blockchain Status */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <AiThreatAnalysisPanel />
        <AssetRelationshipGraph />
        <BlockchainStatusPanel />
      </motion.div>

      {/* Recent Incidents + Threat Distribution */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RecentIncidentsTable />
        </div>
        <ThreatDistributionChart />
      </motion.div>

      {/* Threat Timeline + Analyst Performance */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ThreatTimelineChart />
        </div>
        <AnalystPerformancePanel />
      </motion.div>
    </motion.div>
  );
}
