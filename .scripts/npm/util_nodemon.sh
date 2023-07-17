#!/bin/sh

# NPM Bin Shell Script: Util Nodemon
#
# Utility to simplify `nodemon` instance execution
#
# Example usage: npx hh-util_nodemon --exec "doSomething"
#
# Extra params can extend/override existing params
# --watch is additive, so adding more will watch multiple folders
# --exec is an override, so adding more will only execute the last one read

npx nodemon -e json,scss,css,ts,tsx,mts,js,jsx,mjs --watch ./src "$@"
