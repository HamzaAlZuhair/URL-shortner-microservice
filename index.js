require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require("body-parser");
const dns = require('dns');
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

var url_list = [];
app.post("/api/shorturl", (req, res) => {
  var url;
  try{
  url = new URL(req.body.url);
  }catch{
    return res.json({error: 'invalid url'});
  }
  dns.lookup(url.hostname, (err) => {
    if (err){
      return res.json({error: 'invalid url'});
    }else{
      if(!url_list.includes(req.body.url)){
        url_list.push(req.body.url);
      }
      res.json({original_url: req.body.url, short_url: url_list.indexOf(req.body.url)});
    }
  });
});
app.get("/api/shorturl/:num", (req, res) => {
  const number = req.params.num;
  if(number >= url_list.length || number < 0){
    res.json({error: "No short URL found for the given input"});
  }else{
    res.redirect(url_list[number]);
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
