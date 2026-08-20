import { useRef, type KeyboardEvent, type ClipboardEvent } from "react";
import { cn } from "@/utils/cn";

export function OtpInput({
  value,
  onChange,
  length = 6,
  onComplete,
}: {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  onComplete?: (value: string) => void;
}) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.split("").concat(Array(length).fill("")).slice(0, length);

  function setDigit(index: number, digit: string) {
    const next = [...digits];
    next[index] = digit;
    const joined = next.join("").slice(0, length);
    onChange(joined);
    if (digit && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
    if (joined.length === length && !joined.includes("")) {
      onComplete?.(joined);
    }
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>, index: number) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  }

  function onPaste(e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    onChange(pasted);
    if (pasted.length === length) onComplete?.(pasted);
  }

  return (
    <div className="flex items-center justify-center gap-2.5">
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => {
            inputsRef.current[i] = el;
          }}
          value={digit}
          onChange={(e) => setDigit(i, e.target.value.replace(/\D/g, "").slice(-1))}
          onKeyDown={(e) => onKeyDown(e, i)}
          onPaste={onPaste}
          inputMode="numeric"
          maxLength={1}
          className={cn(
            "h-12 w-11 rounded-lg border bg-surface-raised text-center font-mono-data text-lg font-semibold text-text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue/30",
            digit ? "border-brand-blue/50" : "border-border"
          )}
        />
      ))}
    </div>
  );
}
