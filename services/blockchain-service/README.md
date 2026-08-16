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

## Chaincode API Reference — Sprint 1

### EvidenceContract

The Sprint 1 chaincode provides the Hyperledger Fabric contract skeleton
for the Sentinel Chain evidence ledger.

The contract is implemented using the Hyperledger Fabric Contract API for Go:

`github.com/hyperledger/fabric-contract-api-go/v2/contractapi`

### Current Sprint 1 contract

| Component | Description |
|---|---|
| `EvidenceContract` | Base Fabric contract for evidence records |
| `main()` | Creates and starts the Fabric chaincode |
| Chaincode name | `evidence` |
| Channel | `mychannel` |

Sprint 1 establishes the Fabric network and deployable chaincode foundation.
Evidence transaction functions are planned for Sprint 2.

### Planned Sprint 2 functions

The following evidence operations are part of the Sprint 2 implementation:

- `CreateEvidenceRecord`
- `UpdateChainOfCustody`
- `QueryAsset`
- `VerifyIntegrity`

These functions are intentionally not implemented in the Sprint 1 skeleton.

### Sprint 1 Validation

The Sprint 1 chaincode has been validated locally by:

1. Running the two-organization Hyperledger Fabric test network.
2. Creating and joining `mychannel` with Org1 and Org2.
3. Building the Go chaincode successfully.
4. Running `go test ./...` successfully.
5. Deploying the `evidence` chaincode to `mychannel`.
6. Verifying that both Org1 and Org2 approved the chaincode definition.
