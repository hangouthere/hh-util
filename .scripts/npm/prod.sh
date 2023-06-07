#!/bin/sh

NODE_ENV=development

npm i && npx hh-clean

NODE_ENV=production

npx hh-build_types && npx hh-prod_bundle
