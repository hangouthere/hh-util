#!/bin/sh

nodemon \
    --verbose -e hh-util \
    --watch /_triggers \
    --exec "npm i -D @hangouthere/util"
