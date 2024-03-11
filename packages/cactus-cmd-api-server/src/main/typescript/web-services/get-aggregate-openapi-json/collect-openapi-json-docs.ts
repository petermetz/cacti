import type { OpenAPIV3 } from "express-openapi-validator/dist/framework/types";

import type { PluginRegistry } from "@hyperledger/cactus-core";
import type { ICactusPlugin } from "@hyperledger/cactus-core-api";
import type { IPluginWebService } from "@hyperledger/cactus-core-api";
import { isIPluginWebService } from "@hyperledger/cactus-core-api";
import { Checks } from "@hyperledger/cactus-common";

export async function collectOpenapiJsonDocs(
  pr: PluginRegistry,
): Promise<OpenAPIV3.Document[]> {
  Checks.truthy(pr, `collectOpenapiJsonDocs() pr (PluginRegistry)`);

  const openApiJsonDocsPromises = pr
    .getPlugins()
    .filter((pluginInstance) => isIPluginWebService(pluginInstance))
    .map(async (plugin: ICactusPlugin) => {
      const webSvc = plugin as IPluginWebService;
      const openApiJson = (await webSvc.getOpenApiSpec()) as OpenAPIV3.Document;
      return openApiJson;
    });

  const openApiJsonDocs = await Promise.all(openApiJsonDocsPromises);

  // Filter out falsy results where the plugin did not return anything.
  return openApiJsonDocs.filter((d) => !!d);
}
