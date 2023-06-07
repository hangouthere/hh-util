#!/bin/sh

nodemon -e ts,js,mjs,mts --watch ./src --exec "npx hh-build_lint && npx hh-build_types"
