import { ServerUnaryCall, sendUnaryData } from "@grpc/grpc-js";
import { status } from "@grpc/grpc-js";

import { google } from "../generated/proto/protoc-gen-ts/google/protobuf/empty";
import * as default_service from "../generated/proto/protoc-gen-ts/services/default_service";
import {
  LogLevelDesc,
  Logger,
  LoggerProvider,
} from "@hyperledger/cactus-common";
import { org } from "../generated/proto/protoc-gen-ts/models/deploy_contract_v1_response_pb";

export interface ICeloGrpcSvcOpenApiOptions {
  readonly logLevel?: LogLevelDesc;
}

export class CeloGrpcSvcOpenApi extends default_service.org.hyperledger.cacti
  .plugin.ledger.connector.celo.services.defaultservice
  .UnimplementedDefaultServiceService {
  // No choice but to disable the linter here because we need to be able to
  // declare fields on the implementation class but the parent class forces to
  // only have methods implementations not fields.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [field: string]: any;

  public static readonly CLASS_NAME = "CeloGrpcSvcOpenApi";

  public get className(): string {
    return CeloGrpcSvcOpenApi.CLASS_NAME;
  }

  private readonly log: Logger;

  /**
   * The log level that will be used throughout all the methods of this class.
   */
  private readonly logLevel: LogLevelDesc;
  constructor(public readonly opts: ICeloGrpcSvcOpenApiOptions) {
    super();
    this.logLevel = opts.logLevel || "INFO";
    const label = this.className;
    this.log = LoggerProvider.getOrCreate({ level: this.logLevel, label });
    this.log.debug(`Created instance of ${this.className} OK`);
  }

  // FIXME
  DeployContractV1(
    call: ServerUnaryCall<
      default_service.org.hyperledger.cacti.plugin.ledger.connector.celo.services.defaultservice.DeployContractV1Request,
      org.hyperledger.cacti.plugin.ledger.connector.celo.DeployContractV1ResponsePB
    >,
    callback: sendUnaryData<org.hyperledger.cacti.plugin.ledger.connector.celo.DeployContractV1ResponsePB>,
  ): void {
    return callback({
      message: "Status.UNIMPLEMENTED",
      code: status.UNIMPLEMENTED,
      details: "Service endpoint not yet implemented.",
    });
  }

  public GetOpenApiSpecV1(
    call: ServerUnaryCall<
      google.protobuf.Empty,
      default_service.org.hyperledger.cacti.plugin.ledger.connector.celo.services.defaultservice.GetOpenApiSpecV1Response
    >,
    callback: sendUnaryData<default_service.org.hyperledger.cacti.plugin.ledger.connector.celo.services.defaultservice.GetOpenApiSpecV1Response>,
  ): void {
    return callback({
      message: "Status.UNIMPLEMENTED",
      code: status.UNIMPLEMENTED,
      details: "Service endpoint not yet implemented.",
    });
  }
}
