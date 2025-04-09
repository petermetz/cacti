"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WEB3_CONNECTION_NOT_OPEN_ON_SEND = void 0;
exports.isWeb3WebsocketProviderAbnormalClosureError = isWeb3WebsocketProviderAbnormalClosureError;
exports.WEB3_CONNECTION_NOT_OPEN_ON_SEND = "connection not open on send()";
/**
 * Checks if an error was thrown due to the web3js websocket provider disconnecting.
 *
 * @param err - The error object to check.
 * @returns `true` if the error is an instance of `Error`, has a `message`
 * property indicating a websocket provider abnormal closure error.
 * Otherwise, returns `false`.
 *
 * **Example:**
 * ```typescript
 * try {
 *   // ... code that might throw an error
 * } catch (err: unknown) {
 *   if (isWeb3WebsocketProviderAbnormalClosureError(err)) {
 *     // Error is specifically due to websocket provider abnormal closure
 *     console.error("Websocket provider abnormal closure error:", err);
 *   } else {
 *     // Handle other types of errors
 *     console.error("Unknown error:", err);
 *   }
 * }
 * ```
 */
function isWeb3WebsocketProviderAbnormalClosureError(err) {
    if (!err) {
        return false;
    }
    if (!(err instanceof Error)) {
        return false;
    }
    return err.message.includes(exports.WEB3_CONNECTION_NOT_OPEN_ON_SEND);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXMtd2ViMy13ZWJzb2NrZXQtcHJvdmlkZXItYWJub3JtYWwtY2xvc3VyZS1lcnJvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tYWluL3R5cGVzY3JpcHQvY29tbW9uL2lzLXdlYjMtd2Vic29ja2V0LXByb3ZpZGVyLWFibm9ybWFsLWNsb3N1cmUtZXJyb3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBMkJBLGtHQVVDO0FBbkNZLFFBQUEsZ0NBQWdDLEdBQUcsK0JBQStCLENBQUM7QUFFaEY7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FzQkc7QUFDSCxTQUFnQiwyQ0FBMkMsQ0FDekQsR0FBWTtJQUVaLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUNULE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUNELElBQUksQ0FBQyxDQUFDLEdBQUcsWUFBWSxLQUFLLENBQUMsRUFBRSxDQUFDO1FBQzVCLE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUNELE9BQU8sR0FBRyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsd0NBQWdDLENBQUMsQ0FBQztBQUNoRSxDQUFDIn0=