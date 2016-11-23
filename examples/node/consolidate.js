var engine = require('consolidate.js');
var express = require('express');

var app = express();

app.get('/', function (req, res) {
  var model = {
    test1: 'model data test1',
  };
  res.send(homeTemplate(model));
});

app.listen(3001, function () {
  console.log('Server running on port 3001. Open your browser: http://localhost:3001');
});
