var sprintf = require('sprintf').sprintf;
var notify = require('../lib/notify').notify;

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.webhook = function(req, res) {
  var entityName = req.body.entity.label,
      state = req.body.details.state,
      status = req.body.details.status,
      target = req.body.details.target,
      msg;

  msg = sprintf('%s(%s) is %s. %s', entityName, target, state, status);
  notify(msg);
  res.send();
}
