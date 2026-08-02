import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { User, Mail, Building2, Lock, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface RegisterForm {
  fullName: string;
  company: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export function Register() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>();

  function onSubmit() {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success("Account request submitted", {
        description: "Check your email to verify and finish setting up your account.",
      });
      navigate("/verify-otp");
    }, 700);
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-text-primary">Request SOC access</h1>
      <p className="mt-1.5 text-sm text-text-secondary">Set up your organization's Sentinel Chain workspace.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-4">
        <Input
          label="Full name"
          icon={User}
          placeholder="Jordan Ellis"
          error={errors.fullName?.message}
          {...register("fullName", { required: "Full name is required" })}
        />
        <Input
          label="Organization"
          icon={Building2}
          placeholder="Acme Corp"
          error={errors.company?.message}
          {...register("company", { required: "Organization is required" })}
        />
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
        <Input
          label="Password"
          icon={Lock}
          type="password"
          placeholder="Create a strong password"
          error={errors.password?.message}
          {...register("password", {
            required: "Password is required",
            minLength: { value: 8, message: "Use at least 8 characters" },
          })}
        />
        <Input
          label="Confirm password"
          icon={Lock}
          type="password"
          placeholder="Re-enter your password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword", {
            required: "Please confirm your password",
            validate: (value) => value === watch("password") || "Passwords do not match",
          })}
        />

        <Button type="submit" className="w-full" disabled={submitting}>
          <UserPlus className="h-4 w-4" />
          {submitting ? "Creating account..." : "Create Account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-text-secondary">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-brand-blue-light hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
