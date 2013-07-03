var restify = require('restify');

 

var respond = function (request, response, next) {

  var result = {message: 'Hello ' + request.params.name};

  response.send(result);

};

 

var server = restify.createServer();

server.use(restify.bodyParser());

 

server.get('/hello/:name', respond);

server.head('/hello/:name', respond);

 

server.post('/notification', function(request, response, next) {

  var notification = JSON.parse(request.body);

  console.log("notification: " + JSON.stringify(notification));

  console.log("message: " + notification.message);

 

  respond(request, response, next);

});

 

server.listen(8080, function() {

  console.log('%s listening at %s', server.name, server.url);

});



