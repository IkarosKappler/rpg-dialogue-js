var path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
var webpack = require("webpack");

var PATHS = {
  entryPoint: path.resolve(__dirname, "src/ts/index.ts"),
  bundles: path.resolve(__dirname, "dist/_bundles")
};

// var config = {
module.exports = env => {
  return {
    mode: env.development ? "development" : "production",
    // These are the entry point of our library. We tell webpack to use
    // the name we assign later, when creating the bundle. We also use
    // the name to filter the second entry point for applying code
    // minification via UglifyJS
    entry: {
      "rpg-dialogue": [PATHS.entryPoint]
      // "rpg-dialogue.min": [PATHS.entryPoint]
    },
    // The output defines how and where we want the bundles. The special
    // value `[name]` in `filename` tell Webpack to use the name we defined above.
    // We target a UMD and name it MyLib. When including the bundle in the browser
    // it will be accessible at `window.MyLib`
    output: {
      path: PATHS.bundles,
      filename: env.development ? "[name].js" : "[name].min.js",
      libraryTarget: "umd",
      library: "RPGDialogue",
      umdNamedDefine: true
    },
    // Add resolve for `tsx` and `ts` files, otherwise Webpack would
    // only look for common JavaScript file extension (.js)
    resolve: {
      extensions: [".ts", ".tsx", ".js"]
    },
    // Activate source maps for the bundles in order to preserve the original
    // source when the user debugs the application
    devtool: "source-map",
    // plugins: [
    //   // Apply minification only on the second bundle by
    //   // using a RegEx on the name, which must end with `.min.js`
    //   // NB: Remember to activate sourceMaps in UglifyJsPlugin
    //   // since they are disabled by default!
    //   new webpack.optimize.UglifyJsPlugin({
    //     minimize: true,
    //     sourceMap: true,
    //     include: /\.min\.js$/
    //   })
    // ],
    optimization: {
      minimize: !env.development,
      minimizer: [
        // extractComment=false to prevent the generation of License.txt
        new TerserPlugin({ extractComments: false })
      ],
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /node_modules/,
            chunks: "initial",
            name: "vendor",
            enforce: true
          }
        }
      }
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          // loader: "awesome-typescript-loader",
          loader: "ts-loader",
          exclude: /node_modules/
          // query: {
          //   // we don't want any declaration file in the bundles
          //   // folder since it wouldn't be of any use ans the source
          //   // map already include everything for debugging
          //   declaration: false
          // }
        }
      ]
    }
    // module: {
    //   // Webpack doesn't understand TypeScript files and a loader is needed.
    //   // `node_modules` folder is excluded in order to prevent problems with
    //   // the library dependencies, as well as `__tests__` folders that
    //   // contain the tests for the library
    //   loaders: [
    //     {
    //       test: /\.tsx?$/,
    //       loader: "awesome-typescript-loader",
    //       exclude: /node_modules/,
    //       query: {
    //         // we don't want any declaration file in the bundles
    //         // folder since it wouldn't be of any use ans the source
    //         // map already include everything for debugging
    //         declaration: false
    //       }
    //     }
    //   ]
    // }
  };
};

// module.exports = config;
