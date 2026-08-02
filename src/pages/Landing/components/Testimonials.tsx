import { Star } from "lucide-react";
import { SectionHeading, Reveal } from "./Reveal";

const testimonials = [
  {
    quote: "The explainability layer is what got our analysts to actually trust the AI verdicts instead of re-checking everything by hand.",
    name: "Aditi Rao",
    role: "SOC Lead, Fintech Enterprise",
  },
  {
    quote: "Having evidence anchored automatically changed how our legal team engages with incident reports — they stopped asking us to 're-prove' timelines.",
    name: "Marcus Webb",
    role: "Director of Security, Cloud Infrastructure Co.",
  },
  {
    quote: "We cut our mean-time-to-detect significantly after moving correlation off static rules and onto the graph-aware model.",
    name: "Priya Nair",
    role: "Head of Threat Detection, Healthcare Group",
  },
];

const team = [
  { name: "Riya Singh", role: "Founder & Security Architect", initials: "RS" },
  { name: "John Doe", role: "AI/ML Engineering Lead", initials: "JD" },
  { name: "Jane Smith", role: "Blockchain Engineering Lead", initials: "JS" },
  { name: "Arman Verma", role: "Platform & DevOps Lead", initials: "AV" },
];

export function Testimonials() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 md:px-6">
      <SectionHeading eyebrow="Trusted By SOC Teams" title="What early adopters are saying" />
      <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-3">
        {testimonials.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.1}>
            <div className="panel flex h-full flex-col p-6">
              <div className="flex gap-0.5 text-severity-medium">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star key={idx} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-text-secondary">"{t.quote}"</p>
              <div className="mt-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-blue to-brand-purple text-xs font-bold text-white">
                  {t.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">{t.name}</p>
                  <p className="text-xs text-text-muted">{t.role}</p>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function Team() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-24 md:px-6">
      <SectionHeading eyebrow="The Team" title="Built by engineers who've sat SOC shifts" />
      <div className="mt-14 grid grid-cols-2 gap-5 sm:grid-cols-4">
        {team.map((m, i) => (
          <Reveal key={m.name} delay={i * 0.08}>
            <div className="panel panel-hover flex flex-col items-center p-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-blue to-brand-purple font-display text-lg font-bold text-white shadow-glow">
                {m.initials}
              </div>
              <p className="mt-3 text-sm font-semibold text-text-primary">{m.name}</p>
              <p className="text-xs text-text-muted">{m.role}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
