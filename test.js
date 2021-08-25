const request = require("request-promise");
const cheerio = require("cheerio");
const fs = require("fs/promises");


process.chdir(__dirname + "/");

const file_name = process.argv[2];
/*
 * const carddata_format = 
[
0 "id",
1 "card_name",
2 "ruby",
3 "magic|trap|monster",
4 "quick|normal|permanent",
5 "counter|normal|permanent",
6 "type",
7 "attribute",
8 "treated",
9 "color",
10 "appendix",
11 "maintext",
12 "subtext",
13 "level",
14 "rank",
15 "scale",
16 "link",
17 "conditional",
18 "atk",
19 "def",
20 "limited",
21 "relation_cards",
22 "included packs"
]
*/
fs.readFile("cardarray.out", "utf8").then(data =>{
  const cards = JSON.parse(data);
  return cards.map(v=>{
    const cid=v[0];
    return fs.readFile("cardarray.out", "utf8").then(data =>{
      const card = JSON.parse(data);
      return card
    });
  });
}).then(promises=>{
  return Promise.all(promises);
}).then(data=>{
  const cards = data;
  const result = cards.filter(v=>v[13]==4).map(v=>v[18]+v[19]);
  result.sort((a,b)=>a-b);
  console.log(result)
})

