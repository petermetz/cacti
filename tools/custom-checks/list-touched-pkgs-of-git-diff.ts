import path from "path";
import { fileURLToPath } from "url";
import { RuntimeError } from "run-time-error";

const TAG = "[tools/list-touched-pkgs-of-git-diff.ts]";

const nodePath = path.resolve(process.argv[1]);
const modulePath = path.resolve(fileURLToPath(import.meta.url));
const isRunningDirectlyViaCLI = nodePath === modulePath;

if (isRunningDirectlyViaCLI) {
  main();
}

export interface IListTouchedPkgsOfGitDiffRequest {
  readonly gitDiffPaths: string[];
  readonly argv: string[];
  readonly env: NodeJS.ProcessEnv;
}

export interface IListTouchedPkgsOfGitDiffResponse {
  readonly pkgNames: string[];
}

export async function main(): Promise<void> {
  console.log(`${TAG} entering main function...`);
  const req: IListTouchedPkgsOfGitDiffRequest = {
    gitDiffPaths: [],
    argv: process.argv,
    env: process.env,
  };
  const response = await listTouchedPkgsOfGitDiff(req);
  console.log(`${TAG} exiting main function. Output=%o`, response);
}

/**
 *
 *
 */
export async function listTouchedPkgsOfGitDiff(
  req: IListTouchedPkgsOfGitDiffRequest,
): Promise<IListTouchedPkgsOfGitDiffResponse> {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const SCRIPT_DIR = __dirname;
  const PROJECT_DIR = path.join(SCRIPT_DIR, "../../");
  console.log(`${TAG} SCRIPT_DIR=${SCRIPT_DIR}`);
  console.log(`${TAG} PROJECT_DIR=${PROJECT_DIR}`);

  if (!req) {
    throw new RuntimeError(`req parameter cannot be falsy.`);
  }
  if (!req.argv) {
    throw new RuntimeError(`req.argv cannot be falsy.`);
  }
  if (!req.env) {
    throw new RuntimeError(`req.env cannot be falsy.`);
  }

  console.log(`${TAG} req.gitDiffPaths=${req.gitDiffPaths.join(", ")}`);
  return { pkgNames: [] };
}
