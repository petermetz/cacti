curl --location 'http://127.0.0.1:8080/api/v1/plugins/@hyperledger/cactus-plugin-ledger-connector-corda/invoke-contract' \
--header 'Content-Type: application/json' \
--data '{
    "timeoutMs": 60000,
    "flowFullClassName": "com.r3.corda.evminterop.workflows.IssueGenericAssetFlow",
    "flowInvocationType": "FLOW_DYNAMIC",
    "params": [
        {
            "jvmTypeKind": "PRIMITIVE",
            "jvmType": {
                "fqClassName": "java.lang.String"
            },
            "primitiveValue": "Cacti_Asset_1"
        }
    ]
}'

# Example Response:
#
# {
#     "success": true,
#     "callOutput": "{\"txhash\":{\"bytes\":\"f9/laWzziL5emgAXk1q29G3rIJxNg8djm0LFqRE4swA=\",\"offset\":0,\"size\":32},\"index\":0}",
#     "flowId": "[7f9c8d76-f56a-488c-91ff-58f4b6878b8f]",
#     "transactionId": null,
#     "progress": []
# }