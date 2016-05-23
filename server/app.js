var express =  require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var tasks = require('./routes/tasks');

app.use(bodyParser.urlencoded({ extended: true }));

//main route to tasks database
app.use('/tasks', tasks);

// catch all
app.get('/*', function (req, res) {
  var file = req.params[0] || '/views/index.html';
  res.sendFile(path.join(__dirname, './public', file));
});

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function () {
  console.log('Listening on port ', app.get('port'));
});
