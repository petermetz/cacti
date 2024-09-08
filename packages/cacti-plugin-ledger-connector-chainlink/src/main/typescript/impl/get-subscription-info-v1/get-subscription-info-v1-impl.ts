import { LoggerProvider, LogLevelDesc } from "@hyperledger/cactus-common";

import { SubscriptionInfo } from "../../generated/openapi/typescript-axios/api";
import { GetSubscriptionInfoV1Request } from "../../generated/openapi/typescript-axios/api";

export async function getSubscriptionInfoV1Impl(
  ctx: { readonly logLevel: LogLevelDesc },
  req: GetSubscriptionInfoV1Request,
): Promise<SubscriptionInfo> {
  const log = LoggerProvider.getOrCreate({
    label: "getSubscriptionInfoV1Impl",
    level: ctx.logLevel,
  });
  log.debug("req=%s", req);
  log.debug("subscriptionId=%s", req.subscriptionId);

  throw new Error("Not yet implemented.");
}
