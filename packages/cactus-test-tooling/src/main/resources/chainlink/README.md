# Chainlink Docker Compose Setup

Run it from the Cacti project root:

```sh
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


### LinkToken Contract API Surface

```solidity
contract LinkToken {
    function allowance(address owner, address spender) public returns (bool success);
    function approve(address spender, uint256 value) returns (bool success);
    function balanceOf(address owner) returns (uint256 balance);
    function decimals() returns (uint8 decimalPlaces);
    function decreaseApproval(address spender, uint256 addedValue) returns (bool success);
    function increaseApproval(address spender, uint256 subtractedValue);
    function decreaseAllowance(address spender, uint256 addedValue) returns (bool success);
    function increaseAllowance(address spender, uint256 subtractedValue);
    function name() returns (string tokenName);
    function symbol() returns (string tokenSymbol);
    function totalSupply() returns (uint256 totalTokensIssued);
    function transfer(address to, uint256 value) returns (bool success);
    function transferAndCall(address to, uint256 value, bytes data) returns (bool success);
    function transferFrom(address from, address to, uint256 value) returns (bool success);
}
```