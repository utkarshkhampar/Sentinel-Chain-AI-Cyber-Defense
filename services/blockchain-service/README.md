# Sentinel Chain — Blockchain Service

## Sprint 1

The blockchain service provides the Hyperledger Fabric foundation for storing
tamper-proof cybersecurity evidence.

## Fabric Network Topology

The local development network contains two organizations and one ordering
service:

```text
                    ┌─────────────────────┐
                    │  Orderer            │
                    │  orderer.example.com │
                    │      Port: 7050      │
                    └──────────┬──────────┘
                               │
                         mychannel
                    ┌──────────┴──────────┐
                    │                     │
          ┌─────────▼─────────┐ ┌─────────▼─────────┐
          │      Org1         │ │       Org2        │
          │ org1.example.com  │ │  org2.example.com │
          │                   │ │                    │
          │ peer0.org1        │ │ peer0.org2         │
          │ Port: 7051        │ │ Port: 9051         │
          └───────────────────┘ └────────────────────┘
