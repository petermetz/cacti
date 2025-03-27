"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenCredential = void 0;
const msal_node_1 = require("@azure/msal-node");
const cactus_common_1 = require("@hyperledger/cactus-common");
class RefreshTokenCredential {
    opts;
    static CLASS_NAME = "RefreshTokenCredential";
    log;
    get className() {
        return RefreshTokenCredential.CLASS_NAME;
    }
    msalClient;
    constructor(opts) {
        this.opts = opts;
        const fn = `${this.className}#constructor()`;
        if (!opts) {
            throw new Error(`${fn} - arg opts cannot be falsy.`);
        }
        const { authority, clientId, refreshToken, resource } = opts;
        const { logLevel = "DEBUG" } = opts;
        // verify that the required arguments were passed in
        if (!authority) {
            throw new Error(`${fn} - arg opts.authority cannot be falsy.`);
        }
        if (!clientId) {
            throw new Error(`${fn} - arg opts.clientId cannot be falsy.`);
        }
        if (!refreshToken) {
            throw new Error(`${fn} - arg opts.refreshToken cannot be falsy.`);
        }
        if (!resource) {
            throw new Error(`${fn} - arg opts.resource cannot be falsy.`);
        }
        // verify that the arguments are of string type
        if (typeof authority !== "string") {
            throw new Error(`${fn} - arg opts.authority must be string.`);
        }
        if (typeof clientId !== "string") {
            throw new Error(`${fn} - arg opts.clientId must be string.`);
        }
        if (typeof refreshToken !== "string") {
            throw new Error(`${fn} - arg opts.refreshToken must be string.`);
        }
        if (typeof resource !== "string") {
            throw new Error(`${fn} - arg opts.resource must be string.`);
        }
        // Verify if the strings are empty or only contain whitespaces
        if (clientId.trim().length < 1) {
            throw new Error(`${fn} - arg opts.clientId cannot be blank.`);
        }
        if (refreshToken.trim().length < 1) {
            throw new Error(`${fn} - arg opts.refreshToken cannot be blank.`);
        }
        if (authority.trim().length < 1) {
            throw new Error(`${fn} - arg opts.authority cannot be blank.`);
        }
        if (resource.trim().length < 1) {
            throw new Error(`${fn} - arg opts.resource cannot be blank.`);
        }
        this.log = cactus_common_1.LoggerProvider.getOrCreate({
            label: this.className,
            level: logLevel,
        });
        this.log.debug("Creating PublicClientApplication...");
        this.msalClient = new msal_node_1.PublicClientApplication({
            auth: {
                clientId,
                authority,
                clientSecret: refreshToken,
            },
        });
        this.log.debug("Creating PublicClientApplication OK");
        this.log.debug("EXIT");
    }
    async getToken() {
        const fn = `${this.className}#getToken()`;
        const result = await this.msalClient.acquireTokenByRefreshToken({
            refreshToken: this.opts.refreshToken,
            scopes: [`${this.opts.resource}/.default`],
        });
        if (!result) {
            throw new Error(`${fn} acquireTokenByRefreshToken() returned falsy.`);
        }
        const fiveMinutesInMs = 300 * 1000;
        const defaultExpiry = new Date().getTime() + fiveMinutesInMs;
        const { accessToken, expiresOn } = result;
        // According to the Azure SDK documentation the access tokens are good for
        // at least 5 minutes and up to 60. If we didn't get an expiry we'll play
        // it safe and assume the shortest expiry possible.
        const expiresOnTimestamp = expiresOn ? expiresOn.getTime() : defaultExpiry;
        return {
            expiresOnTimestamp,
            token: accessToken,
            tokenType: "Bearer",
        };
    }
}
exports.RefreshTokenCredential = RefreshTokenCredential;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVmcmVzaC10b2tlbi1jcmVkZW50aWFsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL21haW4vdHlwZXNjcmlwdC9jcmVkZW50aWFscy9yZWZyZXNoLXRva2VuLWNyZWRlbnRpYWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsZ0RBQTJEO0FBRzNELDhEQUE0RDtBQVU1RCxNQUFhLHNCQUFzQjtJQVVKO0lBVHRCLE1BQU0sQ0FBVSxVQUFVLEdBQUcsd0JBQXdCLENBQUM7SUFFNUMsR0FBRyxDQUFTO0lBRTdCLElBQVcsU0FBUztRQUNsQixPQUFPLHNCQUFzQixDQUFDLFVBQVUsQ0FBQztJQUMzQyxDQUFDO0lBQ2dCLFVBQVUsQ0FBb0M7SUFFL0QsWUFBNkIsSUFBOEM7UUFBOUMsU0FBSSxHQUFKLElBQUksQ0FBMEM7UUFDekUsTUFBTSxFQUFFLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxnQkFBZ0IsQ0FBQztRQUM3QyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDVixNQUFNLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRSw4QkFBOEIsQ0FBQyxDQUFDO1FBQ3ZELENBQUM7UUFDRCxNQUFNLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBQzdELE1BQU0sRUFBRSxRQUFRLEdBQUcsT0FBTyxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBRXBDLG9EQUFvRDtRQUNwRCxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDZixNQUFNLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRSx3Q0FBd0MsQ0FBQyxDQUFDO1FBQ2pFLENBQUM7UUFDRCxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDZCxNQUFNLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRSx1Q0FBdUMsQ0FBQyxDQUFDO1FBQ2hFLENBQUM7UUFDRCxJQUFJLENBQUMsWUFBWSxFQUFFLENB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