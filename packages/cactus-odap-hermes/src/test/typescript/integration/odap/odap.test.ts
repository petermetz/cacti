import test, { Test } from "tape";
import { randomBytes } from "crypto";
import secp256k1 from "secp256k1";
/*import {

} from "../../../../main/typescript/public-api";*/
import { OdapGateway } from "../../../../main/typescript/gateway/odap-gateway";
import {
  CommitFinalMessage,
  CommitFinalResponseMessage,
  CommitPreparationMessage,
  CommitPreparationResponse,
  InitializationRequestMessage,
  InitialMessageAck,
  LockEvidenceMessage,
  TransferCommenceMessage,
  TransferCommenceResponseMessage,
  TransferCompleteMessage,
} from "../../../../main/typescript/public-api";
import { SHA256 } from "crypto-js";
//import { Logger } from "../../../../../../cactus-common/dist/types/main/typescript";
import { v4 as uuidV4 } from "uuid";
test("dummy test for odap", async (t: Test) => {
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
  const version = "0.0.0";
  const loggingProfile = "dummy";
  const accessControlProfile = "dummy";
  const applicationProfile = "dummy";
  const payloadProfile = {
    assetProfile: "dummy",
    capabilities: "",
  };
  const sourceGateWayDltSystem = "dummy";
  const recipientGateWayDltSystem = "dummy";
  const initializationRequestMessage: InitializationRequestMessage = {
    version: version,
    loggingProfile: loggingProfile,
    accessControlProfile: accessControlProfile,
    applicationProfile: applicationProfile,
    payloadProfile: payloadProfile,
    initializationRequestMessageSignature: "",
    sourceGatewayPubkey: dummyPubKey,
    sourceGateWayDltSystem: sourceGateWayDltSystem,
    recipientGateWayPubkey: dummyPubKey,
    recipientGateWayDltSystem: recipientGateWayDltSystem,
  };
  const dummyPrivKeyStr = odapGateWay.bufArray2HexStr(dummyPrivKeyBytes);
  /*initializationRequestMessage.initializationRequestMessageSignature = await odapGateWay.sign(
    JSON.stringify(initializationRequestMessage),
    dummyPrivKeyStr,
  );
  t.doesNotThrow(
    async () =>
      await odapGateWay.initiateTransfer(initializationRequestMessage),
    "does not throw if initial transfer proccessed",
  );*/
  initializationRequestMessage.initializationRequestMessageSignature = "";
  const initializeReqSignature = await odapGateWay.sign(
    JSON.stringify(initializationRequestMessage),
    dummyPrivKeyStr,
  );
  initializationRequestMessage.initializationRequestMessageSignature = initializeReqSignature;
  const initializeReqAck: InitialMessageAck = await odapGateWay.initiateTransfer(
    initializationRequestMessage,
  );
  initializationRequestMessage.initializationRequestMessageSignature = initializeReqSignature;
  const initializationMsgHash = SHA256(
    JSON.stringify(initializationRequestMessage),
  ).toString();
  t.equal(initializeReqAck.initialRequestMessageHash, initializationMsgHash);

  const sessionID = initializeReqAck.sessionID;
  const dummyHash = SHA256("dummy").toString();
  const senderDltSystem = "dummy";
  const recipientDltSystem = "dummy";

  const transferCommenceReq: TransferCommenceMessage = {
    sessionID: sessionID,
    messageType: "urn:ietf:odap:msgtype:transfer-commence-msg",
    originatorPubkey: dummyPubKey,
    beneficiaryPubkey: dummyPubKey,
    clientIdentityPubkey: dummyPubKey,
    serverIdentityPubkey: dummyPubKey,
    hashPrevMessage: initializationMsgHash,
    hashAssetProfile: dummyHash,
    senderDltSystem: senderDltSystem,
    recipientDltSystem: recipientDltSystem,
    clientSignature: "",
  };
  const transferCommenceReqSignature = await odapGateWay.sign(
    JSON.stringify(transferCommenceReq),
    dummyPrivKeyStr,
  );
  transferCommenceReq.clientSignature = transferCommenceReqSignature;
  const transferCommenceReqHash = SHA256(
    JSON.stringify(transferCommenceReq),
  ).toString();
  /*t.doesNotThrow(
    async () => await odapGateWay.lockEvidenceTransferCommence(transferCommenceReq),
    "does not throw if lock evidence proccessed",
  );*/
  const transferCommenceAck: TransferCommenceResponseMessage = await odapGateWay.lockEvidenceTransferCommence(
    transferCommenceReq,
  );
  t.equal(transferCommenceReqHash, transferCommenceAck.hashCommenceRequest);
  t.equal(
    transferCommenceReq.serverIdentityPubkey,
    transferCommenceAck.serverIdentityPubkey,
  );
  t.equal(
    transferCommenceReq.clientIdentityPubkey,
    transferCommenceAck.clientIdentityPubkey,
  );

  /* TODO: skip checking signature now, have to figure out a way to config the server gateway's publickey of the 
    const transferCommenceAckSignature = transferCommenceAck.serverSignature;

  const transferCommenceAckSignatureHex = new Uint8Array(
    Buffer.from(transferCommenceAckSignature, "hex"),
  );
  console.log(transferCommenceAckSignatureHex);
  const sourcePubkey = new Uint8Array(
    Buffer.from(transferCommenceReq.serverIdentityPubkey, "hex"),
  );
  transferCommenceAck.serverSignature = "";
  if (
    !secp256k1.ecdsaVerify(
      transferCommenceAckSignatureHex,
      Buffer.from(
        SHA256(JSON.stringify(transferCommenceAck)).toString(),
        "hex",
      ),
      sourcePubkey,
    )
  ) {
    t.error("transfer commence ack signature verify failed");
  }*/
  const commenceAckHash = SHA256(
    JSON.stringify(transferCommenceAck),
  ).toString();
  const lockEvidenceReq: LockEvidenceMessage = {
    sessionID: sessionID,
    messageType: "urn:ietf:odap:msgtype:lock-evidence-req-msg",
    clientIdentityPubkey: dummyPubKey,
    serverIdentityPubkey: dummyPubKey,
    clientSignature: "",
    hashCommenceAckRequest: commenceAckHash,
    lockEvidenceClaim: " ",
    lockEvidenceExpiration: " ",
  };
  lockEvidenceReq.clientSignature = await odapGateWay.sign(
    JSON.stringify(lockEvidenceReq),
    dummyPrivKeyStr,
  );
  const lockEvidenceReqHash = SHA256(
    JSON.stringify(lockEvidenceReq),
  ).toString();
  const lockEvidenceAck = await odapGateWay.lockEvidence(lockEvidenceReq);
  const lockEvidenceAckHash = SHA256(
    JSON.stringify(lockEvidenceAck),
  ).toString();

  t.equal(lockEvidenceReqHash, lockEvidenceAck.hashLockEvidenceRequest);
  t.equal(
    lockEvidenceReq.serverIdentityPubkey,
    lockEvidenceAck.serverIdentityPubkey,
  );
  t.equal(
    lockEvidenceReq.clientIdentityPubkey,
    lockEvidenceAck.clientIdentityPubkey,
  );
  //TODO: verify signature of lock evidence ack

  const commitPrepareReq: CommitPreparationMessage = {
    sessionID: sessionID,
    messageType: "urn:ietf:odap:msgtype:commit-prepare-msg",
    clientIdentityPubkey: dummyPubKey,
    serverIdentityPubkey: dummyPubKey,
    clientSignature: "",
    hashLockEvidenceAck: lockEvidenceAckHash,
  };
  commitPrepareReq.clientSignature = await odapGateWay.sign(
    JSON.stringify(commitPrepareReq),
    dummyPrivKeyStr,
  );
  const commitPrepareHash = SHA256(JSON.stringify(commitPrepareReq)).toString();
  /*t.doesNotThrow(
    async () => await odapGateWay.CommitPrepare(commitPrepareReq),
    "does not throw if lock evidence proccessed",
  );*/
  const commitPrepareAck: CommitPreparationResponse = await odapGateWay.CommitPrepare(
    commitPrepareReq,
  );
  const commitPrepareAckHash = SHA256(
    JSON.stringify(commitPrepareAck),
  ).toString();
  t.equal(commitPrepareHash, commitPrepareAck.hashCommitPrep);
  t.equal(
    commitPrepareReq.serverIdentityPubkey,
    commitPrepareAck.serverIdentityPubkey,
  );
  t.equal(
    commitPrepareReq.clientIdentityPubkey,
    commitPrepareAck.clientIdentityPubkey,
  );
  //TODO: verify signature

  const commitFinalReq: CommitFinalMessage = {
    sessionID: sessionID,
    messageType: "urn:ietf:odap:msgtype:commit-final-msg",
    clientIdentityPubkey: dummyPubKey,
    serverIdentityPubkey: dummyPubKey,
    clientSignature: "",
    hashCommitPrepareAck: commitPrepareAckHash,
    commitFinalClaim: "",
  };
  commitFinalReq.clientSignature = await odapGateWay.sign(
    JSON.stringify(commitFinalReq),
    dummyPrivKeyStr,
  );
  const commitFinalReqHash = SHA256(JSON.stringify(commitFinalReq)).toString();
  const commitFinalAck: CommitFinalResponseMessage = await odapGateWay.CommitFinal(
    commitFinalReq,
  );
  const commitFinalAckHash = SHA256(JSON.stringify(commitFinalAck)).toString();
  t.equal(commitFinalReqHash, commitFinalAck.hashCommitFinal);
  t.equal(
    commitFinalReq.serverIdentityPubkey,
    commitFinalAck.serverIdentityPubkey,
  );
  const transferCompleteReq: TransferCompleteMessage = {
    sessionID: sessionID,
    messageType: "urn:ietf:odap:msgtype:commit-transfer-complete-msg",
    clientIdentityPubkey: dummyPubKey,
    serverIdentityPubkey: dummyPubKey,
    clientSignature: "",
    hashTransferCommence: transferCommenceReqHash,
    hashCommitFinalAck: commitFinalAckHash,
  };
  transferCompleteReq.clientSignature = await odapGateWay.sign(
    JSON.stringify(transferCompleteReq),
    dummyPrivKeyStr,
  );
  t.doesNotThrow(
    async () => await odapGateWay.TransferComplete(transferCompleteReq),
    "does not throw if lock evidence proccessed",
  );
  //TODO verify signature
});
