"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGrpcInsecureServerCredentials = createGrpcInsecureServerCredentials;
exports.createGrpcSslServerCredentials = createGrpcSslServerCredentials;
exports.createGrpcInsecureChannelCredentials = createGrpcInsecureChannelCredentials;
exports.createGrpcSslChannelCredentials = createGrpcSslChannelCredentials;
const grpc = __importStar(require("@grpc/grpc-js"));
/**
 * Re-exports the underlying `grpc.ServerCredentials.createInsecure()` call
 * verbatim.
 * Why though? This is necessary because the {grpc.Server} object does an `instanceof`
 * validation on credential objects that are passed to it and this check comes back
 * negative if you've constructed the credentials object with a different instance
 * of the library, **even** if the versions of the library instances are the **same**.
 *
 * Therefore this is a workaround that allows callers to construct credentials
 * objects with the same import of the `@grpc/grpc-js` library that the {ApiServer}
 * of this package is using.
 *
 * @returns {grpc.ServerCredentials}
 */
function createGrpcInsecureServerCredentials() {
    return grpc.ServerCredentials.createInsecure();
}
/**
 * Re-exports the underlying `grpc.ServerCredentials.createInsecure()` call
 * verbatim.
 * Why though? This is necessary because the {grpc.Server} object does an `instanceof`
 * validation on credential objects that are passed to it and this check comes back
 * negative if you've constructed the credentials object with a different instance
 * of the library, **even** if the versions of the library instances are the **same**.
 *
 * Therefore this is a workaround that allows callers to construct credentials
 * objects with the same import of the `@grpc/grpc-js` library that the {ApiServer}
 * of this package is using.
 *
 * @returns {grpc.ServerCredentials}
 */
function createGrpcSslServerCredentials(rootCerts, keyCertPairs, checkClientCertificate) {
    return grpc.ServerCredentials.createSsl(rootCerts, keyCertPairs, checkClientCertificate);
}
/**
 * Re-exports the underlying `grpc.ServerCredentials.createInsecure()` call
 * verbatim.
 * Why though? This is necessary because the {grpc.Server} object does an `instanceof`
 * validation on credential objects that are passed to it and this check comes back
 * negative if you've constructed the credentials object with a different instance
 * of the library, **even** if the versions of the library instances are the **same**.
 *
 * Therefore this is a workaround that allows callers to construct credentials
 * objects with the same import of the `@grpc/grpc-js` library that the {ApiServer}
 * of this package is using.
 *
 * @returns {grpc.ChannelCredentials}
 */
function createGrpcInsecureChannelCredentials() {
    return grpc.ChannelCredentials.createInsecure();
}
/**
 * Re-exports the underlying `grpc.ServerCredentials.createInsecure()` call
 * verbatim.
 * Why though? This is necessary because the {grpc.Server} object does an `instanceof`
 * validation on credential objects that are passed to it and this check comes back
 * negative if you've constructed the credentials object with a different instance
 * of the library, **even** if the versions of the library instances are the **same**.
 *
 * Therefore this is a workaround that allows callers to construct credentials
 * objects with the same import of the `@grpc/grpc-js` library that the {ApiServer}
 * of this package is using.
 *
 * @returns {grpc.ChannelCredentials}
 */
function createGrpcSslChannelCredentials(rootCerts, privateKey, certChain, verifyOptions) {
    return grpc.ChannelCredentials.createSsl(rootCerts, privateKey, certChain, verifyOptions);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JwYy1jcmVkZW50aWFscy1mYWN0b3J5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21haW4vdHlwZXNjcmlwdC9ncnBjLXNlcnZpY2VzL2NvbW1vbi9ncnBjLWNyZWRlbnRpYWxzLWZhY3RvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWdCQSxrRkFFQztBQWdCRCx3RUFVQztBQWdCRCxvRkFFQztBQWdCRCwwRUFZQztBQTFGRCxvREFBc0M7QUFFdEM7Ozs7Ozs7Ozs7Ozs7R0FhRztBQUNILFNBQWdCLG1DQUFtQztJQUNqRCxPQUFPLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUNqRCxDQUFDO0FBRUQ7Ozs7Ozs7Ozs7Ozs7R0FhRztBQUNILFNBQWdCLDhCQUE4QixDQUM1QyxTQUF3QixFQUN4QixZQUFnQyxFQUNoQyxzQkFBZ0M7SUFFaEMsT0FBTyxJQUFJLENBQUMsaUJBQWlCLENBQUMsU0FBUyxDQUNyQyxTQUFTLEVBQ1QsWUFBWSxFQUNaLHNCQUFzQixDQUN2QixDQUFDO0FBQ0osQ0FBQztBQUVEOzs7Ozs7Ozs7Ozs7O0dBYUc7QUFDSCxTQUFnQixvQ0FBb0M7SUFDbEQsT0FBTyxJQUFJLENBQUMsa0JBQWtCLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDbEQsQ0FBQztBQUVEOzs7Ozs7Ozs7Ozs7O0dBYUc7QUFDSCxTQUFnQiwrQkFBK0IsQ0FDN0MsU0FBeUIsRUFDekIsVUFBMEIsRUFDMUIsU0FBeUIsRUFDekIsYUFBa0M7SUFFbEMsT0FBTyxJQUFJLENBQUMsa0JBQWtCLENBQUMsU0FBUyxDQUN0QyxTQUFTLEVBQ1QsVUFBVSxFQUNWLFNBQVMsRUFDVCxhQUFhLENBQ2QsQ0FBQztBQUNKLENBQUMifQ==