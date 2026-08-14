import { Routes, Route } from "react-router-dom";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { AuthLayout } from "@/layouts/AuthLayout";
import { ProtectedRoute, PublicOnlyRoute } from "@/routes/Guards";

import { Landing } from "@/pages/Landing/Landing";
import { Login } from "@/pages/Auth/Login";
import { Register } from "@/pages/Auth/Register";
import { ForgotPassword } from "@/pages/Auth/ForgotPassword";
import { ResetPassword } from "@/pages/Auth/ResetPassword";
import { VerifyOTP } from "@/pages/Auth/VerifyOTP";
import { TwoFactor } from "@/pages/Auth/TwoFactor";

import { Dashboard } from "@/pages/Dashboard/Dashboard";
import { LiveThreats } from "@/pages/LiveThreats/LiveThreats";
import { Incidents } from "@/pages/Incidents/Incidents";
import { IncidentDetail } from "@/pages/Incidents/IncidentDetail";
import { Assets } from "@/pages/Assets/Assets";
import { AssetDetail } from "@/pages/Assets/AssetDetail";
import { AIAnalysis } from "@/pages/AIAnalysis/AIAnalysis";
import { ThreatIntelligence } from "@/pages/ThreatIntelligence/ThreatIntelligence";
import { BlockchainEvidence } from "@/pages/BlockchainEvidence/BlockchainEvidence";
import { EvidenceDetail } from "@/pages/BlockchainEvidence/EvidenceDetail";
import { Reports } from "@/pages/Reports/Reports";
import { Analytics } from "@/pages/Analytics/Analytics";
import { Compliance } from "@/pages/Compliance/Compliance";
import { Users } from "@/pages/Users/Users";
import { SOCTeam } from "@/pages/SOCTeam/SOCTeam";
import { AuditLogs } from "@/pages/AuditLogs/AuditLogs";
import { Integrations } from "@/pages/Integrations/Integrations";
import { ApiKeys } from "@/pages/ApiKeys/ApiKeys";
import { Settings } from "@/pages/Settings/Settings";
import { Profile } from "@/pages/Profile/Profile";
import { Notifications } from "@/pages/Notifications/Notifications";
import { HelpCenter } from "@/pages/HelpCenter/HelpCenter";
import { Documentation } from "@/pages/Documentation/Documentation";
import { About } from "@/pages/About/About";
import { NotFound } from "@/pages/NotFound";

export function AppRoutes() {
  return (
    <Routes>
      {/* Public marketing site */}
      <Route path="/" element={<Landing />} />

      {/* Auth flow — redirects to /dashboard if already signed in */}
      <Route element={<PublicOnlyRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/two-factor" element={<TwoFactor />} />
        </Route>
      </Route>

      {/* Authenticated SOC console */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/live-threats" element={<LiveThreats />} />
          <Route path="/incidents" element={<Incidents />} />
          <Route path="/incidents/:id" element={<IncidentDetail />} />
          <Route path="/assets" element={<Assets />} />
          <Route path="/assets/:id" element={<AssetDetail />} />
          <Route path="/ai-analysis" element={<AIAnalysis />} />
          <Route path="/threat-intelligence" element={<ThreatIntelligence />} />
          <Route path="/blockchain-evidence" element={<BlockchainEvidence />} />
          <Route path="/blockchain-evidence/:id" element={<EvidenceDetail />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/compliance" element={<Compliance />} />
          <Route path="/users" element={<Users />} />
          <Route path="/soc-team" element={<SOCTeam />} />
          <Route path="/audit-logs" element={<AuditLogs />} />
          <Route path="/integrations" element={<Integrations />} />
          <Route path="/api-keys" element={<ApiKeys />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/docs" element={<Documentation />} />
          <Route path="/about" element={<About />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
