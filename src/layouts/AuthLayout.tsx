import { Outlet, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldHalf, Radar, Link2, BrainCircuit } from "lucide-react";

const featurePoints = [
  { icon: Radar, text: "Real-time detection across every monitored asset" },
  { icon: BrainCircuit, text: "Explainable AI verdicts your analysts can trust" },
  { icon: Link2, text: "Blockchain-anchored, tamper-evident evidence trail" },
];

export function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full bg-base">
      {/* Branding panel */}
      <div className="relative hidden w-[46%] flex-col justify-between overflow-hidden bg-surface p-10 lg:flex">
        <div className="absolute inset-0 bg-console-grid opacity-60" />
        <div className="absolute inset-0 bg-radial-fade" />
        <div className="absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-brand-purple/20 blur-[100px]" />
        <div className="absolute -right-10 bottom-10 h-64 w-64 rounded-full bg-brand-blue/20 blur-[100px]" />

        <Link to="/" className="relative z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-blue to-brand-purple shadow-glow">
            <ShieldHalf className="h-5 w-5 text-white" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight text-text-primary">SENTINEL CHAIN</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          <h2 className="font-display text-3xl font-bold leading-tight text-text-primary">
            AI-powered defense.
            <br />
            Blockchain-verified truth.
          </h2>
          <p className="mt-3 max-w-sm text-sm text-text-secondary">
            Join the SOC teams using Sentinel Chain to cut detection time and produce evidence that stands up to
            audit.
          </p>
          <ul className="mt-7 space-y-4">
            {featurePoints.map((f, i) => (
              <motion.li
                key={f.text}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.1, duration: 0.4 }}
                className="flex items-center gap-3 text-sm text-text-secondary"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-surface-raised text-brand-blue-light">
                  <f.icon className="h-4 w-4" />
                </div>
                {f.text}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <p className="relative z-10 text-[11px] text-text-muted">© 2026 Sentinel Chain. All rights reserved.</p>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 items-center justify-center p-6 sm:p-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-sm"
        >
          <Link to="/" className="mb-8 flex items-center gap-2.5 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-blue to-brand-purple">
              <ShieldHalf className="h-4 w-4 text-white" />
            </div>
            <span className="font-display text-base font-bold text-text-primary">SENTINEL CHAIN</span>
          </Link>
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
}
