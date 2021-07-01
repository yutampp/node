#!/bin/sh
docker run -d -p 80:80 -p 443:443 --net nw1 -e STAGE="production" -e FORCE_RENEW="true" -e DOMAINS="q88s.xyz -> ygoapi" --name https steveltn/https-portal
