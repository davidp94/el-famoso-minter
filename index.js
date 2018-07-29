var express = require('express');
var app = express();

app.get('/', function (req, res) {
    res.send('!')
  })
  
  app.listen(3000, function () {
    console.log('El famoso minter running listening on port 3000!')
  })
  