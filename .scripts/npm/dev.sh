#!/bin/sh

npm i && npx hh-clean

NODE_ENV=development concurrently -n "Types,Bundler" "npx hh-dev_types" "npx hh-dev_bundle"
