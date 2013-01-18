
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.webhook = function(req, res) {
  res.send("test");
}
