#!/bin/sh

node --inspect-brk=0.0.0.0:9229 ./node_modules/vitest/vitest.mjs --threads false
