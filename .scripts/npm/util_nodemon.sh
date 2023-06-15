#!/bin/sh

# NPM Bin Shell Script: Util Nodemon
#
# Utility to simplify `nodemon` instance execution
#
# Example usage: npx hh-util_nodemon --exec "doSomething"

nodemon -e json,scss,css,ts,tsx,mts,js,jsx,mjs --watch ./src $@
