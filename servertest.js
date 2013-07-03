var restify = require('restify');
var server = restify.createServer();
server.get('/echo/:name', function (req, res, next) {
  res.send(echo: req.params.name);
  next();
});
server.listen(9000, function () {
  console.log('%s start', server.name);
});