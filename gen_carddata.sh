#!/bin/sh

#echo -e "12587.txt\n13846.txt\n4007.txt\n8864.txt\n4817.txt\n8867.txt\n12712.txt\n16425.txt"

ls -1 card | grep .txt | sort -n | while read line
do
docker run --rm -v /root/node:/root/node --name gen_carddata node:16-buster node  --max-old-space-size=4048 /root/node/gen_carddata.js ${line}
done
