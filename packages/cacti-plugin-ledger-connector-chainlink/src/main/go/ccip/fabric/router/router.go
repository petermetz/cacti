// IMPORTANT: If you change the source code here make sure to also update the base64 representation of it in the file
// packages/cacti-plugin-ledger-connector-chainlink/src/main/typescript/ccip/fabric/router/router.go.ts
// Otherwise the test cases won't have an updated version of the contract to deploy despite the changes you've made here.
package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// EVMTokenAmount represents a token and its amount
type EVMTokenAmount struct {
	Token  string `json:"token"`
	Amount uint64 `json:"amount,string"`
}

// Any2EVMMessage represents a message received from another chain
type Any2EVMMessage struct {
	MessageId           string           `json:"messageId"`
	SourceChainSelector uint64           `json:"sourceChainSelector"`
	Sender              string           `json:"sender"`
	Data                string           `json:"data"`
	DestTokenAmounts    []EVMTokenAmount `json:"destTokenAmounts"`
}

// EVM2AnyMessage represents a message sent to another chain
type EVM2AnyMessage struct {
	Receiver     string           `json:"receiver"`
	Data         string           `json:"data"`
	TokenAmounts []EVMTokenAmount `json:"tokenAmounts"`
	FeeToken     string           `json:"feeToken"`
	ExtraArgs    string           `json:"extraArgs"`
}

// RouterContract provides methods to route messages
type RouterContract struct {
	contractapi.Contract
}

// CcipSend records and emits an outgoing message
func (rc *RouterContract) CcipSend(ctx contractapi.TransactionContextInterface, receiverHex, data, feeToken, extraArgs, tokenAmountsJson string) (string, error) {
	
	// Deserialize tokenAmountsJson into a local variable
	var tokenAmounts []EVMTokenAmount
	err := json.Unmarshal([]byte(tokenAmountsJson), &tokenAmounts)
	if err != nil {
		return "", fmt.Errorf("failed to deserialize tokenAmountsJson: %v", err)
	}

	// Create the message
	message := EVM2AnyMessage{
		Receiver:     receiverHex,
		Data:         data,
		TokenAmounts: tokenAmounts,
		FeeToken:     feeToken,
		ExtraArgs:    extraArgs,
	}

	// Generate a unique message ID
	txID := ctx.GetStub().GetTxID()

	// Store the message in state
	messageBytes, err := json.Marshal(message)
	if err != nil {
		return "", fmt.Errorf("failed to serialize message: %v", err)
	}
	err = ctx.GetStub().PutState(txID, messageBytes)
	if err != nil {
		return "", fmt.Errorf("failed to save message to state: %v", err)
	}

	// Emit an event
	err = ctx.GetStub().SetEvent("CCIPMessageSent", messageBytes)
	if err != nil {
		return "", fmt.Errorf("failed to emit event: %v", err)
	}

	return txID, nil
}

// RouteMessage records and emits an incoming message
func (rc *RouterContract) RouteMessage(ctx contractapi.TransactionContextInterface, messageId string, sourceChainSelector uint64, sender, data string, destTokenAmounts []EVMTokenAmount) error {
	// Create the message
	message := Any2EVMMessage{
		MessageId:           messageId,
		SourceChainSelector: sourceChainSelector,
		Sender:              sender,
		Data:                data,
		DestTokenAmounts:    destTokenAmounts,
	}

	// Store the message in state
	messageBytes, err := json.Marshal(message)
	if err != nil {
		return fmt.Errorf("failed to serialize message: %v", err)
	}
	err = ctx.GetStub().PutState(messageId, messageBytes)
	if err != nil {
		return fmt.Errorf("failed to save message to state: %v", err)
	}

	// Emit an event
	err = ctx.GetStub().SetEvent("MessageExecuted", messageBytes)
	if err != nil {
		return fmt.Errorf("failed to emit event: %v", err)
	}

	return nil
}

// QueryMessage retrieves a message by its ID
func (rc *RouterContract) QueryMessage(ctx contractapi.TransactionContextInterface, messageId string) (*Any2EVMMessage, error) {
	messageBytes, err := ctx.GetStub().GetState(messageId)
	if err != nil {
		return nil, fmt.Errorf("failed to read message from state: %v", err)
	}
	if messageBytes == nil {
		return nil, errors.New("message not found")
	}

	var message Any2EVMMessage
	err = json.Unmarshal(messageBytes, &message)
	if err != nil {
		return nil, fmt.Errorf("failed to deserialize message: %v", err)
	}

	return &message, nil
}

// QueryOutgoingMessage retrieves an outgoing message by its ID
func (rc *RouterContract) QueryOutgoingMessage(ctx contractapi.TransactionContextInterface, txID string) (*EVM2AnyMessage, error) {
	messageBytes, err := ctx.GetStub().GetState(txID)
	if err != nil {
		return nil, fmt.Errorf("failed to read message from state: %v", err)
	}
	if messageBytes == nil {
		return nil, errors.New("message not found")
	}

	var message EVM2AnyMessage
	err = json.Unmarshal(messageBytes, &message)
	if err != nil {
		return nil, fmt.Errorf("failed to deserialize message: %v", err)
	}

	return &message, nil
}

func main() {
	chaincode, err := contractapi.NewChaincode(&RouterContract{})
	if err != nil {
		fmt.Printf("Error creating RouterContract chaincode: %v", err)
		return
	}

	if err := chaincode.Start(); err != nil {
		fmt.Printf("Error starting RouterContract chaincode: %v", err)
	}
}
