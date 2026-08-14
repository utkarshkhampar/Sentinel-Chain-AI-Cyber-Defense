export interface IOC {
  id: string;
  type: "IP" | "Domain" | "Hash" | "URL";
  value: string;
  threatLevel: "critical" | "high" | "medium" | "low";
  source: string;
  firstSeen: string;
  tags: string[];
}

export const iocFeed: IOC[] = [
  { id: "IOC-001", type: "IP", value: "185.220.101.42", threatLevel: "critical", source: "AlienVault OTX", firstSeen: "2026-07-28", tags: ["tor-exit", "brute-force"] },
  { id: "IOC-002", type: "Domain", value: "secure-update-portal.net", threatLevel: "high", source: "Recorded Future", firstSeen: "2026-07-27", tags: ["phishing"] },
  { id: "IOC-003", type: "Hash", value: "e3b0c44298fc1c149afbf4c8996fb924", threatLevel: "critical", source: "VirusTotal", firstSeen: "2026-07-29", tags: ["ransomware", "trojan"] },
  { id: "IOC-004", type: "URL", value: "hxxp://185.220.101.42/payload.bin", threatLevel: "high", source: "Internal Sandbox", firstSeen: "2026-07-30", tags: ["c2", "dropper"] },
  { id: "IOC-005", type: "IP", value: "45.83.64.19", threatLevel: "medium", source: "AbuseIPDB", firstSeen: "2026-07-26", tags: ["scanner"] },
  { id: "IOC-006", type: "Domain", value: "cdn-analytics-service.com", threatLevel: "medium", source: "Recorded Future", firstSeen: "2026-07-25", tags: ["c2", "beaconing"] },
];

export interface CVE {
  id: string;
  title: string;
  severity: "critical" | "high" | "medium" | "low";
  cvssScore: number;
  affectedProduct: string;
  published: string;
  exploitAvailable: boolean;
}

export const cveDatabase: CVE[] = [
  { id: "CVE-2026-31337", title: "Remote Code Execution in Apache Log Processor", severity: "critical", cvssScore: 9.8, affectedProduct: "Apache Log4Utils 2.x", published: "2026-07-15", exploitAvailable: true },
  { id: "CVE-2026-28901", title: "Privilege Escalation in Container Runtime", severity: "high", cvssScore: 8.4, affectedProduct: "ContainerD < 1.7.9", published: "2026-07-10", exploitAvailable: true },
  { id: "CVE-2026-27654", title: "SQL Injection in Legacy Admin Panel", severity: "high", cvssScore: 7.9, affectedProduct: "Internal Admin Tool v3", published: "2026-07-05", exploitAvailable: false },
  { id: "CVE-2026-25102", title: "Authentication Bypass in VPN Gateway", severity: "critical", cvssScore: 9.1, affectedProduct: "SecureVPN Gateway 4.2", published: "2026-06-28", exploitAvailable: true },
  { id: "CVE-2026-22987", title: "Cross-Site Scripting in Reporting Module", severity: "medium", cvssScore: 6.1, affectedProduct: "Sentinel Chain Reports UI", published: "2026-06-20", exploitAvailable: false },
];

export interface MitreTechnique {
  id: string;
  tactic: string;
  name: string;
  detections: number;
}

export const mitreMatrix: MitreTechnique[] = [
  { id: "T1595", tactic: "Reconnaissance", name: "Active Scanning", detections: 18 },
  { id: "T1078", tactic: "Initial Access", name: "Valid Accounts", detections: 12 },
  { id: "T1566", tactic: "Initial Access", name: "Phishing", detections: 27 },
  { id: "T1059", tactic: "Execution", name: "Command and Scripting Interpreter", detections: 34 },
  { id: "T1053", tactic: "Persistence", name: "Scheduled Task/Job", detections: 9 },
  { id: "T1068", tactic: "Privilege Escalation", name: "Exploitation for Privilege Escalation", detections: 14 },
  { id: "T1027", tactic: "Defense Evasion", name: "Obfuscated Files or Information", detections: 21 },
  { id: "T1110", tactic: "Credential Access", name: "Brute Force", detections: 45 },
  { id: "T1046", tactic: "Discovery", name: "Network Service Discovery", detections: 31 },
  { id: "T1021", tactic: "Lateral Movement", name: "Remote Services", detections: 8 },
  { id: "T1005", tactic: "Collection", name: "Data from Local System", detections: 6 },
  { id: "T1041", tactic: "Exfiltration", name: "Exfiltration Over C2 Channel", detections: 11 },
];

export interface MalwareEntry {
  name: string;
  family: string;
  severity: "critical" | "high" | "medium" | "low";
  detections: number;
  trend: "up" | "down" | "flat";
}

export const malwareFeed: MalwareEntry[] = [
  { name: "Emotet.Variant.C", family: "Trojan / Botnet", severity: "critical", detections: 142, trend: "up" },
  { name: "LockPoint Ransomware", family: "Ransomware", severity: "critical", detections: 38, trend: "up" },
  { name: "SilentStealer", family: "Infostealer", severity: "high", detections: 76, trend: "flat" },
  { name: "GhostLoader", family: "Dropper", severity: "high", detections: 54, trend: "down" },
  { name: "AdClick.Generic", family: "Adware", severity: "low", detections: 210, trend: "down" },
];

export const trendingThreats = [
  { name: "Credential stuffing campaigns targeting SaaS logins", change: "+34%" },
  { name: "Living-off-the-land PowerShell abuse", change: "+21%" },
  { name: "Supply-chain compromised npm packages", change: "+18%" },
  { name: "AI-generated phishing content", change: "+47%" },
];
