import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Mail, ArrowLeft, Send, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface ForgotForm {
  email: string;
}

export function ForgotPassword() {
  const [sent, setSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotForm>();

  function onSubmit(data: ForgotForm) {
    setSubmittedEmail(data.email);
    setSent(true);
  }

  if (sent) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-status-success/30 bg-status-success/10">
          <CheckCircle2 className="h-6 w-6 text-status-success" />
        </div>
        <h1 className="font-display text-xl font-bold text-text-primary">Check your inbox</h1>
        <p className="mt-2 text-sm text-text-secondary">
          If an account exists for <span className="text-text-primary">{submittedEmail}</span>, we've sent a link to
          reset your password.
        </p>
        <Link to="/reset-password" className="mt-6 block">
          <Button className="w-full" variant="secondary">
            Continue to Reset Password
          </Button>
        </Link>
        <Link to="/login" className="mt-4 flex items-center justify-center gap-1.5 text-sm font-medium text-brand-blue-light hover:underline">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-text-primary">Reset your password</h1>
      <p className="mt-1.5 text-sm text-text-secondary">
        Enter the email associated with your account and we'll send a reset link.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-4">
        <Input
          label="Work email"
          icon={Mail}
          type="email"
          placeholder="you@company.com"
          error={errors.email?.message}
          {...register("email", {
            required: "Email is required",
            pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email address" },
          })}
        />
        <Button type="submit" className="w-full">
          <Send className="h-4 w-4" /> Send Reset Link
        </Button>
      </form>

      <Link to="/login" className="mt-6 flex items-center justify-center gap-1.5 text-sm font-medium text-brand-blue-light hover:underline">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
      </Link>
    </div>
  );
}
