import { LogLevelDesc } from "@hyperledger/cactus-common";

import {
  GetSubscriptionInfoV1Request,
  GetSubscriptionInfoV1Response,
} from "../../generated/openapi/typescript-axios/api";
import { getSubscriptionInfoV1Impl } from "./get-subscription-info-v1-impl";

export async function getSubscriptionInfoV1Http(
  ctx: { readonly logLevel: LogLevelDesc },
  request: GetSubscriptionInfoV1Request,
): Promise<GetSubscriptionInfoV1Response> {
  const subscriptionInfo = await getSubscriptionInfoV1Impl(ctx, request);
  return { subscriptionInfo };
}
