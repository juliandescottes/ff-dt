/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

const { createSystem, connectFront, disconnectFront } = require("gcli/system");
const { GcliFront } = require("devtools/server/actors/gcli");

/**
 * This is the basic list of modules that should be loaded into each
 * requisition instance whether server side or client side
 */
exports.baseModules = [
  "gcli/types/delegate",
  "gcli/types/selection",
  "gcli/types/array",

  "gcli/types/boolean",
  "gcli/types/command",
  "gcli/types/date",
  "gcli/types/file",
  "gcli/types/javascript",
  "gcli/types/node",
  "gcli/types/number",
  "gcli/types/resource",
  "gcli/types/setting",
  "gcli/types/string",
  "gcli/types/union",
  "gcli/types/url",

  "gcli/fields/fields",
  "gcli/fields/delegate",
  "gcli/fields/selection",

  "gcli/ui/focus",
  "gcli/ui/intro",

  "gcli/converters/converters",
  "gcli/converters/basic",
  "gcli/converters/terminal",

  "gcli/languages/command",
  "gcli/languages/javascript",

  "gcli/commands/clear",
  "gcli/commands/context",
  "gcli/commands/help",
  "gcli/commands/pref",
];

/**
 * Some commands belong to a tool (see getToolModules). This is a list of the
 * modules that are *not* owned by a tool.
 */
exports.devtoolsModules = [
  "devtools/toolkit/gcli/commands/addon",
  "devtools/toolkit/gcli/commands/appcache",
  "devtools/toolkit/gcli/commands/calllog",
  "devtools/toolkit/gcli/commands/cmd",
  "devtools/toolkit/gcli/commands/cookie",
  "devtools/toolkit/gcli/commands/csscoverage",
  "devtools/toolkit/gcli/commands/folder",
  "devtools/toolkit/gcli/commands/highlight",
  "devtools/toolkit/gcli/commands/inject",
  "devtools/toolkit/gcli/commands/jsb",
  "devtools/toolkit/gcli/commands/listen",
  "devtools/toolkit/gcli/commands/media",
  "devtools/toolkit/gcli/commands/pagemod",
  "devtools/toolkit/gcli/commands/paintflashing",
  "devtools/toolkit/gcli/commands/restart",
  "devtools/toolkit/gcli/commands/rulers",
  "devtools/toolkit/gcli/commands/screenshot",
  "devtools/toolkit/gcli/commands/security",
  "devtools/toolkit/gcli/commands/tools",
];

/**
 * Register commands from tools with 'command: [ "some/module" ]' definitions.
 * The map/reduce incantation squashes the array of arrays to a single array.
 */
try {
  const defaultTools = require("definitions").defaultTools;
  exports.devtoolsToolModules = defaultTools.map(def => def.commands || [])
                                   .reduce((prev, curr) => prev.concat(curr), []);
} catch(e) {
  // "definitions" is only accessible from Firefox
  exports.devtoolsToolModules = [];
}

/**
 * Register commands from toolbox buttons with 'command: [ "some/module" ]'
 * definitions.  The map/reduce incantation squashes the array of arrays to a
 * single array.
 */
try {
  const { ToolboxButtons } = require("devtools/framework/toolbox");
  exports.devtoolsButtonModules = ToolboxButtons.map(def => def.commands || [])
                                     .reduce((prev, curr) => prev.concat(curr), []);
} catch(e) {
  // "devtools/framework/toolbox" is only accessible from Firefox
  exports.devtoolsButtonModules = [];
}

/**
 * Add modules to a system for use in a content process (but don't call load)
 */
exports.addAllItemsByModule = function(system) {
  system.addItemsByModule(exports.baseModules, { delayedLoad: true });
  system.addItemsByModule(exports.devtoolsModules, { delayedLoad: true });
  system.addItemsByModule(exports.devtoolsToolModules, { delayedLoad: true });
  system.addItemsByModule(exports.devtoolsButtonModules, { delayedLoad: true });

  const { mozDirLoader } = require("devtools/toolkit/gcli/commands/cmd");
  system.addItemsByModule("mozcmd", { delayedLoad: true, loader: mozDirLoader });
};

/**
 * This is WeakMap<Target, Links> where Links is an object that looks like
 *   { refs: number, promise: Promise<System>, front: GcliFront }
 */
var linksForTarget = new WeakMap();

/**
 * The toolbox uses the following properties on a command to allow it to be
 * added to the toolbox toolbar
 */
var customProperties = [ "buttonId", "buttonClass", "tooltipText" ];

/**
 * Create a system which connects to a GCLI in a remote target
 * @return Promise<System> for the given target
 */
exports.getSystem = function(target) {
  const existingLinks = linksForTarget.get(target);
  if (existingLinks != null) {
    existingLinks.refs++;
    return existingLinks.promise;
  }

  const system = createSystem({ location: "client" });

  exports.addAllItemsByModule(system);

  // Load the client system
  const links = {
    refs: 1,
    system,
    promise: system.load().then(() => {
      return GcliFront.create(target).then(front => {
        links.front = front;
        return connectFront(system, front, customProperties).then(() => system);
      });
    })
  };

  linksForTarget.set(target, links);
  return links.promise;
};

/**
 * Someone that called getSystem doesn't need it any more, so decrement the
 * count of users of the system for that target, and destroy if needed
 */
exports.releaseSystem = function(target) {
  const links = linksForTarget.get(target);
  if (links == null) {
    throw new Error("releaseSystem called for unknown target");
  }

  links.refs--;
  if (links.refs === 0) {
    disconnectFront(links.system, links.front);
    links.system.destroy();
    linksForTarget.delete(target);
  }
};
