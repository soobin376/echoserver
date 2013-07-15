var bunyan = require('bunyan');
var restify = require('restify');

var log = bunyan.createLogger({
  name: 'restify echo server',
  level: process.env.LOG_LEVEL || 'info',
  stream: process.stdout,
  serializers: bunyan.stdSerializers
});

var server = restify.createServer({
  log: log,
  name: 'restify echo server'
});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.authorizationParser());
server.use(restify.dateParser());
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.throttle({
  burst: 100,
  rate: 50,
  ip: true, 
  overrides: {
    '127.0.0.1': {
      rate: 0, 
      burst: 0
    }
  }
}));
server.on('after', restify.auditLogger({ log: log }));

server.use(function authenticate(req, res, next) {
  // call redis or something here
  next();
});

server.use(function slowPoke(req, res, next) {
  setTimeout(next.bind(this), parseInt((process.env.SLEEP_TIME || 0), 10));
});

server.post('/echo/:name', function echoParms(req, res, next) {
  req.log(req.params.name);
  res.send(req.params.name);
  next();
});

server.listen(8080, function () {
});
