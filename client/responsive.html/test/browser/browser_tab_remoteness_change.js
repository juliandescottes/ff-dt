/* Any copyright is dedicated to the Public Domain.
   http://creativecommons.org/publicdomain/zero/1.0/ */

"use strict";

// Verify RDM closes synchronously when tabs change remoteness.

const TEST_URL = "http://example.com/";

add_task(function* () {
  let tab = yield addTab(TEST_URL);

  let { ui } = yield openRDM(tab);
  let clientClosed = waitForClientClose(ui);

  closeRDM(tab, {
    reason: "BeforeTabRemotenessChange",
  });

  // This flag is set at the end of `ResponsiveUI.destroy`.  If it is true
  // without yielding on `closeRDM` above, then we must have closed
  // synchronously.
  is(ui.destroyed, true, "RDM closed synchronously");

  yield clientClosed;
  yield removeTab(tab);
});

add_task(function* () {
  let tab = yield addTab(TEST_URL);

  let { ui } = yield openRDM(tab);
  let clientClosed = waitForClientClose(ui);

  // Load URL that requires the main process, forcing a remoteness flip
  yield load(tab.linkedBrowser, "about:robots");

  // This flag is set at the end of `ResponsiveUI.destroy`.  If it is true without
  // yielding on `closeRDM` itself and only removing the tab, then we must have closed
  // synchronously in response to tab closing.
  is(ui.destroyed, true, "RDM closed synchronously");

  yield clientClosed;
});
