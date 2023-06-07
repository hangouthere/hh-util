#!/bin/sh

EXTERNALS="./node_modules*"
RUNTIMEPLATFORM=node
FORCEBUILDONLY=1
FILESRC=index.ts

npx hh-builder
