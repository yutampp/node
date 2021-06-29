docker stop ygoapi
sleep 3
docker run -d --rm -v /root/node:/root/node --net nw1 --name ygoapi node:16-buster node /root/node/http.js
