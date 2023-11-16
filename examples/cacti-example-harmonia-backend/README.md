# Cacti Workshop 2023

## Steps to Run The Demo Locally

1. # Open Terminal Window 1 
2. git clone https://github.com/petermetz/harmonia.git
3. git clone https://github.com/petermetz/cacti.git
4. cd cacti
5. docker compose -f ./examples/docker-compose-harmonia.yml up
6. # Open Terminal Window 2
7. cd harmonia
8. git switch workshop-cacti
9. cd harmonia/src/r3/atomic-swap/corda/
10. ./gradlew build -x test
11. cd ../evm
12. curl -L https://foundry.paradigm.xyz | bash
    1.  https://book.getfoundry.sh/getting-started/installation
13. foundryup
14. forge install && forge build
15. npm install
16. npx hardhat run deploy.js --network cacti
17. cd ../../../../../cacti
18. DOCKER_BUILDKIT=1 docker build ./packages/cactus-plugin-ledger-connector-corda/src/main-server/ -t cccs
19. npm run enable-corepack
20. yarn install
21. yarn configure
22. yarn build:dev
    1. This command might fail with an error that can be safely ignored (work in progress)
23. cd examples/cacti-example-harmonia-frontend
24. yarn run serve:proxy
25. Go to http://localhost:7000
26. Execute steps 1 to 4 on the GUI

## Points of Interest

**Cacti Git Repository**

1. ./examples/docker-compose-harmonia.yml
2. ./examples/cacti-example-harmonia-frontend/src/app/atomic-swaps/atomic-swaps-list/atomic-swaps-list.page.html
3. ./examples/cacti-example-harmonia-frontend/src/app/atomic-swaps/atomic-swaps-list/atomic-swaps-list.page.ts
4. ./examples/cacti-example-harmonia-frontend/proxy.conf.mjs
5. ./examples/cacti-example-harmonia-frontend/src/app/api-service.ts
6. ./examples/cacti-example-harmonia-backend/evm-interop-workflows-0.1.jar.base64

**Harmonia Git Repository**

1. ./src/r3/atomic-swap/evm/hardhat.config.js
2. ./src/r3/atomic-swap/corda/evm-interop-workflows/src/main/resources/migration/generic_asset_states.changelog-v1.xml
3. ./src/r3/atomic-swap/corda/evm-interop-workflows/src/main/kotlin/com/r3/corda/evminterop/workflows/GenericAsset.kt
   1. IssueGenericAssetFlow

## Useful Command Line Snippets

Pull Up Infrastructure Containers

```sh
docker compose -f ./examples/docker-compose-harmonia.yml up
```

List Flows of Deployed Contracts in the Corda Ledger

```sh
curl --location 'http://127.0.0.1:8080/api/v1/plugins/@hyperledger/cactus-plugin-ledger-connector-corda/list-flows' \
--header 'Content-Type: application/json' \
--data '{}'
```

```sh
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
```

Example Response:

```json
{
    "success": true,
    "callOutput": "{\"txhash\":{\"bytes\":\"f9/laWzziL5emgAXk1q29G3rIJxNg8djm0LFqRE4swA=\",\"offset\":0,\"size\":32},\"index\":0}",
    "flowId": "[7f9c8d76-f56a-488c-91ff-58f4b6878b8f]",
    "transactionId": null,
    "progress": []
}
```
