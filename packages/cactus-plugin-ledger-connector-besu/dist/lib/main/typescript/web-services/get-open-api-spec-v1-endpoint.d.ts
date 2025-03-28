import { GetOpenApiSpecV1EndpointBase, IGetOpenApiSpecV1EndpointBaseOptions } from "@hyperledger/cactus-core";
import { LogLevelDesc } from "@hyperledger/cactus-common";
import { IWebServiceEndpoint } from "@hyperledger/cactus-core-api";
import OAS from "../../json/openapi.json";
export declare const OasPathGetOpenApiSpecV1: {
    get: {
        "x-hyperledger-cacti": {
            http: {
                verbLowerCase: string;
                path: string;
            };
        };
        operationId: string;
        summary: string;
        parameters: never[];
        responses: {
            "200": {
                description: string;
                content: {
                    "application/json": {
                        schema: {
                            type: string;
                        };
                    };
                };
            };
            "503": {
                description: string;
                content: {
                    "*/*": {
                        schema: {
                            $ref: string;
                        };
                    };
                };
            };
        };
    };
};
export type OasPathTypeGetOpenApiSpecV1 = typeof OasPathGetOpenApiSpecV1;
export interface IGetOpenApiSpecV1EndpointOptions extends IGetOpenApiSpecV1EndpointBaseOptions<typeof OAS, OasPathTypeGetOpenApiSpecV1> {
    readonly logLevel?: LogLevelDesc;
}
export declare class GetOpenApiSpecV1Endpoint extends GetOpenApiSpecV1EndpointBase<typeof OAS, OasPathTypeGetOpenApiSpecV1> implements IWebServiceEndpoint {
    readonly options: IGetOpenApiSpecV1EndpointOptions;
    get className(): string;
    constructor(options: IGetOpenApiSpecV1EndpointOptions);
}
