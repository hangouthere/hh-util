#!/bin/sh

# TODO: Needs to be explored more, we don't have a PROD build yet

# NPM Bin Shell Script: Prod
#
# Runs a production build sequentially:
# * linting
# * exporting types
# * bundler build

NODE_ENV=development \
  npm i && npx hh-util_clean

NODE_ENV=production \
EXTERNALS="./node_modules*" \
RUNTIMEPLATFORM=node \
FORCEBUILDONLY=1 \
FILESRC=index.ts \
  .scripts/npm/util_fullBuild.sh
