/* Any copyright is dedicated to the Public Domain.
   http://creativecommons.org/publicdomain/zero/1.0/ */

"use strict";

/**
 * Tests if showing raw headers works.
 */

add_task(function* () {
  let { tab, monitor } = yield initNetMonitor(POST_DATA_URL);
  info("Starting test... ");

  let { document, NetMonitorView } = monitor.panelWin;
  let { RequestsMenu } = NetMonitorView;

  RequestsMenu.lazyUpdate = false;

  let wait = waitForNetworkEvents(monitor, 0, 2);
  yield ContentTask.spawn(tab.linkedBrowser, {}, function* () {
    content.wrappedJSObject.performRequests();
  });
  yield wait;

  let origItem = RequestsMenu.getItemAtIndex(0);

  wait = waitForDOM(document, ".headers-overview");
  RequestsMenu.selectedItem = origItem;
  yield wait;

  wait = waitForDOM(document, ".raw-headers-container textarea", 2);
  EventUtils.sendMouseEvent({ type: "click" },
    document.querySelectorAll(".tool-button")[1]);
  yield wait;

  testShowRawHeaders(origItem);

  EventUtils.sendMouseEvent({ type: "click" },
    document.querySelectorAll(".tool-button")[1]);

  testHideRawHeaders(document);

  return teardown(monitor);

  /*
   * Tests that raw headers were displayed correctly
   */
  function testShowRawHeaders(data) {
    let requestHeaders = document
      .querySelectorAll(".raw-headers-container textarea")[0].value;
    for (let header of data.requestHeaders.headers) {
      ok(requestHeaders.includes(header.name + ": " + header.value),
        "textarea contains request headers");
    }
    let responseHeaders = document
      .querySelectorAll(".raw-headers-container textarea")[1].value;
    for (let header of data.responseHeaders.headers) {
      ok(responseHeaders.includes(header.name + ": " + header.value),
        "textarea contains response headers");
    }
  }

  /*
   * Tests that raw headers textareas are hidden
   */
  function testHideRawHeaders() {
    ok(!document.querySelector(".raw-headers-container"),
      "raw request headers textarea is empty");
  }
});
