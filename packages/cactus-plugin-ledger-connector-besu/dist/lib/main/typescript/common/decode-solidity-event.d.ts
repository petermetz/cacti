import { JsonFragment, LogDescription } from "ethers";
/**
 * Decodes a Solidity event log using its ABI.
 */
export declare function decodeSolidityEvent(eventAbi: JsonFragment, logData: string, logTopics: string[]): LogDescription;
