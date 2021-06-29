const express = require('express');
const dependency = require('./dependency.js');
const fs = require("fs/promises");

const app = express();
const port = 80;

process.chdir(__dirname + "/");

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use("/images", express.static("images"));
app.use("/card", express.static("card"));

app.get("/cardarray/",(req,res) =>{
  fs.readFile("cardarray.out", "utf8").then(data => {
    res.send(data) ;
  });
});

app.get("/imagearray/",(req,res) =>{
  fs.readFile("imagearray.out", "utf8").then(data => {
    res.send(data) ;
  });
});

app.get("/deckarray/",(req,res) =>{
  fs.readFile("deckarray.out", "utf8").then(data => {
    res.send(data) ;
  });
});


app.get("/dependency/:cid/", (req, res) => {
  const cid = req.params.cid;
  dependency(cid).then(data=>{
    res.send(JSON.stringify(data) )
  });
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
