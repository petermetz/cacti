#!/usr/bin/env node

import yargs from "yargs";

import { isLogLevelDesc, LOG_LEVEL_NAMES } from "@hyperledger/cactus-common";
import { Logger, LoggerProvider } from "@hyperledger/cactus-common";

import { ApiServer } from "../api-server";
import { AuthorizationProtocol } from "../config/authorization-protocol";
import { ICactusApiServerOptions } from "../config/config-service";

const log: Logger = LoggerProvider.getOrCreate({
  label: "cactus-api",
  level: "INFO",
});

const main = async () => {
  const argv = await yargs(process.argv.slice(2))
    .option("authorization-protocol", {
      type: "string",
      default: "{}",
      description:
        "Can be used to override npm registry and authentication details for example. See https://www.npmjs.com/package/live-plugin-manager#pluginmanagerconstructoroptions-partialpluginmanageroptions for further details.",
    })
    .option("authorization-config-json", {
      type: "string",
      default: "{}",
      description: "FIXME",
    })
    .option("config-file", {
      type: "string",
      default: ".config.json",
      description: "FIXME",
    })
    .option("api-host", {
      type: "string",
      default: "127.0.0.1",
      description: "HTTP host for the API server to listen on.",
    })
    .option("api-port", {
      type: "number",
      default: 3000,
      description: "HTTP port for the API server to listen on.",
    })
    .option("crpc-host", {
      type: "string",
      default: "127.0.0.1",
      description:
        "The host to bind the CRPC fastify instance to. Secure default is: 127.0.0.1. Use 0.0.0.0 to bind for any host",
    })
    .option("crpc-port", {
      type: "number",
      default: 6000,
      description: "The HTTP port to bind the CRPC fastify server endpoints to",
    })
    .option("plugin-manager-options-json", {
      type: "string",
      default: "{}",
      description:
        "Can be used to override npm registry and authentication details for example. See https://www.npmjs.com/package/live-plugin-manager#pluginmanagerconstructoroptions-partialpluginmanageroptions for further details.",
    })

    .option("tls-default-max-version", {
      type: "string",
      default: "TLSv1.3",
      choices: ["TLSv1.3", "TLSv1.2", "TLSv1.1", "TLSv1"] as const,
      description:
        "Sets the DEFAULT_MAX_VERSION property of the built-in tls module of NodeJS. " +
        "Only makes a difference on NOdeJS 10 and older where TLS v1.3 is turned off by default. " +
        "Newer NodeJS versions ship with TLS v1.3 enabled.",
    })

    .option("tracing-exporter-trace-otlp-http-endpoint", {
      type: "string",
      default: "http://localhost:4318/v1/traces",
      description: "OTLP traces endpoint to use by the HTTP trace exporter",
    })
    .option("tracing-diag-log-level", {
      type: "string",
      choices: ["NONE", "ERROR", "WARN", "INFO", "DEBUG", "VERBOSE", "ALL"],
      default: "INFO",
      description:
        "Sets the internal diagnostic log level of the tracer. " +
        "Note: this is NOT the applications own logs. " +
        "See the OpenTelemetry JS projects sources for the " +
        "definitions of the enum called 'DiagLogLevel'. At the time of this" +
        "writing they went like this: NONE = 0, ERROR = 30, WARN = 50, " +
        "INFO = 60, DEBUG = 70, VERBOSE = 80, ALL = 9999",
    })
    .option("tracing-service-name", {
      alias: "tsn",
      type: "string",
      default: "cacti",
      description: "The service name to use for tracing and logging.",
    })
    .option("log-level", {
      alias: "l",
      type: "string",
      choices: LOG_LEVEL_NAMES,
      default: "warn",
      description: `Logging level (one of: ${LOG_LEVEL_NAMES.join(",")})`,
    })
    .check((argv) => {
      const authorizationProtocol = argv[
        "authorization-protocol"
      ] as AuthorizationProtocol;

      // AUTHORIZATION_PROTOCOL
      const accepted = Object.values(AuthorizationProtocol);
      const acceptedCsv = accepted.join(",");
      if (!accepted.includes(authorizationProtocol)) {
        const m = `Accepted auth protocols: ${acceptedCsv} Got: ${authorizationProtocol}`;
        throw new Error(m);
      }

      // TLS_DEFAULT_MAX_VERSION
      const tlsDefaultMaxVersion = argv["tls-default-max-version"];
      const versions = ["TLSv1.3", "TLSv1.2", "TLSv1.1", "TLSv1"];
      if (!versions.includes(tlsDefaultMaxVersion)) {
        const msg = `OK TLS versions ${versions.join(",")} Got: ${tlsDefaultMaxVersion}`;
        throw new Error(msg);
      }
    })
    .env("CACTI")
    .help()
    .alias("help", "h").argv;

  if (!isLogLevelDesc(argv.logLevel)) {
    throw new Error(`argv.logLevel=${argv.logLevel} not a valid log level`);
  }

  const apiServer = new ApiServer({ config: argv });
  await apiServer.start();
};

export async function launchApp(): Promise<void> {
  try {
    await main();
    log.info(`Cacti API server launched OK `);
  } catch (ex) {
    log.error(`Cacti API server crashed: `, ex);
    process.exit(1);
  }
}

if (require.main === module) {
  launchApp();
}
