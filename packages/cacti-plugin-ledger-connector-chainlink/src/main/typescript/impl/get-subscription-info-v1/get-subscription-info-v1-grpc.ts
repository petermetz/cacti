import { LoggerProvider, LogLevelDesc } from "@hyperledger/cactus-common";

import * as subscription_info_pb from "../../generated/proto/protoc-gen-ts/models/subscription_info_pb";
import * as get_subscription_info_v1_response_pb from "../../generated/proto/protoc-gen-ts/models/get_subscription_info_v1_response_pb";
import * as default_service from "../../generated/proto/protoc-gen-ts/services/default_service";
import { getSubscriptionInfoV1Impl } from "./get-subscription-info-v1-impl";

export async function getSubscriptionInfoV1Grpc(
  ctx: { readonly logLevel: LogLevelDesc },
  reqPb: default_service.org.hyperledger.cacti.plugin.ledger.connector.chainlink.services.defaultservice.GetSubscriptionInfoV1Request,
): Promise<get_subscription_info_v1_response_pb.org.hyperledger.cacti.plugin.ledger.connector.chainlink.GetSubscriptionInfoV1ResponsePB> {
  const log = LoggerProvider.getOrCreate({
    label: "getSubscriptionInfoV1Grpc()",
    level: ctx.logLevel,
  });

  log.debug("reqPb=%o", reqPb);
  log.debug(
    "reqPb.getSubscriptionInfoV1RequestPB=%o",
    reqPb.getSubscriptionInfoV1RequestPB,
  );
  log.debug(
    "reqPb.getSubscriptionInfoV1RequestPB.subscriptionId=%o",
    reqPb.getSubscriptionInfoV1RequestPB.subscriptionId,
  );

  const req = {
    subscriptionId:
      reqPb.getSubscriptionInfoV1RequestPB.subscriptionId.toString(),
  };

  log.debug("GetSubscriptionInfoV1Request=%o", req);
  const subscriptionInfo = await getSubscriptionInfoV1Impl(ctx, req);
  log.debug("subscriptionInfo=%o", subscriptionInfo);

  const resPb =
    new get_subscription_info_v1_response_pb.org.hyperledger.cacti.plugin.ledger.connector.chainlink.GetSubscriptionInfoV1ResponsePB();

  const subscriptionInfoPb =
    subscription_info_pb.org.hyperledger.cacti.plugin.ledger.connector.chainlink.SubscriptionInfoPB.fromObject(
      subscriptionInfo as any, // FIXME
    );

  resPb.subscriptionInfo = subscriptionInfoPb;

  return resPb;
}
