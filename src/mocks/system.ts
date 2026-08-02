import type { BlockchainRecord, SystemStatusItem } from "@/types";

export const systemStatusItems: SystemStatusItem[] = [
  { id: "sys-1", name: "Blockchain Ledger", status: "operational", detail: "Fabric network \u2014 4/4 peers healthy" },
  { id: "sys-2", name: "Kafka Event Bus", status: "operational", detail: "Consumer lag: 0.4s avg" },
  { id: "sys-3", name: "AI Engine", status: "operational", detail: "6 models loaded \u00b7 GPU util. 38%" },
  { id: "sys-4", name: "Database Cluster", status: "operational", detail: "PostgreSQL + Elasticsearch healthy" },
  { id: "sys-5", name: "Container Orchestration", status: "operational", detail: "48/48 pods running" },
  { id: "sys-6", name: "API Gateway", status: "degraded", detail: "Elevated p95 latency (620ms)" },
];

export const blockchainRecords: BlockchainRecord[] = [
  { id: "EVD-3391", blockNumber: 585231, txHash: "0x8f2a...c19e", incidentId: "INC-1024", validator: "Org1-Peer0", timestamp: "2026-07-30T05:10:05Z", verified: true, digitalSignature: "3045022100..." },
  { id: "EVD-3392", blockNumber: 585230, txHash: "0x1b7d...9a4f", incidentId: "INC-1025", validator: "Org2-Peer0", timestamp: "2026-07-30T05:05:22Z", verified: true, digitalSignature: "3044022087..." },
  { id: "EVD-3393", blockNumber: 585229, txHash: "0xef34...771c", incidentId: "INC-1028", validator: "Org1-Peer0", timestamp: "2026-07-30T05:04:40Z", verified: true, digitalSignature: "3045022064..." },
  { id: "EVD-3394", blockNumber: 585228, txHash: "0x902c...3e8b", incidentId: "INC-1029", validator: "Org2-Peer1", timestamp: "2026-07-30T05:09:59Z", verified: true, digitalSignature: "3046022100..." },
  { id: "EVD-3388", blockNumber: 585224, txHash: "0x44aa...11d9", incidentId: "INC-1027", validator: "Org1-Peer1", timestamp: "2026-07-30T00:10:03Z", verified: true, digitalSignature: "3045022071..." },
];

export const kpiData = {
  threatScore: { value: 97, label: "Critical", delta: 4 },
  totalThreats: { value: 128, delta: 23.1 },
  criticalThreats: { value: 15, delta: 7.4 },
  responseRate: { value: 92, delta: 5.2 },
  detectionRate: { value: 98.4, delta: 1.1 },
  mitreCoverage: { value: 76, delta: 3.5 },
  mttd: { value: "4.2m", delta: -18.0 },
  mttr: { value: "22m", delta: -9.5 },
  assets: { total: 320, servers: 84, laptops: 142, cloud: 61, mobile: 33 },
  uptime: 99.98,
};

export const analystPerformance = [
  { name: "Riya Singh", resolved: 42, avgResponse: "6m", score: 96 },
  { name: "John Doe", resolved: 37, avgResponse: "8m", score: 91 },
  { name: "Jane Smith", resolved: 29, avgResponse: "11m", score: 87 },
  { name: "Arman Verma", resolved: 24, avgResponse: "9m", score: 89 },
];
