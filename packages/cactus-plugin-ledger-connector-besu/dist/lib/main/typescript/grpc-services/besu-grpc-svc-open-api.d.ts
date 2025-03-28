import { ServerUnaryCall, sendUnaryData } from "@grpc/grpc-js";
import { google } from "../generated/proto/protoc-gen-ts/google/protobuf/empty";
import * as deploy_contract_solidity_bytecode_v1_response_pb from "../generated/proto/protoc-gen-ts/models/deploy_contract_solidity_bytecode_v1_response_pb";
import * as get_balance_v1_response_pb from "../generated/proto/protoc-gen-ts/models/get_balance_v1_response_pb";
import * as get_besu_record_v1_response_pb from "../generated/proto/protoc-gen-ts/models/get_besu_record_v1_response_pb";
import * as get_block_v1_response_pb from "../generated/proto/protoc-gen-ts/models/get_block_v1_response_pb";
import * as get_past_logs_v1_response_pb from "../generated/proto/protoc-gen-ts/models/get_past_logs_v1_response_pb";
import * as get_transaction_v1_response_pb from "../generated/proto/protoc-gen-ts/models/get_transaction_v1_response_pb";
import * as invoke_contract_v1_response_pb from "../generated/proto/protoc-gen-ts/models/invoke_contract_v1_response_pb";
import * as run_transaction_response_pb from "../generated/proto/protoc-gen-ts/models/run_transaction_response_pb";
import * as sign_transaction_response_pb from "../generated/proto/protoc-gen-ts/models/sign_transaction_response_pb";
import * as default_service from "../generated/proto/protoc-gen-ts/services/default_service";
import { LogLevelDesc } from "@hyperledger/cactus-common";
import Web3 from "web3";
export interface IBesuGrpcSvcOpenApiOptions {
    readonly logLevel?: LogLevelDesc;
    readonly web3: Web3;
}
export declare class BesuGrpcSvcOpenApi extends default_service.org.hyperledger.cacti
    .plugin.ledger.connector.besu.services.defaultservice
    .UnimplementedDefaultServiceService {
    readonly opts: IBesuGrpcSvcOpenApiOptions;
    [field: string]: any;
    static readonly CLASS_NAME = "BesuGrpcSvcOpenApi";
    get className(): string;
    private readonly log;
    private readonly web3;
    /**
     * The log level that will be used throughout all the methods of this class.
     */
    private readonly logLevel;
    constructor(opts: IBesuGrpcSvcOpenApiOptions);
    DeployContractSolBytecodeV1(call: ServerUnaryCall<default_service.org.hyperledger.cacti.plugin.ledger.connector.besu.services.defaultservice.DeployContractSolBytecodeV1Request, deploy_contract_solidity_bytecode_v1_response_pb.org.hyperledger.cacti.plugin.ledger.connector.besu.DeployContractSolidityBytecodeV1ResponsePB>, callback: sendUnaryData<deploy_contract_solidity_bytecode_v1_response_pb.org.hyperledger.cacti.plugin.ledger.connector.besu.DeployContractSolidityBytecodeV1ResponsePB>): void;
    DeployContractSolBytecodeNoKeychainV1(call: ServerUnaryCall<default_service.org.hyperledger.cacti.plugin.ledger.connector.besu.services.defaultservice.DeployContractSolBytecodeNoKeychainV1Request, deploy_contract_solidity_bytecode_v1_response_pb.org.hyperledger.cacti.plugin.ledger.connector.besu.DeployContractSolidityBytecodeV1ResponsePB>, callback: sendUnaryData<deploy_contract_solidity_bytecode_v1_response_pb.org.hyperledger.cacti.plugin.ledger.connector.besu.DeployContractSolidityBytecodeV1ResponsePB>): void;
    GetBalanceV1(call: ServerUnaryCall<default_service.org.hyperledger.cacti.plugin.ledger.connector.besu.services.defaultservice.GetBalanceV1Request, get_balance_v1_response_pb.org.hyperledger.cacti.plugin.ledger.connector.besu.GetBalanceV1ResponsePB>, callback: sendUnaryData<get_balance_v1_response_pb.org.hyperledger.cacti.plugin.ledger.connector.besu.GetBalanceV1ResponsePB>): void;
    GetBesuRecordV1(call: ServerUnaryCall<default_service.org.hyperledger.cacti.plugin.ledger.connector.besu.services.defaultservice.GetBesuRecordV1Request, get_besu_record_v1_response_pb.org.hyperledger.cacti.plugin.ledger.connector.besu.GetBesuRecordV1ResponsePB>, callback: sendUnaryData<get_besu_record_v1_response_pb.org.hyperledger.cacti.plugin.ledger.connector.besu.GetBesuRecordV1ResponsePB>): void;
    GetBlockV1(call: ServerUnaryCall<default_service.org.hyperledger.cacti.plugin.ledger.connector.besu.services.defaultservice.GetBlockV1Request, get_block_v1_response_pb.org.hyperledger.cacti.plugin.ledger.connector.besu.GetBlockV1ResponsePB>, callback: sendUnaryData<get_block_v1_response_pb.org.hyperledger.cacti.plugin.ledger.connector.besu.GetBlockV1ResponsePB>): void;
    GetOpenApiSpecV1(call: ServerUnaryCall<google.protobuf.Empty, default_service.org.hyperledger.cacti.plugin.ledger.connector.besu.services.defaultservice.GetOpenApiSpecV1Response>, callback: sendUnaryData<default_service.org.hyperledger.cacti.plugin.ledger.connector.besu.services.defaultservice.GetOpenApiSpecV1Response>): void;
    GetPastLogsV1(call: ServerUnaryCall<default_service.org.hyperledger.cacti.plugin.ledger.connector.besu.services.defaultservice.GetPastLogsV1Request, get_past_logs_v1_response_pb.org.hyperledger.cacti.plugin.ledger.connector.besu.GetPastLogsV1ResponsePB>, callback: sendUnaryData<get_past_logs_v1_response_pb.org.hyperledger.cacti.plugin.ledger.connector.besu.GetPastLogsV1ResponsePB>): void;
    GetPrometheusMetricsV1(call: ServerUnaryCall<google.protobuf.Empty, default_service.org.hyperledger.cacti.plugin.ledger.connector.besu.services.defaultservice.GetPrometheusMetricsV1Response>, callback: sendUnaryData<default_service.org.hyperledger.cacti.plugin.ledger.connector.besu.services.defaultservice.GetPrometheusMetricsV1Response>): void;
    GetTransactionV1(call: ServerUnaryCall<default_service.org.hyperledger.cacti.plugin.ledger.connector.besu.services.defaultservice.GetTransactionV1Request, get_transaction_v1_response_pb.org.hyperledger.cacti.plugin.ledger.connector.besu.GetTransactionV1ResponsePB>, callback: sendUnaryData<get_transaction_v1_response_pb.org.hyperledger.cacti.plugin.ledger.connector.besu.GetTransactionV1ResponsePB>): void;
    InvokeContractV1(call: ServerUnaryCall<default_service.org.hyperledger.cacti.plugin.ledger.connector.besu.services.defaultservice.InvokeContractV1Request, invoke_contract_v1_response_pb.org.hyperledger.cacti.plugin.ledger.connector.besu.InvokeContractV1ResponsePB>, callback: sendUnaryData<invoke_contract_v1_response_pb.org.hyperledger.cacti.plugin.ledger.connector.besu.InvokeContractV1ResponsePB>): void;
    RunTransactionV1(call: ServerUnaryCall<default_service.org.hyperledger.cacti.plugin.ledger.connector.besu.services.defaultservice.RunTransactionV1Request, run_transaction_response_pb.org.hyperledger.cacti.plugin.ledger.connector.besu.RunTransactionResponsePB>, callback: sendUnaryData<run_transaction_response_pb.org.hyperledger.cacti.plugin.ledger.connector.besu.RunTransactionResponsePB>): void;
    SignTransactionV1(call: ServerUnaryCall<default_service.org.hyperledger.cacti.plugin.ledger.connector.besu.services.defaultservice.SignTransactionV1Request, sign_transaction_response_pb.org.hyperledger.cacti.plugin.ledger.connector.besu.SignTransactionResponsePB>, callback: sendUnaryData<sign_transaction_response_pb.org.hyperledger.cacti.plugin.ledger.connector.besu.SignTransactionResponsePB>): void;
}
