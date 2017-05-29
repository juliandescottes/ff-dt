let taskcluster = require("taskcluster-client");

let sha = process.argv[1];
console.log("sha", sha);
let status = {
  state: "error",
  description: "desc",
  target_url: "http://foo.com",
  context: "context"
};

let github = new taskcluster.Github({
  baseUrl: "https://github.taskcluster.net/v1/repository"
});
console.log("gh", github);
console.log("keys", Object.keys(github));

github.createStatus("ochameau", "ff-dt", sha, status).then(() => {
  console.log("status created");
});
let pr = process.argv[2];
console.log("pr #", pr);
github.createComment("ochameau", "ff-dt", pr, { body: "pr comment" }).then(() => {
  console.log("comment created");
});
