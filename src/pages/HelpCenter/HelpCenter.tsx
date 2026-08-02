import { useState } from "react";
import { LifeBuoy, Search, MessageCircle, Mail, BookOpen, Rocket, ShieldQuestion, Link2 } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";

const categories = [
  { icon: Rocket, title: "Getting Started", description: "Onboarding, account setup, first-time configuration.", articles: 12 },
  { icon: ShieldQuestion, title: "Incidents & Alerts", description: "Triaging alerts, managing incident lifecycle.", articles: 18 },
  { icon: Link2, title: "Blockchain Evidence", description: "How evidence anchoring and verification works.", articles: 9 },
  { icon: BookOpen, title: "API & Integrations", description: "Connecting external tools and using the API.", articles: 15 },
];

const popularQuestions = [
  "How do I escalate a threat to an incident?",
  "How does evidence get anchored to the blockchain?",
  "How do I add a new analyst to my team?",
  "What does the AI confidence score mean?",
  "How do I configure automated response actions?",
];

export function HelpCenter() {
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-5 pb-8">
      <PageHeader title="Help Center" subtitle="Guides, FAQs, and support for the Sentinel Chain platform" icon={LifeBuoy} />

      <div className="panel p-6 text-center">
        <p className="font-display text-lg font-bold text-text-primary">How can we help?</p>
        <div className="relative mx-auto mt-4 max-w-lg">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search help articles..."
            className="h-11 w-full rounded-xl border border-border bg-surface pl-10 pr-4 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-blue/50 focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {categories.map((c) => (
          <button key={c.title} className="panel panel-hover p-5 text-left">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-blue/12 text-brand-blue-light">
              <c.icon className="h-5 w-5" />
            </div>
            <p className="mt-3 font-display text-sm font-bold text-text-primary">{c.title}</p>
            <p className="mt-1 text-xs text-text-secondary">{c.description}</p>
            <p className="mt-2 text-[11px] text-text-muted">{c.articles} articles</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardBody className="pt-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-muted">Popular Questions</p>
              <ul className="space-y-2.5">
                {popularQuestions
                  .filter((q) => q.toLowerCase().includes(search.toLowerCase()))
                  .map((q) => (
                    <li key={q} className="cursor-pointer rounded-lg border border-border bg-surface/60 p-3 text-sm text-text-secondary hover:bg-white/[0.03] hover:text-text-primary">
                      {q}
                    </li>
                  ))}
              </ul>
            </CardBody>
          </Card>
        </div>
        <Card>
          <CardBody className="space-y-3 pt-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Still need help?</p>
            <a href="mailto:support@sentinelchain.io" className="flex items-center gap-2.5 rounded-lg border border-border bg-surface/60 p-3 text-sm text-text-secondary hover:text-text-primary">
              <Mail className="h-4 w-4 text-brand-blue-light" /> utkarshkhampar@gmail.com
            </a>
            <button className="flex w-full items-center gap-2.5 rounded-lg border border-border bg-surface/60 p-3 text-sm text-text-secondary hover:text-text-primary">
              <MessageCircle className="h-4 w-4 text-brand-blue-light" /> Start live chat
            </button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
