import { useState } from "react";
import { toast } from "sonner";
import { Bell, CheckCheck, ShieldAlert, Link2, UserPlus, Info } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/Feedback";
import { cn } from "@/utils/cn";

interface NotificationEntry {
  id: string;
  icon: any;
  title: string;
  description: string;
  time: string;
  read: boolean;
  tone: "critical" | "blue" | "success" | "warning";
}

const initialNotifications: NotificationEntry[] = [
  { id: "n1", icon: ShieldAlert, title: "Critical malware detected", description: "Laptop-01 flagged with 97% AI confidence.", time: "2m ago", read: false, tone: "critical" },
  { id: "n2", icon: UserPlus, title: "New incident assigned to you", description: "INC-1025 \u2014 Brute-force attack on SSH.", time: "8m ago", read: false, tone: "blue" },
  { id: "n3", icon: Link2, title: "Evidence anchored to ledger", description: "EVD-3393 successfully committed to block #585229.", time: "12m ago", read: false, tone: "success" },
  { id: "n4", icon: ShieldAlert, title: "Multiple failed MFA challenges", description: "User jsmith triggered 5 failed MFA attempts.", time: "20m ago", read: true, tone: "warning" },
  { id: "n5", icon: Info, title: "Weekly report generated", description: "SOC Performance Report for last week is ready.", time: "1h ago", read: true, tone: "blue" },
  { id: "n6", icon: ShieldAlert, title: "Asset marked at-risk", description: "Server-02 risk score increased to 74.", time: "3h ago", read: true, tone: "warning" },
];

const toneStyles: Record<string, string> = {
  critical: "bg-severity-critical/12 text-severity-critical",
  blue: "bg-brand-blue/12 text-brand-blue-light",
  success: "bg-status-success/12 text-status-success",
  warning: "bg-severity-high/12 text-severity-high",
};

export function Notifications() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  }

  function markRead(id: string) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  return (
    <div className="space-y-5 pb-8">
      <PageHeader
        title="Notifications"
        subtitle={`${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}`}
        icon={Bell}
        actions={
          <Button variant="secondary" size="sm" onClick={markAllRead}>
            <CheckCheck className="h-3.5 w-3.5" /> Mark All Read
          </Button>
        }
      />

      {notifications.length === 0 ? (
        <div className="panel"><EmptyState icon={Bell} title="You're all caught up" description="New notifications will appear here." /></div>
      ) : (
        <div className="panel divide-y divide-border/60">
          {notifications.map((n) => (
            <button
              key={n.id}
              onClick={() => markRead(n.id)}
              className={cn("flex w-full items-start gap-3 px-5 py-4 text-left transition-colors hover:bg-white/[0.03]", !n.read && "bg-brand-blue/[0.03]")}
            >
              <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", toneStyles[n.tone])}>
                <n.icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-text-primary">{n.title}</p>
                  {!n.read && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-blue" />}
                </div>
                <p className="mt-0.5 text-xs text-text-secondary">{n.description}</p>
              </div>
              <span className="shrink-0 text-[11px] text-text-muted">{n.time}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
