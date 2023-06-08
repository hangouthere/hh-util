#!/bin/sh

# NPM Bin Shell Script: Util Trigger
#
# Writes trigger file passed in to the `/_triggers` path for monitoring in a Docker Container

echo $(date) > /_triggers/$1
