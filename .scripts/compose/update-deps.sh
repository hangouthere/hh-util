#!/bin/sh

# Start an interactive update process for project dependencies

docker compose -f ./docker-compose.update-deps.yml up -d

docker exec -it update-deps sh -c "npx -y npm-upgrade"

docker compose -f ./docker-compose.update-deps.yml down
