import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import { RuntimeError } from "run-time-error";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const main = async (argv: string[], env: NodeJS.ProcessEnv) => {
  if (!argv) {
    throw new RuntimeError(`Process argv cannot be falsy.`);
  }
  if (!env) {
    throw new RuntimeError(`Process env cannot be falsy.`);
  }
  const SCRIPT_DIR = __dirname;
  const PROJECT_DIR = path.join(SCRIPT_DIR, "../");
  console.log(`SCRIPT_DIR=${SCRIPT_DIR}`);
  console.log(`PROJECT_DIR=${PROJECT_DIR}`);

  const productionContainerImageFilePaths = [
    // ACCENTURE
    "./packages/cactus-plugin-ledger-connector-fabric/Dockerfile",
    "./packages/cactus-plugin-ledger-connector-besu/Dockerfile",
    "./packages/cactus-plugin-ledger-connector-corda/src/main-server/Dockerfile",
    "./packages/cactus-plugin-keychain-vault/src/cactus-keychain-vault-server/Dockerfile",
    "./packages/cactus-plugin-ledger-connector-quorum/Dockerfile",
    "./packages/cactus-plugin-ledger-connector-iroha/Dockerfile",
    "./packages/cactus-cmd-api-server/Dockerfile",
    // FUJITSU
    "./packages/cactus-plugin-ledger-connector-sawtooth-socketio/Dockerfile",
    "./packages/cactus-plugin-ledger-connector-go-ethereum-socketio/Dockerfile",
    "./packages/cactus-plugin-ledger-connector-cdl-socketio/Dockerfile",
    "./packages/cactus-cmd-socketio-server/Dockerfile",
    "./packages/cactus-plugin-ledger-connector-fabric-socketio/Dockerfile",
    "./packages/cactus-plugin-persistence-ethereum/Dockerfile",
    "./packages/cactus-plugin-ledger-connector-ethereum/Dockerfile",
    // IBM
    "./weaver/core/network/fabric-interop-cc/Dockerfile",
    "./weaver/core/relay/Dockerfile",
    "./weaver/core/identity-management/iin-agent/iinagent.Dockerfile",
    "./weaver/core/drivers/fabric-driver/fabricDriver.dockerfile",
  ];

  for (const aRelativePath of productionContainerImageFilePaths) {
    const anAbsolutePath = path.join(PROJECT_DIR, aRelativePath);
    console.log("Container image file absolute path: ", anAbsolutePath);
  }
};

main(process.argv, process.env);
