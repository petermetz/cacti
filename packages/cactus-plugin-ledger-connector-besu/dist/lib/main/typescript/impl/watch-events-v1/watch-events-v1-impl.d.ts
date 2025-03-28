import { LogLevelDesc } from "@hyperledger/cactus-common";
import { Abi, PublicClient as ViemPublicClient, Transport, WatchContractEventParameters } from "viem";
export interface IWatchEventsV1ImplOptions {
    /** Logging level for debugging or monitoring purposes */
    readonly logLevel?: LogLevelDesc;
    readonly viemClient: ViemPublicClient;
    /** Additional filters for contract event subscription such as contract address, block range, etc. */
    readonly watchArgs: WatchContractEventParameters<Abi, string, undefined, Transport>;
}
/**
 * Validates the input options for the event watcher function.
 * Throws an error if any required parameter is missing.
 *
 * @param opts - Unknown input to be validated
 * @throws Error if any required property is missing or opts is not an object
 */
export declare function validateInput(opts: unknown): asserts opts is IWatchEventsV1ImplOptions;
/**
 * Watches for Solidity smart contract events using the Viem client.
 *
 * @param opts - Configuration options including client, ABI, event name, and optional filters
 * @returns WatchContractEventReturnType - A function that can be used to stop watching events
 */
export declare function watchEventsV1Impl(opts: IWatchEventsV1ImplOptions): Promise<{
    readonly unwatch: () => void;
}>;
