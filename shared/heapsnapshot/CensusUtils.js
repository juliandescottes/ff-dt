/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
"use strict";

const { flatten } = require("resource://devtools/shared/ThreadSafeDevToolsUtils.js");

/** * Visitor ****************************************************************/

/**
 * A Visitor visits each node and edge of a census report tree as the census
 * report is being traversed by `walk`.
 */
function Visitor() { }
exports.Visitor = Visitor;

/**
 * The `enter` method is called when a new sub-report is entered in traversal.
 *
 * @param {Object} breakdown
 *        The breakdown for the sub-report that is being entered by traversal.
 *
 * @param {Object} report
 *        The report generated by the given breakdown.
 *
 * @param {any} edge
 *        The edge leading to this sub-report. The edge is null if (but not iff!
 *        eg, null allocation stack edges) we are entering the root report.
 */
Visitor.prototype.enter = function (breakdown, report, edge) { };

/**
 * The `exit` method is called when traversal of a sub-report has finished.
 *
 * @param {Object} breakdown
 *        The breakdown for the sub-report whose traversal has finished.
 *
 * @param {Object} report
 *        The report generated by the given breakdown.
 *
 * @param {any} edge
 *        The edge leading to this sub-report. The edge is null if (but not iff!
 *        eg, null allocation stack edges) we are entering the root report.
 */
Visitor.prototype.exit = function (breakdown, report, edge) { };

/**
 * The `count` method is called when leaf nodes (reports whose breakdown is
 * by: "count") in the report tree are encountered.
 *
 * @param {Object} breakdown
 *        The count breakdown for this report.
 *
 * @param {Object} report
 *        The report generated by a breakdown by "count".
 *
 * @param {any|null} edge
 *        The edge leading to this count report. The edge is null if we are
 *        entering the root report.
 */
Visitor.prototype.count = function (breakdown, report, edge) { };

/** * getReportEdges *********************************************************/

const EDGES = Object.create(null);

EDGES.count = function (breakdown, report) {
  return [];
};

EDGES.bucket = function (breakdown, report) {
  return [];
};

EDGES.internalType = function (breakdown, report) {
  return Object.keys(report).map(key => ({
    edge: key,
    referent: report[key],
    breakdown: breakdown.then
  }));
};

EDGES.objectClass = function (breakdown, report) {
  return Object.keys(report).map(key => ({
    edge: key,
    referent: report[key],
    breakdown: key === "other" ? breakdown.other : breakdown.then
  }));
};

EDGES.coarseType = function (breakdown, report) {
  return [
    { edge: "objects", referent: report.objects, breakdown: breakdown.objects },
    { edge: "scripts", referent: report.scripts, breakdown: breakdown.scripts },
    { edge: "strings", referent: report.strings, breakdown: breakdown.strings },
    { edge: "other", referent: report.other, breakdown: breakdown.other },
  ];
};

EDGES.allocationStack = function (breakdown, report) {
  const edges = [];
  report.forEach((value, key) => {
    edges.push({
      edge: key,
      referent: value,
      breakdown: key === "noStack" ? breakdown.noStack : breakdown.then
    });
  });
  return edges;
};

EDGES.filename = function (breakdown, report) {
  return Object.keys(report).map(key => ({
    edge: key,
    referent: report[key],
    breakdown: key === "noFilename" ? breakdown.noFilename : breakdown.then
  }));
};

/**
 * Get the set of outgoing edges from `report` as specified by the given
 * breakdown.
 *
 * @param {Object} breakdown
 *        The census breakdown.
 *
 * @param {Object} report
 *        The census report.
 */
function getReportEdges(breakdown, report) {
  return EDGES[breakdown.by](breakdown, report);
}
exports.getReportEdges = getReportEdges;

/** * walk *******************************************************************/

function recursiveWalk(breakdown, edge, report, visitor) {
  if (breakdown.by === "count") {
    visitor.enter(breakdown, report, edge);
    visitor.count(breakdown, report, edge);
    visitor.exit(breakdown, report, edge);
  } else {
    visitor.enter(breakdown, report, edge);
    for (let { edge: ed, referent, breakdown: subBreakdown }
      of getReportEdges(breakdown, report)) {
      recursiveWalk(subBreakdown, ed, referent, visitor);
    }
    visitor.exit(breakdown, report, edge);
  }
}

/**
 * Walk the given `report` that was generated by taking a census with the
 * specified `breakdown`.
 *
 * @param {Object} breakdown
 *        The census breakdown.
 *
 * @param {Object} report
 *        The census report.
 *
 * @param {Visitor} visitor
 *        The Visitor instance to call into while traversing.
 */
function walk(breakdown, report, visitor) {
  recursiveWalk(breakdown, null, report, visitor);
}
exports.walk = walk;

/** * diff *******************************************************************/

/**
 * Return true if the object is a Map, false otherwise. Works with Map objects
 * from other globals, unlike `instanceof`.
 *
 * @returns {Boolean}
 */
function isMap(obj) {
  return Object.prototype.toString.call(obj) === "[object Map]";
}

/**
 * A Visitor for computing the difference between the census report being
 * traversed and the given other census.
 *
 * @param {Object} otherCensus
 *        The other census report.
 */
function DiffVisitor(otherCensus) {
  // The other census we are comparing against.
  this._otherCensus = otherCensus;

  // The total bytes and count of the basis census we are traversing.
  this._totalBytes = 0;
  this._totalCount = 0;

  // Stack maintaining the current corresponding sub-report for the other
  // census we are comparing against.
  this._otherCensusStack = [];

  // Stack maintaining the set of edges visited at each sub-report.
  this._edgesVisited = [new Set()];

  // The final delta census. Valid only after traversal.
  this._results = null;

  // Stack maintaining the results corresponding to each sub-report we are
  // currently traversing.
  this._resultsStack = [];
}

DiffVisitor.prototype = Object.create(Visitor.prototype);

/**
 * Given a report and an outgoing edge, get the edge's referent.
 */
DiffVisitor.prototype._get = function (report, edge) {
  if (!report) {
    return undefined;
  }
  return isMap(report) ? report.get(edge) : report[edge];
};

/**
 * Given a report, an outgoing edge, and a value, set the edge's referent to
 * the given value.
 */
DiffVisitor.prototype._set = function (report, edge, val) {
  if (isMap(report)) {
    report.set(edge, val);
  } else {
    report[edge] = val;
  }
};

/**
 * @overrides Visitor.prototype.enter
 */
DiffVisitor.prototype.enter = function (breakdown, report, edge) {
  const newResults = breakdown.by === "allocationStack" ? new Map() : {};
  let newOther;

  if (!this._results) {
    // This is the first time we have entered a sub-report.
    this._results = newResults;
    newOther = this._otherCensus;
  } else {
    const topResults = this._resultsStack[this._resultsStack.length - 1];
    this._set(topResults, edge, newResults);

    const topOther = this._otherCensusStack[this._otherCensusStack.length - 1];
    newOther = this._get(topOther, edge);
  }

  this._resultsStack.push(newResults);
  this._otherCensusStack.push(newOther);

  const visited = this._edgesVisited[this._edgesVisited.length - 1];
  visited.add(edge);
  this._edgesVisited.push(new Set());
};

/**
 * @overrides Visitor.prototype.exit
 */
DiffVisitor.prototype.exit = function (breakdown, report, edge) {
  // Find all the edges in the other census report that were not traversed and
  // add them to the results directly.
  const other = this._otherCensusStack[this._otherCensusStack.length - 1];
  if (other) {
    const visited = this._edgesVisited[this._edgesVisited.length - 1];
    const unvisited = getReportEdges(breakdown, other)
      .map(e => e.edge)
      .filter(e => !visited.has(e));
    const results = this._resultsStack[this._resultsStack.length - 1];
    for (let edg of unvisited) {
      this._set(results, edg, this._get(other, edg));
    }
  }

  this._otherCensusStack.pop();
  this._resultsStack.pop();
  this._edgesVisited.pop();
};

/**
 * @overrides Visitor.prototype.count
 */
DiffVisitor.prototype.count = function (breakdown, report, edge) {
  const other = this._otherCensusStack[this._otherCensusStack.length - 1];
  const results = this._resultsStack[this._resultsStack.length - 1];

  if (breakdown.count) {
    this._totalCount += report.count;
  }
  if (breakdown.bytes) {
    this._totalBytes += report.bytes;
  }

  if (other) {
    if (breakdown.count) {
      results.count = other.count - report.count;
    }
    if (breakdown.bytes) {
      results.bytes = other.bytes - report.bytes;
    }
  } else {
    if (breakdown.count) {
      results.count = -report.count;
    }
    if (breakdown.bytes) {
      results.bytes = -report.bytes;
    }
  }
};

const basisTotalBytes = exports.basisTotalBytes = Symbol("basisTotalBytes");
const basisTotalCount = exports.basisTotalCount = Symbol("basisTotalCount");

/**
 * Get the resulting report of the difference between the traversed census
 * report and the other census report.
 *
 * @returns {Object}
 *          The delta census report.
 */
DiffVisitor.prototype.results = function () {
  if (!this._results) {
    throw new Error("Attempt to get results before computing diff!");
  }

  if (this._resultsStack.length) {
    throw new Error("Attempt to get results while still computing diff!");
  }

  this._results[basisTotalBytes] = this._totalBytes;
  this._results[basisTotalCount] = this._totalCount;

  return this._results;
};

/**
 * Take the difference between two censuses. The resulting delta report
 * contains the number/size of things that are in the `endCensus` that are not
 * in the `startCensus`.
 *
 * @param {Object} breakdown
 *        The breakdown used to generate both census reports.
 *
 * @param {Object} startCensus
 *        The first census report.
 *
 * @param {Object} endCensus
 *        The second census report.
 *
 * @returns {Object}
 *          A delta report mirroring the structure of the two census reports (as
 *          specified by the given breakdown). Has two additional properties:
 *            - {Number} basisTotalBytes: the total number of bytes in the start
 *                                        census.
 *            - {Number} basisTotalCount: the total count in the start census.
 */
function diff(breakdown, startCensus, endCensus) {
  const visitor = new DiffVisitor(endCensus);
  walk(breakdown, startCensus, visitor);
  return visitor.results();
}
exports.diff = diff;

/**
 * Creates a hash map mapping node IDs to its parent node.
 *
 * @param {CensusTreeNode} node
 * @param {Object<number, TreeNode>} aggregator
 *
 * @return {Object<number, TreeNode>}
 */
const createParentMap = function (node, getId = n => n.id, aggregator = {}) {
  if (node.children) {
    for (let i = 0, length = node.children.length; i < length; i++) {
      const child = node.children[i];
      aggregator[getId(child)] = node;
      createParentMap(child, getId, aggregator);
    }
  }
  return aggregator;
};
exports.createParentMap = createParentMap;

const BUCKET = Object.freeze({ by: "bucket" });

/**
 * Convert a breakdown whose leaves are { by: "count" } to an identical
 * breakdown, except with { by: "bucket" } leaves.
 *
 * @param {Object} breakdown
 * @returns {Object}
 */
exports.countToBucketBreakdown = function (breakdown) {
  if (typeof breakdown !== "object" || !breakdown) {
    return breakdown;
  }

  if (breakdown.by === "count") {
    return BUCKET;
  }

  const keys = Object.keys(breakdown);
  const vals = keys.reduce((vs, k) => {
    vs.push(exports.countToBucketBreakdown(breakdown[k]));
    return vs;
  }, []);

  const result = {};
  for (let i = 0, length = keys.length; i < length; i++) {
    result[keys[i]] = vals[i];
  }

  return Object.freeze(result);
};

/**
 * A Visitor for finding report leaves by their DFS index.
 */
function GetLeavesVisitor(targetIndices) {
  this._index = -1;
  this._targetIndices = targetIndices;
  this._leaves = [];
}

GetLeavesVisitor.prototype = Object.create(Visitor.prototype);

/**
 * @overrides Visitor.prototype.enter
 */
GetLeavesVisitor.prototype.enter = function (breakdown, report, edge) {
  this._index++;
  if (this._targetIndices.has(this._index)) {
    this._leaves.push(report);
  }
};

/**
 * Get the accumulated report leaves after traversal.
 */
GetLeavesVisitor.prototype.leaves = function () {
  if (this._index === -1) {
    throw new Error("Attempt to call `leaves` before traversing report!");
  }
  return this._leaves;
};

/**
 * Given a set of indices of leaves in a pre-order depth-first traversal of the
 * given census report, return the leaves.
 *
 * @param {Set<Number>} indices
 * @param {Object} breakdown
 * @param {Object} report
 *
 * @returns {Array<Object>}
 */
exports.getReportLeaves = function (indices, breakdown, report) {
  const visitor = new GetLeavesVisitor(indices);
  walk(breakdown, report, visitor);
  return visitor.leaves();
};

/**
 * Get a list of the individual node IDs that belong to the census report leaves
 * of the given indices.
 *
 * @param {Set<Number>} indices
 * @param {Object} breakdown
 * @param {HeapSnapshot} snapshot
 *
 * @returns {Array<NodeId>}
 */
exports.getCensusIndividuals = function (indices, countBreakdown, snapshot) {
  const bucketBreakdown = exports.countToBucketBreakdown(countBreakdown);
  const bucketReport = snapshot.takeCensus({ breakdown: bucketBreakdown });
  const buckets = exports.getReportLeaves(indices,
                                          bucketBreakdown,
                                          bucketReport);
  return flatten(buckets);
};
