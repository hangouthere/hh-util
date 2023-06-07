#!/bin/sh

docker compose \
  -f docker-compose.yml \
  -f docker-compose.dev.yml \
  -f docker-compose.dev_linked.yml \
  -f docker-compose.test.yml \
  -f docker-compose.prod.yml \
  -f docker-compose.update-deps.yml \
  down
