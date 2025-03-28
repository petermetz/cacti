"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeSolidityEvent = decodeSolidityEvent;
const ethers_1 = require("ethers");
/**
 * Decodes a Solidity event log using its ABI.
 */
function decodeSolidityEvent(eventAbi, logData, logTopics) {
    const fn = "decode-solidity-event.ts";
    const iface = new ethers_1.Interface([eventAbi]);
    if (!eventAbi.name) {
        const ctx = JSON.stringify(eventAbi);
        throw new Error(`${fn} requires eventAbi.name is required: ${ctx}`);
    }
    const parsedLog = iface.parseLog({
        topics: logTopics,
        data: logData,
    });
    if (!parsedLog) {
        throw new Error(`${fn} failed to parse log data: ${logData}`);
    }
    return parsedLog;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVjb2RlLXNvbGlkaXR5LWV2ZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL21haW4vdHlwZXNjcmlwdC9jb21tb24vZGVjb2RlLXNvbGlkaXR5LWV2ZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBS0Esa0RBbUJDO0FBeEJELG1DQUFpRTtBQUVqRTs7R0FFRztBQUNILFNBQWdCLG1CQUFtQixDQUNqQyxRQUFzQixFQUN0QixPQUFlLEVBQ2YsU0FBbUI7SUFFbkIsTUFBTSxFQUFFLEdBQUcsMEJBQTBCLENBQUM7SUFDdEMsTUFBTSxLQUFLLEdBQUcsSUFBSSxrQkFBUyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUN4QyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ25CLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDckMsTUFBTSxJQUFJLEtBQUssQ0FBQyxHQUFHLEVBQUUsd0NBQXdDLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDdEUsQ0FBQztJQUNELE1BQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUM7UUFDL0IsTUFBTSxFQUFFLFNBQVM7UUFDakIsSUFBSSxFQUFFLE9BQU87S0FDZCxDQUFDLENBQUM7SUFDSCxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDZixNQUFNLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRSw4QkFBOEIsT0FBTyxFQUFFLENBQUMsQ0FBQztJQUNoRSxDQUFDO0lBQ0QsT0FBTyxTQUFTLENBQUM7QUFDbkIsQ0FBQyJ9