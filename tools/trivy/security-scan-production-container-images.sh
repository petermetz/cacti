#!/bin/bash

set -ex

NPM_PKG_VERSION="2.0.0-dev.197+a9a16d0c8"

# UNKNOWN,LOW,MEDIUM,HIGH,CRITICAL
SEVERITY_TO_LIST=CRITICAL,HIGH,MEDIUM,LOW,UNKNOWN

DOCKER_BUILDKIT=1 docker build . -f ./packages/cactus-cmd-api-server/Dockerfile -t cactus-cmd-api-server --build-arg NPM_PKG_VERSION=${NPM_PKG_VERSION}

DOCKER_BUILDKIT=1 docker build ./packages/cactus-plugin-ledger-connector-besu/ -f ./packages/cactus-plugin-ledger-connector-besu/Dockerfile -t cactus-connector-besu --build-arg NPM_PKG_VERSION=${NPM_PKG_VERSION}

DOCKER_BUILDKIT=1 docker build ./packages/cactus-plugin-ledger-connector-corda/src/main-server/ -f ./packages/cactus-plugin-ledger-connector-corda/src/main-server/Dockerfile -t cactus-connector-corda-server --build-arg NPM_PKG_VERSION=${NPM_PKG_VERSION}

DOCKER_BUILDKIT=1 docker build ./packages/cactus-plugin-ledger-connector-fabric/ -f ./packages/cactus-plugin-ledger-connector-fabric/Dockerfile -t cactus-connector-fabric --build-arg NPM_PKG_VERSION=${NPM_PKG_VERSION}

DOCKER_BUILDKIT=1 docker build ./packages/cactus-plugin-keychain-vault/src/cactus-keychain-vault-server/ -f ./packages/cactus-plugin-keychain-vault/src/cactus-keychain-vault-server/Dockerfile -t cactus-keychain-vault-server --build-arg NPM_PKG_VERSION=${NPM_PKG_VERSION}

DOCKER_BUILDKIT=1 docker build . -f ./packages/cactus-plugin-ledger-connector-iroha/Dockerfile -t cactus-connector-iroha --build-arg NPM_PKG_VERSION=${NPM_PKG_VERSION}

DOCKER_BUILDKIT=1 docker build . -f ./packages/cactus-plugin-ledger-connector-quorum/Dockerfile -t cactus-connector-quorum --build-arg NPM_PKG_VERSION=${NPM_PKG_VERSION}

trivy image --scanners vuln --format template --template '@tools/trivy/trivy-scan-output-tsv.tpl' --ignore-unfixed --vuln-type  os,library --severity  ${SEVERITY_TO_LIST}  cactus-cmd-api-server -o trivy-scan-cactus-cmd-api-server.tsv
trivy image --scanners vuln --format template --template '@tools/trivy/trivy-scan-output-tsv.tpl' --ignore-unfixed --vuln-type  os,library --severity  ${SEVERITY_TO_LIST}  cactus-connector-besu -o trivy-scan-cactus-connector-besu.tsv
trivy image --scanners vuln --format template --template '@tools/trivy/trivy-scan-output-tsv.tpl' --ignore-unfixed --vuln-type  os,library --severity  ${SEVERITY_TO_LIST}  cactus-connector-corda-server -o trivy-scan-cactus-connector-corda-server.tsv
trivy image --scanners vuln --format template --template '@tools/trivy/trivy-scan-output-tsv.tpl' --ignore-unfixed --vuln-type  os,library --severity  ${SEVERITY_TO_LIST}  cactus-connector-fabric -o trivy-scan-cactus-connector-fabric.tsv
trivy image --scanners vuln --format template --template '@tools/trivy/trivy-scan-output-tsv.tpl' --ignore-unfixed --vuln-type  os,library --severity  ${SEVERITY_TO_LIST}  cactus-keychain-vault-server -o trivy-scan-cactus-keychain-vault-server.tsv
trivy image --scanners vuln --format template --template '@tools/trivy/trivy-scan-output-tsv.tpl' --ignore-unfixed --vuln-type  os,library --severity  ${SEVERITY_TO_LIST}  cactus-connector-iroha -o trivy-scan-cactus-connector-iroha.tsv
trivy image --scanners vuln --format template --template '@tools/trivy/trivy-scan-output-tsv.tpl' --ignore-unfixed --vuln-type  os,library --severity  ${SEVERITY_TO_LIST}  cactus-connector-quorum -o trivy-scan-cactus-connector-quorum.tsv
