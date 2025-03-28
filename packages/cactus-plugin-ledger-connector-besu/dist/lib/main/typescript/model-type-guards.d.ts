import { Web3SigningCredentialNone, Web3SigningCredentialPrivateKeyHex, Web3SigningCredentialType } from "./generated/openapi/typescript-axios/api";
export declare function isWeb3SigningCredentialPrivateKeyHex(x?: {
    type?: Web3SigningCredentialType;
}): x is Web3SigningCredentialPrivateKeyHex;
export declare function isWeb3SigningCredentialNone(x?: {
    type?: Web3SigningCredentialType;
}): x is Web3SigningCredentialNone;
