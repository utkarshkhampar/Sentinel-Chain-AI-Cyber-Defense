import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldHalf, Menu, X, Github, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

const links = [
  { label: "Features", href: "#features" },
  { label: "Architecture", href: "#architecture" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Comparison", href: "#comparison" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled ? "border-b border-border bg-base/80 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-blue to-brand-purple shadow-glow">
            <ShieldHalf className="h-5 w-5 text-white" />
          </div>
          <span className="font-display text-[15px] font-bold tracking-tight text-text-primary">SENTINEL CHAIN</span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-medium text-text-secondary transition-colors hover:text-text-primary">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <a href="https://github.com/utkarshkhampar/Sentinel-Chain-AI-Cyber-Defense" target="_blank" rel="noreferrer">
            <Button variant="ghost" size="sm">
              <Github className="h-4 w-4" /> GitHub
            </Button>
          </a>
          <Button variant="secondary" size="sm">
            <PlayCircle className="h-4 w-4" /> Watch Demo
          </Button>
          <Link to="/login">
            <Button size="sm">Launch Dashboard</Button>
          </Link>
        </div>

        <button onClick={() => setMobileOpen((v) => !v)} className="flex h-9 w-9 items-center justify-center text-text-secondary lg:hidden">
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-border bg-base px-4 py-4 lg:hidden"
        >
          <div className="flex flex-col gap-3">
            {links.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)} className="text-sm font-medium text-text-secondary">
                {l.label}
              </a>
            ))}
            <Link to="/login" className="mt-2">
              <Button className="w-full">Launch Dashboard</Button>
            </Link>
          </div>
        </motion.div>
      )}
    </header>
  );
}
