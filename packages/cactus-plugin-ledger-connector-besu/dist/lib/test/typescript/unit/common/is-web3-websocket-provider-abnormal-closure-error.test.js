"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest-extended");
const is_web3_websocket_provider_abnormal_closure_error_1 = require("../../../../main/typescript/common/is-web3-websocket-provider-abnormal-closure-error");
const is_web3_websocket_provider_abnormal_closure_error_2 = require("../../../../main/typescript/common/is-web3-websocket-provider-abnormal-closure-error");
describe("isWeb3WebsocketProviderAbnormalClosureError", () => {
    it("should return false for non-error values", () => {
        expect((0, is_web3_websocket_provider_abnormal_closure_error_1.isWeb3WebsocketProviderAbnormalClosureError)(null)).toBe(false);
        expect((0, is_web3_websocket_provider_abnormal_closure_error_1.isWeb3WebsocketProviderAbnormalClosureError)(undefined)).toBe(false);
        expect((0, is_web3_websocket_provider_abnormal_closure_error_1.isWeb3WebsocketProviderAbnormalClosureError)(123)).toBe(false);
        expect((0, is_web3_websocket_provider_abnormal_closure_error_1.isWeb3WebsocketProviderAbnormalClosureError)("some string")).toBe(false);
        expect((0, is_web3_websocket_provider_abnormal_closure_error_1.isWeb3WebsocketProviderAbnormalClosureError)(Symbol("symbol"))).toBe(false);
    });
    it("should return false for error objects without code property", () => {
        const errorWithoutCode = new Error("Some generic error");
        expect((0, is_web3_websocket_provider_abnormal_closure_error_1.isWeb3WebsocketProviderAbnormalClosureError)(errorWithoutCode)).toBe(false);
    });
    it("should return false for error objects with incorrect code property", () => {
        const errorWithIncorrectCode = new Error("Some error");
        errorWithIncorrectCode.code =
            "some_other_code";
        expect((0, is_web3_websocket_provider_abnormal_closure_error_1.isWeb3WebsocketProviderAbnormalClosureError)(errorWithIncorrectCode)).toBe(false);
    });
    it("it returns true when the correct error message is set", () => {
        const err = new Error(is_web3_websocket_provider_abnormal_closure_error_2.WEB3_CONNECTION_NOT_OPEN_ON_SEND);
        expect((0, is_web3_websocket_provider_abnormal_closure_error_1.isWeb3WebsocketProviderAbnormalClosureError)(err)).toBeTrue();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXMtd2ViMy13ZWJzb2NrZXQtcHJvdmlkZXItYWJub3JtYWwtY2xvc3VyZS1lcnJvci50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL3Rlc3QvdHlwZXNjcmlwdC91bml0L2NvbW1vbi9pcy13ZWIzLXdlYnNvY2tldC1wcm92aWRlci1hYm5vcm1hbC1jbG9zdXJlLWVycm9yLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx5QkFBdUI7QUFFdkIsNEpBQW1KO0FBQ25KLDRKQUF3STtBQUV4SSxRQUFRLENBQUMsNkNBQTZDLEVBQUUsR0FBRyxFQUFFO0lBQzNELEVBQUUsQ0FBQywwQ0FBMEMsRUFBRSxHQUFHLEVBQUU7UUFDbEQsTUFBTSxDQUFDLElBQUEsK0ZBQTJDLEVBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdEUsTUFBTSxDQUFDLElBQUEsK0ZBQTJDLEVBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDM0UsTUFBTSxDQUFDLElBQUEsK0ZBQTJDLEVBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDckUsTUFBTSxDQUFDLElBQUEsK0ZBQTJDLEVBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQ3JFLEtBQUssQ0FDTixDQUFDO1FBQ0YsTUFBTSxDQUFDLElBQUEsK0ZBQTJDLEVBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQ3hFLEtBQUssQ0FDTixDQUFDO0lBQ0osQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsNkRBQTZELEVBQUUsR0FBRyxFQUFFO1FBQ3JFLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxLQUFLLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUN6RCxNQUFNLENBQUMsSUFBQSwrRkFBMkMsRUFBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUN4RSxLQUFLLENBQ04sQ0FBQztJQUNKLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLG9FQUFvRSxFQUFFLEdBQUcsRUFBRTtRQUM1RSxNQUFNLHNCQUFzQixHQUFVLElBQUksS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBRTdELHNCQUE2RCxDQUFDLElBQUk7WUFDakUsaUJBQWlCLENBQUM7UUFFcEIsTUFBTSxDQUNKLElBQUEsK0ZBQTJDLEVBQUMsc0JBQXNCLENBQUMsQ0FDcEUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDaEIsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsdURBQXVELEVBQUUsR0FBRyxFQUFFO1FBQy9ELE1BQU0sR0FBRyxHQUFHLElBQUksS0FBSyxDQUFDLG9GQUFnQyxDQUFDLENBQUM7UUFDeEQsTUFBTSxDQUFDLElBQUEsK0ZBQTJDLEVBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUN0RSxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIn0=