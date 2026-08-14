import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/authStore";

interface LoginForm {
  email: string;
  password: string;
}

export function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  function onSubmit(data: LoginForm) {
    setSubmitting(true);
    // Simulated network latency — no backend is wired up yet.
    setTimeout(() => {
      login(data.email);
      toast.success("Welcome back", { description: "Signed in successfully." });
      setSubmitting(false);
      navigate("/dashboard");
    }, 600);
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-text-primary">Sign in to your console</h1>
      <p className="mt-1.5 text-sm text-text-secondary">Enter your credentials to access the SOC dashboard.</p>

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
        <div>
          <div className="relative">
            <Input
              label="Password"
              icon={Lock}
              type={showPassword ? "text" : "password"}
              placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
              error={errors.password?.message}
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Password must be at least 6 characters" },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-[34px] text-text-muted hover:text-text-secondary"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 text-text-secondary">
            <input type="checkbox" className="h-3.5 w-3.5 rounded border-border-strong bg-surface-raised accent-brand-blue" />
            Remember this device
          </label>
          <Link to="/forgot-password" className="font-medium text-brand-blue-light hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" className="w-full" disabled={submitting}>
          <LogIn className="h-4 w-4" />
          {submitting ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-text-secondary">
        Don't have an account?{" "}
        <Link to="/register" className="font-medium text-brand-blue-light hover:underline">
          Request access
        </Link>
      </p>
      <p className="mt-3 text-center text-[11px] text-text-muted">
        Demo mode: any email/password combination will sign you in.
      </p>
    </div>
  );
}
