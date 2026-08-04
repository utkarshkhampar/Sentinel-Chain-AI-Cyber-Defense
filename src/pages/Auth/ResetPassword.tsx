import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Lock, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Feedback";

interface ResetForm {
  password: string;
  confirmPassword: string;
}

function scorePassword(pw: string) {
  let score = 0;
  if (pw.length >= 8) score += 25;
  if (/[A-Z]/.test(pw)) score += 25;
  if (/[0-9]/.test(pw)) score += 25;
  if (/[^A-Za-z0-9]/.test(pw)) score += 25;
  return score;
}

export function ResetPassword() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetForm>();

  const password = watch("password", "");
  const strength = scorePassword(password);
  const strengthLabel = strength <= 25 ? "Weak" : strength <= 50 ? "Fair" : strength <= 75 ? "Good" : "Strong";
  const strengthTone = strength <= 25 ? "critical" : strength <= 50 ? "warning" : "success";

  function onSubmit() {
    toast.success("Password updated", { description: "You can now sign in with your new password." });
    navigate("/login");
  }

  return (
    <div>
      <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-surface-raised text-brand-blue-light">
        <KeyRound className="h-5 w-5" />
      </div>
      <h1 className="font-display text-2xl font-bold text-text-primary">Set a new password</h1>
      <p className="mt-1.5 text-sm text-text-secondary">Choose a strong password you haven't used before.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-4">
        <div>
          <Input
            label="New password"
            icon={Lock}
            type="password"
            placeholder="Create a strong password"
            error={errors.password?.message}
            {...register("password", {
              required: "Password is required",
              minLength: { value: 8, message: "Use at least 8 characters" },
            })}
          />
          {password && (
            <div className="mt-2 flex items-center gap-2">
              <Progress value={strength} tone={strengthTone as any} />
              <span className="w-12 shrink-0 text-[11px] text-text-muted">{strengthLabel}</span>
            </div>
          )}
        </div>
        <Input
          label="Confirm new password"
          icon={Lock}
          type="password"
          placeholder="Re-enter your password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword", {
            required: "Please confirm your password",
            validate: (value) => value === watch("password") || "Passwords do not match",
          })}
        />
        <Button type="submit" className="w-full">
          Update Password
        </Button>
      </form>

      <Link to="/login" className="mt-6 block text-center text-sm font-medium text-brand-blue-light hover:underline">
        Back to sign in
      </Link>
    </div>
  );
}
