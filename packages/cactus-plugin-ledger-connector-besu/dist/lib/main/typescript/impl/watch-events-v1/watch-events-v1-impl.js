"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateInput = validateInput;
exports.watchEventsV1Impl = watchEventsV1Impl;
const cactus_common_1 = require("@hyperledger/cactus-common");
const fn = "watch-events-v1-impl.ts";
/**
 * Validates the input options for the event watcher function.
 * Throws an error if any required parameter is missing.
 *
 * @param opts - Unknown input to be validated
 * @throws Error if any required property is missing or opts is not an object
 */
function validateInput(opts) {
    if (!opts || typeof opts !== "object")
        throw new Error("opts must be a non-null object");
    const typedOpts = opts;
    if (!typedOpts.logLevel)
        throw new Error("logLevel is required");
    if (!typedOpts.viemClient)
        throw new Error("viemClient is required");
    if (!typedOpts.watchArgs)
        throw new Error("watchArgs is required");
    if (!typedOpts.watchArgs.abi)
        throw new Error("watchArgs.abi is required");
}
/**
 * Watches for Solidity smart contract events using the Viem client.
 *
 * @param opts - Configuration options including client, ABI, event name, and optional filters
 * @returns WatchContractEventReturnType - A function that can be used to stop watching events
 */
async function watchEventsV1Impl(opts) {
    validateInput(opts);
    const { viemClient: client, logLevel = "INFO", watchArgs } = opts;
    const log = cactus_common_1.LoggerProvider.getOrCreate({ level: logLevel, label: fn });
    log.debug("ENTER");
    const unwatch = client.watchContractEvent(watchArgs);
    log.debug("Viem Client watchContractEvent invocation OK");
    return { unwatch };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2F0Y2gtZXZlbnRzLXYxLWltcGwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWFpbi90eXBlc2NyaXB0L2ltcGwvd2F0Y2gtZXZlbnRzLXYxL3dhdGNoLWV2ZW50cy12MS1pbXBsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBZ0NBLHNDQVVDO0FBUUQsOENBZUM7QUFqRUQsOERBQTBFO0FBUTFFLE1BQU0sRUFBRSxHQUFHLHlCQUF5QixDQUFDO0FBaUJyQzs7Ozs7O0dBTUc7QUFDSCxTQUFnQixhQUFhLENBQzNCLElBQWE7SUFFYixJQUFJLENBQUMsSUFBSSxJQUFJLE9BQU8sSUFBSSxLQUFLLFFBQVE7UUFDbkMsTUFBTSxJQUFJLEtBQUssQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO0lBQ3BELE1BQU0sU0FBUyxHQUFHLElBQTBDLENBQUM7SUFDN0QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRO1FBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0lBQ2pFLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVTtRQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsd0JBQXdCLENBQUMsQ0FBQztJQUNyRSxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVM7UUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLHVCQUF1QixDQUFDLENBQUM7SUFDbkUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsR0FBRztRQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsMkJBQTJCLENBQUMsQ0FBQztBQUM3RSxDQUFDO0FBRUQ7Ozs7O0dBS0c7QUFDSSxLQUFLLFVBQVUsaUJBQWlCLENBQ3JDLElBQStCO0lBSS9CLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNwQixNQUFNLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxRQUFRLEdBQUcsTUFBTSxFQUFFLFNBQVMsRUFBRSxHQUFHLElBQUksQ0FBQztJQUVsRSxNQUFNLEdBQUcsR0FBRyw4QkFBYyxDQUFDLFdBQVcsQ0FBQyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDdkUsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUVuQixNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsa0JBQWtCLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDckQsR0FBRyxDQUFDLEtBQUssQ0FBQyw4Q0FBOEMsQ0FBQyxDQUFDO0lBRTFELE9BQU8sRUFBRSxPQUFPLEVBQUUsQ0FBQztBQUNyQixDQUFDIn0=