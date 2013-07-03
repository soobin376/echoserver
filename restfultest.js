var restify = require('restify');

var server = restify.createServer({
  name: 'echo server'
});
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.get('/echo/:echo', function (req, res) {
  res.send(req.params);
  //req.get(req.url('/echo'));
});

server.listen(9000, function () {
  console.log('%s start', server.name);
});