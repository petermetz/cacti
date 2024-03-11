import type { Application, NextFunction, Request, Response } from "express";
import * as OpenApiValidator from "express-openapi-validator";
import { OpenAPIV3 } from "express-openapi-validator/dist/framework/types";
import type { ValidationError } from "express-openapi-validator/dist/framework/types";
import { error as EovErrors } from "express-openapi-validator";

import {
  Checks,
  hasKey,
  Logger,
  LoggerProvider,
  LogLevelDesc,
} from "@hyperledger/cactus-common";

export interface IInstallOpenapiValidationMiddlewareRequest {
  readonly logLevel: LogLevelDesc;
  readonly app: Application;
  readonly apiSpec: unknown;
}

/**
 * Installs the middleware that validates openapi specifications
 * @param app
 * @param pluginOAS
 */
export async function installOpenapiValidationMiddleware(
  req: IInstallOpenapiValidationMiddlewareRequest,
): Promise<void> {
  const fnTag = "installOpenapiValidationMiddleware";
  Checks.truthy(req, `${fnTag} req`);
  Checks.truthy(req.apiSpec, `${fnTag} req.apiSpec`);
  Checks.truthy(req.app, `${fnTag} req.app`);
  const { app, apiSpec, logLevel } = req;
  const log = LoggerProvider.getOrCreate({
    label: fnTag,
    level: logLevel || "INFO",
  });
  log.debug(`Installing validation for OpenAPI specs: `, apiSpec);

  const paths = Object.keys((apiSpec as any).paths);
  log.debug(`Paths to be ignored: `, paths);

  app.use(
    OpenApiValidator.middleware({
      apiSpec: apiSpec as OpenAPIV3.Document,
      validateApiSpec: false,
      $refParser: {
        mode: "dereference",
      },
      ignorePaths: (path: string) => !paths.includes(path),
    }),
  );

  const log2 = LoggerProvider.getOrCreate({
    label: "expressOpenApiValidatorMiddlewareHandler()",
    level: logLevel || "INFO",
  });

  app.use((ex: unknown, req: Request, res: Response, next: NextFunction) =>
    expressOpenApiValidatorMiddlewareHandler(log2, ex, req, res, next),
  );
}

export function expressOpenApiValidatorMiddlewareHandler(
  log: Logger,
  ex: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (isOpenApiRequestValidationError(ex)) {
    if (ex.status) {
      const { errors, status } = ex;
      const [{ message, path, errorCode }] = errors;
      log.debug(
        "Got valid error: %s path=%s, status=%s, message=%s, errorCode=%o",
        req?.url,
        path,
        status,
        message,
        errorCode,
      );
      res.status(ex.status);
      res.send(ex.errors);
    } else {
      log.debug("Got invalid error: %s status missing - %o", req?.url, ex);
      res.status(500);
      res.json(ex);
    }
  } else if (isBodyParserError(ex)) {
    const { type, statusCode, expose } = ex;
    log.debug(
      "BodyParser error: %s type=%s, statusCode=%o, expose=%o",
      req?.url,
      type,
      statusCode,
      expose,
    );

    res.status(ex.statusCode);

    if (ex.expose) {
      res.json({ error: ex.message });
    } else {
      res.json({ error: "ExpressJS req body parse failed (body-parser pkg)" });
    }
  } else if (ex) {
    log.debug("Got invalid error: %s unknown reason - %o", req?.url, ex);
    res.status(500);
    res.json(ex);
  } else {
    log.debug("%s Validation Passed OK - %s", req.url);
    next();
  }
}

export interface IBodyParserError {
  readonly status: number;
  readonly statusCode: number;
  readonly expose: boolean;
  readonly type: string;
  readonly message: string;
}

export function isBodyParserError(x: unknown): x is IBodyParserError {
  return (
    hasKey(x, "status") &&
    typeof x.status === "number" &&
    isFinite(x.status) &&
    hasKey(x, "statusCode") &&
    typeof x.statusCode === "number" &&
    isFinite(x.statusCode) &&
    hasKey(x, "expose") &&
    typeof x.expose === "boolean" &&
    hasKey(x, "type") &&
    typeof x.type === "string" &&
    hasKey(x, "message") &&
    typeof x.message === "string"
  );
}

/**
 * Determines if an error object is an instance of one of the types that are
 * designed to be thrown by the "express-openapi-validator" package specifically
 * when it finds issues it is designed to find.
 *
 * In other words, we are detecting if the error was thrown intentionally or if
 * the validator had just crashed because of some other issue such as when the
 * Open API spec file is invalid.
 *
 * To give an example to the above, the "properties" key in one of the specs
 * was being assigned a string value but according to the meta schema (the
 * schema of the Open API spec documents themselves) the "properties" property
 * must be defined as an object that lists the properties of a schema element.
 *
 * The above mistake made by the person who wrote the Open API spec in question
 * was causing the "express-openapi-validator" package to crash, throwing errors
 * but different ones from the ones that it is "expected" to throw and we could
 * not detect this at the time and hence this function was made so that in the
 * future, debugging these kind of errors are much easier and can be done based
 * on the logs alone (hopefully).
 */
export function isOpenApiRequestValidationError(
  ex: unknown,
): ex is ValidationError {
  if (ex) {
    return Object.values(EovErrors).some((x) => ex instanceof x);
  } else {
    return false;
  }
}
