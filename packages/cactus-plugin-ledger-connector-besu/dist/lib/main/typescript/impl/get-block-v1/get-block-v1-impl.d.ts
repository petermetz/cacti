import Web3 from "web3";
import { BlockNumber } from "web3-core";
import { LogLevelDesc } from "@hyperledger/cactus-common";
import { EvmBlock } from "../../public-api";
export declare function getBlockV1Impl(ctx: {
    readonly web3: Web3;
    readonly logLevel: LogLevelDesc;
}, blockHashOrBlockNumber: BlockNumber): Promise<EvmBlock>;
export declare function isBlockNumber(x: unknown): x is BlockNumber;
