#!/bin/sh

# Take down all docker containers defined in all the compose definition files

docker compose \
  -f docker-compose.yml \
  -f docker-compose.dev.yml \
  -f docker-compose.dev_linked.yml \
  -f docker-compose.test.yml \
  -f docker-compose.prod.yml \
  -f docker-compose.setup.yml \
  down --volumes
