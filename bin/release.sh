#!/bin/bash

SCRIPT_DIR=$(dirname $0)

# Import AMO credentials from taskcluster secrets
# only master branch can access them to prevent external contributors stealing
# them via pull requests
export secret_url="http://taskcluster/secrets/v1/secret/repo:github.com/ochameau/ff-dt:branch:master"
export AMO_USER=$(curl ${secret_url} | jq ".secret.AMO_USER" -r)
export AMO_SECRET=$(curl ${secret_url} | jq ".secret.AMO_SECRET" -r)

# Append a unique (at least if we don't push twice per minute to master branch...)
# version prefix to the addon id as AMO requires new addon version for every upload
# and also require it to be greater.
# /!\ this changes install.rdf without commiting it.
VERSION_SUFFIX=$(date +%Y%m%d%H%M)
sed -i -E 's/em:version=\"([0-9.ab-]+)\"/em:version=\"\1.'$VERSION_SUFFIX'\"/g' install.rdf

$SCRIPT_DIR/build-xpi.sh
# Note that sign.sh is downloading the xpi from AMO
# we may just hand over AMO link to github...
$SCRIPT_DIR/sign.sh devtools.xpi

# This URL is based on the route declared in taskcluster.yml or task-definitions.yml
ROUTE=project.devtools.revisions.$GITHUB_HEAD_REPO_SHA.sign
ARTIFACT_URL=https://index.taskcluster.net/v1/task/$ROUTE/artifacts/public/devtools-signed.xpi

# Post a commit status message to github with a link to the signed add-on
URL=http://taskcluster/github/v1/repository/ochameau/ff-dt/statuses/$GITHUB_HEAD_REPO_SHA
JSON="{\"state\":\"success\", \"description\":\"Signed add-on\", \"target_url\": \"$ARTIFACT_URL\", \"context\": \"add-on\"}"
curl $URL -H "Content-Type: application/json" -X POST -d "$JSON"
