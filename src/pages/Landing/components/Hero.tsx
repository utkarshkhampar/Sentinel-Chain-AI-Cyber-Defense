import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PlayCircle, ArrowRight, ShieldCheck, Zap, Link2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

const stats = [
  { label: "Threats Analyzed / Day", value: "2.4M+" },
  { label: "Mean Time to Detect", value: "4.2m" },
  { label: "Detection Accuracy", value: "98.4%" },
  { label: "Evidence Integrity", value: "100%" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-20 pt-16 sm:pt-24">
      <div className="absolute inset-0 bg-console-grid opacity-50" />
      <div className="absolute inset-0 bg-radial-fade" />
      <div className="absolute left-1/2 top-0 h-96 w-[36rem] -translate-x-1/2 rounded-full bg-brand-purple/20 blur-[120px]" />

      <div className="relative mx-auto max-w-5xl px-4 text-center md:px-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-border-strong bg-surface-raised/70 px-3.5 py-1.5 text-xs font-medium text-text-secondary backdrop-blur"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-status-success opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-status-success" />
          </span>
          Now monitoring 320+ assets in the live demo environment
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-display text-4xl font-bold leading-[1.1] tracking-tight text-text-primary sm:text-6xl"
        >
          AI-Powered Autonomous
          <br />
          <span className="bg-gradient-to-r from-brand-blue via-brand-purple-light to-brand-cyan bg-clip-text text-transparent">
            Cyber Defense Platform
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mt-5 max-w-2xl text-base text-text-secondary sm:text-lg"
        >
          Sentinel Chain unifies real-time threat detection, explainable AI, and blockchain-anchored evidence
          management into one SOC platform built for how modern security teams actually work.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Link to="/login">
            <Button size="lg">
              Launch Dashboard <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Button variant="secondary" size="lg">
            <PlayCircle className="h-4 w-4" /> Watch Demo
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-text-muted"
        >
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-status-success" /> Zero Trust by design
          </span>
          <span className="flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-severity-high" /> Real-time detection
          </span>
          <span className="flex items-center gap-1.5">
            <Link2 className="h-3.5 w-3.5 text-brand-blue-light" /> Hyperledger Fabric evidence
          </span>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="panel mx-auto mt-14 grid max-w-3xl grid-cols-2 divide-x divide-border sm:grid-cols-4"
        >
          {stats.map((s) => (
            <div key={s.label} className="px-4 py-5 text-center">
              <p className="font-display text-2xl font-bold text-text-primary">{s.value}</p>
              <p className="mt-1 text-[11px] text-text-muted">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
