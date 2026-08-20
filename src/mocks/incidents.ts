import type { Alert, Incident, Asset } from "@/types";

export const mockAlerts: Alert[] = [
  { id: "ALT-5501", time: "04:45:12", severity: "critical", source: "Laptop-01", message: "Malware Detected", status: "open" },
  { id: "ALT-5502", time: "04:47:33", severity: "high", source: "Server-02", message: "Multiple Failed Logins", status: "investigating" },
  { id: "ALT-5503", time: "05:00:01", severity: "medium", source: "Firewall-01", message: "Port Scan Detected", status: "open" },
  { id: "ALT-5504", time: "05:01:45", severity: "low", source: "Cloud-01", message: "Unusual Traffic", status: "monitoring" },
  { id: "ALT-5505", time: "05:02:18", severity: "high", source: "DB-Server", message: "Privilege Escalation", status: "open" },
  { id: "ALT-5506", time: "05:04:02", severity: "critical", source: "Finance-Server-01", message: "Impossible Travel Login", status: "investigating" },
];

export const mockIncidents: Incident[] = [
  {
    id: "INC-1024",
    title: "Malware Detected on Laptop-01",
    severity: "critical",
    status: "open",
    assignedTo: "Riya Singh",
    createdAt: "2026-07-30T04:45:12Z",
    updatedAt: "2026-07-30T05:10:00Z",
    affectedAssets: ["Laptop-01"],
    description:
      "Endpoint agent flagged a known trojan signature combined with anomalous process ancestry (unsigned binary spawning from a temp directory). AI ensemble scored this as high-confidence malware based on entropy analysis of the executable and unusual outbound connection attempts immediately following execution.",
    mitreTechniques: ["T1059 - Command and Scripting Interpreter", "T1055 - Process Injection"],
    aiRecommendation:
      "Isolate Laptop-01 from the network immediately and initiate full disk forensic capture before remediation. High confidence this is an active infection, not a false positive.",
    blockchainVerified: true,
    evidenceRecordId: "EVD-3391",
  },
  {
    id: "INC-1025",
    title: "Brute-force Attack on SSH",
    severity: "high",
    status: "investigating",
    assignedTo: "John Doe",
    createdAt: "2026-07-30T04:47:33Z",
    updatedAt: "2026-07-30T05:05:00Z",
    affectedAssets: ["Server-02"],
    description:
      "Over 400 failed SSH authentication attempts from a single external IP within an 8-minute window, targeting three known service accounts. Pattern matches automated credential-stuffing tooling rather than manual attempts.",
    mitreTechniques: ["T1110 - Brute Force"],
    aiRecommendation:
      "Temporarily block source IP at the firewall and enforce key-based SSH authentication going forward. Review whether any of the three targeted accounts have login history from this IP range.",
    blockchainVerified: true,
    evidenceRecordId: "EVD-3392",
  },
  {
    id: "INC-1026",
    title: "Data Exfiltration Attempt",
    severity: "medium",
    status: "monitoring",
    assignedTo: "Jane Smith",
    createdAt: "2026-07-30T05:00:01Z",
    updatedAt: "2026-07-30T05:15:00Z",
    affectedAssets: ["Cloud-01"],
    description:
      "Outbound transfer of 5.2 GB to an unfamiliar external endpoint from a workload with no prior history of large external transfers. Timing coincides with an authenticated session from an unusual geographic location.",
    mitreTechniques: ["T1041 - Exfiltration Over C2 Channel"],
    aiRecommendation:
      "Continue monitoring; confidence is moderate. Recommend confirming with the asset owner whether this transfer was expected before escalating to containment.",
    blockchainVerified: false,
  },
  {
    id: "INC-1027",
    title: "Port Scan Detected",
    severity: "low",
    status: "closed",
    assignedTo: "SOC Analyst",
    createdAt: "2026-07-29T22:51:45Z",
    updatedAt: "2026-07-30T00:10:00Z",
    affectedAssets: ["Firewall-01"],
    description:
      "Sequential scan across 1,024 ports from a known scanning-service IP range (consistent with routine internet-wide research scanning, not a targeted probe).",
    mitreTechniques: ["T1046 - Network Service Discovery"],
    aiRecommendation: "No action required. Source IP matches a known benign research-scanner range.",
    blockchainVerified: true,
    evidenceRecordId: "EVD-3388",
  },
  {
    id: "INC-1028",
    title: "Impossible Travel Login Detected",
    severity: "critical",
    status: "investigating",
    assignedTo: "Riya Singh",
    createdAt: "2026-07-30T05:04:02Z",
    updatedAt: "2026-07-30T05:20:00Z",
    affectedAssets: ["Finance-Server-01", "User-mchen"],
    description:
      "User mchen authenticated from Mumbai at 04:58 and again from S\u00e3o Paulo at 05:04 \u2014 a travel time physically impossible between sessions. Session token reuse from a residential proxy IP is suspected.",
    mitreTechniques: ["T1078 - Valid Accounts"],
    aiRecommendation:
      "Force logout of all active sessions for user mchen and require re-authentication with MFA. High confidence of credential or session compromise.",
    blockchainVerified: true,
    evidenceRecordId: "EVD-3393",
  },
  {
    id: "INC-1029",
    title: "Suspicious PowerShell Execution Chain",
    severity: "high",
    status: "contained",
    assignedTo: "John Doe",
    createdAt: "2026-07-30T05:09:55Z",
    updatedAt: "2026-07-30T05:30:00Z",
    affectedAssets: ["Laptop-14"],
    description:
      "Obfuscated PowerShell command downloaded and executed a secondary payload in memory, consistent with a living-off-the-land technique commonly used to evade signature-based detection.",
    mitreTechniques: ["T1059.001 - PowerShell", "T1027 - Obfuscated Files or Information"],
    aiRecommendation: "Host has been isolated automatically per policy. Awaiting analyst review before returning to service.",
    blockchainVerified: true,
    evidenceRecordId: "EVD-3394",
  },
];

export const mockAssets: Asset[] = [
  { id: "AST-001", name: "Laptop-01", type: "laptop", status: "compromised", ipAddress: "192.168.4.12", owner: "Amit Kapoor", location: "Bengaluru HQ", riskScore: 92, lastSeen: "2026-07-30T05:10:00Z", os: "Windows 11 Pro", tags: ["finance", "vip"] },
  { id: "AST-002", name: "Server-02", type: "server", status: "at-risk", ipAddress: "10.0.1.22", owner: "Platform Team", location: "AWS ap-south-1", riskScore: 74, lastSeen: "2026-07-30T05:09:00Z", os: "Ubuntu 22.04", tags: ["production", "ssh-exposed"] },
  { id: "AST-003", name: "Firewall-01", type: "firewall", status: "healthy", ipAddress: "10.0.0.1", owner: "Network Team", location: "Bengaluru HQ", riskScore: 22, lastSeen: "2026-07-30T05:11:00Z", tags: ["perimeter"] },
  { id: "AST-004", name: "Cloud-01", type: "cloud", status: "at-risk", ipAddress: "10.0.2.55", owner: "Data Team", location: "AWS ap-south-1", riskScore: 61, lastSeen: "2026-07-30T05:08:00Z", tags: ["data-pipeline"] },
  { id: "AST-005", name: "DB-Server", type: "database", status: "at-risk", ipAddress: "172.16.0.9", owner: "Platform Team", location: "On-Prem DC", riskScore: 68, lastSeen: "2026-07-30T05:07:00Z", os: "PostgreSQL 16", tags: ["critical", "pii"] },
  { id: "AST-006", name: "Finance-Server-01", type: "server", status: "compromised", ipAddress: "10.0.1.40", owner: "Finance IT", location: "On-Prem DC", riskScore: 88, lastSeen: "2026-07-30T05:04:00Z", os: "Windows Server 2022", tags: ["finance", "critical"] },
  { id: "AST-007", name: "K8s-Cluster-Prod", type: "kubernetes", status: "healthy", ipAddress: "10.0.5.0/24", owner: "Platform Team", location: "AWS ap-south-1", riskScore: 18, lastSeen: "2026-07-30T05:11:00Z", tags: ["production"] },
  { id: "AST-008", name: "Switch-Core-01", type: "switch", status: "healthy", ipAddress: "10.0.0.2", owner: "Network Team", location: "Bengaluru HQ", riskScore: 12, lastSeen: "2026-07-30T05:11:00Z", tags: ["core-network"] },
  { id: "AST-009", name: "Container-auth-svc", type: "container", status: "healthy", ipAddress: "10.0.5.14", owner: "Platform Team", location: "AWS ap-south-1", riskScore: 15, lastSeen: "2026-07-30T05:11:00Z", tags: ["microservice"] },
  { id: "AST-010", name: "Mobile-Fleet-iOS", type: "mobile", status: "healthy", ipAddress: "Managed / MDM", owner: "IT Ops", location: "Fleet-wide", riskScore: 24, lastSeen: "2026-07-30T05:00:00Z", tags: ["byod"] },
];
