#!/bin/sh

# Run project in linked development mode.
# This will enable local linking for iterative development with privately & locally libs

docker compose \
  --profile registry \
  -f ./docker-compose.yml \
  -f ./docker-compose.setup.yml \
  -f ./docker-compose.dev.yml \
  -f ./docker-compose.dev_linked.yml \
  up
