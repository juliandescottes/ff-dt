#/bin/bash

# Depends on jq and openssl

set -euo pipefail
IFS=$'\n\t'

HEADER='{
  "alg": "HS256",
  "typ": "JWT"
}'
PAYLOAD='{
  "iss": "'$AMO_USER'",
  "jti": '$(echo "scale=10; $RANDOM*10/32767" | bc)',
  "iat": '$(date +%s)',
  "exp": '$(($(date +%s)+60))'
}'

function base64_encode()
{
  declare INPUT=${1:-$(</dev/stdin)};
  echo -n "$INPUT" | openssl enc -base64 | tr '+\/' '-_' | tr -d '=' | tr -d '\r\n'
}

# For some reason, probably bash-related, JSON that terminates with an integer
# must be compacted. So it must be something like `{"userId":1}` or else the
# signing gets screwed up. Weird, but using `jq -c` works to fix that.
function json() {
  declare INPUT=${1:-$(</dev/stdin)};
  echo -n "$INPUT" | jq -c .
}

function hmacsha256_sign()
{
  declare INPUT=${1:-$(</dev/stdin)};
  echo -n "$INPUT" | openssl dgst -binary -sha256 -hmac "$AMO_SECRET"
}

HEADER_BASE64=$(echo "${HEADER}" | json | base64_encode)
PAYLOAD_BASE64=$(echo "${PAYLOAD}" | json | base64_encode)

HEADER_PAYLOAD=$(echo "${HEADER_BASE64}.${PAYLOAD_BASE64}")
SIGNATURE=$(echo "${HEADER_PAYLOAD}" | hmacsha256_sign | base64_encode)

echo "${HEADER_PAYLOAD}.${SIGNATURE}"
