"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessTokenCredential = void 0;
const cactus_common_1 = require("@hyperledger/cactus-common");
/**
 * An overly simplistic credential implementation that is compatible with the
 * Azure Javascript SDK.
 * It doesn't handle refreshing the token, the caller is responsible for updating
 * the state of it to ensure that the token that it returns hasn't expired.
 *
 * Should be useful for local development scenarios for the most part since in
 * production you would most likely want to go with {@link RefreshTokenCredential}
 *
 * @see {@link RefreshTokenCredential}
 */
class AccessTokenCredential {
    opts;
    static CLASS_NAME = "AccessTokenCredential";
    log;
    get className() {
        return AccessTokenCredential.CLASS_NAME;
    }
    constructor(opts) {
        this.opts = opts;
        const fn = `${this.className}#constructor()`;
        if (!opts) {
            throw new Error(`${fn} arg opts cannot be falsy.`);
        }
        const { accessToken, logLevel = "WARN" } = opts;
        if (!accessToken) {
            throw new Error(`${fn} arg opts.accessToken cannot be falsy.`);
        }
        const { expiresOnTimestamp, token } = accessToken;
        if (typeof token !== "string" || token.trim().length < 1) {
            throw new Error(`${fn} arg accessToken.token must be non-blank string.`);
        }
        if (!Number.isInteger(expiresOnTimestamp)) {
            throw new Error(`${fn} arg accessToken.expiresOnTimestamp must be int`);
        }
        this.log = cactus_common_1.LoggerProvider.getOrCreate({
            label: this.className,
            level: logLevel,
        });
        this.log.debug("Created instance OK.");
    }
    async getToken() {
        this.log.debug("ENTER");
        return this.opts.accessToken;
    }
}
exports.AccessTokenCredential = AccessTokenCredential;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNjZXNzLXRva2VuLWNyZWRlbnRpYWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbWFpbi90eXBlc2NyaXB0L2NyZWRlbnRpYWxzL2FjY2Vzcy10b2tlbi1jcmVkZW50aWFsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUtBLDhEQUE0RDtBQU81RDs7Ozs7Ozs7OztHQVVHO0FBQ0gsTUFBYSxxQkFBcUI7SUFTWjtJQVJiLE1BQU0sQ0FBVSxVQUFVLEdBQUcsdUJBQXVCLENBQUM7SUFFM0MsR0FBRyxDQUFTO0lBRTdCLElBQVcsU0FBUztRQUNsQixPQUFPLHFCQUFxQixDQUFDLFVBQVUsQ0FBQztJQUMxQyxDQUFDO0lBRUQsWUFBb0IsSUFBNkM7UUFBN0MsU0FBSSxHQUFKLElBQUksQ0FBeUM7UUFDL0QsTUFBTSxFQUFFLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxnQkFBZ0IsQ0FBQztRQUM3QyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDVixNQUFNLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRSw0QkFBNEIsQ0FBQyxDQUFDO1FBQ3JELENBQUM7UUFDRCxNQUFNLEVBQUUsV0FBVyxFQUFFLFFBQVEsR0FBRyxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFDaEQsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ2pCLE1BQU0sSUFBSSxLQUFLLENBQUMsR0FBRyxFQUFFLHdDQUF3QyxDQUFDLENBQUM7UUFDakUsQ0FBQztRQUNELE1BQU0sRUFBRSxrQkFBa0IsRUFBRSxLQUFLLEVBQUUsR0FBRyxXQUFXLENBQUM7UUFDbEQsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLElBQUksS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQztZQUN6RCxNQUFNLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRSxrREFBa0QsQ0FBQyxDQUFDO1FBQzNFLENBQUM7UUFDRCxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFLENBQUM7WUFDMUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxHQUFHLEVBQUUsaURBQWlELENBQUMsQ0FBQztRQUMxRSxDQUFDO1FBRUQsSUFBSSxDQUFDLEdBQUcsR0FBRyw4QkFBYyxDQUFDLFdBQVcsQ0FBQztZQUNwQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFNBQVM7WUFDckIsS0FBSyxFQUFFLFFBQVE7U0FDaEIsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsc0JBQXNCLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBQ0QsS0FBSyxDQUFDLFFBQVE7UUFDWixJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN4QixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO0lBQy9CLENBQUM7O0FBbkNILHNEQW9DQyJ9