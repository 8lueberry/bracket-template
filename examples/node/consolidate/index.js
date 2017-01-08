var cons = require('consolidate');
var express = require('express');
var path = require('path');

cons.requires.bracket = require('../../../dist/node'); // can be omitted in your code

var app = express();

// setup view engine
app.engine('brkt.html', cons.bracket);
app.set('view engine', 'brkt.html');
app.set('views', path.resolve(__dirname, 'views'));

// GET: http://localhost:3001
app.get('/', function (req, res) {
  var model = {
    test1: 'model data test1',
  };
  res.render('home', model);
});

// start server
app.listen(3001, function () {
  console.log('Server running on port 3001. Open your browser: http://localhost:3001');
});
