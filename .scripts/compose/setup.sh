#!/bin/sh

WARN=$(tput setaf 3)
RESET=$(tput setaf 9)

installDeps() {
  rm -rf node_modules package-lock.json

  mkdir -p node_modules

  docker compose \
    -f ./docker-compose.yml \
    -f ./docker-compose.dev_linked.yml \
    -f ./docker-compose.setup.yml \
    up -d npm-registry install-deps

  docker exec -it install-deps sh -c "npm i"

  docker compose \
    -f ./docker-compose.yml \
    -f ./docker-compose.dev_linked.yml \
    -f ./docker-compose.setup.yml \
    down
}

upgradeDeps() {
  docker compose \
    -f ./docker-compose.yml \
    -f ./docker-compose.dev_linked.yml \
    -f ./docker-compose.setup.yml \
    up -d npm-registry update-deps

  docker exec -it update-deps sh -c "npx -y npm-upgrade"

  docker compose \
    -f ./docker-compose.dev_linked.yml \
    -f ./docker-compose.setup.yml \
    down npm-registry update-deps
}

alreadyInstalled=$([ -e node_modules/.package-lock.json ] && echo "1" || echo "")

# Check for the existence of the "--force" or "-f" flag
if [ -z "$alreadyInstalled" ]; then
  printf "\n%sClean Install Activated%s\n\n" "${WARN}" "${RESET}"
  installDeps
elif [ "$1" = "--force" ] || [ "$1" = "-f" ]; then
  printf "\n%sForced Install Activated%s\n\n" "${WARN}" "${RESET}"
  installDeps
else
  printf "\n%sUpdating Existing Dependencies%s\n\n" "${WARN}" "${RESET}"
  upgradeDeps
fi
