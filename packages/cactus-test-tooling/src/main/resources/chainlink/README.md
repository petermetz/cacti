# Chainlink Docker Compose Setup

Run it from the Cacti project root:

```sh
yarn configure &&  \
yarn lerna run build:bundle --scope=@hyperledger/cactus-cmd-api-server && \
docker compose \
    --project-directory packages/cactus-test-tooling/src/main/resources/chainlink/ \
    --file packages/cactus-test-tooling/src/main/resources/chainlink/chainlink-aio.docker-compose.yaml \
    up \
    --build
```


```sh
./packages/cactus-test-tooling/src/main/resources/infra-bootstrap.sh
```

## Contracts in Production

### Ethereum Mainnet

https://docs.chain.link/ccip/directory/mainnet/chain/mainnet

https://etherscan.io/address/0x925228D7B82d883Dde340A55Fe8e6dA56244A22C

https://etherscan.io/address/0x411dE17f12D1A34ecC7F45f49844626267c75e81#code

https://etherscan.io/address/0x8B63b3DE93431C0f756A493644d128134291fA1b#code

https://vscode.blockscan.com/ethereum/0x8B63b3DE93431C0f756A493644d128134291fA1b

