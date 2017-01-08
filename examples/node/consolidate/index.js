var cons = require('../../../../consolidate.js');
var express = require('express');
var path = require('path');

cons.requires.bracket = require('../../../dist/bracket');

var app = express();

app.engine('html', cons.bracket);
app.set('view engine', 'html');
app.set('views', path.resolve(__dirname, 'views'));

app.get('/', function (req, res) {
  var model = {
    test1: 'model data test1',
  };
  res.render('home.brkt.html', model);
});

app.listen(3001, function () {
  console.log('Server running on port 3001. Open your browser: http://localhost:3001');
});
