/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

/**
 * Set of actors that expose the Web Animations API to devtools protocol
 * clients.
 *
 * The |Animations| actor is the main entry point. It is used to discover
 * animation players on given nodes.
 * There should only be one instance per debugger server.
 *
 * The |AnimationPlayer| actor provides attributes and methods to inspect an
 * animation as well as pause/resume/seek it.
 *
 * The Web Animation spec implementation is ongoing in Gecko, and so this set
 * of actors should evolve when the implementation progresses.
 *
 * References:
 * - WebAnimation spec:
 *   http://w3c.github.io/web-animations/
 * - WebAnimation WebIDL files:
 *   /dom/webidl/Animation*.webidl
 */

const {Cu} = require("chrome");
const promise = require("promise");
const {Task} = Cu.import("resource://gre/modules/Task.jsm", {});
const protocol = require("devtools/server/protocol");
const {ActorClass, Actor, FrontClass, Front,
       Arg, method, RetVal, types} = protocol;
// Make sure the nodeActor type is know here.
const {NodeActor} = require("devtools/server/actors/inspector");
const events = require("sdk/event/core");

// Types of animations.
const ANIMATION_TYPES = {
  CSS_ANIMATION: "cssanimation",
  CSS_TRANSITION: "csstransition",
  UNKNOWN: "unknown"
};

/**
 * The AnimationPlayerActor provides information about a given animation: its
 * startTime, currentTime, current state, etc.
 *
 * Since the state of a player changes as the animation progresses it is often
 * useful to call getCurrentState at regular intervals to get the current state.
 *
 * This actor also allows playing, pausing and seeking the animation.
 */
var AnimationPlayerActor = ActorClass({
  typeName: "animationplayer",

  events: {
    "changed": {
      type: "changed",
      state: Arg(0, "json")
    }
  },

  /**
   * @param {AnimationsActor} The main AnimationsActor instance
   * @param {AnimationPlayer} The player object returned by getAnimationPlayers
   * @param {Number} Temporary work-around used to retrieve duration and
   * iteration count from computed-style rather than from waapi. This is needed
   * to know which duration to get, in case there are multiple css animations
   * applied to the same node.
   */
  initialize: function(animationsActor, player, playerIndex) {
    Actor.prototype.initialize.call(this, animationsActor.conn);

    this.onAnimationMutation = this.onAnimationMutation.bind(this);

    this.tabActor = animationsActor.tabActor;
    this.player = player;
    this.node = player.effect.target;
    this.playerIndex = playerIndex;

    let win = this.node.ownerDocument.defaultView;
    this.styles = win.getComputedStyle(this.node);

    // Listen to animation mutations on the node to alert the front when the
    // current animation changes.
    this.observer = new win.MutationObserver(this.onAnimationMutation);
    this.observer.observe(this.node, {animations: true});
  },

  destroy: function() {
    // Only try to disconnect the observer if it's not already dead (i.e. if the
    // container view hasn't navigated since).
    if (this.observer && !Cu.isDeadWrapper(this.observer)) {
      this.observer.disconnect();
    }
    this.tabActor = this.player = this.node = this.styles = this.observer = null;
    Actor.prototype.destroy.call(this);
  },

  /**
   * Release the actor, when it isn't needed anymore.
   * Protocol.js uses this release method to call the destroy method.
   */
  release: method(function() {}, {release: true}),

  form: function(detail) {
    if (detail === "actorid") {
      return this.actorID;
    }

    let data = this.getCurrentState();
    data.actor = this.actorID;

    return data;
  },

  isAnimation: function(player=this.player) {
    return player instanceof this.tabActor.window.CSSAnimation;
  },

  isTransition: function(player=this.player) {
    return player instanceof this.tabActor.window.CSSTransition;
  },

  getType: function() {
    if (this.isAnimation()) {
      return ANIMATION_TYPES.CSS_ANIMATION;
    } else if (this.isTransition()) {
      return ANIMATION_TYPES.CSS_TRANSITION;
    }

    return ANIMATION_TYPES.UNKNOWN;
  },

  /**
   * Some of the player's properties are retrieved from the node's
   * computed-styles because the Web Animations API does not provide them yet.
   * But the computed-styles may contain multiple animations for a node and so
   * we need to know which is the index of the current animation in the style.
   * @return {Number}
   */
  getPlayerIndex: function() {
    let names = this.styles.animationName;
    if (names === "none") {
      names = this.styles.transitionProperty;
    }

    // If we still don't have a name, let's fall back to the provided index
    // which may, by now, be wrong, but it's the best we can do until the waapi
    // gives us a way to get duration, delay, ... directly.
    if (!names || names === "none") {
      return this.playerIndex;
    }

    // If there's only one name.
    if (names.includes(",") === -1) {
      return 0;
    }

    // If there are several names, retrieve the index of the animation name in
    // the list.
    let playerName = this.getName();
    names = names.split(",").map(n => n.trim());
    for (let i = 0; i < names.length; i++) {
      if (names[i] === playerName) {
        return i;
      }
    }
  },

  /**
   * Get the name associated with the player. This is used to match
   * up the player with values in the computed animation-name or
   * transition-property property.
   * @return {String}
   */
  getName: function() {
    if (this.isAnimation()) {
      return this.player.animationName;
    } else if (this.isTransition()) {
      return this.player.transitionProperty;
    }

    return "";
  },

  /**
   * Get the animation duration from this player, in milliseconds.
   * Note that the Web Animations API doesn't yet offer a way to retrieve this
   * directly from the AnimationPlayer object, so for now, a duration is only
   * returned if found in the node's computed styles.
   * @return {Number}
   */
  getDuration: function() {
    let durationText;
    if (this.styles.animationDuration !== "0s") {
      durationText = this.styles.animationDuration;
    } else if (this.styles.transitionDuration !== "0s") {
      durationText = this.styles.transitionDuration;
    } else {
      return null;
    }

    // If the computed duration has multiple entries, we need to find the right
    // one.
    if (durationText.indexOf(",") !== -1) {
      durationText = durationText.split(",")[this.getPlayerIndex()];
    }

    return parseFloat(durationText) * 1000;
  },

  /**
   * Get the animation delay from this player, in milliseconds.
   * Note that the Web Animations API doesn't yet offer a way to retrieve this
   * directly from the AnimationPlayer object, so for now, a delay is only
   * returned if found in the node's computed styles.
   * @return {Number}
   */
  getDelay: function() {
    let delayText;
    if (this.styles.animationDelay !== "0s") {
      delayText = this.styles.animationDelay;
    } else if (this.styles.transitionDelay !== "0s") {
      delayText = this.styles.transitionDelay;
    } else {
      return 0;
    }

    if (delayText.indexOf(",") !== -1) {
      delayText = delayText.split(",")[this.getPlayerIndex()];
    }

    return parseFloat(delayText) * 1000;
  },

  /**
   * Get the animation iteration count for this player. That is, how many times
   * is the animation scheduled to run.
   * Note that the Web Animations API doesn't yet offer a way to retrieve this
   * directly from the AnimationPlayer object, so for now, check for
   * animationIterationCount in the node's computed styles, and return that.
   * This style property defaults to 1 anyway.
   * @return {Number}
   */
  getIterationCount: function() {
    let iterationText = this.styles.animationIterationCount;
    if (iterationText.indexOf(",") !== -1) {
      iterationText = iterationText.split(",")[this.getPlayerIndex()];
    }

    return iterationText === "infinite"
           ? null
           : parseInt(iterationText, 10);
  },

  /**
   * Get the current state of the AnimationPlayer (currentTime, playState, ...).
   * Note that the initial state is returned as the form of this actor when it
   * is initialized.
   * @return {Object}
   */
  getCurrentState: method(function() {
    // Remember the startTime each time getCurrentState is called, it may be
    // useful when animations get paused. As in, when an animation gets paused,
    // it's startTime goes back to null, but the front-end might still be
    // interested in knowing what the previous startTime was. So everytime it
    // is set, remember it and send it along with the newState.
    if (this.player.startTime) {
      this.previousStartTime = this.player.startTime;
    }

    // Note that if you add a new property to the state object, make sure you
    // add the corresponding property in the AnimationPlayerFront' initialState
    // getter.
    let newState = {
      type: this.getType(),
      // startTime is null whenever the animation is paused or waiting to start.
      startTime: this.player.startTime,
      previousStartTime: this.previousStartTime,
      currentTime: this.player.currentTime,
      playState: this.player.playState,
      playbackRate: this.player.playbackRate,
      name: this.getName(),
      duration: this.getDuration(),
      delay: this.getDelay(),
      iterationCount: this.getIterationCount(),
      // isRunningOnCompositor is important for developers to know if their
      // animation is hitting the fast path or not. Currently only true for
      // Firefox OS (where we have compositor animations enabled).
      // Returns false whenever the animation is paused as it is taken off the
      // compositor then.
      isRunningOnCompositor: this.player.isRunningOnCompositor,
      // The document timeline's currentTime is being sent along too. This is
      // not strictly related to the node's animationPlayer, but is useful to
      // know the current time of the animation with respect to the document's.
      documentCurrentTime: this.node.ownerDocument.timeline.currentTime
    };

    // If we've saved a state before, compare and only send what has changed.
    // It's expected of the front to also save old states to re-construct the
    // full state when an incomplete one is received.
    // This is to minimize protocol traffic.
    let sentState = {};
    if (this.currentState) {
      for (let key in newState) {
        if (typeof this.currentState[key] === "undefined" ||
            this.currentState[key] !== newState[key]) {
          sentState[key] = newState[key];
        }
      }
    } else {
      sentState = newState;
    }
    this.currentState = newState;

    return sentState;
  }, {
    request: {},
    response: {
      data: RetVal("json")
    }
  }),

  /**
   * Executed when the current animation changes, used to emit the new state
   * the the front.
   */
  onAnimationMutation: function(mutations) {
    let hasChanged = false;
    for (let {removedAnimations, changedAnimations} of mutations) {
      if (removedAnimations.length) {
        // Reset the local copy of the state on removal, since the animation can
        // be kept on the client and re-added, its state needs to be sent in
        // full.
        this.currentState = null;
      }

      if (!changedAnimations.length) {
        return;
      }
      if (changedAnimations.some(animation => animation === this.player)) {
        hasChanged = true;
        break;
      }
    }

    if (hasChanged) {
      events.emit(this, "changed", this.getCurrentState());
    }
  },

  /**
   * Pause the player.
   */
  pause: method(function() {
    this.player.pause();
    return this.player.ready;
  }, {
    request: {},
    response: {}
  }),

  /**
   * Play the player.
   * This method only returns when the animation has left its pending state.
   */
  play: method(function() {
    this.player.play();
    return this.player.ready;
  }, {
    request: {},
    response: {}
  }),

  /**
   * Simply exposes the player ready promise.
   *
   * When an animation is created/paused then played, there's a short time
   * during which its playState is pending, before being set to running.
   *
   * If you either created a new animation using the Web Animations API or
   * paused/played an existing one, and then want to access the playState, you
   * might be interested to call this method.
   * This is especially important for tests.
   */
  ready: method(function() {
    return this.player.ready;
  }, {
    request: {},
    response: {}
  }),

  /**
   * Set the current time of the animation player.
   */
  setCurrentTime: method(function(currentTime) {
    this.player.currentTime = currentTime;
  }, {
    request: {
      currentTime: Arg(0, "number")
    },
    response: {}
  }),

  /**
   * Set the playback rate of the animation player.
   */
  setPlaybackRate: method(function(playbackRate) {
    this.player.playbackRate = playbackRate;
  }, {
    request: {
      currentTime: Arg(0, "number")
    },
    response: {}
  })
});

var AnimationPlayerFront = FrontClass(AnimationPlayerActor, {
  initialize: function(conn, form, detail, ctx) {
    Front.prototype.initialize.call(this, conn, form, detail, ctx);

    this.state = {};
  },

  form: function(form, detail) {
    if (detail === "actorid") {
      this.actorID = form;
      return;
    }
    this._form = form;
    this.state = this.initialState;
  },

  destroy: function() {
    Front.prototype.destroy.call(this);
  },

  /**
   * Getter for the initial state of the player. Up to date states can be
   * retrieved by calling the getCurrentState method.
   */
  get initialState() {
    return {
      type: this._form.type,
      startTime: this._form.startTime,
      previousStartTime: this._form.previousStartTime,
      currentTime: this._form.currentTime,
      playState: this._form.playState,
      playbackRate: this._form.playbackRate,
      name: this._form.name,
      duration: this._form.duration,
      delay: this._form.delay,
      iterationCount: this._form.iterationCount,
      isRunningOnCompositor: this._form.isRunningOnCompositor,
      documentCurrentTime: this._form.documentCurrentTime
    };
  },

  /**
   * Executed when the AnimationPlayerActor emits a "changed" event. Used to
   * update the local knowledge of the state.
   */
  onChanged: protocol.preEvent("changed", function(partialState) {
    let {state} = this.reconstructState(partialState);
    this.state = state;
  }),

  /**
   * Refresh the current state of this animation on the client from information
   * found on the server. Doesn't return anything, just stores the new state.
   */
  refreshState: Task.async(function*() {
    let data = yield this.getCurrentState();
    if (this.currentStateHasChanged) {
      this.state = data;
    }
  }),

  /**
   * getCurrentState interceptor re-constructs incomplete states since the actor
   * only sends the values that have changed.
   */
  getCurrentState: protocol.custom(function() {
    this.currentStateHasChanged = false;
    return this._getCurrentState().then(partialData => {
      let {state, hasChanged} = this.reconstructState(partialData);
      this.currentStateHasChanged = hasChanged;
      return state;
    });
  }, {
    impl: "_getCurrentState"
  }),

  reconstructState: function(data) {
    let hasChanged = false;

    for (let key in this.state) {
      if (typeof data[key] === "undefined") {
        data[key] = this.state[key];
      } else if (data[key] !== this.state[key]) {
        hasChanged = true;
      }
    }

    return {state: data, hasChanged};
  }
});

/**
 * Sent with the 'mutations' event as part of an array of changes, used to
 * inform fronts of the type of change that occured.
 */
types.addDictType("animationMutationChange", {
  // The type of change ("added" or "removed").
  type: "string",
  // The changed AnimationPlayerActor.
  player: "animationplayer"
});

/**
 * The Animations actor lists animation players for a given node.
 */
var AnimationsActor = exports.AnimationsActor = ActorClass({
  typeName: "animations",

  events: {
    "mutations": {
      type: "mutations",
      changes: Arg(0, "array:animationMutationChange")
    }
  },

  initialize: function(conn, tabActor) {
    Actor.prototype.initialize.call(this, conn);
    this.tabActor = tabActor;

    this.onWillNavigate = this.onWillNavigate.bind(this);
    this.onNavigate = this.onNavigate.bind(this);
    this.onAnimationMutation = this.onAnimationMutation.bind(this);

    this.allAnimationsPaused = false;
    events.on(this.tabActor, "will-navigate", this.onWillNavigate);
    events.on(this.tabActor, "navigate", this.onNavigate);
  },

  destroy: function() {
    Actor.prototype.destroy.call(this);
    events.off(this.tabActor, "will-navigate", this.onWillNavigate);
    events.off(this.tabActor, "navigate", this.onNavigate);

    this.stopAnimationPlayerUpdates();
    this.tabActor = this.observer = this.actors = null;
  },

  /**
   * Since AnimationsActor doesn't have a protocol.js parent actor that takes
   * care of its lifetime, implementing disconnect is required to cleanup.
   */
  disconnect: function() {
    this.destroy();
  },

  /**
   * Retrieve the list of AnimationPlayerActor actors for currently running
   * animations on a node and its descendants.
   * @param {NodeActor} nodeActor The NodeActor as defined in
   * /toolkit/devtools/server/actors/inspector
   */
  getAnimationPlayersForNode: method(function(nodeActor) {
    let animations = [
      ...nodeActor.rawNode.getAnimations(),
      ...this.getAllAnimations(nodeActor.rawNode)
    ];

    // No care is taken here to destroy the previously stored actors because it
    // is assumed that the client is responsible for lifetimes of actors.
    this.actors = [];
    for (let i = 0; i < animations.length; i++) {
      // XXX: for now the index is passed along as the AnimationPlayerActor uses
      // it to retrieve animation information from CSS.
      let actor = AnimationPlayerActor(this, animations[i], i);
      this.actors.push(actor);
    }

    // When a front requests the list of players for a node, start listening
    // for animation mutations on this node to send updates to the front, until
    // either getAnimationPlayersForNode is called again or
    // stopAnimationPlayerUpdates is called.
    this.stopAnimationPlayerUpdates();
    let win = nodeActor.rawNode.ownerDocument.defaultView;
    this.observer = new win.MutationObserver(this.onAnimationMutation);
    this.observer.observe(nodeActor.rawNode, {
      animations: true,
      subtree: true
    });

    return this.actors;
  }, {
    request: {
      actorID: Arg(0, "domnode")
    },
    response: {
      players: RetVal("array:animationplayer")
    }
  }),

  onAnimationMutation: function(mutations) {
    let eventData = [];
    let readyPromises = [];

    for (let {addedAnimations, removedAnimations} of mutations) {
      for (let player of removedAnimations) {
        // Note that animations are reported as removed either when they are
        // actually removed from the node (e.g. css class removed) or when they
        // are finished and don't have forwards animation-fill-mode.
        // In the latter case, we don't send an event, because the corresponding
        // animation can still be seeked/resumed, so we want the client to keep
        // its reference to the AnimationPlayerActor.
        if (player.playState !== "idle") {
          continue;
        }
        let index = this.actors.findIndex(a => a.player === player);
        if (index !== -1) {
          eventData.push({
            type: "removed",
            player: this.actors[index]
          });
          this.actors.splice(index, 1);
        }
      }

      for (let player of addedAnimations) {
        // If the added player already exists, it means we previously filtered
        // it out when it was reported as removed. So filter it out here too.
        if (this.actors.find(a => a.player === player)) {
          continue;
        }
        // If the added player has the same name and target node as a player we
        // already have, it means it's a transition that's re-starting. So send
        // a "removed" event for the one we already have.
        let index = this.actors.findIndex(a => {
          let isSameType = a.player.constructor === player.constructor;
          let isSameName = (a.isAnimation() &&
                            a.player.animationName === player.animationName) ||
                           (a.isTransition() &&
                            a.player.transitionProperty === player.transitionProperty);
          let isSameNode = a.player.effect.target === player.effect.target;

          return isSameType && isSameNode && isSameName;
        });
        if (index !== -1) {
          eventData.push({
            type: "removed",
            player: this.actors[index]
          });
          this.actors.splice(index, 1);
        }

        let actor = AnimationPlayerActor(
          this, player, player.effect.target.getAnimations().indexOf(player));
        this.actors.push(actor);
        eventData.push({
          type: "added",
          player: actor
        });
        readyPromises.push(player.ready);
      }
    }

    if (eventData.length) {
      // Let's wait for all added animations to be ready before telling the
      // front-end.
      Promise.all(readyPromises).then(() => {
        events.emit(this, "mutations", eventData);
      });
    }
  },

  /**
   * After the client has called getAnimationPlayersForNode for a given DOM
   * node, the actor starts sending animation mutations for this node. If the
   * client doesn't want this to happen anymore, it should call this method.
   */
  stopAnimationPlayerUpdates: method(function() {
    if (this.observer && !Cu.isDeadWrapper(this.observer)) {
      this.observer.disconnect();
    }
  }, {
    request: {},
    response: {}
  }),

  /**
   * Iterates through all nodes below a given rootNode (optionally also in
   * nested frames) and finds all existing animation players.
   * @param {DOMNode} rootNode The root node to start iterating at. Animation
   * players will *not* be reported for this node.
   * @param {Boolean} traverseFrames Whether we should iterate through nested
   * frames too.
   * @return {Array} An array of AnimationPlayer objects.
   */
  getAllAnimations: function(rootNode, traverseFrames) {
    let animations = [];

    // These loops shouldn't be as bad as they look.
    // Typically, there will be very few nested frames, and getElementsByTagName
    // is really fast even on large DOM trees.
    for (let element of rootNode.getElementsByTagNameNS("*", "*")) {
      if (traverseFrames && element.contentWindow) {
        animations = [
          ...animations,
          ...this.getAllAnimations(element.contentWindow.document, traverseFrames)
        ];
      } else {
        animations = [
          ...animations,
          ...element.getAnimations()
        ];
      }
    }

    return animations;
  },

  onWillNavigate: function({isTopLevel}) {
    if (isTopLevel) {
      this.stopAnimationPlayerUpdates();
    }
  },

  onNavigate: function({isTopLevel}) {
    if (isTopLevel) {
      this.allAnimationsPaused = false;
    }
  },

  /**
   * Pause all animations in the current tabActor's frames.
   */
  pauseAll: method(function() {
    let readyPromises = [];
    // Until the WebAnimations API provides a way to play/pause via the document
    // timeline, we have to iterate through the whole DOM to find all players.
    for (let player of
         this.getAllAnimations(this.tabActor.window.document, true)) {
      player.pause();
      readyPromises.push(player.ready);
    }
    this.allAnimationsPaused = true;
    return promise.all(readyPromises);
  }, {
    request: {},
    response: {}
  }),

  /**
   * Play all animations in the current tabActor's frames.
   * This method only returns when animations have left their pending states.
   */
  playAll: method(function() {
    let readyPromises = [];
    // Until the WebAnimations API provides a way to play/pause via the document
    // timeline, we have to iterate through the whole DOM to find all players.
    for (let player of
         this.getAllAnimations(this.tabActor.window.document, true)) {
      player.play();
      readyPromises.push(player.ready);
    }
    this.allAnimationsPaused = false;
    return promise.all(readyPromises);
  }, {
    request: {},
    response: {}
  }),

  toggleAll: method(function() {
    if (this.allAnimationsPaused) {
      return this.playAll();
    }
    return this.pauseAll();
  }, {
    request: {},
    response: {}
  }),

  /**
   * Toggle (play/pause) several animations at the same time.
   * @param {Array} players A list of AnimationPlayerActor objects.
   * @param {Boolean} shouldPause If set to true, the players will be paused,
   * otherwise they will be played.
   */
  toggleSeveral: method(function(players, shouldPause) {
    return promise.all(players.map(player => {
      return shouldPause ? player.pause() : player.play();
    }));
  }, {
    request: {
      players: Arg(0, "array:animationplayer"),
      shouldPause: Arg(1, "boolean")
    },
    response: {}
  }),

  /**
   * Set the current time of several animations at the same time.
   * @param {Array} players A list of AnimationPlayerActor.
   * @param {Number} time The new currentTime.
   * @param {Boolean} shouldPause Should the players be paused too.
   */
  setCurrentTimes: method(function(players, time, shouldPause) {
    return promise.all(players.map(player => {
      let pause = shouldPause ? player.pause() : promise.resolve();
      return pause.then(() => player.setCurrentTime(time));
    }));
  }, {
    request: {
      players: Arg(0, "array:animationplayer"),
      time: Arg(1, "number"),
      shouldPause: Arg(2, "boolean")
    },
    response: {}
  })
});

var AnimationsFront = exports.AnimationsFront = FrontClass(AnimationsActor, {
  initialize: function(client, {animationsActor}) {
    Front.prototype.initialize.call(this, client, {actor: animationsActor});
    this.manage(this);
  },

  destroy: function() {
    Front.prototype.destroy.call(this);
  }
});
