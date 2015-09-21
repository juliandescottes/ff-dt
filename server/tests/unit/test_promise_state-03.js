/* Any copyright is dedicated to the Public Domain.
   http://creativecommons.org/publicdomain/zero/1.0/ */

/**
 * Test that the preview in a Promise's grip is correct when the Promise is
 * rejected.
 */

function run_test()
{
  initTestDebuggerServer();
  const debuggee = addTestGlobal("test-promise-state");
  const client = new DebuggerClient(DebuggerServer.connectPipe());
  client.connect(function() {
    attachTestTabAndResume(client, "test-promise-state", function (response, tabClient, threadClient) {
      Task.spawn(function* () {
        const packet = yield executeOnNextTickAndWaitForPause(() => evalCode(debuggee), client);

        const grip = packet.frame.environment.bindings.variables.p;
        ok(grip.value.preview);
        equal(grip.value.class, "Promise");
        equal(grip.value.promiseState.state, "rejected");
        equal(grip.value.promiseState.reason.actorID, packet.frame.arguments[0].actorID,
              "The promise's rejected state reason should be the same value passed to the then function");

        finishClient(client);
      });
    });
  });
  do_test_pending();
}

function evalCode(debuggee) {
  Components.utils.evalInSandbox(
    "doTest();\n" +
    function doTest() {
      var resolved = Promise.reject(new Error("uh oh"));
      resolved.then(null, () => {
        var p = resolved;
        debugger;
      });
    },
    debuggee
  );
}
