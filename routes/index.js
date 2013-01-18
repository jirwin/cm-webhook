var notify = require('../lib/notify').notify;

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.webhook = function(req, res) {
  // Make notifications, passing the request body
  notify(req.body);
  res.send();
}
