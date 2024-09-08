FROM debian:12.5-slim

RUN apt update --allow-releaseinfo-change && \
    apt install -y curl && \
    curl -sSfL https://raw.githubusercontent.com/ava-labs/avalanche-cli/main/scripts/install.sh | sh -s -- -b /usr/local/bin/ && \
    curl -sSfL https://raw.githubusercontent.com/ava-labs/avalanche-network-runner/main/scripts/install.sh | sh -s -- -b /usr/local/bin/

COPY ./avalanche-cli.config.json /config/avalanche-cli.config.json

RUN avalanche subnet create subnet1 --evm --evm-chain-id=1337 --evm-token=AETH --test-defaults
RUN avalanche subnet deploy subnet1 --local

# RUN avalanche blockchain deploy mybc --local --log-level=debug --config=/config/avalanche-cli.config.json


HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 CMD [ "avalanche-network-runner", "ping", "--log-level", "debug", "--endpoint=0.0.0.0:8080" ]

# Additional optinal CLI arguments for the network runner:
# Source: https://docs.avax.network/tooling/avalanche-network-runner/introduction
#
# --plugin-dir ${AVALANCHEGO_PLUGIN_PATH} \
# --blockchain-specs '[{"vm_name":"subnetevm","genesis":"/tmp/subnet-evm.genesis.json"}]' \
# --global-node-config '{"index-enabled":false, "api-admin-enabled":true,"network-peer-list-gossip-frequency":"300ms"}' \
# --custom-node-configs" '{"node1":{"log-level":"debug","api-admin-enabled":false},"node2":{...},...}'

CMD [ "avalanche-network-runner", "server", "--log-level", "debug", "--port=:8080", "--grpc-gateway-port=:8081" ]
# CMD [ "avalanche-network-runner", "control", "start", "--num-nodes=3" ,"--log-level", "debug", "--dial-timeout=3m0s" ]
# CMD [ "avalanche-network-runner", "control", "start" ]

