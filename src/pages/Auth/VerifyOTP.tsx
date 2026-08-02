import { useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MailCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { OtpInput } from "@/components/ui/OtpInput";

export function VerifyOTP() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  function startCooldown() {
    setResendCooldown(30);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setResendCooldown((v) => {
        if (v <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return v - 1;
      });
    }, 1000);
  }

  function onVerify() {
    if (code.length !== 6) {
      toast.error("Enter the full 6-digit code");
      return;
    }
    toast.success("Email verified", { description: "Your account is ready." });
    navigate("/login");
  }

  return (
    <div className="text-center">
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-surface-raised text-brand-blue-light">
        <MailCheck className="h-6 w-6" />
      </div>
      <h1 className="font-display text-2xl font-bold text-text-primary">Verify your email</h1>
      <p className="mt-1.5 text-sm text-text-secondary">
        We sent a 6-digit verification code to your email. Enter it below to continue.
      </p>

      <div className="mt-7">
        <OtpInput value={code} onChange={setCode} onComplete={onVerify} />
      </div>

      <Button onClick={onVerify} className="mt-6 w-full">
        Verify & Continue
      </Button>

      <button
        onClick={startCooldown}
        disabled={resendCooldown > 0}
        className="mt-4 text-sm font-medium text-brand-blue-light hover:underline disabled:cursor-not-allowed disabled:text-text-muted disabled:no-underline"
      >
        {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : "Resend code"}
      </button>

      <Link to="/login" className="mt-4 block text-sm text-text-muted hover:text-text-secondary">
        Back to sign in
      </Link>
    </div>
  );
}
