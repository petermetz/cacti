"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactV1Impl = transactV1Impl;
const typescript_axios_1 = require("../../generated/openapi/typescript-axios");
const transact_v1_cactus_keychain_ref_1 = require("./transact-v1-cactus-keychain-ref");
const transact_v1_private_key_1 = require("./transact-v1-private-key");
const transact_v1_signed_1 = require("./transact-v1-signed");
async function transactV1Impl(ctx, req) {
    const fnTag = `transact()`;
    switch (req.web3SigningCredential.type) {
        // Web3SigningCredentialType.GETHKEYCHAINPASSWORD is removed as Hyperledger Besu doesn't support the PERSONAL api
        // for --rpc-http-api as per the discussion mentioned here
        // https://chat.hyperledger.org/channel/besu-contributors?msg=GqQXfW3k79ygRtx5Q
        case typescript_axios_1.Web3SigningCredentialType.CactusKeychainRef: {
            return (0, transact_v1_cactus_keychain_ref_1.transactV1CactusKeychainRef)(ctx, req);
        }
        case typescript_axios_1.Web3SigningCredentialType.PrivateKeyHex: {
            return (0, transact_v1_private_key_1.transactV1PrivateKey)(ctx, req);
        }
        case typescript_axios_1.Web3SigningCredentialType.None: {
            if (req.transactionConfig.rawTransaction) {
                return (0, transact_v1_signed_1.transactV1Signed)(ctx, req);
            }
            else {
                throw new Error(`${fnTag} Expected pre-signed raw transaction ` +
                    ` since signing credential is specified as` +
                    `Web3SigningCredentialType.NONE`);
            }
        }
        default: {
            throw new Error(`${fnTag} Unrecognized Web3SigningCredentialType: ` +
                `${req.web3SigningCredential.type} Supported ones are: ` +
                `${Object.values(typescript_axios_1.Web3SigningCredentialType).join(";")}`);
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNhY3QtdjEtaW1wbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYWluL3R5cGVzY3JpcHQvaW1wbC90cmFuc2FjdC12MS90cmFuc2FjdC12MS1pbXBsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBYUEsd0NBd0NDO0FBckRELCtFQUlrRDtBQUVsRCx1RkFBZ0Y7QUFFaEYsdUVBQWlFO0FBRWpFLDZEQUF3RDtBQUdqRCxLQUFLLFVBQVUsY0FBYyxDQUNsQyxHQUtDLEVBQ0QsR0FBMEI7SUFFMUIsTUFBTSxLQUFLLEdBQUcsWUFBWSxDQUFDO0lBRTNCLFFBQVEsR0FBRyxDQUFDLHFCQUFxQixDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3ZDLGlIQUFpSDtRQUNqSCwwREFBMEQ7UUFDMUQsK0VBQStFO1FBQy9FLEtBQUssNENBQXlCLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO1lBQ2pELE9BQU8sSUFBQSw2REFBMkIsRUFBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDL0MsQ0FBQztRQUNELEtBQUssNENBQXlCLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztZQUM3QyxPQUFPLElBQUEsOENBQW9CLEVBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3hDLENBQUM7UUFDRCxLQUFLLDRDQUF5QixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDcEMsSUFBSSxHQUFHLENBQUMsaUJBQWlCLENBQUMsY0FBYyxFQUFFLENBQUM7Z0JBQ3pDLE9BQU8sSUFBQSxxQ0FBZ0IsRUFBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDcEMsQ0FBQztpQkFBTSxDQUFDO2dCQUNOLE1BQU0sSUFBSSxLQUFLLENBQ2IsR0FBRyxLQUFLLHVDQUF1QztvQkFDN0MsMkNBQTJDO29CQUMzQyxnQ0FBZ0MsQ0FDbkMsQ0FBQztZQUNKLENBQUM7UUFDSCxDQUFDO1FBQ0QsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUNSLE1BQU0sSUFBSSxLQUFLLENBQ2IsR0FBRyxLQUFLLDJDQUEyQztnQkFDakQsR0FBRyxHQUFHLENBQUMscUJBQXFCLENBQUMsSUFBSSx1QkFBdUI7Z0JBQ3hELEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyw0Q0FBeUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUMxRCxDQUFDO1FBQ0osQ0FBQztJQUNILENBQUM7QUFDSCxDQUFDIn0=