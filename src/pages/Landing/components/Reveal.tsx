import type { ReactNode } from "react";
import { motion } from "framer-motion";

export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center = true,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <Reveal className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <span className="inline-block rounded-full border border-brand-blue/30 bg-brand-blue/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-brand-blue-light">
        {eyebrow}
      </span>
      <h2 className="mt-4 font-display text-3xl font-bold text-text-primary sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-3 text-base text-text-secondary">{subtitle}</p>}
    </Reveal>
  );
}
