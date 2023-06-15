#!/bin/sh

# NPM Bin Shell Script: Publish
#
# Versions the package, and publishes to the specified registry
#
# Defaults to `prerelease`, otherwise reads `--releaseType` for valid `npm version` release types
#
# For targeting the local/private registry during development, you will need a custom `.npmrc`.
# See `docker-compose.dev_linked.yml` and `.docker/.npmrc-localRegistry` for more information.

# TODO: Default to prerelease, but allow full release as well through a CLI argument

TRIGGER_NAME=$1

npm version prerelease && npm publish && npx hh-util_trigger $TRIGGER_NAME
