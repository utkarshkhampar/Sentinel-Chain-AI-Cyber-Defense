// ---------------------------------------------------------------------------
// Reports
// ---------------------------------------------------------------------------
export interface ReportEntry {
  id: string;
  title: string;
  type: "Daily" | "Weekly" | "Monthly" | "Incident" | "Compliance" | "Blockchain Audit" | "AI";
  generatedAt: string;
  generatedBy: string;
  sizeKb: number;
}

export const reportsList: ReportEntry[] = [
  { id: "RPT-901", title: "Daily Security Summary \u2014 Jul 29", type: "Daily", generatedAt: "2026-07-30T01:00:00Z", generatedBy: "System", sizeKb: 214 },
  { id: "RPT-902", title: "Weekly SOC Performance Report", type: "Weekly", generatedAt: "2026-07-28T06:00:00Z", generatedBy: "System", sizeKb: 892 },
  { id: "RPT-903", title: "Incident Report \u2014 INC-1024 Malware Detection", type: "Incident", generatedAt: "2026-07-30T05:30:00Z", generatedBy: "Riya Singh", sizeKb: 156 },
  { id: "RPT-904", title: "Monthly Compliance Summary \u2014 July 2026", type: "Compliance", generatedAt: "2026-07-30T00:00:00Z", generatedBy: "System", sizeKb: 1240 },
  { id: "RPT-905", title: "Blockchain Evidence Audit Trail", type: "Blockchain Audit", generatedAt: "2026-07-29T18:00:00Z", generatedBy: "Jane Smith", sizeKb: 340 },
  { id: "RPT-906", title: "AI Model Performance Report", type: "AI", generatedAt: "2026-07-27T12:00:00Z", generatedBy: "John Doe", sizeKb: 478 },
];

// ---------------------------------------------------------------------------
// Compliance
// ---------------------------------------------------------------------------
export interface ComplianceFramework {
  id: string;
  name: string;
  fullName: string;
  status: "compliant" | "partial" | "non-compliant";
  score: number;
  controlsPassed: number;
  controlsTotal: number;
  lastAudit: string;
}

export const complianceFrameworks: ComplianceFramework[] = [
  { id: "soc2", name: "SOC 2", fullName: "Service Organization Control 2", status: "compliant", score: 96, controlsPassed: 58, controlsTotal: 60, lastAudit: "2026-06-15" },
  { id: "iso27001", name: "ISO 27001", fullName: "Information Security Management", status: "compliant", score: 93, controlsPassed: 108, controlsTotal: 114, lastAudit: "2026-05-30" },
  { id: "nist", name: "NIST CSF", fullName: "NIST Cybersecurity Framework", status: "partial", score: 81, controlsPassed: 89, controlsTotal: 108, lastAudit: "2026-06-01" },
  { id: "hipaa", name: "HIPAA", fullName: "Health Insurance Portability and Accountability Act", status: "compliant", score: 98, controlsPassed: 44, controlsTotal: 45, lastAudit: "2026-04-22" },
  { id: "gdpr", name: "GDPR", fullName: "General Data Protection Regulation", status: "partial", score: 78, controlsPassed: 32, controlsTotal: 41, lastAudit: "2026-05-10" },
  { id: "pcidss", name: "PCI DSS", fullName: "Payment Card Industry Data Security Standard", status: "compliant", score: 91, controlsPassed: 79, controlsTotal: 87, lastAudit: "2026-06-28" },
];

// ---------------------------------------------------------------------------
// Users & SOC Team
// ---------------------------------------------------------------------------
export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: "Administrator" | "Analyst" | "Auditor" | "Read-Only";
  status: "active" | "suspended" | "invited";
  lastActive: string;
  mfaEnabled: boolean;
}

export const systemUsers: SystemUser[] = [
  { id: "USR-01", name: "Riya Singh", email: "riya.singh@sentinelchain.io", role: "Administrator", status: "active", lastActive: "2026-07-30T05:10:00Z", mfaEnabled: true },
  { id: "USR-02", name: "John Doe", email: "john.doe@sentinelchain.io", role: "Analyst", status: "active", lastActive: "2026-07-30T05:05:00Z", mfaEnabled: true },
  { id: "USR-03", name: "Jane Smith", email: "jane.smith@sentinelchain.io", role: "Analyst", status: "active", lastActive: "2026-07-30T04:50:00Z", mfaEnabled: true },
  { id: "USR-04", name: "Arman Verma", email: "arman.verma@sentinelchain.io", role: "Analyst", status: "active", lastActive: "2026-07-29T22:15:00Z", mfaEnabled: false },
  { id: "USR-05", name: "Meera Iyer", email: "meera.iyer@sentinelchain.io", role: "Auditor", status: "active", lastActive: "2026-07-29T14:30:00Z", mfaEnabled: true },
  { id: "USR-06", name: "Carlos Mendes", email: "carlos.mendes@sentinelchain.io", role: "Read-Only", status: "invited", lastActive: "\u2014", mfaEnabled: false },
  { id: "USR-07", name: "Wei Zhang", email: "wei.zhang@sentinelchain.io", role: "Analyst", status: "suspended", lastActive: "2026-07-12T09:00:00Z", mfaEnabled: true },
];

export interface SocTeamMember extends SystemUser {
  title: string;
  shift: "Day" | "Night" | "Rotating";
  incidentsResolved: number;
  avgResponseTime: string;
}

export const socTeam: SocTeamMember[] = [
  { ...systemUsers[0], title: "SOC Manager", shift: "Day", incidentsResolved: 42, avgResponseTime: "6m" },
  { ...systemUsers[1], title: "Senior Security Analyst", shift: "Day", incidentsResolved: 37, avgResponseTime: "8m" },
  { ...systemUsers[2], title: "Security Analyst", shift: "Night", incidentsResolved: 29, avgResponseTime: "11m" },
  { ...systemUsers[3], title: "Threat Hunter", shift: "Rotating", incidentsResolved: 24, avgResponseTime: "9m" },
  { ...systemUsers[4], title: "Compliance Auditor", shift: "Day", incidentsResolved: 0, avgResponseTime: "\u2014" },
];

// ---------------------------------------------------------------------------
// Audit Logs
// ---------------------------------------------------------------------------
export interface AuditLogEntry {
  id: string;
  actor: string;
  action: string;
  target: string;
  timestamp: string;
  ip: string;
  result: "success" | "failed";
}

export const auditLogs: AuditLogEntry[] = [
  { id: "AUD-1001", actor: "Riya Singh", action: "Approved automated response", target: "INC-1024", timestamp: "2026-07-30T05:11:00Z", ip: "10.0.0.14", result: "success" },
  { id: "AUD-1002", actor: "John Doe", action: "Updated incident status", target: "INC-1025", timestamp: "2026-07-30T05:06:00Z", ip: "10.0.0.22", result: "success" },
  { id: "AUD-1003", actor: "System", action: "Anchored evidence to ledger", target: "EVD-3393", timestamp: "2026-07-30T05:04:40Z", ip: "internal", result: "success" },
  { id: "AUD-1004", actor: "carlos.mendes@sentinelchain.io", action: "Login attempt", target: "Authentication Service", timestamp: "2026-07-30T04:58:00Z", ip: "198.51.100.23", result: "failed" },
  { id: "AUD-1005", actor: "Jane Smith", action: "Generated compliance report", target: "RPT-904", timestamp: "2026-07-30T00:00:00Z", ip: "10.0.0.31", result: "success" },
  { id: "AUD-1006", actor: "Arman Verma", action: "Modified integration settings", target: "Slack Integration", timestamp: "2026-07-29T22:40:00Z", ip: "10.0.0.19", result: "success" },
  { id: "AUD-1007", actor: "Meera Iyer", action: "Exported audit trail", target: "EVD-3388..EVD-3394", timestamp: "2026-07-29T18:20:00Z", ip: "10.0.0.27", result: "success" },
];

// ---------------------------------------------------------------------------
// Integrations
// ---------------------------------------------------------------------------
export interface Integration {
  id: string;
  name: string;
  category: string;
  description: string;
  connected: boolean;
  logoInitials: string;
}

export const integrations: Integration[] = [
  { id: "int-slack", name: "Slack", category: "Notifications", description: "Route critical alerts to your SOC Slack channel.", connected: true, logoInitials: "SL" },
  { id: "int-splunk", name: "Splunk", category: "SIEM", description: "Forward normalized events into Splunk indices.", connected: true, logoInitials: "SP" },
  { id: "int-jira", name: "Jira", category: "Ticketing", description: "Auto-create tickets from escalated incidents.", connected: false, logoInitials: "JR" },
  { id: "int-pagerduty", name: "PagerDuty", category: "On-Call", description: "Trigger on-call pages for critical severity alerts.", connected: true, logoInitials: "PD" },
  { id: "int-msteams", name: "Microsoft Teams", category: "Notifications", description: "Post incident updates to Teams channels.", connected: false, logoInitials: "MT" },
  { id: "int-aws", name: "AWS CloudTrail", category: "Cloud", description: "Ingest CloudTrail logs for cloud workload monitoring.", connected: true, logoInitials: "AW" },
  { id: "int-okta", name: "Okta", category: "Identity", description: "Sync identity events for account-compromise detection.", connected: false, logoInitials: "OK" },
  { id: "int-crowdstrike", name: "CrowdStrike", category: "EDR", description: "Correlate endpoint telemetry with Sentinel Chain alerts.", connected: false, logoInitials: "CS" },
];

// ---------------------------------------------------------------------------
// API Keys
// ---------------------------------------------------------------------------
export interface ApiKeyEntry {
  id: string;
  name: string;
  keyPreview: string;
  scopes: string[];
  createdAt: string;
  lastUsed: string;
  status: "active" | "revoked";
}

export const apiKeys: ApiKeyEntry[] = [
  { id: "key-1", name: "Production Ingestion Key", keyPreview: "sk_live_7f3a...b21c", scopes: ["events:write", "assets:read"], createdAt: "2026-05-12", lastUsed: "2026-07-30T05:00:00Z", status: "active" },
  { id: "key-2", name: "Reporting Service Key", keyPreview: "sk_live_9d1e...44af", scopes: ["reports:read", "reports:write"], createdAt: "2026-06-01", lastUsed: "2026-07-29T18:00:00Z", status: "active" },
  { id: "key-3", name: "Staging Test Key", keyPreview: "sk_test_2b8c...901d", scopes: ["events:write"], createdAt: "2026-06-20", lastUsed: "2026-07-10T09:00:00Z", status: "active" },
  { id: "key-4", name: "Legacy Integration Key", keyPreview: "sk_live_0a4f...73ee", scopes: ["assets:read"], createdAt: "2025-11-02", lastUsed: "2026-02-14T00:00:00Z", status: "revoked" },
];

// ---------------------------------------------------------------------------
// AI Predictions
// ---------------------------------------------------------------------------
export interface AIPredictionEntry {
  id: string;
  model: string;
  target: string;
  verdict: string;
  confidence: number;
  timestamp: string;
  topFeatures: { feature: string; weight: number }[];
}

export const aiPredictions: AIPredictionEntry[] = [
  {
    id: "PRD-501",
    model: "GNN Lateral Movement Model",
    target: "Laptop-01",
    verdict: "Malicious \u2014 Active Infection",
    confidence: 97,
    timestamp: "2026-07-30T04:45:20Z",
    topFeatures: [
      { feature: "Unsigned binary from temp directory", weight: 0.34 },
      { feature: "Anomalous outbound connections", weight: 0.28 },
      { feature: "Process ancestry deviation", weight: 0.21 },
      { feature: "High entropy executable", weight: 0.17 },
    ],
  },
  {
    id: "PRD-502",
    model: "XGBoost Classifier",
    target: "Server-02",
    verdict: "Brute Force Attack",
    confidence: 91,
    timestamp: "2026-07-30T04:47:40Z",
    topFeatures: [
      { feature: "400+ failed logins in 8 minutes", weight: 0.41 },
      { feature: "Single source IP", weight: 0.25 },
      { feature: "Known credential-stuffing pattern", weight: 0.22 },
      { feature: "Off-hours attempt timing", weight: 0.12 },
    ],
  },
  {
    id: "PRD-503",
    model: "Autoencoder Anomaly Detector",
    target: "Cloud-01",
    verdict: "Anomalous Data Transfer",
    confidence: 64,
    timestamp: "2026-07-30T05:01:52Z",
    topFeatures: [
      { feature: "5.2GB outbound transfer", weight: 0.38 },
      { feature: "No prior transfer history", weight: 0.31 },
      { feature: "Unfamiliar destination endpoint", weight: 0.19 },
      { feature: "Session from new geography", weight: 0.12 },
    ],
  },
  {
    id: "PRD-504",
    model: "Isolation Forest",
    target: "Finance-Server-01",
    verdict: "Impossible Travel / Account Compromise",
    confidence: 95,
    timestamp: "2026-07-30T05:04:10Z",
    topFeatures: [
      { feature: "Two logins, incompatible geography", weight: 0.46 },
      { feature: "Session token reuse pattern", weight: 0.27 },
      { feature: "Residential proxy IP", weight: 0.18 },
      { feature: "Access to sensitive server", weight: 0.09 },
    ],
  },
];

export const uebaRiskScores = [
  { user: "mchen", department: "Finance", riskScore: 88, trend: "up" as const },
  { user: "jsmith", department: "Engineering", riskScore: 62, trend: "up" as const },
  { user: "akapoor", department: "Finance", riskScore: 74, trend: "flat" as const },
  { user: "rverma", department: "Sales", riskScore: 21, trend: "down" as const },
  { user: "lwong", department: "Engineering", riskScore: 35, trend: "flat" as const },
];
