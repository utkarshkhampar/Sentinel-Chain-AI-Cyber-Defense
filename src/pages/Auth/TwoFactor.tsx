import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShieldCheck, Smartphone, KeySquare } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { OtpInput } from "@/components/ui/OtpInput";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/utils/cn";

type Method = "app" | "sms";

export function TwoFactor() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [method, setMethod] = useState<Method>("app");
  const [code, setCode] = useState("");

  function onVerify() {
    if (code.length !== 6) {
      toast.error("Enter the full 6-digit code");
      return;
    }
    login("analyst@sentinelchain.io");
    toast.success("Two-factor verified", { description: "Signed in securely." });
    navigate("/dashboard");
  }

  return (
    <div className="text-center">
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-surface-raised text-brand-purple-light">
        <ShieldCheck className="h-6 w-6" />
      </div>
      <h1 className="font-display text-2xl font-bold text-text-primary">Two-Factor Authentication</h1>
      <p className="mt-1.5 text-sm text-text-secondary">
        Enter the 6-digit code from your {method === "app" ? "authenticator app" : "SMS message"}.
      </p>

      <div className="mt-5 flex justify-center gap-2">
        <button
          onClick={() => setMethod("app")}
          className={cn(
            "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
            method === "app"
              ? "border-brand-blue/40 bg-brand-blue/10 text-brand-blue-light"
              : "border-border text-text-muted hover:text-text-secondary"
          )}
        >
          <KeySquare className="h-3.5 w-3.5" /> Authenticator App
        </button>
        <button
          onClick={() => setMethod("sms")}
          className={cn(
            "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
            method === "sms"
              ? "border-brand-blue/40 bg-brand-blue/10 text-brand-blue-light"
              : "border-border text-text-muted hover:text-text-secondary"
          )}
        >
          <Smartphone className="h-3.5 w-3.5" /> SMS
        </button>
      </div>

      <div className="mt-7">
        <OtpInput value={code} onChange={setCode} onComplete={onVerify} />
      </div>

      <Button onClick={onVerify} className="mt-6 w-full">
        Verify & Sign In
      </Button>

      <Link to="/login" className="mt-4 block text-sm text-text-muted hover:text-text-secondary">
        Use a different account
      </Link>
    </div>
  );
}
