#! /bin/bash

# make sure containers are down
docker-compose down -v

# build containers
docker-compose up -d --build

# show logs
docker-compose logs --tail=0 --follow