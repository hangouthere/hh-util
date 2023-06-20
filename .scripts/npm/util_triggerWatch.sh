#!/bin/sh

nodemon \
    --verbose -e hh-util \
    --watch /_triggers \
    --exec "npm i --no-save @hangouthere/util && npm ls @hangouthere/util"
