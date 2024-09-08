# `@hyperledger/cacti-plugin-ledger-connector-chainlink`

This plugin provides `Cactus` a way to interact with Chainlink networks. Using this we can perform:
* Deploy Smart-contracts through bytecode.
* Build and sign transactions using different keystores.
* Invoke smart-contract functions that we have deployed on the network.
## Summary

  - [Getting Started](#getting-started)
  - [Architecture](#architecture)
  - [Usage](#usage)
  - [Prometheus Exporter](#prometheus-exporter)
  - [Runing the tests](#running-the-tests)
  - [Built With](#built-with)
  - [Contributing](#contributing)
  - [License](#license)
  - [Acknowledgments](#acknowledgments)

## Getting Started

Clone the git repository on your local machine. Follow these instructions that will get you a copy of the project up and running on
your local machine for development and testing purposes.

### Prerequisites

In the root of the project to install the dependencies execute the command:
```sh
npm run configure
```

### Compiling

In the project root folder, run this command to compile the plugin and create the dist directory:
```sh
npm run tsc
```

### Usage

#### Typescript Library (NodeJS)

> TODO

#### HTTP API Client

> TODO

#### ConnectRPC Client

> TODO

#### gRPC Client

> TODO

#### Running the container

Launch container with plugin configuration as an **environment variable**:
```sh
docker run \
  --rm \
  --publish 3000:3000 \
  --publish 4000:4000 \
  --env AUTHORIZATION_PROTOCOL='NONE' \
  --env AUTHORIZATION_CONFIG_JSON='{}' \
  --env GRPC_TLS_ENABLED=false \
  --env API_TLS_CERT_PEM=- \
  --env API_TLS_CLIENT_CA_PEM=- \
  --env API_TLS_KEY_PEM=- \
  --env API_TLS_ENABLED=false \
  --env API_MTLS_ENABLED=false \
  --env API_HOST=0.0.0.0 \
  --env LOG_LEVEL=INFO \
  ghcr.io/hyperledger/cactus-cmd-api-server:2024-07-03t18-38-45-dev-65adc3255 \
  node index.js \
  --plugins='[{"packageName": "@hyperledger/cacti-plugin-ledger-connector-chainlink", "type": "org.hyperledger.cactus.plugin_import_type.LOCAL", "action": "org.hyperledger.cactus.plugin_import_action.INSTALL",  "options": {"rpcApiHttpHost": "http://localhost:8545", "rpcApiWsHost":"ws://localhost:8546", "instanceId": "some-unique-chainlink-connector-instance-id"}}]'
```

Launch container with plugin configuration as a **CLI argument**:
```sh
docker run \
  --rm \
  --publish 3000:3000 \
  --publish 4000:4000 \
  --env AUTHORIZATION_PROTOCOL='NONE' \
  --env AUTHORIZATION_CONFIG_JSON='{}' \
  --env GRPC_TLS_ENABLED=false \
  --env API_TLS_CERT_PEM=- \
  --env API_TLS_CLIENT_CA_PEM=- \
  --env API_TLS_KEY_PEM=- \
  --env API_TLS_ENABLED=false \
  --env API_MTLS_ENABLED=false \
  --env API_HOST=0.0.0.0 \
  --env LOG_LEVEL=INFO \
  ghcr.io/hyperledger/cactus-cmd-api-server:2024-07-03t18-38-45-dev-65adc3255 \
  node index.js \
    --plugins='[{"packageName": "@hyperledger/cacti-plugin-ledger-connector-chainlink", "type": "org.hyperledger.cactus.plugin_import_type.LOCAL", "action": "org.hyperledger.cactus.plugin_import_action.INSTALL",  "options": {"rpcApiHttpHost": "http://localhost:8545", "rpcApiWsHost":"ws://localhost:8546", "instanceId": "some-unique-chainlink-connector-instance-id"}}]'
```

Launch container with **configuration file** mounted from host machine:
```sh
echo '{"plugins": [{"packageName": "@hyperledger/cacti-plugin-ledger-connector-chainlink", "type": "org.hyperledger.cactus.plugin_import_type.LOCAL", "action": "org.hyperledger.cactus.plugin_import_action.INSTALL",  "options": {"rpcApiHttpHost": "http://localhost:8545", "rpcApiWsHost":"ws://localhost:8546", "instanceId": "some-unique-chainlink-connector-instance-id"}}]}' > .cacti-config.json
```

```sh
docker run \
  --rm \
  --publish 3000:3000 \
  --publish 4000:4000 \
  --env AUTHORIZATION_PROTOCOL='NONE' \
  --env AUTHORIZATION_CONFIG_JSON='{}' \
  --env GRPC_TLS_ENABLED=false \
  --env API_TLS_CERT_PEM=- \
  --env API_TLS_CLIENT_CA_PEM=- \
  --env API_TLS_KEY_PEM=- \
  --env API_TLS_ENABLED=false \
  --env API_MTLS_ENABLED=false \
  --env API_HOST=0.0.0.0 \
  --env LOG_LEVEL=INFO \
  --mount type=bind,source="$(pwd)"/.cacti-config.json,target=/.cacti-config.json \
  ghcr.io/hyperledger/cactus-cmd-api-server:2024-07-03t18-38-45-dev-65adc3255 \
    node index.js \
    --config-file=/.cacti-config.json
```

#### Testing API calls with the container

Don't have a Chainlink network on hand to test with? Test or develop against our Chainlink All-In-One container!

**Terminal Window 1 (Ledger)**
```sh
docker run \
  --publish 0.0.0.0:8545:8545/tcp \
  --publish 0.0.0.0:8546:8546/tcp \
  --publish 0.0.0.0:8888:8888/tcp \
  --publish 0.0.0.0:9001:9001/tcp \
  --publish 0.0.0.0:9545:9545/tcp \
  ghcr.io/hyperledger/cactus-chainlink-all-in-one:2024-07-04-8c030ae
```

**Terminal Window 2 (Cacti API Server)**
```sh
docker run \
  --network=host \
  --rm \
  --publish 3000:3000 \
  --publish 4000:4000 \
  --env AUTHORIZATION_PROTOCOL='NONE' \
  --env AUTHORIZATION_CONFIG_JSON='{}' \
  --env GRPC_TLS_ENABLED=false \
  --env API_TLS_CERT_PEM=- \
  --env API_TLS_CLIENT_CA_PEM=- \
  --env API_TLS_KEY_PEM=- \
  --env API_TLS_ENABLED=false \
  --env API_MTLS_ENABLED=false \
  --env API_HOST=0.0.0.0 \
  --env LOG_LEVEL=INFO \
  ghcr.io/hyperledger/cactus-cmd-api-server:2024-07-03t18-38-45-dev-65adc3255 \
  node index.js \
  --plugins='[{"packageName": "@hyperledger/cacti-plugin-ledger-connector-chainlink", "type": "org.hyperledger.cactus.plugin_import_type.LOCAL", "action": "org.hyperledger.cactus.plugin_import_action.INSTALL",  "options": {"rpcApiHttpHost": "http://127.0.0.1:8545", "rpcApiWsHost":"ws://127.0.0.1:8546", "instanceId": "some-unique-chainlink-connector-instance-id"}}]'
```

**Terminal Window 3 (curl - replace eth accounts as needed)**
```sh
curl --location --request POST 'http://127.0.0.1:4000/api/v1/plugins/@hyperledger/cacti-plugin-ledger-connector-chainlink/run-transaction' \
--header 'Content-Type: application/json' \
--data-raw '{
    "web3SigningCredential": {
      "ethAccount": "627306090abaB3A6e1400e9345bC60c78a8BEf57",
      "secret": "c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3",
      "type": "PRIVATE_KEY_HEX"
    },
    "consistencyStrategy": {
      "blockConfirmations": 0,
      "receiptType": "NODE_TX_POOL_ACK"
    },
    "transactionConfig": {
      "from": "627306090abaB3A6e1400e9345bC60c78a8BEf57",
      "to": "f17f52151EbEF6C7334FAD080c5704D77216b732",
      "value": 1,
      "gas": 10000000
    }
}'
```

The above should produce a response that looks similar to this:

```json
{
    "success": true,
    "data": {
        "transactionReceipt": {
            "blockHash": "0x7c97c038a5d3bd84613fe23ed442695276d5d2df97f4e7c4f10ca06765033ffd",
            "blockNumber": 1218,
            "contractAddress": null,
            "cumulativeGasUsed": 21000,
            "from": "0x627306090abab3a6e1400e9345bc60c78a8bef57",
            "gasUsed": 21000,
            "logs": [],
            "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
            "status": true,
            "to": "0xf17f52151ebef6c7334fad080c5704d77216b732",
            "transactionHash": "0xc7fcb46c735bdc696d500bfc70c72595a2b8c31813929e5c61d9a5aec3376d6f",
            "transactionIndex": 0
        }
    }
}
```

## Prometheus Exporter

This class creates a prometheus exporter, which scrapes the transactions (total transaction count) for the use cases incorporating the use of Chainlink connector plugin.

### Prometheus Exporter Usage
The prometheus exporter object is initialized in the `PluginLedgerConnectorChainlink` class constructor itself, so instantiating the object of the `PluginLedgerConnectorChainlink` class, gives access to the exporter object.
You can also initialize the prometheus exporter object seperately and then pass it to the `IPluginLedgerConnectorChainlinkOptions` interface for `PluginLedgerConnectoChainlink` constructor.

`getPrometheusMetricsV1` function returns the prometheus exporter metrics, currently displaying the total transaction count, which currently increments everytime the `transact()` method of the `PluginLedgerConnectorChainlink` class is called.

### Prometheus Integration
To use Prometheus with this exporter make sure to install [Prometheus main component](https://prometheus.io/download/).
Once Prometheus is setup, the corresponding scrape_config needs to be added to the prometheus.yml

```(yaml)
- job_name: 'chainlink_ledger_connector_exporter'
  metrics_path: api/v1/plugins/@hyperledger/cacti-plugin-ledger-connector-chainlink/get-prometheus-exporter-metrics
  scrape_interval: 5s
  static_configs:
    - targets: ['{host}:{port}']
```

Here the `host:port` is where the prometheus exporter metrics are exposed. The test cases (For example, packages/cacti-plugin-ledger-connector-chainlink/src/test/typescript/integration/plugin-ledger-connector-chainlink/deploy-contract/deploy-contract-from-json.test.ts) exposes it over `0.0.0.0` and a random port(). The random port can be found in the running logs of the test case and looks like (42379 in the below mentioned URL)
`Metrics URL: http://0.0.0.0:42379/api/v1/plugins/@hyperledger/cacti-plugin-ledger-connector-chainlink/get-prometheus-exporter-metrics`

Once edited, you can start the prometheus service by referencing the above edited prometheus.yml file.
On the prometheus graphical interface (defaulted to http://localhost:9090), choose **Graph** from the menu bar, then select the **Console** tab. From the **Insert metric at cursor** drop down, select **cactus_chainlink_total_tx_count** and click **execute**

### Helper code

###### response.type.ts
This file contains the various responses of the metrics.

###### data-fetcher.ts
This file contains functions encasing the logic to process the data points

###### metrics.ts
This file lists all the prometheus metrics and what they are used for.

## Running the tests

To check that all has been installed correctly and that the pugin has no errors run the tests:

* Run this command at the project's root:
```sh
npm run test:plugin-ledger-connector-chainlink
```

## Contributing

We welcome contributions to Hyperledger Cactus in many forms, and there’s always plenty to do!

Please review [CONTRIBUTING.md](../../CONTRIBUTING.md) to get started.

## License

This distribution is published under the Apache License Version 2.0 found in the [LICENSE](../../LICENSE) file.

## Acknowledgments 
