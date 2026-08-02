import { Link } from "react-router-dom";
import { useState, type FormEvent } from "react";
import { Mail, ArrowRight, Github, Twitter, Linkedin, ShieldHalf } from "lucide-react";
import { toast } from "sonner";
import { Reveal } from "./Reveal";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function ContactCTA() {
  const [submitting, setSubmitting] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success("Message sent", { description: "Our team will get back to you within one business day." });
      (e.target as HTMLFormElement).reset();
    }, 700);
  }

  return (
    <section id="contact" className="relative overflow-hidden py-24">
      <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-blue/15 blur-[120px]" />
      <div className="relative mx-auto grid max-w-5xl grid-cols-1 gap-10 px-4 md:px-6 lg:grid-cols-2">
        <Reveal>
          <span className="inline-block rounded-full border border-brand-blue/30 bg-brand-blue/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-brand-blue-light">
            Get In Touch
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold text-text-primary sm:text-4xl">
            Ready to see Sentinel Chain on your own traffic?
          </h2>
          <p className="mt-3 text-text-secondary">
            Tell us a bit about your environment and we'll set up a walkthrough of the console using a deployment
            shaped like yours.
          </p>
          <Link to="/login" className="mt-6 inline-block">
            <Button size="lg">
              Launch Dashboard <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </Reveal>

        <Reveal delay={0.15}>
          <form onSubmit={onSubmit} className="panel space-y-4 p-6">
            <Input label="Full name" placeholder="Utkarsha Kushwaha" required />
            <Input label="Work email" icon={Mail} type="email" placeholder="utkarshkhampar@gmail.com" required />
            <Textarea label="Message" placeholder="Tell us about your SOC environment..." rows={4} required />
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

const footerLinks = {
  Product: ["Features", "Architecture", "Pricing", "Documentation"],
  Company: ["About", "Team", "Contact", "Careers"],
  Resources: ["Help Center", "Documentation", "API Reference", "Status"],
  Legal: ["Privacy Policy", "Terms of Service", "Security"],
};

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-6">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-blue to-brand-purple">
                <ShieldHalf className="h-4 w-4 text-white" />
              </div>
              <span className="font-display text-sm font-bold text-text-primary">SENTINEL CHAIN</span>
            </Link>
            <p className="mt-3 max-w-xs text-xs leading-relaxed text-text-muted">
              AI-powered autonomous cyber defense with blockchain-anchored evidence assurance.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <a href="https://github.com/utkarshkhampar/Sentinel-Chain-AI-Cyber-Defense" target="_blank" rel="noreferrer" className="text-text-muted hover:text-text-primary">
                <Github className="h-4 w-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-text-muted hover:text-text-primary">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-text-muted hover:text-text-primary">
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <p className="text-xs font-semibold uppercase tracking-wide text-text-primary">{group}</p>
              <ul className="mt-3 space-y-2">
                {links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-xs text-text-muted hover:text-text-secondary">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 sm:flex-row">
          <p className="text-[11px] text-text-muted">© 2026 Sentinel Chain. All rights reserved.</p>
          <p className="text-[11px] text-text-muted">Frontend prototype \u00b7 mock data \u00b7 not connected to a live backend</p>
        </div>
      </div>
    </footer>
  );
}
