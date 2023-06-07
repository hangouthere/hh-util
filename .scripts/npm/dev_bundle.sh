#!/bin/sh

EXTERNALS="./node_modules*" \
FORCEBUILDONLY=1 \
RUNTIMEPLATFORM=node \
FILESRC=index.ts \
nodemon -e ts,js,mjs,mts --watch ./src --exec "npx hh-builder"
