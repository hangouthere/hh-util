#!/bin/sh

docker compose \
  -f ./docker-compose.update-deps.yml \
  up
