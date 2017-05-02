/* Any copyright is dedicated to the Public Domain.
  http://creativecommons.org/publicdomain/zero/1.0/ */
/* eslint-disable max-len */

"use strict";

/*
 * THIS FILE IS AUTOGENERATED. DO NOT MODIFY BY HAND. RUN TESTS IN FIXTURES/ TO UPDATE.
 */

const { ConsoleMessage } =
  require("devtools/client/webconsole/new-console-output/types");

let stubPreparedMessages = new Map();
let stubPackets = new Map();
stubPreparedMessages.set("ReferenceError: asdf is not defined", new ConsoleMessage({
  "id": "1",
  "allowRepeating": true,
  "source": "javascript",
  "timeStamp": 1476573167137,
  "type": "log",
  "level": "error",
  "messageText": "ReferenceError: asdf is not defined",
  "parameters": null,
  "repeat": 1,
  "repeatId": "{\"id\":null,\"allowRepeating\":true,\"source\":\"javascript\",\"type\":\"log\",\"level\":\"error\",\"messageText\":\"ReferenceError: asdf is not defined\",\"parameters\":null,\"repeatId\":null,\"stacktrace\":[{\"filename\":\"http://example.com/browser/devtools/client/webconsole/new-console-output/test/fixtures/stub-generators/test-console-api.html\",\"lineNumber\":3,\"columnNumber\":5,\"functionName\":\"bar\"},{\"filename\":\"http://example.com/browser/devtools/client/webconsole/new-console-output/test/fixtures/stub-generators/test-console-api.html\",\"lineNumber\":6,\"columnNumber\":5,\"functionName\":\"foo\"},{\"filename\":\"http://example.com/browser/devtools/client/webconsole/new-console-output/test/fixtures/stub-generators/test-console-api.html\",\"lineNumber\":9,\"columnNumber\":3,\"functionName\":null},{\"filename\":\"resource://testing-common/content-task.js line 52 > eval\",\"lineNumber\":6,\"columnNumber\":9,\"functionName\":null},{\"filename\":\"resource://testing-common/content-task.js\",\"lineNumber\":53,\"columnNumber\":20,\"functionName\":null}],\"frame\":{\"source\":\"http://example.com/browser/devtools/client/webconsole/new-console-output/test/fixtures/stub-generators/test-console-api.html\",\"line\":3,\"column\":5},\"groupId\":null,\"exceptionDocURL\":\"https://developer.mozilla.org/docs/Web/JavaScript/Reference/Errors/Not_defined?utm_source=mozilla&utm_medium=firefox-console-errors&utm_campaign=default\",\"userProvidedStyles\":null,\"notes\":null}",
  "stacktrace": [
    {
      "filename": "http://example.com/browser/devtools/client/webconsole/new-console-output/test/fixtures/stub-generators/test-console-api.html",
      "lineNumber": 3,
      "columnNumber": 5,
      "functionName": "bar"
    },
    {
      "filename": "http://example.com/browser/devtools/client/webconsole/new-console-output/test/fixtures/stub-generators/test-console-api.html",
      "lineNumber": 6,
      "columnNumber": 5,
      "functionName": "foo"
    },
    {
      "filename": "http://example.com/browser/devtools/client/webconsole/new-console-output/test/fixtures/stub-generators/test-console-api.html",
      "lineNumber": 9,
      "columnNumber": 3,
      "functionName": null
    },
    {
      "filename": "resource://testing-common/content-task.js line 52 > eval",
      "lineNumber": 6,
      "columnNumber": 9,
      "functionName": null
    },
    {
      "filename": "resource://testing-common/content-task.js",
      "lineNumber": 53,
      "columnNumber": 20,
      "functionName": null
    }
  ],
  "frame": {
    "source": "http://example.com/browser/devtools/client/webconsole/new-console-output/test/fixtures/stub-generators/test-console-api.html",
    "line": 3,
    "column": 5
  },
  "groupId": null,
  "exceptionDocURL": "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Errors/Not_defined?utm_source=mozilla&utm_medium=firefox-console-errors&utm_campaign=default",
  "userProvidedStyles": null,
  "notes": null
}));

stubPreparedMessages.set("SyntaxError: redeclaration of let a", new ConsoleMessage({
  "id": "1",
  "allowRepeating": true,
  "source": "javascript",
  "timeStamp": 1487992945524,
  "type": "log",
  "level": "error",
  "messageText": "SyntaxError: redeclaration of let a",
  "parameters": null,
  "repeat": 1,
  "repeatId": "{\"id\":null,\"allowRepeating\":true,\"source\":\"javascript\",\"type\":\"log\",\"level\":\"error\",\"messageText\":\"SyntaxError: redeclaration of let a\",\"parameters\":null,\"repeatId\":null,\"stacktrace\":[{\"filename\":\"resource://testing-common/content-task.js line 52 > eval\",\"lineNumber\":6,\"columnNumber\":9,\"functionName\":null},{\"filename\":\"resource://testing-common/content-task.js\",\"lineNumber\":53,\"columnNumber\":20,\"functionName\":null}],\"frame\":{\"source\":\"http://example.com/browser/devtools/client/webconsole/new-console-output/test/fixtures/stub-generators/test-console-api.html\",\"line\":2,\"column\":9},\"groupId\":null,\"userProvidedStyles\":null,\"notes\":[{\"messageBody\":\"Previously declared at line 2, column 6\",\"frame\":{\"source\":\"http://example.com/browser/devtools/client/webconsole/new-console-output/test/fixtures/stub-generators/test-console-api.html\",\"line\":2,\"column\":6}}]}",
  "stacktrace": [
    {
      "filename": "resource://testing-common/content-task.js line 52 > eval",
      "lineNumber": 6,
      "columnNumber": 9,
      "functionName": null
    },
    {
      "filename": "resource://testing-common/content-task.js",
      "lineNumber": 53,
      "columnNumber": 20,
      "functionName": null
    }
  ],
  "frame": {
    "source": "http://example.com/browser/devtools/client/webconsole/new-console-output/test/fixtures/stub-generators/test-console-api.html",
    "line": 2,
    "column": 9
  },
  "groupId": null,
  "userProvidedStyles": null,
  "notes": [
    {
      "messageBody": "Previously declared at line 2, column 6",
      "frame": {
        "source": "http://example.com/browser/devtools/client/webconsole/new-console-output/test/fixtures/stub-generators/test-console-api.html",
        "line": 2,
        "column": 6
      }
    }
  ]
}));

stubPreparedMessages.set("TypeError longString message", new ConsoleMessage({
  "id": "1",
  "allowRepeating": true,
  "source": "javascript",
  "timeStamp": 1493109507061,
  "type": "log",
  "level": "error",
  "messageText": {
    "type": "longString",
    "initial": "Error: Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Lon",
    "length": 110007,
    "actor": "server1.conn0.child1/longString30"
  },
  "parameters": null,
  "repeat": 1,
  "repeatId": "{\"id\":null,\"allowRepeating\":true,\"source\":\"javascript\",\"timeStamp\":1493109507061,\"type\":\"log\",\"level\":\"error\",\"messageText\":{\"type\":\"longString\",\"initial\":\"Error: Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Lon\",\"length\":110007,\"actor\":\"server1.conn0.child1/longString30\"},\"parameters\":null,\"repeatId\":null,\"stacktrace\":[{\"filename\":\"http://example.com/browser/devtools/client/webconsole/new-console-output/test/fixtures/stub-generators/test-console-api.html\",\"lineNumber\":1,\"columnNumber\":7,\"functionName\":null},{\"filename\":\"resource://testing-common/content-task.js line 52 > eval\",\"lineNumber\":6,\"columnNumber\":9,\"functionName\":null},{\"filename\":\"resource://testing-common/content-task.js\",\"lineNumber\":53,\"columnNumber\":20,\"functionName\":null}],\"frame\":{\"source\":\"http://example.com/browser/devtools/client/webconsole/new-console-output/test/fixtures/stub-generators/test-console-api.html\",\"line\":1,\"column\":7},\"groupId\":null,\"userProvidedStyles\":null,\"notes\":null}",
  "stacktrace": [
    {
      "filename": "http://example.com/browser/devtools/client/webconsole/new-console-output/test/fixtures/stub-generators/test-console-api.html",
      "lineNumber": 1,
      "columnNumber": 7,
      "functionName": null
    },
    {
      "filename": "resource://testing-common/content-task.js line 52 > eval",
      "lineNumber": 6,
      "columnNumber": 9,
      "functionName": null
    },
    {
      "filename": "resource://testing-common/content-task.js",
      "lineNumber": 53,
      "columnNumber": 20,
      "functionName": null
    }
  ],
  "frame": {
    "source": "http://example.com/browser/devtools/client/webconsole/new-console-output/test/fixtures/stub-generators/test-console-api.html",
    "line": 1,
    "column": 7
  },
  "groupId": null,
  "userProvidedStyles": null,
  "notes": null
}));

stubPackets.set("ReferenceError: asdf is not defined", {
  "from": "server1.conn0.child1/consoleActor2",
  "type": "pageError",
  "pageError": {
    "errorMessage": "ReferenceError: asdf is not defined",
    "errorMessageName": "JSMSG_NOT_DEFINED",
    "exceptionDocURL": "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Errors/Not_defined?utm_source=mozilla&utm_medium=firefox-console-errors&utm_campaign=default",
    "sourceName": "http://example.com/browser/devtools/client/webconsole/new-console-output/test/fixtures/stub-generators/test-console-api.html",
    "lineText": "",
    "lineNumber": 3,
    "columnNumber": 5,
    "category": "content javascript",
    "timeStamp": 1476573167137,
    "warning": false,
    "error": false,
    "exception": true,
    "strict": false,
    "info": false,
    "private": false,
    "stacktrace": [
      {
        "filename": "http://example.com/browser/devtools/client/webconsole/new-console-output/test/fixtures/stub-generators/test-console-api.html",
        "lineNumber": 3,
        "columnNumber": 5,
        "functionName": "bar"
      },
      {
        "filename": "http://example.com/browser/devtools/client/webconsole/new-console-output/test/fixtures/stub-generators/test-console-api.html",
        "lineNumber": 6,
        "columnNumber": 5,
        "functionName": "foo"
      },
      {
        "filename": "http://example.com/browser/devtools/client/webconsole/new-console-output/test/fixtures/stub-generators/test-console-api.html",
        "lineNumber": 9,
        "columnNumber": 3,
        "functionName": null
      },
      {
        "filename": "resource://testing-common/content-task.js line 52 > eval",
        "lineNumber": 6,
        "columnNumber": 9,
        "functionName": null
      },
      {
        "filename": "resource://testing-common/content-task.js",
        "lineNumber": 53,
        "columnNumber": 20,
        "functionName": null
      }
    ],
    "notes": null
  }
});

stubPackets.set("SyntaxError: redeclaration of let a", {
  "from": "server1.conn0.child1/consoleActor2",
  "type": "pageError",
  "pageError": {
    "errorMessage": "SyntaxError: redeclaration of let a",
    "errorMessageName": "JSMSG_REDECLARED_VAR",
    "sourceName": "http://example.com/browser/devtools/client/webconsole/new-console-output/test/fixtures/stub-generators/test-console-api.html",
    "lineText": "  let a, a;\n",
    "lineNumber": 2,
    "columnNumber": 9,
    "category": "content javascript",
    "timeStamp": 1487992945524,
    "warning": false,
    "error": false,
    "exception": true,
    "strict": false,
    "info": false,
    "private": false,
    "stacktrace": [
      {
        "filename": "resource://testing-common/content-task.js line 52 > eval",
        "lineNumber": 6,
        "columnNumber": 9,
        "functionName": null
      },
      {
        "filename": "resource://testing-common/content-task.js",
        "lineNumber": 53,
        "columnNumber": 20,
        "functionName": null
      }
    ],
    "notes": [
      {
        "messageBody": "Previously declared at line 2, column 6",
        "frame": {
          "source": "http://example.com/browser/devtools/client/webconsole/new-console-output/test/fixtures/stub-generators/test-console-api.html",
          "line": 2,
          "column": 6
        }
      }
    ]
  }
});

stubPackets.set("TypeError longString message", {
  "from": "server1.conn0.child1/consoleActor2",
  "type": "pageError",
  "pageError": {
    "errorMessage": {
      "type": "longString",
      "initial": "Error: Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Long error Lon",
      "length": 110007,
      "actor": "server1.conn0.child1/longString30"
    },
    "errorMessageName": "",
    "sourceName": "http://example.com/browser/devtools/client/webconsole/new-console-output/test/fixtures/stub-generators/test-console-api.html",
    "lineText": "",
    "lineNumber": 1,
    "columnNumber": 7,
    "category": "content javascript",
    "timeStamp": 1493109507061,
    "warning": false,
    "error": false,
    "exception": true,
    "strict": false,
    "info": false,
    "private": false,
    "stacktrace": [
      {
        "filename": "http://example.com/browser/devtools/client/webconsole/new-console-output/test/fixtures/stub-generators/test-console-api.html",
        "lineNumber": 1,
        "columnNumber": 7,
        "functionName": null
      },
      {
        "filename": "resource://testing-common/content-task.js line 52 > eval",
        "lineNumber": 6,
        "columnNumber": 9,
        "functionName": null
      },
      {
        "filename": "resource://testing-common/content-task.js",
        "lineNumber": 53,
        "columnNumber": 20,
        "functionName": null
      }
    ],
    "notes": null
  }
});

module.exports = {
  stubPreparedMessages,
  stubPackets,
};
