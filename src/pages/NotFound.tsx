import { Link } from "react-router-dom";
import { ShieldQuestion } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-console-grid px-4 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-border bg-surface-raised shadow-glow">
        <ShieldQuestion className="h-9 w-9 text-brand-blue-light" strokeWidth={1.75} />
      </div>
      <p className="font-mono-data text-sm tracking-widest text-text-muted">ERROR 404</p>
      <h1 className="mt-2 font-display text-3xl font-bold text-text-primary">Signal not found</h1>
      <p className="mt-3 max-w-md text-sm text-text-secondary">
        The page you're looking for doesn't exist, may have been moved, or the route was mistyped. Let's get you
        back to a monitored zone.
      </p>
      <Link to="/dashboard" className="mt-6">
        <Button>Return to Dashboard</Button>
      </Link>
    </div>
  );
}
