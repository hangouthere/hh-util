#!/bin/sh

# NPM Bin Shell Script: Dev
#
# Runs a nodemon instance watching the source for changes, and runs sequentially:
# * linting
# * exporting types
# * bundler build

NODE_ENV=development \
  npm i && \
  npx hh-util_clean && \
NODE_ENV=development \
EXTERNALS="./node_modules*" \
FORCEBUILDONLY=1 \
RUNTIMEPLATFORM=node \
FILESRC=index.ts \
  npx hh-util_nodemon --exec "npx hh-util_fullBuild"
