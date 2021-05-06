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

const suffix = "&sess=2&sort=1&rp=100&page=1";

process.chdir(__dirname + "/");

fs.readFile("cardlist.out","utf8").then(data=>{
  const urls = JSON.parse(data);
  const result = [];
  const promise = ()=>{
    if(urls.length==0){
      return new Promise(resolve=>resolve(result) )
    }else{
      console.log(urls.length);
      const url = urls.shift() + suffix;
      options.url = url;
      return request(options).then(data=>{
        const imageurls = data.split("\r\n").filter(v=>/'#card_image_[0-9]+'/.test(v) ).map(v=>domain + v.split("'")[5] );
        result.push(imageurls);
        const cid = url.split("&")[1].replace("cid=","");
        return fs.writeFile(`card/${cid}.txt`, data).then(()=>{
          return new Promise(resolve=>{
            setTimeout(()=>{promise().then(data=>resolve(data) ) }, 1000 ) 
          })
        })
      })
    }
  }
  return promise()
}).then(data=>{
  const imageurls = Array.from(new Set(data.flat() ) );
  return fs.writeFile("imagelist.out", JSON.stringify(imageurls) )
})

/*

request(options)
.then(data=>{
  const links = Array.from(
    new Set(
      data.split("\r\n").filter(v=>/class="link_value" /.test(v) ).map(v=>domain + v.split("\"")[5] )
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
        result.push(_links);
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
