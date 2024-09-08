import path from "node:path";
import { buildContainerImage } from "../public-api";
import { LoggerProvider, LogLevelDesc } from "@hyperledger/cactus-common";

export interface IBuildImageChainlinkAllInOneV412Response {
  readonly imageName: Readonly<string>;
  readonly imageVersion: Readonly<string>;
  /**
   * The concatenation of `imageName` a colon character and `imageVersion`.
   */
  readonly imageTag: Readonly<string>;
}

export interface IBuildImageChainlinkAllInOneV412Request {
  readonly logLevel?: Readonly<LogLevelDesc>;
}

export async function buildImageChainlinkAllInOneLatest(
  req: IBuildImageChainlinkAllInOneV412Request,
): Promise<IBuildImageChainlinkAllInOneV412Response> {
  if (!req) {
    throw new Error("Expected arg req to be truthy.");
  }
  const logLevel: LogLevelDesc = req.logLevel || "WARN";
  const log = LoggerProvider.getOrCreate({
    level: logLevel,
    label: "build-image-connector-chainlink-server.ts",
  });
  const projectRoot = path.join(__dirname, "../../../../../../../");

  const buildDirRel = "./tools/docker/chainlink-all-in-one/chainlink-v4_12/";

  const buildDirAbs = path.join(projectRoot, buildDirRel);

  log.info("Invoking container build with build dir: %s", buildDirAbs);

  const imageName = "caio412";
  const imageVersion = "latest";
  const imageTag = `${imageName}:${imageVersion}`;

  await buildContainerImage({
    buildDir: buildDirAbs,
    imageFile: "Dockerfile",
    imageTag,
    logLevel: logLevel,
  });

  return { imageName, imageVersion, imageTag };
}
