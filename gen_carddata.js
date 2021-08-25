const request = require("request-promise");
const cheerio = require("cheerio");
const fs = require("fs/promises");


process.chdir(__dirname + "/");

const file_name = process.argv[2];
/*
 * const carddata_format = 
[
 "id",
 "card_name",
 "ruby",
 "magic|trap|monster",
 "quick|normal|permanent",
 "counter|normal|permanent",
 "type",
 "attribute",
 "treated",
 "color",
 "appendix",
 "maintext",
 "subtext",
 "level",
 "rank",
 "scale",
 "link",
 "conditional",
 "atk",
 "def",
 "limited",
 "relation_cards",
 "included packs"
]
*/

fs.readFile("card/"+file_name, "utf8").then(data =>{
  const $ = cheerio.load(data);
  const id = file_name.replace(".txt","")
  const card = [
  /*"id"                  */
  id,
  /*"card_name"           */
  $($("#broad_title > div > h1").prop('outerHTML'))
  .children().empty().parent().text().trim(),
  /*"ruby"                */
  $("#broad_title > div > h1 > .ruby").text().trim(),
  /*"magic|trap|monster"  */
  (()=>{
    //const x =  $("#details > tbody > tr:first ").find("div.item_box").prop("outerHTML");
    const a =  $($("#details > tbody > tr:first ").find("div.item_box").prop("outerHTML"))
               .children().empty().parent().text().trim();
    if(a.match(/魔法/)) return "magic"
    if(a.match(/罠/)  ) return "trap"
    return "monster"
  })(),
  /*"quick|normal|perm"   */
  $($("#details > tbody > tr:first ").find("div.item_box").prop("outerHTML"))
  .children().empty().parent().text().trim(),
  /*"counter|normal|perm" */
  $($("#details > tbody > tr:first ").find("div.item_box").prop("outerHTML"))
  .children().empty().parent().text().trim(),
  /*"type"                */
  $($("#details > tbody").find("b:contains('種族'):first")
    .parent().parent().prop("outerHTML")
   ).children().empty().parent().text().trim(),
  /*"attribute"           */
  $($("#details > tbody").find("b:contains('属性'):first")
    .parent().parent().prop("outerHTML")
   ).find("span.item_box_value").text().trim(),
  /*"treated"             */
  $($("#details > tbody").find("b:contains('その他項目'):first")
    .parent().parent().prop("outerHTML")
   ).children().empty().parent().text().trim()
   .replaceAll("\n","")
   .replaceAll("\t",""),
/*"color"               */
  (()=>{
    const result = [];
    const a = $($("#details > tbody").find("b:contains('その他項目'):first")
                .parent().parent().prop("outerHTML")
               ).children().empty().parent().text().trim()
               .replaceAll("\n","")
               .replaceAll("\t","");
    if(a.match(/エクシーズ/)  ) result.push("black");
    if(a.match(/シンクロ/)    ) result.push("white");
    if(a.match(/通常/)        ) result.push("vanilla");
    if(a.match(/ペンデュラム/)) result.push("green_mixed");
    if(a.match(/儀式/)        ) result.push("skyblue");
    if(a.match(/融合/)        ) result.push("purple");
    if(a.match(/リンク/)      ) result.push("blue");
    if(a.match(/効果/)        ) if(result.length==0) result.push("orange");
    if(result.length>0) return result;
    const b = $($("#details > tbody > tr:first ").find("div.item_box").prop("outerHTML"))
               .children().empty().parent().text().trim();
    if(b.match(/魔法/)        ) result.push("green");
    if(b.match(/罠/)          ) result.push("red");
    return result
  })(),
/*"appendix"            */
  "",
/*"maintext"            */
  (()=>{
    const a = $($("#details > tbody").find("b:contains('カードテキスト'):first")
      .parent().parent().prop("outerHTML")
     ).children().empty().parent().html().trim()
     .replaceAll("\n","")
     .replaceAll("\t","");
    return $("<p>" + a.split("<br>").pop() + "</p>" ).text();
  })(),
/*"pendulum_text"       */
  $($("#details > tbody").find("b:contains('ペンデュラム効果'):first")
    .parent().parent().prop("outerHTML")
   ).children().empty().parent().text().trim()
   .replaceAll("\n","")
   .replaceAll("\t",""),
/*"level"               */
  $("#details > tbody").find("b:contains('レベル'):first")
   .parent().parent().find("span.item_box_value").text().trim(),
/*"rank"                */
  $("#details > tbody").find("b:contains('ランク'):first")
   .parent().parent().find("span.item_box_value").text().trim(),
/*"scale"               */
  $($("#details > tbody").find("b:contains('ペンデュラムスケール'):first")
    .parent().parent().prop("outerHTML")
   ).children().empty().parent().text().trim()
   .replaceAll("\n","")
   .replaceAll("\t",""),
/*"link"                */
  $("#details > tbody").find("b:contains('リンク'):first")
   .parent().parent().find("span.item_box_value").text().trim(),
/*"conditional"         */
  (()=>{
    const x = (()=>{
      const result = [];
      const a = $($("#details > tbody").find("b:contains('その他項目'):first")
                  .parent().parent().prop("outerHTML")
                 ).children().empty().parent().text().trim()
                 .replaceAll("\n","")
                 .replaceAll("\t","");
      if(a.match(/エクシーズ/)  ) result.push("black");
      if(a.match(/シンクロ/)    ) result.push("white");
      if(a.match(/通常/)        ) result.push("vanilla");
      if(a.match(/ペンデュラム/)) result.push("green_mixed");
      if(a.match(/儀式/)        ) result.push("skyblue");
      if(a.match(/融合/)        ) result.push("purple");
      if(a.match(/リンク/)      ) result.push("blue");
      if(a.match(/効果/)        ) if(result.length==0) result.push("orange");
      if(result.length>0) return result;
      const b = $($("#details > tbody > tr:first ").find("div.item_box").prop("outerHTML"))
                 .children().empty().parent().text().trim();
      if(b.match(/魔法/)        ) result.push("green");
      if(b.match(/罠/)          ) result.push("red");
      return result
    })();
    const a = $($("#details > tbody").find("b:contains('カードテキスト'):first")
      .parent().parent().prop("outerHTML")
     ).children().empty().parent().html().trim()
     .replaceAll("\n","")
     .replaceAll("\t","");
    const b = $("<p>" + a.split("<br>").shift() + "</p>" ).text();
    if( x=="blue"
      ||x=="purple"
      ||x=="skyblue"
      ||x=="white"
      ||x=="black") return b
    return ""
  })(),
/*"atk"                 */
  $("#details > tbody").find("b:contains('攻撃力'):first")
   .parent().parent().find("span.item_box_value").text().trim(),
/*"def"                 */
  $("#details > tbody").find("b:contains('守備力'):first")
   .parent().parent().find("span.item_box_value").text().trim(),
/*"limited"             */
  (()=>{
    const a = $("#details > tbody").find("b:contains('カードテキスト'):first")
      .parent().parent().children("div:last-child").prop("outerHTML");
    const b = $("#details > tbody").find("b:contains('カードテキスト'):first")
      .parent().parent().children("div:first-child").prop("outerHTML");
    if( a==b || a==null) return ""
    return a.replaceAll("\t","").replaceAll("\n","")
  })(),
/*[relation_cards]    */
  Array.from(
    $("#relationCard > ul.box_list > li ").map((i,el) => {
      const a = $(el).find("dd.box_card_img").find("img").prop("id");
      const b = data.split("\r\n").filter( v => v.match("#"+a) )[0].trim();
      return b.split("&")[1].replace("cid=","")
    })
  ) ,
/*[included packs]      */
  Array.from(
    $("#pack_list").find("tr.row").map((i,el)=>{
      const a = [
          $(el).children("td:nth-child(1)").text(),
          $(el).children("td:nth-child(2)").text(),
          $(el).children("td:nth-child(3)").text().trim(),
          ($(el).children("td:nth-child(4)").find("img").prop("src")||"")
          .split("/").pop()
          ];
      return [a]
    })
  )
  ];
  return fs.writeFile("card/"+id+".dat", JSON.stringify(card) );
}).then(data=>{
  console.log(file_name);
})

