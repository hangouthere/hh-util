#!/bin/sh

# NPM Bin Shell Script: Util Trigger
#
# Writes trigger file passed in to the `/_triggers` path for monitoring in a Docker Container

TRIGGER_NAME=$1

echo $(date) > /_triggers/trigger.$TRIGGER_NAME
