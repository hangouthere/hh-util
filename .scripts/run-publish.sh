#!/bin/sh

# Publish the lib to the targeted registry

docker exec -it nfg-util npm run publish:registry
