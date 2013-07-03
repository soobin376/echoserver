var restify = require('restify');

var server = restify.createServer();

function sendV1(req, res, next) {
  res.send('echo : ' + req.params.name);
  return next();
}

function sendV2(req, res, next) {
  res.send({echo : req.params.name});
  return next();
}

var PATH = '/:name';
server.get({path: PATH, version: '1.1.3'}, sendV1);
server.get({path: PATH, version: '2.0.0'}, sendV2);

server.listen(8080);
