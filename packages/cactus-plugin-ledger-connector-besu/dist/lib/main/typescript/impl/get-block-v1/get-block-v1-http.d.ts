import Web3 from "web3";
import { GetBlockV1Request, GetBlockV1Response } from "../../generated/openapi/typescript-axios/api";
import { LogLevelDesc } from "@hyperledger/cactus-common";
export declare function getBlockV1Http(ctx: {
    readonly logLevel: LogLevelDesc;
    readonly web3: Web3;
}, request: GetBlockV1Request): Promise<GetBlockV1Response>;
