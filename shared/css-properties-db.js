/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

/**
 * All CSS types that properties can support.
 */
exports.CSS_TYPES = {
  "ANGLE": 1,
  "COLOR": 2,
  "FREQUENCY": 3,
  "GRADIENT": 4,
  "IMAGE_RECT": 5,
  "LENGTH": 6,
  "NUMBER": 7,
  "PERCENTAGE": 8,
  "TIME": 9,
  "TIMING_FUNCTION": 10,
  "URL": 11,
};

/**
 * All cubic-bezier CSS timing-function names.
 */
exports.BEZIER_KEYWORDS = ["linear", "ease-in-out", "ease-in", "ease-out", "ease"];

/**
 * Functions that accept a color argument.
 */
exports.COLOR_TAKING_FUNCTIONS = ["linear-gradient", "-moz-linear-gradient",
                                  "repeating-linear-gradient",
                                  "-moz-repeating-linear-gradient", "radial-gradient",
                                  "-moz-radial-gradient", "repeating-radial-gradient",
                                  "-moz-repeating-radial-gradient", "drop-shadow"];

/**
 * Functions that accept an angle argument.
 */
exports.ANGLE_TAKING_FUNCTIONS = ["linear-gradient", "-moz-linear-gradient",
                                  "repeating-linear-gradient",
                                  "-moz-repeating-linear-gradient", "rotate", "rotateX",
                                  "rotateY", "rotateZ", "rotate3d", "skew", "skewX",
                                  "skewY", "hue-rotate"];

/**
 * The list of all CSS Pseudo Elements. This list can be generated from:
 *
 * let domUtils = Cc["@mozilla.org/inspector/dom-utils;1"].getService(Ci.inIDOMUtils);
 * domUtils.getCSSPseudoElementNames();
 */
exports.PSEUDO_ELEMENTS = [":after", ":before", ":backdrop", ":first-letter",
                           ":first-line", ":-moz-selection", ":-moz-focus-inner",
                           ":-moz-focus-outer", ":-moz-list-bullet",
                           ":-moz-list-number", ":-moz-math-anonymous",
                           ":-moz-progress-bar", ":-moz-range-track",
                           ":-moz-range-progress", ":-moz-range-thumb",
                           ":-moz-meter-bar", ":-moz-placeholder",
                           ":-moz-color-swatch"];

/**
 * This list is generated from the output of the CssPropertiesActor. If a server
 * does not support the actor, this is loaded as a backup. This list does not
 * guarantee that the server actually supports these CSS properties.
 */
exports.CSS_PROPERTIES = {
  "align-content": {
    isInherited: false,
    supports: []
  },
  "align-items": {
    isInherited: false,
    supports: []
  },
  "align-self": {
    isInherited: false,
    supports: []
  },
  "animation-delay": {
    isInherited: false,
    supports: [9]
  },
  "animation-direction": {
    isInherited: false,
    supports: []
  },
  "animation-duration": {
    isInherited: false,
    supports: [9]
  },
  "animation-fill-mode": {
    isInherited: false,
    supports: []
  },
  "animation-iteration-count": {
    isInherited: false,
    supports: [7]
  },
  "animation-name": {
    isInherited: false,
    supports: []
  },
  "animation-play-state": {
    isInherited: false,
    supports: []
  },
  "animation-timing-function": {
    isInherited: false,
    supports: [10]
  },
  "-moz-appearance": {
    isInherited: false,
    supports: []
  },
  "backface-visibility": {
    isInherited: false,
    supports: []
  },
  "background-attachment": {
    isInherited: false,
    supports: []
  },
  "background-blend-mode": {
    isInherited: false,
    supports: []
  },
  "background-clip": {
    isInherited: false,
    supports: []
  },
  "background-color": {
    isInherited: false,
    supports: [2]
  },
  "background-image": {
    isInherited: false,
    supports: [4, 5, 11]
  },
  "background-origin": {
    isInherited: false,
    supports: []
  },
  "background-position-x": {
    isInherited: false,
    supports: []
  },
  "background-position-y": {
    isInherited: false,
    supports: []
  },
  "background-repeat": {
    isInherited: false,
    supports: []
  },
  "background-size": {
    isInherited: false,
    supports: [6, 8]
  },
  "-moz-binding": {
    isInherited: false,
    supports: [11]
  },
  "block-size": {
    isInherited: false,
    supports: [6, 8]
  },
  "border-block-end-color": {
    isInherited: false,
    supports: [2]
  },
  "border-block-end-style": {
    isInherited: false,
    supports: []
  },
  "border-block-end-width": {
    isInherited: false,
    supports: [6]
  },
  "border-block-start-color": {
    isInherited: false,
    supports: [2]
  },
  "border-block-start-style": {
    isInherited: false,
    supports: []
  },
  "border-block-start-width": {
    isInherited: false,
    supports: [6]
  },
  "border-bottom-color": {
    isInherited: false,
    supports: [2]
  },
  "-moz-border-bottom-colors": {
    isInherited: false,
    supports: [2]
  },
  "border-bottom-left-radius": {
    isInherited: false,
    supports: [6, 8]
  },
  "border-bottom-right-radius": {
    isInherited: false,
    supports: [6, 8]
  },
  "border-bottom-style": {
    isInherited: false,
    supports: []
  },
  "border-bottom-width": {
    isInherited: false,
    supports: [6]
  },
  "border-collapse": {
    isInherited: true,
    supports: []
  },
  "border-image-outset": {
    isInherited: false,
    supports: [6, 7]
  },
  "border-image-repeat": {
    isInherited: false,
    supports: []
  },
  "border-image-slice": {
    isInherited: false,
    supports: [7, 8]
  },
  "border-image-source": {
    isInherited: false,
    supports: [4, 5, 11]
  },
  "border-image-width": {
    isInherited: false,
    supports: [6, 7, 8]
  },
  "border-inline-end-color": {
    isInherited: false,
    supports: [2]
  },
  "border-inline-end-style": {
    isInherited: false,
    supports: []
  },
  "border-inline-end-width": {
    isInherited: false,
    supports: [6]
  },
  "border-inline-start-color": {
    isInherited: false,
    supports: [2]
  },
  "border-inline-start-style": {
    isInherited: false,
    supports: []
  },
  "border-inline-start-width": {
    isInherited: false,
    supports: [6]
  },
  "border-left-color": {
    isInherited: false,
    supports: [2]
  },
  "-moz-border-left-colors": {
    isInherited: false,
    supports: [2]
  },
  "border-left-style": {
    isInherited: false,
    supports: []
  },
  "border-left-width": {
    isInherited: false,
    supports: [6]
  },
  "border-right-color": {
    isInherited: false,
    supports: [2]
  },
  "-moz-border-right-colors": {
    isInherited: false,
    supports: [2]
  },
  "border-right-style": {
    isInherited: false,
    supports: []
  },
  "border-right-width": {
    isInherited: false,
    supports: [6]
  },
  "border-spacing": {
    isInherited: true,
    supports: [6]
  },
  "border-top-color": {
    isInherited: false,
    supports: [2]
  },
  "-moz-border-top-colors": {
    isInherited: false,
    supports: [2]
  },
  "border-top-left-radius": {
    isInherited: false,
    supports: [6, 8]
  },
  "border-top-right-radius": {
    isInherited: false,
    supports: [6, 8]
  },
  "border-top-style": {
    isInherited: false,
    supports: []
  },
  "border-top-width": {
    isInherited: false,
    supports: [6]
  },
  "bottom": {
    isInherited: false,
    supports: [6, 8]
  },
  "-moz-box-align": {
    isInherited: false,
    supports: []
  },
  "box-decoration-break": {
    isInherited: false,
    supports: []
  },
  "-moz-box-direction": {
    isInherited: false,
    supports: []
  },
  "-moz-box-flex": {
    isInherited: false,
    supports: [7]
  },
  "-moz-box-ordinal-group": {
    isInherited: false,
    supports: [7]
  },
  "-moz-box-orient": {
    isInherited: false,
    supports: []
  },
  "-moz-box-pack": {
    isInherited: false,
    supports: []
  },
  "box-shadow": {
    isInherited: false,
    supports: [2, 6]
  },
  "box-sizing": {
    isInherited: false,
    supports: []
  },
  "caption-side": {
    isInherited: true,
    supports: []
  },
  "clear": {
    isInherited: false,
    supports: []
  },
  "clip": {
    isInherited: false,
    supports: []
  },
  "clip-path": {
    isInherited: false,
    supports: [11]
  },
  "clip-rule": {
    isInherited: true,
    supports: []
  },
  "color": {
    isInherited: true,
    supports: [2]
  },
  "color-adjust": {
    isInherited: true,
    supports: []
  },
  "color-interpolation": {
    isInherited: true,
    supports: []
  },
  "color-interpolation-filters": {
    isInherited: true,
    supports: []
  },
  "-moz-column-count": {
    isInherited: false,
    supports: [7]
  },
  "-moz-column-fill": {
    isInherited: false,
    supports: []
  },
  "-moz-column-gap": {
    isInherited: false,
    supports: [6]
  },
  "-moz-column-rule-color": {
    isInherited: false,
    supports: [2]
  },
  "-moz-column-rule-style": {
    isInherited: false,
    supports: []
  },
  "-moz-column-rule-width": {
    isInherited: false,
    supports: [6]
  },
  "-moz-column-width": {
    isInherited: false,
    supports: [6]
  },
  "content": {
    isInherited: false,
    supports: [11]
  },
  "-moz-control-character-visibility": {
    isInherited: true,
    supports: []
  },
  "counter-increment": {
    isInherited: false,
    supports: []
  },
  "counter-reset": {
    isInherited: false,
    supports: []
  },
  "cursor": {
    isInherited: true,
    supports: [11]
  },
  "direction": {
    isInherited: true,
    supports: []
  },
  "display": {
    isInherited: false,
    supports: []
  },
  "dominant-baseline": {
    isInherited: false,
    supports: []
  },
  "empty-cells": {
    isInherited: true,
    supports: []
  },
  "fill": {
    isInherited: true,
    supports: [2, 11]
  },
  "fill-opacity": {
    isInherited: true,
    supports: [7]
  },
  "fill-rule": {
    isInherited: true,
    supports: []
  },
  "filter": {
    isInherited: false,
    supports: [11]
  },
  "flex-basis": {
    isInherited: false,
    supports: [6, 8]
  },
  "flex-direction": {
    isInherited: false,
    supports: []
  },
  "flex-grow": {
    isInherited: false,
    supports: [7]
  },
  "flex-shrink": {
    isInherited: false,
    supports: [7]
  },
  "flex-wrap": {
    isInherited: false,
    supports: []
  },
  "float": {
    isInherited: false,
    supports: []
  },
  "-moz-float-edge": {
    isInherited: false,
    supports: []
  },
  "flood-color": {
    isInherited: false,
    supports: [2]
  },
  "flood-opacity": {
    isInherited: false,
    supports: [7]
  },
  "font-family": {
    isInherited: true,
    supports: []
  },
  "font-feature-settings": {
    isInherited: true,
    supports: []
  },
  "font-kerning": {
    isInherited: true,
    supports: []
  },
  "font-language-override": {
    isInherited: true,
    supports: []
  },
  "font-size": {
    isInherited: true,
    supports: [6, 8]
  },
  "font-size-adjust": {
    isInherited: true,
    supports: [7]
  },
  "font-stretch": {
    isInherited: true,
    supports: []
  },
  "font-style": {
    isInherited: true,
    supports: []
  },
  "font-synthesis": {
    isInherited: true,
    supports: []
  },
  "font-variant-alternates": {
    isInherited: true,
    supports: []
  },
  "font-variant-caps": {
    isInherited: true,
    supports: []
  },
  "font-variant-east-asian": {
    isInherited: true,
    supports: []
  },
  "font-variant-ligatures": {
    isInherited: true,
    supports: []
  },
  "font-variant-numeric": {
    isInherited: true,
    supports: []
  },
  "font-variant-position": {
    isInherited: true,
    supports: []
  },
  "font-weight": {
    isInherited: true,
    supports: [7]
  },
  "-moz-force-broken-image-icon": {
    isInherited: false,
    supports: [7]
  },
  "grid-auto-columns": {
    isInherited: false,
    supports: [6, 8]
  },
  "grid-auto-flow": {
    isInherited: false,
    supports: []
  },
  "grid-auto-rows": {
    isInherited: false,
    supports: [6, 8]
  },
  "grid-column-end": {
    isInherited: false,
    supports: [7]
  },
  "grid-column-gap": {
    isInherited: false,
    supports: [6]
  },
  "grid-column-start": {
    isInherited: false,
    supports: [7]
  },
  "grid-row-end": {
    isInherited: false,
    supports: [7]
  },
  "grid-row-gap": {
    isInherited: false,
    supports: [6]
  },
  "grid-row-start": {
    isInherited: false,
    supports: [7]
  },
  "grid-template-areas": {
    isInherited: false,
    supports: []
  },
  "grid-template-columns": {
    isInherited: false,
    supports: [6, 8]
  },
  "grid-template-rows": {
    isInherited: false,
    supports: [6, 8]
  },
  "height": {
    isInherited: false,
    supports: [6, 8]
  },
  "hyphens": {
    isInherited: true,
    supports: []
  },
  "image-orientation": {
    isInherited: true,
    supports: [1]
  },
  "-moz-image-region": {
    isInherited: true,
    supports: []
  },
  "image-rendering": {
    isInherited: true,
    supports: []
  },
  "ime-mode": {
    isInherited: false,
    supports: []
  },
  "inline-size": {
    isInherited: false,
    supports: [6, 8]
  },
  "isolation": {
    isInherited: false,
    supports: []
  },
  "justify-content": {
    isInherited: false,
    supports: []
  },
  "justify-items": {
    isInherited: false,
    supports: []
  },
  "justify-self": {
    isInherited: false,
    supports: []
  },
  "left": {
    isInherited: false,
    supports: [6, 8]
  },
  "letter-spacing": {
    isInherited: true,
    supports: [6]
  },
  "lighting-color": {
    isInherited: false,
    supports: [2]
  },
  "line-height": {
    isInherited: true,
    supports: [6, 7, 8]
  },
  "list-style-image": {
    isInherited: true,
    supports: [11]
  },
  "list-style-position": {
    isInherited: true,
    supports: []
  },
  "list-style-type": {
    isInherited: true,
    supports: []
  },
  "margin-block-end": {
    isInherited: false,
    supports: [6, 8]
  },
  "margin-block-start": {
    isInherited: false,
    supports: [6, 8]
  },
  "margin-bottom": {
    isInherited: false,
    supports: [6, 8]
  },
  "margin-inline-end": {
    isInherited: false,
    supports: [6, 8]
  },
  "margin-inline-start": {
    isInherited: false,
    supports: [6, 8]
  },
  "margin-left": {
    isInherited: false,
    supports: [6, 8]
  },
  "margin-right": {
    isInherited: false,
    supports: [6, 8]
  },
  "margin-top": {
    isInherited: false,
    supports: [6, 8]
  },
  "marker-end": {
    isInherited: true,
    supports: [11]
  },
  "marker-mid": {
    isInherited: true,
    supports: [11]
  },
  "marker-offset": {
    isInherited: false,
    supports: [6]
  },
  "marker-start": {
    isInherited: true,
    supports: [11]
  },
  "mask": {
    isInherited: false,
    supports: [11]
  },
  "mask-type": {
    isInherited: false,
    supports: []
  },
  "max-block-size": {
    isInherited: false,
    supports: [6, 8]
  },
  "max-height": {
    isInherited: false,
    supports: [6, 8]
  },
  "max-inline-size": {
    isInherited: false,
    supports: [6, 8]
  },
  "max-width": {
    isInherited: false,
    supports: [6, 8]
  },
  "min-block-size": {
    isInherited: false,
    supports: [6, 8]
  },
  "min-height": {
    isInherited: false,
    supports: [6, 8]
  },
  "min-inline-size": {
    isInherited: false,
    supports: [6, 8]
  },
  "min-width": {
    isInherited: false,
    supports: [6, 8]
  },
  "mix-blend-mode": {
    isInherited: false,
    supports: []
  },
  "object-fit": {
    isInherited: false,
    supports: []
  },
  "object-position": {
    isInherited: false,
    supports: [6, 8]
  },
  "offset-block-end": {
    isInherited: false,
    supports: [6, 8]
  },
  "offset-block-start": {
    isInherited: false,
    supports: [6, 8]
  },
  "offset-inline-end": {
    isInherited: false,
    supports: [6, 8]
  },
  "offset-inline-start": {
    isInherited: false,
    supports: [6, 8]
  },
  "opacity": {
    isInherited: false,
    supports: [7]
  },
  "order": {
    isInherited: false,
    supports: [7]
  },
  "-moz-orient": {
    isInherited: false,
    supports: []
  },
  "-moz-osx-font-smoothing": {
    isInherited: true,
    supports: []
  },
  "outline-color": {
    isInherited: false,
    supports: [2]
  },
  "outline-offset": {
    isInherited: false,
    supports: [6]
  },
  "-moz-outline-radius-bottomleft": {
    isInherited: false,
    supports: [6, 8]
  },
  "-moz-outline-radius-bottomright": {
    isInherited: false,
    supports: [6, 8]
  },
  "-moz-outline-radius-topleft": {
    isInherited: false,
    supports: [6, 8]
  },
  "-moz-outline-radius-topright": {
    isInherited: false,
    supports: [6, 8]
  },
  "outline-style": {
    isInherited: false,
    supports: []
  },
  "outline-width": {
    isInherited: false,
    supports: [6]
  },
  "overflow-x": {
    isInherited: false,
    supports: []
  },
  "overflow-y": {
    isInherited: false,
    supports: []
  },
  "padding-block-end": {
    isInherited: false,
    supports: [6, 8]
  },
  "padding-block-start": {
    isInherited: false,
    supports: [6, 8]
  },
  "padding-bottom": {
    isInherited: false,
    supports: [6, 8]
  },
  "padding-inline-end": {
    isInherited: false,
    supports: [6, 8]
  },
  "padding-inline-start": {
    isInherited: false,
    supports: [6, 8]
  },
  "padding-left": {
    isInherited: false,
    supports: [6, 8]
  },
  "padding-right": {
    isInherited: false,
    supports: [6, 8]
  },
  "padding-top": {
    isInherited: false,
    supports: [6, 8]
  },
  "page-break-after": {
    isInherited: false,
    supports: []
  },
  "page-break-before": {
    isInherited: false,
    supports: []
  },
  "page-break-inside": {
    isInherited: false,
    supports: []
  },
  "paint-order": {
    isInherited: true,
    supports: []
  },
  "perspective": {
    isInherited: false,
    supports: [6]
  },
  "perspective-origin": {
    isInherited: false,
    supports: [6, 8]
  },
  "pointer-events": {
    isInherited: true,
    supports: []
  },
  "position": {
    isInherited: false,
    supports: []
  },
  "quotes": {
    isInherited: true,
    supports: []
  },
  "resize": {
    isInherited: false,
    supports: []
  },
  "right": {
    isInherited: false,
    supports: [6, 8]
  },
  "ruby-align": {
    isInherited: true,
    supports: []
  },
  "ruby-position": {
    isInherited: true,
    supports: []
  },
  "scroll-behavior": {
    isInherited: false,
    supports: []
  },
  "scroll-snap-coordinate": {
    isInherited: false,
    supports: [6, 8]
  },
  "scroll-snap-destination": {
    isInherited: false,
    supports: [6, 8]
  },
  "scroll-snap-points-x": {
    isInherited: false,
    supports: []
  },
  "scroll-snap-points-y": {
    isInherited: false,
    supports: []
  },
  "scroll-snap-type-x": {
    isInherited: false,
    supports: []
  },
  "scroll-snap-type-y": {
    isInherited: false,
    supports: []
  },
  "shape-rendering": {
    isInherited: true,
    supports: []
  },
  "-moz-stack-sizing": {
    isInherited: false,
    supports: []
  },
  "stop-color": {
    isInherited: false,
    supports: [2]
  },
  "stop-opacity": {
    isInherited: false,
    supports: [7]
  },
  "stroke": {
    isInherited: true,
    supports: [2, 11]
  },
  "stroke-dasharray": {
    isInherited: true,
    supports: [6, 7, 8]
  },
  "stroke-dashoffset": {
    isInherited: true,
    supports: [6, 7, 8]
  },
  "stroke-linecap": {
    isInherited: true,
    supports: []
  },
  "stroke-linejoin": {
    isInherited: true,
    supports: []
  },
  "stroke-miterlimit": {
    isInherited: true,
    supports: [7]
  },
  "stroke-opacity": {
    isInherited: true,
    supports: [7]
  },
  "stroke-width": {
    isInherited: true,
    supports: [6, 7, 8]
  },
  "-moz-tab-size": {
    isInherited: true,
    supports: [7]
  },
  "table-layout": {
    isInherited: false,
    supports: []
  },
  "text-align": {
    isInherited: true,
    supports: []
  },
  "text-align-last": {
    isInherited: true,
    supports: []
  },
  "text-anchor": {
    isInherited: true,
    supports: []
  },
  "text-combine-upright": {
    isInherited: true,
    supports: []
  },
  "text-decoration-color": {
    isInherited: false,
    supports: [2]
  },
  "text-decoration-line": {
    isInherited: false,
    supports: []
  },
  "text-decoration-style": {
    isInherited: false,
    supports: []
  },
  "text-emphasis-color": {
    isInherited: true,
    supports: [2]
  },
  "text-emphasis-position": {
    isInherited: true,
    supports: []
  },
  "text-emphasis-style": {
    isInherited: true,
    supports: []
  },
  "-webkit-text-fill-color": {
    isInherited: true,
    supports: [2]
  },
  "text-indent": {
    isInherited: true,
    supports: [6, 8]
  },
  "text-orientation": {
    isInherited: true,
    supports: []
  },
  "text-overflow": {
    isInherited: false,
    supports: []
  },
  "text-rendering": {
    isInherited: true,
    supports: []
  },
  "text-shadow": {
    isInherited: true,
    supports: [2, 6]
  },
  "-moz-text-size-adjust": {
    isInherited: true,
    supports: []
  },
  "-webkit-text-stroke-color": {
    isInherited: true,
    supports: [2]
  },
  "-webkit-text-stroke-width": {
    isInherited: true,
    supports: [6]
  },
  "text-transform": {
    isInherited: true,
    supports: []
  },
  "top": {
    isInherited: false,
    supports: [6, 8]
  },
  "transform": {
    isInherited: false,
    supports: []
  },
  "transform-box": {
    isInherited: false,
    supports: []
  },
  "transform-origin": {
    isInherited: false,
    supports: [6, 8]
  },
  "transform-style": {
    isInherited: false,
    supports: []
  },
  "transition-delay": {
    isInherited: false,
    supports: [9]
  },
  "transition-duration": {
    isInherited: false,
    supports: [9]
  },
  "transition-property": {
    isInherited: false,
    supports: []
  },
  "transition-timing-function": {
    isInherited: false,
    supports: [10]
  },
  "unicode-bidi": {
    isInherited: false,
    supports: []
  },
  "-moz-user-focus": {
    isInherited: true,
    supports: []
  },
  "-moz-user-input": {
    isInherited: true,
    supports: []
  },
  "-moz-user-modify": {
    isInherited: true,
    supports: []
  },
  "-moz-user-select": {
    isInherited: false,
    supports: []
  },
  "vector-effect": {
    isInherited: false,
    supports: []
  },
  "vertical-align": {
    isInherited: false,
    supports: [6, 8]
  },
  "visibility": {
    isInherited: true,
    supports: []
  },
  "white-space": {
    isInherited: true,
    supports: []
  },
  "width": {
    isInherited: false,
    supports: [6, 8]
  },
  "will-change": {
    isInherited: false,
    supports: []
  },
  "-moz-window-dragging": {
    isInherited: false,
    supports: []
  },
  "word-break": {
    isInherited: true,
    supports: []
  },
  "word-spacing": {
    isInherited: true,
    supports: [6, 8]
  },
  "overflow-wrap": {
    isInherited: true,
    supports: []
  },
  "writing-mode": {
    isInherited: true,
    supports: []
  },
  "z-index": {
    isInherited: false,
    supports: [7]
  },
  "all": {
    isInherited: false,
    supports: [1, 2, 4, 5, 6, 7, 8, 9, 10, 11]
  },
  "animation": {
    isInherited: false,
    supports: [7, 9, 10]
  },
  "background": {
    isInherited: false,
    supports: [2, 4, 5, 6, 8, 11]
  },
  "background-position": {
    isInherited: false,
    supports: [6, 8]
  },
  "border": {
    isInherited: false,
    supports: [2, 6]
  },
  "border-block-end": {
    isInherited: false,
    supports: [2, 6]
  },
  "border-block-start": {
    isInherited: false,
    supports: [2, 6]
  },
  "border-bottom": {
    isInherited: false,
    supports: [2, 6]
  },
  "border-color": {
    isInherited: false,
    supports: [2]
  },
  "border-image": {
    isInherited: false,
    supports: [4, 5, 6, 7, 8, 11]
  },
  "border-inline-end": {
    isInherited: false,
    supports: [2, 6]
  },
  "border-inline-start": {
    isInherited: false,
    supports: [2, 6]
  },
  "border-left": {
    isInherited: false,
    supports: [2, 6]
  },
  "border-radius": {
    isInherited: false,
    supports: [6, 8]
  },
  "border-right": {
    isInherited: false,
    supports: [2, 6]
  },
  "border-style": {
    isInherited: false,
    supports: []
  },
  "border-top": {
    isInherited: false,
    supports: [2, 6]
  },
  "border-width": {
    isInherited: false,
    supports: [6]
  },
  "-moz-column-rule": {
    isInherited: false,
    supports: [2, 6]
  },
  "-moz-columns": {
    isInherited: false,
    supports: [6, 7]
  },
  "flex": {
    isInherited: false,
    supports: [6, 7, 8]
  },
  "flex-flow": {
    isInherited: false,
    supports: []
  },
  "font": {
    isInherited: true,
    supports: [6, 7, 8]
  },
  "font-variant": {
    isInherited: true,
    supports: []
  },
  "grid": {
    isInherited: false,
    supports: [6, 8]
  },
  "grid-area": {
    isInherited: false,
    supports: [7]
  },
  "grid-column": {
    isInherited: false,
    supports: [7]
  },
  "grid-gap": {
    isInherited: false,
    supports: [6]
  },
  "grid-row": {
    isInherited: false,
    supports: [7]
  },
  "grid-template": {
    isInherited: false,
    supports: [6, 8]
  },
  "list-style": {
    isInherited: true,
    supports: [11]
  },
  "margin": {
    isInherited: false,
    supports: [6, 8]
  },
  "marker": {
    isInherited: true,
    supports: [11]
  },
  "outline": {
    isInherited: false,
    supports: [2, 6]
  },
  "-moz-outline-radius": {
    isInherited: false,
    supports: [6, 8]
  },
  "overflow": {
    isInherited: false,
    supports: []
  },
  "padding": {
    isInherited: false,
    supports: [6, 8]
  },
  "scroll-snap-type": {
    isInherited: false,
    supports: []
  },
  "text-decoration": {
    isInherited: false,
    supports: [2]
  },
  "text-emphasis": {
    isInherited: true,
    supports: [2]
  },
  "-webkit-text-stroke": {
    isInherited: true,
    supports: [2, 6]
  },
  "-moz-transform": {
    isInherited: false,
    supports: []
  },
  "transition": {
    isInherited: false,
    supports: [9, 10]
  },
  "word-wrap": {
    isInherited: true,
    supports: []
  },
  "-moz-transform-origin": {
    isInherited: false,
    supports: [6, 8]
  },
  "-moz-perspective-origin": {
    isInherited: false,
    supports: [6, 8]
  },
  "-moz-perspective": {
    isInherited: false,
    supports: [6]
  },
  "-moz-transform-style": {
    isInherited: false,
    supports: []
  },
  "-moz-backface-visibility": {
    isInherited: false,
    supports: []
  },
  "-moz-border-image": {
    isInherited: false,
    supports: [4, 5, 6, 7, 8, 11]
  },
  "-moz-transition": {
    isInherited: false,
    supports: [9, 10]
  },
  "-moz-transition-delay": {
    isInherited: false,
    supports: [9]
  },
  "-moz-transition-duration": {
    isInherited: false,
    supports: [9]
  },
  "-moz-transition-property": {
    isInherited: false,
    supports: []
  },
  "-moz-transition-timing-function": {
    isInherited: false,
    supports: [10]
  },
  "-moz-animation": {
    isInherited: false,
    supports: [7, 9, 10]
  },
  "-moz-animation-delay": {
    isInherited: false,
    supports: [9]
  },
  "-moz-animation-direction": {
    isInherited: false,
    supports: []
  },
  "-moz-animation-duration": {
    isInherited: false,
    supports: [9]
  },
  "-moz-animation-fill-mode": {
    isInherited: false,
    supports: []
  },
  "-moz-animation-iteration-count": {
    isInherited: false,
    supports: [7]
  },
  "-moz-animation-name": {
    isInherited: false,
    supports: []
  },
  "-moz-animation-play-state": {
    isInherited: false,
    supports: []
  },
  "-moz-animation-timing-function": {
    isInherited: false,
    supports: [10]
  },
  "-moz-box-sizing": {
    isInherited: false,
    supports: []
  },
  "-moz-font-feature-settings": {
    isInherited: true,
    supports: []
  },
  "-moz-font-language-override": {
    isInherited: true,
    supports: []
  },
  "-moz-padding-end": {
    isInherited: false,
    supports: [6, 8]
  },
  "-moz-padding-start": {
    isInherited: false,
    supports: [6, 8]
  },
  "-moz-margin-end": {
    isInherited: false,
    supports: [6, 8]
  },
  "-moz-margin-start": {
    isInherited: false,
    supports: [6, 8]
  },
  "-moz-border-end": {
    isInherited: false,
    supports: [2, 6]
  },
  "-moz-border-end-color": {
    isInherited: false,
    supports: [2]
  },
  "-moz-border-end-style": {
    isInherited: false,
    supports: []
  },
  "-moz-border-end-width": {
    isInherited: false,
    supports: [6]
  },
  "-moz-border-start": {
    isInherited: false,
    supports: [2, 6]
  },
  "-moz-border-start-color": {
    isInherited: false,
    supports: [2]
  },
  "-moz-border-start-style": {
    isInherited: false,
    supports: []
  },
  "-moz-border-start-width": {
    isInherited: false,
    supports: [6]
  },
  "-moz-hyphens": {
    isInherited: true,
    supports: []
  },
  "-moz-text-align-last": {
    isInherited: true,
    supports: []
  },
  "-webkit-animation": {
    isInherited: false,
    supports: [7, 9, 10]
  },
  "-webkit-animation-delay": {
    isInherited: false,
    supports: [9]
  },
  "-webkit-animation-direction": {
    isInherited: false,
    supports: []
  },
  "-webkit-animation-duration": {
    isInherited: false,
    supports: [9]
  },
  "-webkit-animation-fill-mode": {
    isInherited: false,
    supports: []
  },
  "-webkit-animation-iteration-count": {
    isInherited: false,
    supports: [7]
  },
  "-webkit-animation-name": {
    isInherited: false,
    supports: []
  },
  "-webkit-animation-play-state": {
    isInherited: false,
    supports: []
  },
  "-webkit-animation-timing-function": {
    isInherited: false,
    supports: [10]
  },
  "-webkit-filter": {
    isInherited: false,
    supports: [11]
  },
  "-webkit-text-size-adjust": {
    isInherited: true,
    supports: []
  },
  "-webkit-transform": {
    isInherited: false,
    supports: []
  },
  "-webkit-transform-origin": {
    isInherited: false,
    supports: [6, 8]
  },
  "-webkit-transform-style": {
    isInherited: false,
    supports: []
  },
  "-webkit-backface-visibility": {
    isInherited: false,
    supports: []
  },
  "-webkit-perspective": {
    isInherited: false,
    supports: [6]
  },
  "-webkit-perspective-origin": {
    isInherited: false,
    supports: [6, 8]
  },
  "-webkit-transition": {
    isInherited: false,
    supports: [9, 10]
  },
  "-webkit-transition-delay": {
    isInherited: false,
    supports: [9]
  },
  "-webkit-transition-duration": {
    isInherited: false,
    supports: [9]
  },
  "-webkit-transition-property": {
    isInherited: false,
    supports: []
  },
  "-webkit-transition-timing-function": {
    isInherited: false,
    supports: [10]
  },
  "-webkit-border-radius": {
    isInherited: false,
    supports: [6, 8]
  },
  "-webkit-border-top-left-radius": {
    isInherited: false,
    supports: [6, 8]
  },
  "-webkit-border-top-right-radius": {
    isInherited: false,
    supports: [6, 8]
  },
  "-webkit-border-bottom-left-radius": {
    isInherited: false,
    supports: [6, 8]
  },
  "-webkit-border-bottom-right-radius": {
    isInherited: false,
    supports: [6, 8]
  },
  "-webkit-background-clip": {
    isInherited: false,
    supports: []
  },
  "-webkit-background-origin": {
    isInherited: false,
    supports: []
  },
  "-webkit-background-size": {
    isInherited: false,
    supports: [6, 8]
  },
  "-webkit-border-image": {
    isInherited: false,
    supports: [4, 5, 6, 7, 8, 11]
  },
  "-webkit-box-shadow": {
    isInherited: false,
    supports: [2, 6]
  },
  "-webkit-box-sizing": {
    isInherited: false,
    supports: []
  },
  "-webkit-box-flex": {
    isInherited: false,
    supports: [7]
  },
  "-webkit-box-ordinal-group": {
    isInherited: false,
    supports: [7]
  },
  "-webkit-box-orient": {
    isInherited: false,
    supports: []
  },
  "-webkit-box-direction": {
    isInherited: false,
    supports: []
  },
  "-webkit-box-align": {
    isInherited: false,
    supports: []
  },
  "-webkit-box-pack": {
    isInherited: false,
    supports: []
  },
  "-webkit-flex-direction": {
    isInherited: false,
    supports: []
  },
  "-webkit-flex-wrap": {
    isInherited: false,
    supports: []
  },
  "-webkit-flex-flow": {
    isInherited: false,
    supports: []
  },
  "-webkit-order": {
    isInherited: false,
    supports: [7]
  },
  "-webkit-flex": {
    isInherited: false,
    supports: [6, 7, 8]
  },
  "-webkit-flex-grow": {
    isInherited: false,
    supports: [7]
  },
  "-webkit-flex-shrink": {
    isInherited: false,
    supports: [7]
  },
  "-webkit-flex-basis": {
    isInherited: false,
    supports: [6, 8]
  },
  "-webkit-justify-content": {
    isInherited: false,
    supports: []
  },
  "-webkit-align-items": {
    isInherited: false,
    supports: []
  },
  "-webkit-align-self": {
    isInherited: false,
    supports: []
  },
  "-webkit-align-content": {
    isInherited: false,
    supports: []
  },
  "-webkit-user-select": {
    isInherited: false,
    supports: []
  }
};

exports.CSS_PROPERTIES_DB = {
  properties: exports.CSS_PROPERTIES,
  pseudoElements: exports.PSEUDO_ELEMENTS
};
