import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Bell, ShieldCheck, ChevronDown, LogOut, UserCircle, Settings, Menu } from "lucide-react";
import { toast } from "sonner";
import { useUIStore } from "@/store/uiStore";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/utils/cn";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export function Header() {
  const navigate = useNavigate();
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const currentUser = {
    name: user?.name ?? "SOC Analyst",
    role: user?.role ?? "Administrator",
    initials: user?.avatarInitials ?? "SA",
  };

  function handleLogout() {
    logout();
    toast.success("Signed out");
    navigate("/login");
  }

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-4 border-b border-border bg-surface/90 px-4 backdrop-blur-md">
      <button
        onClick={toggleSidebar}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-white/5 hover:text-text-primary lg:hidden"
      >
        <Menu className="h-[18px] w-[18px]" />
      </button>

      <div className="hidden min-w-0 flex-1 md:block">
        <Breadcrumbs />
      </div>

      {/* Search */}
      <div className="relative hidden max-w-md flex-1 md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          placeholder="Search (e.g., IP, User, Incident ID)"
          className="h-9 w-full rounded-lg border border-border bg-surface-raised pl-9 pr-3 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-blue/50 focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* Blockchain quick status */}
        <div className="hidden items-center gap-1.5 rounded-lg border border-status-success/25 bg-status-success/10 px-2.5 py-1.5 text-xs font-medium text-status-success sm:flex">
          <ShieldCheck className="h-3.5 w-3.5" />
          Ledger Synced
        </div>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen((v) => !v)}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-white/5 hover:text-text-primary"
          >
            <Bell className="h-[18px] w-[18px]" />
            <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-severity-critical text-[9px] font-bold text-white">
              6
            </span>
          </button>
          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="panel absolute right-0 top-11 w-80 overflow-hidden"
              >
                <div className="border-b border-border px-4 py-3">
                  <p className="text-sm font-semibold text-text-primary">Notifications</p>
                </div>
                <ul className="scroll-thin max-h-80 overflow-y-auto">
                  {[
                    { title: "Critical malware detected", asset: "Laptop-01", time: "2m ago", tone: "critical" },
                    { title: "New incident assigned to you", asset: "INC-1025", time: "8m ago", tone: "blue" },
                    { title: "Evidence anchored to ledger", asset: "EVD-3393", time: "12m ago", tone: "success" },
                    { title: "MFA challenge failed 3x", asset: "user jsmith", time: "20m ago", tone: "warning" },
                  ].map((n, i) => (
                    <li key={i} className="border-b border-border/60 px-4 py-3 last:border-0 hover:bg-white/[0.03]">
                      <div className="flex items-start gap-2.5">
                        <span
                          className={cn(
                            "mt-1 h-1.5 w-1.5 shrink-0 rounded-full",
                            n.tone === "critical" && "bg-severity-critical",
                            n.tone === "blue" && "bg-brand-blue",
                            n.tone === "success" && "bg-status-success",
                            n.tone === "warning" && "bg-severity-high"
                          )}
                        />
                        <div className="min-w-0">
                          <p className="text-[13px] font-medium text-text-primary">{n.title}</p>
                          <p className="text-xs text-text-muted">
                            {n.asset} \u00b7 {n.time}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="px-4 py-2.5 text-center">
                  <button
                    onClick={() => { setNotifOpen(false); navigate("/notifications"); }}
                    className="text-xs font-medium text-brand-blue-light hover:underline"
                  >
                    View all notifications
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen((v) => !v)}
            className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 transition-colors hover:bg-white/5"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-blue to-brand-purple text-xs font-bold text-white">
              {currentUser.initials}
            </div>
            <div className="hidden text-left leading-tight sm:block">
              <p className="text-[13px] font-medium text-text-primary">{currentUser.name}</p>
              <p className="text-[11px] text-text-muted">{currentUser.role}</p>
            </div>
            <ChevronDown className="hidden h-3.5 w-3.5 text-text-muted sm:block" />
          </button>
          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="panel absolute right-0 top-11 w-56 overflow-hidden py-1.5"
              >
                <button
                  onClick={() => { setProfileOpen(false); navigate("/profile"); }}
                  className="flex w-full items-center gap-2.5 px-3.5 py-2 text-[13px] text-text-secondary hover:bg-white/5 hover:text-text-primary"
                >
                  <UserCircle className="h-4 w-4" /> Profile
                </button>
                <button
                  onClick={() => { setProfileOpen(false); navigate("/settings"); }}
                  className="flex w-full items-center gap-2.5 px-3.5 py-2 text-[13px] text-text-secondary hover:bg-white/5 hover:text-text-primary"
                >
                  <Settings className="h-4 w-4" /> Settings
                </button>
                <div className="my-1 border-t border-border" />
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 px-3.5 py-2 text-[13px] text-severity-critical hover:bg-severity-critical/10"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
