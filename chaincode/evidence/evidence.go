package main

import (
	"github.com/hyperledger/fabric-contract-api-go/v2/contractapi"
)

// EvidenceContract is the base contract for Sentinel Chain evidence records.
// Sprint 1 provides the chaincode skeleton.
// Evidence operations will be implemented in Sprint 2.
type EvidenceContract struct {
	contractapi.Contract
}

func main() {
	chaincode, err := contractapi.NewChaincode(&EvidenceContract{})
	if err != nil {
		panic(err)
	}

	if err := chaincode.Start(); err != nil {
		panic(err)
	}
}
