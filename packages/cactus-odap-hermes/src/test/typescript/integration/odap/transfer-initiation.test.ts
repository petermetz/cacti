import test, { Test } from "tape";
import { randomBytes } from "crypto";
import secp256k1 from "secp256k1";
import { v4 as uuidV4 } from "uuid";
/*import {

} from "../../../../main/typescript/public-api";*/
import { OdapGateway } from "../../../../main/typescript/gateway/odap-gateway";
import { InitializationRequestMessage } from "../../../../main/typescript/public-api";
test("dummy test for transfer initiation flow", async (t: Test) => {
  /*
    run a gateway(now only call function)
    send initiation flow
    recv initiation ack
    */
  const odapConstructor = {
    name: "cactus-plugin#odapGateway",
    dltIDs: ["dummy"],
    instanceId: uuidV4(),
  };
  const odapGateWay = new OdapGateway(odapConstructor);
  let dummyPrivKeyBytes = randomBytes(32);
  while (!secp256k1.privateKeyVerify(dummyPrivKeyBytes)) {
    dummyPrivKeyBytes = randomBytes(32);
  }
  const dummyPubKeyBytes = secp256k1.publicKeyCreate(dummyPrivKeyBytes);
  const dummyPubKey = odapGateWay.bufArray2HexStr(dummyPubKeyBytes);

  const initializationRequestMessage: InitializationRequestMessage = {
    version: "0.0.0",
    loggingProfile: "dummy",
    accessControlProfile: "dummy",
    applicationProfile: "dummy",
    payloadProfile: {
      assetProfile: "dummy",
      capabilities: "",
    },
    initializationRequestMessageSignature: "",
    sourceGatewayPubkey: dummyPubKey,
    sourceGateWayDltSystem: "dummy",
    recipientGateWayPubkey: dummyPubKey,
    recipientGateWayDltSystem: "dummy",
  };
  const dummyPrivKeyStr = odapGateWay.bufArray2HexStr(dummyPrivKeyBytes);
  initializationRequestMessage.initializationRequestMessageSignature = await odapGateWay.sign(
    JSON.stringify(initializationRequestMessage),
    dummyPrivKeyStr,
  );
  t.doesNotThrow(
    async () =>
      await odapGateWay.initiateTransfer(initializationRequestMessage),
    "does not throw if initial transfer proccessed",
  );
});
