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
exports.createGrpcServer = createGrpcServer;
const grpc = __importStar(require("@grpc/grpc-js"));
/**
 * Re-exports the underlying `new grpc.Server()` call verbatim.
 *
 * Why though? This is necessary because the {grpc.Server} object does an `instanceof`
 * validation on credential objects that are passed to it and this check comes back
 * negative if you've constructed the credentials object with a different instance
 * of the library, **even** if the versions of the library instances are the **same**.
 *
 * Therefore this is a workaround that allows callers to construct credentials
 * objects/servers with the same import of the `@grpc/grpc-js` library that the
 * {ApiServer} of this package is using internally.
 *
 * @returns {grpc.Server}
 */
function createGrpcServer(options) {
    return new grpc.Server(options);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JwYy1zZXJ2ZXItZmFjdG9yeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYWluL3R5cGVzY3JpcHQvZ3JwYy1zZXJ2aWNlcy9jb21tb24vZ3JwYy1zZXJ2ZXItZmFjdG9yeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBZ0JBLDRDQUlDO0FBcEJELG9EQUFzQztBQUV0Qzs7Ozs7Ozs7Ozs7OztHQWFHO0FBQ0gsU0FBZ0IsZ0JBQWdCLENBQzlCLE9BQXdDO0lBRXhDLE9BQU8sSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ2xDLENBQUMifQ==