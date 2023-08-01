#!/bin/sh

# NPM Bin Shell Script: Test Debug
#
# Manually kicks off vitest with node in inspect-brk mode for debugging

node --inspect-brk=0.0.0.0:9229 ./node_modules/vitest/vitest.mjs --coverage --threads false
