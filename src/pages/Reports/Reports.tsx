import { useState } from "react";
import { toast } from "sonner";
import { FileText, Download, Printer, FileSpreadsheet, Plus, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { reportsList } from "@/mocks/organization";
import { cn } from "@/utils/cn";

const reportTypes = ["Daily", "Weekly", "Monthly", "Incident", "Compliance", "Blockchain Audit", "AI"] as const;

export function Reports() {
  const [generating, setGenerating] = useState(false);
  const [selectedType, setSelectedType] = useState<(typeof reportTypes)[number]>("Weekly");

  function generateReport() {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      toast.success(`${selectedType} report generated`, { description: "Your report is ready to download." });
    }, 1200);
  }

  function exportAction(format: string) {
    toast.success(`Exporting as ${format}`, { description: "Your download will begin shortly." });
  }

  return (
    <div className="space-y-5 pb-8">
      <PageHeader title="Reports" subtitle="Generate and export SOC, compliance, and AI performance reports" icon={FileText} />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader title="Generate New Report" icon={<Plus className="h-4 w-4" />} />
          <CardBody>
            <p className="mb-2 text-xs font-medium text-text-secondary">Report Type</p>
            <div className="flex flex-wrap gap-1.5">
              {reportTypes.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedType(t)}
                  className={cn(
                    "rounded-md border px-2.5 py-1 text-[11px] font-medium transition-colors",
                    selectedType === t ? "border-brand-blue/40 bg-brand-blue/15 text-brand-blue-light" : "border-border text-text-muted hover:text-text-secondary"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
            <Button onClick={generateReport} disabled={generating} className="mt-5 w-full">
              {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
              {generating ? "Generating..." : "Generate Report"}
            </Button>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <Button variant="secondary" size="sm" onClick={() => exportAction("PDF")}>
                <Download className="h-3.5 w-3.5" /> PDF
              </Button>
              <Button variant="secondary" size="sm" onClick={() => exportAction("Excel")}>
                <FileSpreadsheet className="h-3.5 w-3.5" /> Excel
              </Button>
              <Button variant="secondary" size="sm" onClick={() => exportAction("Print")}>
                <Printer className="h-3.5 w-3.5" /> Print
              </Button>
            </div>
          </CardBody>
        </Card>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader title="Recent Reports" />
            <div className="divide-y divide-border/60">
              {reportsList.map((r) => (
                <div key={r.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-blue/10 text-brand-blue-light">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">{r.title}</p>
                      <p className="text-xs text-text-muted">
                        {r.generatedBy} \u00b7 {new Date(r.generatedAt).toLocaleDateString()} \u00b7 {r.sizeKb} KB
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{r.type}</Badge>
                    <button onClick={() => exportAction("PDF")} className="flex h-7 w-7 items-center justify-center rounded-md text-text-muted hover:bg-white/5 hover:text-text-primary">
                      <Download className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
