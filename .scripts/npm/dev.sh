#!/bin/sh

npm i && npx hh-clean

NODE_ENV=development concurrently "npx hh-dev_types" "npx-hh-dev_bundle"
