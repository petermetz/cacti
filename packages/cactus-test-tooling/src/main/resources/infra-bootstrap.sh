#!/usr/bin/env bash

set -e

SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)
echo "SCRIPT_DIR=$SCRIPT_DIR"

main() {
    #
    # Besu
    #
    BESU_CONTRACT_DEPLOY_URL_NO_KEYCHAIN="http://127.0.0.1:4000/api/v1/plugins/@hyperledger/cactus-plugin-ledger-connector-besu/deploy-contract-solidity-bytecode-no-keychain"
    BESU_CONTRACT_DEPLOY_URL="http://127.0.0.1:4000/api/v1/plugins/@hyperledger/cactus-plugin-ledger-connector-besu/deploy-contract-solidity-bytecode"
    BESU_KEYCHAIN_SET_URL="http://127.0.0.1:4000/api/v1/plugins/@hyperledger/cactus-plugin-keychain-memory/set-keychain-entry"

    BESU_LINK_TOKEN_ADDRESS=$(curl --location "$BESU_CONTRACT_DEPLOY_URL_NO_KEYCHAIN" \
        --no-progress-meter \
        --header 'Content-Type: application/json' \
        --data @$SCRIPT_DIR/contracts/LinkToken.cacti.deploy.besu.json | jq '.transactionReceipt.contractAddress')

    echo "BESU_LINK_TOKEN_ADDRESS=$BESU_LINK_TOKEN_ADDRESS"

    BESU_ROUTER_REQ=$(jq '.constructorArgs += ['"$BESU_LINK_TOKEN_ADDRESS"']' $SCRIPT_DIR/contracts/Router.cacti.deploy.besu.tpl.json)

    BESU_ROUTER_ADDRESS=$(curl --location "$BESU_CONTRACT_DEPLOY_URL_NO_KEYCHAIN" \
        --no-progress-meter \
        --header 'Content-Type: application/json' \
        --data "$BESU_ROUTER_REQ" | jq '.transactionReceipt.contractAddress')

    echo "BESU_ROUTER_ADDRESS=$BESU_ROUTER_ADDRESS"

    echo "Besu Sender Contract Constructor Arguments: [$BESU_ROUTER_ADDRESS, $BESU_LINK_TOKEN_ADDRESS]"

    BESU_SENDER_REQ=$(jq '.constructorArgs += ['"$BESU_ROUTER_ADDRESS,$BESU_LINK_TOKEN_ADDRESS"']' $SCRIPT_DIR/contracts/Sender.cacti.deploy.besu.tpl.json)

    BESU_SENDER_ADDRESS=$(curl --location "$BESU_CONTRACT_DEPLOY_URL_NO_KEYCHAIN" \
        --no-progress-meter \
        --header 'Content-Type: application/json' \
        --data "$BESU_SENDER_REQ" | jq '.transactionReceipt.contractAddress')

    echo "BESU_SENDER_ADDRESS=$BESU_SENDER_ADDRESS"

    
    echo "Besu OnRamp Contract Constructor Arguments: [$BESU_ROUTER_ADDRESS, $BESU_LINK_TOKEN_ADDRESS]"

    BESU_ON_RAMP_REQ=$(jq '.constructorArgs += ['"$BESU_ROUTER_ADDRESS,$BESU_LINK_TOKEN_ADDRESS"']' $SCRIPT_DIR/contracts/OnRamp.cacti.deploy.besu.tpl.json)

    BESU_ON_RAMP_ADDRESS=$(curl --location "$BESU_CONTRACT_DEPLOY_URL_NO_KEYCHAIN" \
        --no-progress-meter \
        --header 'Content-Type: application/json' \
        --data "$BESU_ON_RAMP_REQ" | jq '.transactionReceipt.contractAddress')

    echo "BESU_ON_RAMP_ADDRESS=$BESU_ON_RAMP_ADDRESS"

    #
    # Celo
    #
    CELO_CONTRACT_DEPLOY_URL="http://127.0.0.1:4000/api/v1/plugins/@hyperledger/cacti-plugin-ledger-connector-celo/deploy-contract"

    CELO_LINK_TOKEN_ADDRESS=$(curl --location "$CELO_CONTRACT_DEPLOY_URL" \
        --no-progress-meter \
        --header 'Content-Type: application/json' \
        --data @$SCRIPT_DIR/contracts/LinkToken.cacti.deploy.celo.json | jq '.receipt.contractAddress')

    echo "CELO_LINK_TOKEN_ADDRESS=$CELO_LINK_TOKEN_ADDRESS"

    ROUTER_CELO_JSON=$(jq '.constructorArgs += ['"$CELO_LINK_TOKEN_ADDRESS"']' $SCRIPT_DIR/contracts/Router.cacti.deploy.celo.tpl.json)

    CELO_ROUTER_ADDRESS=$(curl --location "$CELO_CONTRACT_DEPLOY_URL" \
        --no-progress-meter \
        --header 'Content-Type: application/json' \
        --data "$ROUTER_CELO_JSON" | jq '.receipt.contractAddress')

    echo "CELO_ROUTER_ADDRESS=$CELO_ROUTER_ADDRESS"

    echo "Celo Receiver Contract Constructor Arguments: [$CELO_ROUTER_ADDRESS]"

    CELO_RECEIVER_REQ=$(jq '.constructorArgs += ['"$CELO_ROUTER_ADDRESS"']' $SCRIPT_DIR/contracts/Receiver.cacti.deploy.celo.tpl.json)

    CELO_RECEIVER_ADDRESS=$(curl --location "$CELO_CONTRACT_DEPLOY_URL" \
        --no-progress-meter \
        --header 'Content-Type: application/json' \
        --data "$CELO_RECEIVER_REQ" | jq '.receipt.contractAddress')

    echo "CELO_RECEIVER_ADDRESS=$CELO_RECEIVER_ADDRESS"

    echo "All contracts deployed successfully."

    

}

# FIXME add curl checking utility function
# FIXME add jq checking utility function

main
