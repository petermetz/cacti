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

# {
#     "success": true,
#     "callOutput": "{\"txhash\":{\"bytes\":\"EKYSfaGtAiaEhgRldkvqv3Wo4iY31D8lbE2y79ytRYo=\",\"offset\":0,\"size\":32},\"index\":0}",
#     "flowId": "[e8d5a20a-57c6-4193-acc4-10c333ba81dc]",
#     "transactionId": null,
#     "progress": []
# }