import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/utils/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon;
  label?: string;
  hint?: string;
  error?: string;
}

export function Input({ icon: Icon, label, hint, error, className, id, ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-xs font-medium text-text-secondary">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />}
        <input
          id={id}
          className={cn(
            "h-10 w-full rounded-lg border border-border bg-surface-raised px-3 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-brand-blue/50 focus:outline-none focus:ring-2 focus:ring-brand-blue/20",
            Icon && "pl-9",
            error && "border-severity-critical/50 focus:border-severity-critical focus:ring-severity-critical/20",
            className
          )}
          {...props}
        />
      </div>
      {hint && !error && <p className="mt-1.5 text-[11px] text-text-muted">{hint}</p>}
      {error && <p className="mt-1.5 text-[11px] text-severity-critical">{error}</p>}
    </div>
  );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function Textarea({ label, className, id, ...props }: TextareaProps) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-xs font-medium text-text-secondary">
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={cn(
          "w-full rounded-lg border border-border bg-surface-raised px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-brand-blue/50 focus:outline-none focus:ring-2 focus:ring-brand-blue/20",
          className
        )}
        {...props}
      />
    </div>
  );
}
