#!/bin/bash

set -ex

DOCKER_BUILDKIT=1 docker build . -f ./packages/cactus-cmd-api-server/Dockerfile -t cactus-cmd-api-server

DOCKER_BUILDKIT=1 docker build ./packages/cactus-plugin-ledger-connector-besu/ -f ./packages/cactus-plugin-ledger-connector-besu/Dockerfile -t cactus-connector-besu

# DOCKER_BUILDKIT=1 docker build ./packages/cactus-plugin-ledger-connector-corda/src/main-server/ -f ./packages/cactus-plugin-ledger-connector-corda/src/main-server/Dockerfile -t cactus-connector-corda-server

DOCKER_BUILDKIT=1 docker build ./packages/cactus-plugin-ledger-connector-fabric/ -f ./packages/cactus-plugin-ledger-connector-fabric/Dockerfile -t cactus-connector-fabric

DOCKER_BUILDKIT=1 docker build ./packages/cactus-plugin-keychain-vault/src/cactus-keychain-vault-server/ -f ./packages/cactus-plugin-keychain-vault/src/cactus-keychain-vault-server/Dockerfile -t cactus-keychain-vault-server

trivy image  --format template --template '@tools/trivy/trivy-scan-output-tsv.tpl' --ignore-unfixed --vuln-type  os,library --severity  CRITICAL,HIGH  cactus-cmd-api-server -o trivy-scan-cactus-cmd-api-server.tsv
trivy image  --format template --template '@tools/trivy/trivy-scan-output-tsv.tpl' --ignore-unfixed --vuln-type  os,library --severity  CRITICAL,HIGH  cactus-connector-besu -o trivy-scan-cactus-connector-besu.tsv
trivy image  --format template --template '@tools/trivy/trivy-scan-output-tsv.tpl' --ignore-unfixed --vuln-type  os,library --severity  CRITICAL,HIGH  cactus-connector-fabric -o trivy-scan-cactus-connector-fabric.tsv
trivy image  --format template --template '@tools/trivy/trivy-scan-output-tsv.tpl' --ignore-unfixed --vuln-type  os,library --severity  CRITICAL,HIGH  cactus-keychain-vault-server -o trivy-scan-cactus-keychain-vault-server.tsv
