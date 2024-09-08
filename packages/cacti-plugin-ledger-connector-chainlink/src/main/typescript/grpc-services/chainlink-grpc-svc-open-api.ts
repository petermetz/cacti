import { ServerUnaryCall, sendUnaryData } from "@grpc/grpc-js";
import { status } from "@grpc/grpc-js";

import {
  LogLevelDesc,
  Logger,
  LoggerProvider,
  createRuntimeErrorWithCause,
  safeStringifyException,
} from "@hyperledger/cactus-common";

import { google } from "../generated/proto/protoc-gen-ts/google/protobuf/empty";
import * as default_service from "../generated/proto/protoc-gen-ts/services/default_service";
import { getSubscriptionInfoV1Grpc } from "../impl/get-subscription-info-v1/get-subscription-info-v1-grpc";
import { org } from "../generated/proto/protoc-gen-ts/models/get_subscription_info_v1_response_pb";

export interface IChainlinkGrpcSvcOpenApiOptions {
  readonly logLevel?: LogLevelDesc;
}

export class ChainlinkGrpcSvcOpenApi extends default_service.org.hyperledger
  .cacti.plugin.ledger.connector.chainlink.services.defaultservice
  .UnimplementedDefaultServiceService {
  // No choice but to disable the linter here because we need to be able to
  // declare fields on the implementation class but the parent class forces to
  // only have methods implementations not fields.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [field: string]: any;

  public static readonly CLASS_NAME = "ChainlinkGrpcSvcOpenApi";

  public get className(): string {
    return ChainlinkGrpcSvcOpenApi.CLASS_NAME;
  }

  private readonly log: Logger;

  /**
   * The log level that will be used throughout all the methods of this class.
   */
  private readonly logLevel: LogLevelDesc;
  constructor(public readonly opts: IChainlinkGrpcSvcOpenApiOptions) {
    super();
    this.logLevel = opts.logLevel || "INFO";
    const label = this.className;
    this.log = LoggerProvider.getOrCreate({ level: this.logLevel, label });
    this.log.debug(`Created instance of ${this.className} OK`);
  }

  public GetSubscriptionInfoV1(
    call: ServerUnaryCall<
      default_service.org.hyperledger.cacti.plugin.ledger.connector.chainlink.services.defaultservice.GetSubscriptionInfoV1Request,
      org.hyperledger.cacti.plugin.ledger.connector.chainlink.GetSubscriptionInfoV1ResponsePB
    >,
    callback: sendUnaryData<org.hyperledger.cacti.plugin.ledger.connector.chainlink.GetSubscriptionInfoV1ResponsePB>,
  ): void {
    getSubscriptionInfoV1Grpc({ logLevel: this.logLevel }, call.request)
      .then((res) => {
        callback(null, res);
      })
      .catch((cause: unknown) => {
        const eMsg = "getSubscriptionInfoV1Grpc() crashed with";
        const ex = createRuntimeErrorWithCause(eMsg, cause);
        const exJson = safeStringifyException(ex);
        this.log.debug("%s %o", eMsg, cause);
        callback({
          message: "status.INTERNAL - getSubscriptionInfoV1Grpc() call crashed",
          code: status.INTERNAL,
          stack: ex.stack,
          name: ex.name,
          details: exJson,
        });
      });
  }

  public GetOpenApiSpecV1(
    call: ServerUnaryCall<
      google.protobuf.Empty,
      default_service.org.hyperledger.cacti.plugin.ledger.connector.chainlink.services.defaultservice.GetOpenApiSpecV1Response
    >,
    callback: sendUnaryData<default_service.org.hyperledger.cacti.plugin.ledger.connector.chainlink.services.defaultservice.GetOpenApiSpecV1Response>,
  ): void {
    return callback({
      message: "Status.UNIMPLEMENTED",
      code: status.UNIMPLEMENTED,
      details: "Service endpoint not yet implemented.",
    });
  }
}
