var express = require('express');
var http = require('http');

var notify = require('./lib/notify').notify;
var settings = require('./settings').settings;

var app = express();

app.configure(function(){
  app.set('port', settings.port);
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', index);
app.post('/', webhook);

function index(req, res) {
  res.send('cm-webhook');
}

function webhook(req, res) {
  notify(req.body);
  res.send('cm-webhook');
}

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
