#!/bin/sh

docker run --rm -v /root/node:/root/node --name decklist1 node:16-buster node  --max-old-space-size=2048 /root/node/cardlist.js

docker run --rm -v /root/node:/root/node --name decklist1 node:16-buster node  --max-old-space-size=2048 /root/node/cardarray.js

docker run --rm -v /root/node:/root/node --name decklist1 node:16-buster node  --max-old-space-size=2048 /root/node/imagelist.js

docker run --rm -v /root/node:/root/node --name decklist1 node:16-buster node  --max-old-space-size=2048 /root/node/imagearray.js


docker run --rm -v /root/node:/root/node --name decklist1 node:16-buster node  --max-old-space-size=2048 /root/node/decklist.js

docker run --rm -v /root/node:/root/node --name decklist2 node:16-buster node  --max-old-space-size=2048 /root/node/deckarray.js


