const express = require('express');
const izondo = require('./index.js');
const app = express();
const port = 80;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.get('/:cid/', (req, res) => {
  const cid = req.params.cid;
  izondo(cid).then(data=>{
    res.send(JSON.stringify(data) )
  });
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
