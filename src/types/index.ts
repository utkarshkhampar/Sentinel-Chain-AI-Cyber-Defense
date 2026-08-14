// ---------------------------------------------------------------------------
// Shared domain types for Sentinel Chain.
// These model the shapes the (future) backend API is expected to return.
// Mock data in `src/mocks` conforms to these types so swapping in real API
// calls later is a drop-in replacement.
// ---------------------------------------------------------------------------

export type Severity = "critical" | "high" | "medium" | "low";

export type IncidentStatus = "open" | "investigating" | "monitoring" | "contained" | "closed";

export type AssetType =
  | "server"
  | "laptop"
  | "mobile"
  | "cloud"
  | "firewall"
  | "switch"
  | "database"
  | "container"
  | "kubernetes";

export type AssetStatus = "healthy" | "at-risk" | "compromised" | "offline";

export interface ThreatEvent {
  id: string;
  title: string;
  severity: Severity;
  source: string;
  sourceIp: string;
  targetAsset: string;
  country: string;
  attackType: string;
  status: IncidentStatus;
  detectedAt: string; // ISO timestamp
  aiConfidence: number; // 0-100
  mitreTechnique: string;
}

export interface Alert {
  id: string;
  time: string;
  severity: Severity;
  source: string;
  message: string;
  status: IncidentStatus;
}

export interface Incident {
  id: string;
  title: string;
  severity: Severity;
  status: IncidentStatus;
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
  affectedAssets: string[];
  description: string;
  mitreTechniques: string[];
  aiRecommendation: string;
  blockchainVerified: boolean;
  evidenceRecordId?: string;
}

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  status: AssetStatus;
  ipAddress: string;
  owner: string;
  location: string;
  riskScore: number; // 0-100
  lastSeen: string;
  os?: string;
  tags: string[];
}

export interface BlockchainRecord {
  id: string;
  blockNumber: number;
  txHash: string;
  incidentId: string;
  validator: string;
  timestamp: string;
  verified: boolean;
  digitalSignature: string;
}

export interface AIPrediction {
  id: string;
  model: string;
  target: string;
  confidence: number;
  verdict: string;
  topFeatures: { feature: string; weight: number }[];
  timestamp: string;
}

export interface SystemStatusItem {
  id: string;
  name: string;
  status: "operational" | "degraded" | "down";
  detail: string;
}

export interface KpiTrend {
  label: string;
  value: number | string;
  delta: number; // percentage change, signed
  trend: "up" | "down";
  goodDirection: "up" | "down"; // whether "up" is good for this metric
}

export interface NavItem {
  label: string;
  path: string;
  icon: string; // lucide icon name, resolved in Sidebar
  section?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  role: string;
  email: string;
  avatarInitials: string;
}
