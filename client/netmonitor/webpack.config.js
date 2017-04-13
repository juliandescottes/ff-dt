/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* eslint-env node */
/* eslint max-len: [0] */

"use strict";

const path = require("path");
const { NormalModuleReplacementPlugin } = require("webpack");
const { toolboxConfig } = require("./node_modules/devtools-launchpad/index");
const { getConfig } = require("./bin/configure");

let webpackConfig = {
  entry: {
    netmonitor: [path.join(__dirname, "index.js")]
  },

  module: {
    // Disable handling of unknown requires
    unknownContextRegExp: /$^/,
    unknownContextCritical: false,

    // Disable handling of requires with a single expression
    exprContextRegExp: /$^/,
    exprContextCritical: false,

    // Warn for every expression in require
    wrappedContextCritical: true,

    loaders: [
      {
        test: /\.(png|svg)$/,
        loader: "file-loader?name=[path][name].[ext]",
      },
    ]
  },

  output: {
    path: path.join(__dirname, "assets/build"),
    filename: "[name].js",
    publicPath: "/assets/build",
    libraryTarget: "umd",
  },

  // Fallback compatibility for npm link
  resolve: {
    fallback: path.join(__dirname, "node_modules"),
    alias: {
      "react": path.join(__dirname, "node_modules/react"),
      "devtools/client/framework/devtools": "devtools-modules",
      "devtools/client/framework/menu": "devtools-modules/client/framework/menu",
      "devtools/client/framework/menu-item": "devtools-modules/client/framework/menu-item",
      "devtools/client/locales": path.join(__dirname, "../locales/en-US"),
      "devtools/client/netmonitor/src/utils/menu": "devtools-launchpad/src/components/shared/menu",
      "devtools/client/shared/components/reps/reps": "devtools-reps",
      "devtools/client/shared/components/search-box": "devtools-modules/client/shared/components/search-box",
      "devtools/client/shared/components/splitter/split-box": "devtools-splitter",
      "devtools/client/shared/components/stack-trace": "devtools-modules/client/shared/components/stack-trace",
      "devtools/client/shared/components/tabs/tabbar": "devtools-modules/client/shared/components/tabs/tabbar",
      "devtools/client/shared/components/tabs/tabs": "devtools-modules/client/shared/components/tabs/tabs",
      "devtools/client/shared/components/tree/tree-view": "devtools-modules/client/shared/components/tree/tree-view",
      "devtools/client/shared/components/tree/tree-row": "devtools-modules/client/shared/components/tree/tree-row",
      "devtools/client/shared/curl": "devtools-modules/client/shared/curl",
      "devtools/client/shared/file-saver": "devtools-modules/client/shared/file-saver",
      "devtools/client/shared/prefs": "devtools-modules",
      "devtools/client/shared/vendor/immutable": "immutable",
      "devtools/client/shared/vendor/react": "react",
      "devtools/client/shared/vendor/react-dom": "react-dom",
      "devtools/client/shared/vendor/react-redux": "react-redux",
      "devtools/client/shared/vendor/redux": "redux",
      "devtools/client/shared/vendor/reselect": "reselect",
      "devtools/client/shared/vendor/jszip": "jszip",
      "devtools/client/shared/widgets/tooltip/HTMLTooltip": "devtools-modules",
      "devtools/client/shared/widgets/tooltip/ImageTooltipHelper": "devtools-modules/client/shared/widgets/tooltip/ImageTooltipHelper",
      "devtools/client/shared/widgets/Chart": "devtools-modules",
      "devtools/client/sourceeditor/editor": "devtools-source-editor/src/source-editor",
      "devtools/shared/fronts/timeline": "devtools-modules",
      "devtools/shared/l10n": "devtools-modules/shared/l10n",
      "devtools/shared/locales": path.join(__dirname, "../../shared/locales/en-US"),
      "devtools/shared/platform/clipboard": "devtools-modules/shared/clipboard",
      "devtools/shared/plural-form": "devtools-modules",
      "toolkit/locales": path.join(__dirname, "../../../toolkit/locales/en-US"),
      "Services": "devtools-modules/client/shared/shim/Services",
    },
  },
};

const mappings = [
  [
    /chrome:\/\/devtools\/skin/,
    (result) => {
      result.request = result.request
        .replace("./chrome://devtools/skin", path.join(__dirname, "../themes"));
    }
  ],
  [
    /chrome:\/\/devtools\/content/,
    (result) => {
      result.request = result.request
        .replace("./chrome://devtools/content", path.join(__dirname, ".."));
    }
  ],
  [
    /resource:\/\/devtools/,
    (result) => {
      result.request = result.request
        .replace("./resource://devtools/client", path.join(__dirname, ".."));
    }
  ],
  [/\.\/mocha/, "./mochitest"],
  [/\.\.\/utils\/mocha/, "../utils/mochitest"],
  [/\.\/utils\/mocha/, "./utils/mochitest"],
];

webpackConfig.plugins = mappings.map(([regex, res]) =>
  new NormalModuleReplacementPlugin(regex, res));

let config = toolboxConfig(webpackConfig, getConfig());

// Remove loaders from devtools-launchpad webpack config
config.module.loaders = config.module.loaders
  .filter((loader) => !["svg-inline"].includes(loader.loader));

module.exports = config;
