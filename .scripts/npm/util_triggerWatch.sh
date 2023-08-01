#!/bin/sh

SAVEAS=$([ -n "$1" ] && echo "$1" || echo "--save-peer")

nodemon \
    --verbose -e hh-util \
    --watch /_triggers \
    --exec "npx rimraf ./package-lock.json && npm i ${SAVEAS} @hangouthere/util && npm ls @hangouthere/util"
