const request = require("request-promise");
const cheerio = require("cheerio");
const fs = require("fs/promises");

const domain = "https://www.db.yugioh-card.com";

const options = {
  url: "https://www.db.yugioh-card.com/yugiohdb/card_list.action",
  method: "GET",
  headers: {
    Referer: "https://www.db.yugioh-card.com/yugiohdb/card_list.action",
    "Accept-Language": "ja,en-US;q=0.9,en;q=0.8",
    //"accept-encoding": "gzip, deflate, br",
    "Content-Type": "text/plain;charset=utf-8",
  },
}


process.chdir(__dirname + "/");

const target = "12860"

fs.readFile("deckarray.out", {encoding:"utf8"} ).then(data=>{
  const deckarray = JSON.parse(data);
  const t_deck = deckarray.filter(v=>v.includes(target) );
  //console.log(t_deck.length);
  const bunbo = t_deck.length;
  const opponent = Array.from(new Set(t_deck.flat() ) );
  //console.log(opponent);
  const izondo = opponent.map((t,i,s)=>{
    const bunsi = t_deck.filter(v=>v.includes(t) ).length;
    return [t,bunsi/bunbo]
  });
  const hi_izondo = opponent.map((t,i,s)=>{
    const tt_deck = deckarray.filter(v=>v.includes(t) );
    const bunbo2 = tt_deck.length;
    const bunsi2 = tt_deck.filter(v=>v.includes(target)).length;
    return [t,bunsi2/bunbo2]
  });
  const sougo_izondo = izondo.map((t,i,s)=>{
    return [t[0], t[1]+hi_izondo[i][1]]
  });
  const sorted_sougo_izondo = sougo_izondo.sort((a,b)=>a[1]-b[1] ).map(v=>[`https://www.db.yugioh-card.com/yugiohdb/card_search.action?ope=2&cid=${v[0]}&request_locale=ja`,v[1]]);

  //console.log(izondo);
  //console.log(hi_izondo);
  console.log(sorted_sougo_izondo);

})


/*
request(options)
.then(data=>{
  const links = Array.from(
    new Set(
      data.split("\r\n").filter(v=>/class="link_value" /.test(v) ).map(v=>domain + v.split("\"")[5] ).slice(0,2)
    )
  )
  const result = [];
  const promise = ()=>{
    if(links.length==0){
      return new Promise(resolve=>resolve(result) )
    }else{
      console.log(links.length)
      const link = links.shift();
      options.url = link;
      return request(options).then(data=>{
        const _links = data.split("\r\n").filter(v=>/class="link_value" /.test(v) ).map(v=>domain + v.split("\"")[5] );
        result.push(_links.slice(-2) );
        return new Promise(resolve=>{
          setTimeout(()=>{
            promise().then(data=>resolve(data) );
          },1000)
        })
      })
    }
  };
  return promise()
}).then(data =>{
  const links = Array.from(new Set(data.flat() ));
  return fs.writeFile("cardlist.out", JSON.stringify(links) );
}).then(data =>{
  console.log(data,process.cwd(),__dirname);
});

*/
