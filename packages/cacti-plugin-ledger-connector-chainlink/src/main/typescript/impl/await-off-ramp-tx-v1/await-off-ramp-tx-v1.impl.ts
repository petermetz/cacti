import { LoggerProvider, LogLevelDesc } from "@hyperledger/cactus-common";
import { ethers, JsonRpcProvider } from "ethers";
import { Subject } from "rxjs";

import { CcipOffRampAbi } from "./off-ramp-metadata";
import { BadRequestError } from "http-errors-enhanced-cjs";

export async function awaitOffRampTxV1Impl(opts: {
  logLevel?: LogLevelDesc;
  readonly ccipMessageId: Readonly<string>;
  readonly offRampAddress: Readonly<string>;
}) {
  const log = LoggerProvider.getOrCreate({
    label: "awaitOffRampTxV1Impl()",
    level: opts.logLevel || "WARN",
  });

  log.debug("ENTER");

  if (!opts) {
    throw new BadRequestError("awaitOffRampTxV1Impl() opts cannot be falsy.");
  }

  const provider = new JsonRpcProvider();

  const contract = new ethers.Contract(
    opts.offRampAddress,
    CcipOffRampAbi,
    provider,
  );

  const subject = new Subject<any>(); // RxJS Subject for publishing events

  const subscription = contract.on(
    "ExecutionStateChanged",
    async (
      sourceChainSelector,
      sequenceNumber,
      messageId,
      messageHash,
      state,
      returnData,
      gasUsed,
    ) => {
      if (messageId === opts.ccipMessageId) {
        const eventData = {
          sourceChainSelector,
          sequenceNumber,
          messageId,
          messageHash,
          state,
          returnData,
          gasUsed,
        };

        if (state === 1) {
          // Success state (assuming state values are 0-indexed)
          subject.complete();
        } else {
          subject.next(eventData);
        }
      }
    },
  );

  log.debug("EXIT");

  return {
    ccipMessageId: opts.ccipMessageId,
    subscription,
    offRampAddress: opts.offRampAddress, // Return contract address
    stream: subject.asObservable(),
  };
}
