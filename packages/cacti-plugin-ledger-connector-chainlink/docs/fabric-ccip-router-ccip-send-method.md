# Fabric router.go `CcipSend` Method

## Overview
The `CcipSend` method is part of the `RouterContract` and is designed for use in Hyperledger Fabric smart contracts. It enables Fabric chain codes to send data and/or tokens to an Ethereum Virtual Machine (EVM) network using the Chainlink Cross-Chain Interoperability Protocol (CCIP). This method plays a crucial role in bridging Hyperledger Fabric networks with EVM-compatible chains, facilitating interoperability between different blockchain ecosystems.

## Function Signature
```go
func (rc *RouterContract) CcipSend(
    ctx contractapi.TransactionContextInterface,
    receiverHex string,
    data string,
    feeToken string,
    extraArgs string,
    tokenAmountsJson string
) (string, error)
```

### Parameters
- **`ctx` (`contractapi.TransactionContextInterface`)**: Provides transaction context and access to the Hyperledger Fabric ledger API.
- **`receiverHex` (`string`)**: The hexadecimal address of the message recipient on the EVM network.
- **`data` (`string`)**: The payload to be sent to the target chain.
- **`feeToken` (`string`)**: The token identifier used to pay the transaction fee.
- **`extraArgs` (`string`)**: Additional optional arguments for custom use cases.
- **`tokenAmountsJson` (`string`)**: JSON-encoded string representing a list of token amounts to be transferred.

### Expected Structure of `tokenAmountsJson`
The JSON string should represent an array of `EVMTokenAmount` objects:
```json
[
    {
        "Token": "0xTokenAddress",
        "Amount": "1000"
    }
]
```

## Functionality
1. **Deserialization:**
   - Parses the `tokenAmountsJson` input to create a list of `EVMTokenAmount` structures.
   - Returns an error if deserialization fails.

2. **Message Creation:**
   - Constructs an `EVM2AnyMessage` object using the provided inputs.
   
3. **Transaction ID Generation:**
   - Generates a unique transaction identifier using the current transaction context.

4. **State Persistence:**
   - Serializes the message and stores it on the ledger with the generated transaction ID.

5. **Event Emission:**
   - Emits a `CCIPMessageSent` event containing the serialized message.
   - This event triggers the Hyperledger Cacti Fabric connector, which in turn calls the EVM proxy chain's CCIP router.

6. **Response:**
   - Returns the transaction ID upon success or an error message if any step fails.

## Return Values
- **`txID` (`string`)**: The unique identifier for the stored transaction.
- **`error` (`error`)**: An error object if the method fails.

## Example Usage
```go
result, err := routerContract.CcipSend(ctx, "0x1234567890abcdef", "dataPayload", "ETH", "customArgs", "[{\"Token\": \"0xTokenAddress\", \"Amount\": \"1000\"}]")
if err != nil {
    fmt.Printf("Error: %v\n", err)
} else {
    fmt.Printf("Transaction ID: %s\n", result)
}
```

## Event Specification
**Event Name:** `CCIPMessageSent`

**Payload:** Serialized JSON representation of the `EVM2AnyMessage` object.

### Example Event Payload
```json
{
    "Receiver": "0x1234567890abcdef",
    "Data": "dataPayload",
    "TokenAmounts": [
        {"Token": "0xTokenAddress", "Amount": "1000"}
    ],
    "FeeToken": "ETH",
    "ExtraArgs": "customArgs"
}
```

## Error Handling
- **Deserialization Errors:** Occur if `tokenAmountsJson` cannot be parsed.
- **Serialization Errors:** Occur if the message cannot be marshaled to JSON.
- **State Storage Errors:** Occur if the message cannot be saved to the ledger.
- **Event Emission Errors:** Occur if the `CCIPMessageSent` event cannot be emitted.

## Integration Notes
- The emitted `CCIPMessageSent` event is critical for triggering the Hyperledger Cacti Fabric connector.
- The connector must be configured to listen to this event and forward it to the EVM proxy chain's CCIP router.
- Ensure that the Chainlink nodes are properly configured to handle incoming events and execute the required operations.

