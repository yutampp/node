const request = require("request-promise");
const cheerio = require("cheerio");
const fs = require("fs/promises");

const domain = "https://www.db.yugioh-card.com";
const url = "https://www.db.yugioh-card.com/yugiohdb/deck_search.action?ope=1&sess=3&deck_type=0&isMydeckOnly=0&request_locale=ja&sort=1&page="
const options = {
  url: url,
  method: "GET",
  headers: {
    Referer: "https://www.db.yugioh-card.com/yugiohdb/card_list.action",
    "Accept-Language": "ja,en-US;q=0.9,en;q=0.8",
    //"accept-encoding": "gzip, deflate, br",
    "Content-Type": "text/plain;charset=utf-8",
  },
}

process.chdir(__dirname + "/");

const urls = [];
const result = [];
const page_number = 100;

for(let i=1; i<=page_number; i++){
  urls.push(url+i);
}

console.log(urls);

const promise = ()=>{
  if(urls.length==0){
    return new Promise(resolve=>resolve(result) )
  }else{
    console.log(urls.length);
    options.url = urls.shift();
    return request(options).then(data=>{
      const link = data.split("\r\n").filter(v=>/yugiohdb\/member_deck\.action/.test(v) ).map(v=>domain + v.split("\"")[3] );
      result.push(link);
      return new Promise(resolve=>{
        setTimeout(()=>{
          promise().then(data=>resolve(data) );
        },1000)
      })
    })
  }
}
promise().then(data=>{
  const urls = Array.from(new Set(data.flat() ));
  console.log(urls.length);
  return fs.writeFile("decklist.out", JSON.stringify(urls) )
}).then(data=>{
  console.log(data);
})

/*
process.chdir(__dirname + "/");

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
