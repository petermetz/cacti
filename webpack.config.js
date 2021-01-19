const { writeFileSync } = require("fs");
const TerserPlugin = require("terser-webpack-plugin");
const webpack = require("webpack");
const { getPackageInfoList } = require("./tools/get-package-info-list");

/**
 * @typedef {Object} BuildConfig
 * @property {string} env: The environment name like `dev` or `prod`
 * @property {string} target: The target platform such as `node` or `web`.
 * @property {import("./tools/get-package-info-list").PackageInfo[]} pkgInfoList: List of packages in the project to build.
 */

const ENTRY_TS_PATHS = {
  node: `/src/main/typescript/index.ts`,
  web: `/src/main/typescript/index.web.ts`,
};

const ENTRY_OUT_PROPERTIES = {
  dev: {
    node: `main`,
    web: `browser`,
  },
  prod: {
    node: `mainMinified`,
    web: `browserMinified`,
  },
};

const ENV_TO_MODE = {
  dev: "development",
  prod: "production",
};

const ENV_TO_DEVTOOL = {
  dev: "inline-source-map",
  prod: "source-map",
};

const ENV_TO_OPTIMIZATION = {
  dev: {},
  prod: {
    minimizer: [new TerserPlugin()],
  },
};

/**
 *
 * @param {BuildConfig} buildConfig The parameters for the Webpack build.
 * @returns {import("webpack").Configuration[]}
 */
const createWebpackConfigs = (buildConfig) => {
  const { target, env, pkgInfoList } = buildConfig;
  const mode = ENV_TO_MODE[env];

  const devtool = ENV_TO_DEVTOOL[env];
  const optimization = ENV_TO_OPTIMIZATION[env];

  /** @type {import("webpack").Entry} */
  const entry = {};

  const pkgNameEntryPathMap = new Map();
  const cwd = process.cwd();

  pkgInfoList
    // FIXME: delete this when done testing
    // .filter((pkgInfo) => pkgInfo.name.includes("cactus-common"))
    .forEach((pkgInfo) => {
      const { name: pkgName, location: pkgLocation, packageObject } = pkgInfo;
      const pkgDir = pkgLocation.replace(cwd, ".");
      const tsFile = `${pkgLocation}${ENTRY_TS_PATHS[target]}`;
      const pkgProp = ENTRY_OUT_PROPERTIES[env][target];
      const bundleFile = `${pkgDir}/${packageObject[pkgProp]}`;

      pkgNameEntryPathMap.set(pkgName, bundleFile);

      entry[bundleFile] = {
        import: tsFile,
      };
      if (pkgInfo.localDependencies.length > 0) {
        entry[bundleFile].dependOn = pkgInfo.localDependencies.map((pkgName) =>
          pkgNameEntryPathMap.get(pkgName)
        );
      }
    });

  const tsLoaderRuleList = pkgInfoList
    // FIXME: delete this when done testing
    // .filter((pkgInfo) => pkgInfo.name.includes("cactus-common"))
    .map((pkgInfo) => {
      const { name: pkgName, location: pkgLocation, packageObject } = pkgInfo;
      const pkgSrcDir = pkgLocation + "/src/";

      const tsConfigFile = `${pkgLocation}/tsconfig.json`;
      return {
        test: /.ts?$/,
        // test: "*.ts",
        // test: new RegExp(`.ts$`),
        exclude: /node_modules/,
        include: [pkgSrcDir],
        use: [
          {
            loader: "ts-loader",
            options: {
              // projectReferences: true,
              // transpileOnly: false,
              logLevel: "debug",
              instance: pkgName,
              configFile: tsConfigFile,
            },
          },
        ],
      };
    });

  // const tsLoaderRuleConfig = {
  //   loader: "ts-loader",
  //   options: {
  //     logLevel: "debug",
  //     configFile: `tsconfig.json`,
  //   },
  // };

  // const tsLoaderRule = {
  //   test: /\.ts$/,
  //   exclude: /node_modules/,
  //   use: [tsLoaderRuleConfig],
  // };

  // const tsLoaderRuleList = [tsLoaderRule];

  // tsLoaderRule.use = pkgInfoList
  //   // FIXME: delete this when done testing
  //   // .filter((pkgInfo) => pkgInfo.name.includes("cactus-common"))
  //   .map((pkgInfo) => {
  //     const { name: pkgName } = pkgInfo;
  //     const tsConfigFile = `../../../tsconfig.json`;
  //     return {
  //       loader: "ts-loader",
  //       options: {
  //         logLevel: "debug",
  //         instance: pkgName,
  //         configFile: tsConfigFile,
  //       },
  //     };
  //   });

  /** @type {import("webpack").Configuration} */
  const webpackConfg = {
    entry,
    target,
    mode,
    devtool,
    module: {
      rules: [...tsLoaderRuleList],
    },
    plugins: [],
    // resolve: {
    //   extensions: ['.js', '.jsx']
    // }
    resolve: {
      extensions: [".ts", ".js"],
    },
    optimization,
    output: {
      filename: "[name]",
      path: process.cwd(),
      libraryTarget: "umd",
      // library: libraryName,
      umdNamedDefine: true,
      globalObject: "this",
    },
    externals: {
      "swarm-js": "swarm-js",
    },
  };

  /** @type {import("webpack").Configuration[]} */
  const webpackConfigs = [webpackConfg];
  return webpackConfigs;
};

/**
 *
 * @param {Object} options
 * @param {string} options.env The environment the code should be built for such as `dev` or `prod`
 * @param {string} options.target The target platform to build the code for such as `node` or `web`
 * @param {import("./tools/get-package-info-list").PackageInfo[]} options.pkgInfoList The target platform to build the code for such as `node` or `web`
 * @returns {import("webpack").Configuration[]}
 */
const main = (options) => {
  const { ["env-csv"]: envCsv, ["target-csv"]: targetCsv } = options;

  const envs = envCsv.split(",");
  const targets = targetCsv.split(",");

  const pkgInfoList = getPackageInfoList([/cactus-cockpit/]);

  const buildConfigs = [];
  envs.forEach((env) => {
    targets.forEach((target) =>
      buildConfigs.push({ env, target, pkgInfoList })
    );
  });

  return buildConfigs.flatMap((bc) => createWebpackConfigs(bc));
};

// Since webpack-cli 4.x we have to massage the custom arguments to be accepted
const argv = require("minimist")(process.argv.slice(2));
argv.env = argv.env.map((x) => `--${x}`);
const options = require("minimist")(argv.env);

const webpackConfigs = main(options);
writeFileSync("./webpack.config.json", JSON.stringify(webpackConfigs, null, 4));

module.exports = webpackConfigs;
