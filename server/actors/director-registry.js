/* -*- indent-tabs-mode: nil; js-indent-level: 2; js-indent-level: 2 -*- */
/* vim: set ft=javascript ts=2 et sw=2 tw=80: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

const protocol = require("devtools/shared/protocol");

const {DebuggerServer} = require("devtools/server/main");

const {directorRegistrySpec} = require("devtools/shared/specs/director-registry");

/**
 * Error Messages
 */

const ERR_DIRECTOR_INSTALL_TWICE = "Trying to install a director-script twice";
const ERR_DIRECTOR_INSTALL_EMPTY = "Trying to install an empty director-script";
const ERR_DIRECTOR_UNINSTALL_UNKNOWN = "Trying to uninstall an unkown director-script";

const ERR_DIRECTOR_PARENT_UNKNOWN_METHOD = "Unknown parent process method";
const ERR_DIRECTOR_CHILD_NOTIMPLEMENTED_METHOD = "Unexpected call to notImplemented method";
const ERR_DIRECTOR_CHILD_MULTIPLE_REPLIES = "Unexpected multiple replies to called parent method";
const ERR_DIRECTOR_CHILD_NO_REPLY = "Unexpected no reply to called parent method";

/**
 * Director Registry
 */

// Map of director scripts ids to director script definitions
var gDirectorScripts = Object.create(null);

const DirectorRegistry = exports.DirectorRegistry = {
  /**
   * Register a Director Script with the debugger server.
   * @param id string
   *    The ID of a director script.
   * @param directorScriptDef object
   *    The definition of a director script.
   */
  install: function (id, scriptDef) {
    if (id in gDirectorScripts) {
      console.error(ERR_DIRECTOR_INSTALL_TWICE, id);
      return false;
    }

    if (!scriptDef) {
      console.error(ERR_DIRECTOR_INSTALL_EMPTY, id);
      return false;
    }

    gDirectorScripts[id] = scriptDef;

    return true;
  },

  /**
   * Unregister a Director Script with the debugger server.
   * @param id string
   *    The ID of a director script.
   */
  uninstall: function (id) {
    if (id in gDirectorScripts) {
      delete gDirectorScripts[id];

      return true;
    }

    console.error(ERR_DIRECTOR_UNINSTALL_UNKNOWN, id);

    return false;
  },

  /**
   * Returns true if a director script id has been registered.
   * @param id string
   *    The ID of a director script.
   */
  checkInstalled: function (id) {
    return (this.list().indexOf(id) >= 0);
  },

  /**
   * Returns a registered director script definition by id.
   * @param id string
   *    The ID of a director script.
   */
  get: function (id) {
    return gDirectorScripts[id];
  },

  /**
   * Returns an array of registered director script ids.
   */
  list: function () {
    return Object.keys(gDirectorScripts);
  },

  /**
   * Removes all the registered director scripts.
   */
  clear: function () {
    gDirectorScripts = Object.create(null);
  }
};

/**
 * E10S parent/child setup helpers
 */

exports.setupParentProcess = function setupParentProcess({ mm, prefix }) {
  // listen for director-script requests from the child process
  setMessageManager(mm);

  /* parent process helpers */

  function handleChildRequest(msg) {
    switch (msg.json.method) {
      case "get":
        return DirectorRegistry.get(msg.json.args[0]);
      case "list":
        return DirectorRegistry.list();
      default:
        console.error(ERR_DIRECTOR_PARENT_UNKNOWN_METHOD, msg.json.method);
        throw new Error(ERR_DIRECTOR_PARENT_UNKNOWN_METHOD);
    }
  }

  function setMessageManager(newMM) {
    if (mm) {
      mm.removeMessageListener("debug:director-registry-request", handleChildRequest);
    }
    mm = newMM;
    if (mm) {
      mm.addMessageListener("debug:director-registry-request", handleChildRequest);
    }
  }

  return {
    onBrowserSwap: setMessageManager,
    onDisconnected: () => setMessageManager(null),
  };
};

/**
 * The DirectorRegistry Actor is a global actor which manages install/uninstall of
 * director scripts definitions.
 */
const DirectorRegistryActor = exports.DirectorRegistryActor = protocol.ActorClass(directorRegistrySpec, {
  /* init & destroy methods */
  initialize: function (conn, parentActor) {
    protocol.Actor.prototype.initialize.call(this, conn);
    this.maybeSetupChildProcess(conn);
  },
  destroy: function (conn) {
    protocol.Actor.prototype.destroy.call(this, conn);
    this.finalize();
  },

  finalize: function () {
    // nothing to cleanup
  },

  maybeSetupChildProcess(conn) {
    // skip child setup if this actor module is not running in a child process
    if (!DebuggerServer.isInChildProcess) {
      return;
    }

    const { sendSyncMessage } = conn.parentMessageManager;

    conn.setupInParent({
      module: "devtools/server/actors/director-registry",
      setupParent: "setupParentProcess"
    });

    DirectorRegistry.install = notImplemented.bind(null, "install");
    DirectorRegistry.uninstall = notImplemented.bind(null, "uninstall");
    DirectorRegistry.clear = notImplemented.bind(null, "clear");

    DirectorRegistry.get = callParentProcess.bind(null, "get");
    DirectorRegistry.list = callParentProcess.bind(null, "list");

    /* child process helpers */

    function notImplemented(method) {
      console.error(ERR_DIRECTOR_CHILD_NOTIMPLEMENTED_METHOD, method);
      throw Error(ERR_DIRECTOR_CHILD_NOTIMPLEMENTED_METHOD);
    }

    function callParentProcess(method, ...args) {
      var reply = sendSyncMessage("debug:director-registry-request", {
        method: method,
        args: args
      });

      if (reply.length === 0) {
        console.error(ERR_DIRECTOR_CHILD_NO_REPLY);
        throw Error(ERR_DIRECTOR_CHILD_NO_REPLY);
      } else if (reply.length > 1) {
        console.error(ERR_DIRECTOR_CHILD_MULTIPLE_REPLIES);
        throw Error(ERR_DIRECTOR_CHILD_MULTIPLE_REPLIES);
      }

      return reply[0];
    }
  },

  /**
   * Install a new director-script definition.
   *
   * @param String id
   *        The director-script definition identifier.
   * @param String scriptCode
   *        The director-script javascript source.
   * @param Object scriptOptions
   *        The director-script option object.
   */
  install: function (id, { scriptCode, scriptOptions }) {
    // TODO: add more checks on id format?
    if (!id || id.length === 0) {
      throw Error("director-script id is mandatory");
    }

    if (!scriptCode) {
      throw Error("director-script scriptCode is mandatory");
    }

    return DirectorRegistry.install(id, {
      scriptId: id,
      scriptCode: scriptCode,
      scriptOptions: scriptOptions
    });
  },

  /**
   * Uninstall a director-script definition.
   *
   * @param String id
   *        The identifier of the director-script definition to be removed
   */
  uninstall: function (id) {
    return DirectorRegistry.uninstall(id);
  },

  /**
   * Retrieves the list of installed director-scripts.
   */
  list: function () {
    return DirectorRegistry.list();
  }
});
