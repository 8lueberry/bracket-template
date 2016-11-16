var bracket = require('../../dist/bracket').default; // require('bracket-template').default;
var express = require('express');

// good practice to call template() once and cache the template function for reuse
var homeTemplate = bracket.template(`
<html>
  <body>
    Hello from template: [[= model.test1 ]]
  </body>
</html>
`);

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
