import { LogLevelDesc } from "loglevel";

export const LOG_LEVEL_NAMES = [
  "trace",
  "debug",
  "info",
  "warn",
  "error",
  "silent",
];

export function isLogLevelDesc(x: unknown): x is LogLevelDesc {
  if (!x) {
    return false;
  }
  //   TRACE: 0;
  //   DEBUG: 1;
  //   INFO: 2;
  //   WARN: 3;
  //   ERROR: 4;
  //   SILENT: 5;
  const logLevelNumbers = [0, 1, 2, 3, 4, 5];

  if (typeof x === "number") {
    logLevelNumbers.includes(x);
  } else if (typeof x === "string") {
    return LOG_LEVEL_NAMES.includes(x.toLowerCase());
  }
  return false;
}
