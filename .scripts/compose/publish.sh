#!/bin/sh

# Publish the lib to the targeted registry

docker exec -it hangouthere-util npm run publish:registry
